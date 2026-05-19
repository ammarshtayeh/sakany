"use client";

import { useState, useEffect } from "react";
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

import { addListing, uploadImages } from "@/lib/firestore-service";

export default function OwnerSubmitPage() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationCoords, setLocationCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  /* State for file upload */
  const [selectedImageFiles, setSelectedImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const [showMap, setShowMap] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("apartment");
  const [category, setCategory] = useState("students");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sqft, setSqft] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Comprehensive Validation
    if (
      !title.trim() ||
      !location.trim() ||
      !description.trim() ||
      !ownerName.trim() ||
      !ownerPhone.trim()
    ) {
      alert("يرجى تعبئة جميع الحقول المطلوبة.");
      return;
    }

    if (Number(price) <= 0) {
      alert("يرجى إدخال سعر شهري صحيح.");
      return;
    }

    if (sqft && Number(sqft) <= 0) {
      alert("يرجى إدخال مساحة صحيحة.");
      return;
    }

    // Image Validation
    if (selectedImageFiles.length === 0) {
      alert("يرجى اختيار صورة واحدة على الأقل للسكن.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload Images
      let imageUrl =
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800"; // Fallback main image
      let uploadedUrls: string[] = [];

      try {
        console.log("Calling uploadImages...");
        uploadedUrls = await uploadImages(selectedImageFiles);
        console.log("uploadImages returned:", uploadedUrls);

        if (uploadedUrls.length > 0) {
          imageUrl = uploadedUrls[0]; // Set main image as the first one
        }
      } catch (uploadError) {
        console.error(
          "Upload failed, falling back to placeholder",
          uploadError,
        );
        alert("فشل رفع الصور، سيتم استخدام صورة افتراضية.");
      }

      // 2. Add Listing with Image URLs
      await addListing({
        title,
        description,
        price: Number(price),
        location,
        category: category as "students" | "studentesses",
        image: imageUrl,
        images: uploadedUrls, // Store all images
        features: ["ميزة 1", "ميزة 2"],
        type: type as "apartment" | "room" | "studio",
        status: "available",
        isPending: true,
        ownerName,
        ownerPhone,
        sqft: sqft ? Number(sqft) : undefined,
        // vital fix: Firestore does not support 'undefined', use null instead
        lat: locationCoords?.lat ?? null,
        lng: locationCoords?.lng ?? null,
      });

      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting listing:", error);
      alert(
        "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.\n" +
          (error as Error).message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Auto-redirect logic
  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        window.location.href = "/";
      }, 5000); // Redirect after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [isSubmitted]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6 text-slate-900 pb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white border border-slate-200 p-8 md:p-12 rounded-[3.5rem] max-w-2xl w-full text-center shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-emerald-400 via-primary to-emerald-400" />

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-32 h-32 bg-gradient-to-tr from-emerald-100 to-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-8 shadow-inner"
            >
              <CheckCircle2 size={64} strokeWidth={3} />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                تم استلام طلبك بنجاح!
              </h2>
              <p className="text-slate-600 text-xl mb-12 leading-relaxed font-bold max-w-lg mx-auto">
                شكراً لاختيارك <span className="text-primary">سكّنلي</span>.
                عقارك الآن في طريقه للنشر! سنقوم بمراجعة البيانات والتواصل معك
                في أقرب وقت.
              </p>
            </motion.div>

            <div className="flex flex-col items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-3 bg-slate-900 px-10 py-5 rounded-2xl text-white font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-900/20"
              >
                العودة للرئيسية الآن
                <ArrowRight size={24} className="rtl:rotate-180" />
              </Link>
              <p className="text-sm font-bold text-slate-400 animate-pulse">
                سيتم تحويلك تلقائياً خلال 5 ثواني...
              </p>
            </div>
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
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
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
                            onLocationSelect={(lat: number, lng: number) =>
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
                      <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 appearance-none shadow-sm"
                      >
                        <option value="apartment">شقة كاملة</option>
                        <option value="room">غرفة مستقلة</option>
                        <option value="studio">استوديو</option>
                      </select>
                    </div>
                    <div className="space-y-3">
                      <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                        الفئة المستهدفة
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 appearance-none shadow-sm"
                      >
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                        value={sqft}
                        onChange={(e) => setSqft(e.target.value)}
                        placeholder="120"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 focus:border-primary outline-none transition-all font-bold text-lg text-slate-900 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-black text-slate-500 uppercase tracking-widest px-2">
                      صورة السكن الرئيسية
                    </label>
                    <div
                      className={`p-12 border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-6 transition-all cursor-pointer bg-slate-50 group relative overflow-hidden ${
                        imagePreviews.length > 0
                          ? "border-primary"
                          : "border-slate-200 hover:border-primary/50"
                      }`}
                    >
                      {imagePreviews.length > 0 ? (
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                          {imagePreviews.map((preview, idx) => (
                            <div
                              key={idx}
                              className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={preview}
                                alt={`Preview ${idx}`}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <p className="text-white font-black text-lg">
                              إضافة المزيد
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="w-20 h-20 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                            <ImageIcon size={40} />
                          </div>
                          <div className="text-center">
                            <p className="text-xl font-bold text-slate-900 mb-2">
                              اضغط لرفع صور السكن
                            </p>
                            <p className="text-slate-500 font-bold">
                              يمكنك اختيار أكثر من صورة (الحد الأقصى 5)
                            </p>
                          </div>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            const newFiles = Array.from(e.target.files);
                            // Combine new files with existing ones
                            const updatedFiles = [
                              ...selectedImageFiles,
                              ...newFiles,
                            ];
                            setSelectedImageFiles(updatedFiles);

                            // Generate previews
                            const newPreviews = newFiles.map((file) =>
                              URL.createObjectURL(file),
                            );
                            setImagePreviews([
                              ...imagePreviews,
                              ...newPreviews,
                            ]);
                          }
                        }}
                      />
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
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
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
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
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
                        بإرسالك لهذا الطلب، أنت توافق على شروط "سكّنلي" لضمان
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
                      {isSubmitting
                        ? "جاري الإرسال..."
                        : "إرسال الطلب للمراجعة"}
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
