import React from 'react';
import { ShieldCheck, Cpu, Database, Map } from 'lucide-react';

export const Footer: React.FC<{ onSelectTab: (tab: any) => void }> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-10 mt-16 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: System Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              <span>CivicVision AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed mb-3">
              Autonomous civic infrastructure triage and incident consolidation platform. Transforming scattered citizen observations into verified, prioritized public works operations.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 text-[11px] font-mono text-emerald-400 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini Vision &amp; Spatial Engine Active
            </div>
          </div>

          {/* Column 2: Pipeline Mechanics */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Intelligent Pipeline
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Multimodal Gemini 3.8 Flash Vision</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Database className="w-3.5 h-3.5 text-amber-400" />
                <span>Multi-Signal Duplicate Consolidation</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <Map className="w-3.5 h-3.5 text-emerald-400" />
                <span>OpenStreetMap Spatial Proximity</span>
              </li>
              <li className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>Deterministic 5-Factor Priority Engine</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Application Views
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => onSelectTab('landing')}
                  className="hover:text-white transition-colors"
                >
                  System Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('report')}
                  className="hover:text-white transition-colors"
                >
                  Citizen Hazard Reporting
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('dashboard')}
                  className="hover:text-white transition-colors"
                >
                  Authority Triage Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('map')}
                  className="hover:text-white transition-colors"
                >
                  Geospatial Incident Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('about')}
                  className="hover:text-white transition-colors"
                >
                  Architecture &amp; Algorithm Specs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Integrity */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">
              Transparency Standard
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-2">
              All numerical severity and priority calculations are computed deterministically. AI models synthesize factual evidence without hallucinating figures or fabricating reports.
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Civic Technology Prototype &bull; Hackathon Edition
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>&copy; 2026 CivicVision AI &bull; Municipal Public Works &amp; Infrastructure Safety</span>
          <span>OpenStreetMap &bull; Leaflet &bull; Google Gemini Vision</span>
        </div>
      </div>
    </footer>
  );
};
