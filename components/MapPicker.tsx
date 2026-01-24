"use client";

import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin } from "lucide-react";

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialPos?: [number, number];
}

function LocationMarker({ onLocationSelect, initialPos }: MapPickerProps) {
  const map = useMap();
  const [position, setPosition] = useState<L.LatLng | null>(
    initialPos ? L.latLng(initialPos[0], initialPos[1]) : null,
  );

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : <Marker position={position} icon={icon} />;
}

export default function MapPicker({
  onLocationSelect,
  initialPos,
}: MapPickerProps) {
  const nablusCenter: [number, number] = [32.2211, 35.2544];
  const [map, setMap] = useState<L.Map | null>(null);

  const handleLocate = () => {
    if (map) {
      map.locate({ setView: true, maxZoom: 16, enableHighAccuracy: true });
    }
  };

  return (
    <div className="w-full h-[450px] relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl bg-slate-50">
      <MapContainer
        center={initialPos || nablusCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker
          onLocationSelect={onLocationSelect}
          initialPos={initialPos}
        />
      </MapContainer>

      {/* Controls Overlay */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-3">
        <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 shadow-lg pointer-events-none">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
            تحديد الموقع
          </p>
          <p className="text-xs font-black text-slate-800">
            اضغط على الخريطة للتعيين
          </p>
        </div>

        <button
          type="button"
          onClick={handleLocate}
          className="bg-primary text-white p-4 rounded-2xl shadow-xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
        >
          <div className="bg-white/20 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
            <MapPin size={18} />
          </div>
          <span className="font-black text-sm pr-1">حدّد موقعي الحالي</span>
        </button>
      </div>
    </div>
  );
}
