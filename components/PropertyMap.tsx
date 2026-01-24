"use client";

import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface PropertyMapProps {
  lat: number;
  lng: number;
  title?: string;
}

export default function PropertyMap({ lat, lng, title }: PropertyMapProps) {
  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full h-full min-h-[350px] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-xl bg-slate-50 relative z-10">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={icon} />
      </MapContainer>

      {/* Location Label Offset */}
      <div className="absolute bottom-6 left-6 z-[40] bg-white/90 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-200 shadow-lg text-right">
        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
          موقع السكن
        </p>
        <p className="text-sm font-black text-slate-900">
          {title || "موقع العقار"}
        </p>
      </div>
    </div>
  );
}
