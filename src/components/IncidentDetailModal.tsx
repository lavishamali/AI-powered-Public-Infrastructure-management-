import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  ExternalLink,
  Flame,
  UserCheck,
  Check
} from 'lucide-react';
import { LeafletMap } from './LeafletMap.js';
import { Incident, IncidentStatus } from '../types/index.js';
import { updateIncidentStatus } from '../services/api.js';

interface IncidentDetailModalProps {
  incident: Incident;
  onClose: () => void;
  onIncidentUpdated: (updated: Incident) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onIncidentUpdated
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Status updating form state
  const [targetStatus, setTargetStatus] = useState<IncidentStatus>(incident.status);
  const [statusNotes, setStatusNotes] = useState('');
  const [assignedCrew, setAssignedCrew] = useState(incident.assignedCrew || '');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isCritical = incident.priorityLevel === 'Critical';
  const isHigh = incident.priorityLevel === 'High';

  const statuses: IncidentStatus[] = ['Pending', 'Verified', 'Assigned', 'In Progress', 'Resolved'];

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingStatus(true);
    setStatusMessage(null);

    try {
      const updated = await updateIncidentStatus(incident.id, {
        status: targetStatus,
        notes: statusNotes || `Status updated to ${targetStatus}`,
        actor: 'Municipal Dispatch Officer',
        assignedCrew: assignedCrew.trim() ? assignedCrew.trim() : undefined
      });

      onIncidentUpdated(updated);
      setStatusMessage(`Status updated to "${targetStatus}" successfully.`);
      setStatusNotes('');
    } catch (err: any) {
      alert('Error updating incident status: ' + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const currentPhoto = incident.sourceReports[selectedPhotoIndex] || incident.sourceReports[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-blue-400 bg-slate-800 px-2.5 py-1 rounded">
              #{incident.id}
            </span>
            <span
              className={`text-xs font-extrabold px-2.5 py-1 rounded uppercase tracking-wider ${
                incident.status === 'Resolved'
                  ? 'bg-emerald-600 text-white'
                  : isCritical
                  ? 'bg-rose-600 text-white'
                  : isHigh
                  ? 'bg-orange-600 text-white'
                  : 'bg-amber-600 text-white'
              }`}
            >
              Priority {incident.priorityScore}/100 &bull; {incident.priorityLevel}
            </span>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              {incident.issueType}
            </span>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
          {/* Incident Title & Header */}
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              {incident.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{incident.location.address} ({incident.location.zone})</span>
              </span>
              <span>&bull;</span>
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                (incident.location.source === 'gps' || incident.location.locationSource === 'gps')
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : (incident.location.source === 'manual' || incident.location.locationSource === 'manual')
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {(incident.location.source === 'gps' || incident.location.locationSource === 'gps') ? 'Source: Real GPS' : (incident.location.source === 'manual' || incident.location.locationSource === 'manual') ? 'Source: Manual Map' : 'Demo Data'}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Created: {new Date(incident.createdAt).toLocaleDateString()}</span>
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1 font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                <Layers className="w-3.5 h-3.5" />
                <span>{incident.reportCount} Independent Citizen Reports</span>
              </span>
            </div>
          </div>

          {/* STATUS WORKFLOW STEPPER */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-3">
              Municipal Resolution Workflow
            </span>
            <div className="grid grid-cols-5 gap-1 text-center">
              {statuses.map((s, idx) => {
                const currentIdx = statuses.indexOf(incident.status);
                const isPassed = idx <= currentIdx;
                const isCurrent = s === incident.status;

                return (
                  <div key={s} className="flex flex-col items-center">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] mb-1.5 transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white ring-4 ring-blue-100 shadow'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed && !isCurrent ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                    </div>
                    <span
                      className={`text-[10px] tracking-tight ${
                        isCurrent
                          ? 'font-extrabold text-blue-700'
                          : isPassed
                          ? 'font-bold text-slate-800'
                          : 'text-slate-400'
                      }`}
                    >
                      {s}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI FACTUAL EXPLANATION & RECOMMENDED ACTION */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-5 rounded-2xl shadow-md space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-blue-800/80">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="font-extrabold text-xs uppercase tracking-wider text-cyan-300">
                  AI Priority Synthesis &bull; Verified Data Only
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">
                Model: {incident.aiExplanation?.modelUsed || 'gemini-3.8-flash'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-medium">
              "{incident.aiExplanation?.summary || 'Automated multi-factor priority analysis based on verified severity metrics and citizen report volume.'}"
            </p>

            <div className="pt-2 border-t border-blue-800/60 flex items-start gap-2 text-cyan-200 text-xs">
              <strong className="text-white shrink-0">Recommended Action:</strong>
              <span>{incident.aiExplanation?.recommendedAction}</span>
            </div>
          </div>

          {/* 2 COLUMNS: Visual Evidence & Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Citizen Photo Gallery */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Consolidated Evidence Gallery ({incident.sourceReports.length} photos)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Photo {selectedPhotoIndex + 1} of {incident.sourceReports.length}
                </span>
              </div>

              {currentPhoto && (
                <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 h-60">
                  <img
                    src={currentPhoto.imageUrl}
                    alt={currentPhoto.description}
                    className="w-full h-full object-cover"
                  />
                  {currentPhoto.aiAnalysis.detectedRegions?.map((box, idx) => (
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
                      <span className="absolute -top-5 left-0 bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow">
                        {box.label}
                      </span>
                    </div>
                  ))}
                  <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[10px] font-mono">
                    {currentPhoto.id} &bull; {currentPhoto.aiAnalysis.detectedIssue} ({currentPhoto.aiAnalysis.confidence}%)
                  </div>
                </div>
              )}

              {/* Photo selector thumbnails */}
              {incident.sourceReports.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {incident.sourceReports.map((rep, idx) => (
                    <button
                      key={rep.id}
                      onClick={() => setSelectedPhotoIndex(idx)}
                      className={`w-14 h-14 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                        selectedPhotoIndex === idx
                          ? 'border-blue-600 ring-2 ring-blue-300'
                          : 'border-slate-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={rep.imageUrl} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Interactive Location Mini Map */}
            <div className="space-y-3">
              <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                Geospatial Coordinates &bull; {incident.location.zone}
              </span>
              <LeafletMap
                incidents={[incident]}
                center={[incident.location.lat, incident.location.lng]}
                zoom={16}
                height="240px"
              />
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div className="flex items-center justify-between font-mono text-slate-700">
                  <span>Lat: {incident.location.lat.toFixed(5)}</span>
                  <span>Lng: {incident.location.lng.toFixed(5)}</span>
                </div>
                <div className="text-slate-800 font-semibold">
                  {incident.location.city || 'Indore'}, {incident.location.state || 'Madhya Pradesh'}, {incident.location.country || 'India'}
                </div>
                <div className="text-slate-500 text-[10px]">
                  {incident.location.address} &bull; Zone: {incident.location.zone}
                </div>
              </div>
            </div>
          </div>

          {/* PRIORITY SCORING BREAKDOWN (TRANSPARENT FORMULA) */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center justify-between">
              <span>Deterministic Priority Calculation Breakdown (Score: {incident.priorityScore}/100)</span>
              <span className="font-mono text-blue-600 text-[11px]">Weights sum to 100%</span>
            </h3>

            <div className="space-y-2">
              {incident.priorityFactors.map((factor, idx) => (
                <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between font-bold text-slate-800 text-xs mb-1">
                    <span>{factor.factor} ({Math.round(factor.weight * 100)}% Weight)</span>
                    <span className="text-blue-600">
                      Score: {factor.score}/100 &bull; +{factor.contribution} pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {factor.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* ORIGINAL CITIZEN REPORTS (THE CONSOLIDATED SET) */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Original Citizen Submissions ({incident.sourceReports.length} Reports)
            </h3>

            <div className="space-y-2.5">
              {incident.sourceReports.map((r) => (
                <div key={r.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-600">{r.id}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        (r.location.source === 'gps' || r.locationSource === 'gps')
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : (r.location.source === 'manual' || r.locationSource === 'manual')
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {(r.location.source === 'gps' || r.locationSource === 'gps') ? 'Source: Real GPS' : (r.location.source === 'manual' || r.locationSource === 'manual') ? 'Source: Manual Map' : 'Demo Data'}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] font-mono">
                      {new Date(r.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-800 text-xs italic">
                    "{r.description}"
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>{r.location.address} &bull; Lat: {r.location.lat.toFixed(4)}, Lng: {r.location.lng.toFixed(4)}</span>
                  </div>
                  {r.matchingFactors && r.matchingFactors.length > 0 && (
                    <div className="text-[10px] text-purple-700 bg-purple-50 p-2 rounded-lg border border-purple-100 flex flex-wrap gap-2">
                      <span className="font-bold">Duplicate Match Signals:</span>
                      {r.matchingFactors.join(' | ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* AUDIT LOG TIMELINE */}
          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Chronological Audit Trail
            </h3>

            <div className="relative border-l-2 border-slate-200 ml-2 space-y-3 text-xs">
              {incident.timeline.map((evt, idx) => (
                <div key={idx} className="relative pl-5">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600"></div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-900">{evt.actor}</span>
                    <span className="text-slate-400 font-mono">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">{evt.notes}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AUTHORITY DISPATCH ACTION FORM */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Update Incident Status &amp; Dispatch Public Works Crew</span>
            </h3>

            {statusMessage && (
              <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-3 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Select Target Status
                  </label>
                  <select
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value as IncidentStatus)}
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Assigned Public Works Crew
                  </label>
                  <input
                    type="text"
                    value={assignedCrew}
                    onChange={(e) => setAssignedCrew(e.target.value)}
                    placeholder="e.g. District 2 Road Crew #4"
                    className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Dispatch or Resolution Notes
                </label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  rows={2}
                  placeholder="Enter details on work orders, equipment dispatched, or resolution confirmation..."
                  className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition shadow shadow-blue-950 text-xs"
                >
                  {isUpdatingStatus ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Saving Status...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Commit Status Update</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-100 px-6 py-3 flex items-center justify-between border-t border-slate-200 shrink-0 text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            Incident ID: {incident.id} &bull; Updated: {new Date(incident.updatedAt).toLocaleTimeString()}
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-lg transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
