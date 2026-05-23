"use client";

import { useState, useMemo, useEffect } from "react";
import { Listing } from "@/data/mockData";
import { getListings } from "@/lib/firestore-service";
import ListingCard from "@/components/ListingCard";
import { Search, Filter, Compass, X, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function StudentessesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [selectedCollege, setSelectedCollege] = useState("all");

  const [selectedType, setSelectedType] = useState("all");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const [listingsData, setListingsData] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await getListings("studentesses");
        setListingsData(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Update favorites whenever showFavoritesOnly is toggled or page mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const favs = JSON.parse(localStorage.getItem("fav_listings") || "[]");
      setFavorites(favs);
    }
  }, [showFavoritesOnly]);

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
      )
      .filter(
        (l) => selectedType === "all" || l.type === selectedType,
      )
      .filter(
        (l) =>
          selectedFeatures.length === 0 ||
          selectedFeatures.every((feat) =>
            l.features.some((lf) => lf.toLowerCase().includes(feat.toLowerCase()))
          ),
      )
      .filter(
        (l) => !showFavoritesOnly || favorites.includes(l.id)
      );
  }, [searchQuery, maxPrice, selectedCollege, selectedType, selectedFeatures, showFavoritesOnly, favorites, listingsData]);

  const colleges = [
    { id: "all", name: "الكل" },
    { id: "new_campus", name: "الحرم الجديد" },
    { id: "old_campus", name: "الحرم القديم" },
    { id: "medical_campus", name: "المجمع الطبي" },
    { id: "academy", name: "الأكاديمية" },
  ];

  const propertyTypes = [
    { id: "all", name: "كل الأنواع" },
    { id: "apartment", name: "شقة كاملة" },
    { id: "room", name: "غرفة" },
    { id: "studio", name: "استوديو" },
  ];

  const popularFeatures = [
    { id: "إنترنت", name: "إنترنت فايبر" },
    { id: "تكييف", name: "تكييف سريع" },
    { id: "مواقف", name: "مواقف سيارات" },
    { id: "مصعد", name: "مصعد" },
    { id: "أمن", name: "أمن وحراسة" },
    { id: "هادئة", name: "بيئة هادئة" },
  ];

  const toggleFeature = (featId: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(featId) ? prev.filter((f) => f !== featId) : [...prev, featId]
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 theme-pink text-foreground">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative">
            <div className="flex items-center gap-3 text-pink-500 font-black mb-4 group cursor-default">
              <Compass
                size={24}
                className="group-hover:rotate-45 transition-transform duration-500"
              />
              <span className="uppercase tracking-[0.3em] text-sm italic">
                Exclusive for Studentesses
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-foreground leading-tight">
              سكن <span className="text-pink-600">الطالبات</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg mt-4 font-bold leading-relaxed">
              نوفر لكِ أرقى السكنات في مدينة نابلس، مع ضمان التام للخصوصية،
              الأمن، والراحة التامة قريباً من كلياتك.
            </p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-96 group">
              <Search
                className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-pink-655 transition-colors focus-within:text-pink-600"
                size={24}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحثي بالحي (المخفية، رفيديا...)"
                className="w-full pr-14 pl-6 py-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-card text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/5 outline-none transition-all font-bold text-lg shadow-sm"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`h-16 w-16 flex items-center justify-center rounded-[1.5rem] border transition-all shadow-xl ${isFilterOpen ? "bg-pink-600 border-pink-600 text-white" : "border-slate-200 dark:border-slate-800 bg-white dark:bg-card text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850"}`}
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
              <div className="bg-white dark:bg-card border border-slate-200 dark:border-border rounded-[2.5rem] p-8 md:p-10 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {/* Price Filter */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-slate-900 dark:text-foreground font-black">
                      <span>السعر الأقصى</span>
                      <span className="text-pink-600">{maxPrice} ₪</span>
                    </div>
                    <input
                      type="range"
                      min="500"
                      max="3000"
                      step="50"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-pink-600"
                    />
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>500 ₪</span>
                      <span>3000 ₪</span>
                    </div>
                  </div>

                  {/* College Filter */}
                  <div className="space-y-4 text-right">
                    <label className="block text-slate-900 dark:text-foreground font-black">
                      القرب من الكلية
                    </label>
                    <div className="flex flex-wrap gap-3 justify-end">
                      {colleges.map((college) => (
                        <button
                          key={college.id}
                          onClick={() => setSelectedCollege(college.id)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all border ${
                            selectedCollege === college.id
                              ? "bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-600/20"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-pink-600/30"
                          }`}
                        >
                          {college.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Property Type Filter */}
                  <div className="space-y-4 text-right">
                    <label className="block text-slate-900 dark:text-foreground font-black">
                      نوع السكن
                    </label>
                    <div className="flex flex-wrap gap-3 justify-end">
                      {propertyTypes.map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id)}
                          className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all border ${
                            selectedType === type.id
                              ? "bg-pink-600 border-pink-600 text-white shadow-lg shadow-pink-600/20"
                              : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-pink-600/30"
                          }`}
                        >
                          {type.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Features Filter */}
                  <div className="space-y-4 text-right md:col-span-2">
                    <label className="block text-slate-900 dark:text-foreground font-black">
                      المميزات والخدمات
                    </label>
                    <div className="flex flex-wrap gap-3 justify-end">
                      {popularFeatures.map((feat) => {
                        const isSelected = selectedFeatures.includes(feat.id);
                        return (
                          <button
                            key={feat.id}
                            onClick={() => toggleFeature(feat.id)}
                            className={`px-4 py-2.5 rounded-xl text-sm font-black transition-all border flex items-center gap-2 ${
                              isSelected
                                ? "bg-pink-600/10 border-pink-600 text-pink-600 shadow-sm"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-pink-600/20"
                            }`}
                          >
                            <span>{feat.name}</span>
                            {isSelected && <span className="w-2 h-2 rounded-full bg-pink-600" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Favorites and Reset Filters */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-end justify-between gap-4 md:col-span-1">
                    {/* Favorites Toggle */}
                    <button
                      onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                      className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border font-black text-sm transition-all shadow-md ${
                        showFavoritesOnly
                          ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/25"
                          : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      }`}
                    >
                      <Heart size={18} className={showFavoritesOnly ? "fill-current" : ""} />
                      <span>المفضلة فقط</span>
                    </button>

                    {/* Reset Button */}
                    <button
                      onClick={() => {
                        setMaxPrice(3000);
                        setSelectedCollege("all");
                        setSelectedType("all");
                        setSelectedFeatures([]);
                        setShowFavoritesOnly(false);
                        setSearchQuery("");
                      }}
                      className="flex items-center justify-center gap-2 py-4 px-6 text-slate-400 hover:text-pink-600 transition-colors font-black text-sm uppercase tracking-widest border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl"
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
              <div className="w-16 h-16 border-4 border-slate-200 border-t-pink-600 rounded-full animate-spin mb-4"></div>
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
          {!isLoading && listings.length === 0 && (
            <div className="col-span-full py-40 text-center opacity-20 flex flex-col items-center">
              <Compass
                size={80}
                className="mb-6 animate-pulse text-slate-900"
              />
              <p className="text-3xl font-black text-slate-900">
                لا توجد سكنات معروضة حالياً تطابق بحثكِ
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
