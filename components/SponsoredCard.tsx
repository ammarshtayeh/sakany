"use client";

import { NearbyService } from "@/data/mockData";
import { Star, Tag, Phone, MessageSquare, Clock, Crown, Zap, Shield } from "lucide-react";

interface SponsoredCardProps {
  service: NearbyService;
  variant?: "full" | "compact" | "inline";
}

const TIER_CONFIG = {
  premium: {
    badge: "راعي ذهبي ⭐",
    badgeClass: "bg-gradient-to-l from-amber-400 to-amber-500 text-white shadow-lg shadow-amber-400/20",
    borderClass: "border-amber-300 dark:border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.08)]",
    icon: Crown,
    glowClass: "bg-amber-400/5",
  },
  featured: {
    badge: "مميز ✦",
    badgeClass: "bg-gradient-to-l from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/20",
    borderClass: "border-teal-300 dark:border-teal-500/50",
    icon: Zap,
    glowClass: "bg-teal-400/5",
  },
  basic: {
    badge: "شريك سكنو",
    badgeClass: "bg-slate-700 dark:bg-slate-600 text-white",
    borderClass: "border-slate-300 dark:border-slate-700",
    icon: Shield,
    glowClass: "",
  },
};

export default function SponsoredCard({ service, variant = "full" }: SponsoredCardProps) {
  const tier = service.sponsorTier || "basic";
  const config = TIER_CONFIG[tier];

  if (variant === "inline") {
    return (
      <div className={`bg-white dark:bg-slate-900 border-2 ${config.borderClass} rounded-[2rem] p-5 flex items-center gap-5 transition-all hover:shadow-lg ${config.glowClass}`}>
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 min-w-0 text-right">
          <div className="flex items-center gap-2 justify-end mb-1">
            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${config.badgeClass}`}>{config.badge}</span>
            <h4 className="font-black text-slate-900 dark:text-foreground text-sm truncate">{service.name}</h4>
          </div>
          {service.studentOffer && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold flex items-center gap-1 justify-end">
              <Tag size={10} />
              {service.studentOffer}
            </p>
          )}
        </div>
        {service.phone && (
          <a href={`tel:${service.phone}`} className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shrink-0 hover:bg-primary hover:text-white transition-colors">
            <Phone size={16} />
          </a>
        )}
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className={`bg-white dark:bg-slate-900 border-2 ${config.borderClass} rounded-[2.5rem] overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 group ${config.glowClass}`}>
        <div className="relative h-36 overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={service.image} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black ${config.badgeClass}`}>
            {config.badge}
          </div>
        </div>
        <div className="p-5 text-right">
          <h4 className="font-black text-slate-900 dark:text-foreground mb-1 group-hover:text-primary transition-colors">{service.name}</h4>
          <p className="text-xs text-slate-400 font-bold mb-2">📍 {service.address}</p>
          {service.studentOffer && (
            <div className="flex items-center gap-1.5 justify-end text-amber-600 dark:text-amber-400">
              <span className="text-xs font-black">{service.studentOffer}</span>
              <Tag size={12} />
            </div>
          )}
          {service.rating && (
            <div className="flex items-center gap-1 mt-2 justify-end">
              <span className="text-xs font-bold text-slate-500">{service.reviewCount}</span>
              <span className="text-xs font-black text-slate-700 dark:text-slate-300">{service.rating}</span>
              <Star size={12} className="text-amber-400 fill-amber-400" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full variant (default)
  return (
    <div className={`bg-white dark:bg-slate-900 border-2 ${config.borderClass} rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 group flex flex-col justify-between ${config.glowClass}`}>
      {/* Image */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={service.image} alt={service.name} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
        
        {/* Tier Badge */}
        <div className={`absolute top-4 right-4 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 ${config.badgeClass}`}>
          {config.badge}
        </div>

        {/* Discount Badge */}
        {service.discount && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-orange-500/20">
            <Tag size={12} />
            {service.discount}
          </div>
        )}

        {/* Category */}
        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
          {service.category === "restaurant" ? "مطعم" : service.category === "cafe" ? "مقهى" : service.category === "supermarket" ? "سوبرماركت" : service.category === "laundry" ? "مغسلة" : "خدمة"}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {service.rating && (
                <>
                  <span className="text-xs font-bold text-slate-400">({service.reviewCount})</span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-300">{service.rating}</span>
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                </>
              )}
            </div>
            <h3 className="text-2xl font-black text-slate-950 dark:text-foreground group-hover:text-primary transition-colors text-right">{service.name}</h3>
          </div>

          <p className="text-slate-400 text-xs font-bold mb-2 text-right">📍 {service.address}</p>
          
          {service.openHours && (
            <p className="text-slate-400 text-xs font-bold mb-4 flex items-center gap-1 justify-end">
              <span>{service.openHours}</span>
              <Clock size={12} />
            </p>
          )}

          <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed text-sm mb-4 line-clamp-2 text-right">{service.description}</p>

          {/* Tags */}
          {service.tags && service.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4 justify-end">
              {service.tags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 text-[10px] font-bold border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-lg">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Student Offer highlight */}
          {service.studentOffer && (
            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-2xl px-4 py-3 flex items-center gap-2 justify-end mb-4">
              <span className="text-sm font-black text-amber-700 dark:text-amber-400">{service.studentOffer}</span>
              <div className="w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center shrink-0">
                <Tag size={14} className="text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          {service.whatsapp && (
            <a
              href={`https://wa.me/${service.whatsapp}?text=${encodeURIComponent(`مرحبا ${service.name}، أنا طالب من منصة سكنو وأود الاستفسار عن عروضكم.`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-4 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800 rounded-2xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageSquare size={16} />
              واتساب
            </a>
          )}
          {service.phone && (
            <a
              href={`tel:${service.phone}`}
              className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-black hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600 transition-all text-center flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone size={16} />
              اتصال
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
