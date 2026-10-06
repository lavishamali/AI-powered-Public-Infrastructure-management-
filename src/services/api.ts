import {
  Incident,
  CitizenReport,
  AIAnalysisResult,
  LocationData,
  PriorityWeights,
  IncidentStatus
} from '../types/index.js';

export async function fetchIncidents(filters?: {
  issueType?: string;
  severity?: string;
  priority?: string;
  status?: string;
  search?: string;
}): Promise<Incident[]> {
  const params = new URLSearchParams();
  if (filters?.issueType) params.append('issueType', filters.issueType);
  if (filters?.severity) params.append('severity', filters.severity);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const res = await fetch(`/api/incidents?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch incidents');
  const data = await res.json();
  return data.incidents || [];
}

export async function fetchIncidentById(id: string): Promise<Incident> {
  const res = await fetch(`/api/incidents/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Failed to fetch incident details');
  const data = await res.json();
  return data.incident;
}

export async function updateIncidentStatus(
  id: string,
  payload: {
    status: IncidentStatus;
    notes?: string;
    actor?: string;
    assignedCrew?: string;
  }
): Promise<Incident> {
  const res = await fetch(`/api/incidents/${encodeURIComponent(id)}/status`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to update incident status');
  const data = await res.json();
  return data.incident;
}

export async function fetchReports(): Promise<CitizenReport[]> {
  const res = await fetch('/api/reports');
  if (!res.ok) throw new Error('Failed to fetch reports');
  const data = await res.json();
  return data.reports || [];
}

export async function fetchReportById(id: string): Promise<CitizenReport> {
  const res = await fetch(`/api/reports/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error('Failed to fetch report');
  const data = await res.json();
  return data.report;
}

export async function analyzeImage(params: {
  imageBase64: string;
  mimeType?: string;
  description?: string;
}): Promise<AIAnalysisResult> {
  const res = await fetch('/api/reports/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Vision analysis failed');
  }
  const data = await res.json();
  return data.analysis;
}

export async function analyzeVideoFrames(params: {
  frames: Array<{ base64: string; timestampMs: number }>;
  description?: string;
}): Promise<AIAnalysisResult & { keyframeDetections?: any[] }> {
  const res = await fetch('/api/reports/video-frames-analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Video analysis failed');
  }
  const data = await res.json();
  return data.analysis;
}

export async function submitCitizenReport(payload: {
  imageUrl: string;
  videoUrl?: string;
  description: string;
  location: LocationData;
  aiAnalysis: AIAnalysisResult;
}): Promise<{
  report: CitizenReport;
  incident: Incident;
  isDuplicate: boolean;
  duplicateProbability: number;
  matchingFactors: string[];
}> {
  const res = await fetch('/api/reports/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Submission failed');
  }
  return res.json();
}

export async function fetchPriorityWeights(): Promise<PriorityWeights> {
  const res = await fetch('/api/config/weights');
  if (!res.ok) throw new Error('Failed to fetch weights');
  const data = await res.json();
  return data.weights;
}

export async function updatePriorityWeights(weights: Partial<PriorityWeights>): Promise<PriorityWeights> {
  const res = await fetch('/api/config/weights', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ weights })
  });
  if (!res.ok) throw new Error('Failed to update weights');
  const data = await res.json();
  return data.weights;
}

export async function resetDemoDatabase(): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/reset-demo', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to reset demo data');
  return res.json();
}

export async function reverseGeocode(
  lat: number,
  lng: number
): Promise<{
  lat: number;
  lng: number;
  city: string;
  state: string;
  country: string;
  address: string;
  isIndia: boolean;
}> {
  const res = await fetch(`/api/reverse-geocode?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
  if (!res.ok) throw new Error('Failed to reverse geocode location');
  return res.json();
}
