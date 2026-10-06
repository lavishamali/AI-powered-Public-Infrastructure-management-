import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Incident } from '../types/index.js';

interface LeafletMapProps {
  incidents?: Incident[];
  selectedIncidentId?: string | null;
  onSelectIncident?: (incident: Incident) => void;
  center?: [number, number];
  zoom?: number;
  height?: string;
  interactivePicker?: boolean;
  pickedLocation?: { lat: number; lng: number } | null;
  onPickLocation?: (lat: number, lng: number) => void;
  className?: string;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  incidents = [],
  selectedIncidentId,
  onSelectIncident,
  center = [22.7196, 75.8577],
  zoom = 13,
  height = '420px',
  interactivePicker = false,
  pickedLocation,
  onPickLocation,
  className = ''
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const pickerMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        attributionControl: true
      });

      // Standard OpenStreetMap Tile Layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;

      // Handle interactive click picker
      map.on('click', (e: L.LeafletMouseEvent) => {
        if (interactivePicker && onPickLocation) {
          onPickLocation(e.latlng.lat, e.latlng.lng);
        }
      });
    }

    // Invalidate size to prevent tile clipping
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // Update center when center prop changes
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    }
  }, [center?.[0], center?.[1], zoom]);

  // Handle Picked Location Marker (Pin-Drop)
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    if (interactivePicker && pickedLocation) {
      if (pickerMarkerRef.current) {
        pickerMarkerRef.current.setLatLng([pickedLocation.lat, pickedLocation.lng]);
      } else {
        const pickerIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `
            <div style="
              display: flex;
              align-items: center;
              justify-content: center;
              width: 38px;
              height: 38px;
              background-color: #2563EB;
              border: 3px solid #ffffff;
              box-shadow: 0 4px 12px rgba(0,0,0,0.35);
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
            ">
              <div style="
                width: 12px;
                height: 12px;
                background-color: #ffffff;
                border-radius: 50%;
                transform: rotate(45deg);
              "></div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 38]
        });

        const marker = L.marker([pickedLocation.lat, pickedLocation.lng], {
          icon: pickerIcon,
          draggable: true
        }).addTo(mapInstanceRef.current);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          if (onPickLocation) {
            onPickLocation(pos.lat, pos.lng);
          }
        });

        pickerMarkerRef.current = marker;
      }
    } else if (!pickedLocation && pickerMarkerRef.current) {
      pickerMarkerRef.current.remove();
      pickerMarkerRef.current = null;
    }
  }, [pickedLocation?.lat, pickedLocation?.lng, interactivePicker]);

  // Update Incident Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    if (incidents.length === 0) return;

    incidents.forEach((incident) => {
      const isSelected = incident.id === selectedIncidentId;
      const isCritical = incident.priorityLevel === 'Critical';
      const isResolved = incident.status === 'Resolved';

      let bgBadgeColor = '#2563EB'; // Low: Blue
      let pulseRing = '';

      if (isResolved) {
        bgBadgeColor = '#059669'; // Emerald
      } else if (incident.priorityLevel === 'Critical') {
        bgBadgeColor = '#DC2626'; // Red
        pulseRing = `
          <span style="
            position: absolute;
            inset: -4px;
            border-radius: 9999px;
            background-color: #EF4444;
            opacity: 0.4;
            animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
          "></span>
        `;
      } else if (incident.priorityLevel === 'High') {
        bgBadgeColor = '#EA580C'; // Orange
      } else if (incident.priorityLevel === 'Medium') {
        bgBadgeColor = '#D97706'; // Amber
      }

      const markerHtml = `
        <div style="position: relative; cursor: pointer; display: flex; align-items: center; justify-content: center;">
          ${pulseRing}
          <div style="
            position: relative;
            z-index: 10;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 4px 8px;
            border-radius: 9999px;
            background-color: ${bgBadgeColor};
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: 0.025em;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border: 2px solid ${isSelected ? '#FBBF24' : '#ffffff'};
            transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
            transition: transform 0.15s ease-in-out;
            white-space: nowrap;
          ">
            <span>${incident.priorityScore}</span>
            <span style="font-size: 9px; opacity: 0.9; text-transform: uppercase;">${incident.issueType.slice(0, 4)}</span>
            ${incident.reportCount > 1 ? `<span style="background: rgba(0,0,0,0.25); padding: 1px 4px; border-radius: 8px; font-size: 9px;">${incident.reportCount}x</span>` : ''}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: markerHtml,
        iconSize: [60, 26],
        iconAnchor: [30, 13]
      });

      const marker = L.marker([incident.location.lat, incident.location.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.style.minWidth = '220px';
      popupContent.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      popupContent.innerHTML = `
        <div style="padding: 4px 0;">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
            <span style="font-weight: 700; font-size: 13px; color: #0F172A;">#${incident.id}</span>
            <span style="
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              padding: 2px 6px;
              border-radius: 4px;
              color: white;
              background-color: ${bgBadgeColor};
            ">${incident.priorityLevel} (${incident.priorityScore})</span>
          </div>
          <div style="font-weight: 600; font-size: 12px; color: #1E293B; margin-bottom: 2px;">
            ${incident.issueType}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px; line-height: 1.3;">
            ${incident.location.address}
            ${incident.location.city ? `<div style="font-weight: 600; color: #334155; margin-top: 2px;">${incident.location.city}${incident.location.state ? `, ${incident.location.state}` : ''}</div>` : ''}
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 4px; font-size: 10px; margin-bottom: 8px;">
            <span style="background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
              Reports: ${incident.reportCount}
            </span>
            <span style="background: #F1F5F9; color: #475569; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
              Status: ${incident.status}
            </span>
            <span style="background: ${incident.location.source === 'gps' ? '#DCFCE7' : incident.location.source === 'manual' ? '#EFF6FF' : '#F1F5F9'}; color: ${incident.location.source === 'gps' ? '#166534' : incident.location.source === 'manual' ? '#1E40AF' : '#475569'}; padding: 2px 6px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">
              ${incident.location.source || 'demo'}
            </span>
          </div>
          <button id="btn-popup-${incident.id}" style="
            width: 100%;
            background: #0F172A;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
          ">
            Inspect Incident Details &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${incident.id}`);
        if (btn && onSelectIncident) {
          btn.onclick = () => {
            onSelectIncident(incident);
          };
        }
      });

      marker.on('click', () => {
        if (onSelectIncident) {
          onSelectIncident(incident);
        }
      });

      markersLayerRef.current?.addLayer(marker);
    });
  }, [incidents, selectedIncidentId, onSelectIncident]);

  return (
    <div className={`relative w-full rounded-xl overflow-hidden border border-slate-200 shadow-inner ${className}`} style={{ height }}>
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {interactivePicker && (
        <div className="absolute top-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium text-slate-700 flex items-center gap-1.5 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
          Click on the map or drag the pin to set incident coordinates
        </div>
      )}
    </div>
  );
};
