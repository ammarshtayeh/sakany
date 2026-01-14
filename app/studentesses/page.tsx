"use client";

import { useState, useMemo } from 'react';
import { mockListings } from '@/data/mockData';
import ListingCard from '@/components/ListingCard';
import { Search, Filter, Compass } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function StudentessesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const listings = useMemo(() => {
    return mockListings
      .filter(l => l.category === 'studentesses' && !l.isPending)
      .filter(l => 
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-20 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative">
            <div className="flex items-center gap-3 text-pink-500 font-black mb-4 group cursor-default">
              <Compass size={24} className="group-hover:rotate-45 transition-transform duration-500" />
              <span className="uppercase tracking-[0.3em] text-sm italic">Exclusive for Studentesses</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">سكن <span className="text-pink-500">الطالبات</span></h1>
            <p className="text-slate-400 max-w-xl text-lg mt-4 font-bold leading-relaxed">
              نوفر لكِ أرقى السكنات في مدينة نابلس، مع ضمان التام للخصوصية، الأمن، والراحة التامة قريباً من كلياتك.
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-pink-500 transition-colors" size={24} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي بالحي (المخفية، رفيديا...)" 
                className="w-full pr-14 pl-6 py-5 rounded-[1.5rem] border border-white/5 bg-white/5 text-white placeholder:text-slate-600 focus:border-pink-500/50 focus:bg-white/10 outline-none transition-all font-bold text-lg"
              />
            </div>
            <button className="h-16 w-16 flex items-center justify-center rounded-[1.5rem] border border-white/5 bg-white/5 hover:bg-white/10 text-white transition-all shadow-xl">
              <Filter size={28} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {listings.map((listing, idx) => (
            <div key={listing.id} className="animate-in fade-in zoom-in-95 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
              <ListingCard listing={listing} />
            </div>
          ))}
          {listings.length === 0 && (
            <div className="col-span-full py-40 text-center opacity-20 flex flex-col items-center">
              <Compass size={80} className="mb-6 animate-pulse text-pink-500" />
              <p className="text-3xl font-black text-white">لا توجد سكنات معروضة حالياً تطابق بحثكِ</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
