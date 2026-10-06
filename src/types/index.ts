export type IssueType =
  | 'Pothole'
  | 'Road Damage'
  | 'Broken Streetlight'
  | 'Overflowing Drain'
  | 'Garbage Accumulation'
  | 'Damaged Sidewalk'
  | 'Damaged Signage'
  | 'Other';

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';
export type IncidentStatus = 'Pending' | 'Verified' | 'Assigned' | 'In Progress' | 'Resolved';

export type LocationContext =
  | 'School Zone'
  | 'Hospital Corridor'
  | 'Arterial Road'
  | 'Transit Hub'
  | 'Commercial Center'
  | 'Residential Area'
  | 'Alleyway / Minor Street';

export interface BoundingBox {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  width: number;
  height: number;
  label: string;
}

export interface AIAnalysisResult {
  detectedIssue: IssueType;
  confidence: number; // 0 - 100
  observations: string;
  detectedRegions?: BoundingBox[];
  estimatedDamageLevel: 'Minor' | 'Moderate' | 'Severe' | 'Catastrophic';
  hazardClassification: string;
  isRealAiCall: boolean;
  modelUsed?: string;
}

export interface ContributingSeverityFactor {
  factor: string;
  impact: number; // percentage or points
  description: string;
}

export interface SeverityCalculation {
  score: number; // 0 - 100
  level: SeverityLevel;
  contributingFactors: ContributingSeverityFactor[];
}

export type LocationSource = 'gps' | 'manual' | 'demo';

export interface LocationData {
  lat: number;
  lng: number;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  source: LocationSource;
  locationSource?: LocationSource;
  zone: LocationContext;
  landmark?: string;
}

export interface CitizenReport {
  id: string; // e.g. REP-2026-101
  timestamp: string;
  imageUrl: string;
  videoUrl?: string;
  description: string;
  location: LocationData;
  locationSource?: LocationSource;
  aiAnalysis: AIAnalysisResult;
  severity: SeverityCalculation;
  linkedIncidentId?: string;
  isDuplicate?: boolean;
  duplicateProbability?: number;
  matchingFactors?: string[];
  status: IncidentStatus;
  isDemo?: boolean;
}

export interface PriorityFactor {
  factor: string;
  weight: number; // e.g. 0.40 for 40%
  score: number; // 0 - 100
  contribution: number; // weight * score
  explanation: string;
}

export interface PriorityCalculation {
  score: number; // 0 - 100
  level: PriorityLevel;
  factors: PriorityFactor[];
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  status: IncidentStatus;
  actor: string; // e.g. "AI Ingestion Engine", "Civil Engineer Mark (District 4)", "Field Maintenance Crew #3"
  notes: string;
}

export interface AIExplanation {
  summary: string;
  recommendedAction: string;
  generatedAt: string;
  modelUsed: string;
}

export interface Incident {
  id: string; // e.g. INC-2026-42
  issueType: IssueType;
  title: string;
  location: LocationData;
  severityScore: number;
  severityLevel: SeverityLevel;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  priorityFactors: PriorityFactor[];
  reportCount: number;
  sourceReportIds: string[];
  sourceReports: CitizenReport[];
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  recurrenceCount: number; // Prior logged complaints in same 50m radius
  aiExplanation: AIExplanation;
  timeline: IncidentTimelineEvent[];
  assignedCrew?: string;
  resolutionNotes?: string;
  isDemo?: boolean;
}

export interface PriorityWeights {
  severityWeight: number; // default 0.40
  reportsCountWeight: number; // default 0.20
  locationWeight: number; // default 0.15
  recurrenceWeight: number; // default 0.10
  publicImpactWeight: number; // default 0.15
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  duplicateProbability: number; // 0 - 100%
  matchedIncidentId?: string;
  matchedIncident?: Incident;
  matchingFactors: string[];
  distanceMeters: number;
}
