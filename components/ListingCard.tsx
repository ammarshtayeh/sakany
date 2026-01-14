"use client";

import { Listing } from '@/data/mockData';
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
  Maximize
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const isStudentesses = listing.category === 'studentesses';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.5 }}
      className="group bg-[#0a0a0a] border border-[#1e1e1e] rounded-[2.5rem] overflow-hidden hover:border-orange-500/50 transition-all shadow-2xl"
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
            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${
              isStudentesses ? 'bg-pink-600/20 text-pink-400' : 'bg-orange-600/20 text-orange-400'
            }`}>
              {isStudentesses ? 'سكن طالبات' : 'سكن طلاب'}
            </span>
            <span className="px-4 py-1.5 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest">
              {listing.status === 'available' ? 'متاح' : 'محجوز'}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
             <div className="flex gap-3">
                {listing.features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="p-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white">
                    {feat.includes('إنترنت') ? <Wifi size={14} /> : feat.includes('تكييف') ? <Wind size={14} /> : <ShieldCheck size={14} />}
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="p-8">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold mb-3">
            <MapPin size={14} className="text-orange-500" />
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          
          <h3 className="text-xl font-black text-white mb-4 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {listing.title}
          </h3>

          <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
            <div className="flex gap-4">
               {listing.beds && (
                 <div className="flex items-center gap-1.5 text-slate-400">
                    <Bed size={16} className="text-orange-500/50" />
                    <span className="text-sm font-bold">{listing.beds}</span>
                 </div>
               )}
               {listing.bathrooms && (
                 <div className="flex items-center gap-1.5 text-slate-400">
                    <Bath size={16} className="text-orange-500/50" />
                    <span className="text-sm font-bold">{listing.bathrooms}</span>
                 </div>
               )}
               {listing.sqft && (
                 <div className="flex items-center gap-1.5 text-slate-400">
                    <Maximize size={16} className="text-orange-500/50" />
                    <span className="text-sm font-bold">{listing.sqft}م²</span>
                 </div>
               )}
            </div>
            <div className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">
              {listing.type}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">السعر الشهري</span>
              <span className="text-2xl font-black text-white">
                {listing.price} <span className="text-xs text-orange-500 font-bold">₪</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-orange-600 flex items-center justify-center text-white shadow-xl shadow-orange-600/20 group-hover:scale-110 transition-all">
              <ArrowRight size={24} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
