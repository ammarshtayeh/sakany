"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import {
  Sparkles, Star, TrendingUp, Users, CheckCircle, ArrowRight,
  Phone, MessageSquare, X, Building2, MapPin, Clock, BadgeCheck,
  Zap, Shield, Crown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { addBusinessRequest } from "@/lib/firestore-service";

const TIERS = [
  {
    id: "basic" as const,
    name: "Basic",
    nameAr: "الأساسية",
    icon: Shield,
    price: "50 - 100",
    color: "from-slate-600 to-slate-800",
    border: "border-slate-300 dark:border-slate-700",
    badge: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
    features: [
      "بطاقة في صفحة الخدمات القريبة",
      "شارة شريك سكنو",
      "عرض رقم الهاتف وواتساب",
      "عرض الخصم الخاص بالطلاب",
    ],
    recommended: false,
  },
  {
    id: "featured" as const,
    name: "Featured",
    nameAr: "المميزة",
    icon: Zap,
    price: "150 - 250",
    color: "from-teal-500 to-teal-700",
    border: "border-teal-400 dark:border-teal-500",
    badge: "bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400",
    features: [
      "كل مزايا الأساسية +",
      "ظهور في صفحات السكنات القريبة",
      "شارة \"مميز\" بلون مختلف",
      "ظهور أعلى في القائمة",
      "إحصائيات النقرات الشهرية",
    ],
    recommended: true,
  },
  {
    id: "premium" as const,
    name: "Premium",
    nameAr: "الذهبية",
    icon: Crown,
    price: "300 - 500",
    color: "from-amber-400 to-amber-600",
    border: "border-amber-400 dark:border-amber-500",
    badge: "bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    features: [
      "كل مزايا المميزة +",
      "ظهور في شريط الرعاة بالصفحة الرئيسية",
      "إعلان متكامل بين قوائم السكن",
      "شارة ذهبية \"راعي ذهبي ⭐\"",
      "أولوية الظهور في كل الصفحات",
      "تقرير أداء شهري كامل",
    ],
    recommended: false,
  },
];

const STATS = [
  { value: "5,000+", label: "طالب يزور المنصة شهرياً", icon: Users },
  { value: "1,200+", label: "سكن مُعلن عليه", icon: Building2 },
  { value: "98%", label: "نسبة رضا الطلاب", icon: Star },
  { value: "3x", label: "أكثر مبيعاً مع الإعلان", icon: TrendingUp },
];

const TESTIMONIALS = [
  {
    name: "أبو كريم — مطعم الشام",
    text: "بعد الإعلان في سكنو، تضاعف عدد الطلاب اللي بيجوا عنا. بصراحة أحسن قرار اتخذناه.",
    tier: "premium",
    stars: 5,
  },
  {
    name: "محمد العلي — مقهى الرواد",
    text: "الطلاب بيثقوا بسكنو كثير، وهاد بيضيف مصداقية لمحلنا. النتائج فاقت توقعاتنا.",
    tier: "featured",
    stars: 5,
  },
  {
    name: "أم سامر — سوبرماركت النجاح",
    text: "اشتراك بسيط بالثمن لكن بيجيب زبائن كثار. الطلاب صاروا يعرفوا محلنا بالاسم.",
    tier: "basic",
    stars: 4,
  },
];

export default function AdvertisePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTier, setSelectedTier] = useState<"basic" | "featured" | "premium">("featured");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form fields
  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("restaurant");
  const [ownerName, setOwnerName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [studentOffer, setStudentOffer] = useState("");
  const [message, setMessage] = useState("");

  const openModal = (tier: "basic" | "featured" | "premium") => {
    setSelectedTier(tier);
    setIsModalOpen(true);
    setIsSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await addBusinessRequest({
        businessName,
        category,
        ownerName,
        phone,
        whatsapp,
        address,
        selectedTier,
        studentOffer,
        message,
      });

      // Also send a WhatsApp message to the admin
      const tierNames = { basic: "الأساسية", featured: "المميزة", premium: "الذهبية" };
      const waText = encodeURIComponent(
        `📢 طلب إعلان جديد في سكنو!\n\n🏪 المحل: ${businessName}\n👤 المالك: ${ownerName}\n📞 الهاتف: ${phone}\n📍 العنوان: ${address}\n⭐ الخطة المختارة: ${tierNames[selectedTier]}\n🎁 العرض للطلاب: ${studentOffer}\n💬 ملاحظات: ${message}`
      );
      window.open(`https://wa.me/972595537190?text=${waText}`, "_blank");

      setIsSuccess(true);
      setBusinessName(""); setOwnerName(""); setPhone(""); setWhatsapp("");
      setAddress(""); setStudentOffer(""); setMessage("");
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("حدث خطأ، الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 dark:text-foreground overflow-x-hidden" dir="rtl">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-amber-400/5 pointer-events-none" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-56 h-56 bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 text-amber-700 dark:text-amber-400 font-black text-sm mb-8">
            <Sparkles size={16} />
            فرصة تسويقية حصرية لأصحاب المحلات في نابلس
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 text-slate-900 dark:text-foreground">
            اعلن في{" "}
            <span className="bg-gradient-to-l from-primary to-teal-400 bg-clip-text text-transparent">
              سكنو
            </span>{" "}
            واجذب
            <br />
            <span className="text-amber-500">آلاف الطلاب</span>
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-400 font-bold leading-relaxed max-w-2xl mx-auto mb-12">
            منصة سكنو هي الوجهة الأولى لطلاب جامعة النجاح في نابلس للبحث عن السكن.
            اعلن معنا وتحوّل إلى الخيار المفضل للطلاب في منطقتك!
          </p>

          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => openModal("featured")}
            className="inline-flex items-center gap-3 bg-gradient-to-l from-primary to-teal-500 text-white px-10 py-5 rounded-[2rem] font-black text-xl shadow-2xl shadow-primary/20"
          >
            ابدأ إعلانك الآن
            <ArrowRight size={22} className="rotate-180" />
          </motion.button>

          <p className="text-slate-400 dark:text-slate-500 text-sm font-bold mt-4">
            لا يحتاج بطاقة ائتمان · تواصل مباشر مع فريقنا
          </p>
        </motion.div>
      </section>

      {/* ── STATS ── */}
      <section className="py-16 px-6 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={26} className="text-primary" />
                </div>
                <p className="text-4xl font-black text-slate-900 dark:text-foreground mb-1">{stat.value}</p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── PRICING TIERS ── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-foreground mb-4">
              اختر الخطة المناسبة لك
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-bold">
              خطط مرنة تناسب جميع أحجام الأعمال — يمكن الترقية في أي وقت
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIERS.map((tier, i) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className={`relative bg-white dark:bg-slate-900 border-2 ${tier.border} rounded-[3rem] p-8 flex flex-col ${tier.recommended ? "shadow-2xl shadow-teal-500/10 scale-[1.02]" : "shadow-sm"}`}
                >
                  {tier.recommended && (
                    <div className="absolute -top-4 right-1/2 translate-x-1/2 bg-gradient-to-l from-primary to-teal-400 text-white px-6 py-2 rounded-full text-xs font-black whitespace-nowrap shadow-lg shadow-primary/20">
                      الأكثر شيوعاً ⭐
                    </div>
                  )}

                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon size={26} className="text-white" />
                  </div>

                  <div className={`inline-flex self-start px-4 py-1.5 rounded-full text-xs font-black mb-3 ${tier.badge}`}>
                    {tier.nameAr}
                  </div>

                  <h3 className="text-2xl font-black text-slate-900 dark:text-foreground mb-2">{tier.name}</h3>

                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-4xl font-black text-slate-900 dark:text-foreground">{tier.price}</span>
                    <span className="text-slate-400 dark:text-slate-500 font-bold text-sm">₪ / شهر</span>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {tier.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-3 text-right">
                        <CheckCircle size={18} className="text-primary shrink-0 mt-0.5" />
                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => openModal(tier.id)}
                    className={`w-full py-4 rounded-2xl font-black text-sm transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      tier.recommended
                        ? "bg-gradient-to-l from-primary to-teal-500 text-white shadow-xl shadow-primary/20"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    ابدأ مع {tier.nameAr}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY SAKANNU ── */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-slate-900 dark:text-foreground mb-16">
            لماذا تعلن في <span className="text-primary">سكنو</span>؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "جمهور مستهدف", desc: "طلاب جامعيون يبحثون فعلاً عن خدمات في نابلس — أعلى نسبة تحويل ممكنة" },
              { icon: MapPin, title: "ظهور جغرافي ذكي", desc: "إعلانك يظهر للطلاب الساكنين بالقرب من محلك فقط — لا هدر في الإعلان" },
              { icon: BadgeCheck, title: "مصداقية عالية", desc: "الطلاب يثقون بسكنو — إعلانك فيها يضيف مصداقية لمحلك أمامهم" },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 text-right"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-5">
                    <Icon size={26} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-foreground mb-3">{item.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-black text-center text-slate-900 dark:text-foreground mb-16">
            ماذا يقول شركاؤنا؟
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 text-right"
              >
                <div className="flex gap-1 mb-4 justify-end">
                  {Array.from({ length: t.stars }).map((_, si) => (
                    <Star key={si} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-6 italic">
                  &quot;{t.text}&quot;
                </p>
                <div className="flex items-center gap-3 justify-end">
                  <div>
                    <p className="font-black text-slate-900 dark:text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-slate-400 font-bold capitalize">{t.tier} partner</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-primary">
                    {t.name[0]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-slate-900 dark:bg-slate-950 rounded-[3.5rem] p-12 md:p-16 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-400/10 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              جاهز تبدأ مع <span className="text-primary">سكنو</span>؟
            </h2>
            <p className="text-slate-400 font-bold text-lg mb-10">
              تواصل معنا اليوم وسنساعدك في اختيار الخطة المناسبة لمحلك وميزانيتك.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openModal("featured")}
                className="flex items-center justify-center gap-3 bg-gradient-to-l from-primary to-teal-500 text-white px-10 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.03] transition-all"
              >
                <Sparkles size={20} />
                ابدأ الإعلان الآن
              </button>
              <a
                href={`https://wa.me/972595537190?text=${encodeURIComponent("مرحبا سكنو، أود الاستفسار عن الإعلان في منصتكم.")}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-3 bg-white/10 border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all"
              >
                <MessageSquare size={20} />
                تواصل عبر واتساب
              </a>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── REGISTRATION MODAL ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-10 w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  <X size={22} />
                </button>
                <div className="text-right">
                  <h3 className="text-2xl font-black text-slate-900 dark:text-foreground">
                    سجّل محلك في <span className="text-primary">سكنو</span>
                  </h3>
                  <p className="text-slate-400 text-sm font-bold mt-1">سنتواصل معك خلال 24 ساعة</p>
                </div>
              </div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-10"
                >
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h4 className="text-2xl font-black text-slate-900 dark:text-foreground mb-3">تم الإرسال بنجاح! 🎉</h4>
                  <p className="text-slate-500 dark:text-slate-400 font-bold">
                    سيتواصل معك فريق سكنو خلال 24 ساعة لإتمام الاشتراك.
                  </p>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="mt-8 bg-primary text-white px-8 py-4 rounded-2xl font-black hover:scale-[1.02] transition-all"
                  >
                    حسناً، شكراً
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 text-right">
                  {/* Tier selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">الخطة المختارة</label>
                    <div className="grid grid-cols-3 gap-3">
                      {TIERS.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setSelectedTier(t.id)}
                          className={`py-3 px-4 rounded-2xl text-sm font-black border-2 transition-all ${
                            selectedTier === t.id
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {t.nameAr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">اسم المحل *</label>
                      <input
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="مثلاً: مطعم الشام"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">النوع *</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm"
                      >
                        <option value="restaurant">مطعم</option>
                        <option value="cafe">مقهى</option>
                        <option value="supermarket">سوبرماركت</option>
                        <option value="laundry">مغسلة</option>
                        <option value="other">خدمة أخرى</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">اسم المالك *</label>
                      <input
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="الاسم الكامل"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-black text-slate-500 uppercase tracking-widest">رقم الهاتف *</label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="059xxxxxxx"
                        required
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">العنوان *</label>
                    <input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="مثلاً: رفيديا - مقابل المستشفى العربي"
                      required
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">عرضك الخاص للطلاب</label>
                    <input
                      value={studentOffer}
                      onChange={(e) => setStudentOffer(e.target.value)}
                      placeholder="مثلاً: خصم 15% بذكر سكنو"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">ملاحظات إضافية</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      placeholder="أي تفاصيل إضافية تريد مشاركتها..."
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-right font-bold text-slate-900 dark:text-foreground focus:border-primary outline-none text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-l from-primary to-teal-500 text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <MessageSquare size={20} />
                        أرسل الطلب وتواصل عبر واتساب
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
