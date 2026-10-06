import React from 'react';
import {
  ShieldAlert,
  Cpu,
  GitMerge,
  TrendingUp,
  MapPin,
  CheckCircle2,
  FileCheck,
  Flame,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AboutView: React.FC<{ onStartDemo: () => void }> = ({ onStartDemo }) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-10">
      {/* Overview Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 sm:p-10 shadow-xl border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-4">
          <ShieldAlert className="w-4 h-4 text-blue-400" />
          <span>Municipal Infrastructure System Architecture</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-3">
          CivicVision AI
        </h1>
        <p className="text-lg text-amber-400 font-bold uppercase tracking-wider text-xs mb-4">
          Detect &bull; Verify &bull; Prioritize &bull; Resolve
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          The core differentiator of CivicVision AI is: <strong className="text-white">"Do not merely detect infrastructure problems. Convert scattered citizen reports and visual evidence into verified, consolidated, and intelligently prioritized incidents."</strong>
        </p>

        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-wrap gap-4">
          <button
            onClick={onStartDemo}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition shadow"
          >
            <span>Run Hackathon Evaluation Scenario</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SECTION 1: THE CORE PROBLEM & OUR DIFFERENTIATOR */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          1. The Municipal Challenge
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
          Public infrastructure problems like potholes, broken streetlights, overflowing drains, garbage accumulation, damaged sidewalks, and downed signs are traditionally reported across disparate call centers, email portals, and social media.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Scattered Reports</span>
            <p className="text-slate-600">
              Citizens flood municipal channels with 20 separate complaints for the same pothole near a school gate, creating ticket fatigue.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Arbitrary Priority</span>
            <p className="text-slate-600">
              Requests are handled by timestamp ("first come, first served") rather than physical hazard danger or high-transit zone exposure.
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-900 block mb-1">Black Box AI Hallucinations</span>
            <p className="text-slate-600">
              Generic LLM wrappers invent severity numbers or hallucinate fake repair urgency. CivicVision AI enforces deterministic mathematics.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 2: ARCHITECTURE & ALGORITHMS */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          2. The Intelligence Engines
        </h2>

        {/* Engine 1: Multimodal AI */}
        <div className="border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
            <Cpu className="w-5 h-5" />
            <h3>A. Multimodal AI Image Understanding (Gemini 3.8 Flash)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Uploaded citizen photos are evaluated via the modern Google GenAI TypeScript SDK (<code>gemini-3.8-flash</code>). The model detects the primary civic category from 8 target classes, outputs a calibrated confidence score, and provides factual visual defect observations.
          </p>
        </div>

        {/* Engine 2: Duplicate Detection */}
        <div className="border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
            <GitMerge className="w-5 h-5" />
            <h3>B. Multi-Signal Duplicate Report Consolidation Engine</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rather than relying solely on fuzzy text, duplicate detection evaluates 4 simultaneous signals:
          </p>
          <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1">
            <li><strong>Geospatial Proximity (50% weight):</strong> Haversine spherical distance. Reports within 35m get maximum correlation; drops past 150m.</li>
            <li><strong>Category Compatibility (30% weight):</strong> Ensures "Broken Streetlight" is never merged with a "Pothole" at the same GPS point.</li>
            <li><strong>Semantic Token Similarity (20% weight):</strong> Jaccard keyword overlap comparing cross streets, landmarks, and damage descriptions.</li>
            <li><strong>Active Lifecycle Filter:</strong> Only groups against active, unresolved master incidents.</li>
          </ul>
        </div>

        {/* Engine 3: Deterministic Priority Engine */}
        <div className="border border-slate-200 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
            <TrendingUp className="w-5 h-5" />
            <h3>C. Deterministic 5-Factor Priority Engine (The USP)</h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Priority Score (0–100) is calculated deterministically through configurable weights:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl font-mono text-xs text-slate-800 space-y-1 border border-slate-200">
            <div><strong>Priority Score Formula:</strong></div>
            <div className="text-rose-700 font-bold">
              Priority = (Severity &times; 0.40) + (ReportCount &times; 0.20) + (ZoneExposure &times; 0.15) + (Recurrence &times; 0.10) + (PublicImpact &times; 0.15)
            </div>
          </div>
          <p className="text-xs text-slate-600">
            Authorities can customize these weights in real-time in the Authority Dashboard to re-rank the municipal queue during seasonal storms or school semester reopenings.
          </p>
        </div>
      </section>

      {/* SECTION 3: HACKATHON EVALUATION SCENARIO GUIDE */}
      <section className="bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-300 p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">
              Step-by-Step Demonstration
            </span>
            <h2 className="text-xl font-extrabold text-slate-900">
              Hackathon Evaluation Walkthrough
            </h2>
          </div>
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
            17-Step Scenario
          </span>
        </div>

        <div className="space-y-3 text-xs">
          {[
            { step: '1', title: 'Citizen uploads photo', desc: 'Go to "Report an Issue" and select the pre-loaded sample "Pothole near School Gate (Duplicate Test)".' },
            { step: '2', title: 'AI identifies issue', desc: 'CivicVision AI identifies "Pothole" and displays 94%+ confidence.' },
            { step: '3', title: 'Factual observations', desc: 'Model generates factual physical observations regarding crater depth and road surface fracture.' },
            { step: '4', title: 'Severity calculation', desc: 'Severity Engine calculates 88/100 (Critical) based on pavement damage and School Zone vulnerability.' },
            { step: '5', title: 'Citizen location stored', desc: 'Coordinates (Elm St School Zone) are geo-tagged and displayed on the interactive map.' },
            { step: '6-8', title: 'Duplicate consolidation triggered', desc: 'Click "Analyze & Submit Report". The system identifies active master incident INC-2026-101 (18m away) and consolidates without creating a redundant ticket!' },
            { step: '9-10', title: 'Report count & Priority escalation', desc: 'INC-2026-101 report count increments to 5 independent citizens, and Priority recalculates to 95/100.' },
            { step: '11-13', title: 'Authority Dashboard & Map', desc: 'Switch to "Authority Dashboard". Incident INC-2026-101 is ranked #1 in the Priority Queue and pulsing red on the Map.' },
            { step: '14-15', title: 'Inspect evidence & AI explanation', desc: 'Click "Inspect". View consolidated photo gallery, transparent priority factors, and AI-generated dispatch directive.' },
            { step: '16-17', title: 'Resolution workflow update', desc: 'Change status from Verified → Assigned → In Progress → Resolved. Notice real-time timeline audit trail and dashboard KPI update!' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center shrink-0 text-xs">
                {item.step}
              </span>
              <div>
                <strong className="text-slate-900 block font-bold text-xs">{item.title}</strong>
                <span className="text-slate-600 text-xs">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
