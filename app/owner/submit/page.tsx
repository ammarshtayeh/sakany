"use client";

import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  ArrowRight, 
  Image as ImageIcon,
  CheckCircle2,
  Info,
  Phone,
  User,
  LayoutDashboard
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { motion, AnimatePresence } from 'framer-motion';

export default function OwnerSubmitPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0d0d0d] border border-white/10 p-12 rounded-[3.5rem] max-w-2xl w-full text-center shadow-2xl"
          >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-500 mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black text-white mb-6">تم إرسال طلبك بنجاح!</h2>
            <p className="text-slate-400 text-lg mb-10 leading-relaxed font-bold">
              شكراً لك على ثقتك بـ "سكني". طلبك الآن قيد المراجعة من قبل الإدارة لضمان جودة البيانات. سيتواصل معك أحد موظفينا خلال 24 ساعة لتأكيد التفاصيل.
            </p>
            <Link href="/" className="inline-flex items-center gap-3 bg-premium-gradient px-10 py-5 rounded-2xl text-white font-black text-xl hover:scale-105 transition-all">
              العودة للرئيسية
              <ArrowRight size={24} />
            </Link>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-20 px-6 max-w-4xl mx-auto w-full">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-6 font-bold">
            <ArrowRight size={20} />
            رجوع
          </Link>
          <h1 className="text-5xl font-black text-white mb-4">أضف <span className="text-gradient">عقارك</span> للطلاب</h1>
          <p className="text-slate-400 text-lg font-bold">املأ البيانات التالية لتقديم طلب إدراج عقارك في المنصة</p>
        </div>

        <div className="bg-[#0d0d0d] border border-white/10 rounded-[3rem] p-10 shadow-2xl">
          <div className="flex gap-4 mb-10">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-2 rounded-full bg-white/5 relative overflow-hidden">
                {step >= s && (
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    className="absolute inset-0 bg-orange-600"
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
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
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
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">نوع السكن</label>
                      <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white appearance-none">
                        <option value="apartment">شقة كاملة</option>
                        <option value="room">غرفة مستقلة</option>
                        <option value="studio">استوديو</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">الفئة المستهدفة</label>
                      <select className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white appearance-none">
                        <option value="students">سكن طلاب (شباب)</option>
                        <option value="studentesses">سكن طالبات (إناث)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">وصف السكن</label>
                    <textarea 
                      placeholder="صف السكن والمميزات المتاحة بالتفصيل..." 
                      rows={5}
                      className="w-full bg-white/5 border border-white/5 rounded-[2rem] px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full bg-premium-gradient py-6 rounded-[1.5rem] font-black text-2xl shadow-2xl shadow-orange-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
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
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">السعر الشهري (شيكل)</label>
                      <input 
                        type="number" 
                        placeholder="1500" 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">المساحة (م²)</label>
                      <input 
                        type="number" 
                        placeholder="120" 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">صور السكن</label>
                    <div className="p-12 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-6 hover:border-orange-500/50 transition-all cursor-pointer bg-white/[0.02] group">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center text-slate-500 group-hover:bg-orange-600 group-hover:text-white transition-all">
                        <ImageIcon size={40} />
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-bold text-white mb-2">اضغط لرفع الصور</p>
                        <p className="text-slate-500 font-bold">يفضل رفع صور واضحة وكثيرة لزيادة فرصة التأجير</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button 
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 bg-white/5 py-6 rounded-[1.5rem] font-black text-xl hover:bg-white/10 transition-all text-slate-400"
                    >
                      السابق
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep(3)}
                      className="flex-[2] bg-premium-gradient py-6 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-orange-600/20 hover:scale-[1.02] transition-all"
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
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">اسم صاحب العقار</label>
                      <input 
                        type="text" 
                        placeholder="الاسم الكامل" 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
                        required 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">رقم الهاتف التواصل</label>
                      <input 
                        type="tel" 
                        placeholder="0590000000" 
                        className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 focus:border-orange-500 outline-none transition-all font-bold text-lg text-white"
                        required 
                      />
                    </div>
                  </div>

                  <div className="bg-orange-600/10 border border-orange-600/20 p-8 rounded-[2rem] flex items-start gap-4">
                    <Info className="text-orange-500 shrink-0" size={24} />
                    <div>
                      <h4 className="text-white font-black mb-2">ملاحظة هامة</h4>
                      <p className="text-orange-500/80 font-bold leading-relaxed">بإرسالك لهذا الطلب، أنت توافق على شروط "سكني" لضمان نزاهة البيانات. سيتم فحص الطلب من قبل الإدارة قبل الظهور للطلاب.</p>
                    </div>
                  </div>

                  <div className="flex gap-6">
                    <button 
                      type="button"
                      onClick={() => setStep(2)}
                      className="flex-1 bg-white/5 py-6 rounded-[1.5rem] font-black text-xl hover:bg-white/10 transition-all text-slate-400"
                    >
                      السابق
                    </button>
                    <button 
                      type="submit"
                      className="flex-[2] bg-premium-gradient py-6 rounded-[1.5rem] font-black text-2xl shadow-2xl shadow-orange-600/20 hover:scale-[1.02] transition-all"
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
