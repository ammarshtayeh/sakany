"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  Instagram,
  MapPin,
  ArrowRight,
  UserPlus,
  GraduationCap,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import { mockListings, Ad } from "@/data/mockData";
import ListingCard from "@/components/ListingCard";
import OwnerActionModal from "@/components/OwnerActionModal";
import { getAds } from "@/lib/firestore-service";
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/schema";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const organizationSchema = generateOrganizationSchema();
  const websiteSchema = generateWebsiteSchema();
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    const isLocalAdmin = localStorage.getItem("local_admin") === "true";
    if (isLocalAdmin) {
      setIsAdmin(true);
    } else if (auth) {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        setIsAdmin(user?.email === "ammar.shtayeh@gmail.com");
      });
      // Do not return unsubscribe directly if we have other actions, we store it to cleanup
      const cleanAuth = () => unsubscribe();
      // Keep cleanup reference
    }

    const fetchAds = async () => {
      try {
        const fetched = await getAds();
        setAds(fetched);
      } catch (err) {
        console.error("Failed to fetch ads", err);
      }
    };
    fetchAds();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <Navbar />

      {isAdmin && (
        <div className="bg-slate-900 text-white py-4 px-6 text-center flex flex-col md:flex-row items-center justify-center gap-4 border-b border-primary/20 sticky top-[72px] md:top-[88px] z-40 shadow-xl animate-in slide-in-from-top-full duration-500">
          <div className="flex items-center gap-3 justify-center">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
            <p className="font-bold text-sm md:text-base">
              مرحباً بك عمار! أنت الآن مسجل كـ <span className="text-primary font-black">مدير الموقع (Admin)</span>.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="bg-primary text-white text-xs font-black px-4 py-2 rounded-xl hover:bg-primary-600 transition-all shadow-md active:scale-95"
            >
              الذهاب إلى لوحة الإدارة ⚙️
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("local_admin");
                if (auth) auth.signOut();
                setIsAdmin(false);
                window.location.reload();
              }}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-black px-4 py-2 rounded-xl transition-all"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center lg:text-right"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-primary text-xs font-bold mb-6 border border-orange-500/20"
              >
                <GraduationCap size={14} />
                <span>المنصة المعتمدة لطلاب جامعة النجاح الوطنية - نابلس</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 text-slate-900 text-balance"
              >
                استأجر سكنك في <br />
                <span className="text-gradient">نابلس</span> بضغطة زر
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                viewport={{ once: true }}
                className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mr-0 leading-relaxed font-bold"
              >
                سكنو هي أول منصة فلسطينية متخصصة في توفير السكنات الطلابية
                الآمنة لطلاب جامعة النجاح. نوفر لك خيارات متنوعة بالقرب من الحرم
                الجديد، الحرم القديم، والأكاديمية.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  href="/students"
                  className="bg-premium-gradient text-white px-8 py-4 rounded-xl text-lg font-black shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  تصفح السكنات المتاحة
                  <ArrowRight size={20} />
                </Link>
                <button
                  onClick={() => setIsOwnerModalOpen(true)}
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-lg font-black hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  عرض سكنك الآن
                  <Phone size={20} />
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 0.6 }}
                transition={{ delay: 1 }}
                viewport={{ once: true }}
                className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 text-slate-500"
              >
                <div className="flex flex-col items-center lg:items-end">
                  <span className="text-2xl font-bold">500+</span>
                  <span className="text-xs uppercase tracking-tighter">
                    طالب نجاح
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-center lg:items-end">
                  <span className="text-2xl font-bold">120+</span>
                  <span className="text-xs uppercase tracking-tighter">
                    عقار في نابلس
                  </span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true }}
              className="relative lg:h-[650px] md:h-[500px] h-[350px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5"
            >
              <Image
                src="/images/hero.png"
                alt="Modern Student Housing in Nablus"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 right-4 left-4 md:bottom-8 md:right-8 md:left-8 glass p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40">
                    <ShieldCheck size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">
                      سكنات موثقة 100%
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600">
                      فريقنا يقوم بمعاينة كل سكن في نابلس قبل عرضه
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* active ads banner */}
      {ads.length > 0 && (
        <section className="py-12 bg-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <span className="w-2.5 h-2.5 bg-primary rounded-full animate-ping"></span>
              <h3 className="text-xl font-black text-slate-900">عروض وإعلانات مميزة</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {ads.map((ad) => (
                <div key={ad.id} className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 group h-64 border border-slate-800 shadow-xl">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[1.5s]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <h4 className="text-xl md:text-2xl font-black text-white mb-4 leading-snug line-clamp-2">
                      {ad.title}
                    </h4>
                    {ad.linkUrl && (
                      <div>
                        <Link
                          href={ad.linkUrl}
                          className="inline-flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-xl font-black text-sm hover:bg-primary hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 duration-300"
                        >
                          تصفح العرض
                          <ArrowRight size={16} />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section id="categories" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight">
              أقسام السكن في{" "}
              <span className="text-gradient underline decoration-primary/10 underline-offset-8">
                نابلس
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg px-4 font-bold">
              سواء كنت تدرس في الحرم الجديد أو القديم، سكنو توفر لك المسكن
              الأقرب لكليتك بأسعار منافسة وبالشيكل.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 px-4 sm:px-0">
            {/* Men's Housing */}
            <div className="group relative rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-primary/30 transition-all duration-500 p-2">
              <div className="h-80 relative overflow-hidden rounded-[2.5rem]">
                <div className="absolute top-6 left-6 z-20 bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-2xl flex items-center gap-2">
                  <Users size={16} />
                  سكن الشباب
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
                  alt="سكن طلاب نابلس"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-4 text-slate-900">
                  طلاب جامعة النجاح
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-bold">
                  سكنات بالقرب من الحرم الجديد (شارع تونس والأكاديمية) والحرم
                  القديم، بخدمات متنوعة وتجهيزات كاملة.
                </p>
                <Link
                  href="/students"
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:bg-primary hover:border-primary transition-all text-slate-900 hover:text-white font-black text-lg group/btn shadow-sm"
                >
                  عرض السكنات المتاحة
                  <ArrowRight
                    size={24}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Women's Housing */}
            <div className="group relative rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-pink-500/30 transition-all duration-500 p-2">
              <div className="h-80 relative overflow-hidden rounded-[2.5rem]">
                <div className="absolute top-6 left-6 z-20 bg-pink-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-2xl flex items-center gap-2">
                  <Users size={16} />
                  سكن الطالبات
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800"
                  alt="سكن طالبات نابلس"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-4 text-slate-900">
                  طالبات جامعة النجاح
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-bold">
                  بيئة آمنة في أرقى مناطق نابلس (رفيديا والمخفية)، نوفر لك
                  الخصوصية التامة مع خدمات النقل والصيانة.
                </p>
                <Link
                  href="/studentesses"
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:bg-pink-600 hover:border-pink-600 transition-all text-slate-900 hover:text-white font-black text-lg group/btn shadow-sm"
                >
                  عرض السكنات المتاحة
                  <ArrowRight
                    size={24}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section id="featured" className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                أحدث <span className="text-gradient">السكنات</span> المضافة
              </h2>
              <p className="text-slate-500 font-bold text-sm md:text-base">
                استعرض مجموعة من أفضل الخيارات المتاحة حالياً في مدينة نابلس
              </p>
            </div>
            <Link
              href="/students"
              className="group flex items-center gap-3 text-primary font-black text-lg hover:text-primary-700 transition-colors"
            >
              عرض الكل
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockListings
              .filter((l) => !l.isPending)
              .slice(0, 3)
              .map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500 blur-[120px] rounded-full"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {[
              { label: "طالب يبحث عن سكن", value: "2,500+", icon: Users },
              { label: "سكن موثق", value: "180+", icon: ShieldCheck },
              { label: "منطقة في نابلس", value: "12", icon: MapPin },
              { label: "نسبة رضا الطلاب", value: "98%", icon: GraduationCap },
            ].map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className="text-primary w-8 h-8" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 italic">
                  {stat.value}
                </div>
                <div className="text-slate-400 font-bold text-sm uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
              كيف تجد سكنك في <span className="text-gradient">3 خطوات؟</span>
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-bold text-lg">
              صممنا العملية لتكون أسرع وأسهل ما يمكن لطلاب جامعة النجاح
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>

            {[
              {
                title: "ابحث وقارن",
                desc: "تصفح مئات السكنات الموثقة في نابلس وقارن بين الصور، الخدمات والأسعار.",
                step: "01",
              },
              {
                title: "اتصل مباشرة",
                desc: "تواصل مع صاحب السكن أو فريقنا عبر الواتساب أو الهاتف بدون وسطاء.",
                step: "02",
              },
              {
                title: "احجز وانتقل",
                desc: "قم بمعاينة السكن على أرض الواقع وأتمم إجراءات الحجز بكل سهولة.",
                step: "03",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative z-10 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 hover:border-primary/20 transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary text-white flex items-center justify-center text-2xl font-black mb-8 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  {item.step}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-500 font-bold leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-6">
              ماذا يقول <span className="text-gradient">طلابنا؟</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "أحمد منصور",
                major: "هندسة حاسوب",
                text: "أفضل منصة وفرت علي تعب البحث في شوارع رفيديا. الصور مطابقة تماماً للواقع والتعامل كان جداً راقي.",
              },
              {
                name: "سارة العبد",
                major: "طب بشري",
                text: "كطالبة مغتربة، كان يهمني جداً عامل الأمان. سكنو ساعدتني ألاقي سكن مريح وقريب جداً من المجمع الطبي.",
              },
              {
                name: "محمد خالد",
                major: "حقوق",
                text: "سهولة التواصل مع أصحاب السكنات ميزة خرافية. حجزت سكني وأنا لسا في البيت قبل ما يبدأ الفصل.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 text-orange-500 mb-6">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                </div>
                <p className="text-slate-700 font-bold italic mb-8 leading-relaxed">
                  "{item.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-black text-primary">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-900">{item.name}</h4>
                    <p className="text-xs text-slate-500 font-bold">
                      {item.major}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 mb-4 italic">
              الأسئلة الشائعة
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "هل خدمات الموقع مجانية للطلاب؟",
                a: "نعم، تصفح السكنات والتواصل مع أصحابها مجاني بالكامل للطلاب.",
              },
              {
                q: "كيف أتأكد أن الصور مطابقة للواقع؟",
                a: "فريق سكنو يقوم بمعاينة وتصوير أغلب العقارات المدرجة لضمان المصداقية.",
              },
              {
                q: "هل يوجد سكنات قريبة من الحرم الجديد؟",
                a: "أكيد، لدينا قسم خاص لسكنات شارع تونس والأكاديمية القريبة جداً من الحرم الجديد.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="group border border-slate-200 rounded-3xl p-6 bg-slate-50 open:bg-white open:shadow-xl transition-all"
              >
                <summary className="font-black text-lg text-slate-900 cursor-pointer list-none flex justify-between items-center capitalize">
                  {item.q}
                  <ArrowRight
                    size={20}
                    className="group-open:rotate-90 transition-transform"
                  />
                </summary>
                <p className="text-slate-600 mt-4 leading-relaxed font-bold">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Property Owner Section */}
      <section id="owner-contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="bg-white border border-slate-200 rounded-[4rem] p-10 md:p-20 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-700"></div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black mb-8 border border-primary/20">
                  <Building2 size={16} />
                  <span>خاص بأصحاب العقارات في نابلس</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 md:mb-8 leading-tight">
                  هل تملك عقاراً وتريد{" "}
                  <span className="text-gradient">تأجيره؟</span>
                </h2>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-12 font-bold">
                  انضم لأكبر منصة سكن طلابي في نابلس. نحن نربطك مباشرة بآلاف
                  الطلاب من جامعة النجاح ونقوم بتسويق عقارك بأفضل صورة احترافية.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <button
                    onClick={() => setIsOwnerModalOpen(true)}
                    className="bg-premium-gradient text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-center"
                  >
                    عرض سكنك الآن
                    <ArrowRight size={24} />
                  </button>
                  <Link
                    href="/owner/login"
                    className="bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-center shadow-sm"
                  >
                    دخول لوحة التحكم
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <Users size={24} />
                      </div>
                      <h4 className="text-slate-900 font-black text-lg mb-2">
                        جمهورك جاهز
                      </h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        آلاف الطلاب يبحثون يومياً عن سكنات جامعة النجاح
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all sm:translate-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="text-slate-900 font-black text-lg mb-2">
                        إدارة احترافية
                      </h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        تحكم كامل في صور ومواصفات وأسعار عقاراتك
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6 mt-12">
                    <div className="bg-premium-gradient p-8 rounded-[2.5rem] shadow-2xl">
                      <h4 className="text-white font-black text-3xl mb-2">
                        100%
                      </h4>
                      <p className="text-white/80 text-sm font-black uppercase tracking-tighter">
                        نسبة إشغال سنوية
                      </p>
                    </div>
                    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all sm:-translate-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <Building2 size={24} />
                      </div>
                      <h4 className="text-slate-900 font-black text-lg mb-2">
                        توثيق العقار
                      </h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        نقوم بمعاينة عقارك وتجهيزه للتصوير والعرض
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="relative w-20 h-20 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1">
                  <Image
                    src="/logo.png"
                    alt="لوجو سكنو"
                    width={72}
                    height={72}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-slate-900 leading-none">
                    سكنو
                  </span>
                  <span className="text-[10px] font-black text-slate-400 tracking-widest mt-1">
                    SAKANNU
                  </span>
                </div>
              </div>
              <p className="text-slate-500 max-w-sm mb-10 leading-relaxed text-lg">
                منصة فلسطينية رائدة تهدف لتسهيل حياة الطلاب الدراسية في مدينة
                نابلس من خلال توفير سكنات تليق بهم.
              </p>
              <div className="flex gap-4">
                {[Instagram, Phone, Mail].map((Icon, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Icon size={22} />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-slate-900 uppercase tracking-wider">
                جامعة النجاح
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    الحرم الجديد
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    الحرم القديم
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    المجمع الطبي
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    الأكاديمية
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-slate-900 uppercase tracking-wider">
                تواصل معنا
              </h4>
              <ul className="space-y-6 text-slate-600 font-bold">
                <li className="flex items-center gap-4 text-sm">
                  <MapPin size={20} className="text-primary" /> فلسطين، نابلس،
                  شارع رفيديا الرئيسي
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Phone size={20} className="text-primary" /> 972595537190
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Mail size={20} className="text-primary" />{" "}
                  ammar.shtayeh@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 text-center text-sm text-slate-500 font-bold">
            <p>
              © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة سكنو
              وصاحبها عمار اشتية - نابلس، فلسطين
            </p>
          </div>
        </div>
      </footer>

      <OwnerActionModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
      />
    </div>
  );
}
