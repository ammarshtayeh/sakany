"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, LogIn, UserPlus, Phone } from "lucide-react";
import Link from "next/link";

interface OwnerActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OwnerActionModal({
  isOpen,
  onClose,
}: OwnerActionModalProps) {
  const whatsappNumber = "972595537190";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white rounded-[3rem] p-8 md:p-12 max-w-2xl w-full shadow-2xl overflow-hidden border border-slate-100"
          >
            {/* Decoration */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary via-orange-400 to-primary" />

            <button
              onClick={onClose}
              className="absolute top-6 left-6 p-2 bg-slate-100 rounded-xl text-slate-400 hover:bg-slate-200 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="text-right mb-10 mt-4">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                عرض عقارك على <span className="text-gradient">سكنو</span>
              </h2>
              <p className="text-slate-500 font-bold text-lg">
                اختر الطريقة التي تفضلها للبدء بتأجير سكنك
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* WhatsApp Option */}
              <Link
                href={`https://wa.me/${whatsappNumber}`}
                onClick={onClose}
                className="group relative bg-emerald-50 border-2 border-emerald-100 p-8 rounded-[2.5rem] hover:border-emerald-500 transition-all text-right flex flex-col items-end"
              >
                <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Phone size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  تواصل سريع
                </h3>
                <p className="text-emerald-700/70 font-bold leading-relaxed mb-6">
                  ارسل تفاصيل سكنك وصورك مباشرة عبر الواتساب وسنقوم بنشرها لك.
                </p>
                <div className="mt-auto text-emerald-600 font-black flex items-center gap-2 group-hover:gap-3 transition-all">
                  ابدأ المحادثة الآن
                  <MessageSquare size={18} />
                </div>
              </Link>

              {/* Dashboard Option */}
              <Link
                href="/owner/login"
                onClick={onClose}
                className="group relative bg-primary/5 border-2 border-primary/10 p-8 rounded-[2.5rem] hover:border-primary transition-all text-right flex flex-col items-end"
              >
                <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
                  <LogIn size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  لوحة التحكم
                </h3>
                <p className="text-primary/70 font-bold leading-relaxed mb-6">
                  سجل سكنك بنفسك، أضف الصور، وتحكم في الأسعار والتفاصيل في أي
                  وقت.
                </p>
                <div className="mt-auto text-primary font-black flex items-center gap-2 group-hover:gap-3 transition-all">
                  دخول / تسجيل جديد
                  <UserPlus size={18} />
                </div>
              </Link>
            </div>

            <p className="text-center text-slate-400 font-bold text-sm mt-10">
              انضم لأكثر من 180 صاحب عقار يثقون بمنصتنا في نابلس
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
