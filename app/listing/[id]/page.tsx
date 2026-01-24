"use client";

import { use } from "react";
import { mockListings } from "@/data/mockData";
import {
  Building2,
  MapPin,
  ShieldCheck,
  Users,
  ArrowRight,
  Phone,
  Camera,
  CheckCircle2,
  Wifi,
  Wind,
  Car,
  User,
  MessageSquare,
  Bed,
  Bath,
  Maximize,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

import Navbar from "@/components/Navbar";
import ListingCard from "@/components/ListingCard";
import dynamic from "next/dynamic";

const PropertyMap = dynamic(() => import("@/components/PropertyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[350px] bg-slate-50 animate-pulse rounded-[2.5rem] flex items-center justify-center text-slate-400 font-bold">
      جاري تحميل خريطة الموقع...
    </div>
  ),
});

export default function ListingDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const listing = mockListings.find((l) => l.id === id);

  if (!listing) return notFound();

  const isStudentesses = listing.category === "studentesses";
  const similarListings = mockListings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-20 text-slate-900">
      <Navbar />

      <main className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="relative h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden border border-slate-100 group shadow-2xl">
              <Image
                src={listing.image}
                alt={listing.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              <div className="absolute top-8 right-8 flex gap-2">
                <span
                  className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border border-white/20 ${
                    isStudentesses
                      ? "bg-pink-600/90 text-white"
                      : "bg-primary/90 text-white"
                  }`}
                >
                  {isStudentesses ? "سكن طالبات" : "سكن طلاب"}
                </span>
              </div>

              <div className="absolute bottom-8 right-8 flex gap-3">
                <button className="bg-white/40 backdrop-blur-md border border-white/20 p-4 rounded-2xl text-slate-900 hover:bg-white/60 transition-all">
                  <Camera size={24} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {[listing.image, listing.image, listing.image].map((img, i) => (
                <div
                  key={i}
                  className="relative h-32 rounded-[2rem] overflow-hidden border border-white/10 opacity-60 hover:opacity-100 transition-all cursor-pointer hover:scale-105"
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </motion.div>

          {/* Details Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-10">
              <div className="flex items-center gap-3 text-primary font-black mb-4">
                <Building2 size={24} />
                <span className="uppercase tracking-[0.3em] text-xs">
                  Premium Listing
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">
                {listing.title}
              </h1>
              <div className="flex items-center gap-2 text-slate-500 bg-white self-start px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                <MapPin size={20} className="text-primary" />
                <span className="font-bold text-sm">{listing.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full"></div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">
                  السعر الشهري
                </p>
                <p className="text-4xl font-black text-slate-900">
                  {listing.price}{" "}
                  <span className="text-sm font-bold text-primary">₪</span>
                </p>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 relative overflow-hidden group shadow-sm">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-3xl rounded-full"></div>
                <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">
                  الحالة الآن
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <p className="text-xl font-black text-emerald-600">
                    متاح وبانتظارك
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-black mb-6 text-slate-900 flex items-center gap-3">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                تفاصيل السكن
              </h3>
              <p className="text-slate-600 leading-loose text-lg font-bold">
                {listing.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12">
              {[
                {
                  icon: Bed,
                  label: "غرف النوم",
                  value: listing.beds || "غير محدد",
                },
                {
                  icon: Bath,
                  label: "الحمامات",
                  value: listing.bathrooms || "غير محدد",
                },
                {
                  icon: Maximize,
                  label: "المساحة",
                  value: listing.sqft ? `${listing.sqft}م²` : "غير محدد",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center p-6 bg-white rounded-3xl border border-slate-200 hover:border-primary/30 transition-colors shadow-sm"
                >
                  <item.icon size={24} className="text-primary mb-3" />
                  <span className="text-slate-900 font-black text-lg">
                    {item.value}
                  </span>
                  <span className="text-slate-400 text-[10px] font-bold uppercase">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
                <div className="w-8 h-1 bg-primary rounded-full"></div>
                المميزات والخدمات
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {listing.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 text-slate-600 group hover:border-primary/30 transition-all shadow-sm"
                  >
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      {feature.includes("إنترنت") ? (
                        <Wifi size={24} />
                      ) : feature.includes("تكييف") ? (
                        <Wind size={24} />
                      ) : (
                        <ShieldCheck size={24} />
                      )}
                    </div>
                    <span className="font-black text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Map Section */}
            {listing.lat && listing.lng && (
              <div className="mb-12">
                <h3 className="text-xl font-black mb-8 text-slate-900 flex items-center gap-3">
                  <div className="w-8 h-1 bg-primary rounded-full"></div>
                  الموقع على الخريطة
                </h3>
                <div className="h-[400px]">
                  <PropertyMap
                    lat={listing.lat}
                    lng={listing.lng}
                    title={listing.title}
                  />
                </div>
              </div>
            )}

            {/* Owner Section */}
            <div className="bg-premium-gradient p-10 rounded-[3rem] shadow-2xl shadow-orange-600/30 text-white relative overflow-hidden mb-12">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="flex items-center gap-6 mb-10 relative z-10">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-100 overflow-hidden ring-4 ring-white/20 shadow-inner">
                  <Image
                    src={`https://ui-avatars.com/api/?name=${listing.ownerName}&background=000&color=fff&size=128`}
                    alt={listing.ownerName}
                    width={96}
                    height={96}
                  />
                </div>
                <div>
                  <h4 className="text-3xl font-black">{listing.ownerName}</h4>
                  <p className="text-white/80 font-bold flex items-center gap-2">
                    <ShieldCheck size={16} />
                    صاحب عقار موثق في نابلس
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 relative z-10">
                <a
                  href={`tel:${listing.ownerPhone}`}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white text-primary rounded-[1.5rem] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/20"
                >
                  <Phone size={28} />
                  اتصل الآن
                </a>
                <a
                  href={`https://wa.me/${listing.ownerPhone.replace("0", "970")}`}
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white/10 border border-white/20 text-white rounded-[1.5rem] font-black text-xl hover:bg-white/20 transition-all"
                >
                  <MessageSquare size={28} />
                  واتساب
                </a>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 bg-white border border-slate-200 rounded-[3rem] p-10 shadow-xl">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-black text-slate-900 flex items-center gap-4">
                  <div className="w-10 h-1 bg-primary rounded-full"></div>
                  آراء الطلاب
                </h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
                  <span className="text-2xl font-black text-primary">
                    {listing.reviews && listing.reviews.length > 0
                      ? (
                          listing.reviews.reduce(
                            (acc, r) => acc + r.rating,
                            0,
                          ) / listing.reviews.length
                        ).toFixed(1)
                      : "0.0"}
                  </span>
                  <div className="flex text-primary">{"★".repeat(5)}</div>
                </div>
              </div>

              <div className="space-y-8 mb-12">
                {listing.reviews &&
                  listing.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group hover:border-primary/20 transition-all"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                            {review.userName[0]}
                          </div>
                          <div>
                            <p className="text-slate-900 font-black">
                              {review.userName}
                            </p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                              {review.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span
                              key={star}
                              className={
                                star <= review.rating
                                  ? "text-primary"
                                  : "text-slate-200"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 font-bold leading-relaxed pr-2">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                {(!listing.reviews || listing.reviews.length === 0) && (
                  <div className="py-10 text-center opacity-30 text-slate-400">
                    <MessageSquare size={48} className="mx-auto mb-4" />
                    <p className="font-bold">
                      لا توجد مراجعات حالياً. كن أول من يكتب!
                    </p>
                  </div>
                )}
              </div>

              {/* Add Review Form */}
              <div className="pt-10 border-t border-slate-100">
                <h4 className="text-xl font-black text-slate-900 mb-6">
                  أضف تقييمك
                </h4>
                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    alert("شكراً لتقييمك! سيتم نشره بعد المراجعة.");
                  }}
                >
                  <div className="flex gap-4 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="text-3xl text-slate-200 hover:text-primary transition-colors"
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    placeholder="اكتب تجربتك هنا..."
                    rows={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-8 py-6 focus:border-primary outline-none transition-all font-bold text-slate-900 shadow-inner"
                  ></textarea>
                  <button className="w-full bg-premium-gradient text-white py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    نشر التقييم
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-32">
            <div className="flex justify-between items-end mb-16 px-4">
              <div className="text-right">
                <h2 className="text-4xl font-black text-slate-900 mb-4">
                  سكنات <span className="text-gradient">مشابهة</span>
                </h2>
                <p className="text-slate-500 font-bold">
                  قد يعجبك أيضاً هذه الخيارات في نفس القسم
                </p>
              </div>
              <Link
                href={isStudentesses ? "/studentesses" : "/students"}
                className="text-primary font-black hover:underline underline-offset-8"
              >
                عرض سجل القسم
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {similarListings.map((simListing) => (
                <ListingCard key={simListing.id} listing={simListing} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
