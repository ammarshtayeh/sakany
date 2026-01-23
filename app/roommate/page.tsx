"use client";

import { useState } from "react";
import { mockRoommatePosts } from "@/data/mockData";
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  X,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function RoommatePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = mockRoommatePosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.preferredLocation
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      post.userName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-16 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="relative">
            <div className="flex items-center gap-3 text-emerald-500 font-black mb-4 group cursor-default">
              <Users
                size={24}
                className="group-hover:scale-110 transition-transform duration-500"
              />
              <span className="uppercase tracking-[0.3em] text-sm italic">
                Connect with Students
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-tight">
              شريك <span className="text-accent">السكن</span>
            </h1>
            <p className="text-slate-600 max-w-xl text-lg mt-4 font-bold leading-relaxed">
              ابحث عن رفيق سكن مناسب في نابلس. سوق للطلاب لمشاركة التكاليف
              وتوفير بيئة دراسية مريحة.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="bg-accent text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-accent/20"
          >
            <PlusCircle size={24} />
            أضف إعلانك
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-16 group">
          <Search
            className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-accent transition-colors"
            size={24}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن زملاء (منطقة رفيديا، تونس...)"
            className="w-full pr-16 pl-8 py-6 rounded-[2rem] border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:border-accent/50 focus:ring-4 focus:ring-accent/5 outline-none transition-all font-bold text-lg shadow-sm"
          />
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white border border-slate-200 rounded-[3rem] p-8 hover:border-accent/30 transition-all group shadow-sm"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${post.userGender === "male" ? "bg-blue-600/20 text-blue-400" : "bg-pink-600/20 text-pink-400"}`}
                  >
                    {post.userGender === "male"
                      ? "Male Student"
                      : "Female Student"}
                  </div>
                  <div className="text-slate-700 font-bold text-xs flex items-center gap-2">
                    <Calendar size={14} />
                    {post.date}
                  </div>
                </div>

                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 font-bold leading-relaxed mb-8 line-clamp-3 italic">
                  "{post.description}"
                </p>

                <div className="space-y-4 border-t border-white/5 pt-8">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <MapPin size={18} className="text-accent" />
                    {post.preferredLocation}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600">
                    <DollarSign size={18} className="text-accent" />
                    ميزانية: {post.priceRange}
                  </div>
                </div>

                <div className="mt-10 pt-6 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-slate-900 uppercase text-xl">
                      {post.userName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900">
                        {post.userName}
                      </p>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        Student
                      </p>
                    </div>
                  </div>
                  <a
                    href={`tel:${post.contactPhone}`}
                    className="w-12 h-12 rounded-2xl bg-accent text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-accent/20"
                  >
                    <Phone size={20} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="py-40 text-center opacity-20 flex flex-col items-center">
            <Users size={80} className="mb-6 animate-pulse text-slate-400" />
            <p className="text-3xl font-black text-slate-900">
              لا توجد إعلانات تطابق بحثك حالياً
            </p>
          </div>
        )}

        {/* Post Modal */}
        <AnimatePresence>
          {isPostModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsPostModalOpen(false)}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-white border border-slate-200 w-full max-w-2xl rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-black text-slate-900">
                    أضف طلب <span className="text-accent">شراكة سكن</span>
                  </h3>
                  <button
                    onClick={() => setIsPostModalOpen(false)}
                    className="p-3 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors text-slate-500"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form
                  className="space-y-6"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsPostModalOpen(false);
                    alert("تم النشر بنجاح! سيتم فحص طلبك.");
                  }}
                >
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        placeholder="مثلاً: أحمد محمود"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-accent text-slate-900 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الجنس
                      </label>
                      <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-accent text-slate-900 outline-none transition-all font-bold appearance-none">
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                      عنوان الإعلان
                    </label>
                    <input
                      type="text"
                      placeholder="مثلاً: أبحث عن شريك في شارع رفيديا"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-accent text-slate-900 outline-none transition-all font-bold"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الميزانية (شيكل)
                      </label>
                      <input
                        type="text"
                        placeholder="مثلاً: 500-800"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-accent text-slate-900 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        رقم الهاتف
                      </label>
                      <input
                        type="tel"
                        placeholder="059xxxxxxx"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-accent text-slate-900 outline-none transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                      تفاصيل إضافية
                    </label>
                    <textarea
                      placeholder="اكتب قليلاً عن نفسك وما تبحث عنه..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:border-accent text-slate-900 outline-none transition-all font-bold"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent py-6 rounded-2xl font-black text-xl shadow-2xl shadow-accent/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-white"
                  >
                    نشر الإعلان الآن
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
