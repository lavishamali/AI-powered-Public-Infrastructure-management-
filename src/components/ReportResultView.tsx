import React from 'react';
import {
  CheckCircle2,
  GitMerge,
  ShieldAlert,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  Flame,
  FileText,
  LayoutDashboard,
  RotateCcw
} from 'lucide-react';
import { CitizenReport, Incident } from '../types/index.js';

interface ReportResultViewProps {
  report: CitizenReport;
  incident: Incident;
  isDuplicate: boolean;
  duplicateProbability: number;
  matchingFactors: string[];
  onTrackReport: (reportId: string) => void;
  onOpenIncident: (incident: Incident) => void;
  onNewReport: () => void;
}

export const ReportResultView: React.FC<ReportResultViewProps> = ({
  report,
  incident,
  isDuplicate,
  duplicateProbability,
  matchingFactors,
  onTrackReport,
  onOpenIncident,
  onNewReport
}) => {
  const isCritical = incident.priorityLevel === 'Critical';
  const isHigh = incident.priorityLevel === 'High';

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6">
      {/* Success banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-sm ring-4 ring-emerald-50">
          <CheckCircle2 className="w-9 h-9" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Report Registered Successfully
        </h1>

        <p className="text-slate-600 text-sm max-w-lg mx-auto">
          Your civic infrastructure evidence has been cataloged, analyzed by multimodal AI, and routed into the municipal prioritization queue.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 bg-slate-100 text-slate-800 px-4 py-2 rounded-xl font-mono text-sm font-bold border border-slate-200">
          <span>Report ID:</span>
          <span className="text-blue-600 font-extrabold">{report.id}</span>
        </div>
      </div>

      {/* DUPLICATE / CONSOLIDATION STATUS CARD (KEY DIFFERENTIATOR) */}
      <div
        className={`rounded-2xl border p-6 mb-6 shadow-sm ${
          isDuplicate
            ? 'bg-purple-50/70 border-purple-200 text-purple-950'
            : 'bg-blue-50/70 border-blue-200 text-blue-950'
        }`}
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              isDuplicate
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
            }`}
          >
            {isDuplicate ? (
              <GitMerge className="w-6 h-6" />
            ) : (
              <Layers className="w-6 h-6" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
              <span
                className={`text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  isDuplicate
                    ? 'bg-purple-200 text-purple-900'
                    : 'bg-blue-200 text-blue-900'
                }`}
              >
                {isDuplicate
                  ? `Consolidated Duplicate (${duplicateProbability}% Match)`
                  : 'New Verified Incident Created'}
              </span>

              <span className="text-xs font-mono font-bold text-slate-600">
                Incident #{incident.id}
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-1">
              {isDuplicate
                ? `Linked to Active Municipal Incident #${incident.id}`
                : `Registered as Master Incident #${incident.id}`}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              {isDuplicate
                ? `Rather than creating a redundant ticket, CivicVision AI consolidated your submission with existing reports from this coordinate. This boosted the incident's report count to ${incident.reportCount} citizen reports and escalated its priority score to ${incident.priorityScore}/100.`
                : `No existing active incidents were found within this physical radius. A new master incident has been initialized with baseline priority score ${incident.priorityScore}/100.`}
            </p>

            {/* Contributing Matching Factors */}
            {matchingFactors && matchingFactors.length > 0 && (
              <div className="bg-white/80 rounded-xl p-3 border border-purple-100 text-xs space-y-1">
                <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                  Consolidation Evidence Signals:
                </span>
                {matchingFactors.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DETAILED INCIDENT & TRIAGE SUMMARY */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm mb-6 space-y-6">
        <h3 className="font-extrabold text-slate-900 text-base pb-3 border-b border-slate-100 flex items-center justify-between">
          <span>Automated Assessment Summary</span>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              incident.status === 'Resolved'
                ? 'bg-emerald-100 text-emerald-800'
                : incident.status === 'Assigned'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-amber-100 text-amber-800'
            }`}
          >
            Status: {incident.status}
          </span>
        </h3>

        {/* 4-Stat Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Hazard Category</span>
            <span className="font-extrabold text-sm text-slate-900 mt-0.5 block">
              {incident.issueType}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">AI Vision Confidence</span>
            <span className="font-extrabold text-sm text-emerald-600 mt-0.5 block">
              {report.aiAnalysis.confidence}%
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Physical Severity</span>
            <span className="font-extrabold text-sm text-amber-600 mt-0.5 block">
              {report.severity.level} ({report.severity.score}/100)
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block">Composite Priority</span>
            <span
              className={`font-black text-sm mt-0.5 block ${
                isCritical
                  ? 'text-rose-600'
                  : isHigh
                  ? 'text-orange-600'
                  : 'text-amber-600'
              }`}
            >
              {incident.priorityLevel} ({incident.priorityScore}/100)
            </span>
          </div>
        </div>

        {/* Location & Observations */}
        <div className="space-y-3 text-xs">
          <div className="flex items-start gap-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
            <MapPin className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-bold text-slate-800">Verified Location Details:</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  (report.location.source === 'gps' || report.locationSource === 'gps')
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : (report.location.source === 'manual' || report.locationSource === 'manual')
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                }`}>
                  Source: {(report.location.source === 'gps' || report.locationSource === 'gps') ? 'Real GPS' : (report.location.source === 'manual' || report.locationSource === 'manual') ? 'Manual Map' : 'Demo Data'}
                </span>
              </div>
              <div className="text-slate-900 font-semibold">
                {report.location.city || 'Indore'}{report.location.state ? `, ${report.location.state}` : ''}{report.location.country ? `, ${report.location.country}` : ''}
              </div>
              <div className="text-slate-600 text-[11px] mt-0.5">
                {report.location.address}
              </div>
              <div className="text-slate-400 font-mono text-[10px] mt-1">
                Zone: {report.location.zone} &bull; Lat: {report.location.lat.toFixed(5)}, Lng: {report.location.lng.toFixed(5)}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="font-bold text-slate-800 block mb-1">AI Factual Observations:</span>
            <p className="text-slate-600 leading-relaxed">
              {report.aiAnalysis.observations}
            </p>
          </div>

          {incident.aiExplanation?.summary && (
            <div className="bg-blue-50/60 p-3.5 rounded-xl border border-blue-200">
              <div className="flex items-center gap-1.5 text-blue-900 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Executive Priority Rationale:</span>
              </div>
              <p className="text-blue-950 leading-relaxed">
                {incident.aiExplanation.summary}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onNewReport}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl text-xs transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Submit Another Report</span>
        </button>

        <div className="w-full sm:w-auto flex items-center gap-2">
          <button
            onClick={() => onTrackReport(report.id)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-3 rounded-xl text-xs transition-colors shadow"
          >
            <FileText className="w-4 h-4 text-slate-300" />
            <span>Track Report Status</span>
          </button>

          <button
            onClick={() => onOpenIncident(incident)}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-3 rounded-xl text-xs transition-colors shadow shadow-blue-900/20"
          >
            <LayoutDashboard className="w-4 h-4 text-blue-200" />
            <span>View in Authority Dashboard &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
