"use client";

import Link from "next/link";
import {
  Building2,
  Menu,
  X,
  Phone,
  Globe,
  Users,
  Search,
  PlusCircle,
  Calendar,
  DollarSign,
  ArrowRight,
  Download,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  useEffect(() => {
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
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-2xl border-b border-slate-200 py-3 shadow-lg shadow-slate-200/20"
            : "bg-white/50 backdrop-blur-md py-4 sm:py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex justify-between items-center h-16">
            {/* Right Side: Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary p-2.5 rounded-xl text-white shadow-lg shadow-primary/20 group-hover:rotate-[10deg] transition-transform duration-500">
                <Building2 size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
                  سكّني
                </span>
              </div>
            </Link>

            {/* Center Links (Desktop) */}
            <div className="hidden md:flex items-center bg-white/50 border border-slate-200 px-8 py-3 rounded-full backdrop-blur-md">
              <div className="flex items-center gap-10">
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
            <div className="hidden md:flex items-center gap-10">
              <Link
                href="/owner/submit"
                className="text-slate-600 hover:text-primary font-bold transition-colors underline-offset-8 hover:underline decoration-primary/30"
              >
                عرض عقارك للطلاب
              </Link>
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
              </div>

              {/* Footer Button */}
              <div className="p-6 border-t border-slate-50">
                <Link
                  href="/owner/submit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full py-5 bg-primary text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  أضف سكنك الآن
                </Link>

                {deferredPrompt && (
                  <button
                    onClick={() => {
                      handleInstallClick();
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center w-full py-4 mt-2 text-slate-400 font-bold text-sm hover:text-primary transition-all"
                  >
                    تثبيت تطبيق سكّني
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
