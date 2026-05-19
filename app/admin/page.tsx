"use client";

import { useState, useMemo, useEffect } from "react";
import { Listing, Ad } from "@/data/mockData";
import {
  getPendingListings,
  getListings,
  approveListing,
  rejectListing,
  getAllAds,
  addAd,
  updateAd,
  deleteAd,
} from "@/lib/firestore-service";
import {
  Building2,
  Users,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
  Trash2,
  Edit,
  Clock,
  Home as HomeIcon,
  Search,
  Bell,
  X,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Eye,
  MapPin,
  Menu,
  Megaphone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [listings, setListings] = useState<Listing[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddAdModalOpen, setIsAddAdModalOpen] = useState(false);
  const [adTitle, setAdTitle] = useState("");
  const [adImageUrl, setAdImageUrl] = useState("");
  const [adLinkUrl, setAdLinkUrl] = useState("");
  const [isAdSubmitting, setIsAdSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const stats = useMemo(
    () => [
      {
        label: "إجمالي العقارات",
        value: listings.filter((l) => !l.isPending).length,
        icon: Building2,
        color: "text-primary",
        bg: "bg-primary/10",
      },
      {
        label: "طلاب مسجلين",
        value: "+540",
        icon: Users,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
      },
      {
        label: "طلبات في الانتظار",
        value: listings.filter((l) => l.isPending).length,
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
      },
    ],
    [listings],
  );

  const filteredListings = useMemo(() => {
    return listings.filter(
      (l) =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.ownerName.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [listings, searchQuery]);

  const pendingListings = useMemo(
    () => filteredListings.filter((l) => l.isPending),
    [filteredListings],
  );
  const approvedListings = useMemo(
    () => filteredListings.filter((l) => !l.isPending),
    [filteredListings],
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
      let isAuthed = isLocalAdmin;

      if (!isLocalAdmin && auth) {
        await new Promise<void>((resolve) => {
          const unsubscribe = onAuthStateChanged(auth as any, (user) => {
            if (user && user.email === "ammar.shtayeh@gmail.com") {
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
        console.log("Fetching listings...");
        const approved = await getListings();
        console.log("Approved listings fetched:", approved.length);
        const pending = await getPendingListings();
        console.log("Pending listings fetched:", pending.length);
        const adsList = await getAllAds();
        console.log("Ads fetched:", adsList.length);

        setListings([...approved, ...pending]);
        setAds(adsList);
      } catch (error) {
        alert(
          "فشل تحميل البيانات. تأكد من اتصال الإنترنت أو إعدادات الفاير بيس (index missing).",
        );
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthAndFetch();
  }, [activeTab]); // Refresh when tab changes to ensure fresh data

  const handleAddAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle || !adImageUrl) {
      alert("يرجى ملء جميع الحقول الإلزامية");
      return;
    }
    setIsAdSubmitting(true);
    try {
      const newAdId = await addAd({
        title: adTitle,
        imageUrl: adImageUrl,
        linkUrl: adLinkUrl || undefined,
        isActive: true,
      });
      
      const newAd: Ad = {
        id: newAdId,
        title: adTitle,
        imageUrl: adImageUrl,
        linkUrl: adLinkUrl || undefined,
        isActive: true,
      };
      
      setAds((prev) => [newAd, ...prev]);
      setIsAddAdModalOpen(false);
      setAdTitle("");
      setAdImageUrl("");
      setAdLinkUrl("");
    } catch (error) {
      console.error("Failed to add ad:", error);
    } finally {
      setIsAdSubmitting(false);
    }
  };

  const handleToggleAd = async (id: string, currentStatus: boolean) => {
    try {
      await updateAd(id, { isActive: !currentStatus });
      setAds((prev) =>
        prev.map((ad) => (ad.id === id ? { ...ad, isActive: !currentStatus } : ad))
      );
    } catch (error) {
      console.error("Failed to toggle ad status:", error);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الإعلان؟")) {
      try {
        await deleteAd(id);
        setAds((prev) => prev.filter((ad) => ad.id !== id));
      } catch (error) {
        console.error("Failed to delete ad:", error);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا العقار؟")) {
      await rejectListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const handleApprove = async (id: string) => {
    await approveListing(id);
    setListings((prev) =>
      prev.map((l) => (l.id === id ? { ...l, isPending: false } : l)),
    );
  };

  const handleReject = async (id: string) => {
    if (confirm("هل أنت متأكد من رفض هذا الطلب؟ سيتم حذفه من النظام.")) {
      await rejectListing(id);
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-slate-900 font-almarai">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-xl font-black text-slate-500">جاري تحميل لوحة التحكم...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-900 flex overflow-hidden font-almarai">
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-[#0d0d0d] border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-3xl font-black text-slate-900">
                  إضافة <span className="text-primary">وحدة جديدة</span>
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>

              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsAddModalOpen(false);
                  alert("تمت الإضافة كطلب معلق (للأغراض التجريبية)");
                }}
              >
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 mr-2">
                      اسم العقار
                    </label>
                    <input
                      type="text"
                      placeholder="مثلاً: شقة فاخرة رفيديا"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 mr-2">
                      الموقع في نابلس
                    </label>
                    <input
                      type="text"
                      placeholder="مثلاً: شارع تونس"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 mr-2">
                      السعر (شيكل)
                    </label>
                    <input
                      type="number"
                      placeholder="1500"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-all"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 mr-2">
                      الفئة
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-all appearance-none"
                      required
                    >
                      <option value="students">طلاب</option>
                      <option value="studentesses">طالبات</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-500 mr-2">
                      النوع
                    </label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-all appearance-none"
                      required
                    >
                      <option value="apartment">شقة</option>
                      <option value="room">غرفة</option>
                      <option value="studio">استوديو</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-500 mr-2">
                    الوصف
                  </label>
                  <textarea
                    placeholder="اكتب تفاصيل العقار هنا..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-orange-500 outline-none transition-all"
                    required
                  ></textarea>
                </div>

                <div className="p-8 border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 hover:border-orange-500/50 transition-all cursor-pointer group">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-orange-500 transition-colors">
                    <ImageIcon size={32} />
                  </div>
                  <p className="text-slate-500 font-bold">
                    اسحب صور العقار هنا أو انقر للرفع
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-premium-gradient py-5 rounded-[1.5rem] font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-white"
                >
                  نشر العقار الآن
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              <div className="p-8 flex justify-between items-center border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="bg-premium-gradient p-3 rounded-2xl text-white shadow-xl shadow-primary/20">
                    <Building2 size={24} />
                  </div>
                  <div>
                    <span className="text-xl font-black text-slate-900 leading-none">
                      لوحة الإدارة
                    </span>
                    <span className="block text-[8px] text-primary font-bold uppercase tracking-widest mt-0.5">
                      Sakannu Admin
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 bg-white/5 rounded-xl text-slate-400"
                >
                  <X size={24} />
                </button>
              </div>

              <nav className="flex-1 px-6 py-8 space-y-3">
                {[
                  {
                    id: "overview",
                    label: "لوحة التحكم",
                    icon: LayoutDashboard,
                  },
                  {
                    id: "pending",
                    label: "طلبات المراجعة",
                    icon: Clock,
                    count: listings.filter((l) => l.isPending).length,
                  },
                  { id: "listings", label: "إدارة الوحدات", icon: HomeIcon },
                  { id: "ads", label: "إدارة الإعلانات", icon: Megaphone },
                  { id: "settings", label: "إعدادات النظام", icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all font-black text-sm ${
                      activeTab === item.id
                        ? "bg-orange-600 text-white shadow-2xl shadow-orange-600/30"
                        : "text-slate-500 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <item.icon size={20} />
                      {item.label}
                    </div>
                  </button>
                ))}
              </nav>

              <div className="p-8 border-t border-white/5">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-red-500 font-black w-full px-6 transition-colors"
                >
                  <LogOut size={20} />
                  خروج آمن
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
                لوحة الإدارة
              </span>
              <span className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">
                Site Administration
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          {[
            { id: "overview", label: "لوحة التحكم", icon: LayoutDashboard },
            {
              id: "pending",
              label: "طلبات المراجعة",
              icon: Clock,
              count: listings.filter((l) => l.isPending).length,
            },
            { id: "listings", label: "إدارة الوحدات", icon: HomeIcon },
            { id: "ads", label: "إدارة الإعلانات", icon: Megaphone },
            { id: "settings", label: "إعدادات النظام", icon: Settings },
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
              {item.count !== undefined && item.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${activeTab === item.id ? "bg-white text-primary" : "bg-primary text-white"}`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-8 border-t border-white/5">
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
              className="p-3 bg-white/5 rounded-xl text-slate-400 lg:hidden hover:text-white transition-colors"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن عقار..."
                className="bg-transparent border-none outline-none text-sm w-full text-slate-900 placeholder:text-slate-400 font-bold"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <button className="relative p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-colors border border-white/5">
              <Bell size={22} />
              {listings.some((l) => l.isPending) && (
                <span className="absolute top-2 left-2 w-3 h-3 bg-primary border-2 border-white rounded-full"></span>
              )}
            </button>
            <div className="flex items-center gap-5">
              <div className="text-left md:text-right hidden sm:block">
                <p className="text-sm font-black text-slate-900">
                  أدمن جامعة النجاح
                </p>
                <p className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">
                  Super Administrator
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center font-black text-white shadow-xl shadow-primary/20">
                JD
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
              <h2 className="text-4xl font-black mb-10 text-slate-900">
                نظرة <span className="text-primary">عامة</span>
              </h2>

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
                      <span className="text-xs text-emerald-500 font-black bg-emerald-500/10 px-3 py-1 rounded-full">
                        +12%
                      </span>
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

              <div className="bg-white border border-slate-200 rounded-[3rem] overflow-hidden shadow-sm">
                <div className="p-10 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-2xl font-black text-slate-900">
                    إحصائيات الإشغال بالمدينة
                  </h3>
                  <button className="text-primary text-sm font-black hover:underline uppercase tracking-widest">
                    عرض كامل البيانات
                  </button>
                </div>
                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    {[
                      { area: "رفيديا", count: 45, color: "bg-primary" },
                      { area: "شارع تونس", count: 28, color: "bg-primary/80" },
                      { area: "المخفية", count: 32, color: "bg-primary/60" },
                      { area: "الأكاديمية", count: 15, color: "bg-primary/40" },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-slate-900">{item.area}</span>
                          <span className="text-slate-500">{item.count}%</span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.count}%` }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-primary/5 rounded-[2rem] border border-primary/10 p-8 flex flex-col justify-center text-center">
                    <Users size={48} className="text-primary mx-auto mb-4" />
                    <h4 className="text-2xl font-black text-slate-900 mb-2">
                      تفاعل الطلاب
                    </h4>
                    <p className="text-slate-600 font-bold leading-relaxed">
                      هناك زيادة بنسبة{" "}
                      <span className="text-emerald-600">22%</span> في البحث عن
                      سكنات الطالبات هذا الأسبوع مقارنة بالشهر الماضي.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "pending" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="animate-in fade-in duration-700"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-4xl font-black text-slate-900">
                  طلبات <span className="text-primary">المراجعة</span>
                </h2>
                <div className="px-6 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-sm font-black">
                  {pendingListings.length} طلبات بانتظار قرارك
                </div>
              </div>

              <div className="space-y-6">
                {pendingListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white border border-slate-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row gap-8 hover:border-primary/50 transition-all group shadow-sm"
                  >
                    <div className="relative w-full md:w-64 h-48 rounded-[2rem] overflow-hidden shrink-0 border border-white/10 self-center group-hover:scale-[1.02] transition-transform duration-500">
                      <Image
                        src={listing.image}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      {listing.images && listing.images.length > 1 && (
                        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-black flex items-center gap-1">
                          <ImageIcon size={12} />+{listing.images.length - 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-2xl font-black text-slate-900 mb-1">
                              {listing.title}
                            </h4>
                            <p className="text-slate-600 font-bold flex items-center gap-2">
                              <MapPin size={16} className="text-primary" />{" "}
                              {listing.location}
                            </p>
                          </div>
                          <span
                            className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest ${
                              listing.category === "studentesses"
                                ? "bg-pink-600/10 text-pink-600"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {listing.category === "studentesses"
                              ? "FEMALE"
                              : "MALE"}
                          </span>
                        </div>
                        <p className="text-slate-600 font-bold line-clamp-2 leading-relaxed mb-6">
                          {listing.description}
                        </p>
                        <div className="flex gap-10 border-t border-slate-100 pt-6">
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                              صاحب العقار
                            </p>
                            <p className="text-slate-900 font-black">
                              {listing.ownerName}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                              التواصل
                            </p>
                            <p className="text-slate-900 font-black">
                              {listing.ownerPhone}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
                              السعر المعروض
                            </p>
                            <p className="text-primary text-xl font-black">
                              {listing.price} ₪
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-4 justify-center">
                      <button
                        onClick={() => handleApprove(listing.id)}
                        className="flex-1 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={20} />
                        موافقة
                      </button>
                      <button
                        onClick={() => handleReject(listing.id)}
                        className="flex-1 bg-slate-50 text-red-600 border border-red-200 px-8 py-4 rounded-2xl font-black transition-all hover:bg-red-50 flex items-center justify-center gap-2"
                      >
                        <XCircle size={20} />
                        رفض
                      </button>
                    </div>
                  </div>
                ))}
                {pendingListings.length === 0 && (
                  <div className="py-20 text-center opacity-30 flex flex-col items-center">
                    <CheckCircle2 size={64} className="mb-4 text-emerald-500" />
                    <p className="text-2xl font-black">
                      لا توجد طلبات معلقة حالياً
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === "listings" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="animate-in fade-in duration-700"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black text-slate-900">
                  إدارة <span className="text-primary">الوحدات السكنية</span>
                </h2>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                >
                  <PlusCircle size={24} />
                  إضافة وحدة جديدة
                </button>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {approvedListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="bg-white border border-slate-200 p-8 rounded-[3rem] flex items-center gap-8 hover:border-primary/40 transition-all group shadow-sm"
                  >
                    <div className="relative w-40 h-40 rounded-[2rem] overflow-hidden shrink-0 border border-white/10">
                      <Image
                        src={listing.image}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      {listing.images && listing.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-white text-[10px] font-black pointer-events-none">
                          +{listing.images.length - 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex flex-col h-full justify-between py-2">
                      <div>
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {listing.title}
                          </h4>
                          <span
                            className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                              listing.category === "studentesses"
                                ? "bg-pink-600/10 text-pink-600"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {listing.category === "studentesses"
                              ? "FEMALE"
                              : "MALE"}
                          </span>
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
                          <button
                            onClick={() => handleDelete(listing.id)}
                            className="px-6 py-3 bg-red-500/5 text-red-500 text-xs font-black rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {approvedListings.length === 0 && (
                  <div className="col-span-full py-20 text-center opacity-30">
                    <Search size={48} className="mx-auto mb-4" />
                    <p className="text-2xl font-black">
                      لا توجد نتائج تطابق بحثك
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
          {activeTab === "ads" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="animate-in fade-in duration-700"
            >
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-black text-slate-900">
                  إدارة <span className="text-primary">الإعلانات والبنرات</span>
                </h2>
                <button
                  onClick={() => setIsAddAdModalOpen(true)}
                  className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/30"
                >
                  <PlusCircle size={24} />
                  إضافة إعلان جديد
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {ads.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:border-primary/40 transition-all group shadow-sm flex flex-col justify-between"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={ad.imageUrl}
                        alt={ad.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md border ${
                            ad.isActive
                              ? "bg-emerald-500/90 text-white border-emerald-400/20"
                              : "bg-slate-500/90 text-white border-slate-400/20"
                          }`}
                        >
                          {ad.isActive ? "نشط" : "معطل"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div className="mb-6">
                        <h4 className="text-lg font-black text-slate-900 mb-2 line-clamp-2">
                          {ad.title}
                        </h4>
                        {ad.linkUrl && (
                          <p className="text-xs font-bold text-primary truncate">
                            الرابط: {ad.linkUrl}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleToggleAd(ad.id, ad.isActive)}
                          className={`flex-1 py-3 text-xs font-black rounded-xl transition-all border ${
                            ad.isActive
                              ? "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                              : "bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/20 hover:scale-102"
                          }`}
                        >
                          {ad.isActive ? "تعطيل" : "تفعيل"}
                        </button>
                        <button
                          onClick={() => handleDeleteAd(ad.id)}
                          className="px-4 py-3 bg-red-500/5 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/10"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {ads.length === 0 && (
                  <div className="col-span-full py-20 text-center opacity-30">
                    <Megaphone size={48} className="mx-auto mb-4" />
                    <p className="text-2xl font-black">لا توجد إعلانات حالياً</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {isAddAdModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddAdModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-[2.5rem] p-10 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center mb-8 bg-slate-50/50 p-2 rounded-xl">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <Megaphone className="text-primary animate-bounce" />
                  إضافة إعلان ترويجي جديد
                </h3>
                <button
                  onClick={() => setIsAddAdModalOpen(false)}
                  className="p-3 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleAddAd} className="space-y-6">
                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">العنوان الترويجي *</label>
                  <input
                    type="text"
                    required
                    value={adTitle}
                    onChange={(e) => setAdTitle(e.target.value)}
                    placeholder="مثال: خصم 15% للطلاب الجدد"
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold text-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">رابط صورة الإعلان *</label>
                  <input
                    type="url"
                    required
                    value={adImageUrl}
                    onChange={(e) => setAdImageUrl(e.target.value)}
                    placeholder="أدخل رابط صورة الإعلان"
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold text-slate-950"
                  />
                </div>

                <div>
                  <label className="block text-sm font-black text-slate-700 mb-2">رابط التوجيه عند النقر (اختياري)</label>
                  <input
                    type="text"
                    value={adLinkUrl}
                    onChange={(e) => setAdLinkUrl(e.target.value)}
                    placeholder="مثال: /students أو رابط خارجي"
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-bold text-slate-950"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsAddAdModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isAdSubmitting}
                    className="flex-1 py-4 bg-premium-gradient rounded-2xl font-black text-white hover:scale-102 transition-all shadow-xl shadow-primary/20"
                  >
                    {isAdSubmitting ? "جاري الإضافة..." : "حفظ ونشر الإعلان"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
