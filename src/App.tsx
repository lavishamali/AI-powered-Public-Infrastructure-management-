/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.js';
import { Footer } from './components/Footer.js';
import { LandingPage } from './components/LandingPage.js';
import { CitizenReportForm } from './components/CitizenReportForm.js';
import { ReportResultView } from './components/ReportResultView.js';
import { AuthorityDashboard } from './components/AuthorityDashboard.js';
import { IncidentDetailModal } from './components/IncidentDetailModal.js';
import { MapView } from './components/MapView.js';
import { TrackReportView } from './components/TrackReportView.js';
import { AboutView } from './components/AboutView.js';
import {
  fetchIncidents,
  fetchReports,
  fetchPriorityWeights
} from './services/api.js';
import {
  Incident,
  CitizenReport,
  PriorityWeights
} from './types/index.js';

export default function App() {
  const [currentTab, setCurrentTab] = useState<
    'landing' | 'report' | 'track' | 'dashboard' | 'map' | 'about'
  >('landing');

  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);
  const [weights, setWeights] = useState<PriorityWeights>({
    severityWeight: 0.4,
    reportsCountWeight: 0.2,
    locationWeight: 0.15,
    recurrenceWeight: 0.1,
    publicImpactWeight: 0.15
  });

  const [loading, setLoading] = useState(true);

  // Modal & Navigation details
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [submissionResult, setSubmissionResult] = useState<{
    report: CitizenReport;
    incident: Incident;
    isDuplicate: boolean;
    duplicateProbability: number;
    matchingFactors: string[];
  } | null>(null);

  const [trackReportId, setTrackReportId] = useState<string>('');

  const loadAllData = async () => {
    try {
      const [incList, repList, wts] = await Promise.all([
        fetchIncidents(),
        fetchReports(),
        fetchPriorityWeights().catch(() => ({
          severityWeight: 0.4,
          reportsCountWeight: 0.2,
          locationWeight: 0.15,
          recurrenceWeight: 0.1,
          publicImpactWeight: 0.15
        }))
      ]);

      setIncidents(incList);
      setReports(repList);
      setWeights(wts);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectTab = (
    tab: 'landing' | 'report' | 'track' | 'dashboard' | 'map' | 'about'
  ) => {
    if (tab === 'report') {
      // If switching directly to report tab, reset submission result to allow fresh report
      setSubmissionResult(null);
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReportSubmitted = (result: {
    report: CitizenReport;
    incident: Incident;
    isDuplicate: boolean;
    duplicateProbability: number;
    matchingFactors: string[];
  }) => {
    setSubmissionResult(result);
    // Reload active data to reflect newly ingested or consolidated incident
    loadAllData();
  };

  const handleTrackReport = (reportId: string) => {
    setTrackReportId(reportId);
    setCurrentTab('track');
  };

  const handleOpenIncident = (incident: Incident) => {
    setSelectedIncident(incident);
  };

  const handleIncidentUpdated = (updated: Incident) => {
    setSelectedIncident(updated);
    setIncidents((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onRefreshData={loadAllData}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Loading Municipal Infrastructure Intelligence...
            </p>
          </div>
        ) : (
          <>
            {/* TAB: LANDING */}
            {currentTab === 'landing' && (
              <LandingPage
                onSelectTab={handleSelectTab}
                incidents={incidents}
                onSelectIncident={handleOpenIncident}
              />
            )}

            {/* TAB: CITIZEN REPORT FORM / RESULT */}
            {currentTab === 'report' && (
              <>
                {submissionResult ? (
                  <ReportResultView
                    report={submissionResult.report}
                    incident={submissionResult.incident}
                    isDuplicate={submissionResult.isDuplicate}
                    duplicateProbability={submissionResult.duplicateProbability}
                    matchingFactors={submissionResult.matchingFactors}
                    onTrackReport={handleTrackReport}
                    onOpenIncident={(inc) => {
                      setSelectedIncident(inc);
                      setCurrentTab('dashboard');
                    }}
                    onNewReport={() => setSubmissionResult(null)}
                  />
                ) : (
                  <CitizenReportForm
                    onReportSubmitted={handleReportSubmitted}
                    onCancel={() => setCurrentTab('landing')}
                  />
                )}
              </>
            )}

            {/* TAB: TRACK REPORT */}
            {currentTab === 'track' && (
              <TrackReportView
                reports={reports}
                incidents={incidents}
                onOpenIncident={handleOpenIncident}
                initialReportId={trackReportId}
              />
            )}

            {/* TAB: AUTHORITY DASHBOARD */}
            {currentTab === 'dashboard' && (
              <AuthorityDashboard
                incidents={incidents}
                onSelectIncident={handleOpenIncident}
                onRefreshData={loadAllData}
                weights={weights}
                onWeightsUpdated={(w) => setWeights(w)}
              />
            )}

            {/* TAB: MAP VIEW */}
            {currentTab === 'map' && (
              <MapView
                incidents={incidents}
                onSelectIncident={handleOpenIncident}
              />
            )}

            {/* TAB: ABOUT & HOW IT WORKS */}
            {currentTab === 'about' && (
              <AboutView onStartDemo={() => handleSelectTab('report')} />
            )}
          </>
        )}
      </main>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <IncidentDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
          onIncidentUpdated={handleIncidentUpdated}
        />
      )}

      {/* Footer */}
      <Footer onSelectTab={handleSelectTab} />
    </div>
  );
}
