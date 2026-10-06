import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Filter,
  Search,
  ExternalLink,
  Flame,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { LeafletMap } from './LeafletMap.js';
import { Incident } from '../types/index.js';

interface MapViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const MapView: React.FC<MapViewProps> = ({ incidents, onSelectIncident }) => {
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(incidents[0] || null);
  const [issueFilter, setIssueFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = incidents.filter((i) => {
    if (issueFilter !== 'All' && i.issueType !== issueFilter) return false;
    if (priorityFilter !== 'All' && i.priorityLevel !== priorityFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!i.title.toLowerCase().includes(q) && !i.location.address.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            Geospatial Infrastructure Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            City-Wide Incident Map
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
            Real-time geospatial clustering and priority mapping across municipal quadrants.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={issueFilter}
            onChange={(e) => setIssueFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700"
          >
            <option value="All">All Issues</option>
            <option value="Pothole">Potholes</option>
            <option value="Road Damage">Road Damage</option>
            <option value="Broken Streetlight">Streetlights</option>
            <option value="Overflowing Drain">Drains</option>
            <option value="Garbage Accumulation">Garbage</option>
            <option value="Damaged Sidewalk">Sidewalks</option>
            <option value="Damaged Signage">Signage</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 font-medium text-slate-700"
          >
            <option value="All">All Priorities</option>
            <option value="Critical">Critical Priority</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Main Map + Side Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Large Interactive Leaflet Map */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <LeafletMap
            incidents={filtered}
            selectedIncidentId={selectedIncident?.id}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
            height="560px"
          />

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 font-semibold pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                Critical (80-100)
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
            </div>
            <span>Showing {filtered.length} active pins</span>
          </div>
        </div>

        {/* Right: Selected Incident Card & Ranked List */}
        <div className="space-y-4">
          {selectedIncident ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-mono text-xs font-bold text-blue-600">
                  #{selectedIncident.id}
                </span>
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                    selectedIncident.priorityLevel === 'Critical'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedIncident.priorityLevel === 'High'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Priority {selectedIncident.priorityScore} &bull; {selectedIncident.priorityLevel}
                </span>
              </div>

              {/* Photo thumbnail */}
              {selectedIncident.sourceReports[0] && (
                <div className="rounded-xl overflow-hidden h-40 bg-slate-900 border border-slate-200">
                  <img
                    src={selectedIncident.sourceReports[0].imageUrl}
                    alt={selectedIncident.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {selectedIncident.title}
                  </h3>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                    (selectedIncident.location.source === 'gps' || selectedIncident.location.locationSource === 'gps')
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : (selectedIncident.location.source === 'manual' || selectedIncident.location.locationSource === 'manual')
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {(selectedIncident.location.source === 'gps' || selectedIncident.location.locationSource === 'gps') ? 'Real GPS' : (selectedIncident.location.source === 'manual' || selectedIncident.location.locationSource === 'manual') ? 'Manual Map' : 'Demo Data'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{selectedIncident.location.address} ({selectedIncident.location.zone})</span>
                </p>
                <div className="text-[10px] font-mono text-slate-400 mt-1">
                  Coordinates: {selectedIncident.location.lat.toFixed(5)}, {selectedIncident.location.lng.toFixed(5)} &bull; {selectedIncident.location.city || 'Indore'}, {selectedIncident.location.country || 'India'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block">Report Count</span>
                  <span className="font-bold text-slate-800">
                    {selectedIncident.reportCount} citizen reports
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Status</span>
                  <span className="font-bold text-blue-600">
                    {selectedIncident.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                <strong>AI Executive Rationale:</strong> {selectedIncident.aiExplanation?.summary}
              </p>

              <button
                onClick={() => onSelectIncident(selectedIncident)}
                className="w-full inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition shadow"
              >
                <span>Inspect Full Incident Details &rarr;</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
              Select an incident marker on the map to view details.
            </div>
          )}

          {/* Incident Quick Queue List */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">
              Geospatial Incident Queue ({filtered.length})
            </h4>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filtered.map((inc) => (
                <div
                  key={inc.id}
                  onClick={() => setSelectedIncident(inc)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    selectedIncident?.id === inc.id
                      ? 'border-blue-500 bg-blue-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <div className="truncate mr-2">
                    <span className="font-mono text-[10px] text-slate-400 block">
                      #{inc.id} &bull; {inc.issueType}
                    </span>
                    <span className="font-bold text-slate-800 truncate block text-[11px]">
                      {inc.title}
                    </span>
                  </div>

                  <span
                    className={`font-black text-[10px] px-2 py-0.5 rounded shrink-0 ${
                      inc.priorityLevel === 'Critical'
                        ? 'bg-rose-100 text-rose-700'
                        : inc.priorityLevel === 'High'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {inc.priorityScore}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
