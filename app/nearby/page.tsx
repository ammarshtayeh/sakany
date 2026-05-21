"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  Phone, 
  Plus, 
  X, 
  Check, 
  Sparkles, 
  Store, 
  Users, 
  Award,
  ChevronLeft,
  Info,
  CheckCircle2
} from "lucide-react";
import { getNearbyServices, addNearbyService } from "@/lib/firestore-service";
import { NearbyService } from "@/data/mockData";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NearbyServicesPage() {
  const [services, setServices] = useState<NearbyService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState("restaurant");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDistance, setNewDistance] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [newDiscount, setNewDiscount] = useState("");
  const [newPackage, setNewPackage] = useState("basic");
  
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        const data = await getNearbyServices(true); // Fetch active and approved only
        setServices(data);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    }
    loadServices();
  }, []);

  const categories = [
    { id: "all", name: "الكل", icon: Store },
    { id: "restaurant", name: "مطاعم ومأكولات", icon: Store },
    { id: "cafe", name: "مقاهي وكافيهات", icon: Store },
    { id: "supermarket", name: "سوبرماركت ومواد غذائية", icon: Store },
    { id: "laundry", name: "مغاسل ودراي كلين", icon: Store },
    { id: "stationery", name: "مكتبات وقرطاسية", icon: Store },
    { id: "other", name: "خدمات أخرى", icon: Store },
  ];

  const packages = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: "50 ₪",
      period: "شهرياً",
      features: [
        "إدراج المحل في التصنيف المناسب",
        "عرض الوصف الأساسي والمسافة",
        "عرض رقم الهاتف للتواصل",
        "تحديث البيانات مرة واحدة شهرياً"
      ],
      color: "border-slate-200 bg-white text-slate-800",
      btnColor: "bg-slate-800 text-white hover:bg-slate-900"
    },
    {
      id: "silver",
      name: "الباقة الفضية (الأكثر طلباً)",
      price: "100 ₪",
      period: "شهرياً",
      popular: true,
      features: [
        "إدراج المحل مع شارة فضية مميزة",
        "عرض العروض الخاصة والخصومات للطلاب",
        "أزرار اتصال وتواصل واتساب مباشر",
        "إضافة موقع المحل الجغرافي بالتفصيل",
        "تحديث البيانات في أي وقت"
      ],
      color: "border-primary/50 bg-white ring-2 ring-primary/20 text-slate-800",
      btnColor: "bg-primary text-white hover:bg-primary/90"
    },
    {
      id: "gold",
      name: "الباقة الذهبية الممتازة",
      price: "180 ₪",
      period: "شهرياً",
      features: [
        "الظهور أولاً في نتائج البحث والتصنيفات",
        "شارة ذهبية براقة وكارت إعلان متميز",
        "بانر إعلاني متحرك في الصفحة الرئيسية للموقع",
        "إبراز الخصومات كعرض فائق الجاذبية للطلاب",
        "دعم فني مخصص وتقرير شهري للمشاهدات"
      ],
      color: "border-amber-400 bg-gradient-to-b from-amber-50/50 to-white text-slate-800",
      btnColor: "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/20"
    }
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (pkgId: string) => {
    setNewPackage(pkgId);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDescription || !newLocation) {
      alert("يرجى ملء الحقول الإلزامية");
      return;
    }
    setSubmitting(true);
    try {
      await addNearbyService({
        name: newName,
        category: newCategory as any,
        description: newDescription,
        imageUrl: newImageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        location: newLocation,
        distance: newDistance || undefined,
        phone: newPhone || undefined,
        whatsapp: newWhatsapp || undefined,
        discount: newDiscount || undefined,
        package: newPackage as any,
        isActive: false, // Default inactive
        isPending: true,  // Requires admin approval
      });
      
      setSubmitSuccess(true);
      
      // Reset form
      setNewName("");
      setNewDescription("");
      setNewImageUrl("");
      setNewLocation("");
      setNewDistance("");
      setNewPhone("");
      setNewWhatsapp("");
      setNewDiscount("");
      setIsModalOpen(false);
      
      // Hide success notification after 5s
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      console.error("Failed to submit ad request:", error);
      alert("حدث خطأ أثناء إرسال طلبك، يرجى المحاولة مجدداً.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-almarai relative overflow-hidden">
      {/* Top Background Blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse-slow"></div>
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-accent/5 rounded-full blur-[100px] -z-10 animate-pulse-slow-reverse"></div>
      
      <Navbar />

      <div className="h-32"></div> {/* Spacer for fixed Navbar */}

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        
        {/* Banner Success Notification */}
        <AnimatePresence>
          {submitSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-emerald-500 text-white rounded-3xl p-6 shadow-2xl mb-8 flex items-center justify-between gap-4 border border-emerald-400"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full text-white">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h4 className="text-lg font-black">تم إرسال طلب إعلانك بنجاح!</h4>
                  <p className="text-sm font-bold opacity-90">
                    يقوم الأدمن حالياً بمراجعة البيانات وتفعيل الإعلان. سنتواصل معك قريباً.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSubmitSuccess(false)}
                className="text-white hover:opacity-75 p-2"
              >
                <X size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SEO Hidden Content for indexing */}
        <h1 className="sr-only">الخدمات القريبة من سكنات طلاب جامعة النجاح في نابلس</h1>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-2">
              <Sparkles size={14} className="text-primary animate-spin" />
              دليل الخدمات الطلابية
            </span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 leading-tight"
          >
            المحلات والمطاعم <span className="text-primary">الخدمية القريبة</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-500 font-bold text-base sm:text-lg leading-relaxed"
          >
            اكتشف أفضل المطاعم، المقاهي، السوبرماركت، والمكتبات المجاورة لسكنك الجامعي في نابلس. استفد من خصومات الطلاب الحصرية المتاحة خصيصاً لمستخدمي منصة سكنو!
          </motion.p>
        </div>

        {/* Search & Category Filter Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2.5rem] p-6 shadow-xl mb-12 space-y-6"
        >
          {/* Search bar */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all group max-w-xl mx-auto shadow-sm">
            <Search size={22} className="text-slate-400 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مطعم، مغسلة، سوبرماركت، أو مكتبة..."
              className="bg-transparent border-none outline-none text-base w-full mr-4 text-slate-950 font-bold placeholder:text-slate-400"
              id="nearby-search-input"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-900 p-1 rounded-full hover:bg-slate-200"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Categories Tab Scroll */}
          <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none justify-start sm:justify-center">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-3 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]" 
                      : "bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60"
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Directory Listings Grid */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-black">جاري تحميل الخدمات القريبة...</p>
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
            >
              <AnimatePresence mode="popLayout">
                {filteredServices.map((service) => (
                  <motion.div
                    layout
                    key={service.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                    className={`bg-white border rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between ${
                      service.isFeatured 
                        ? "border-amber-400/50 shadow-md ring-4 ring-amber-400/5" 
                        : "border-slate-200/80 shadow-sm"
                    }`}
                  >
                    {/* Header Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-slate-100 shrink-0">
                      <img 
                        src={service.imageUrl} 
                        alt={service.name} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      
                      {/* Featured Badge */}
                      {service.isFeatured && (
                        <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-amber-400 animate-pulse">
                          <Sparkles size={12} />
                          إعلان مميز
                        </div>
                      )}

                      {/* Distance Badge */}
                      {service.distance && (
                        <div className="absolute bottom-4 right-4 bg-slate-900/70 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-xl flex items-center gap-1 border border-white/10">
                          <MapPin size={12} className="text-primary-300" />
                          {service.distance}
                        </div>
                      )}
                    </div>

                    {/* Content Section */}
                    <div className="p-8 flex-1 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-black text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">
                            {service.name}
                          </h3>
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-lg">
                            {categories.find(c => c.id === service.category)?.name || "خدمات"}
                          </span>
                        </div>
                        
                        <p className="text-slate-500 font-bold text-sm leading-relaxed line-clamp-3">
                          {service.description}
                        </p>

                        {/* Special Student Offer Badge */}
                        {service.discount && (
                          <div className="bg-amber-500/10 border border-amber-400/20 text-amber-600 rounded-2xl p-4 flex items-center gap-3 relative overflow-hidden group/offer">
                            <div className="bg-amber-500 text-white p-2 rounded-xl scale-100 group-hover/offer:scale-110 transition-transform">
                              <Sparkles size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-0.5">عرض الطلاب الحصري 🎁</p>
                              <p className="text-xs font-black text-slate-800 leading-tight">{service.discount}</p>
                            </div>
                          </div>
                        )}

                        {/* Location Text */}
                        <p className="text-xs font-bold text-slate-400 flex items-center gap-2">
                          <MapPin size={14} className="text-slate-300 shrink-0" />
                          {service.location}
                        </p>
                      </div>

                      {/* Contact Buttons */}
                      <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100">
                        {service.phone && (
                          <a 
                            href={`tel:${service.phone}`}
                            className="flex-1 py-3.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                          >
                            <Phone size={14} />
                            اتصال
                          </a>
                        )}
                        {service.whatsapp && (
                          <a 
                            href={`https://wa.me/${service.whatsapp.replace('+', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.835-4.577c1.59.943 3.197 1.441 4.95 1.442 5.421 0 9.83-4.385 9.834-9.782.002-2.614-1.013-5.074-2.859-6.924C16.92 2.31 14.456 1.29 11.85 1.29c-5.426 0-9.835 4.386-9.839 9.783-.002 1.832.486 3.62 1.411 5.187l-1.018 3.717 3.824-.997.864.507zm11.366-5.409c-.312-.156-1.848-.912-2.128-1.013-.281-.101-.485-.156-.687.156-.202.311-.78.983-.956 1.187-.176.203-.352.229-.664.072-1.125-.563-1.921-.99-2.684-2.302-.19-.328.19-.304.545-1.013.06-.115.03-.217-.015-.318-.045-.101-.485-1.173-.664-1.603-.175-.42-.377-.362-.518-.362-.134-.007-.29-.007-.446-.007-.156 0-.411.058-.627.29-.216.233-.827.809-.827 1.971 0 1.162.846 2.285.964 2.443.117.158 1.664 2.547 4.032 3.568.563.243.999.387 1.341.497.565.179 1.079.154 1.485.094.453-.067 1.848-.756 2.11-.1.262-.646.262-1.205.187-1.306-.075-.101-.281-.156-.593-.312z"/>
                            </svg>
                            واتساب
                          </a>
                        )}
                      </div>
                      </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredServices.length === 0 && (
                <div className="col-span-full py-28 text-center bg-white border border-slate-200 rounded-[2.5rem] p-10 shadow-sm flex flex-col items-center justify-center">
                  <div className="bg-slate-50 p-6 rounded-full border border-slate-100 text-slate-400 mb-4">
                    <Store size={48} />
                  </div>
                  <h4 className="text-xl font-black text-slate-800 mb-2">لا توجد خدمات مطابقة حالياً</h4>
                  <p className="text-slate-400 font-bold max-w-sm leading-relaxed">
                    جرب تغيير كلمة البحث أو فئة التصنيف، أو أرسل طلباً لضم محلك التجاري.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}

        {/* Call to Action for Advertisers (أعلن معنا) */}
        <div className="border-t border-slate-200 pt-24 mt-12">
          
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <span className="px-4 py-1.5 bg-accent/10 text-accent border border-accent/20 rounded-full text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5">
              <Award size={14} className="text-accent" />
              لأصحاب المحلات التجارية والمطاعم
            </span>
            <h3 className="text-3xl font-black text-slate-900">
              روّج لأعمالك واستهدف آلاف الطلاب معنا
            </h3>
            <p className="text-slate-500 font-bold text-sm sm:text-base leading-relaxed">
              منصة سكنو هي الوجهة الأولى لطلاب وطالبات جامعة النجاح للبحث عن سكن. أعلن عن خدماتك هنا لتصل للطلاب مباشرة وتزيد من مبيعاتك من خلال تقديم خصومات مميزة.
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            {[
              { label: "زيارة شهرية نشطة", value: "+10,000", desc: "تفاعل مباشر ومكثف من الطلاب", icon: Users, color: "text-blue-500 bg-blue-50" },
              { label: "سكن طلابي مسجل", value: "+300", desc: "شبكة واسعة تغطي كل نابلس", icon: Store, color: "text-emerald-500 bg-emerald-50" },
              { label: "زيادة بمعدل الوصول", value: "x4", desc: "استهداف مباشر في المحيط الجامعي", icon: Sparkles, color: "text-amber-500 bg-amber-50" }
            ].map((stat, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 p-6 rounded-2xl flex items-center gap-5 shadow-sm">
                <div className={`p-4 rounded-xl shrink-0 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mb-0.5">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 font-bold">{stat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {packages.map((pkg) => (
              <div 
                key={pkg.id}
                className={`border rounded-[2.5rem] p-8 shadow-md flex flex-col justify-between relative overflow-hidden group/pkg hover:shadow-xl transition-all duration-300 ${pkg.color}`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 left-0 bg-primary text-white text-[10px] font-black px-6 py-2 rounded-br-2xl shadow-md border-b border-r border-primary/20">
                    موصى به
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-black text-slate-900 mb-4">{pkg.name}</h4>
                  
                  <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                    <span className="text-4xl font-black text-slate-900">{pkg.price}</span>
                    <span className="text-slate-400 text-xs font-bold">/ {pkg.period}</span>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex flex-row-reverse items-start gap-3 text-right">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                          <Check size={12} className="stroke-[3]" />
                        </div>
                        <span className="text-slate-600 font-bold text-xs flex-1">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => handleOpenModal(pkg.id)}
                  className={`w-full py-4 rounded-xl font-black text-sm transition-all cursor-pointer group-hover/pkg:scale-[1.02] ${pkg.btnColor}`}
                >
                  اشترك في الباقة الآن
                </button>
              </div>
            ))}
          </div>

          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 flex items-center justify-center gap-2">
              <Info size={14} className="text-slate-300" />
              للاستفسارات الخاصة أو الحملات الإعلانية الكبيرة، يرجى التواصل مباشرة مع إدارة سكنو هاتفياً.
            </p>
          </div>
        </div>

      </div>

      {/* Advertising Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">
                    تقديم طلب إعلان <span className="text-primary">محل / خدمة</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mt-1">
                    املأ البيانات التالية وسيقوم الأدمن بمراجعتها ونشرها بعد الدفع.
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-slate-500 hover:text-slate-900"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">اسم المحل / الخدمة التجاري *</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="مثال: مطعم شاورما النجاح"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">نوع النشاط التجاري *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900 appearance-none"
                    >
                      <option value="restaurant">مطعم ومأكولات</option>
                      <option value="cafe">مقهى وكافيه</option>
                      <option value="supermarket">سوبرماركت ومواد غذائية</option>
                      <option value="laundry">مغسلة ودراي كلين</option>
                      <option value="stationery">مكتبة وقرطاسية</option>
                      <option value="other">خدمات أخرى</option>
                    </select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 mr-1">وصف موجز عن المحل والخدمات *</label>
                  <textarea
                    required
                    rows={3}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="اكتب ما يقدمه المحل والوجبات أو العروض المتوفرة..."
                    className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">العنوان بالتفصيل *</label>
                    <input
                      type="text"
                      required
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      placeholder="مثال: نابلس، شارع الأكاديمية - بجانب المسجد"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    />
                  </div>

                  {/* Distance */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">المسافة عن الجامعة (اختياري)</label>
                    <input
                      type="text"
                      value={newDistance}
                      onChange={(e) => setNewDistance(e.target.value)}
                      placeholder="مثال: 100 متر من الحرم الجديد"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">رقم الهاتف للتواصل *</label>
                    <input
                      type="tel"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="مثال: 0599000000"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900 text-left"
                    />
                  </div>

                  {/* Whatsapp */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">رقم الواتساب مع رمز الدولة (اختياري)</label>
                    <input
                      type="text"
                      value={newWhatsapp}
                      onChange={(e) => setNewWhatsapp(e.target.value)}
                      placeholder="مثال: +970599000000"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900 text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Discount */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">العرض أو الخصم الخاص بالطلاب (اختياري)</label>
                    <input
                      type="text"
                      value={newDiscount}
                      onChange={(e) => setNewDiscount(e.target.value)}
                      placeholder="مثال: خصم 15% على الوجبات الكبيرة"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="space-y-2">
                    <label className="block text-xs font-black text-slate-700 mr-1">رابط صورة واجهة المحل أو اللوجو</label>
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="أدخل رابط صورة مباشر (أو اتركه فارغاً لافتراضية)"
                      className="w-full px-5 py-4 border border-slate-200 rounded-2xl bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-bold text-slate-900"
                    />
                  </div>
                </div>

                {/* Selected Package Display */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">الباقة الإعلانية المحددة</span>
                    <span className="text-base font-black text-slate-800">
                      {newPackage === "basic" && "الباقة الأساسية (50 ₪)"}
                      {newPackage === "silver" && "الباقة الفضية (100 ₪)"}
                      {newPackage === "gold" && "الباقة الذهبية الممتازة (180 ₪)"}
                    </span>
                  </div>
                  <select 
                    value={newPackage} 
                    onChange={(e) => setNewPackage(e.target.value)}
                    className="px-4 py-2 border border-slate-200 bg-white rounded-xl text-xs font-black text-slate-700"
                  >
                    <option value="basic">أساسية</option>
                    <option value="silver">فضية</option>
                    <option value="gold">ذهبية</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 border border-slate-200 rounded-2xl font-black text-slate-500 hover:bg-slate-50 transition-all cursor-pointer text-sm"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-4 bg-premium-gradient rounded-2xl font-black text-white hover:scale-[1.01] active:scale-[0.99] transition-all shadow-xl shadow-primary/20 cursor-pointer text-sm"
                  >
                    {submitting ? "جاري إرسال الطلب..." : "تقديم طلب الإعلان"}
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
