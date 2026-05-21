"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Menu,
  X,
  Phone,
  Globe,
  Users,
  Search,
  Download,
  Home,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import OwnerActionModal from "./OwnerActionModal";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isOwnerModalOpen, setIsOwnerModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"rent" | "sale">("rent");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check local fallback auth first
    const isLocalAdmin = localStorage.getItem("local_admin") === "true";
    const isLocalOwner = localStorage.getItem("local_owner") === "true";
    
    if (isLocalAdmin) {
      setCurrentUser({ email: "ammar.shtayeh@gmail.com" });
      setIsAdmin(true);
    } else if (isLocalOwner) {
      setCurrentUser({ email: "owner@sakannu.com" });
      setIsAdmin(false);
    }

    if (auth) {
      const unsubscribe = onAuthStateChanged(auth as any, (user) => {
        if (user) {
          setCurrentUser(user);
          setIsAdmin(user.email === "ammar.shtayeh@gmail.com");
        } else {
          if (!isLocalAdmin && !isLocalOwner) {
            setCurrentUser(null);
            setIsAdmin(false);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("SW Registered", reg))
        .catch((err) => console.error("SW Registration failed", err));
    }

    // Detect iOS (including modern iPads)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    setIsIOS(isIOSDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("local_admin");
    localStorage.removeItem("local_owner");
    if (auth) {
      signOut(auth as any);
    }
    setCurrentUser(null);
    setIsAdmin(false);
    window.location.href = "/";
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
  };

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "سكن الشباب", href: "/students" },
    { name: "سكن الطالبات", href: "/studentesses" },
    { name: "شريك سكن", href: "/roommate" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-in-out ${
          scrolled
            ? "top-4 mx-auto w-[95%] max-w-7xl rounded-3xl bg-white/80 backdrop-blur-2xl border border-white/20 py-2 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            : "top-0 w-full bg-white/0 backdrop-blur-none py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-20">
            {/* Right Side: Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-20 h-20 overflow-hidden rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 group-hover:rotate-[10deg] transition-transform duration-500">
                <Image
                  src="/logo.png"
                  alt="لوجو سكنو"
                  width={72}
                  height={72}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                  سكنو
                </span>
                <span className="text-[10px] font-black text-slate-400 tracking-widest mt-0.5">
                  SAKANNU
                </span>
              </div>
            </Link>

            {/* Center Links (Desktop) */}
            <div className="hidden md:flex items-center bg-white/50 border border-slate-200 px-6 py-3 rounded-full backdrop-blur-md">
              <div className="flex items-center gap-6 lg:gap-10">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-sm font-black text-slate-500 hover:text-primary transition-all hover:scale-105"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Left Side: Actions */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
              {currentUser ? (
                <div className="flex items-center gap-6 border-l border-slate-200 pl-6 h-8">
                  {isAdmin ? (
                    <Link
                      href="/admin"
                      className="text-slate-600 hover:text-primary font-bold transition-all text-sm animate-in fade-in"
                    >
                      الإدارة
                    </Link>
                  ) : (
                    <Link
                      href="/owner/dashboard"
                      className="text-slate-600 hover:text-primary font-bold transition-all text-sm animate-in fade-in"
                    >
                      لوحة المالك
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-slate-400 hover:text-red-500 font-bold transition-all text-sm"
                  >
                    تسجيل الخروج
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-6 border-l border-slate-200 pl-6 h-8">
                  <Link
                    href="/owner/login"
                    className="text-slate-600 hover:text-primary font-bold transition-all text-sm"
                  >
                    دخول الملاك
                  </Link>
                </div>
              )}
              <button
                onClick={() => {
                  setModalMode("rent");
                  setIsOwnerModalOpen(true);
                }}
                className="text-slate-600 hover:text-primary font-bold transition-colors underline-offset-8 hover:underline decoration-primary/30 whitespace-nowrap"
              >
                عرض عقارك للطلاب
              </button>
              <button
                onClick={() => {
                  setModalMode("sale");
                  setIsOwnerModalOpen(true);
                }}
                className="text-slate-600 hover:text-primary font-bold transition-colors underline-offset-8 hover:underline decoration-primary/30 whitespace-nowrap"
              >
                عرض سكنك للبيع
              </button>
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl font-black text-xs hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5 active:scale-95"
                >
                  <Download size={16} />
                  تثبيت التطبيق
                </button>
              )}
              <a
                href="tel:+97059537190"
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
              >
                <Phone size={20} />
              </a>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="p-2.5 bg-primary/10 text-primary border border-primary/20 rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm active:scale-90"
                >
                  <Download size={20} />
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-slate-900 p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-90 shadow-sm"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay & Drawer (Moved outside nav for proper visibility) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 bottom-0 right-0 w-[85%] max-w-[320px] bg-white z-[100] md:hidden flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.15)] overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 pb-2 flex flex-col items-end gap-10 text-right w-full">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X size={24} />
                </button>
                <h2 className="text-3xl font-black text-slate-900 pr-2 w-full">
                  القائمة
                </h2>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 px-4 py-8 space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex flex-row-reverse items-center gap-4 p-4 rounded-2xl transition-all group ${
                      link.name === "الرئيسية"
                        ? "bg-primary/5 text-primary"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-xl transition-colors">
                      {link.name === "الرئيسية" && <Home size={22} />}
                      {link.name === "سكن الشباب" && <Users size={22} />}
                      {link.name === "سكن الطالبات" && <Users size={22} />}
                      {link.name === "شريك سكن" && <Globe size={22} />}
                    </div>
                    <span className="text-xl font-bold flex-1 text-right">
                      {link.name}
                    </span>
                  </Link>
                ))}

                {currentUser ? (
                  <div className="pt-4 border-t border-slate-50 mt-4 space-y-2">
                    {isAdmin ? (
                      <Link
                        href="/admin"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-row-reverse items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        <Settings size={22} className="text-slate-400" />
                        <span className="text-lg font-bold flex-1 text-right">
                          لوحة الإدارة للموقع
                        </span>
                      </Link>
                    ) : (
                      <Link
                        href="/owner/dashboard"
                        onClick={() => setIsOpen(false)}
                        className="flex flex-row-reverse items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all"
                      >
                        <LayoutDashboard size={22} className="text-slate-400" />
                        <span className="text-lg font-bold flex-1 text-right">
                          لوحة التحكم للملاك
                        </span>
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex flex-row-reverse items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 transition-all w-full text-right"
                    >
                      <X size={22} className="text-red-400" />
                      <span className="text-lg font-bold flex-1 text-right">
                        تسجيل الخروج
                      </span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-slate-50 mt-4 space-y-2">
                    <Link
                      href="/owner/login"
                      onClick={() => setIsOpen(false)}
                      className="flex flex-row-reverse items-center gap-4 p-4 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      <LayoutDashboard size={22} className="text-slate-400" />
                      <span className="text-lg font-bold flex-1 text-right">
                        دخول الملاك
                      </span>
                    </Link>
                  </div>
                )}

                {/* PWA Install Button - Show more reliably */}
                {(deferredPrompt ||
                  isIOS ||
                  /android/.test(window.navigator.userAgent.toLowerCase())) &&
                  !(window.navigator as any).standalone && (
                    <button
                      onClick={() => {
                        if (isIOS) {
                          setShowIOSGuide(true);
                        } else if (deferredPrompt) {
                          handleInstallClick();
                        } else {
                          alert(
                            "لتثبيت التطبيق على أندرويد، اضغط على النقاط الثلاث في المتصفح ثم اختر 'تثبيت التطبيق'.",
                          );
                        }
                        setIsOpen(false);
                      }}
                      className="flex flex-row-reverse items-center gap-4 p-4 rounded-2xl text-primary bg-primary/10 border-2 border-primary/20 hover:bg-primary/20 transition-all w-full mt-4"
                    >
                      <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                        <Download size={22} />
                      </div>
                      <span className="text-xl font-black flex-1 text-right">
                        تثبيت تطبيق سكنو
                      </span>
                    </button>
                  )}
              </div>

              {/* Footer Buttons */}
              <div className="p-6 border-t border-slate-50 space-y-3">
                <button
                  onClick={() => {
                    setModalMode("rent");
                    setIsOwnerModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center w-full py-4 bg-primary text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  أضف سكنك للطلاب (إيجار)
                </button>
                <button
                  onClick={() => {
                    setModalMode("sale");
                    setIsOwnerModalOpen(true);
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center w-full py-4 bg-white border-2 border-primary text-primary rounded-[1.5rem] font-black text-lg hover:bg-primary/5 active:scale-[0.98] transition-all"
                >
                  عرض سكنك للبيع
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* iOS Install Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowIOSGuide(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-400"
                >
                  <X size={20} />
                </button>
                <div className="bg-primary/10 p-3 rounded-2xl text-primary">
                  <Download size={24} />
                </div>
              </div>

              <div className="text-right space-y-4">
                <h3 className="text-2xl font-black text-slate-900">
                  تثبيت سكنو على آيفون
                </h3>
                <p className="text-slate-600 font-bold leading-relaxed">
                  لثبيت التطبيق على جهازك، يرجى اتباع الخطوات التالية في متصفح
                  Safari:
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex flex-row-reverse items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 mt-1">
                      1
                    </div>
                    <p className="flex-1 text-slate-700 font-bold text-sm">
                      إضغط على زر المشاركة{" "}
                      <span className="inline-block p-1 bg-slate-100 rounded mx-1 text-blue-500">
                        ↑
                      </span>{" "}
                      في المحرك السفلي.
                    </p>
                  </div>
                  <div className="flex flex-row-reverse items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500 mt-1">
                      2
                    </div>
                    <p className="flex-1 text-slate-700 font-bold text-sm">
                      قم بالتمرير للأسفل واختر "إضافة إلى الشاشة الرئيسية" (Add
                      to Home Screen).
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-full py-4 mt-6 bg-slate-900 text-white rounded-2xl font-black text-lg transition-all active:scale-95"
                >
                  حسناً، فهمت
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <OwnerActionModal
        isOpen={isOwnerModalOpen}
        onClose={() => setIsOwnerModalOpen(false)}
        mode={modalMode}
      />
    </>
  );
}
