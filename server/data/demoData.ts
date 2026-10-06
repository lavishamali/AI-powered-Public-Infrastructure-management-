import { Incident, CitizenReport, PriorityWeights } from '../../src/types/index.js';

export function generateDemoIncidentsAndReports(weights?: PriorityWeights): {
  incidents: Incident[];
  reports: CitizenReport[];
} {
  // Center: Indore, Madhya Pradesh, India (India's cleanest city, premier civic infrastructure monitoring hub)
  const baseLat = 22.7196;
  const baseLng = 75.8577;

  // 1. INC-101: Critical School Zone Pothole (Consolidated 4 reports)
  const rep201: CitizenReport = {
    id: 'REP-2026-201',
    timestamp: '2026-10-04T08:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Huge pothole right outside Indore Public School gate on AB Road. Auto-rickshaw scraped its axle dropping off students.',
    location: {
      lat: baseLat + 0.0035,
      lng: baseLng - 0.0028,
      address: 'Near IPS Gate 1, AB Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'Indore Public School'
    },
    aiAnalysis: {
      detectedIssue: 'Pothole',
      confidence: 96,
      observations: 'Substantial asphalt depression (~14cm depth, 65cm width) with jagged aggregate edges directly in primary school dropoff lane.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Severe vehicular rim impact and student crossing danger',
      detectedRegions: [{ x: 22, y: 38, width: 56, height: 42, label: 'Deep asphalt cavity' }],
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 88,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 65, description: 'Pothole on active transit corridor' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe cratering with exposed base gravel' },
        { factor: 'Zone Vulnerability', impact: 14, description: 'School Zone: Child pedestrian vulnerability' }
      ]
    },
    linkedIncidentId: 'INC-2026-101',
    status: 'Verified',
    isDemo: true
  };

  const rep202: CitizenReport = {
    id: 'REP-2026-202',
    timestamp: '2026-10-04T09:40:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'Deep road crater on AB Road by the school zebra crossing. Two-wheeler skidded this morning.',
    location: {
      lat: baseLat + 0.0036,
      lng: baseLng - 0.0027,
      address: 'AB Road near IPS Pedestrian Crossing',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'IPS Pedestrian Crossing'
    },
    aiAnalysis: {
      detectedIssue: 'Pothole',
      confidence: 94,
      observations: 'Pothole along pedestrian crossing approach with severe asphalt loss and loose gravel.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Two-wheeler spill hazard and rim deformation',
      detectedRegions: [{ x: 28, y: 40, width: 48, height: 38, label: 'Road crater' }],
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 87,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 65, description: 'Pothole baseline hazard' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe road surface puncture' },
        { factor: 'Zone Vulnerability', impact: 14, description: 'School Zone proximity' }
      ]
    },
    linkedIncidentId: 'INC-2026-101',
    isDuplicate: true,
    duplicateProbability: 95,
    matchingFactors: [
      'Geospatial proximity: 18m from INC-2026-101',
      'Identical hazard type: Pothole',
      'Corroborating landmarks: "school", "AB Road"'
    ],
    status: 'Verified',
    isDemo: true
  };

  const rep203: CitizenReport = {
    id: 'REP-2026-203',
    timestamp: '2026-10-04T13:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Broken pavement crater outside school gate 2. Muddy water pooling inside.',
    location: {
      lat: baseLat + 0.0034,
      lng: baseLng - 0.0029,
      address: 'AB Road opposite IPS Gate 2',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'IPS Gate 2'
    },
    aiAnalysis: {
      detectedIssue: 'Pothole',
      confidence: 91,
      observations: 'Submerged pothole crater causing puddle formation and hidden wheel hazard.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Concealed cavity danger',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 88,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 65, description: 'Pothole baseline' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe cavity with standing water' },
        { factor: 'Zone Vulnerability', impact: 14, description: 'School Zone hazard' }
      ]
    },
    linkedIncidentId: 'INC-2026-101',
    isDuplicate: true,
    duplicateProbability: 92,
    matchingFactors: [
      'Geospatial proximity: 24m from INC-2026-101',
      'Matching issue: Pothole',
      'Matching civic zone: School Zone'
    ],
    status: 'Verified',
    isDemo: true
  };

  const rep204: CitizenReport = {
    id: 'REP-2026-204',
    timestamp: '2026-10-05T07:50:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'School bus had to sharply swerve around crater on AB Road. Dangerous during 8 AM school rush.',
    location: {
      lat: baseLat + 0.0035,
      lng: baseLng - 0.0028,
      address: 'Near IPS Gate 1, AB Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'IPS Campus'
    },
    aiAnalysis: {
      detectedIssue: 'Pothole',
      confidence: 95,
      observations: 'Road pothole cavity in center of active traffic lane.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Transit vehicle evasion risk',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 88,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 65, description: 'Pothole baseline' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe road cavity' },
        { factor: 'Zone Vulnerability', impact: 14, description: 'School Zone' }
      ]
    },
    linkedIncidentId: 'INC-2026-101',
    isDuplicate: true,
    duplicateProbability: 98,
    matchingFactors: [
      'Geospatial proximity: 6m from INC-2026-101',
      'Matching issue: Pothole',
      'Keyword match: "school bus", "AB Road", "pothole"'
    ],
    status: 'Verified',
    isDemo: true
  };

  const inc101: Incident = {
    id: 'INC-2026-101',
    issueType: 'Pothole',
    title: 'Severe Asphalt Crater in School Transit Lane (AB Road)',
    location: {
      lat: baseLat + 0.0035,
      lng: baseLng - 0.0028,
      address: 'Near IPS Gate 1, AB Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'Indore Public School'
    },
    severityScore: 88,
    severityLevel: 'Critical',
    priorityScore: 94,
    priorityLevel: 'Critical',
    priorityFactors: [
      {
        factor: 'Visual & Structural Severity',
        weight: 0.40,
        score: 88,
        contribution: 35,
        explanation: 'Deep cavity (>14cm depth) with expanding perimeter fracture.'
      },
      {
        factor: 'Citizen Corroboration & Report Count',
        weight: 0.20,
        score: 92,
        contribution: 18,
        explanation: '4 independent citizen reports logged within 24 hours.'
      },
      {
        factor: 'Critical Location & Transit Density',
        weight: 0.15,
        score: 95,
        contribution: 14,
        explanation: 'Designated School Zone on AB Road with heavy bus and pedestrian crossings.'
      },
      {
        factor: 'Chronic Recurrence History',
        weight: 0.10,
        score: 80,
        contribution: 8,
        explanation: '2 prior temporary patch failures logged at this intersection.'
      },
      {
        factor: 'Public Safety & Transit Impact',
        weight: 0.15,
        score: 94,
        contribution: 14,
        explanation: 'High vehicular evasive maneuver risk threatening crossing children and two-wheelers.'
      }
    ],
    reportCount: 4,
    sourceReportIds: ['REP-2026-201', 'REP-2026-202', 'REP-2026-203', 'REP-2026-204'],
    sourceReports: [rep201, rep202, rep203, rep204],
    status: 'Verified',
    createdAt: '2026-10-04T08:15:00Z',
    updatedAt: '2026-10-05T07:55:00Z',
    recurrenceCount: 2,
    aiExplanation: {
      summary: 'Priority is Critical (94/100) because the verified 14cm pothole poses an imminent road hazard inside an active School Zone on AB Road, Indore, corroborated by 4 independent citizen reports within 24 hours.',
      recommendedAction: 'Dispatch Rapid Road Repair Unit with hot-mix asphalt and establish safety cones immediately.',
      generatedAt: '2026-10-05T07:55:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      {
        id: 'TL-101-1',
        timestamp: '2026-10-04T08:15:00Z',
        status: 'Pending',
        actor: 'Citizen Ingestion Pipeline',
        notes: 'Initial citizen report REP-2026-201 submitted with photo evidence.'
      },
      {
        id: 'TL-101-2',
        timestamp: '2026-10-04T09:40:00Z',
        status: 'Pending',
        actor: 'CivicVision Duplicate Engine',
        notes: 'Consolidated report REP-2026-202 (18m distance, 95% confidence).'
      },
      {
        id: 'TL-101-3',
        timestamp: '2026-10-04T13:20:00Z',
        status: 'Pending',
        actor: 'CivicVision Duplicate Engine',
        notes: 'Consolidated report REP-2026-203. Priority escalated to 89.'
      },
      {
        id: 'TL-101-4',
        timestamp: '2026-10-05T08:00:00Z',
        status: 'Verified',
        actor: 'Municipal Dispatcher Roberts',
        notes: 'Incident verified by supervisor. Escalated to Critical priority 94. Dispatched to IMC Road Maintenance Unit.'
      }
    ],
    assignedCrew: 'IMC Zone 2 Pothole Repair Unit',
    isDemo: true
  };

  // 2. INC-102: Overflowing Drain at Commercial Plaza (Rajwada Market) (Consolidated 3 reports)
  const rep205: CitizenReport = {
    id: 'REP-2026-205',
    timestamp: '2026-10-04T11:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    description: 'Stormwater drain overflowing with foul sewage water near Rajwada Market entrance. Water spreading across footpath.',
    location: {
      lat: baseLat - 0.0042,
      lng: baseLng + 0.0031,
      address: 'MG Road, near Rajwada Palace Gate, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Rajwada Market Plaza'
    },
    aiAnalysis: {
      detectedIssue: 'Overflowing Drain',
      confidence: 97,
      observations: 'Submerged drain grate with heavy effluent backflow, oily residue, and localized sidewalk flooding.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Public health biohazard and retail corridor water damage',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 86,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 70, description: 'Drainage overflow sanitation hazard' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Active backflow and standing contaminated water' },
        { factor: 'Zone Vulnerability', impact: 6, description: 'Commercial retail center foot traffic' }
      ]
    },
    linkedIncidentId: 'INC-2026-102',
    status: 'Assigned',
    isDemo: true
  };

  const rep206: CitizenReport = {
    id: 'REP-2026-206',
    timestamp: '2026-10-04T14:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    description: 'Terrible smell and dirty water bubbling out of the sewer on MG Road in front of the sweet shop.',
    location: {
      lat: baseLat - 0.0041,
      lng: baseLng + 0.0033,
      address: 'MG Road Rajwada, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Rajwada Sweet Shop'
    },
    aiAnalysis: {
      detectedIssue: 'Overflowing Drain',
      confidence: 93,
      observations: 'Sewer backflow emerging around curb gutter with visible debris.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Urban drainage blockage and retail contamination',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 86,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 70, description: 'Drainage hazard' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe runoff' },
        { factor: 'Zone Vulnerability', impact: 6, description: 'Commercial Center' }
      ]
    },
    linkedIncidentId: 'INC-2026-102',
    isDuplicate: true,
    duplicateProbability: 91,
    matchingFactors: ['Geospatial proximity: 22m', 'Issue match: Overflowing Drain', 'Shared landmark: Rajwada'],
    status: 'Assigned',
    isDemo: true
  };

  const rep207: CitizenReport = {
    id: 'REP-2026-207',
    timestamp: '2026-10-05T08:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    description: 'Sewer water has flooded the iBus city bus stop boarding curb. Commuters forced onto road.',
    location: {
      lat: baseLat - 0.0043,
      lng: baseLng + 0.0030,
      address: 'Rajwada iBus Stop, MG Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Rajwada iBus Transit Stop'
    },
    aiAnalysis: {
      detectedIssue: 'Overflowing Drain',
      confidence: 96,
      observations: 'Extensive curb pooling obstructing public bus boarding landing.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Transit boarding obstruction and slip risk',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 86,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 70, description: 'Drainage overflow' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe flooding' },
        { factor: 'Zone Vulnerability', impact: 6, description: 'Commercial/Transit curb' }
      ]
    },
    linkedIncidentId: 'INC-2026-102',
    isDuplicate: true,
    duplicateProbability: 89,
    matchingFactors: ['Geospatial proximity: 19m', 'Identical classification: Overflowing Drain'],
    status: 'Assigned',
    isDemo: true
  };

  const inc102: Incident = {
    id: 'INC-2026-102',
    issueType: 'Overflowing Drain',
    title: 'Sanitary Sewer Backflow & Street Flooding at Rajwada Plaza',
    location: {
      lat: baseLat - 0.0042,
      lng: baseLng + 0.0031,
      address: 'MG Road, near Rajwada Palace Gate, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Rajwada Market Plaza'
    },
    severityScore: 86,
    severityLevel: 'Critical',
    priorityScore: 89,
    priorityLevel: 'Critical',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 86, contribution: 34, explanation: 'Contaminated blackwater overflow.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 80, contribution: 16, explanation: '3 independent citizen reports verified.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 72, contribution: 11, explanation: 'Commercial center with high pedestrian footfall.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 55, contribution: 6, explanation: '1 prior grease blockage logged last month.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 88, contribution: 13, explanation: 'Biohazard exposure and bus boarding disruption.' }
    ],
    reportCount: 3,
    sourceReportIds: ['REP-2026-205', 'REP-2026-206', 'REP-2026-207'],
    sourceReports: [rep205, rep206, rep207],
    status: 'Assigned',
    createdAt: '2026-10-04T11:00:00Z',
    updatedAt: '2026-10-05T09:00:00Z',
    recurrenceCount: 1,
    aiExplanation: {
      summary: 'Priority is Critical (89/100) due to severe sanitary sewer overflow impacting a commercial transit curb on MG Road, Indore, confirmed by 3 citizen submissions, creating active biological contamination.',
      recommendedAction: 'Deploy high-pressure hydraulic jetting truck and suction tanker from IMC Drainage Cell.',
      generatedAt: '2026-10-05T09:00:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-102-1', timestamp: '2026-10-04T11:00:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'First report logged with photo evidence.' },
      { id: 'TL-102-2', timestamp: '2026-10-04T14:15:00Z', status: 'Verified', actor: 'Automated Consolidation', notes: 'Consolidated report REP-2026-206. Score raised to 85.' },
      { id: 'TL-102-3', timestamp: '2026-10-05T09:10:00Z', status: 'Assigned', actor: 'Water & Sewer Dept Supervisor', notes: 'Assigned to IMC Drainage Jetting Crew #4.' }
    ],
    assignedCrew: 'IMC Sewerage & Drainage Wing #4',
    isDemo: true
  };

  // 3. INC-103: Broken Streetlight Corridor (Vijay Nagar) (Consolidated 3 reports)
  const rep208: CitizenReport = {
    id: 'REP-2026-208',
    timestamp: '2026-10-03T20:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    description: 'Streetlight pole #12 is completely unlit on Vijay Nagar Scheme 54. Entire stretch is dark.',
    location: {
      lat: baseLat + 0.0051,
      lng: baseLng + 0.0042,
      address: 'Scheme 54, Vijay Nagar, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Vijay Nagar Scheme 54 Park'
    },
    aiAnalysis: {
      detectedIssue: 'Broken Streetlight',
      confidence: 94,
      observations: 'Non-functioning luminaire fixture resulting in zero ground illumination at cross street.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'Nocturnal blindspot and pedestrian personal safety vulnerability',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 47,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 45, description: 'Broken streetlight baseline hazard' },
        { factor: 'Visual Damage Extent', impact: 0, description: 'Moderate outage profile' },
        { factor: 'Zone Vulnerability', impact: 2, description: 'Residential street context' }
      ]
    },
    linkedIncidentId: 'INC-2026-103',
    status: 'In Progress',
    isDemo: true
  };

  const rep209: CitizenReport = {
    id: 'REP-2026-209',
    timestamp: '2026-10-04T21:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    description: 'Dark corner in Vijay Nagar near garden. Residents feel unsafe walking after 8pm.',
    location: {
      lat: baseLat + 0.0052,
      lng: baseLng + 0.0043,
      address: 'Scheme 54 Garden Lane, Vijay Nagar, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Scheme 54 Garden'
    },
    aiAnalysis: {
      detectedIssue: 'Broken Streetlight',
      confidence: 92,
      observations: 'Extinguished street luminaire adjacent to public park path.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'Pedestrian nocturnal visibility hazard',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 47,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 45, description: 'Streetlight outage' },
        { factor: 'Zone Vulnerability', impact: 2, description: 'Residential Area' }
      ]
    },
    linkedIncidentId: 'INC-2026-103',
    isDuplicate: true,
    duplicateProbability: 94,
    matchingFactors: ['Geospatial proximity: 15m', 'Issue match: Broken Streetlight', 'Shared landmark: Vijay Nagar'],
    status: 'In Progress',
    isDemo: true
  };

  const rep210: CitizenReport = {
    id: 'REP-2026-210',
    timestamp: '2026-10-05T06:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    description: 'Streetlight pole head is dangling and unlit. Heavy winds loosened the fixture arm.',
    location: {
      lat: baseLat + 0.0050,
      lng: baseLng + 0.0041,
      address: 'Scheme 54 Sector A, Vijay Nagar, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Vijay Nagar Sector A'
    },
    aiAnalysis: {
      detectedIssue: 'Broken Streetlight',
      confidence: 95,
      observations: 'Fixture bracket dislodged and unpowered luminaire head.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Structural overhead detachment risk and outage',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 65,
      level: 'High',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 45, description: 'Streetlight outage' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Detached luminaire fixture' },
        { factor: 'Zone Vulnerability', impact: 2, description: 'Residential Area' }
      ]
    },
    linkedIncidentId: 'INC-2026-103',
    isDuplicate: true,
    duplicateProbability: 88,
    matchingFactors: ['Geospatial proximity: 21m', 'Issue match: Broken Streetlight'],
    status: 'In Progress',
    isDemo: true
  };

  const inc103: Incident = {
    id: 'INC-2026-103',
    issueType: 'Broken Streetlight',
    title: 'Dislodged Luminaire & Multi-Pole Blackout in Vijay Nagar Scheme 54',
    location: {
      lat: baseLat + 0.0051,
      lng: baseLng + 0.0042,
      address: 'Scheme 54, Vijay Nagar, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Vijay Nagar Scheme 54'
    },
    severityScore: 65,
    severityLevel: 'High',
    priorityScore: 74,
    priorityLevel: 'High',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 65, contribution: 26, explanation: 'Dislodged luminaire bracket with live wire risk.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 80, contribution: 16, explanation: '3 independent reports from residential block.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 55, contribution: 8, explanation: 'Residential corridor adjoining community park.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 55, contribution: 6, explanation: '1 prior ballast repair on this transformer circuit.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 68, contribution: 10, explanation: 'Overhead drop hazard and nocturnal pedestrian blind spot.' }
    ],
    reportCount: 3,
    sourceReportIds: ['REP-2026-208', 'REP-2026-209', 'REP-2026-210'],
    sourceReports: [rep208, rep209, rep210],
    status: 'In Progress',
    createdAt: '2026-10-03T20:30:00Z',
    updatedAt: '2026-10-05T07:15:00Z',
    recurrenceCount: 1,
    aiExplanation: {
      summary: 'Priority is High (74/100) because the verified broken luminaire has a loose physical bracket presenting overhead hazard, aggravated by darkness on a public walkway in Vijay Nagar, Indore corroborated by 3 citizen submissions.',
      recommendedAction: 'Dispatch bucket truck unit to re-anchor fixture bracket, replace LED module, and inspect feeder line.',
      generatedAt: '2026-10-05T07:15:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-103-1', timestamp: '2026-10-03T20:30:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'First report submitted.' },
      { id: 'TL-103-2', timestamp: '2026-10-04T22:00:00Z', status: 'Verified', actor: 'Night Shift Triage', notes: 'Consolidated report REP-209. Priority updated to 68.' },
      { id: 'TL-103-3', timestamp: '2026-10-05T07:30:00Z', status: 'In Progress', actor: 'Indore Discom Electrical Crew', notes: 'Bucket truck on site. Repairing electrical conduit.' }
    ],
    assignedCrew: 'MPPKVVCL / IMC Electrical Wing #2',
    isDemo: true
  };

  // 4. INC-104: Damaged Concrete Sidewalk at Metro Station (Super Corridor) (Consolidated 3 reports)
  const rep211: CitizenReport = {
    id: 'REP-2026-211',
    timestamp: '2026-10-02T16:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584463699042-45a8d9a4f4d2?auto=format&fit=crop&w=800&q=80',
    description: 'Massive concrete sidewalk slab lifted outside Super Corridor Metro Station Exit B. Seen multiple commuters trip.',
    location: {
      lat: baseLat - 0.0018,
      lng: baseLng - 0.0055,
      address: 'Super Corridor Metro Station (Exit B), Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Transit Hub',
      landmark: 'Super Corridor Metro Station'
    },
    aiAnalysis: {
      detectedIssue: 'Damaged Sidewalk',
      confidence: 95,
      observations: 'Heaved concrete slab displacement (>7cm vertical offset) forming severe trip ledge across busy commuter path.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Severe pedestrian fall hazard and disability accessibility blockage',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 80,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 52, description: 'Sidewalk displacement trip hazard' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe 7cm vertical slab heave' },
        { factor: 'Zone Vulnerability', impact: 10, description: 'Transit Hub high pedestrian throughput' }
      ]
    },
    linkedIncidentId: 'INC-2026-104',
    status: 'Verified',
    isDemo: true
  };

  const rep212: CitizenReport = {
    id: 'REP-2026-212',
    timestamp: '2026-10-03T08:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584463699042-45a8d9a4f4d2?auto=format&fit=crop&w=800&q=80',
    description: 'Cracked paver blocks right in front of metro turnstiles approach. Wheelchairs cannot pass.',
    location: {
      lat: baseLat - 0.0019,
      lng: baseLng - 0.0054,
      address: 'Super Corridor Metro Concourse Approach, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Transit Hub',
      landmark: 'Super Corridor Metro Entrance'
    },
    aiAnalysis: {
      detectedIssue: 'Damaged Sidewalk',
      confidence: 96,
      observations: 'Fractured sidewalk slabs blocking accessibility access route.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Wheelchair barrier and pedestrian obstruction',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 80,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 52, description: 'Sidewalk hazard' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe slab fracture' },
        { factor: 'Zone Vulnerability', impact: 10, description: 'Transit Hub' }
      ]
    },
    linkedIncidentId: 'INC-2026-104',
    isDuplicate: true,
    duplicateProbability: 93,
    matchingFactors: ['Geospatial proximity: 14m', 'Issue match: Damaged Sidewalk', 'Keyword: Metro Station'],
    status: 'Verified',
    isDemo: true
  };

  const rep213: CitizenReport = {
    id: 'REP-2026-213',
    timestamp: '2026-10-04T17:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584463699042-45a8d9a4f4d2?auto=format&fit=crop&w=800&q=80',
    description: 'Elderly citizen stumbled on the uneven concrete at metro bus feeder stop.',
    location: {
      lat: baseLat - 0.0017,
      lng: baseLng - 0.0056,
      address: 'Super Corridor Feeder Bus Bay, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Transit Hub',
      landmark: 'Super Corridor Feeder Bay'
    },
    aiAnalysis: {
      detectedIssue: 'Damaged Sidewalk',
      confidence: 94,
      observations: 'Raised concrete edge creating recurrent pedestrian stumble incident.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Commuter pedestrian safety hazard',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 80,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 52, description: 'Sidewalk hazard' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe displacement' },
        { factor: 'Zone Vulnerability', impact: 10, description: 'Transit Hub' }
      ]
    },
    linkedIncidentId: 'INC-2026-104',
    isDuplicate: true,
    duplicateProbability: 91,
    matchingFactors: ['Geospatial proximity: 23m', 'Issue match: Damaged Sidewalk', 'Corroborating trip report'],
    status: 'Verified',
    isDemo: true
  };

  const inc104: Incident = {
    id: 'INC-2026-104',
    issueType: 'Damaged Sidewalk',
    title: 'Severe Heaved Concrete Slab at Super Corridor Metro Station',
    location: {
      lat: baseLat - 0.0018,
      lng: baseLng - 0.0055,
      address: 'Super Corridor Metro Station (Exit B), Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Transit Hub',
      landmark: 'Super Corridor Metro Station'
    },
    severityScore: 80,
    severityLevel: 'Critical',
    priorityScore: 84,
    priorityLevel: 'Critical',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 80, contribution: 32, explanation: '7cm raised concrete slab offset creating major trip ledge.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 80, contribution: 16, explanation: '3 independent commuter reports including reported fall.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 85, contribution: 13, explanation: 'Designated Transit Hub with heavy daily foot commuters.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 55, contribution: 6, explanation: '1 prior paver repair logged in 2025.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 72, contribution: 11, explanation: 'Wheelchair accessibility blockage on primary metro concourse.' }
    ],
    reportCount: 3,
    sourceReportIds: ['REP-2026-211', 'REP-2026-212', 'REP-2026-213'],
    sourceReports: [rep211, rep212, rep213],
    status: 'Verified',
    createdAt: '2026-10-02T16:45:00Z',
    updatedAt: '2026-10-04T18:00:00Z',
    recurrenceCount: 1,
    aiExplanation: {
      summary: 'Priority is Critical (84/100) due to severe 7cm concrete slab displacement outside Super Corridor Metro Station, Indore creating pedestrian trip risk and accessibility impairment verified by 3 commuter reports.',
      recommendedAction: 'Install high-visibility ramp warning mat immediately; schedule concrete saw cutting and leveling crew within 24 hours.',
      generatedAt: '2026-10-04T18:00:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-104-1', timestamp: '2026-10-02T16:45:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted by commuter.' },
      { id: 'TL-104-2', timestamp: '2026-10-03T09:00:00Z', status: 'Pending', actor: 'Consolidation Engine', notes: 'Consolidated report REP-212.' },
      { id: 'TL-104-3', timestamp: '2026-10-04T18:30:00Z', status: 'Verified', actor: 'Transit Safety Inspector', notes: 'Site inspection confirmed 7cm ledge. Prioritized as Critical.' }
    ],
    assignedCrew: 'MPMRCL / IMC Footpath Works Unit',
    isDemo: true
  };

  // 5. INC-105: Garbage Accumulation in Alleyway (Palasia) (Consolidated 2 reports)
  const rep214: CitizenReport = {
    id: 'REP-2026-214',
    timestamp: '2026-10-04T15:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    description: 'Broken packing crates, plastic sacks, and domestic debris dumped in service lane behind Palasia market shops.',
    location: {
      lat: baseLat + 0.0022,
      lng: baseLng + 0.0062,
      address: 'Service Lane behind Old Palasia Market, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Alleyway / Minor Street',
      landmark: 'Old Palasia Market'
    },
    aiAnalysis: {
      detectedIssue: 'Garbage Accumulation',
      confidence: 96,
      observations: 'Substantial solid waste accumulation blocking secondary service alleyway with organic decomposition.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'Pest vector proliferation and fire load hazard',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 40,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 42, description: 'Solid waste accumulation baseline' },
        { factor: 'Visual Damage Extent', impact: 0, description: 'Moderate bulk debris heap' },
        { factor: 'Zone Vulnerability', impact: -4, description: 'Alleyway with low direct traffic' }
      ]
    },
    linkedIncidentId: 'INC-2026-105',
    status: 'Pending',
    isDemo: true
  };

  const rep215: CitizenReport = {
    id: 'REP-2026-215',
    timestamp: '2026-10-05T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    description: 'Trash pile is growing on Palasia back lane. Stray dogs tearing open bags.',
    location: {
      lat: baseLat + 0.0023,
      lng: baseLng + 0.0061,
      address: 'Palasia Service Lane Near Gate 3, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Alleyway / Minor Street',
      landmark: 'Palasia Market Lane'
    },
    aiAnalysis: {
      detectedIssue: 'Garbage Accumulation',
      confidence: 93,
      observations: 'Domestic waste sacks spilling into lane.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'Sanitation hazard and vermin attraction',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 40,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 42, description: 'Garbage baseline' },
        { factor: 'Zone Vulnerability', impact: -4, description: 'Alleyway' }
      ]
    },
    linkedIncidentId: 'INC-2026-105',
    isDuplicate: true,
    duplicateProbability: 95,
    matchingFactors: ['Geospatial proximity: 16m', 'Issue match: Garbage Accumulation', 'Keyword: Palasia service lane'],
    status: 'Pending',
    isDemo: true
  };

  const inc105: Incident = {
    id: 'INC-2026-105',
    issueType: 'Garbage Accumulation',
    title: 'Debris Waste Dump & Alleyway Obstruction in Old Palasia',
    location: {
      lat: baseLat + 0.0022,
      lng: baseLng + 0.0062,
      address: 'Service Lane behind Old Palasia Market, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Alleyway / Minor Street',
      landmark: 'Old Palasia Market'
    },
    severityScore: 40,
    severityLevel: 'Medium',
    priorityScore: 52,
    priorityLevel: 'Medium',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 40, contribution: 16, explanation: 'Moderate bulk debris pile occupying right-of-way.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 65, contribution: 13, explanation: '2 citizen complaints logged.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 35, contribution: 5, explanation: 'Service alleyway with low vehicular throughput.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 55, contribution: 6, explanation: '1 previous dumping incident recorded at this dead-end.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 58, contribution: 9, explanation: 'Pest vector proliferation and hygiene concern.' }
    ],
    reportCount: 2,
    sourceReportIds: ['REP-2026-214', 'REP-2026-215'],
    sourceReports: [rep214, rep215],
    status: 'Pending',
    createdAt: '2026-10-04T15:00:00Z',
    updatedAt: '2026-10-05T09:20:00Z',
    recurrenceCount: 1,
    aiExplanation: {
      summary: 'Priority is Medium (52/100) because the bulk dumping obstruction is confined to a secondary service lane in Old Palasia, Indore without direct transit risk, though 2 citizen reports note public hygiene concerns.',
      recommendedAction: 'Schedule municipal sanitation tipper truck for afternoon bulk debris clearance.',
      generatedAt: '2026-10-05T09:20:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-105-1', timestamp: '2026-10-04T15:00:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Initial dumping report submitted.' },
      { id: 'TL-105-2', timestamp: '2026-10-05T09:15:00Z', status: 'Pending', actor: 'Consolidation Engine', notes: 'Consolidated report REP-215.' }
    ],
    isDemo: true
  };

  // 6. INC-106: Downed Signage on Ring Road (Consolidated 2 reports)
  const rep216: CitizenReport = {
    id: 'REP-2026-216',
    timestamp: '2026-10-05T06:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'Major traffic direction and stop sign knocked down on Ring Road intersection near Khajrana square. Vehicles speeding dangerously!',
    location: {
      lat: baseLat + 0.0015,
      lng: baseLng - 0.0072,
      address: 'Ring Road near Khajrana Square, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Arterial Road',
      landmark: 'Khajrana Square Intersection'
    },
    aiAnalysis: {
      detectedIssue: 'Damaged Signage',
      confidence: 97,
      observations: 'Regulatory traffic control sign post severed at base and lying prone on curb.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Critical collision risk and right-of-way failure',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 85,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 55, description: 'Traffic regulatory signage failure' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Complete structural knockdown' },
        { factor: 'Zone Vulnerability', impact: 12, description: 'Arterial multilane corridor' }
      ]
    },
    linkedIncidentId: 'INC-2026-106',
    status: 'Assigned',
    isDemo: true
  };

  const rep217: CitizenReport = {
    id: 'REP-2026-217',
    timestamp: '2026-10-05T07:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    description: 'Traffic signboard flattened on Ring Road. Two cars nearly collided at the turning.',
    location: {
      lat: baseLat + 0.0016,
      lng: baseLng - 0.0071,
      address: 'Ring Road Khajrana Corner, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Arterial Road',
      landmark: 'Khajrana Corner'
    },
    aiAnalysis: {
      detectedIssue: 'Damaged Signage',
      confidence: 95,
      observations: 'Downed traffic control post creating intersection confusion.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Imminent broadside crash hazard',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 85,
      level: 'Critical',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 55, description: 'Traffic signage' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Knockdown' },
        { factor: 'Zone Vulnerability', impact: 12, description: 'Arterial Road' }
      ]
    },
    linkedIncidentId: 'INC-2026-106',
    isDuplicate: true,
    duplicateProbability: 96,
    matchingFactors: ['Geospatial proximity: 14m', 'Issue match: Damaged Signage', 'Keyword: Ring Road, Khajrana'],
    status: 'Assigned',
    isDemo: true
  };

  const inc106: Incident = {
    id: 'INC-2026-106',
    issueType: 'Damaged Signage',
    title: 'Downed Traffic Sign at Ring Road Multilane Intersection',
    location: {
      lat: baseLat + 0.0015,
      lng: baseLng - 0.0072,
      address: 'Ring Road near Khajrana Square, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Arterial Road',
      landmark: 'Khajrana Square Intersection'
    },
    severityScore: 85,
    severityLevel: 'Critical',
    priorityScore: 86,
    priorityLevel: 'Critical',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 85, contribution: 34, explanation: 'Total knockdown of regulatory sign leaving intersection unmanaged.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 65, contribution: 13, explanation: '2 urgent citizen reports citing near-collisions.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 90, contribution: 14, explanation: 'High-speed arterial Ring Road with heavy vehicular throughput.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 20, contribution: 2, explanation: 'First knockdown incident logged at this post.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 82, contribution: 12, explanation: 'High danger of broadside collision at speed.' }
    ],
    reportCount: 2,
    sourceReportIds: ['REP-2026-216', 'REP-2026-217'],
    sourceReports: [rep216, rep217],
    status: 'Assigned',
    createdAt: '2026-10-05T06:30:00Z',
    updatedAt: '2026-10-05T07:25:00Z',
    recurrenceCount: 0,
    aiExplanation: {
      summary: 'Priority is Critical (86/100) because a primary regulatory traffic sign has been completely knocked down on the high-speed Ring Road, Indore creating an immediate life-safety intersection collision hazard corroborated by 2 citizen reports.',
      recommendedAction: 'Dispatch emergency traffic engineering technician to erect temporary warning sign and re-anchor post base.',
      generatedAt: '2026-10-05T07:25:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-106-1', timestamp: '2026-10-05T06:30:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted.' },
      { id: 'TL-106-2', timestamp: '2026-10-05T07:15:00Z', status: 'Assigned', actor: 'Traffic Police & IMC Control', notes: 'Dispatched to Traffic Engineering Rapid Unit.' }
    ],
    assignedCrew: 'Indore Traffic Engineering Emergency Unit',
    isDemo: true
  };

  // Additional realistic demo incidents
  // 7. INC-107: Road Damage on Bypass Highway
  const rep218: CitizenReport = {
    id: 'REP-2026-218',
    timestamp: '2026-10-03T14:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Long asphalt fissure cracking across lane 2 on Indore Bypass Road.',
    location: {
      lat: baseLat - 0.0062,
      lng: baseLng - 0.0018,
      address: 'Indore Bypass Highway Km 8.4',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Arterial Road',
      landmark: 'Bypass Flyover'
    },
    aiAnalysis: {
      detectedIssue: 'Road Damage',
      confidence: 89,
      observations: 'Transverse thermal crack measuring 4.5m with minor edge ravelling.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'High-speed vehicular vibration and moisture intrusion',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 72,
      level: 'High',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 60, description: 'Road structural damage' },
        { factor: 'Zone Vulnerability', impact: 12, description: 'Arterial Road' }
      ]
    },
    linkedIncidentId: 'INC-2026-107',
    status: 'Verified',
    isDemo: true
  };

  const rep219: CitizenReport = {
    id: 'REP-2026-219',
    timestamp: '2026-10-04T10:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Crack on Bypass Road is opening wider after heavy rain.',
    location: {
      lat: baseLat - 0.0061,
      lng: baseLng - 0.0017,
      address: 'Indore Bypass Km 8.4 Eastbound',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Arterial Road',
      landmark: 'Bypass Overpass'
    },
    aiAnalysis: {
      detectedIssue: 'Road Damage',
      confidence: 91,
      observations: 'Expanding asphalt crack opening.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'Pavement degradation',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 72,
      level: 'High',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 60, description: 'Road damage' },
        { factor: 'Zone Vulnerability', impact: 12, description: 'Arterial Road' }
      ]
    },
    linkedIncidentId: 'INC-2026-107',
    isDuplicate: true,
    duplicateProbability: 92,
    matchingFactors: ['Geospatial proximity: 20m', 'Issue match: Road Damage'],
    status: 'Verified',
    isDemo: true
  };

  const inc107: Incident = {
    id: 'INC-2026-107',
    issueType: 'Road Damage',
    title: 'Transverse Asphalt Fissure on Indore Bypass Highway',
    location: {
      lat: baseLat - 0.0062,
      lng: baseLng - 0.0018,
      address: 'Indore Bypass Highway Km 8.4',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Arterial Road',
      landmark: 'Bypass Flyover'
    },
    severityScore: 72,
    severityLevel: 'High',
    priorityScore: 75,
    priorityLevel: 'High',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 72, contribution: 29, explanation: '4.5m transverse crack across active highway lane.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 65, contribution: 13, explanation: '2 commuter submissions.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 90, contribution: 14, explanation: 'Arterial expressway carrying heavy intercity traffic.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 20, contribution: 2, explanation: 'No prior recurrence logged at this segment.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 78, contribution: 12, explanation: 'Risk of rapid pavement unraveling.' }
    ],
    reportCount: 2,
    sourceReportIds: ['REP-2026-218', 'REP-2026-219'],
    sourceReports: [rep218, rep219],
    status: 'Verified',
    createdAt: '2026-10-03T14:00:00Z',
    updatedAt: '2026-10-04T11:00:00Z',
    recurrenceCount: 0,
    aiExplanation: {
      summary: 'Priority is High (75/100) due to significant thermal cracking spanning an active expressway lane on Indore Bypass, confirmed by 2 reports.',
      recommendedAction: 'Schedule night-time crack sealing crew with hot-pour sealant between 11 PM and 5 AM.',
      generatedAt: '2026-10-04T11:00:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-107-1', timestamp: '2026-10-03T14:00:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'First report logged.' },
      { id: 'TL-107-2', timestamp: '2026-10-04T11:00:00Z', status: 'Verified', actor: 'MPRDC Highway Inspector', notes: 'Confirmed crack dimensions.' }
    ],
    isDemo: true
  };

  // 8. INC-108: Clogged Catch Basin on Chhappan Dukan Lane
  const rep220: CitizenReport = {
    id: 'REP-2026-220',
    timestamp: '2026-10-05T08:10:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    description: 'Catch basin clogged with food waste packaging and silt near Chhappan Dukan food street. Gutter water pooling.',
    location: {
      lat: baseLat + 0.0048,
      lng: baseLng - 0.0065,
      address: 'Chhappan Dukan Street, New Palasia, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Chhappan Dukan Street'
    },
    aiAnalysis: {
      detectedIssue: 'Overflowing Drain',
      confidence: 88,
      observations: 'Storm grate obstructed by foliage debris resulting in localized curb pooling.',
      estimatedDamageLevel: 'Minor',
      hazardClassification: 'Localized gutter waterlogging',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 57,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 70, description: 'Drainage baseline' },
        { factor: 'Visual Damage Extent', impact: -15, description: 'Minor surface foliage blockage' },
        { factor: 'Zone Vulnerability', impact: 2, description: 'Commercial food street' }
      ]
    },
    linkedIncidentId: 'INC-2026-108',
    status: 'Pending',
    isDemo: true
  };

  const inc108: Incident = {
    id: 'INC-2026-108',
    issueType: 'Overflowing Drain',
    title: 'Debris-Clogged Catch Basin on Chhappan Dukan Lane',
    location: {
      lat: baseLat + 0.0048,
      lng: baseLng - 0.0065,
      address: 'Chhappan Dukan Street, New Palasia, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Chhappan Dukan Street'
    },
    severityScore: 57,
    severityLevel: 'Medium',
    priorityScore: 50,
    priorityLevel: 'Medium',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 57, contribution: 23, explanation: 'Surface blockage causing minor gutter water pooling.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 40, contribution: 8, explanation: '1 single citizen report.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 55, contribution: 8, explanation: 'High footfall culinary street.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 20, contribution: 2, explanation: 'No prior complaints logged.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 55, contribution: 8, explanation: 'Ponding without structural sewer pipe damage.' }
    ],
    reportCount: 1,
    sourceReportIds: ['REP-2026-220'],
    sourceReports: [rep220],
    status: 'Pending',
    createdAt: '2026-10-05T08:10:00Z',
    updatedAt: '2026-10-05T08:10:00Z',
    recurrenceCount: 0,
    aiExplanation: {
      summary: 'Priority is Medium (50/100) because the verified drainage issue is limited to surface debris blockage with a single citizen report.',
      recommendedAction: 'Route sanitary vacuum sweeper during routine evening sweep to clear basin grate.',
      generatedAt: '2026-10-05T08:10:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-108-1', timestamp: '2026-10-05T08:10:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted.' }
    ],
    isDemo: true
  };

  // 9. INC-109: Flickering Luminaire in Saket Nagar (Resolved)
  const rep221: CitizenReport = {
    id: 'REP-2026-221',
    timestamp: '2026-10-01T21:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    description: 'Streetlight pole 44 in Saket Nagar is flickering constantly like a strobe light.',
    location: {
      lat: baseLat + 0.0039,
      lng: baseLng + 0.0019,
      address: 'Saket Nagar Main Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Saket Community Park'
    },
    aiAnalysis: {
      detectedIssue: 'Broken Streetlight',
      confidence: 90,
      observations: 'Intermittent luminaire ballast flicker.',
      estimatedDamageLevel: 'Minor',
      hazardClassification: 'Nuisance flicker and partial lighting loss',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 32,
      level: 'Low',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 45, description: 'Streetlight baseline' },
        { factor: 'Visual Damage Extent', impact: -15, description: 'Minor ballast flicker' },
        { factor: 'Zone Vulnerability', impact: 2, description: 'Residential street' }
      ]
    },
    linkedIncidentId: 'INC-2026-109',
    status: 'Resolved',
    isDemo: true
  };

  const inc109: Incident = {
    id: 'INC-2026-109',
    issueType: 'Broken Streetlight',
    title: 'Flickering Luminaire in Saket Nagar',
    location: {
      lat: baseLat + 0.0039,
      lng: baseLng + 0.0019,
      address: 'Saket Nagar Main Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Saket Community Park'
    },
    severityScore: 32,
    severityLevel: 'Low',
    priorityScore: 36,
    priorityLevel: 'Low',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 32, contribution: 13, explanation: 'Minor photo-sensor flicker.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 40, contribution: 8, explanation: '1 citizen submission.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 55, contribution: 8, explanation: 'Quiet residential street.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 20, contribution: 2, explanation: 'No recurrence history.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 35, contribution: 5, explanation: 'Low public safety impact.' }
    ],
    reportCount: 1,
    sourceReportIds: ['REP-2026-221'],
    sourceReports: [rep221],
    status: 'Resolved',
    createdAt: '2026-10-01T21:00:00Z',
    updatedAt: '2026-10-03T11:00:00Z',
    recurrenceCount: 0,
    aiExplanation: {
      summary: 'Priority was Low (36/100). Replaced faulty photocell relay module in Saket Nagar, Indore.',
      recommendedAction: 'Photo-eye sensor replaced with standard LED driver module. Luminaire verified operational.',
      generatedAt: '2026-10-03T11:00:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-109-1', timestamp: '2026-10-01T21:00:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted.' },
      { id: 'TL-109-2', timestamp: '2026-10-02T09:00:00Z', status: 'Assigned', actor: 'District Dispatch', notes: 'Assigned to utility crew.' },
      { id: 'TL-109-3', timestamp: '2026-10-03T11:00:00Z', status: 'Resolved', actor: 'Discom Technician', notes: 'Replaced faulty photo-sensor cell. Work complete.' }
    ],
    assignedCrew: 'IMC Zone 5 Electrical Repair Unit',
    resolutionNotes: 'Replaced faulty photocell relay switch. Inspected mast wiring.',
    isDemo: true
  };

  // 10. INC-110: Deep Trench Post-Utility Dig (Bhanwarkuan) (In Progress)
  const rep222: CitizenReport = {
    id: 'REP-2026-222',
    timestamp: '2026-10-04T07:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Gas pipeline utility contractor cut a trench across Bhanwarkuan road and filled with loose gravel. Settled 6 inches down.',
    location: {
      lat: baseLat - 0.0031,
      lng: baseLng - 0.0039,
      address: 'Bhanwarkuan Square student coaching hub, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Bhanwarkuan Square'
    },
    aiAnalysis: {
      detectedIssue: 'Road Damage',
      confidence: 93,
      observations: 'Subsided trench depression across roadway width with uncompacted backfill collapse.',
      estimatedDamageLevel: 'Severe',
      hazardClassification: 'Severe axle damage and motorcycle flip hazard',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 75,
      level: 'High',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 60, description: 'Road structural damage' },
        { factor: 'Visual Damage Extent', impact: 18, description: 'Severe trench subsidence' },
        { factor: 'Zone Vulnerability', impact: 2, description: 'Student transit zone' }
      ]
    },
    linkedIncidentId: 'INC-2026-110',
    status: 'In Progress',
    isDemo: true
  };

  const inc110: Incident = {
    id: 'INC-2026-110',
    issueType: 'Road Damage',
    title: 'Sunken Gas Utility Trench Collapse Across Bhanwarkuan Road',
    location: {
      lat: baseLat - 0.0031,
      lng: baseLng - 0.0039,
      address: 'Bhanwarkuan Square student coaching hub, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Residential Area',
      landmark: 'Bhanwarkuan Square'
    },
    severityScore: 75,
    severityLevel: 'High',
    priorityScore: 68,
    priorityLevel: 'High',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 75, contribution: 30, explanation: '6-inch trench depression cutting entirely across travel lane.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 40, contribution: 8, explanation: '1 detailed citizen report.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 55, contribution: 8, explanation: 'Dense student two-wheeler traffic.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 55, contribution: 6, explanation: '1 prior trench settling notice served to contractor.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 78, contribution: 12, explanation: 'Severe vehicle suspension shock and two-wheeler hazard.' }
    ],
    reportCount: 1,
    sourceReportIds: ['REP-2026-222'],
    sourceReports: [rep222],
    status: 'In Progress',
    createdAt: '2026-10-04T07:45:00Z',
    updatedAt: '2026-10-05T08:00:00Z',
    recurrenceCount: 1,
    aiExplanation: {
      summary: 'Priority is High (68/100) because an uncompacted utility trench has settled 6 inches across the roadway at Bhanwarkuan, Indore presenting severe two-wheeler hazards.',
      recommendedAction: 'Issue immediate emergency compaction and permanent hot-mix repaving order to subcontractor.',
      generatedAt: '2026-10-05T08:00:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-110-1', timestamp: '2026-10-04T07:45:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted with photos.' },
      { id: 'TL-110-2', timestamp: '2026-10-04T12:00:00Z', status: 'Verified', actor: 'Right-of-Way Inspector', notes: 'Notice issued to Avantika Gas utility contractor.' },
      { id: 'TL-110-3', timestamp: '2026-10-05T08:00:00Z', status: 'In Progress', actor: 'Paving Subcontractor', notes: 'Excavating and leveling base course.' }
    ],
    assignedCrew: 'IMC Engineering & Utility Oversight Team',
    isDemo: true
  };

  // 11. INC-111: Faded Crosswalk Markings (Annapurna School Area) (Assigned)
  const rep223: CitizenReport = {
    id: 'REP-2026-223',
    timestamp: '2026-10-03T11:20:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1584463699042-45a8d9a4f4d2?auto=format&fit=crop&w=800&q=80',
    description: 'Zebra stripes at Annapurna Road school crossing are worn away by heavy bus and auto traffic.',
    location: {
      lat: baseLat + 0.0028,
      lng: baseLng - 0.0051,
      address: 'Annapurna Road School Crossing, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'Annapurna School Gate'
    },
    aiAnalysis: {
      detectedIssue: 'Road Damage',
      confidence: 88,
      observations: 'Thermoplastic pedestrian crossing paint eroded >80% in vehicle travel path.',
      estimatedDamageLevel: 'Moderate',
      hazardClassification: 'Reduced pedestrian crosswalk visibility',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 55,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 60, description: 'Road marking degradation' },
        { factor: 'Visual Damage Extent', impact: 0, description: 'Moderate wear profile' },
        { factor: 'Zone Vulnerability', impact: 14, description: 'School Zone' }
      ]
    },
    linkedIncidentId: 'INC-2026-111',
    status: 'Assigned',
    isDemo: true
  };

  const inc111: Incident = {
    id: 'INC-2026-111',
    issueType: 'Road Damage',
    title: 'Faded Thermoplastic School Crosswalk Markings on Annapurna Road',
    location: {
      lat: baseLat + 0.0028,
      lng: baseLng - 0.0051,
      address: 'Annapurna Road School Crossing, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'School Zone',
      landmark: 'Annapurna School Gate'
    },
    severityScore: 55,
    severityLevel: 'Medium',
    priorityScore: 61,
    priorityLevel: 'High',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 55, contribution: 22, explanation: 'Over 80% paint erosion across school zebra crossing.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 40, contribution: 8, explanation: '1 school parent report.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 95, contribution: 14, explanation: 'Active School Zone crossing corridor.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 20, contribution: 2, explanation: 'Scheduled yearly restriping cycle.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 78, contribution: 12, explanation: 'Driver awareness critical for student pedestrian safety.' }
    ],
    reportCount: 1,
    sourceReportIds: ['REP-2026-223'],
    sourceReports: [rep223],
    status: 'Assigned',
    createdAt: '2026-10-03T11:20:00Z',
    updatedAt: '2026-10-04T14:00:00Z',
    recurrenceCount: 0,
    aiExplanation: {
      summary: 'Priority is High (61/100) elevated by the School Zone location requirement on Annapurna Road, Indore for high-contrast crosswalk visibility.',
      recommendedAction: 'Schedule thermoplastic line-marking truck for retroreflective restriping.',
      generatedAt: '2026-10-04T14:00:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-111-1', timestamp: '2026-10-03T11:20:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted.' },
      { id: 'TL-111-2', timestamp: '2026-10-04T14:00:00Z', status: 'Assigned', actor: 'Traffic Engineering Division', notes: 'Work order issued to Line Striping Unit.' }
    ],
    assignedCrew: 'IMC Traffic Markings Crew #1',
    isDemo: true
  };

  // 12. INC-112: Repaired Pothole in Geeta Bhawan Area (Resolved)
  const rep224: CitizenReport = {
    id: 'REP-2026-224',
    timestamp: '2026-09-28T09:15:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Pothole near Geeta Bhawan square market lane.',
    location: {
      lat: baseLat - 0.0024,
      lng: baseLng + 0.0055,
      address: 'Geeta Bhawan Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Geeta Bhawan Square'
    },
    aiAnalysis: {
      detectedIssue: 'Pothole',
      confidence: 91,
      observations: 'Surface pothole cavity in asphalt.',
      estimatedDamageLevel: 'Minor',
      hazardClassification: 'Minor vehicular roughness',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 42,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 65, description: 'Pothole' },
        { factor: 'Visual Damage Extent', impact: -15, description: 'Minor cavity' },
        { factor: 'Zone Vulnerability', impact: 6, description: 'Commercial Center' }
      ]
    },
    linkedIncidentId: 'INC-2026-112',
    status: 'Resolved',
    isDemo: true
  };

  const rep225: CitizenReport = {
    id: 'REP-2026-225',
    timestamp: '2026-09-29T11:00:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    description: 'Pothole near Geeta Bhawan hospital approach.',
    location: {
      lat: baseLat - 0.0025,
      lng: baseLng + 0.0056,
      address: 'Geeta Bhawan Square Approach, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Geeta Bhawan Hospital Approach'
    },
    aiAnalysis: {
      detectedIssue: 'Pothole',
      confidence: 90,
      observations: 'Asphalt cavity.',
      estimatedDamageLevel: 'Minor',
      hazardClassification: 'Surface defect',
      isRealAiCall: true,
      modelUsed: 'gemini-3.8-flash'
    },
    severity: {
      score: 42,
      level: 'Medium',
      contributingFactors: [
        { factor: 'Infrastructure Baseline', impact: 65, description: 'Pothole' }
      ]
    },
    linkedIncidentId: 'INC-2026-112',
    isDuplicate: true,
    duplicateProbability: 92,
    matchingFactors: ['Geospatial proximity: 14m', 'Issue match: Pothole'],
    status: 'Resolved',
    isDemo: true
  };

  const inc112: Incident = {
    id: 'INC-2026-112',
    issueType: 'Pothole',
    title: 'Surface Pothole on Geeta Bhawan Commercial Strip',
    location: {
      lat: baseLat - 0.0024,
      lng: baseLng + 0.0055,
      address: 'Geeta Bhawan Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Commercial Center',
      landmark: 'Geeta Bhawan Square'
    },
    severityScore: 42,
    severityLevel: 'Medium',
    priorityScore: 35,
    priorityLevel: 'Low',
    priorityFactors: [
      { factor: 'Visual & Structural Severity', weight: 0.40, score: 42, contribution: 17, explanation: 'Minor shallow surface depression.' },
      { factor: 'Citizen Corroboration & Report Count', weight: 0.20, score: 65, contribution: 13, explanation: '2 reports consolidated.' },
      { factor: 'Critical Location & Transit Density', weight: 0.15, score: 72, contribution: 11, explanation: 'Commercial approach.' },
      { factor: 'Chronic Recurrence History', weight: 0.10, score: 20, contribution: 2, explanation: 'No prior complaints.' },
      { factor: 'Public Safety & Transit Impact', weight: 0.15, score: 45, contribution: 7, explanation: 'Low-speed retail traffic.' }
    ],
    reportCount: 2,
    sourceReportIds: ['REP-2026-224', 'REP-2026-225'],
    sourceReports: [rep224, rep225],
    status: 'Resolved',
    createdAt: '2026-09-28T09:15:00Z',
    updatedAt: '2026-09-30T16:30:00Z',
    recurrenceCount: 0,
    aiExplanation: {
      summary: 'Priority was Low (35/100). The minor asphalt defect on Geeta Bhawan Road was safely repaired by IMC road patch truck with hot mastic asphalt.',
      recommendedAction: 'Pothole milled and compacted flush with roadway pavement. Completed on 2026-09-30.',
      generatedAt: '2026-09-30T16:30:00Z',
      modelUsed: 'gemini-3.8-flash'
    },
    timeline: [
      { id: 'TL-112-1', timestamp: '2026-09-28T09:15:00Z', status: 'Pending', actor: 'Citizen Portal', notes: 'Report submitted.' },
      { id: 'TL-112-2', timestamp: '2026-09-29T14:00:00Z', status: 'Assigned', actor: 'Dispatch Officer', notes: 'Assigned to patch truck.' },
      { id: 'TL-112-3', timestamp: '2026-09-30T16:30:00Z', status: 'Resolved', actor: 'Road Patch Crew', notes: 'Filled and leveled with hot mastic asphalt.' }
    ],
    assignedCrew: 'IMC Rapid Pothole Patch Crew #5',
    resolutionNotes: 'Filled and tamped with hot-mix asphalt. Surface sealed against water ingress.',
    isDemo: true
  };

  const incidents: Incident[] = [
    inc101,
    inc102,
    inc103,
    inc104,
    inc105,
    inc106,
    inc107,
    inc108,
    inc109,
    inc110,
    inc111,
    inc112
  ];

  const reports: CitizenReport[] = [
    rep201, rep202, rep203, rep204,
    rep205, rep206, rep207,
    rep208, rep209, rep210,
    rep211, rep212, rep213,
    rep214, rep215,
    rep216, rep217,
    rep218, rep219,
    rep220,
    rep221,
    rep222,
    rep223,
    rep224, rep225
  ];

  return { incidents, reports };
}
