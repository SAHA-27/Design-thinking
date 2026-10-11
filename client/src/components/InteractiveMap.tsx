import React, { useEffect, useRef, useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Layers, 
  Maximize2, 
  LocateFixed, 
  Gauge, 
  Bike, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

export interface VehicleInfo {
  vehicleType?: string;
  model?: string;
  licensePlate?: string;
}

export interface InteractiveMapProps {
  technicianName: string;
  technicianLat?: number;
  technicianLng?: number;
  customerLat?: number;
  customerLng?: number;
  speedKmh?: number;
  heading?: number;
  distanceKm?: number;
  routeWaypoints?: [number, number][];
  vehicleInfo?: VehicleInfo;
  status: string;
  etaMins: number;
  isSimulating?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  technicianName,
  technicianLat = 13.0842,
  technicianLng = 80.2140,
  customerLat = 13.0850,
  customerLng = 80.2185,
  speedKmh = 32,
  heading = 75,
  distanceKm = 0.65,
  routeWaypoints = [],
  vehicleInfo = { vehicleType: 'Service Bike', model: 'Honda Activa 6G', licensePlate: 'TN 09 BK 4022' },
  status,
  etaMins,
  isSimulating = false
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const techMarkerRef = useRef<any>(null);
  const custMarkerRef = useRef<any>(null);
  const fullPolylineRef = useRef<any>(null);
  const traveledPolylineRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [followTech, setFollowTech] = useState(true);
  const [mapType, setMapType] = useState<'streets' | 'satellite'>('streets');

  // Compute effective waypoints if empty
  const defaultWaypoints: [number, number][] = [
    [technicianLat - 0.003, technicianLng - 0.005],
    [technicianLat - 0.0015, technicianLng - 0.0025],
    [technicianLat, technicianLng],
    [(technicianLat + customerLat) / 2, (technicianLng + customerLng) / 2],
    [customerLat, customerLng]
  ];

  const effectiveRoute = routeWaypoints && routeWaypoints.length >= 2 ? routeWaypoints : defaultWaypoints;

  // Initial Map Setup
  useEffect(() => {
    let isCancelled = false;

    const initMap = async () => {
      try {
        const L = (window as any).L || (await import('leaflet')).default;
        if (!mapContainerRef.current || mapInstanceRef.current || isCancelled) return;

        const centerLat = (technicianLat + customerLat) / 2;
        const centerLng = (technicianLng + customerLng) / 2;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 15,
          zoomControl: false,
          attributionControl: false
        });

        // Add base tile layer
        const tileUrl = mapType === 'streets' 
          ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

        tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(map);

        // Custom Animated Vehicle Marker HTML with heading rotation
        const createTechIcon = (bearing: number) => {
          return L.divIcon({
            className: 'custom-live-bike-pin',
            html: `
              <div class="relative flex items-center justify-center">
                <!-- Live Radar Pulse -->
                <div class="absolute -inset-3 bg-teal-500/25 rounded-full animate-ping pointer-events-none"></div>
                <div class="absolute -inset-1.5 bg-teal-400/30 rounded-full animate-pulse pointer-events-none"></div>
                
                <!-- Vehicle Disc with Rotating Arrow/Bike Icon -->
                <div style="transform: rotate(${bearing}deg); transition: transform 0.4s ease-out;" 
                     class="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-2 ring-teal-900/30 cursor-pointer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 19 21 12 17 5 21 12 2"/>
                  </svg>
                </div>
                
                <!-- Speed Pill -->
                <div class="absolute -bottom-6 bg-navy-900/90 text-[10px] font-mono text-teal-300 font-black px-1.5 py-0.5 rounded-full shadow border border-navy-700 whitespace-nowrap">
                  ${Math.round(speedKmh)} km/h
                </div>
              </div>
            `,
            iconSize: [44, 44],
            iconAnchor: [22, 22]
          });
        };

        // Custom Destination Home Pin HTML
        const customerIcon = L.divIcon({
          className: 'custom-live-home-pin',
          html: `
            <div class="relative flex items-center justify-center">
              <div class="absolute -inset-2 bg-emerald-500/20 rounded-full animate-pulse"></div>
              <div class="w-10 h-10 rounded-full bg-slate-900 text-emerald-400 flex items-center justify-center shadow-xl border-2 border-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
              </div>
              <div class="absolute -bottom-5 bg-white text-[10px] font-bold text-slate-800 px-1.5 py-0.2 rounded shadow border border-slate-200 whitespace-nowrap">
                You
              </div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        // Add Markers
        techMarkerRef.current = L.marker([technicianLat, technicianLng], { 
          icon: createTechIcon(heading),
          zIndexOffset: 1000 
        })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
              <strong style="color: #0f766e; font-size: 13px;">${technicianName}</strong>
              <div style="color: #475569;">Vehicle: ${vehicleInfo?.model || 'Motorcycle'} (${vehicleInfo?.licensePlate || ''})</div>
              <div style="margin-top: 4px; font-weight: bold; color: #0284c7;">Speed: ${Math.round(speedKmh)} km/h</div>
            </div>
          `);

        custMarkerRef.current = L.marker([customerLat, customerLng], { icon: customerIcon })
          .addTo(map)
          .bindPopup(`
            <div style="font-family: sans-serif; font-size: 12px;">
              <strong>Your Delivery Address</strong>
              <div style="color: #64748b;">Scheduled Service Location</div>
            </div>
          `);

        // Draw Upcoming Route Line (Vibrant Teal Dashed)
        fullPolylineRef.current = L.polyline(effectiveRoute, {
          color: '#0d9488',
          weight: 5,
          opacity: 0.9,
          dashArray: '8, 8',
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // Fit Bounds initially
        const bounds = L.latLngBounds([
          [technicianLat, technicianLng],
          [customerLat, customerLng]
        ]);
        map.fitBounds(bounds, { padding: [50, 50] });

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet live map initialization fallback:', err);
      }
    };

    initMap();

    return () => {
      isCancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Technician Marker Position Smoothly on telemetry updates
  useEffect(() => {
    if (!mapInstanceRef.current || !techMarkerRef.current) return;

    try {
      const L = (window as any).L;
      if (!L) return;

      const newLatLng = L.latLng(technicianLat, technicianLng);
      techMarkerRef.current.setLatLng(newLatLng);

      // Update icon HTML to reflect new heading & speed
      const newIcon = L.divIcon({
        className: 'custom-live-bike-pin',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-3 bg-teal-500/25 rounded-full animate-ping pointer-events-none"></div>
            <div class="absolute -inset-1.5 bg-teal-400/30 rounded-full animate-pulse pointer-events-none"></div>
            
            <div style="transform: rotate(${heading}deg); transition: transform 0.4s ease-out;" 
                 class="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-2xl border-2 border-white ring-2 ring-teal-900/30 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 19 21 12 17 5 21 12 2"/>
              </svg>
            </div>
            
            <div class="absolute -bottom-6 bg-navy-900/90 text-[10px] font-mono text-teal-300 font-black px-1.5 py-0.5 rounded-full shadow border border-navy-700 whitespace-nowrap">
              ${Math.round(speedKmh)} km/h
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      techMarkerRef.current.setIcon(newIcon);

      if (followTech) {
        mapInstanceRef.current.panTo(newLatLng, { animate: true, duration: 0.8 });
      }
    } catch (err) {
      console.warn('Failed to update marker:', err);
    }
  }, [technicianLat, technicianLng, heading, speedKmh, followTech]);

  // Handle Layer Toggle
  const toggleMapLayer = () => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    try {
      const L = (window as any).L;
      const nextType = mapType === 'streets' ? 'satellite' : 'streets';
      setMapType(nextType);

      mapInstanceRef.current.removeLayer(tileLayerRef.current);
      const tileUrl = nextType === 'streets' 
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

      tileLayerRef.current = L.tileLayer(tileUrl, { maxZoom: 19 }).addTo(mapInstanceRef.current);
    } catch (e) {
      console.error(e);
    }
  };

  // Center fit all markers
  const fitAll = () => {
    if (!mapInstanceRef.current) return;
    try {
      const L = (window as any).L;
      const bounds = L.latLngBounds([
        [technicianLat, technicianLng],
        [customerLat, customerLng]
      ]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], animate: true });
      setFollowTech(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Center on Tech
  const centerOnTech = () => {
    if (!mapInstanceRef.current) return;
    try {
      const L = (window as any).L;
      mapInstanceRef.current.setView([technicianLat, technicianLng], 16, { animate: true });
      setFollowTech(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[450px] rounded-3xl overflow-hidden border border-slate-200/80 shadow-2xl bg-slate-900">
      {/* Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Floating Telemetry & Status Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Status Chip */}
        <div className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-navy-900/90 text-white px-4 py-2 text-xs font-semibold backdrop-blur-md shadow-xl border border-navy-700/80">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <span className="tracking-wide">
            {status === 'Technician on the Way' ? 'Dispatched & Driving' : status}
          </span>
          {isSimulating && (
            <span className="bg-amber-500/20 text-amber-300 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
              Live GPS Sim
            </span>
          )}
        </div>

        {/* Speed & Pro Stats Chip */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-3 rounded-full bg-white/95 text-slate-800 px-4 py-2 text-xs font-bold backdrop-blur-md shadow-xl border border-slate-200/80">
          <div className="flex items-center gap-1.5 text-teal-700">
            <Gauge className="w-4 h-4 text-teal-600" />
            <span>{Math.round(speedKmh)} km/h</span>
          </div>
          <span className="text-slate-300">|</span>
          <div className="flex items-center gap-1.5 text-slate-700">
            <Navigation className="w-3.5 h-3.5 text-teal-600" />
            <span>{distanceKm > 0 ? `${distanceKm.toFixed(2)} km away` : 'Arrived at gate'}</span>
          </div>
        </div>
      </div>

      {/* Floating Map Action Buttons (Right Side) */}
      <div className="absolute right-4 top-20 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={centerOnTech}
          title="Center on Technician"
          className={`p-2.5 rounded-xl backdrop-blur-md shadow-lg border transition ${
            followTech 
              ? 'bg-teal-600 text-white border-teal-500 ring-2 ring-teal-400/30' 
              : 'bg-white/90 text-slate-700 hover:bg-white border-slate-200'
          }`}
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        <button
          onClick={fitAll}
          title="Fit Route View"
          className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md shadow-lg border border-slate-200 transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={toggleMapLayer}
          title={`Switch to ${mapType === 'streets' ? 'Satellite' : 'Streets'} layer`}
          className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-slate-700 backdrop-blur-md shadow-lg border border-slate-200 transition"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Floating Food-Delivery Style Driver Card */}
      <div className="absolute bottom-4 left-4 right-4 z-10 pointer-events-auto">
        <div className="rounded-2xl bg-white/95 p-4 text-slate-800 backdrop-blur-md shadow-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Driver & Vehicle Details */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-extrabold shadow-md">
                <Bike className="w-6 h-6" />
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-navy-900">{technicianName}</span>
                <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                  Verified Pro
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <span>{vehicleInfo?.model || 'Service Bike'}</span>
                <span>•</span>
                <span className="font-mono font-semibold text-slate-700 uppercase bg-slate-100 px-1.5 py-0.5 rounded">
                  {vehicleInfo?.licensePlate || 'TN 09 BK 4022'}
                </span>
              </p>
            </div>
          </div>

          {/* Dynamic ETA Pill & Distance */}
          <div className="flex items-center justify-between sm:justify-end gap-5 border-t sm:border-t-0 sm:border-l border-slate-200/80 pt-3 sm:pt-0 sm:pl-5">
            <div className="text-left sm:text-right">
              <span className="text-[11px] uppercase tracking-wider font-extrabold text-slate-400">
                Arriving In
              </span>
              <div className="text-xl sm:text-2xl font-black text-navy-900 tracking-tight flex items-baseline gap-1">
                <span>{etaMins}</span>
                <span className="text-xs font-semibold text-slate-500">mins</span>
              </div>
            </div>

            <div className="bg-teal-50 rounded-xl px-3 py-2 border border-teal-200 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-teal-700 block">Distance</span>
              <span className="text-xs sm:text-sm font-extrabold text-teal-900">
                {distanceKm > 0 ? `${distanceKm.toFixed(2)} km` : 'Near Door'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
