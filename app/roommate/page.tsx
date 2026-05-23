"use client";

import { useState, useEffect, useMemo } from "react";
import { RoommatePost } from "@/data/mockData";
import { getRoommatePosts, addRoommatePost } from "@/lib/firestore-service";
import {
  Users,
  Search,
  PlusCircle,
  Phone,
  Calendar,
  MapPin,
  DollarSign,
  X,
  GraduationCap,
  BookOpen,
  Check,
  Compass,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

export default function RoommatePage() {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<RoommatePost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Advanced Filter states
  const [filterGender, setFilterGender] = useState<"all" | "male" | "female">("all");
  const [filterYear, setFilterYear] = useState<string>("all");
  const [filterBudget, setFilterBudget] = useState<string>("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");

  // Form states
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [title, setTitle] = useState("");
  const [preferredLocation, setPreferredLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [major, setMajor] = useState("");
  const [studyYear, setStudyYear] = useState<"first" | "second" | "third" | "fourth" | "graduate">("first");
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableHabits = [
    "غير مدخن 🚭",
    "ينام مبكراً 🛌",
    "بيئة هادئة 🤫",
    "منظم ومرتب ✨",
    "اجتماعي 🤝",
    "يحب الطبخ 🍳",
    "ملتزم دراسياً 📚",
  ];

  useEffect(() => {
    async function loadPosts() {
      setIsLoading(true);
      try {
        const data = await getRoommatePosts();
        setPosts(data);
      } catch (error) {
        console.error("Failed to load roommate posts:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPosts();
  }, []);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newPostData = {
        userName: fullName,
        userGender: gender,
        title,
        description,
        preferredLocation,
        priceRange: budget,
        contactPhone: phone,
        major,
        studyYear,
        habits: selectedHabits,
      };
      
      const newId = await addRoommatePost(newPostData);
      
      // Update local state immediately so user sees it
      const addedPost: RoommatePost = {
        id: newId,
        ...newPostData,
        date: new Date().toISOString().split("T")[0],
      };
      
      setPosts((prev) => [addedPost, ...prev]);
      
      // Reset form
      setFullName("");
      setGender("male");
      setTitle("");
      setPreferredLocation("");
      setBudget("");
      setPhone("");
      setDescription("");
      setMajor("");
      setStudyYear("first");
      setSelectedHabits([]);
      
      setIsPostModalOpen(false);
      alert("تم نشر طلبك لشراكة السكن بنجاح! 🎉");
    } catch (error) {
      console.error("Error submitting roommate post:", error);
      alert("حدث خطأ أثناء النشر. الرجاء المحاولة مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleHabitSelection = (habit: string) => {
    setSelectedHabits((prev) =>
      prev.includes(habit) ? prev.filter((h) => h !== habit) : [...prev, habit]
    );
  };

  const getYearLabel = (year?: string) => {
    switch (year) {
      case "first":
        return "سنة أولى 🎓";
      case "second":
        return "سنة ثانية 🎓";
      case "third":
        return "سنة ثالثة 🎓";
      case "fourth":
        return "سنة رابعة 🎓";
      case "graduate":
        return "دراسات عليا / خريج 🎓";
      default:
        return "طالب جامعي 🎓";
    }
  };

  // Live Multi-Criteria Filter logic
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      // 1. Text Search Query
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.preferredLocation.toLowerCase().includes(query) ||
        post.userName.toLowerCase().includes(query) ||
        (post.major && post.major.toLowerCase().includes(query));

      // 2. Gender Filter
      const matchesGender = filterGender === "all" || post.userGender === filterGender;

      // 3. Study Year Filter
      const matchesYear = filterYear === "all" || post.studyYear === filterYear;

      // 4. Location Filter (Popular Nablus Zones)
      const matchesLocation =
        filterLocation === "all" ||
        post.preferredLocation.toLowerCase().includes(filterLocation.toLowerCase());

      // 5. Budget Filter
      let matchesBudget = true;
      if (filterBudget !== "all") {
        const priceNum = parseInt(post.priceRange.replace(/\D/g, ""), 10);
        if (!isNaN(priceNum)) {
          if (filterBudget === "under-600") matchesBudget = priceNum < 600;
          else if (filterBudget === "600-800") matchesBudget = priceNum >= 600 && priceNum <= 800;
          else if (filterBudget === "800-1000") matchesBudget = priceNum > 800 && priceNum <= 1000;
          else if (filterBudget === "above-1000") matchesBudget = priceNum > 1000;
        }
      }

      return matchesSearch && matchesGender && matchesYear && matchesLocation && matchesBudget;
    });
  }, [posts, searchQuery, filterGender, filterYear, filterLocation, filterBudget]);

  return (
    <div className="min-h-screen bg-background pb-20 text-slate-900 dark:text-foreground">
      <Navbar />

      <main className="pt-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-12 animate-in fade-in duration-700">
          <div className="relative text-right">
            <div className="flex items-center gap-3 text-teal-600 dark:text-teal-500 font-black mb-4 group cursor-default">
              <Users
                size={24}
                className="group-hover:scale-110 transition-transform duration-500"
              />
              <span className="uppercase tracking-[0.3em] text-sm italic">
                Connect with Students
              </span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-foreground leading-none">
              شريك <span className="text-primary">السكن</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl text-lg mt-4 font-bold leading-relaxed">
              ابحث عن رفيق سكن مناسب في نابلس. منصة تفاعلية للطلاب لمشاركة الإيجار والتكاليف
              وتنسيق شروط العيش المشترك.
            </p>
          </div>

          <button
            onClick={() => setIsPostModalOpen(true)}
            className="bg-primary text-white px-10 py-5 rounded-[1.5rem] font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-primary/20"
          >
            <PlusCircle size={24} />
            أضف إعلانك لشراكة السكن
          </button>
        </div>

        {/* Search & Advanced Filters Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-border p-8 rounded-[2.5rem] shadow-sm mb-12">
          {/* Main search input */}
          <div className="relative mb-6 group">
            <Search
              className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors"
              size={24}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم، التخصص، أو الكلمات الدلالية..."
              className="w-full pr-16 pl-8 py-5 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-foreground placeholder:text-slate-400 focus:border-primary/50 outline-none transition-all font-bold text-lg"
            />
          </div>

          {/* Expanded filters selectors */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-right">
            {/* Filter Gender */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                الجنس المطلوب
              </label>
              <select
                value={filterGender}
                onChange={(e) => setFilterGender(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold text-sm"
              >
                <option value="all">الكل</option>
                <option value="male">طلاب (ذكور)</option>
                <option value="female">طالبات (إناث)</option>
              </select>
            </div>

            {/* Filter Study Year */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                السنة الدراسية
              </label>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold text-sm"
              >
                <option value="all">الكل</option>
                <option value="first">سنة أولى</option>
                <option value="second">سنة ثانية</option>
                <option value="third">سنة ثالثة</option>
                <option value="fourth">سنة رابعة</option>
                <option value="graduate">خريج / دراسات عليا</option>
              </select>
            </div>

            {/* Filter Location */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                المنطقة المفضلة
              </label>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold text-sm"
              >
                <option value="all">الكل</option>
                <option value="رفيديا">رفيديا</option>
                <option value="تونس">شارع تونس</option>
                <option value="الأكاديمية">الأكاديمية</option>
                <option value="المخفية">المخفية</option>
                <option value="الضاحية">الضاحية</option>
                <option value="الجبل الشمالي">الجبل الشمالي</option>
              </select>
            </div>

            {/* Filter Budget */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                نطاق الميزانية (شيكل)
              </label>
              <select
                value={filterBudget}
                onChange={(e) => setFilterBudget(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3.5 focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold text-sm"
              >
                <option value="all">الكل</option>
                <option value="under-600">أقل من 600 شيكل</option>
                <option value="600-800">600 - 800 شيكل</option>
                <option value="800-1000">800 - 1000 شيكل</option>
                <option value="above-1000">أكثر من 1000 شيكل</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold">جاري تحميل إعلانات رفقاء السكن...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredPosts.map((post, idx) => {
                const isFemale = post.userGender === "female";
                return (
                  <motion.div
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4, delay: idx * 0.03 }}
                    className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-border rounded-[3rem] p-8 hover:border-primary/40 dark:hover:border-primary/40 transition-all group shadow-sm flex flex-col justify-between ${isFemale ? "theme-pink" : ""}`}
                  >
                    <div>
                      {/* Top Gender & Date Header */}
                      <div className="flex justify-between items-center mb-6">
                        <div
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            isFemale ? "bg-pink-600/10 text-pink-600" : "bg-teal-600/10 text-teal-600"
                          }`}
                        >
                          {isFemale ? "طالبة (إناث)" : "طالب (ذكور)"}
                        </div>
                        <div className="text-slate-400 dark:text-slate-500 font-bold text-xs flex items-center gap-2">
                          <Calendar size={14} />
                          {post.date}
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-black text-slate-900 dark:text-foreground mb-3 group-hover:text-primary transition-colors text-right">
                        {post.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-400 font-bold leading-relaxed mb-6 line-clamp-3 text-right italic">
                        "{post.description}"
                      </p>

                      {/* Advanced Tags: Major & Study Year */}
                      <div className="flex flex-wrap gap-2 mb-6 justify-start flex-row-reverse">
                        {post.major && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300 rounded-lg">
                            <BookOpen size={12} className="text-primary" />
                            {post.major}
                          </span>
                        )}
                        {post.studyYear && (
                          <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-600 dark:text-slate-300 rounded-lg">
                            <GraduationCap size={12} className="text-primary" />
                            {getYearLabel(post.studyYear)}
                          </span>
                        )}
                      </div>

                      {/* Habits tags display */}
                      {post.habits && post.habits.length > 0 && (
                        <div className="mb-8 border-t border-slate-100 dark:border-border/50 pt-4 text-right">
                          <p className="text-[10px] font-black text-slate-400 mb-2.5">عادات وتفضيلات السكن:</p>
                          <div className="flex flex-wrap gap-1.5 justify-start flex-row-reverse">
                            {post.habits.map((habit, hIdx) => (
                              <span
                                key={hIdx}
                                className="px-2.5 py-1 text-[9px] font-bold border border-slate-200 dark:border-border text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950 rounded-full"
                              >
                                {habit}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      {/* Budget and Location Info */}
                      <div className="space-y-4 border-t border-slate-100 dark:border-border/50 pt-6 text-right">
                        <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-400 flex-row-reverse">
                          <span className="flex items-center gap-2">
                            <MapPin size={18} className="text-primary" />
                            الموقع المفضل:
                          </span>
                          <span className="text-slate-900 dark:text-foreground font-black">{post.preferredLocation}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm font-bold text-slate-600 dark:text-slate-400 flex-row-reverse">
                          <span className="flex items-center gap-2">
                            <DollarSign size={18} className="text-primary" />
                            الميزانية المتوقعة:
                          </span>
                          <span className="text-slate-900 dark:text-foreground font-black">{post.priceRange} شيكل</span>
                        </div>
                      </div>

                      {/* Contact and user info */}
                      <div className="mt-8 pt-6 flex items-center justify-between border-t border-slate-100 dark:border-border/50 flex-row-reverse">
                        <div className="flex items-center gap-4 flex-row-reverse text-right">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary uppercase text-xl">
                            {post.userName[0]}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-900 dark:text-foreground">
                              {post.userName}
                            </p>
                            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                              طالب زميل
                            </p>
                          </div>
                        </div>
                        <a
                          href={`tel:${post.contactPhone}`}
                          className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-primary/20"
                        >
                          <Phone size={20} />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredPosts.length === 0 && (
          <div className="py-40 text-center opacity-30 flex flex-col items-center">
            <Users size={80} className="mb-6 animate-pulse text-slate-400" />
            <p className="text-3xl font-black text-slate-900 dark:text-foreground">
              لا توجد طلبات شراكة تطابق خيارات الفلترة حالياً
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
                className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-border w-full max-w-2xl rounded-[3rem] p-8 md:p-10 shadow-2xl overflow-y-auto max-h-[90vh] text-right"
              >
                <div className="flex justify-between items-center mb-8 flex-row-reverse">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-foreground">
                    أضف طلب <span className="text-primary">شراكة سكن</span>
                  </h3>
                  <button
                    onClick={() => setIsPostModalOpen(false)}
                    className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-6" onSubmit={handlePostSubmit}>
                  {/* Name and Gender */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الاسم الكامل
                      </label>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="مثلاً: أحمد محمود"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الجنس
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as "male" | "female")}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold appearance-none"
                      >
                        <option value="male">ذكر</option>
                        <option value="female">أنثى</option>
                      </select>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                      عنوان الإعلان
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثلاً: أبحث عن شريك في شارع رفيديا"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                      required
                    />
                  </div>

                  {/* Major and Study Year */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        التخصص الدراسي
                      </label>
                      <input
                        type="text"
                        value={major}
                        onChange={(e) => setMajor(e.target.value)}
                        placeholder="مثلاً: هندسة برمجيات"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        السنة الدراسية
                      </label>
                      <select
                        value={studyYear}
                        onChange={(e) => setStudyYear(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                      >
                        <option value="first">سنة أولى</option>
                        <option value="second">سنة ثانية</option>
                        <option value="third">سنة ثالثة</option>
                        <option value="fourth">سنة رابعة</option>
                        <option value="graduate">خريج / دراسات عليا</option>
                      </select>
                    </div>
                  </div>

                  {/* Location & Budget */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الميزانية المتوقعة (شيكل شهرياً)
                      </label>
                      <input
                        type="text"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="مثلاً: 700"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                        الموقع المفضل
                      </label>
                      <input
                        type="text"
                        value={preferredLocation}
                        onChange={(e) => setPreferredLocation(e.target.value)}
                        placeholder="مثلاً: رفيديا / شارع تونس"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                      رقم الهاتف للتواصل
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="059xxxxxxx"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                      تفاصيل إضافية عن شروط السكن
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="اكتب قليلاً عن عاداتك اليومية والشروط التي تفضلها في شريكك..."
                      rows={3}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-right focus:border-primary text-slate-900 dark:text-foreground outline-none transition-all font-bold"
                      required
                    ></textarea>
                  </div>

                  {/* Habits Checklist */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 mr-2 uppercase tracking-widest">
                      حدد عاداتك وطباعك الشخصية (اختر ما ينطبق عليك)
                    </label>
                    <div className="flex flex-wrap gap-2.5 justify-start flex-row-reverse">
                      {availableHabits.map((habit) => {
                        const isSelected = selectedHabits.includes(habit);
                        return (
                          <button
                            key={habit}
                            type="button"
                            onClick={() => toggleHabitSelection(habit)}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-black rounded-xl border transition-all ${
                              isSelected
                                ? "bg-primary border-primary text-white shadow-md shadow-primary/20 scale-105"
                                : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                            }`}
                          >
                            {isSelected && <Check size={12} />}
                            {habit}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary py-6 rounded-2xl font-black text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all text-white disabled:opacity-50 flex items-center justify-center gap-2 mt-8"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        جاري النشر...
                      </>
                    ) : (
                      "نشر الإعلان الآن"
                    )}
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
