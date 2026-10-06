import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { store } from './server/data/store.js';
import { analyzeInfrastructureImage } from './server/gemini.js';
import { reverseGeocodeCoordinates } from './server/geocoding.js';
import { IssueType, SeverityLevel, PriorityLevel, IncidentStatus } from './src/types/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Enable large JSON payload for base64 image/video frames
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// Reverse Geocoding Route
app.get('/api/reverse-geocode', async (req: Request, res: Response) => {
  try {
    const lat = parseFloat(req.query.lat as string);
    const lng = parseFloat(req.query.lng as string);

    if (isNaN(lat) || isNaN(lng)) {
      res.status(400).json({ success: false, error: 'Valid lat and lng numeric query parameters required' });
      return;
    }

    const geo = await reverseGeocodeCoordinates(lat, lng);
    res.json({ success: true, ...geo });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message || 'Geocoding failed' });
  }
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'CivicVision AI API Engine',
    timestamp: new Date().toISOString()
  });
});

// Incidents list with filters
app.get('/api/incidents', (req: Request, res: Response) => {
  try {
    let incidents = store.getAllIncidents();

    const { issueType, severity, priority, status, search } = req.query;

    if (issueType && issueType !== 'All') {
      incidents = incidents.filter((i) => i.issueType === issueType);
    }
    if (severity && severity !== 'All') {
      incidents = incidents.filter((i) => i.severityLevel === severity);
    }
    if (priority && priority !== 'All') {
      incidents = incidents.filter((i) => i.priorityLevel === priority);
    }
    if (status && status !== 'All') {
      incidents = incidents.filter((i) => i.status === status);
    }
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      incidents = incidents.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.location.address.toLowerCase().includes(q) ||
          i.location.zone.toLowerCase().includes(q) ||
          i.issueType.toLowerCase().includes(q)
      );
    }

    res.json({ success: true, count: incidents.length, incidents });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Incident detail
app.get('/api/incidents/:id', (req: Request, res: Response) => {
  try {
    const incident = store.getIncidentById(req.params.id);
    if (!incident) {
      res.status(404).json({ success: false, error: 'Incident not found' });
      return;
    }
    res.json({ success: true, incident });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update Incident Status
app.post('/api/incidents/:id/status', (req: Request, res: Response) => {
  try {
    const { status, notes, actor, assignedCrew } = req.body;
    if (!status) {
      res.status(400).json({ success: false, error: 'Missing target status' });
      return;
    }

    const updated = store.updateIncidentStatus(
      req.params.id,
      status as IncidentStatus,
      notes,
      actor || 'Municipal Authority Officer',
      assignedCrew
    );

    if (!updated) {
      res.status(404).json({ success: false, error: 'Incident not found' });
      return;
    }

    res.json({ success: true, incident: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Citizen reports list
app.get('/api/reports', (req: Request, res: Response) => {
  try {
    const reports = store.getAllReports();
    res.json({ success: true, count: reports.length, reports });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Citizen report detail
app.get('/api/reports/:id', (req: Request, res: Response) => {
  try {
    const report = store.getReportById(req.params.id);
    if (!report) {
      res.status(404).json({ success: false, error: 'Report not found' });
      return;
    }
    res.json({ success: true, report });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Multimodal AI Image Analysis Endpoint
app.post('/api/reports/analyze', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', description } = req.body;
    if (!imageBase64) {
      res.status(400).json({ success: false, error: 'Missing imageBase64 data' });
      return;
    }

    const result = await analyzeInfrastructureImage(imageBase64, mimeType, description);
    res.json({ success: true, analysis: result });
  } catch (err: any) {
    console.error('[API /analyze error]:', err);
    res.status(500).json({ success: false, error: err?.message || 'Vision analysis failed' });
  }
});

// Video Frames Multi-Frame Analysis Endpoint
app.post('/api/reports/video-frames-analyze', async (req: Request, res: Response) => {
  try {
    const { frames, description } = req.body;
    if (!Array.isArray(frames) || frames.length === 0) {
      res.status(400).json({ success: false, error: 'Expected non-empty array of video frames' });
      return;
    }

    // Limit to max 4 representative keyframes for efficiency
    const selectedFrames = frames.slice(0, 4);
    const frameAnalyses = [];

    for (let i = 0; i < selectedFrames.length; i++) {
      const f = selectedFrames[i];
      const base64 = typeof f === 'string' ? f : f.base64;
      if (base64) {
        const analysis = await analyzeInfrastructureImage(
          base64,
          'image/jpeg',
          `${description || ''} (Video Frame #${i + 1})`
        );
        frameAnalyses.push(analysis);
      }
    }

    if (frameAnalyses.length === 0) {
      res.status(400).json({ success: false, error: 'No valid frames analyzed' });
      return;
    }

    // Aggregate detections across frames without creating separate incidents
    // Select the detection with highest confidence or most severe damage
    const sorted = [...frameAnalyses].sort((a, b) => b.confidence - a.confidence);
    const primary = sorted[0];

    const aggregatedAnalysis = {
      ...primary,
      observations: `Video analysis across ${frameAnalyses.length} extracted keyframes: ${primary.observations}`,
      keyframeDetections: frameAnalyses.map((fa, idx) => ({
        frameIndex: idx + 1,
        issue: fa.detectedIssue,
        confidence: fa.confidence,
        damageLevel: fa.estimatedDamageLevel
      }))
    };

    res.json({ success: true, analysis: aggregatedAnalysis });
  } catch (err: any) {
    console.error('[API /video-frames-analyze error]:', err);
    res.status(500).json({ success: false, error: err?.message || 'Video frame analysis failed' });
  }
});

// Submit Citizen Report (Runs Duplicate Detection, Severity, Consolidation, Priority, AI Explanation)
app.post('/api/reports/submit', async (req: Request, res: Response) => {
  try {
    const { imageUrl, videoUrl, description, location, aiAnalysis } = req.body;

    if (!imageUrl && !videoUrl) {
      res.status(400).json({ success: false, error: 'Visual evidence (image or video) is required' });
      return;
    }
    if (!description || description.trim().length === 0) {
      res.status(400).json({ success: false, error: 'Description is required' });
      return;
    }
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      res.status(400).json({ success: false, error: 'Valid geographic location (lat, lng) is required' });
      return;
    }
    if (!aiAnalysis || !aiAnalysis.detectedIssue) {
      res.status(400).json({ success: false, error: 'AI analysis results must be attached' });
      return;
    }

    const result = await store.ingestCitizenReport({
      imageUrl,
      videoUrl,
      description,
      location,
      aiAnalysis
    });

    res.json({
      success: true,
      report: result.report,
      incident: result.incident,
      isDuplicate: result.isDuplicate,
      duplicateProbability: result.duplicateProbability,
      matchingFactors: result.matchingFactors
    });
  } catch (err: any) {
    console.error('[API /reports/submit error]:', err);
    res.status(500).json({ success: false, error: err?.message || 'Report ingestion failed' });
  }
});

// Priority Weights Configuration API
app.get('/api/config/weights', (req: Request, res: Response) => {
  res.json({ success: true, weights: store.getWeights() });
});

app.post('/api/config/weights', (req: Request, res: Response) => {
  try {
    const { weights } = req.body;
    if (!weights) {
      res.status(400).json({ success: false, error: 'Missing weights payload' });
      return;
    }
    const updated = store.updateWeights(weights);
    res.json({ success: true, weights: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reset Database to Demo State
app.post('/api/reset-demo', (req: Request, res: Response) => {
  try {
    const reset = store.resetToDemo();
    res.json({
      success: true,
      message: 'Database reset to default demo dataset',
      incidentsCount: reset.incidents.length,
      reportsCount: reset.reports.length
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// VITE OR STATIC FRONTEND INTEGRATION
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CivicVision AI] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Startup Failure]:', err);
});
