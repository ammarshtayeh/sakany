"use client";

import Link from "next/link";
import { Building2, Menu, X, User, Phone, Globe, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "الرئيسية", href: "/" },
    { name: "سكن الشباب", href: "/students" },
    { name: "سكن الطالبات", href: "/studentesses" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-black/80 backdrop-blur-2xl border-b border-white/5 py-3" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Right Side: Logo */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-premium-gradient p-3 rounded-2xl text-white shadow-2xl shadow-primary/40 group-hover:rotate-[10deg] transition-transform duration-500">
              <Building2 size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white leading-none tracking-tight">سكني</span>
             
            </div>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden md:flex items-center bg-white/5 border border-white/10 px-8 py-3 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-10">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="text-sm font-black text-slate-400 hover:text-white transition-all hover:scale-105"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Left Side: Actions */}
          <div className="hidden md:flex items-center gap-10">
          <Link href="/owner/submit" className="text-slate-400 hover:text-white font-bold transition-colors">أضف عقارك</Link>
          <Link href="/students" className="text-slate-400 hover:text-white font-bold transition-colors">سكن الشباب</Link>
          <Link href="/studentesses" className="text-slate-400 hover:text-white font-bold transition-colors">سكن الطالبات</Link>
            <a 
              href="tel:+970590000000"
              className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-primary hover:border-primary/50 transition-all"
            >
              <Phone size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-[85%] max-w-sm bg-black border-l border-white/10 z-50 md:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-premium-gradient p-2 rounded-xl text-white">
                    <Building2 size={24} />
                  </div>
                  <span className="text-2xl font-black text-white">سكني</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-white/5 rounded-2xl text-slate-400 hover:text-white"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-6 bg-white/5 rounded-[2rem] border border-white/5 hover:border-primary/50 transition-all group"
                  >
                    <span className="text-xl font-black text-white group-hover:text-primary transition-colors">{link.name}</span>
                    <ArrowRight size={20} className="text-slate-600 group-hover:text-primary -rotate-180" />
                  </Link>
                ))}
              </div>

              <div className="p-8 border-t border-white/5 space-y-4">
                <Link
                  href="/owner/submit"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-3 w-full py-5 bg-premium-gradient text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20"
                >
                  <Building2 size={20} />
                  أضف سكنك الآن
                </Link>
                <div className="text-center py-4">
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.3em]">Sakany - Nablus, Palestine</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
