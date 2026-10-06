import { GoogleGenAI } from '@google/genai';
import { IssueType, AIAnalysisResult, AIExplanation, Incident } from '../src/types/index.js';

const apiKey = process.env.GEMINI_API_KEY || '';

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

export async function analyzeInfrastructureImage(
  base64Data: string,
  mimeType: string = 'image/jpeg',
  userDescription?: string
): Promise<AIAnalysisResult> {
  // If no Gemini API key configured, use transparent fallback
  if (!ai || !apiKey) {
    console.warn('[Gemini] No GEMINI_API_KEY detected in environment. Using transparent heuristic fallback.');
    return fallbackImageAnalysis(userDescription);
  }

  try {
    // Strip header if data URI is passed (e.g. data:image/jpeg;base64,...)
    const cleanBase64 = base64Data.replace(/^data:[a-zA-Z0-9/+-]+;base64,/, '');

    const prompt = `You are CivicVision AI, a municipal infrastructure assessment system.
Analyze the provided image of an urban/civic environment.
Determine whether there is a physical public infrastructure problem.

Select exactly one target category from this list:
- Pothole
- Road Damage
- Broken Streetlight
- Overflowing Drain
- Garbage Accumulation
- Damaged Sidewalk
- Damaged Signage
- Other

Provide a realistic confidence percentage (0-100), estimated damage extent (Minor, Moderate, Severe, Catastrophic),
short factual observations describing visual defects (cracking, depth, water accumulation, physical displacement),
and if clearly localized in the image, an approximate bounding box in normalized percentages (x, y, width, height from 0 to 100).

Return valid JSON adhering to this schema:
{
  "detectedIssue": "Pothole | Road Damage | Broken Streetlight | Overflowing Drain | Garbage Accumulation | Damaged Sidewalk | Damaged Signage | Other",
  "confidence": 88,
  "observations": "Clear, factual 1-2 sentence description of visible defect and immediate physical hazard.",
  "estimatedDamageLevel": "Minor | Moderate | Severe | Catastrophic",
  "hazardClassification": "Brief hazard summary (e.g., Deep asphalt crater, high vehicular puncture risk)",
  "detectedRegions": [
    {
      "x": 20,
      "y": 45,
      "width": 35,
      "height": 30,
      "label": "Deep pothole cavity"
    }
  ]
}

User reported notes: "${userDescription || 'None provided'}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64
            }
          },
          {
            text: prompt
          }
        ]
      },
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text?.trim() || '{}';
    const parsed = JSON.parse(text);

    const validIssues: IssueType[] = [
      'Pothole',
      'Road Damage',
      'Broken Streetlight',
      'Overflowing Drain',
      'Garbage Accumulation',
      'Damaged Sidewalk',
      'Damaged Signage',
      'Other'
    ];

    const detectedIssue: IssueType = validIssues.includes(parsed.detectedIssue)
      ? parsed.detectedIssue
      : 'Road Damage';

    return {
      detectedIssue,
      confidence: typeof parsed.confidence === 'number' ? Math.min(99, Math.max(45, parsed.confidence)) : 88,
      observations: parsed.observations || 'Visible structural defect identified in civic infrastructure.',
      estimatedDamageLevel: ['Minor', 'Moderate', 'Severe', 'Catastrophic'].includes(parsed.estimatedDamageLevel)
        ? parsed.estimatedDamageLevel
        : 'Moderate',
      hazardClassification: parsed.hazardClassification || `${detectedIssue} defect requiring municipal triage`,
      detectedRegions: Array.isArray(parsed.detectedRegions) ? parsed.detectedRegions : [],
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    };
  } catch (err: any) {
    console.error('[Gemini] Vision analysis error:', err?.message || err);
    return fallbackImageAnalysis(userDescription);
  }
}

export async function generateFactualExplanation(incident: Incident): Promise<AIExplanation> {
  const verifiedContext = {
    incidentId: incident.id,
    issueType: incident.issueType,
    severityScore: incident.severityScore,
    severityLevel: incident.severityLevel,
    priorityScore: incident.priorityScore,
    priorityLevel: incident.priorityLevel,
    reportCount: incident.reportCount,
    locationZone: incident.location.zone,
    locationAddress: incident.location.address,
    recurrenceCount: incident.recurrenceCount,
    sourceDescriptions: incident.sourceReports.map((r) => r.description).slice(0, 3)
  };

  if (!ai || !apiKey) {
    return {
      summary: `Priority is ${incident.priorityLevel} (${incident.priorityScore}/100) because of verified ${incident.severityLevel.toLowerCase()} physical damage (${incident.severityScore}/100), ${incident.reportCount} independent citizen report(s), and exposure within a ${incident.location.zone}.`,
      recommendedAction: getRuleBasedAction(incident),
      generatedAt: new Date().toISOString(),
      modelUsed: 'Deterministic Rule Engine (Offline)'
    };
  }

  try {
    const prompt = `You are the CivicVision AI municipal triage explainer.
Turn the following VERIFIED structured incident facts into a readable executive synthesis and recommended maintenance action.

STRICT INSTRUCTIONS:
- You must NOT alter or invent numerical scores (Priority: ${incident.priorityScore}/100, Severity: ${incident.severityScore}/100).
- You must NOT fabricate facts not present in the verified data.
- State clearly why this incident received its priority level based on severity, citizen report volume (${incident.reportCount}), location (${incident.location.zone}), and recurrence (${incident.recurrenceCount}).
- Keep summary to 2-3 concise, professional sentences.
- Provide a direct 1-sentence recommended action for municipal public works dispatch.

VERIFIED INCIDENT FACTS:
${JSON.stringify(verifiedContext, null, 2)}

Return JSON:
{
  "summary": "Concise factual explanation of priority justification.",
  "recommendedAction": "Actionable directive for city public works department."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    return {
      summary: parsed.summary || `Priority is ${incident.priorityLevel} (${incident.priorityScore}/100) due to verified ${incident.severityLevel} severity and ${incident.reportCount} citizen reports.`,
      recommendedAction: parsed.recommendedAction || getRuleBasedAction(incident),
      generatedAt: new Date().toISOString(),
      modelUsed: 'gemini-3.8-flash'
    };
  } catch (err: any) {
    console.error('[Gemini] Explanation generation error:', err?.message || err);
    return {
      summary: `Priority is ${incident.priorityLevel} (${incident.priorityScore}/100) based on verified visual severity (${incident.severityScore}/100), ${incident.reportCount} citizen submissions, and high exposure in ${incident.location.zone}.`,
      recommendedAction: getRuleBasedAction(incident),
      generatedAt: new Date().toISOString(),
      modelUsed: 'Rule Engine Fallback'
    };
  }
}

function fallbackImageAnalysis(userDescription?: string): AIAnalysisResult {
  const desc = (userDescription || '').toLowerCase();

  let detectedIssue: IssueType = 'Pothole';
  let damageLevel: 'Minor' | 'Moderate' | 'Severe' | 'Catastrophic' = 'Moderate';
  let observations = 'Asphalt pavement defect with visible surface cavity and loose aggregate.';
  let hazardClassification = 'Vehicular disruption and wheel impact risk';

  if (desc.includes('drain') || desc.includes('water') || desc.includes('overflow') || desc.includes('sewage')) {
    detectedIssue = 'Overflowing Drain';
    damageLevel = 'Severe';
    observations = 'Stormwater drainage overflow with waterlogging and street runoff.';
    hazardClassification = 'Localized street flooding and sanitation biohazard';
  } else if (desc.includes('light') || desc.includes('lamp') || desc.includes('dark')) {
    detectedIssue = 'Broken Streetlight';
    damageLevel = 'Moderate';
    observations = 'Non-operational luminaire fixture with disconnected power feed or smashed glass.';
    hazardClassification = 'Nocturnal blindspot and pedestrian visibility hazard';
  } else if (desc.includes('garbage') || desc.includes('trash') || desc.includes('waste') || desc.includes('dump')) {
    detectedIssue = 'Garbage Accumulation';
    damageLevel = 'Moderate';
    observations = 'Municipal waste overflow spilling onto public right-of-way.';
    hazardClassification = 'Pedestrian sidewalk obstruction and public hygiene concern';
  } else if (desc.includes('sidewalk') || desc.includes('pavement') || desc.includes('curb') || desc.includes('walkway')) {
    detectedIssue = 'Damaged Sidewalk';
    damageLevel = 'Moderate';
    observations = 'Fractured concrete sidewalk slabs with uneven elevation offset.';
    hazardClassification = 'Pedestrian tripping risk and ADA accessibility impairment';
  } else if (desc.includes('sign') || desc.includes('board') || desc.includes('traffic sign')) {
    detectedIssue = 'Damaged Signage';
    damageLevel = 'Minor';
    observations = 'Bent municipal traffic sign post with partial visual occlusion.';
    hazardClassification = 'Traffic rule ambiguity and intersection visibility concern';
  } else if (desc.includes('crater') || desc.includes('deep') || desc.includes('huge') || desc.includes('tire')) {
    detectedIssue = 'Pothole';
    damageLevel = 'Severe';
    observations = 'Substantial asphalt depression exceeding 10cm depth with perimeter fracture lines.';
    hazardClassification = 'Critical tire rim puncture and motorcycle destabilization hazard';
  }

  return {
    detectedIssue,
    confidence: 86,
    observations,
    estimatedDamageLevel: damageLevel,
    hazardClassification,
    detectedRegions: [
      {
        x: 25,
        y: 35,
        width: 50,
        height: 40,
        label: `${detectedIssue} location area`
      }
    ],
    isRealAiCall: false,
    modelUsed: 'Heuristic Fallback Engine (No GEMINI_API_KEY)'
  };
}

function getRuleBasedAction(incident: Incident): string {
  switch (incident.issueType) {
    case 'Pothole':
      return incident.priorityScore >= 75
        ? 'Dispatch rapid cold-mix asphalt patch unit within 12 hours and place caution stanchions.'
        : 'Schedule routine asphalt leveling in current weekly maintenance cycle.';
    case 'Overflowing Drain':
      return 'Deploy municipal suction jetting truck to clear storm grate and test sewer backflow valve.';
    case 'Broken Streetlight':
      return 'Send electrical utility bucket truck to replace LED driver and inspect underground circuit.';
    case 'Garbage Accumulation':
      return 'Route sanitation compactor truck for bulk debris removal and sanitize surrounding curb.';
    case 'Damaged Sidewalk':
      return 'Erect barrier tape around trip ledge and schedule concrete crew for leveling slab replacement.';
    case 'Damaged Signage':
      return 'Dispatch traffic engineering crew to re-anchor signage pole and ensure retroreflective compliance.';
    default:
      return 'Dispatch municipal inspection officer to verify site conditions and assign maintenance order.';
  }
}
