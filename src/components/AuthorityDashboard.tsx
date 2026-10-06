import React, { useState } from 'react';
import {
  BarChart3,
  Flame,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  Sliders,
  SlidersHorizontal,
  ChevronRight,
  MapPin,
  Clock,
  Layers,
  ArrowUpDown,
  RefreshCw,
  Eye,
  Check,
  Send
} from 'lucide-react';
import { LeafletMap } from './LeafletMap.js';
import {
  Incident,
  IssueType,
  SeverityLevel,
  PriorityLevel,
  IncidentStatus,
  PriorityWeights
} from '../types/index.js';
import { updatePriorityWeights } from '../services/api.js';

interface AuthorityDashboardProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onRefreshData: () => void;
  weights: PriorityWeights;
  onWeightsUpdated: (newWeights: PriorityWeights) => void;
}

export const AuthorityDashboard: React.FC<AuthorityDashboardProps> = ({
  incidents,
  onSelectIncident,
  onRefreshData,
  weights,
  onWeightsUpdated
}) => {
  // Filter states
  const [issueFilter, setIssueFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Priority Weights Modal / Drawer
  const [showWeightsDrawer, setShowWeightsDrawer] = useState<boolean>(false);
  const [editableWeights, setEditableWeights] = useState<PriorityWeights>({ ...weights });
  const [isSavingWeights, setIsSavingWeights] = useState<boolean>(false);

  // Sync weights when prop changes
  React.useEffect(() => {
    setEditableWeights({ ...weights });
  }, [weights]);

  // Apply filters
  const filteredIncidents = incidents.filter((incident) => {
    if (issueFilter !== 'All' && incident.issueType !== issueFilter) return false;
    if (severityFilter !== 'All' && incident.severityLevel !== severityFilter) return false;
    if (priorityFilter !== 'All' && incident.priorityLevel !== priorityFilter) return false;
    if (statusFilter !== 'All' && incident.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        incident.id.toLowerCase().includes(q) ||
        incident.title.toLowerCase().includes(q) ||
        incident.location.address.toLowerCase().includes(q) ||
        incident.issueType.toLowerCase().includes(q);
      if (!match) return false;
    }

    return true;
  });

  // Calculate top KPI statistics
  const totalCount = incidents.length;
  const criticalCount = incidents.filter((i) => i.priorityLevel === 'Critical' && i.status !== 'Resolved').length;
  const highCount = incidents.filter((i) => i.priorityLevel === 'High' && i.status !== 'Resolved').length;
  const mediumCount = incidents.filter((i) => i.priorityLevel === 'Medium' && i.status !== 'Resolved').length;
  const lowCount = incidents.filter((i) => i.priorityLevel === 'Low' && i.status !== 'Resolved').length;
  const resolvedCount = incidents.filter((i) => i.status === 'Resolved').length;

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingWeights(true);
    try {
      const updated = await updatePriorityWeights(editableWeights);
      onWeightsUpdated(updated);
      onRefreshData();
      setShowWeightsDrawer(false);
    } catch (err: any) {
      alert('Failed to update priority weights: ' + err.message);
    } finally {
      setIsSavingWeights(false);
    }
  };

  const handleResetDefaultWeights = () => {
    setEditableWeights({
      severityWeight: 0.40,
      reportsCountWeight: 0.20,
      locationWeight: 0.15,
      recurrenceWeight: 0.10,
      publicImpactWeight: 0.15
    });
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Top Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-bold mb-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
              Municipal Operations Command
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Authority Incident Triage Dashboard
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Consolidated infrastructure incidents ranked deterministically by public impact and citizen corroboration.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowWeightsDrawer(true)}
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              <span>Tune Priority Weights</span>
            </button>

            <button
              onClick={onRefreshData}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors shadow shadow-blue-900/20"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Refresh Queue</span>
            </button>
          </div>
        </div>

        {/* 6 TOP KPI CARDS */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Total */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Total Incidents
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalCount}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">All recorded hotspots</span>
          </div>

          {/* Critical */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
                Critical (80-100)
              </span>
              <Flame className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <span className="text-2xl font-black text-rose-600 mt-1 block">
              {criticalCount}
            </span>
            <span className="text-[10px] text-rose-500 font-semibold">Immediate triage order</span>
          </div>

          {/* High */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-orange-700 uppercase tracking-wider block">
              High (60-79)
            </span>
            <span className="text-2xl font-black text-orange-600 mt-1 block">
              {highCount}
            </span>
            <span className="text-[10px] text-orange-500 font-semibold">Next 24h work order</span>
          </div>

          {/* Medium */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              Medium (40-59)
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {mediumCount}
            </span>
            <span className="text-[10px] text-amber-600 font-medium">Routine maintenance</span>
          </div>

          {/* Low */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider block">
              Low (0-39)
            </span>
            <span className="text-2xl font-black text-blue-600 mt-1 block">
              {lowCount}
            </span>
            <span className="text-[10px] text-blue-500 font-medium">Scheduled cycle</span>
          </div>

          {/* Resolved */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Resolved
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {resolvedCount}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold">Repairs verified</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE GEOSPATIAL MAP OVERVIEW */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Municipal Geospatial Map &bull; Live Hotspots</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pins are color-coded by composite priority score. Click any pin to inspect incident summary.
            </p>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-600">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
              Critical (80+)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span>
              High (60-79)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Medium (40-59)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
              Low (0-39)
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              Resolved
            </span>
          </div>
        </div>

        <LeafletMap
          incidents={filteredIncidents}
          onSelectIncident={onSelectIncident}
          height="400px"
        />
      </div>

      {/* FILTERING TOOLBAR & SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID (#INC-101), street, or keyword..."
              className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dropdown Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Issue Type */}
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Issues</option>
              <option value="Pothole">Potholes</option>
              <option value="Road Damage">Road Damage</option>
              <option value="Broken Streetlight">Broken Streetlight</option>
              <option value="Overflowing Drain">Overflowing Drain</option>
              <option value="Garbage Accumulation">Garbage Accumulation</option>
              <option value="Damaged Sidewalk">Damaged Sidewalk</option>
              <option value="Damaged Signage">Damaged Signage</option>
              <option value="Other">Other</option>
            </select>

            {/* Severity */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Severity</option>
              <option value="Critical">Critical Severity</option>
              <option value="High">High Severity</option>
              <option value="Medium">Medium Severity</option>
              <option value="Low">Low Severity</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical Priority (80+)</option>
              <option value="High">High Priority (60-79)</option>
              <option value="Medium">Medium Priority (40-59)</option>
              <option value="Low">Low Priority (0-39)</option>
            </select>

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Verified">Verified</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Reset Filters button */}
            {(issueFilter !== 'All' || severityFilter !== 'All' || priorityFilter !== 'All' || statusFilter !== 'All' || searchQuery) && (
              <button
                onClick={() => {
                  setIssueFilter('All');
                  setSeverityFilter('All');
                  setPriorityFilter('All');
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
                className="text-blue-600 hover:text-blue-800 text-xs font-semibold px-2 py-1"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        <div className="text-xs text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
          <span>Showing <strong>{filteredIncidents.length}</strong> of {incidents.length} incidents</span>
          <span className="font-medium text-slate-600">Ranked by Priority Score descending (highest urgency first)</span>
        </div>
      </div>

      {/* PRIORITY QUEUE TABLE & LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-wider font-extrabold">
              <tr>
                <th className="py-3.5 px-4">Priority Rank</th>
                <th className="py-3.5 px-4">Incident ID &amp; Issue</th>
                <th className="py-3.5 px-4">Physical Severity</th>
                <th className="py-3.5 px-4">Citizen Reports</th>
                <th className="py-3.5 px-4">Location (City &amp; Zone)</th>
                <th className="py-3.5 px-4">Source</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredIncidents.length > 0 ? (
                filteredIncidents.map((incident, idx) => {
                  const isCritical = incident.priorityLevel === 'Critical';
                  const isHigh = incident.priorityLevel === 'High';
                  const isResolved = incident.status === 'Resolved';

                  return (
                    <tr
                      key={incident.id}
                      onClick={() => onSelectIncident(incident)}
                      className="hover:bg-blue-50/40 cursor-pointer transition-colors group"
                    >
                      {/* Priority Score badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-400 font-bold text-[11px]">
                            #{idx + 1}
                          </span>
                          <span
                            className={`font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                              isResolved
                                ? 'bg-emerald-100 text-emerald-800'
                                : isCritical
                                ? 'bg-rose-100 text-rose-800 ring-1 ring-rose-300'
                                : isHigh
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {isCritical && <Flame className="w-3 h-3 text-rose-600" />}
                            <span>{incident.priorityScore}</span>
                            <span className="text-[9px] font-normal opacity-75">
                              {incident.priorityLevel}
                            </span>
                          </span>
                        </div>
                      </td>

                      {/* Incident Title & ID */}
                      <td className="py-4 px-4">
                        <div className="font-mono text-[11px] font-bold text-blue-600">
                          #{incident.id}
                        </div>
                        <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 text-xs sm:text-sm">
                          {incident.title}
                        </div>
                        <div className="text-[11px] text-slate-500 font-normal">
                          {incident.issueType}
                        </div>
                      </td>

                      {/* Severity */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`font-bold text-[11px] px-2 py-0.5 rounded ${
                            incident.severityLevel === 'Critical'
                              ? 'bg-rose-50 text-rose-700'
                              : incident.severityLevel === 'High'
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {incident.severityLevel} ({incident.severityScore}/100)
                        </span>
                      </td>

                      {/* Reports count */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 font-bold text-slate-700">
                          <Layers className="w-3.5 h-3.5 text-slate-500" />
                          <span>{incident.reportCount}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            {incident.reportCount > 1 ? 'consolidated' : 'report'}
                          </span>
                        </div>
                      </td>

                      {/* Location: City, State, Address, Zone, Coordinates */}
                      <td className="py-4 px-4">
                        <div className="line-clamp-1 text-slate-900 font-semibold">
                          {incident.location.city || 'Indore'}{incident.location.state ? `, ${incident.location.state}` : ''}
                        </div>
                        <div className="line-clamp-1 text-slate-600 text-[11px]">
                          {incident.location.address}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {incident.location.zone} &bull; {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
                        </div>
                      </td>

                      {/* Location Source Tag */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          (incident.location.source === 'gps' || incident.location.locationSource === 'gps')
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : (incident.location.source === 'manual' || incident.location.locationSource === 'manual')
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-amber-100 text-amber-800 border border-amber-300'
                        }`}>
                          {(incident.location.source === 'gps' || incident.location.locationSource === 'gps') ? 'Real GPS' : (incident.location.source === 'manual' || incident.location.locationSource === 'manual') ? 'Manual Map' : 'Demo Data'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                            incident.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : incident.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : incident.status === 'Assigned'
                              ? 'bg-indigo-100 text-indigo-800'
                              : incident.status === 'Verified'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {incident.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIncident(incident);
                          }}
                          className="bg-slate-900 group-hover:bg-blue-600 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors inline-flex items-center gap-1"
                        >
                          <span>Inspect</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No incidents match the active filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRIORITY WEIGHTS TUNING MODAL / DRAWER */}
      {showWeightsDrawer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  <span>Configure Deterministic Priority Weights</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Customize the municipal triage formula weights (must sum to ~100%).
                </p>
              </div>
              <button
                onClick={() => setShowWeightsDrawer(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveWeights} className="space-y-4 text-xs">
              {/* Severity Weight */}
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Physical Damage Severity Weight:</span>
                  <span className="text-blue-600">{Math.round(editableWeights.severityWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.10"
                  max="0.70"
                  step="0.05"
                  value={editableWeights.severityWeight}
                  onChange={(e) =>
                    setEditableWeights({ ...editableWeights, severityWeight: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Reports Count Weight */}
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Citizen Report Corroboration Weight:</span>
                  <span className="text-blue-600">{Math.round(editableWeights.reportsCountWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.40"
                  step="0.05"
                  value={editableWeights.reportsCountWeight}
                  onChange={(e) =>
                    setEditableWeights({ ...editableWeights, reportsCountWeight: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Location Context Weight */}
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Critical Location (School/Hospital) Weight:</span>
                  <span className="text-blue-600">{Math.round(editableWeights.locationWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={editableWeights.locationWeight}
                  onChange={(e) =>
                    setEditableWeights({ ...editableWeights, locationWeight: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Recurrence Weight */}
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Chronic Recurrence History Weight:</span>
                  <span className="text-blue-600">{Math.round(editableWeights.recurrenceWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.25"
                  step="0.05"
                  value={editableWeights.recurrenceWeight}
                  onChange={(e) =>
                    setEditableWeights({ ...editableWeights, recurrenceWeight: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              {/* Public Impact Weight */}
              <div>
                <div className="flex justify-between font-bold text-slate-800 mb-1">
                  <span>Public Safety &amp; Transit Impact Weight:</span>
                  <span className="text-blue-600">{Math.round(editableWeights.publicImpactWeight * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.05"
                  value={editableWeights.publicImpactWeight}
                  onChange={(e) =>
                    setEditableWeights({ ...editableWeights, publicImpactWeight: parseFloat(e.target.value) })
                  }
                  className="w-full accent-blue-600"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetDefaultWeights}
                  className="text-slate-500 hover:text-slate-800 font-semibold"
                >
                  Reset Defaults (40/20/15/10/15)
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowWeightsDrawer(false)}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingWeights}
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition shadow"
                  >
                    {isSavingWeights ? 'Recalculating...' : 'Apply & Recalculate'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
