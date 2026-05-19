"use client";

import { use, useState, useEffect } from "react";
import { mockListings, Listing } from "@/data/mockData";
import { getListingById, addListingReview } from "@/lib/firestore-service";
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
import ReviewsSection from "@/components/ReviewsSection";
import AddReviewForm from "@/components/AddReviewForm";
import { generateListingSchema } from "@/lib/schema";
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
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadListing() {
      setIsLoading(true);
      const data = await getListingById(id);
      setListing(data);
      setIsLoading(false);
    }
    loadListing();
  }, [id]);

  const handleReviewSubmit = async (newReviewData: {
    userName: string;
    rating: number;
    comment: string;
  }) => {
    if (!listing) return;
    try {
      const addedReview = await addListingReview(listing.id, newReviewData);
      setListing((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          reviews: [...(prev.reviews || []), addedReview],
        };
      });
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-20 text-slate-900">
        <Navbar />
        <main className="pt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[50vh]">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
          <p className="text-xl font-black text-slate-500">جاري تحميل تفاصيل السكن...</p>
        </main>
      </div>
    );
  }

  if (!listing) return notFound();

  const isStudentesses = listing.category === "studentesses";
  const similarListings = mockListings
    .filter((l) => l.category === listing.category && l.id !== listing.id)
    .slice(0, 3);

  const averageRating = listing.reviews?.length
    ? listing.reviews.reduce((acc, r) => acc + r.rating, 0) /
      listing.reviews.length
    : 0;

  const listingSchema = generateListingSchema(listing);

  return (
    <div className="min-h-screen bg-background pb-20 text-slate-900">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
      />
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
                  href={`https://wa.me/${listing.ownerPhone.replace(/^0/, "970")}?text=${encodeURIComponent(
                    `مرحباً، أنا مهتم بسكن "${listing.title}" المعلن عنه في منصة سكنو. هل هو متاح حالياً؟`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-4 py-5 bg-white/10 border border-white/20 text-white rounded-[1.5rem] font-black text-xl hover:bg-white/20 transition-all"
                >
                  <MessageSquare size={28} />
                  واتساب
                </a>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-12 space-y-8">
              <ReviewsSection
                reviews={listing.reviews || []}
                averageRating={averageRating}
              />
              <AddReviewForm listingId={listing.id} onSubmit={handleReviewSubmit} />
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
