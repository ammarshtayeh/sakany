"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import StarRating from "./StarRating";
import { motion } from "framer-motion";

interface AddReviewFormProps {
  listingId: string;
  onSubmit?: (review: {
    userName: string;
    rating: number;
    comment: string;
  }) => void;
}

export default function AddReviewForm({
  listingId,
  onSubmit,
}: AddReviewFormProps) {
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || rating === 0 || !comment) {
      alert("الرجاء ملء جميع الحقول");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      if (onSubmit) {
        onSubmit({ userName, rating, comment });
      }

      setSubmitted(true);
      setIsSubmitting(false);

      // Reset form
      setTimeout(() => {
        setUserName("");
        setRating(0);
        setComment("");
        setSubmitted(false);
      }, 3000);
    }, 1000);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-50 border border-green-200 rounded-3xl p-12 text-center"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Send size={32} className="text-white" />
        </div>
        <h3 className="text-2xl font-black text-green-900 mb-2">
          شكراً لتقييمك!
        </h3>
        <p className="text-green-700 font-bold">
          تم إرسال تقييمك بنجاح وسيظهر قريباً
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12">
      <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-6">
        أضف تقييمك
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">
            الاسم
          </label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="أدخل اسمك"
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-3">
            التقييم
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size={32} />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-black text-slate-700 mb-2">
            التعليق
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="شاركنا تجربتك في هذا السكن..."
            rows={5}
            className="w-full px-6 py-4 rounded-2xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-bold resize-none"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-premium-gradient text-white px-8 py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              جاري الإرسال...
            </>
          ) : (
            <>
              إرسال التقييم
              <Send size={20} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
