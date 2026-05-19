"use client";

import { Review } from "@/data/mockData";
import { User, Calendar } from "lucide-react";
import StarRating from "./StarRating";
import { motion } from "framer-motion";

interface ReviewsSectionProps {
  reviews: Review[];
  averageRating: number;
}

export default function ReviewsSection({
  reviews,
  averageRating,
}: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="bg-slate-50 rounded-3xl p-12 text-center">
        <p className="text-slate-500 font-bold">
          لا توجد تقييمات بعد. كن أول من يقيّم هذا السكن!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-8 md:p-12 border border-primary/20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right">
            <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-2">
              تقييمات السكن
            </h3>
            <p className="text-slate-600 font-bold">
              بناءً على {reviews.length} تقييم من الطلاب
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div className="text-5xl md:text-6xl font-black text-primary">
              {averageRating.toFixed(1)}
            </div>
            <StarRating rating={averageRating} readonly size={24} />
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User size={20} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900">
                    {review.userName}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                    <Calendar size={12} />
                    <span>
                      {new Date(review.date).toLocaleDateString("ar-PS", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} readonly size={16} />
            </div>
            <p className="text-slate-700 leading-relaxed font-bold">
              {review.comment}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
