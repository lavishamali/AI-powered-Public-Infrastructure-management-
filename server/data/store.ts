import fs from 'fs';
import path from 'path';
import {
  Incident,
  CitizenReport,
  PriorityWeights,
  IncidentStatus,
  LocationData,
  AIAnalysisResult,
  IssueType
} from '../../src/types/index.js';
import { generateDemoIncidentsAndReports } from './demoData.js';
import { calculateDeterministicSeverity } from '../algorithms/severity.js';
import { detectDuplicateIncident } from '../algorithms/duplicates.js';
import { calculateDeterministicPriority, DEFAULT_PRIORITY_WEIGHTS } from '../algorithms/priority.js';
import { generateFactualExplanation } from '../gemini.js';

interface DatabaseSchema {
  incidents: Incident[];
  reports: CitizenReport[];
  weights: PriorityWeights;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'civicvision-db.json');

class DataStore {
  private incidents: Incident[] = [];
  private reports: CitizenReport[] = [];
  private weights: PriorityWeights = { ...DEFAULT_PRIORITY_WEIGHTS };
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const data: DatabaseSchema = JSON.parse(raw);
        this.incidents = data.incidents || [];
        this.reports = data.reports || [];
        this.weights = data.weights || { ...DEFAULT_PRIORITY_WEIGHTS };
        console.log(`[Store] Loaded ${this.incidents.length} incidents and ${this.reports.length} reports from disk.`);
      } else {
        this.resetToDemo();
      }
    } catch (err) {
      console.warn('[Store] Could not read db file, initializing with demo data:', err);
      this.resetToDemo();
    }
    this.initialized = true;
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      const data: DatabaseSchema = {
        incidents: this.incidents,
        reports: this.reports,
        weights: this.weights
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Store] Failed to write database file:', err);
    }
  }

  public resetToDemo(): { incidents: Incident[]; reports: CitizenReport[] } {
    const demo = generateDemoIncidentsAndReports(this.weights);
    this.incidents = demo.incidents;
    this.reports = demo.reports;
    this.weights = { ...DEFAULT_PRIORITY_WEIGHTS };
    this.persist();
    console.log('[Store] Reset database to default demo dataset.');
    return { incidents: this.incidents, reports: this.reports };
  }

  public getWeights(): PriorityWeights {
    return { ...this.weights };
  }

  public updateWeights(newWeights: Partial<PriorityWeights>): PriorityWeights {
    this.weights = { ...this.weights, ...newWeights };

    // Recalculate priority scores across all active incidents with new weights
    for (const incident of this.incidents) {
      const calc = calculateDeterministicPriority({
        severityScore: incident.severityScore,
        reportCount: incident.reportCount,
        locationZone: incident.location.zone,
        recurrenceCount: incident.recurrenceCount,
        issueType: incident.issueType,
        weights: this.weights
      });
      incident.priorityScore = calc.score;
      incident.priorityLevel = calc.level;
      incident.priorityFactors = calc.factors;
    }

    this.persist();
    return { ...this.weights };
  }

  public getAllIncidents(): Incident[] {
    // Sort primarily by Priority Score descending (highest urgency first)
    return [...this.incidents].sort((a, b) => b.priorityScore - a.priorityScore);
  }

  public getIncidentById(id: string): Incident | null {
    return this.incidents.find((inc) => inc.id === id) || null;
  }

  public getAllReports(): CitizenReport[] {
    return [...this.reports].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  public getReportById(id: string): CitizenReport | null {
    return this.reports.find((r) => r.id === id) || null;
  }

  public updateIncidentStatus(
    id: string,
    newStatus: IncidentStatus,
    notes?: string,
    actor: string = 'Municipal Authority',
    assignedCrew?: string
  ): Incident | null {
    const incident = this.incidents.find((inc) => inc.id === id);
    if (!incident) return null;

    incident.status = newStatus;
    incident.updatedAt = new Date().toISOString();
    if (assignedCrew) {
      incident.assignedCrew = assignedCrew;
    }
    if (newStatus === 'Resolved' && notes) {
      incident.resolutionNotes = notes;
    }

    // Add timeline event
    incident.timeline.push({
      id: `TL-${incident.id}-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: newStatus,
      actor,
      notes: notes || `Status updated to ${newStatus}`
    });

    // Also update all linked source reports' status
    for (const repId of incident.sourceReportIds) {
      const rep = this.reports.find((r) => r.id === repId);
      if (rep) {
        rep.status = newStatus;
      }
    }

    this.persist();
    return incident;
  }

  public async ingestCitizenReport(params: {
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
    const timestamp = new Date().toISOString();
    const reportId = `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Calculate deterministic severity
    const severity = calculateDeterministicSeverity({
      issueType: params.aiAnalysis.detectedIssue,
      damageLevel: params.aiAnalysis.estimatedDamageLevel,
      observations: params.aiAnalysis.observations,
      zone: params.location.zone,
      confidence: params.aiAnalysis.confidence
    });

    // 2. Multi-signal duplicate detection against existing unresolved incidents
    const duplicateResult = detectDuplicateIncident(
      {
        issueType: params.aiAnalysis.detectedIssue,
        description: params.description,
        lat: params.location.lat,
        lng: params.location.lng
      },
      this.incidents
    );

    let incident: Incident;
    let isDuplicate = false;
    let duplicateProbability = 0;
    let matchingFactors: string[] = [];

    if (duplicateResult.isDuplicate && duplicateResult.matchedIncidentId) {
      // CONSOLIDATE into existing incident!
      isDuplicate = true;
      duplicateProbability = duplicateResult.duplicateProbability;
      matchingFactors = duplicateResult.matchingFactors;

      const matched = this.incidents.find((inc) => inc.id === duplicateResult.matchedIncidentId)!;
      matched.reportCount += 1;
      matched.sourceReportIds.push(reportId);
      matched.updatedAt = timestamp;

      // Update severity if incoming report detected more severe physical damage
      if (severity.score > matched.severityScore) {
        matched.severityScore = severity.score;
        matched.severityLevel = severity.level;
      }

      // Recalculate priority score with updated report count and updated severity
      const priorityCalc = calculateDeterministicPriority({
        severityScore: matched.severityScore,
        reportCount: matched.reportCount,
        locationZone: matched.location.zone,
        recurrenceCount: matched.recurrenceCount,
        issueType: matched.issueType,
        weights: this.weights
      });

      matched.priorityScore = priorityCalc.score;
      matched.priorityLevel = priorityCalc.level;
      matched.priorityFactors = priorityCalc.factors;

      // Add timeline event
      matched.timeline.push({
        id: `TL-${matched.id}-${Date.now()}`,
        timestamp,
        status: matched.status,
        actor: 'CivicVision Consolidation Engine',
        notes: `Corroborating citizen report #${reportId} consolidated (${duplicateProbability}% duplicate confidence, ${duplicateResult.distanceMeters}m proximity). Priority recalculated to ${matched.priorityScore}.`
      });

      // Update AI factual explanation
      matched.aiExplanation = await generateFactualExplanation(matched);

      incident = matched;
    } else {
      // CREATE NEW INCIDENT
      const incidentId = `INC-2026-${Math.floor(100 + Math.random() * 900)}`;

      // Initial priority calculation (reportCount = 1)
      const priorityCalc = calculateDeterministicPriority({
        severityScore: severity.score,
        reportCount: 1,
        locationZone: params.location.zone,
        recurrenceCount: 0,
        issueType: params.aiAnalysis.detectedIssue,
        weights: this.weights
      });

      const tempIncident: Incident = {
        id: incidentId,
        issueType: params.aiAnalysis.detectedIssue,
        title: `${params.aiAnalysis.detectedIssue} at ${params.location.address || params.location.landmark || 'Reported Location'}`,
        location: params.location,
        severityScore: severity.score,
        severityLevel: severity.level,
        priorityScore: priorityCalc.score,
        priorityLevel: priorityCalc.level,
        priorityFactors: priorityCalc.factors,
        reportCount: 1,
        sourceReportIds: [reportId],
        sourceReports: [],
        status: 'Pending',
        createdAt: timestamp,
        updatedAt: timestamp,
        recurrenceCount: 0,
        aiExplanation: {
          summary: '',
          recommendedAction: '',
          generatedAt: timestamp,
          modelUsed: 'gemini-3.8-flash'
        },
        timeline: [
          {
            id: `TL-${incidentId}-1`,
            timestamp,
            status: 'Pending',
            actor: 'Citizen Ingestion Pipeline',
            notes: `Initial citizen report #${reportId} registered. AI detected ${params.aiAnalysis.detectedIssue} with ${params.aiAnalysis.confidence}% confidence.`
          }
        ],
        isDemo: false
      };

      tempIncident.aiExplanation = await generateFactualExplanation(tempIncident);
      this.incidents.unshift(tempIncident);
      incident = tempIncident;
    }

    // Create the CitizenReport object
    const newReport: CitizenReport = {
      id: reportId,
      timestamp,
      imageUrl: params.imageUrl,
      videoUrl: params.videoUrl,
      description: params.description,
      location: params.location,
      aiAnalysis: params.aiAnalysis,
      severity,
      linkedIncidentId: incident.id,
      isDuplicate,
      duplicateProbability,
      matchingFactors,
      status: incident.status,
      isDemo: false
    };

    // Link report in incident and store
    incident.sourceReports.push(newReport);
    this.reports.unshift(newReport);

    this.persist();

    return {
      report: newReport,
      incident,
      isDuplicate,
      duplicateProbability,
      matchingFactors
    };
  }
}

export const store = new DataStore();
