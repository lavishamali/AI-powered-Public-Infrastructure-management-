import { IssueType, SeverityCalculation, SeverityLevel, LocationContext } from '../../src/types/index.js';

interface SeverityInput {
  issueType: IssueType;
  damageLevel: 'Minor' | 'Moderate' | 'Severe' | 'Catastrophic';
  observations?: string;
  zone?: LocationContext;
  confidence?: number;
}

export function calculateDeterministicSeverity(input: SeverityInput): SeverityCalculation {
  const { issueType, damageLevel, zone = 'Residential Area' } = input;

  // 1. Baseline inherent hazard by infrastructure type (0 - 100)
  const baselineHazardMap: Record<IssueType, { base: number; rationale: string }> = {
    'Pothole': { base: 65, rationale: 'High risk of vehicular loss of control, rim damage, and two-wheeler falls' },
    'Road Damage': { base: 60, rationale: 'Structural road failure creating lane obstruction and driver evasion risks' },
    'Broken Streetlight': { base: 45, rationale: 'Loss of nocturnal visibility elevating crime vulnerability and pedestrian danger' },
    'Overflowing Drain': { base: 70, rationale: 'Biohazard pathogen exposure, urban localized flash flooding, and water logging' },
    'Garbage Accumulation': { base: 42, rationale: 'Vector-borne pest proliferation, sanitary hazard, and drainage blockage' },
    'Damaged Sidewalk': { base: 52, rationale: 'Severe trip hazard and ADA/disability wheelchair accessibility blockage' },
    'Damaged Signage': { base: 55, rationale: 'Traffic control ambiguity, navigation confusion, and intersection collision risk' },
    'Other': { base: 35, rationale: 'General non-classified municipal maintenance request' }
  };

  const baseline = baselineHazardMap[issueType] || { base: 40, rationale: 'General municipal maintenance hazard' };

  // 2. Visual damage extent modifier (-25 to +25)
  const damageModifiers: Record<'Minor' | 'Moderate' | 'Severe' | 'Catastrophic', { mod: number; rationale: string }> = {
    'Minor': { mod: -15, rationale: 'Surface-level cosmetic defect without structural deformation' },
    'Moderate': { mod: 0, rationale: 'Noticable infrastructure disruption requiring standard repair' },
    'Severe': { mod: 18, rationale: 'Deep structural fissures, active water leakage, or extensive obstruction' },
    'Catastrophic': { mod: 28, rationale: 'Complete infrastructural collapse, immediate high-risk threat to life or property' }
  };

  const damageMod = damageModifiers[damageLevel] || { mod: 0, rationale: 'Standard damage profile' };

  // 3. Location context vulnerability modifier (-5 to +15)
  const zoneModifiers: Record<LocationContext, { mod: number; rationale: string }> = {
    'School Zone': { mod: 14, rationale: 'High concentration of vulnerable child pedestrians and peak-hour crossing traffic' },
    'Hospital Corridor': { mod: 15, rationale: 'Critical ambulance transit path requiring zero delay or obstruction' },
    'Arterial Road': { mod: 12, rationale: 'High-speed multilane corridor with heavy vehicular throughput' },
    'Transit Hub': { mod: 10, rationale: 'Extremely high pedestrian footfall and intermodal bus/metro transit' },
    'Commercial Center': { mod: 6, rationale: 'Dense retail traffic and frequent commercial loading/unloading' },
    'Residential Area': { mod: 2, rationale: 'Local neighborhood traffic and residential pedestrian presence' },
    'Alleyway / Minor Street': { mod: -4, rationale: 'Low-speed secondary access way with restricted traffic density' }
  };

  const zoneMod = zoneModifiers[zone] || { mod: 0, rationale: 'Standard municipal zone' };

  // Calculate composite score (clamped 0 - 100)
  const rawScore = baseline.base + damageMod.mod + zoneMod.mod;
  const score = Math.max(5, Math.min(100, Math.round(rawScore)));

  // Determine Severity Level
  let level: SeverityLevel = 'Low';
  if (score >= 80) {
    level = 'Critical';
  } else if (score >= 60) {
    level = 'High';
  } else if (score >= 40) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  const contributingFactors = [
    {
      factor: 'Inherent Infrastructure Hazard',
      impact: baseline.base,
      description: `${issueType}: ${baseline.rationale} (Baseline: ${baseline.base}/100)`
    },
    {
      factor: 'Visual Damage Extent',
      impact: damageMod.mod,
      description: `${damageLevel} damage assessment: ${damageMod.rationale} (${damageMod.mod >= 0 ? '+' : ''}${damageMod.mod} pts)`
    },
    {
      factor: 'Vulnerability of Location',
      impact: zoneMod.mod,
      description: `${zone}: ${zoneMod.rationale} (${zoneMod.mod >= 0 ? '+' : ''}${zoneMod.mod} pts)`
    }
  ];

  return {
    score,
    level,
    contributingFactors
  };
}
