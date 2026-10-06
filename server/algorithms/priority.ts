import {
  PriorityCalculation,
  PriorityLevel,
  PriorityWeights,
  LocationContext,
  IssueType
} from '../../src/types/index.js';

export const DEFAULT_PRIORITY_WEIGHTS: PriorityWeights = {
  severityWeight: 0.40,
  reportsCountWeight: 0.20,
  locationWeight: 0.15,
  recurrenceWeight: 0.10,
  publicImpactWeight: 0.15
};

export interface PriorityInput {
  severityScore: number;
  reportCount: number;
  locationZone: LocationContext;
  recurrenceCount: number;
  issueType: IssueType;
  weights?: Partial<PriorityWeights>;
}

export function calculateDeterministicPriority(input: PriorityInput): PriorityCalculation {
  const weights: PriorityWeights = {
    ...DEFAULT_PRIORITY_WEIGHTS,
    ...(input.weights || {})
  };

  // 1. Severity sub-score (0-100)
  const severitySubScore = Math.max(0, Math.min(100, input.severityScore));

  // 2. Report count sub-score (0-100)
  // 1 report is 40pts, 2 is 65pts, 3 is 80pts, 4 is 92pts, 5+ is 100pts
  let reportSubScore = 40;
  if (input.reportCount === 2) reportSubScore = 65;
  else if (input.reportCount === 3) reportSubScore = 80;
  else if (input.reportCount === 4) reportSubScore = 92;
  else if (input.reportCount >= 5) reportSubScore = 100;

  // 3. Location context score (0-100)
  const zoneScoreMap: Record<LocationContext, number> = {
    'Hospital Corridor': 100,
    'School Zone': 95,
    'Arterial Road': 90,
    'Transit Hub': 85,
    'Commercial Center': 72,
    'Residential Area': 55,
    'Alleyway / Minor Street': 35
  };
  const locationSubScore = zoneScoreMap[input.locationZone] || 50;

  // 4. Recurrence score (0-100)
  let recurrenceSubScore = 20;
  if (input.recurrenceCount === 1) recurrenceSubScore = 55;
  else if (input.recurrenceCount === 2) recurrenceSubScore = 80;
  else if (input.recurrenceCount >= 3) recurrenceSubScore = 100;

  // 5. Public impact score (0-100)
  // Combines traffic risk and environmental impact
  const hazardImpactMap: Record<IssueType, number> = {
    'Overflowing Drain': 88,
    'Pothole': 82,
    'Road Damage': 78,
    'Broken Streetlight': 68,
    'Damaged Signage': 70,
    'Damaged Sidewalk': 60,
    'Garbage Accumulation': 58,
    'Other': 45
  };
  const baseImpact = hazardImpactMap[input.issueType] || 50;
  const zoneBoost = locationSubScore > 80 ? 12 : 0;
  const publicImpactSubScore = Math.min(100, baseImpact + zoneBoost);

  // Calculate weighted sum
  const totalWeight =
    weights.severityWeight +
    weights.reportsCountWeight +
    weights.locationWeight +
    weights.recurrenceWeight +
    weights.publicImpactWeight;

  const rawScore =
    (severitySubScore * weights.severityWeight +
      reportSubScore * weights.reportsCountWeight +
      locationSubScore * weights.locationWeight +
      recurrenceSubScore * weights.recurrenceWeight +
      publicImpactSubScore * weights.publicImpactWeight) /
    (totalWeight || 1.0);

  const score = Math.max(5, Math.min(100, Math.round(rawScore)));

  // Priority Level thresholds
  let level: PriorityLevel = 'Low';
  if (score >= 80) {
    level = 'Critical';
  } else if (score >= 60) {
    level = 'High';
  } else if (score >= 40) {
    level = 'Medium';
  } else {
    level = 'Low';
  }

  const factors = [
    {
      factor: 'Visual & Structural Severity',
      weight: weights.severityWeight,
      score: severitySubScore,
      contribution: Math.round(severitySubScore * weights.severityWeight),
      explanation: `Calculated severity score ${severitySubScore}/100 based on physical damage metrics.`
    },
    {
      factor: 'Citizen Corroboration & Report Count',
      weight: weights.reportsCountWeight,
      score: reportSubScore,
      contribution: Math.round(reportSubScore * weights.reportsCountWeight),
      explanation: `${input.reportCount} independent citizen report${input.reportCount > 1 ? 's' : ''} logged.`
    },
    {
      factor: 'Critical Location & Transit Density',
      weight: weights.locationWeight,
      score: locationSubScore,
      contribution: Math.round(locationSubScore * weights.locationWeight),
      explanation: `Situated within a designated ${input.locationZone} (${locationSubScore}/100 exposure).`
    },
    {
      factor: 'Chronic Recurrence History',
      weight: weights.recurrenceWeight,
      score: recurrenceSubScore,
      contribution: Math.round(recurrenceSubScore * weights.recurrenceWeight),
      explanation: `${input.recurrenceCount} previous documented issue${input.recurrenceCount === 1 ? '' : 's'} at this spatial cluster.`
    },
    {
      factor: 'Public Safety & Transit Impact',
      weight: weights.publicImpactWeight,
      score: publicImpactSubScore,
      contribution: Math.round(publicImpactSubScore * weights.publicImpactWeight),
      explanation: `Estimated transit interruption and public safety exposure: ${publicImpactSubScore}/100.`
    }
  ];

  return {
    score,
    level,
    factors
  };
}
