import { IssueType, LocationContext, LocationData } from '../types/index.js';

export interface SampleEvidence {
  id: string;
  title: string;
  issueType: IssueType;
  imageUrl: string;
  defaultDescription: string;
  location: LocationData;
  notes: string;
  testScenario: 'Duplicate Test' | 'New Critical Hazard' | 'Moderate Maintenance';
}

// Center coordinates: Indore, Madhya Pradesh, India
const baseLat = 22.7196;
const baseLng = 75.8577;

export const SAMPLE_EVIDENCE_ITEMS: SampleEvidence[] = [
  {
    id: 'sample-pothole-school',
    title: 'Pothole on AB Road (Duplicate Test)',
    issueType: 'Pothole',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
    defaultDescription: 'Dangerous pothole right in front of IPS school gate on AB Road, Indore. Two-wheelers skidding.',
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
    notes: 'Submitting this report will trigger DUPLICATE CONSOLIDATION into active master incident INC-2026-101 (~18m away)!',
    testScenario: 'Duplicate Test'
  },
  {
    id: 'sample-drain-flooding',
    title: 'Overflowing Sewage Drain on MG Road (Duplicate Test)',
    issueType: 'Overflowing Drain',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?auto=format&fit=crop&w=800&q=80',
    defaultDescription: 'Drain cover overflowing with dark wastewater into the street at Rajwada Market, Indore.',
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
    notes: 'Submitting this report matches existing incident INC-2026-102 and increases its report count and priority!',
    testScenario: 'Duplicate Test'
  },
  {
    id: 'sample-broken-streetlight',
    title: 'Broken Streetlight in Vijay Nagar',
    issueType: 'Broken Streetlight',
    imageUrl: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    defaultDescription: 'Streetlight pole head is cracked and unlit. Very dark section on Scheme 54, Vijay Nagar, Indore.',
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
    notes: 'Consolidates with active master incident INC-2026-103 in Vijay Nagar.',
    testScenario: 'Duplicate Test'
  },
  {
    id: 'sample-hospital-sinkhole',
    title: 'New Severe Road Damage near MY Hospital (New Incident)',
    issueType: 'Road Damage',
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    defaultDescription: 'Major road subsidence forming directly in emergency ambulance lane approaching Maharaja Yeshwantrao (MY) Hospital.',
    location: {
      lat: 22.7165,
      lng: 75.8685,
      address: 'MY Hospital Emergency Gate Road, Indore',
      city: 'Indore',
      state: 'Madhya Pradesh',
      country: 'India',
      source: 'demo',
      zone: 'Hospital Corridor',
      landmark: 'Maharaja Yeshwantrao Hospital'
    },
    notes: 'Creates a brand new CRITICAL incident due to Hospital Corridor zone weighting and severe asphalt subsidence.',
    testScenario: 'New Critical Hazard'
  },
  {
    id: 'sample-sidewalk-trip',
    title: 'Damaged Sidewalk at Super Corridor Metro',
    issueType: 'Damaged Sidewalk',
    imageUrl: 'https://images.unsplash.com/photo-1584463699042-45a8d9a4f4d2?auto=format&fit=crop&w=800&q=80',
    defaultDescription: 'Shattered concrete pavement slabs creating trip ledge by Super Corridor Metro turnstiles approach.',
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
    notes: 'Demonstrates pedestrian accessibility hazard triage in India.',
    testScenario: 'Duplicate Test'
  },
  {
    id: 'sample-garbage-dump',
    title: 'Illegal Waste Dumping in Old Palasia',
    issueType: 'Garbage Accumulation',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    defaultDescription: 'Bulk garbage bags and packing debris dumped in service lane behind Old Palasia shops.',
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
    notes: 'Shows lower priority alleyway triage versus arterial transit roads.',
    testScenario: 'Moderate Maintenance'
  }
];
