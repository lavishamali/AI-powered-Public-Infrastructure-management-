import React, { useState, useRef } from 'react';
import {
  Upload,
  Camera,
  Video,
  MapPin,
  Compass,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  FileText,
  RotateCw,
  Eye,
  Info,
  Check,
  MousePointerClick,
  RefreshCcw,
  ShieldAlert
} from 'lucide-react';
import { LeafletMap } from './LeafletMap.js';
import { SAMPLE_EVIDENCE_ITEMS, SampleEvidence } from '../data/sampleImages.js';
import { analyzeImage, analyzeVideoFrames, submitCitizenReport, reverseGeocode } from '../services/api.js';
import {
  IssueType,
  LocationContext,
  LocationData,
  AIAnalysisResult,
  CitizenReport,
  Incident
} from '../types/index.js';

interface CitizenReportFormProps {
  onReportSubmitted: (result: {
    report: CitizenReport;
    incident: Incident;
    isDuplicate: boolean;
    duplicateProbability: number;
    matchingFactors: string[];
  }) => void;
  onCancel?: () => void;
}

export const CitizenReportForm: React.FC<CitizenReportFormProps> = ({
  onReportSubmitted,
  onCancel
}) => {
  // Mode: Image vs Video
  const [evidenceMode, setEvidenceMode] = useState<'image' | 'video'>('image');

  // Evidence state
  const [imageUrl, setImageUrl] = useState<string>('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  // Location state: Starts unselected so we never present a fake location as the user's actual location
  const [location, setLocation] = useState<LocationData | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    'unselected' | 'detecting' | 'detected' | 'failed' | 'manual' | 'demo'
  >('unselected');
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isOutsideIndia, setIsOutsideIndia] = useState<boolean>(false);
  const [isConfirmingLocation, setIsConfirmingLocation] = useState<boolean>(false);

  // AI Analysis state
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Ref for file inputs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoPlayerRef = useRef<HTMLVideoElement>(null);

  // Select a preset sample evidence
  const handleSelectSample = async (sample: SampleEvidence) => {
    setImageUrl(sample.imageUrl);
    setDescription(sample.defaultDescription);
    setLocation({
      lat: sample.location.lat,
      lng: sample.location.lng,
      address: sample.location.address,
      city: sample.location.city || 'Indore',
      state: sample.location.state || 'Madhya Pradesh',
      country: sample.location.country || 'India',
      source: 'demo',
      locationSource: 'demo',
      zone: sample.location.zone,
      landmark: sample.location.landmark
    });
    setLocationStatus('demo');
    setIsOutsideIndia(false);
    setLocationError(null);
    setAiAnalysis(null);
    setAnalysisError(null);
    setSubmitError(null);

    // Automatically trigger AI analysis on sample selection for immediate feedback
    await triggerAnalysis(sample.imageUrl, sample.defaultDescription);
  };

  // Convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle local image file upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPEG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      alert('Image size exceeds 15MB limit. Please upload a smaller photo.');
      return;
    }

    try {
      const b64 = await fileToBase64(file);
      setImageUrl(b64);
      setAiAnalysis(null);
      setAnalysisError(null);

      // Trigger analysis
      await triggerAnalysis(b64, description);
    } catch (err: any) {
      alert('Failed to read image file: ' + err.message);
    }
  };

  // Trigger Multimodal AI Image Analysis
  const triggerAnalysis = async (imgData: string, descText: string) => {
    if (!imgData) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const analysis = await analyzeImage({
        imageBase64: imgData,
        mimeType: imgData.startsWith('data:image/png') ? 'image/png' : 'image/jpeg',
        description: descText
      });
      setAiAnalysis(analysis);
    } catch (err: any) {
      console.error('AI Analysis failed:', err);
      setAnalysisError(err.message || 'Vision model analysis timed out');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Extract representative frames from video
  const extractVideoFrames = async (vFile: File): Promise<Array<{ base64: string; timestampMs: number }>> => {
    return new Promise((resolve, reject) => {
      const vUrl = URL.createObjectURL(vFile);
      const video = document.createElement('video');
      video.src = vUrl;
      video.muted = true;
      video.playsInline = true;

      const frames: Array<{ base64: string; timestampMs: number }> = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = async () => {
        const duration = video.duration || 3;
        const timestamps = [0.5, Math.min(duration * 0.5, 2), Math.min(duration * 0.8, 4)];

        canvas.width = Math.min(640, video.videoWidth || 640);
        canvas.height = Math.min(480, video.videoHeight || 480);

        for (const t of timestamps) {
          video.currentTime = t;
          await new Promise((r) => {
            video.onseeked = () => {
              if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                frames.push({
                  base64: canvas.toDataURL('image/jpeg', 0.8),
                  timestampMs: Math.round(t * 1000)
                });
              }
              r(null);
            };
          });
        }

        URL.revokeObjectURL(vUrl);
        resolve(frames);
      };

      video.onerror = () => {
        URL.revokeObjectURL(vUrl);
        reject(new Error('Failed to load video file for frame extraction'));
      };
    });
  };

  // Handle Video file upload
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please upload a valid short video file (MP4, WebM).');
      return;
    }

    setVideoFile(file);
    const localUrl = URL.createObjectURL(file);
    setVideoUrl(localUrl);
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const frames = await extractVideoFrames(file);
      if (frames.length > 0) {
        setImageUrl(frames[0].base64); // Use keyframe as representative thumbnail
        const analysis = await analyzeVideoFrames({
          frames,
          description
        });
        setAiAnalysis(analysis);
      }
    } catch (err: any) {
      console.error('Video extraction error:', err);
      setAnalysisError('Video frame sampling failed: ' + err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Detect Current Location via Geolocation API
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('failed');
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationStatus('detecting');
    setLocationError(null);
    setIsOutsideIndia(false);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(6));
        const lng = Number(pos.coords.longitude.toFixed(6));

        try {
          const geo = await reverseGeocode(lat, lng);
          const locData: LocationData = {
            lat,
            lng,
            address: geo.address || `GPS: ${lat}, ${lng}`,
            city: geo.city || (geo.isIndia ? 'Indore' : 'Detected Location'),
            state: geo.state || (geo.isIndia ? 'Madhya Pradesh' : ''),
            country: geo.country || (geo.isIndia ? 'India' : 'Outside India'),
            source: 'gps',
            locationSource: 'gps',
            zone: location?.zone || 'Residential Area',
            landmark: ''
          };

          setLocation(locData);
          setLocationStatus('detected');
          setIsOutsideIndia(!geo.isIndia);
        } catch (err) {
          // If geocode API fails, keep real GPS coordinates intact
          const locData: LocationData = {
            lat,
            lng,
            address: `GPS Coordinate (${lat}, ${lng})`,
            city: 'Detected City',
            state: 'Madhya Pradesh',
            country: 'India',
            source: 'gps',
            locationSource: 'gps',
            zone: location?.zone || 'Residential Area'
          };
          setLocation(locData);
          setLocationStatus('detected');
          setIsOutsideIndia(false);
        }
      },
      (err) => {
        setLocationStatus('failed');
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Location permission denied. Please allow location access or select your location on the map.');
        } else if (err.code === err.TIMEOUT) {
          setLocationError('Location request timed out. Please try again or select your location on the map.');
        } else {
          setLocationError('Unable to detect your current location. Please select your location on the map.');
        }
      },
      { timeout: 12000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Manual Pin drop on Leaflet map
  const handlePickOnMap = async (lat: number, lng: number) => {
    const roundedLat = Number(lat.toFixed(6));
    const roundedLng = Number(lng.toFixed(6));

    try {
      const geo = await reverseGeocode(roundedLat, roundedLng);
      const locData: LocationData = {
        lat: roundedLat,
        lng: roundedLng,
        address: geo.address || `Map: ${roundedLat}, ${roundedLng}`,
        city: geo.city || (geo.isIndia ? 'Indore' : 'Selected Location'),
        state: geo.state || (geo.isIndia ? 'Madhya Pradesh' : ''),
        country: geo.country || (geo.isIndia ? 'India' : 'Outside India'),
        source: 'manual',
        locationSource: 'manual',
        zone: location?.zone || 'Residential Area',
        landmark: location?.landmark || ''
      };

      setLocation(locData);
      setLocationStatus('manual');
      setLocationError(null);
      setIsOutsideIndia(!geo.isIndia);
    } catch (err) {
      const locData: LocationData = {
        lat: roundedLat,
        lng: roundedLng,
        address: `Selected Map Coordinate (${roundedLat}, ${roundedLng})`,
        city: 'Indore',
        state: 'Madhya Pradesh',
        country: 'India',
        source: 'manual',
        locationSource: 'manual',
        zone: location?.zone || 'Residential Area'
      };

      setLocation(locData);
      setLocationStatus('manual');
      setLocationError(null);
    }
  };

  // Submit Report
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!imageUrl && !videoUrl) {
      setSubmitError('Please provide photo or video evidence.');
      return;
    }

    if (!description.trim()) {
      setSubmitError('Please enter a description of the observed infrastructure problem.');
      return;
    }

    if (!location) {
      setSubmitError('Please detect your location or select a location on the map before submitting.');
      return;
    }

    if (isOutsideIndia) {
      setSubmitError('This application is currently designed for infrastructure reports within India. Please select a location in India.');
      return;
    }

    // If analysis hasn't run yet, run it now
    let currentAnalysis = aiAnalysis;
    if (!currentAnalysis) {
      setIsAnalyzing(true);
      try {
        currentAnalysis = await analyzeImage({
          imageBase64: imageUrl,
          description
        });
        setAiAnalysis(currentAnalysis);
      } catch (err: any) {
        setSubmitError('AI analysis failed: ' + err.message);
        setIsAnalyzing(false);
        return;
      }
      setIsAnalyzing(false);
    }

    setIsSubmitting(true);

    try {
      const result = await submitCitizenReport({
        imageUrl,
        videoUrl: videoUrl || undefined,
        description,
        location,
        aiAnalysis: currentAnalysis
      });

      onReportSubmitted(result);
    } catch (err: any) {
      console.error('Submit error:', err);
      setSubmitError(err.message || 'Report submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1.5">
              <Camera className="w-3.5 h-3.5 text-blue-600" />
              Citizen Ingestion Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Report Infrastructure Issue
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Upload photo evidence and real location. CivicVision AI detects defects, verifies duplicates, and routes directly to Public Works.
            </p>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="text-slate-500 hover:text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 self-start sm:self-auto"
            >
              Cancel
            </button>
          )}
        </div>

        {/* 1-Click Quick Preset Sample Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Demo Data / Sample Reports (1-Click Test Scenarios):
            </span>
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
              Pre-loaded sample evidence for demonstration
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {SAMPLE_EVIDENCE_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSample(item)}
                className="text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-400 rounded-lg p-2 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-14 rounded overflow-hidden mb-1.5 bg-slate-200">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600">
                    {item.issueType}
                  </div>
                  <div className="text-[9px] text-slate-500 line-clamp-1">
                    {item.location.city || 'Indore'} &bull; {item.testScenario}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Report Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* STEP 1: VISUAL EVIDENCE UPLOAD */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                1
              </span>
              Visual Evidence (Photo or Video)
            </h2>

            {/* Evidence Mode Switcher */}
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs">
              <button
                type="button"
                onClick={() => setEvidenceMode('image')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  evidenceMode === 'image'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setEvidenceMode('video')}
                className={`px-3 py-1 rounded-md font-semibold transition-all ${
                  evidenceMode === 'video'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Short Video
              </button>
            </div>
          </div>

          {/* Mode: Image Upload Area */}
          {evidenceMode === 'image' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  imageUrl
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-slate-100/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {imageUrl ? (
                  <div className="relative inline-block max-w-md w-full">
                    <img
                      src={imageUrl}
                      alt="Uploaded Infrastructure Evidence"
                      className="w-full max-h-72 object-cover rounded-lg shadow border border-slate-200 mx-auto"
                    />

                    {/* Detected Regions Bounding Box Overlay */}
                    {aiAnalysis?.detectedRegions?.map((box, idx) => (
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
                          {box.label || aiAnalysis.detectedIssue}
                        </span>
                      </div>
                    ))}

                    <div className="mt-3 flex items-center justify-center gap-2">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        Evidence Loaded (Click to change photo)
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Click to upload photo or drag &amp; drop
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Supports JPG, PNG, WebP up to 15MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode: Video Upload Area */}
          {evidenceMode === 'video' && (
            <div className="space-y-4">
              <div
                onClick={() => videoInputRef.current?.click()}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                  videoUrl
                    ? 'border-blue-300 bg-blue-50/20'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoFileChange}
                  accept="video/*"
                  className="hidden"
                />

                {videoUrl ? (
                  <div className="max-w-md mx-auto">
                    <video
                      ref={videoPlayerRef}
                      src={videoUrl}
                      controls
                      className="w-full max-h-60 rounded-lg shadow border border-slate-200"
                    />
                    <p className="text-xs text-blue-600 font-semibold mt-2">
                      Keyframes extracted and aggregated across video playback.
                    </p>
                  </div>
                ) : (
                  <div className="py-4">
                    <Video className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-800">
                      Upload short municipal video clip
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      CivicVision AI samples keyframes to detect defects without duplicating reports.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI Analysis Preview Card */}
          {isAnalyzing && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
              <RotateCw className="w-5 h-5 text-blue-600 animate-spin" />
              <div>
                <p className="text-xs font-bold text-blue-900">
                  Multimodal AI Inspecting Evidence...
                </p>
                <p className="text-[11px] text-blue-700">
                  Classifying damage signature and estimating visual severity extent via Gemini 3.8 Flash.
                </p>
              </div>
            </div>
          )}

          {analysisError && (
            <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{analysisError}</span>
            </div>
          )}

          {aiAnalysis && (
            <div className="mt-4 p-4 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-md">
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold tracking-wide uppercase text-cyan-300">
                    AI Visual Analysis Result
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  {aiAnalysis.modelUsed || 'gemini-3.8-flash'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs mb-3">
                <div>
                  <span className="text-slate-400 text-[11px] block">Detected Issue</span>
                  <span className="font-extrabold text-white text-sm">
                    {aiAnalysis.detectedIssue}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Confidence</span>
                  <span className="font-extrabold text-emerald-400 text-sm">
                    {aiAnalysis.confidence}%
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Visual Severity</span>
                  <span className="font-extrabold text-amber-400 text-sm">
                    {aiAnalysis.estimatedDamageLevel}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Hazard Type</span>
                  <span className="font-medium text-slate-200 line-clamp-1">
                    {aiAnalysis.hazardClassification}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/60 p-2.5 rounded-lg border border-slate-700/60">
                <strong className="text-white">Observations:</strong> {aiAnalysis.observations}
              </p>
            </div>
          )}
        </div>

        {/* STEP 2: ISSUE DESCRIPTION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
              2
            </span>
            Citizen Observation Notes
          </h2>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Describe what you observed (e.g. depth of pothole, traffic danger, standing foul water, nearest cross street)..."
            className="w-full text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />

          {/* Quick preset chips */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Suggested notes:</span>
            {[
              'Vehicles swerving into oncoming traffic',
              'Deep crater near school gate crosswalk',
              'Sewage backing up into pedestrian sidewalk',
              'Complete blackout near bus stop'
            ].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setDescription((prev) => (prev ? `${prev}. ${chip}` : chip))}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded text-[11px] font-medium transition-colors"
              >
                + {chip}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 3: REAL CURRENT LOCATION DETECTION */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>Location</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Detect your actual GPS location or manually select an Indian location on the map.
              </p>
            </div>

            {/* Prominent Detect Current Location Button */}
            <button
              type="button"
              onClick={handleDetectCurrentLocation}
              disabled={locationStatus === 'detecting'}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all self-start sm:self-auto cursor-pointer"
            >
              <Compass className={`w-4 h-4 ${locationStatus === 'detecting' ? 'animate-spin' : ''}`} />
              <span>
                {locationStatus === 'detecting' ? 'Detecting your location...' : 'Detect My Current Location'}
              </span>
            </button>
          </div>

          {/* Detecting State Feedback */}
          {locationStatus === 'detecting' && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3">
              <RotateCw className="w-5 h-5 text-blue-600 animate-spin shrink-0" />
              <div>
                <p className="text-xs font-bold text-blue-900">
                  Detecting your location...
                </p>
                <p className="text-[11px] text-blue-700">
                  Requesting GPS coordinates via browser Geolocation API and reverse-geocoding...
                </p>
              </div>
            </div>
          )}

          {/* Error / Fallback State: "Unable to detect your current location." */}
          {locationStatus === 'failed' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Unable to detect your current location.</span>
              </div>
              <p className="text-[11px] text-amber-800">
                {locationError || 'Browser location permission was not granted or GPS service is unavailable.'}
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDetectCurrentLocation}
                  className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-sm cursor-pointer"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  <span>Option 1: Try Again</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!location) {
                      setLocation({
                        lat: 22.7196,
                        lng: 75.8577,
                        address: 'Click on the map to pinpoint location in India',
                        city: 'Indore',
                        state: 'Madhya Pradesh',
                        country: 'India',
                        source: 'manual',
                        locationSource: 'manual',
                        zone: 'Residential Area'
                      });
                    }
                    setLocationStatus('manual');
                  }}
                  className="inline-flex items-center gap-1.5 bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-2 rounded-lg shadow-2xs cursor-pointer"
                >
                  <MousePointerClick className="w-3.5 h-3.5 text-amber-700" />
                  <span>Option 2: Select Location on Map</span>
                </button>
              </div>
            </div>
          )}

          {/* India Validation Warning if GPS coordinates are outside India */}
          {isOutsideIndia && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">
                  This application is currently designed for infrastructure reports within India. Please select a location in India.
                </p>
                <p className="text-[11px] text-rose-700 mt-0.5">
                  Your coordinates ({location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}) were detected outside India. Click anywhere on the map within India to select your municipal location.
                </p>
              </div>
            </div>
          )}

          {/* Interactive Map with Marker */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span className="font-semibold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>Interactive Map &bull; Click anywhere on the map to set or adjust pin</span>
              </span>
              {location && (
                <span className="font-mono text-[11px] text-slate-500">
                  {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              )}
            </div>

            <LeafletMap
              center={location ? [location.lat, location.lng] : [22.7196, 75.8577]}
              zoom={location ? 15 : 12}
              height="300px"
              interactivePicker={true}
              pickedLocation={location ? { lat: location.lat, lng: location.lng } : null}
              onPickLocation={handlePickOnMap}
            />
          </div>

          {/* READABLE LOCATION INFORMATION DISPLAYED BELOW THE MAP */}
          {location && locationStatus !== 'detecting' && (
            <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="font-extrabold text-xs text-emerald-400">
                    {locationStatus === 'detected' ? 'Location detected' : 'Location Selected'}
                  </span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    location.source === 'gps'
                      ? 'bg-emerald-900/60 text-emerald-300 border border-emerald-700'
                      : location.source === 'manual'
                      ? 'bg-blue-900/60 text-blue-300 border border-blue-700'
                      : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                  }`}>
                    {location.source === 'gps'
                      ? 'Source: Real GPS'
                      : location.source === 'manual'
                      ? 'Source: Manual Map'
                      : 'Demo Data'}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-300">
                  Lat: {location.lat.toFixed(4)} | Lng: {location.lng.toFixed(4)}
                </div>
              </div>

              {/* Exact Coordinate & City/State/Country Fields */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs bg-slate-800/60 p-3 rounded-lg border border-slate-700/60">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Latitude</span>
                  <span className="font-mono font-bold text-white text-xs sm:text-sm">
                    {location.lat.toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Longitude</span>
                  <span className="font-mono font-bold text-white text-xs sm:text-sm">
                    {location.lng.toFixed(4)}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">City</span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {location.city || 'Indore'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">State</span>
                  <span className="font-bold text-white text-xs sm:text-sm">
                    {location.state || 'Madhya Pradesh'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Country</span>
                  <span className="font-bold text-emerald-300 text-xs sm:text-sm">
                    {location.country || 'India'}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="text-slate-300 text-[11px]">
                  <strong className="text-slate-400">Approximate Address:</strong> {location.address}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsConfirmingLocation(true);
                    setTimeout(() => setIsConfirmingLocation(false), 2000);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition flex items-center gap-1 shrink-0 self-start sm:self-auto cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{isConfirmingLocation ? 'Confirmed ✓' : 'Confirm Location'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Address & Civic Zone Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Street Address or Landmark
              </label>
              <input
                type="text"
                value={location?.address || ''}
                onChange={(e) => {
                  if (location) {
                    setLocation({ ...location, address: e.target.value });
                  } else {
                    setLocation({
                      lat: 22.7196,
                      lng: 75.8577,
                      address: e.target.value,
                      city: 'Indore',
                      state: 'Madhya Pradesh',
                      country: 'India',
                      source: 'manual',
                      locationSource: 'manual',
                      zone: 'Residential Area'
                    });
                    setLocationStatus('manual');
                  }
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="e.g. Near IPS School Gate, AB Road, Indore"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Civic Zone Classification
              </label>
              <select
                value={location?.zone || 'Residential Area'}
                onChange={(e) => {
                  const z = e.target.value as LocationContext;
                  if (location) {
                    setLocation({ ...location, zone: z });
                  }
                }}
                className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
              >
                <option value="School Zone">School Zone (High pedestrian safety weight)</option>
                <option value="Hospital Corridor">Hospital Corridor (Critical ambulance access)</option>
                <option value="Arterial Road">Arterial Road (High-speed traffic throughput)</option>
                <option value="Transit Hub">Transit Hub (Heavy commuter footfall)</option>
                <option value="Commercial Center">Commercial Center (Retail market strip)</option>
                <option value="Residential Area">Residential Area (Neighborhood street)</option>
                <option value="Alleyway / Minor Street">Alleyway / Minor Street</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submission Error Banner */}
        {submitError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span className="font-semibold">{submitError}</span>
          </div>
        )}

        {/* SUBMIT BUTTON */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <p className="font-semibold text-slate-700">
              CivicVision AI Triage Verification
            </p>
            <p className="mt-0.5">
              Automatically scans for existing duplicates within 250m using real coordinates and calculates prioritized urgency.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isAnalyzing || (!imageUrl && !videoUrl) || !location}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed text-sm cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Processing &amp; Consolidating...</span>
              </>
            ) : isAnalyzing ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>Analyzing AI Model...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span>Analyze &amp; Submit Report</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
