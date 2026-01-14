"use client";

import { use } from 'react';
import { mockListings } from '@/data/mockData';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Phone, 
  Camera, 
  CheckCircle2, 
  Wifi, 
  Wind, 
  Car,
  User,
  MessageSquare,
  Bed,
  Bath,
  Maximize
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import ListingCard from '@/components/ListingCard';

export default function ListingDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const listing = mockListings.find(l => l.id === id);

  if (!listing) return notFound();

  const isStudentesses = listing.category === 'studentesses';
  const similarListings = mockListings
    .filter(l => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-black pb-20 text-white">
      <Navbar />

      <main className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden border border-white/5 group shadow-2xl">
              <Image src={listing.image} alt={listing.title} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              
              <div className="absolute top-8 right-8 flex gap-2">
                <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/10 ${
                  isStudentesses ? 'bg-pink-600/20 text-pink-400' : 'bg-orange-600/20 text-orange-400'
                }`}>
                  {isStudentesses ? 'سكن طالبات' : 'سكن طلاب'}
                </span>
              </div>

              <div className="absolute bottom-8 right-8 flex gap-3">
                <button className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-white hover:bg-white/20 transition-all">
                  <Camera size={24} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              {[listing.image, listing.image, listing.image].map((img, i) => (
                <div key={i} className="relative h-32 rounded-[2rem] overflow-hidden border border-white/10 opacity-60 hover:opacity-100 transition-all cursor-pointer hover:scale-105">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <div className="flex items-center gap-3 text-orange-500 font-black mb-4">
                <Building2 size={24} />
                <span className="uppercase tracking-[0.3em] text-xs">Premium Listing</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">{listing.title}</h1>
              <div className="flex items-center gap-2 text-slate-400 bg-white/5 self-start px-4 py-2 rounded-xl border border-white/5">
                <MapPin size={20} className="text-orange-500" />
                <span className="font-bold text-sm">{listing.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 blur-3xl rounded-full"></div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">السعر الشهري</p>
                <p className="text-4xl font-black text-white">{listing.price} <span className="text-sm font-bold text-orange-500">₪</span></p>
              </div>
              <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">الحالة الآن</p>
                <div className="flex items-center gap-2">
                   <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                   <p className="text-xl font-black text-emerald-500">متاح وبانتظارك</p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-black mb-6 text-white flex items-center gap-3">
                <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
                تفاصيل السكن
              </h3>
              <p className="text-slate-400 leading-loose text-lg font-bold">{listing.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
               {[
                 { icon: Bed, label: 'غرف النوم', value: listing.beds || 'غير محدد' },
                 { icon: Bath, label: 'الحمامات', value: listing.bathrooms || 'غير محدد' },
                 { icon: Maximize, label: 'المساحة', value: listing.sqft ? `${listing.sqft}م²` : 'غير محدد' }
               ].map((item, idx) => (
                 <div key={idx} className="flex flex-col items-center p-6 bg-white/5 rounded-3xl border border-white/5 hover:bg-white/10 transition-colors">
                    <item.icon size={24} className="text-orange-500 mb-3" />
                    <span className="text-white font-black text-lg">{item.value}</span>
                    <span className="text-slate-500 text-[10px] font-bold uppercase">{item.label}</span>
                 </div>
               ))}
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-black mb-8 text-white flex items-center gap-3">
                <div className="w-8 h-1 bg-orange-500 rounded-full"></div>
                المميزات والخدمات
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-white/5 rounded-2xl border border-white/5 text-slate-300 group hover:border-orange-500/30 transition-all">
                    <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                      {feature.includes('إنترنت') ? <Wifi size={24} /> : feature.includes('تكييف') ? <Wind size={24} /> : <ShieldCheck size={24} />}
                    </div>
                    <span className="font-black text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner Section */}
            <div className="bg-premium-gradient p-10 rounded-[3rem] shadow-2xl shadow-orange-600/30 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-black/20 overflow-hidden ring-4 ring-white/10">
                   <Image src={`https://ui-avatars.com/api/?name=${listing.ownerName}&background=000&color=fff&size=128`} alt={listing.ownerName} width={96} height={96} />
                </div>
                <div>
                  <h4 className="text-3xl font-black">{listing.ownerName}</h4>
                  <p className="text-white/60 font-bold flex items-center gap-2">
                    <ShieldCheck size={16} />
                    صاحب عقار موثق في نابلس
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                <a 
                  href={`tel:${listing.ownerPhone}`}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white text-orange-600 rounded-[1.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  <Phone size={28} />
                  اتصل الآن
                </a>
                <a 
                  href={`https://wa.me/${listing.ownerPhone.replace('0', '970')}`}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-black/20 border border-white/20 text-white rounded-[1.5rem] font-black text-xl hover:bg-black/30 transition-all"
                >
                  <MessageSquare size={28} />
                  واتساب
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-32">
            <div className="flex justify-between items-end mb-16 px-4">
              <div className="text-right">
                <h2 className="text-4xl font-black text-white mb-4">سكنات <span className="text-gradient">مشابهة</span></h2>
                <p className="text-slate-500 font-bold">قد يعجبك أيضاً هذه الخيارات في نفس القسم</p>
              </div>
              <Link href={isStudentesses ? '/studentesses' : '/students'} className="text-orange-500 font-black hover:underline underline-offset-8">عرض سجل القسم</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {similarListings.map((simListing) => (
                <ListingCard key={simListing.id} listing={simListing} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
