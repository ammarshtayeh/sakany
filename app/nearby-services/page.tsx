"use client";

import { useState, useEffect, useMemo } from "react";
import Navbar from "@/components/Navbar";
import {
  Store, Utensils, Coffee, ShoppingBag, Sparkles,
  Phone, ArrowRight, Tag, MessageSquare, Sparkle,
  Star, Clock, Crown, Zap, Shield, Gift,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNearbyServices } from "@/lib/firestore-service";
import { NearbyService } from "@/data/mockData";
import Link from "next/link";
import SponsoredCard from "@/components/SponsoredCard";

const CATEGORIES = [
  { id: "all", name: "الكل", icon: Store },
  { id: "restaurant", name: "مطاعم", icon: Utensils },
  { id: "cafe", name: "مقاهي", icon: Coffee },
  { id: "supermarket", name: "سوبرماركت", icon: ShoppingBag },
  { id: "laundry", name: "مغاسل", icon: Sparkles },
  { id: "other", name: "خدمات أخرى", icon: Sparkle },
];

export default function NearbyServicesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [services, setServices] = useState<NearbyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showOffersOnly, setShowOffersOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const fetched = await getNearbyServices();
        setServices(fetched);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // Sorted & filtered: Premium first → Featured → Basic → No tier
  const filteredServices = useMemo(() => {
    const tierOrder = { premium: 0, featured: 1, basic: 2 };
    let list = services.filter((service) => {
      if (activeCategory !== "all" && service.category !== activeCategory) return false;
      if (showOffersOnly && !service.studentOffer) return false;
      return true;
    });
    list.sort((a, b) => {
      const aOrder = tierOrder[a.sponsorTier as keyof typeof tierOrder] ?? 3;
      const bOrder = tierOrder[b.sponsorTier as keyof typeof tierOrder] ?? 3;
      return aOrder - bOrder;
    });
    return list;
  }, [services, activeCategory, showOffersOnly]);

  return (
    <div className="min-h-screen bg-background text-slate-900 dark:text-foreground flex flex-col font-almarai overflow-x-hidden">
      <Navbar />

      {/* Decorative Aurora glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 dark:text-foreground mb-6 leading-tight"
          >
            الخدمات <span className="bg-gradient-to-l from-primary to-teal-400 bg-clip-text text-transparent">القريبة والمجاورة</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-bold leading-relaxed"
          >
            وفرنا لك دليلاً متكاملاً لأفضل المطاعم، المقاهي، السوبرماركت ومغاسل
            الملابس المجاورة لجامعة النجاح وسكنك، مع عروض وخصومات حصرية خاصة
            بالطلاب!
          </motion.p>
        </header>

        {/* Category Tabs + Offers Filter */}
        <section className="mb-12 flex flex-col items-center gap-4">
          <div className="flex bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 p-2 rounded-3xl backdrop-blur-md gap-2 shadow-sm shrink-0 overflow-x-auto pb-2 scrollbar-thin">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 whitespace-nowrap ${
                    isSelected
                      ? "bg-primary text-white shadow-xl shadow-primary/20"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  <Icon size={18} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>

          {/* Offers only toggle */}
          <button
            onClick={() => setShowOffersOnly(!showOffersOnly)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-black border transition-all ${
              showOffersOnly
                ? "bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-amber-300 hover:text-amber-600"
            }`}
          >
            <Gift size={16} />
            عروض الطلاب فقط
          </button>
        </section>

        {/* Services Listings */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 dark:text-slate-500 font-bold">جاري تحميل الخدمات القريبة...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                >
                  <SponsoredCard service={service} variant="full" />
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredServices.length === 0 && (
              <div className="col-span-full py-20 text-center opacity-30">
                <Store size={48} className="mx-auto mb-4" />
                <p className="text-2xl font-black">
                  لا توجد خدمات مضافة في هذا القسم حالياً
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pitch / Advertise Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-28 relative bg-[#0b0f19] text-white rounded-[3.5rem] p-10 md:p-16 overflow-hidden border border-white/5 shadow-2xl shadow-slate-950/20 text-right flex flex-col md:flex-row justify-between items-center gap-10"
        >
          {/* Subtle glowing elements */}
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-orange-500/10 rounded-full blur-[80px] pointer-events-none" />

          <div className="flex-1 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 text-orange-400">
              <Sparkles size={16} />
              <span className="text-xs font-black tracking-wide uppercase">
                فرصة تسويقية لا تعوض
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
              هل تملك محلاً تجارياً وتريد{" "}
              <span className="text-primary">مزيداً من الزبائن؟</span>
            </h2>
            <p className="text-slate-400 font-bold text-lg leading-relaxed max-w-2xl">
              منصتنا يزورها آلاف الطلاب شهرياً في نابلس. اعلن معنا في هذه الصفحة
              الآن واجذب الطلاب لمطعمك، مقهاك، أو محلك عبر تقديم عروض حصرية
              تضمن لك ولاءهم!
            </p>
          </div>

          <div className="shrink-0 z-10 w-full md:w-auto">
            <Link
              href="/advertise"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-gradient-to-l from-primary to-teal-500 text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-primary/30"
            >
              ابدأ الإعلان معنا الآن
              <ArrowRight size={24} className="rotate-180" />
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
