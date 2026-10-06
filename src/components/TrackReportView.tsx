import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  AlertTriangle,
  GitMerge,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { CitizenReport, Incident } from '../types/index.js';

interface TrackReportViewProps {
  reports: CitizenReport[];
  incidents: Incident[];
  onOpenIncident: (incident: Incident) => void;
  initialReportId?: string;
}

export const TrackReportView: React.FC<TrackReportViewProps> = ({
  reports,
  incidents,
  onOpenIncident,
  initialReportId = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialReportId || '');
  const [selectedReport, setSelectedReport] = useState<CitizenReport | null>(
    reports.find((r) => r.id === initialReportId) || reports[0] || null
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    if (!q) return;

    // Search by report ID or linked incident ID
    const found = reports.find(
      (r) =>
        r.id.toLowerCase() === q ||
        r.linkedIncidentId?.toLowerCase() === q ||
        r.description.toLowerCase().includes(q)
    );

    if (found) {
      setSelectedReport(found);
    } else {
      alert(`No report found matching "${searchQuery}". Try selecting from recent reports list below.`);
    }
  };

  const linkedIncident = selectedReport?.linkedIncidentId
    ? incidents.find((i) => i.id === selectedReport.linkedIncidentId)
    : null;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-2">
            <Search className="w-3.5 h-3.5 text-blue-600" />
            Citizen Tracking Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Track Citizen Infrastructure Report
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            Enter your Report ID to check AI verification status, duplicate consolidation details, and real-time public works repair progress.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. REP-2026-201 or INC-2026-101..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm transition-colors shadow"
          >
            Track Status
          </button>
        </form>

        {/* Quick Click Demo Report Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold mr-1">
            Quick inspection presets:
          </span>
          {reports.slice(0, 5).map((rep) => (
            <button
              key={rep.id}
              onClick={() => {
                setSearchQuery(rep.id);
                setSelectedReport(rep);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium border transition-all ${
                selectedReport?.id === rep.id
                  ? 'bg-blue-600 text-white border-blue-600 font-bold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {rep.id} ({rep.aiAnalysis.detectedIssue})
            </button>
          ))}
        </div>
      </div>

      {/* Selected Report Inspection View */}
      {selectedReport ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Report Evidence & Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-slate-500 block">
                    Report Reference
                  </span>
                  <span className="text-xl font-mono font-black text-slate-900">
                    {selectedReport.id}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${
                      selectedReport.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : selectedReport.status === 'In Progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : selectedReport.status === 'Assigned'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              {/* Photo Evidence with Bounding Box Overlay if present */}
              <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 max-h-80 mb-4">
                <img
                  src={selectedReport.imageUrl}
                  alt={selectedReport.description}
                  className="w-full h-full object-cover max-h-80 mx-auto"
                />

                {selectedReport.aiAnalysis.detectedRegions?.map((box, idx) => (
                  <div
                    key={idx}
                    className="absolute border-2 border-rose-500 bg-rose-500/20 rounded pointer-events-none"
                    style={{
                      left: `${box.x}%`,
                      top: `${box.y}%`,
                      width: `${box.width}%`,
                      height: `${box.height}%`
                    }}
                  >
                    <span className="absolute -top-5 left-0 bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Citizen Notes & Address */}
              <div className="space-y-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Citizen Observation:</span>
                  <p className="text-slate-800 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    "{selectedReport.description}"
                  </p>
                </div>

                <div className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-slate-800">Reported Location:</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        (selectedReport.location.source === 'gps' || selectedReport.locationSource === 'gps')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : (selectedReport.location.source === 'manual' || selectedReport.locationSource === 'manual')
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {(selectedReport.location.source === 'gps' || selectedReport.locationSource === 'gps') ? 'Source: Real GPS' : (selectedReport.location.source === 'manual' || selectedReport.locationSource === 'manual') ? 'Source: Manual Map' : 'Demo Data'}
                      </span>
                    </div>
                    <div className="text-slate-900 font-semibold text-xs">
                      {selectedReport.location.city || 'Indore'}, {selectedReport.location.state || 'Madhya Pradesh'}, {selectedReport.location.country || 'India'}
                    </div>
                    <span className="text-slate-600 text-xs block">{selectedReport.location.address}</span>
                    <span className="text-slate-400 block font-mono text-[10px] mt-0.5">
                      Zone: {selectedReport.location.zone} &bull; Coordinates: {selectedReport.location.lat.toFixed(5)}, {selectedReport.location.lng.toFixed(5)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Submitted on {new Date(selectedReport.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* AI Verification Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-extrabold text-slate-900 text-sm mb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Multimodal AI Verification Metrics</span>
              </h3>

              <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Detected Issue</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedReport.aiAnalysis.detectedIssue}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">AI Confidence</span>
                  <span className="font-bold text-emerald-600 text-sm">
                    {selectedReport.aiAnalysis.confidence}%
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[11px] text-slate-500 block">Damage Severity</span>
                  <span className="font-bold text-amber-600 text-sm">
                    {selectedReport.severity.level} ({selectedReport.severity.score}/100)
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                <strong className="text-slate-800">Visual Diagnostics:</strong> {selectedReport.aiAnalysis.observations}
              </p>
            </div>
          </div>

          {/* Right Column: Linked Master Incident & Resolution Status */}
          <div className="space-y-6">
            {linkedIncident ? (
              <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 p-6 shadow-md">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <GitMerge className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">
                      Consolidated Incident
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{linkedIncident.id}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white mb-2">
                  {linkedIncident.title}
                </h4>

                <div className="space-y-2.5 text-xs text-slate-300 mb-4">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Priority Urgency:</span>
                    <span className="font-bold text-rose-400">
                      {linkedIncident.priorityLevel} ({linkedIncident.priorityScore}/100)
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Corroborating Reports:</span>
                    <span className="font-bold text-white">
                      {linkedIncident.reportCount} independent citizens
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Assigned Maintenance:</span>
                    <span className="font-medium text-slate-200">
                      {linkedIncident.assignedCrew || 'Awaiting crew assignment'}
                    </span>
                  </div>
                </div>

                {linkedIncident.resolutionNotes && (
                  <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200">
                    <strong className="block text-emerald-400 mb-0.5">Resolution Notes:</strong>
                    {linkedIncident.resolutionNotes}
                  </div>
                )}

                <button
                  onClick={() => onOpenIncident(linkedIncident)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow"
                >
                  <span>Inspect Master Incident #{linkedIncident.id}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">
                  Awaiting Incident Consolidation
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Report is currently in ingestion queue.
                </p>
              </div>
            )}

            {/* Incident Timeline Progress */}
            {linkedIncident && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Public Works Resolution Timeline</span>
                </h4>

                <div className="relative border-l-2 border-slate-200 ml-2 space-y-4 text-xs">
                  {linkedIncident.timeline.map((evt, idx) => (
                    <div key={idx} className="relative pl-5">
                      <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-800 text-[11px]">
                          {evt.status}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                        {evt.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">
            No Report Selected
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Search with a Report ID above or click one of the quick presets.
          </p>
        </div>
      )}
    </div>
  );
};
