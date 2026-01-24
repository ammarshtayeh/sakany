"use client";

import { useState } from "react";
import {
  Building2,
  MapPin,
  ArrowRight,
  Image as ImageIcon,
  CheckCircle2,
  Info,
  Phone,
  User,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] bg-slate-100 animate-pulse rounded-[2rem] flex items-center justify-center text-slate-400 font-bold">
      جاري تحميل الخريطة...
    </div>
  ),
});

export default function OwnerSubmitPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [showMap, setShowMap] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-slate-900">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-slate-200 p-12 rounded-[3.5rem] max-w-2xl w-full text-center shadow-2xl"
          >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 mb-6">
              تم إرسال طلبك بنجاح!
            </h2>
            <p className="text-slate-600 text-lg mb-10 leading-relaxed font-bold">
              شكراً لك على ثقتك بـ "سكّني". طلبك الآن قيد المراجعة من قبل
              الإدارة لضمان جودة البيانات. سيتواصل معك أحد موظفينا خلال 24 ساعة
              لتأكيد التفاصيل.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-3 bg-premium-gradient px-10 py-5 rounded-2xl text-white font-black text-xl hover:scale-105 transition-all"
            >
              العودة للرئيسية
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <div className="mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-6 font-bold"
          >
            <ArrowRight size={20} />
            رجوع
          </Link>
          <h1 className="text-5xl font-black text-slate-900 mb-4">
            أضف <span className="text-gradient">عقارك</span> للطلاب
          </h1>
          <p className="text-slate-600 text-lg font-bold">
            املأ البيانات التالية لتقديم طلب إدراج عقارك في المنصة
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[3rem] p-10 shadow-2xl">
          <div className="flex gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="flex-1 h-2 rounded-full bg-slate-100 relative overflow-hidden"
              >
                {step >= s && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute inset-0 bg-primary"
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
                        <Building2 size={16} />
                        عنوان السكن
                      </label>
                      <input
                        type="text"
                        placeholder="مثلاً: شقة الأمل الفاخرة"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 px-2">
                        <MapPin size={16} />
                        الموقع في نابلس
                      </label>
                      <input
                        type="text"
                        placeholder="مثلاً: رفيديا قرب المستشفى العربي"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={16} />
                        موقع العقار على الخريطة (اختياري)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowMap(!showMap)}
                        className="text-xs font-black text-primary hover:underline underline-offset-4"
                      >
                        {showMap ? "إخفاء الخريطة" : "تحديد الموقع بدقة"}
                      </button>
                    </div>

                    <AnimatePresence>
                      {showMap && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <MapPicker
                            onLocationSelect={(lat, lng) =>
                              setLocationCoords({ lat, lng })
                            }
                          />
                          {locationCoords && (
                            <p className="text-xs text-emerald-600 font-bold mt-3 bg-emerald-50 px-4 py-2 rounded-xl inline-block">
                              ✅ تم تحديد الموقع:{" "}
                              {locationCoords.lat.toFixed(4)},{" "}
                              {locationCoords.lng.toFixed(4)}
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        نوع السكن
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 appearance-none shadow-sm">
                        <option value="apartment">شقة كاملة</option>
                        <option value="room">غرفة مستقلة</option>
                        <option value="studio">استوديو</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        الفئة المستهدفة
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 appearance-none shadow-sm">
                        <option value="students">سكن طلاب (شباب)</option>
                        <option value="studentesses">سكن طالبات (إناث)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                      وصف السكن
                    </label>
                    <textarea
                      placeholder="صف السكن والمميزات المتاحة بالتفصيل..."
                      rows={5}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-premium-gradient py-6 rounded-[1.5rem] font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-white"
                  >
                    التالي: الصور والأسعار
                    <ArrowRight size={28} className="rotate-180" />
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        السعر الشهري (شيكل)
                      </label>
                      <input
                        type="number"
                        placeholder="1500"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        المساحة (م²)
                      </label>
                      <input
                        type="number"
                        placeholder="120"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                      صور السكن
                    </label>
                    <div className="p-12 border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:border-primary/50 transition-all cursor-pointer bg-slate-50 group">
                      <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                        <ImageIcon size={40} />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-slate-900 mb-2">
                          اضغط لرفع الصور
                        </p>
                        <p className="text-slate-500 font-bold">
                          يفضل رفع صور واضحة وكثيرة لزيادة فرصة التأجير
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-slate-100 py-6 rounded-[1.5rem] font-black text-xl hover:bg-slate-200 transition-all text-slate-500"
                    >
                      السابق
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-[2] bg-premium-gradient py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all text-white"
                    >
                      التالي: معلومات التواصل
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        اسم صاحب العقار
                      </label>
                      <input
                        type="text"
                        placeholder="الاسم الكامل"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        رقم الهاتف التواصل
                      </label>
                      <input
                        type="tel"
                        placeholder="0590000000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-primary/5 border border-primary/10 p-8 rounded-[2rem] flex items-start gap-4">
                    <Info className="text-primary shrink-0" size={24} />
                    <div>
                      <h4 className="text-slate-900 font-black mb-2">
                        ملاحظة هامة
                      </h4>
                      <p className="text-primary/70 font-bold leading-relaxed">
                        بإرسالك لهذا الطلب، أنت توافق على شروط "سكّني" لضمان
                        نزاهة البيانات. سيتم فحص الطلب من قبل الإدارة قبل الظهور
                        للطلاب.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-slate-100 py-6 rounded-[1.5rem] font-black text-xl hover:bg-slate-200 transition-all text-slate-500"
                    >
                      السابق
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] bg-premium-gradient py-6 rounded-[1.5rem] font-black text-2xl shadow-2xl shadow-primary/20 hover:scale-[1.02] transition-all text-white"
                    >
                      إرسال الطلب للمراجعة
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>
      </main>
    </div>
  );
}
