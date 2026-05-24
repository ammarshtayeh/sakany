"use client";

import { useEffect, useState } from "react";
import { NearbyService } from "@/data/mockData";
import { getNearbyServices } from "@/lib/firestore-service";
import { Crown, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function PartnersStrip() {
  const [partners, setPartners] = useState<NearbyService[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const all = await getNearbyServices();
        // Show premium first, then featured
        const sponsored = all
          .filter((s) => s.sponsorTier === "premium" || s.sponsorTier === "featured")
          .sort((a, b) => {
            const order = { premium: 0, featured: 1, basic: 2 };
            return (order[a.sponsorTier || "basic"] || 2) - (order[b.sponsorTier || "basic"] || 2);
          });
        setPartners(sponsored);
      } catch (error) {
        console.error("Error loading partners:", error);
      }
    }
    load();
  }, []);

  if (partners.length === 0) return null;

  return (
    <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/nearby-services"
            className="text-primary font-black text-sm flex items-center gap-2 hover:gap-3 transition-all"
          >
            عرض الكل
            <ArrowRight size={16} className="rotate-180" />
          </Link>
          <div className="flex items-center gap-3 text-right">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-foreground">
                شركاؤنا المميزون
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold">
                محلات ومطاعم موثوقة بالقرب من سكنك
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
              <Crown size={22} className="text-amber-500" />
            </div>
          </div>
        </div>

        {/* Horizontal scrolling strip */}
        <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin snap-x snap-mandatory">
          {partners.map((p) => {
            const isPremium = p.sponsorTier === "premium";
            return (
              <div
                key={p.id}
                className={`shrink-0 w-[280px] snap-start bg-white dark:bg-slate-900 border-2 ${
                  isPremium ? "border-amber-300 dark:border-amber-500/40" : "border-teal-300 dark:border-teal-500/40"
                } rounded-[2rem] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all group`}
              >
                <div className="relative h-36 overflow-hidden bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black ${
                      isPremium
                        ? "bg-gradient-to-l from-amber-400 to-amber-500 text-white"
                        : "bg-gradient-to-l from-teal-500 to-teal-600 text-white"
                    }`}
                  >
                    {isPremium ? "راعي ذهبي ⭐" : "مميز ✦"}
                  </div>
                </div>
                <div className="p-5 text-right">
                  <h4 className="font-black text-slate-900 dark:text-foreground text-sm mb-1 group-hover:text-primary transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-bold mb-2">📍 {p.address}</p>
                  {p.studentOffer && (
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl px-3 py-2 text-right">
                      <p className="text-xs font-black text-amber-600 dark:text-amber-400">🎁 {p.studentOffer}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* CTA Card */}
          <Link
            href="/advertise"
            className="shrink-0 w-[280px] snap-start bg-slate-900 dark:bg-slate-950 border-2 border-slate-700 rounded-[2rem] flex flex-col items-center justify-center p-8 text-center hover:scale-[1.02] transition-all group"
          >
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
              <Crown size={24} className="text-primary" />
            </div>
            <h4 className="text-white font-black text-lg mb-2">محلك هنا!</h4>
            <p className="text-slate-400 text-xs font-bold mb-4">اعلن في سكنو واجذب الطلاب</p>
            <span className="text-primary font-black text-sm flex items-center gap-1">
              ابدأ الآن <ArrowRight size={14} className="rotate-180" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
