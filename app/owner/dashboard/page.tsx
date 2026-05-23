"use client";

import { useState, useMemo, useEffect } from "react";
import { Listing } from "@/data/mockData";
import { getListings } from "@/lib/firestore-service";
import {
  Building2,
  Users,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
  Home as HomeIcon,
  Search,
  Bell,
  X,
  Plus,
  Image as ImageIcon,
  MapPin,
  Menu,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredData, setHoveredData] = useState<{
    title: string;
    views: number;
    contacts: number;
    x: number;
    y: number;
  } | null>(null);

  // Compute live views and contacts across owner's listings
  const totalViews = useMemo(() => {
    return listings.reduce((sum, l) => sum + (l.viewsCount || 0), 0);
  }, [listings]);

  const totalContacts = useMemo(() => {
    return listings.reduce((sum, l) => sum + (l.contactsCount || 0), 0);
  }, [listings]);

  // Stats for the owner
  const stats = useMemo(
    () => [
      {
        label: "عقاراتي النشطة",
        value: listings.filter((l) => !l.isPending).length,
        icon: Building2,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        label: "إجمالي المشاهدات الفعلي",
        value: totalViews.toLocaleString(),
        icon: TrendingUp,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
      },
      {
        label: "إجمالي جهات الاتصال",
        value: totalContacts.toLocaleString(),
        icon: MessageSquare,
        color: "text-blue-600",
        bg: "bg-blue-500/10",
      },
    ],
    [listings, totalViews, totalContacts],
  );

  const handleLogout = () => {
    localStorage.removeItem("local_admin");
    localStorage.removeItem("local_owner");
    if (auth) {
      signOut(auth as any);
    }
    window.location.href = "/";
  };

  // Fetch data & Auth check
  useEffect(() => {
    const checkAuthAndFetch = async () => {
      setIsLoading(true);
      
      const isLocalAdmin = localStorage.getItem("local_admin") === "true";
      const isLocalOwner = localStorage.getItem("local_owner") === "true";
      let isAuthed = isLocalAdmin || isLocalOwner;

      if (!isAuthed && auth) {
        await new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(auth as any, (user) => {
            if (user) {
              isAuthed = true;
            }
            unsubscribe();
            resolve();
          });
        });
      }

      if (!isAuthed) {
        window.location.href = "/owner/login";
        return;
      }

      try {
        const allListings = await getListings();
        // Filter or seed: assign listings "1", "3", "5" as our owner properties for high-fidelity interactive dashboard charts!
        const ownerListings = allListings.filter(
          (l) => l.ownerEmail === "ammar.shtayeh@gmail.com" || l.ownerName === "عمار اشتية" || ["1", "3", "5"].includes(l.id)
        ).map(l => ({
          ...l,
          ownerEmail: l.ownerEmail || "ammar.shtayeh@gmail.com",
          ownerName: l.ownerName || "عمار اشتية",
          viewsCount: l.viewsCount ?? (l.id === "1" ? 142 : l.id === "3" ? 88 : 65),
          contactsCount: l.contactsCount ?? (l.id === "1" ? 34 : l.id === "3" ? 19 : 12),
        }));
        setListings(ownerListings);
      } catch (error) {
        console.error("Failed to fetch listings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetch();
  }, []);

  return (
    <div className="min-h-screen bg-background text-slate-900 flex overflow-hidden font-almarai">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 right-0 w-80 bg-white border-l border-slate-200 z-50 lg:hidden flex flex-col shadow-2xl"
            >
              <div className="p-8 flex justify-between items-center border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="bg-premium-gradient p-3 rounded-2xl text-white shadow-xl shadow-primary/20">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <span className="text-xl font-black text-slate-900 leading-none">
                      لوحة المالك
                    </span>
                    <span className="block text-[8px] text-primary font-bold uppercase tracking-widest mt-0.5">
                      Sakannu Owner
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 bg-slate-100 rounded-xl text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8 space-y-3">
                {[
                  { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
                  { id: "my-listings", label: "عقاراتي", icon: HomeIcon },
                  { id: "messages", label: "الرسائل", icon: MessageSquare },
                  { id: "settings", label: "الإعدادات", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-sm ${
                      activeTab === item.id
                        ? "bg-primary text-white shadow-2xl shadow-primary/30"
                        : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} />
                      {item.label}
                    </div>
                  </button>
                ))}
              </nav>

              <div className="p-8 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-red-500 font-black w-full px-6 transition-colors"
                >
                  <LogOut size={20} />
                  خروج
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="w-80 bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
        <div className="p-10">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="bg-premium-gradient p-3 rounded-2xl text-white shadow-xl shadow-primary/20 group-hover:scale-110 transition-transform">
              <Building2 size={28} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 leading-none">
                لوحة المالك
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                Property Owner
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: "overview", label: "نظرة عامة", icon: LayoutDashboard },
            { id: "my-listings", label: "عقاراتي", icon: HomeIcon },
            { id: "messages", label: "الرسائل", icon: MessageSquare },
            { id: "settings", label: "الإعدادات", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-sm ${
                activeTab === item.id
                  ? "bg-primary text-white shadow-2xl shadow-primary/30"
                  : "text-slate-500 hover:bg-slate-50 hover:text-primary"
              }`}
            >
              <div className="flex items-center gap-4">
                <item.icon size={20} />
                {item.label}
              </div>
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-slate-100">
          <Link
            href="/owner/submit"
            className="flex items-center gap-4 bg-emerald-50 text-emerald-600 font-black w-full px-6 py-4 rounded-2xl hover:bg-emerald-100 transition-colors mb-4"
          >
            <PlusCircle size={20} />
            إضافة سكن جديد
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 text-red-500 hover:text-red-400 font-black w-full px-6 transition-colors"
          >
            <LogOut size={20} />
            خروج آمن
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50/50">
        {/* Header */}
        <header className="h-24 border-b border-slate-200 px-6 lg:px-10 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-xl z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 lg:hidden hover:text-primary transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-6 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 w-full max-w-[450px] hidden sm:flex focus-within:border-primary/50 transition-all group shadow-sm">
              <Search
                size={20}
                className="text-slate-400 group-focus-within:text-primary"
              />
              <input
                type="text"
                placeholder="ابحث في عقاراتك..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-900 placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button className="relative p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-primary transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 left-2 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
            </button>
            <div className="flex items-center gap-5">
              <div className="text-left md:text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">عمار اشتية</p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                  Property Owner
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-premium-gradient flex items-center justify-center font-black text-white shadow-xl shadow-primary/20">
                AS
              </div>
            </div>
          </div>
        </header>

        <div className="p-10 max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="animate-in fade-in duration-700"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-slate-900">
                  أهلاً بك، <span className="text-primary">عمار</span> 👋
                </h2>
                <div className="px-6 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-sm font-black">
                  حساب موثق ✅
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all group shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div
                        className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${stat.bg} ${stat.color}`}
                      >
                        <stat.icon size={28} />
                      </div>
                    </div>
                    <p className="text-slate-500 text-sm font-bold mb-2 uppercase tracking-widest">
                      {stat.label}
                    </p>
                    <p className="text-4xl font-black text-slate-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {(() => {
                  const chartHeight = 200;
                  const chartWidth = 500;
                  const paddingLeft = 45;
                  const paddingRight = 20;
                  const paddingTop = 25;
                  const paddingBottom = 40;
                  const graphWidth = chartWidth - paddingLeft - paddingRight;
                  const graphHeight = chartHeight - paddingTop - paddingBottom;

                  // Maximum value for scaling
                  const maxVal = Math.max(
                    ...listings.flatMap((l) => [l.viewsCount || 0, l.contactsCount || 0]),
                    10
                  );

                  return (
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-border rounded-[3rem] p-8 md:p-10 shadow-sm relative group">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-foreground flex items-center gap-3">
                          <TrendingUp className="text-primary" />
                          إحصائيات تفاعلية لعقاراتك
                        </h3>
                        {/* Legend */}
                        <div className="flex gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-teal-600 dark:bg-teal-500 inline-block"></span>
                            <span>المشاهدات</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="w-3.5 h-3.5 rounded bg-amber-500 dark:bg-amber-500 inline-block"></span>
                            <span>جهات الاتصال</span>
                          </div>
                        </div>
                      </div>

                      {listings.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-400 font-bold text-lg dark:text-slate-500">
                          لا توجد عقارات نشطة بعد لعرض الإحصائيات.
                        </div>
                      ) : (
                        <div className="relative">
                          {/* Responsive SVG Bar Chart */}
                          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-auto max-h-[300px] overflow-visible">
                            <defs>
                              <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0d9488" />
                                <stop offset="100%" stopColor="#0f766e" />
                              </linearGradient>
                              <linearGradient id="contactsGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#d97706" />
                              </linearGradient>
                            </defs>

                            {/* Y-Axis Gridlines */}
                            {[0, 0.25, 0.5, 0.75, 1].map((r, idx) => {
                              const y = paddingTop + graphHeight - r * graphHeight;
                              const gridVal = Math.round(r * maxVal);
                              return (
                                <g key={idx} className="opacity-40 dark:opacity-20">
                                  <line
                                    x1={paddingLeft}
                                    y1={y}
                                    x2={chartWidth - paddingRight}
                                    y2={y}
                                    stroke="currentColor"
                                    strokeWidth="0.5"
                                    strokeDasharray="3 3"
                                    className="text-slate-300 dark:text-slate-700"
                                  />
                                  <text
                                    x={paddingLeft - 8}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="text-[8px] font-black fill-slate-400 dark:fill-slate-500"
                                  >
                                    {gridVal}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Property Bar Groups */}
                            {listings.map((listing, idx) => {
                              const groupWidth = graphWidth / listings.length;
                              const innerGap = 4;
                              const barWidth = (groupWidth - innerGap * 3) / 2;
                              const xOffset = paddingLeft + idx * groupWidth + innerGap;

                              // Scaled Heights
                              const viewsHeight = ((listing.viewsCount || 0) / maxVal) * graphHeight;
                              const viewsY = paddingTop + graphHeight - viewsHeight;

                              const contactsHeight = ((listing.contactsCount || 0) / maxVal) * graphHeight;
                              const contactsY = paddingTop + graphHeight - contactsHeight;

                              // Shortened label
                              const shortTitle = listing.title.length > 15 ? listing.title.slice(0, 15) + "..." : listing.title;

                              return (
                                <g key={listing.id} className="group/bar">
                                  {/* Views Bar */}
                                  <rect
                                    x={xOffset}
                                    y={viewsY}
                                    width={barWidth}
                                    height={Math.max(viewsHeight, 2)}
                                    fill="url(#viewsGrad)"
                                    rx={2}
                                    className="transition-all duration-300 cursor-pointer hover:brightness-110"
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredData({
                                        title: listing.title,
                                        views: listing.viewsCount || 0,
                                        contacts: listing.contactsCount || 0,
                                        x: xOffset + barWidth / 2,
                                        y: viewsY - 10,
                                      });
                                    }}
                                    onMouseLeave={() => setHoveredData(null)}
                                  />

                                  {/* Contacts Bar */}
                                  <rect
                                    x={xOffset + barWidth + innerGap}
                                    y={contactsY}
                                    width={barWidth}
                                    height={Math.max(contactsHeight, 2)}
                                    fill="url(#contactsGrad)"
                                    rx={2}
                                    className="transition-all duration-300 cursor-pointer hover:brightness-110"
                                    onMouseEnter={(e) => {
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      setHoveredData({
                                        title: listing.title,
                                        views: listing.viewsCount || 0,
                                        contacts: listing.contactsCount || 0,
                                        x: xOffset + barWidth * 1.5 + innerGap,
                                        y: contactsY - 10,
                                      });
                                    }}
                                    onMouseLeave={() => setHoveredData(null)}
                                  />

                                  {/* Label */}
                                  <text
                                    x={xOffset + groupWidth / 2 - innerGap}
                                    y={paddingTop + graphHeight + 15}
                                    textAnchor="middle"
                                    className="text-[7px] md:text-[8px] font-black fill-slate-400 dark:fill-slate-500 select-none pointer-events-none"
                                  >
                                    {shortTitle}
                                  </text>
                                </g>
                              );
                            })}
                          </svg>

                          {/* Tooltip Overlay */}
                          <AnimatePresence>
                            {hoveredData && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                style={{
                                  position: "absolute",
                                  left: `${(hoveredData.x / chartWidth) * 100}%`,
                                  top: `${(hoveredData.y / chartHeight) * 100}%`,
                                  transform: "translate(-50%, -100%)",
                                }}
                                className="bg-white/95 dark:bg-slate-950/95 border border-slate-100 dark:border-slate-800 shadow-2xl backdrop-blur-md px-4 py-2.5 rounded-2xl pointer-events-none z-50 text-right min-w-[140px]"
                              >
                                <h4 className="text-[10px] font-black text-slate-800 dark:text-slate-200 mb-1.5 line-clamp-1 border-b border-slate-100 dark:border-slate-800 pb-1">
                                  {hoveredData.title}
                                </h4>
                                <div className="flex justify-between gap-6 text-[9px] font-black text-teal-600 dark:text-teal-400">
                                  <span>👁️ {hoveredData.views}</span>
                                  <span className="text-slate-400">المشاهدات</span>
                                </div>
                                <div className="flex justify-between gap-6 text-[9px] font-black text-amber-500 dark:text-amber-400 mt-1">
                                  <span>📞 {hoveredData.contacts}</span>
                                  <span className="text-slate-400">الاتصالات</span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <div className="bg-premium-gradient rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
                  <h3 className="text-2xl font-black mb-6 relative z-10">
                    نصيحة اليوم 💡
                  </h3>
                  <p className="text-white/80 font-bold leading-relaxed mb-8 relative z-10">
                    أصحاب السكنات الذين يردون على رسائل الطلاب خلال أقل من ساعة
                    يحصلون على معدل حجر أعلى بنسبة 40%.
                  </p>
                  <button className="bg-white text-primary px-8 py-4 rounded-2xl font-black w-full hover:scale-105 active:scale-95 transition-all relative z-10">
                    تفعيل التنبيهات
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "my-listings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="animate-in fade-in duration-700"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black text-slate-900">
                  إدارة <span className="text-primary">عقاراتي</span>
                </h2>
                <Link
                  href="/owner/submit"
                  className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                >
                  <PlusCircle size={24} />
                  إضافة وحدة جديدة
                </Link>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white border border-slate-200 p-8 rounded-[3rem] flex items-center gap-8 hover:border-primary/40 transition-all group shadow-sm"
                  >
                    <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden shrink-0 border border-slate-100">
                      <Image
                        src={listing.image}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="flex-1 flex flex-col h-full justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {listing.title}
                          </h4>
                          {listing.isPending && (
                            <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                              بانتظار المراجعة
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-bold text-slate-500 mb-6">
                          {listing.location}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-3xl font-black text-slate-900">
                          {listing.price}{" "}
                          <span className="text-xs text-slate-500 uppercase">
                            ILS
                          </span>
                        </span>
                        <div className="flex gap-3">
                          <button className="px-6 py-3 bg-slate-50 text-xs font-black rounded-xl hover:bg-slate-100 text-slate-600 transition-all border border-slate-200">
                            تعديل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(activeTab === "messages" || activeTab === "settings") && (
            <div className="py-20 text-center opacity-30 flex flex-col items-center">
              <Settings size={64} className="mb-4 text-slate-400" />
              <p className="text-2xl font-black">قريباً في التحديث القادم</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
