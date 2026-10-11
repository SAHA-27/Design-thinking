import React, { useEffect, useRef } from 'react';
import { Navigation, MapPin, Compass } from 'lucide-react';

interface InteractiveMapProps {
  technicianName: string;
  technicianLat?: number;
  technicianLng?: number;
  customerLat?: number;
  customerLng?: number;
  status: string;
  etaMins: number;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  technicianName,
  technicianLat = 13.0845,
  technicianLng = 80.2165,
  customerLat = 13.0850,
  customerLng = 80.2185,
  status,
  etaMins
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Check if Leaflet L is available globally or dynamically import
    const initMap = async () => {
      try {
        const L = (window as any).L || (await import('leaflet')).default;
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Base center point
        const centerLat = (technicianLat + customerLat) / 2;
        const centerLng = (technicianLng + customerLng) / 2;

        const map = L.map(mapContainerRef.current, {
          center: [centerLat, centerLng],
          zoom: 14,
          zoomControl: false
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        // Custom Tech Marker
        const techIcon = L.divIcon({
          className: 'custom-tech-pin',
          html: `<div style="background-color: #0f766e; color: white; padding: 6px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='3 11 22 2 13 21 11 13 3 11'/></svg></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        // Custom Customer Marker
        const customerIcon = L.divIcon({
          className: 'custom-cust-pin',
          html: `<div style="background-color: #0f172a; color: white; padding: 6px; border-radius: 9999px; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;"><svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/><polyline points='9 22 9 12 15 12 15 22'/></svg></div>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17]
        });

        const techMarker = L.marker([technicianLat, technicianLng], { icon: techIcon })
          .addTo(map)
          .bindPopup(`<b>${technicianName}</b><br/>Current Location (${status})`);

        const custMarker = L.marker([customerLat, customerLng], { icon: customerIcon })
          .addTo(map)
          .bindPopup('<b>Service Destination</b><br/>Your Address');

        // Draw Route Polyline
        const latlngs = [
          [technicianLat, technicianLng],
          [centerLat + 0.001, centerLng - 0.0005],
          [customerLat, customerLng]
        ];
        L.polyline(latlngs, { color: '#0d9488', weight: 4, dashArray: '6, 8', opacity: 0.9 }).addTo(map);

        mapInstanceRef.current = map;
      } catch (err) {
        console.warn('Leaflet map initialization fallback:', err);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [technicianLat, technicianLng, customerLat, customerLng, status, technicianName]);

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Status Pill */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 rounded-full bg-navy-900/90 text-white px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md shadow-md border border-navy-700">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
        </span>
        <span>Live Dispatch: {status}</span>
      </div>

      {/* Floating ETA Banner */}
      <div className="absolute bottom-3 right-3 left-3 sm:left-auto z-10 flex items-center justify-between sm:justify-start gap-4 rounded-xl bg-white/95 p-3 text-slate-800 backdrop-blur-md shadow-xl border border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
            <Navigation className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Estimated Arrival</div>
            <div className="text-sm font-bold text-slate-900">{etaMins} mins (approx. 2.4 km)</div>
          </div>
        </div>
        <div className="border-l border-slate-200 pl-3">
          <div className="text-[11px] text-slate-400">Pro on way</div>
          <div className="text-xs font-semibold text-teal-700 truncate max-w-[120px]">{technicianName}</div>
        </div>
      </div>
    </div>
  );
};
