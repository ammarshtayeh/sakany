"use client";

import { Listing } from "@/data/mockData";
import {
  Building2,
  MapPin,
  Users,
  ArrowRight,
  CheckCircle2,
  Wifi,
  Wind,
  ShieldCheck,
  Bed,
  Bath,
  Maximize,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import StarRating from "./StarRating";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const isStudentesses = listing.category === "studentesses";

  // Calculate average rating
  const averageRating = listing.reviews?.length
    ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
      listing.reviews.length
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="group bg-white border border-slate-200/60 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-primary/10"
    >
      <Link href={`/listing/${listing.id}`}>
        <div className="relative h-64 overflow-hidden">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

          <div className="absolute top-4 right-4 flex gap-2">
            <span
              className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${
                isStudentesses
                  ? "bg-pink-600/90 text-white"
                  : "bg-primary/90 text-white"
              }`}
            >
              {isStudentesses ? "سكن طالبات" : "سكن طلاب"}
            </span>
            <span className="px-4 py-1.5 bg-white/40 backdrop-blur-md border border-white/20 rounded-xl text-[10px] font-black text-slate-900 uppercase tracking-widest">
              {listing.status === "available" ? "متاح" : "محجوز"}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
            <div className="flex gap-3">
              {listing.features.slice(0, 2).map((feat, i) => (
                <div
                  key={i}
                  className="p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white"
                >
                  {feat.includes("إنترنت") ? (
                    <Wifi size={14} />
                  ) : feat.includes("تكييف") ? (
                    <Wind size={14} />
                  ) : (
                    <ShieldCheck size={14} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] md:text-xs font-bold mb-3">
            <MapPin size={14} className="text-primary" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>

          {/* Rating */}
          {averageRating > 0 && (
            <div className="mb-3">
              <StarRating
                rating={averageRating}
                readonly
                size={16}
                showCount
                count={listing.reviews?.length || 0}
              />
            </div>
          )}

          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-4 line-clamp-1 group-hover:text-primary transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100">
            <div className="flex gap-3 md:gap-4">
              {listing.beds && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Bed size={14} className="md:w-4 md:h-4 text-primary/50" />
                  <span className="text-xs md:text-sm font-bold">
                    {listing.beds}
                  </span>
                </div>
              )}
              {listing.bathrooms && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Bath size={14} className="md:w-4 md:h-4 text-primary/50" />
                  <span className="text-xs md:text-sm font-bold">
                    {listing.bathrooms}
                  </span>
                </div>
              )}
              {listing.sqft && (
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Maximize
                    size={14}
                    className="md:w-4 md:h-4 text-primary/50"
                  />
                  <span className="text-xs md:text-sm font-bold">
                    {listing.sqft}م²
                  </span>
                </div>
              )}
            </div>
            <div className="text-slate-400 text-[8px] md:text-[10px] font-black uppercase tracking-tighter">
              {listing.type}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                السعر الشهري
              </span>
              <span className="text-xl md:text-2xl font-black text-slate-900">
                {listing.price}{" "}
                <span className="text-xs text-primary font-bold">₪</span>
              </span>
            </div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-premium-gradient flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-all">
              <ArrowRight size={20} className="md:w-6 md:h-6" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
