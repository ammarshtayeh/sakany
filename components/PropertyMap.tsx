"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { NearbyService } from "@/data/mockData";
import { getNearbyServices } from "@/lib/firestore-service";

interface PropertyMapProps {
  lat: number;
  lng: number;
  title?: string;
}

// Calculate distance between two coordinates in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function PropertyMap({ lat, lng, title }: PropertyMapProps) {
  const [nearby, setNearby] = useState<(NearbyService & { distance: number })[]>([]);

  useEffect(() => {
    async function fetchNearby() {
      try {
        const services = await getNearbyServices();
        const filtered = services
          .map((s) => {
            const distance = s.lat && s.lng ? calculateDistance(lat, lng, s.lat, s.lng) : 999;
            return { ...s, distance };
          })
          .filter((s) => s.distance <= 1.5) // limit to 1.5 km
          .sort((a, b) => a.distance - b.distance);
        setNearby(filtered);
      } catch (e) {
        console.error("Failed to load nearby services on map:", e);
      }
    }
    fetchNearby();
  }, [lat, lng]);

  const handleOpenInMaps = () => {
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    if (isIOS) {
      window.open(`http://maps.apple.com/?q=${lat},${lng}`, "_blank");
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");
    }
  };

  // Helper for custom emojis pins
  const createEmojiIcon = (emoji: string, bgClass: string = "bg-primary") => {
    return L.divIcon({
      html: `<div class="w-10 h-10 rounded-full ${bgClass} border-2 border-white flex items-center justify-center text-xl shadow-lg transform hover:scale-110 transition-transform duration-200">
               <span>${emoji}</span>
             </div>`,
      className: "custom-leaflet-icon",
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });
  };

  const position: [number, number] = [lat, lng];

  const getServiceEmoji = (category: string) => {
    switch (category) {
      case "restaurant":
        return { emoji: "🍔", bg: "bg-amber-500" };
      case "cafe":
        return { emoji: "☕", bg: "bg-orange-500" };
      case "supermarket":
        return { emoji: "🛒", bg: "bg-blue-500" };
      case "laundry":
        return { emoji: "🧺", bg: "bg-teal-500" };
      default:
        return { emoji: "📍", bg: "bg-slate-500" };
    }
  };

  return (
    <div className="w-full h-full min-h-[350px] rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-border shadow-xl bg-slate-50 relative z-10">
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

        {/* Main Property Pin */}
        <Marker position={position} icon={createEmojiIcon("🏠", "bg-primary")} />

        {/* Nearby Services Pins */}
        {nearby.map((service) => {
          if (!service.lat || !service.lng) return null;
          const { emoji, bg } = getServiceEmoji(service.category);
          return (
            <Marker
              key={service.id}
              position={[service.lat, service.lng]}
              icon={createEmojiIcon(emoji, bg)}
            >
              <Popup>
                <div className="p-3 text-right font-sans font-bold flex flex-col gap-1 max-w-[200px]">
                  <h4 className="text-sm font-black text-slate-900">{service.name}</h4>
                  <p className="text-xs text-slate-500">{service.address}</p>
                  <p className="text-xs text-primary font-black">تبعد {(service.distance * 1000).toFixed(0)} متر</p>
                  {service.discount && (
                    <span className="mt-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-[10px] font-black inline-block text-center border border-amber-200">
                      🎁 {service.discount}
                    </span>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Location Label Offset */}
      <div className="absolute bottom-6 left-6 z-[40] bg-white/90 dark:bg-card/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-border shadow-lg text-right flex flex-col gap-2">
        <div>
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
            موقع السكن
          </p>
          <p className="text-sm font-black text-slate-900 dark:text-foreground">
            {title || "موقع العقار"}
          </p>
        </div>
        <button
          onClick={handleOpenInMaps}
          className="bg-primary text-white text-xs font-black px-4 py-2 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20 cursor-pointer"
        >
          افتح في الخرائط 🗺️
        </button>
      </div>
    </div>
  );
}
