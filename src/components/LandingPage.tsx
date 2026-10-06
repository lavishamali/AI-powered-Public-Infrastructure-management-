import React from 'react';
import {
  ShieldAlert,
  ArrowRight,
  ScanEye,
  GitMerge,
  BarChart3,
  MapPin,
  Clock,
  Sparkles,
  Flame,
  Construction,
  Layers,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Incident } from '../types/index.js';

interface LandingPageProps {
  onSelectTab: (tab: 'landing' | 'report' | 'track' | 'dashboard' | 'map' | 'about') => void;
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectTab,
  incidents,
  onSelectIncident
}) => {
  // Compute live system statistics from incidents
  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter((i) => i.priorityLevel === 'Critical' && i.status !== 'Resolved').length;
  const highCount = incidents.filter((i) => i.priorityLevel === 'High' && i.status !== 'Resolved').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;
  const totalReportsCount = incidents.reduce((acc, curr) => acc + curr.reportCount, 0);
  const consolidatedCount = totalReportsCount - totalIncidents;

  // Top urgent incidents for the live feed
  const topUrgent = incidents
    .filter((i) => i.status !== 'Resolved')
    .slice(0, 4);

  return (
    <div className="space-y-16 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16 text-white shadow-xl">
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#3B82F6 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 max-w-3xl">
          {/* Official badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-950/80 border border-blue-700/60 text-blue-300 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            <span>Civic Infrastructure Intelligence &amp; Triage Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight mb-4">
            CivicVision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">AI</span>
          </h1>

          <p className="text-xl sm:text-2xl font-semibold text-slate-200 mb-3 tracking-tight">
            AI-Powered Public Infrastructure Monitoring
          </p>

          <p className="text-lg font-bold text-amber-400 mb-6 tracking-wider uppercase text-sm">
            Detect &bull; Verify &bull; Prioritize &bull; Resolve
          </p>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-8 max-w-2xl font-normal">
            Do not merely detect infrastructure problems. Transform scattered citizen reports, photos, and video evidence into verified, consolidated incidents with intelligent deterministic priority scoring for public works authorities.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectTab('report')}
              className="inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldAlert className="w-5 h-5 text-blue-200" />
              <span>Report an Issue</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onSelectTab('dashboard')}
              className="inline-flex items-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-xl border border-slate-700 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <BarChart3 className="w-5 h-5 text-amber-400" />
              <span>Authority Dashboard</span>
            </button>

            <button
              onClick={() => onSelectTab('map')}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-semibold text-sm px-4 py-3 rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Explore Live Map</span>
            </button>
          </div>
        </div>

        {/* Live System Counter Pill */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">Consolidated Incidents</div>
            <div className="text-2xl font-extrabold text-white mt-1">{totalIncidents}</div>
            <div className="text-[11px] text-blue-400 font-semibold mt-0.5">Active triage database</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">Citizen Submissions</div>
            <div className="text-2xl font-extrabold text-white mt-1">{totalReportsCount}</div>
            <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">+{consolidatedCount} duplicates merged</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">Critical Priority Hazards</div>
            <div className="text-2xl font-extrabold text-rose-400 mt-1 flex items-center gap-1.5">
              <span>{criticalCount}</span>
              <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
            </div>
            <div className="text-[11px] text-rose-300 font-semibold mt-0.5">Immediate crew dispatch</div>
          </div>

          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-3.5">
            <div className="text-xs text-slate-400 font-medium">Municipal Resolutions</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{resolvedCount}</div>
            <div className="text-[11px] text-slate-400 font-semibold mt-0.5">Verified completed repairs</div>
          </div>
        </div>
      </section>

      {/* SECTION 2: END-TO-END PIPELINE WORKFLOW */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2">
            Automated Incident Life Cycle
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How CivicVision AI Works
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            From fragmented citizen photo reports to rapid municipal repair dispatch in five unified stages.
          </p>
        </div>

        {/* Visual Flow diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {/* Step 1 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-blue-400 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs mb-3">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Citizen Report</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Resident captures photo or short video with GPS coordinates and description.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-blue-700 font-semibold flex items-center gap-1">
              <span>Photo &amp; Geo-tag</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-blue-400 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 font-bold flex items-center justify-center text-xs mb-3">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">AI Detection</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multimodal Gemini 3.8 Flash classifies hazard category, damage extent, and visual regions.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-cyan-700 font-semibold flex items-center gap-1">
              <span>Vision &amp; Confidence</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-amber-400 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs mb-3">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Duplicate Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Multi-signal algorithm clusters proximity, issue type, and keywords to consolidate repeats.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-amber-700 font-semibold flex items-center gap-1">
              <span>Haversine &amp; Jaccard</span>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-rose-400 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs mb-3">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Intelligent Priority</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Deterministic formula evaluates severity (40%), report count (20%), school/hospital zone (15%), etc.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-rose-700 font-semibold flex items-center gap-1">
              <span>Score 0–100 Priority</span>
            </div>
          </div>

          {/* Step 5 */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-emerald-400 transition-colors">
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs mb-3">
                5
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Authority Action</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Public Works views ranked queue, reviews evidence, dispatches crew, and resolves with audit log.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
              <span>Dispatch &amp; Resolution</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: KEY DIFFERENTIATOR FEATURE CARDS */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Platform Core Capabilities
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Built specifically for modern municipal operations, city councils, and transportation departments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <ScanEye className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multimodal AI Detection</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Leverages Gemini 3.8 Flash multimodal vision to reliably identify potholes, damaged sidewalks, blocked drains, failing streetlights, and signage defects with factual damage assessments.
            </p>
            <div className="text-[11px] text-slate-500 font-medium space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span>Target Categories:</span>
                <span className="font-semibold text-slate-700">8 Civic Types</span>
              </div>
              <div className="flex justify-between">
                <span>Confidence Calibration:</span>
                <span className="font-semibold text-slate-700">Strictly Factual</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <GitMerge className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Multi-Signal Duplicate Detection</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Solves the #1 problem of municipal call centers: multiple citizens reporting the same physical problem. Clusters reports via geospatial distance, semantic keywords, and category matching.
            </p>
            <div className="text-[11px] text-slate-500 font-medium space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span>Proximity Matching:</span>
                <span className="font-semibold text-slate-700">Haversine Radius</span>
              </div>
              <div className="flex justify-between">
                <span>Incident Consolidation:</span>
                <span className="font-semibold text-purple-700 font-bold">1:N Architecture</span>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Deterministic Priority Engine</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Never delegates numerical triage to unpredictable LLMs. Calculates an objective 0–100 score based on physical damage, citizen corroboration, school/hospital zone vulnerability, and recurrence.
            </p>
            <div className="text-[11px] text-slate-500 font-medium space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div className="flex justify-between">
                <span>Formula Transparency:</span>
                <span className="font-semibold text-slate-700">100% Deterministic</span>
              </div>
              <div className="flex justify-between">
                <span>Configurable Weights:</span>
                <span className="font-semibold text-rose-700 font-bold">Authority Tunable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: LIVE PRIORITY QUEUE HIGHLIGHT */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold mb-1">
              <Flame className="w-3.5 h-3.5 text-rose-600" />
              Live Active Triage Stream
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Highest-Urgency Incidents in Municipal Queue
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked automatically by composite Priority Score. Click any incident to inspect evidence.
            </p>
          </div>

          <button
            onClick={() => onSelectTab('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3.5 py-2 rounded-lg transition-colors self-start sm:self-auto"
          >
            <span>Open Authority Dashboard</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {topUrgent.map((incident) => {
            const isCritical = incident.priorityLevel === 'Critical';
            const isHigh = incident.priorityLevel === 'High';

            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className="group cursor-pointer bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-blue-400 p-4 shadow-sm hover:shadow transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      #{incident.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                        isCritical
                          ? 'bg-rose-100 text-rose-700 border border-rose-300'
                          : isHigh
                          ? 'bg-orange-100 text-orange-700 border border-orange-300'
                          : 'bg-amber-100 text-amber-700 border border-amber-300'
                      }`}
                    >
                      {incident.priorityLevel} ({incident.priorityScore})
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
                    {incident.title}
                  </h4>

                  <p className="text-xs text-slate-500 flex items-center gap-1 line-clamp-1 mb-3">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{incident.location.address}</span>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {incident.reportCount} {incident.reportCount === 1 ? 'report' : 'reports'}
                  </span>
                  <span className="font-semibold text-blue-600 group-hover:underline text-[11px] flex items-center gap-0.5">
                    Inspect &rarr;
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: READY TO REPORT CALL TO ACTION */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 sm:p-10 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-black tracking-tight mb-2">
            Spot a Hazard on Your Street?
          </h3>
          <p className="text-blue-100 text-sm max-w-xl leading-relaxed">
            Report potholes, drainage backups, broken streetlights, or damaged sidewalks in 30 seconds. CivicVision AI instantly calculates severity and routes evidence to municipal maintenance crews.
          </p>
        </div>

        <button
          onClick={() => onSelectTab('report')}
          className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-105 active:scale-95 shrink-0 flex items-center gap-2"
        >
          <ShieldAlert className="w-5 h-5 text-blue-700" />
          <span>Submit Citizen Report</span>
        </button>
      </section>
    </div>
  );
};
