"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import {
  Store,
  Utensils,
  Coffee,
  ShoppingBag,
  Sparkles,
  Phone,
  ArrowRight,
  Tag,
  MessageSquare,
  Sparkle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getNearbyServices } from "@/lib/firestore-service";
import { NearbyService } from "@/data/mockData";

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

  const filteredServices = services.filter((service) => {
    if (activeCategory === "all") return true;
    return service.category === activeCategory;
  });

  return (
    <div className="min-h-screen bg-background text-slate-900 flex flex-col font-almarai overflow-x-hidden">
      <Navbar />

      {/* Decorative Aurora glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Section */}
      <main className="flex-1 pt-32 pb-24 px-6 max-w-7xl mx-auto w-full">
        <header className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary border border-primary/10 mb-6"
          >
            <Sparkles size={16} />
            <span className="text-sm font-black tracking-wide uppercase">
              دليل الطلاب الذكي
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-6xl font-black text-slate-900 mb-6 leading-tight"
          >
            الخدمات <span className="text-gradient">القريبة والمجاورة</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl font-bold leading-relaxed"
          >
            وفرنا لك دليلاً متكاملاً لأفضل المطاعم، المقاهي، السوبرماركت ومغاسل
            الملابس المجاورة لجامعة النجاح وسكنك، مع عروض وخصومات حصرية خاصة
            بالطلاب!
          </motion.p>
        </header>

        {/* Category Tabs */}
        <section className="mb-12 flex justify-center overflow-x-auto pb-4 scrollbar-thin">
          <div className="flex bg-white/60 border border-slate-200/80 p-2 rounded-3xl backdrop-blur-md gap-2 shadow-sm shrink-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-black text-sm transition-all duration-300 relative ${
                    isSelected
                      ? "bg-primary text-white shadow-xl shadow-primary/20"
                      : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={18} />
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Services Listings */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400 font-bold">جاري تحميل الخدمات القريبة...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredServices.map((service, index) => (
                <motion.article
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="bg-white border border-slate-200/80 rounded-[2.5rem] overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1 hover:border-primary/30 transition-all duration-500 group flex flex-col justify-between"
                >
                  {/* Business Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={service.image}
                      alt={service.name}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Discount badge */}
                    {service.discount && (
                      <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-orange-500/20 border border-orange-400/20">
                        <Tag size={12} />
                        <span>{service.discount}</span>
                      </div>
                    )}
                    {/* Category label */}
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider">
                      {CATEGORIES.find((c) => c.id === service.category)?.name ||
                        "خدمة"}
                    </div>
                  </div>

                  {/* Business Content */}
                  <div className="p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-black text-slate-950 mb-3 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-slate-400 text-xs font-bold mb-4">
                        📍 {service.address}
                      </p>
                      <p className="text-slate-600 font-bold leading-relaxed text-sm mb-6 line-clamp-3">
                        {service.description}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-4 pt-4 border-t border-slate-50">
                      {service.whatsapp && (
                        <a
                          href={`https://wa.me/${service.whatsapp}?text=${encodeURIComponent(
                            `مرحبا ${service.name}، أنا طالب من منصة سكنو وأود الاستفسار عن عروضكم.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl text-xs font-black hover:bg-emerald-500 hover:text-white transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                        >
                          <MessageSquare size={16} />
                          واتساب
                        </a>
                      )}
                      {service.phone && (
                        <a
                          href={`tel:${service.phone}`}
                          className="flex-1 py-4 bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl text-xs font-black hover:bg-slate-900 hover:text-white transition-all text-center flex items-center justify-center gap-2 shadow-sm"
                        >
                          <Phone size={16} />
                          اتصال
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
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
            <a
              href={`https://wa.me/972595537190?text=${encodeURIComponent(
                "مرحبا سكنو، أود الإعلان في صفحة الخدمات القريبة وعرض محلي التجاري للطلاب."
              )}`}
              target="_blank"
              rel="noreferrer"
              className="w-full md:w-auto inline-flex items-center justify-center gap-3 bg-premium-gradient text-white px-10 py-6 rounded-[2rem] font-black text-xl hover:scale-[1.03] active:scale-[0.97] transition-all shadow-xl shadow-primary/30"
            >
              ابدأ الإعلان معنا الآن
              <ArrowRight size={24} className="rotate-180" />
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
