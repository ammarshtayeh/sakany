"use client";

import { useState } from "react";
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  Github,
  Chrome,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export default function OwnerLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    
    // Strict block: Only admin email and password allowed
    if (email !== "ammar.shtayeh@gmail.com" || password !== "ammarking") {
      setErrorMessage("غير مصرح لك بالدخول. الدخول متاح فقط للمدير المسؤول.");
      setIsLoading(false);
      return;
    }

    // Direct login for admin
    localStorage.setItem("local_admin", "true");
    
    if (auth) {
      try {
        console.log("Signing in admin to Firebase Auth...");
        await signInWithEmailAndPassword(auth as any, email, password);
      } catch (signInError: any) {
        console.log("Firebase sign-in failed, attempting to seed admin account...", signInError.code);
        // Try creating the account if it doesn't exist in Firebase Database
        try {
          await createUserWithEmailAndPassword(auth as any, email, password);
          console.log("Admin account successfully seeded in Firebase Auth.");
        } catch (createError) {
          console.error("Failed to seed admin in Firebase Auth:", createError);
        }
      }
    }
    
    window.location.href = "/admin";
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-almarai">
      {/* Left Side: Branding & Info */}
      <div className="hidden md:flex md:w-1/2 bg-premium-gradient relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-3xl" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-lg text-right">
          <Link href="/" className="inline-flex items-center gap-4 mb-12 group">
            <div className="relative w-14 h-14 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1 group-hover:rotate-12 transition-transform">
              <Image
                src="/logo.png"
                alt="لوجو سكنو"
                width={52}
                height={52}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-4xl font-black text-white leading-none">سكنو</span>
              <span className="text-[10px] font-black text-white/50 tracking-widest mt-1">SAKANNU</span>
            </div>
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white mb-8 leading-tight"
          >
            رحلة تأجير عقارك <br /> تبدأ من هنا
          </motion.h1>

          <div className="space-y-6">
            {[
              "تحكم كامل في مواصفات وصور سكنك",
              "إحصائيات مباشرة لمشاهدات الطلاب",
              "تواصل سريع وآمن مع المستأجرين",
            ].map((text, i) => (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 * i }}
                key={i}
                className="flex flex-row-reverse items-center gap-4 text-white/90 font-bold text-xl"
              >
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                {text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 lg:p-24 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-12 text-center md:text-right">
            <Link
              href="/"
              className="md:hidden inline-flex items-center gap-3 mb-8"
            >
              <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-white border border-slate-100 shadow-sm flex items-center justify-center p-0.5">
                <Image
                  src="/logo.png"
                  alt="لوجو سكنو"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col text-right">
                <span className="text-2xl font-black text-slate-900 leading-none">سكنو</span>
                <span className="text-[10px] font-black text-slate-400 tracking-wider">SAKANNU</span>
              </div>
            </Link>
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">
              أهلاً بك مجدداً
            </h2>
            <p className="text-slate-500 font-bold text-lg">
              سجل دخولك لإدارة سكناتك في نابلس
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-600 px-6 py-4 rounded-2xl font-bold text-sm text-right mb-6 border border-red-100 animate-in fade-in">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-black text-slate-500 uppercase tracking-widest mr-2">
                بريدك الإلكتروني
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 pr-14 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-900 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-2">
                <Link
                  href="#"
                  className="text-xs font-black text-primary hover:underline underline-offset-4"
                >
                  نسيت كلمة المرور؟
                </Link>
                <label className="text-sm font-black text-slate-500 uppercase tracking-widest">
                  كلمة المرور
                </label>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center pr-6 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-5 pr-14 focus:border-primary focus:bg-white outline-none transition-all font-bold text-slate-900 shadow-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-premium-gradient py-5 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-white flex items-center justify-center gap-3 mt-8 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  دخول إلى حسابي
                  <ArrowRight size={24} className="rotate-180" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12">
            <div className="relative mb-10">
              <div className="absolute inset-0 flex items-center text-slate-100">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-6 text-slate-400 font-bold uppercase tracking-widest">
                  أو عبر المنصات الأخرى
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-700">
                <Chrome size={20} />
                Google
              </button>
              <button className="flex items-center justify-center gap-3 py-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all font-black text-slate-700">
                <Github size={20} />
                GitHub
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-slate-600 font-bold">
            ليس لديك حساب بعد؟{" "}
            <Link
              href="#"
              className="text-primary hover:underline underline-offset-4 font-black"
            >
              سجل حساباً جديداً
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
