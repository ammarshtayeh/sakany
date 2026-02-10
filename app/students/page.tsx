"use client";

import { useState, useMemo, useEffect } from "react";
import { Listing } from "@/data/mockData";
import { getListings } from "@/lib/firestore-service";
import ListingCard from "@/components/ListingCard";
import { Search, Filter, Compass, X, ChevronDown } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedCollege, setSelectedCollege] = useState("all");

  const [listingsData, setListingsData] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings("students");
        setListingsData(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  const listings = useMemo(() => {
    return listingsData
      .filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      .filter((l) => l.price <= maxPrice)
      .filter(
        (l) => selectedCollege === "all" || l.nearbyCollege === selectedCollege,
      );
  }, [searchQuery, maxPrice, selectedCollege]);

  const colleges = [
    { id: "all", name: "الكل" },
    { id: "new_campus", name: "الحرم الجديد" },
    { id: "old_campus", name: "الحرم القديم" },
    { id: "medical_campus", name: "المجمع الطبي" },
    { id: "academy", name: "الأكاديمية" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative">
            <div className="flex items-center gap-3 text-primary font-black mb-4 group cursor-default">
              <Compass
                size={24}
                className="group-hover:rotate-45 transition-transform duration-500"
              />
              <span className="uppercase tracking-[0.3em] text-sm italic">
                Explore Nablus Housing
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
              سكن <span className="text-gradient">الشباب</span>
            </h1>
            <p className="text-slate-600 max-w-xl text-lg mt-4 font-bold leading-relaxed">
              أفضل الخيارات المتاحة لطلاب جامعة النجاح الوطنية في نابلس. سكنات
              موثوقة وقريبة من الحرم الجامعي.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
                size={24}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث بالحي (رفيديا، تونس...)"
                className="w-full pr-14 pl-6 py-5 rounded-[1.5rem] border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none transition-all font-bold text-lg shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-16 w-16 flex items-center justify-center rounded-[1.5rem] border transition-all shadow-xl ${isFilterOpen ? "bg-primary border-primary text-white" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}
            >
              <Filter size={28} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12"
            >
              <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {/* Price Filter */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-900 font-black">
                      <span>السعر الأقصى</span>
                      <span className="text-primary">{maxPrice} ₪</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="3000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>500 ₪</span>
                      <span>3000 ₪</span>
                    </div>
                  </div>

                  {/* College Filter */}
                  <div className="space-y-4 text-right">
                    <label className="block text-slate-900 font-black">
                      القرب من الكلية
                    </label>
                    <div className="flex flex-wrap gap-3 justify-end">
                      {colleges.map((college) => (
                        <button
                          key={college.id}
                          onClick={() => setSelectedCollege(college.id)}
                          className={`px-6 py-3 rounded-xl text-sm font-black transition-all border ${
                            selectedCollege === college.id
                              ? "bg-primary border-primary text-white shadow-lg shadow-primary/20"
                              : "bg-slate-50 border-slate-200 text-slate-500 hover:border-primary/30"
                          }`}
                        >
                          {college.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reset Filters */}
                  <div className="flex items-end justify-center lg:justify-start">
                    <button
                      onClick={() => {
                        setMaxPrice(3000);
                        setSelectedCollege("all");
                        setSearchQuery("");
                      }}
                      className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors font-black text-sm uppercase tracking-widest"
                    >
                      <X size={18} />
                      تصفير الفلاتر
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            <div className="col-span-full py-40 text-center flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-black text-slate-500">
                جاري تحميل السكنات...
              </p>
            </div>
          ) : (
            listings.map((listing, idx) => (
              <motion.div
                key={listing.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <ListingCard listing={listing} />
              </motion.div>
            ))
          )}
          {listings.length === 0 && (
            <div className="col-span-full py-40 text-center opacity-20 flex flex-col items-center">
              <Compass
                size={80}
                className="mb-6 animate-pulse text-slate-900"
              />
              <p className="text-3xl font-black text-slate-900">
                لا توجد سكنات معروضة حالياً تطابق بحثك
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
