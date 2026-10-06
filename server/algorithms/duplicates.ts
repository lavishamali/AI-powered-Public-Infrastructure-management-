import { Incident, IssueType, DuplicateDetectionResult } from '../../src/types/index.js';

// Haversine distance in meters
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

// Issue compatibility matrix (0.0 to 1.0)
function getIssueCompatibility(type1: IssueType, type2: IssueType): number {
  if (type1 === type2) return 1.0;

  const compatiblePairs: Record<string, string[]> = {
    'Pothole': ['Road Damage'],
    'Road Damage': ['Pothole', 'Damaged Sidewalk'],
    'Damaged Sidewalk': ['Road Damage'],
    'Broken Streetlight': ['Other'],
    'Overflowing Drain': ['Road Damage', 'Garbage Accumulation'],
    'Garbage Accumulation': ['Overflowing Drain']
  };

  if (compatiblePairs[type1]?.includes(type2) || compatiblePairs[type2]?.includes(type1)) {
    return 0.70;
  }

  return 0.0;
}

// Text similarity using token Jaccard & keyword extraction
function calculateTextSimilarity(text1: string, text2: string): { score: number; sharedKeywords: string[] } {
  const stopWords = new Set([
    'a', 'an', 'the', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'there', 'this', 'that', 'it', 'very', 'near', 'beside', 'front'
  ]);

  const cleanWords = (text: string) =>
    text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 2 && !stopWords.has(w));

  const words1 = new Set(cleanWords(text1));
  const words2 = new Set(cleanWords(text2));

  if (words1.size === 0 || words2.size === 0) {
    return { score: 0.1, sharedKeywords: [] };
  }

  const intersection: string[] = [];
  words1.forEach((w) => {
    if (words2.has(w)) intersection.push(w);
  });

  const union = new Set([...words1, ...words2]);
  const jaccard = intersection.length / union.size;

  return {
    score: Math.min(1.0, jaccard * 1.6), // slight scaling boost for concise civic queries
    sharedKeywords: intersection
  };
}

export function detectDuplicateIncident(
  newReport: {
    issueType: IssueType;
    description: string;
    lat: number;
    lng: number;
  },
  existingIncidents: Incident[]
): DuplicateDetectionResult {
  // Only match against unresolved incidents (Pending, Verified, Assigned, In Progress)
  const activeIncidents = existingIncidents.filter((inc) => inc.status !== 'Resolved');

  let bestMatch: {
    incident: Incident;
    probability: number;
    distance: number;
    factors: string[];
  } | null = null;

  for (const incident of activeIncidents) {
    const distanceMeters = calculateDistanceMeters(
      newReport.lat,
      newReport.lng,
      incident.location.lat,
      incident.location.lng
    );

    // If more than 250 meters away, strictly not the same physical incident
    if (distanceMeters > 250) {
      continue;
    }

    // 1. Proximity Score (0.0 to 1.0)
    let proximityScore = 0;
    if (distanceMeters <= 35) {
      proximityScore = 1.0;
    } else if (distanceMeters <= 75) {
      proximityScore = 0.85;
    } else if (distanceMeters <= 150) {
      proximityScore = 0.55;
    } else {
      proximityScore = 0.25;
    }

    // 2. Issue Type Compatibility (0.0 to 1.0)
    const issueScore = getIssueCompatibility(newReport.issueType, incident.issueType);
    if (issueScore === 0) {
      // Incompatible issues (e.g. broken streetlight vs pothole) at same coordinate are distinct
      continue;
    }

    // 3. Text & Landmark Similarity
    const textComp = calculateTextSimilarity(
      newReport.description,
      `${incident.title} ${incident.sourceReports.map((r) => r.description).join(' ')}`
    );

    // Weighted Probability Formula:
    // Spatial Proximity is dominant (50%), Issue Match (30%), Text Evidence (20%)
    const compositeProbability =
      proximityScore * 0.50 +
      issueScore * 0.30 +
      textComp.score * 0.20;

    const probabilityPct = Math.round(compositeProbability * 100);

    const factors: string[] = [];
    factors.push(`Geospatial proximity: ${distanceMeters}m from active incident #${incident.id}`);
    if (newReport.issueType === incident.issueType) {
      factors.push(`Identical issue classification: ${newReport.issueType}`);
    } else {
      factors.push(`Corroborating hazard profile: ${newReport.issueType} relates to ${incident.issueType}`);
    }

    if (textComp.sharedKeywords.length > 0) {
      factors.push(`Corroborating civic landmarks/keywords: "${textComp.sharedKeywords.slice(0, 4).join(', ')}"`);
    }

    if (probabilityPct >= 58) {
      if (!bestMatch || probabilityPct > bestMatch.probability) {
        bestMatch = {
          incident,
          probability: probabilityPct,
          distance: distanceMeters,
          factors
        };
      }
    }
  }

  if (bestMatch && bestMatch.probability >= 58) {
    return {
      isDuplicate: true,
      duplicateProbability: bestMatch.probability,
      matchedIncidentId: bestMatch.incident.id,
      matchedIncident: bestMatch.incident,
      matchingFactors: bestMatch.factors,
      distanceMeters: bestMatch.distance
    };
  }

  return {
    isDuplicate: false,
    duplicateProbability: bestMatch ? bestMatch.probability : 0,
    matchingFactors: ['No active incident matches this location and hazard signature within 250m radius'],
    distanceMeters: bestMatch ? bestMatch.distance : 9999
  };
}
