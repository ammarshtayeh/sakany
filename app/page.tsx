import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Users,
  ShieldCheck,
  Phone,
  Mail,
  Instagram,
  MapPin,
  ArrowRight,
  UserPlus,
  GraduationCap,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { mockListings } from "@/data/mockData";
import ListingCard from "@/components/ListingCard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section
        id="hero"
        className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-primary text-xs font-bold mb-6 border border-orange-500/20">
                <GraduationCap size={14} />
                <span>المنصة المعتمدة لطلاب جامعة النجاح الوطنية - نابلس</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-black leading-tight mb-6 text-slate-900 text-balance">
                استأجر سكنك في <br />
                <span className="text-gradient">نابلس</span> بضغطة زر
              </h1>
              <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto lg:mr-0 leading-relaxed font-bold">
                سكّني هي أول منصة فلسطينية متخصصة في توفير السكنات الطلابية
                الآمنة لطلاب جامعة النجاح. نوفر لك خيارات متنوعة بالقرب من الحرم
                الجديد، الحرم القديم، والأكاديمية.
              </p>
              <div className="flex flex-col sm:row gap-4 justify-center lg:justify-start">
                <Link
                  href="/students"
                  className="bg-premium-gradient text-white px-8 py-4 rounded-xl text-lg font-black shadow-2xl shadow-primary/20 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                  تصفح السكنات المتاحة
                  <ArrowRight size={20} />
                </Link>
                <Link
                  href="/owner/submit"
                  className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-xl text-lg font-black hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  عرض عقارك للطلاب
                  <UserPlus size={20} />
                </Link>
              </div>

              <div className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 text-slate-500">
                <div className="flex flex-col items-center lg:items-end">
                  <span className="text-2xl font-bold">500+</span>
                  <span className="text-xs uppercase tracking-tighter">
                    طالب نجاح
                  </span>
                </div>
                <div className="w-px h-8 bg-slate-200"></div>
                <div className="flex flex-col items-center lg:items-end">
                  <span className="text-2xl font-bold">120+</span>
                  <span className="text-xs uppercase tracking-tighter">
                    عقار في نابلس
                  </span>
                </div>
              </div>
            </div>

            <div className="relative lg:h-[650px] md:h-[500px] h-[350px] rounded-[2rem] lg:rounded-[3rem] overflow-hidden shadow-2xl border border-white/5">
              <Image
                src="/images/hero.png"
                alt="Modern Student Housing in Nablus"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 right-4 left-4 md:bottom-8 md:right-8 md:left-8 glass p-6 md:p-8 rounded-2xl md:rounded-3xl border border-white/10">
                <div className="flex items-center gap-4 md:gap-5">
                  <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/40">
                    <ShieldCheck size={24} className="md:w-8 md:h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-slate-800">
                      سكنات موثقة 100%
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600">
                      فريقنا يقوم بمعاينة كل سكن في نابلس قبل عرضه
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16 lg:mb-20">
            <h2 className="text-4xl lg:text-6xl font-black mb-6 text-slate-900 tracking-tight">
              أقسام السكن في{" "}
              <span className="text-gradient underline decoration-primary/10 underline-offset-8">
                نابلس
              </span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg px-4 font-bold">
              سواء كنت تدرس في الحرم الجديد أو القديم، سكّني توفر لك المسكن
              الأقرب لكليتك بأسعار منافسة وبالشيكل.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-10 px-4 sm:px-0">
            {/* Men's Housing */}
            <div className="group relative rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-primary/30 transition-all duration-500 p-2">
              <div className="h-80 relative overflow-hidden rounded-[2.5rem]">
                <div className="absolute top-6 left-6 z-20 bg-orange-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-2xl flex items-center gap-2">
                  <Users size={16} />
                  سكن الشباب
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800"
                  alt="سكن طلاب نابلس"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-4 text-slate-900">
                  طلاب جامعة النجاح
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-bold">
                  سكنات بالقرب من الحرم الجديد (شارع تونس والأكاديمية) والحرم
                  القديم، بخدمات متنوعة وتجهيزات كاملة.
                </p>
                <Link
                  href="/students"
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:bg-primary hover:border-primary transition-all text-slate-900 hover:text-white font-black text-lg group/btn shadow-sm"
                >
                  عرض السكنات المتاحة
                  <ArrowRight
                    size={24}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Women's Housing */}
            <div className="group relative rounded-[3rem] overflow-hidden border border-white/5 bg-slate-900/50 hover:bg-slate-900 hover:border-pink-500/30 transition-all duration-500 p-2">
              <div className="h-80 relative overflow-hidden rounded-[2.5rem]">
                <div className="absolute top-6 left-6 z-20 bg-pink-600 text-white px-5 py-2 rounded-xl text-sm font-black shadow-2xl flex items-center gap-2">
                  <Users size={16} />
                  سكن الطالبات
                </div>
                <Image
                  src="https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&q=80&w=800"
                  alt="سكن طالبات نابلس"
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60"></div>
              </div>
              <div className="p-8">
                <h3 className="text-3xl font-black mb-4 text-slate-900">
                  طالبات جامعة النجاح
                </h3>
                <p className="text-slate-600 mb-8 leading-relaxed font-bold">
                  بيئة آمنة في أرقى مناطق نابلس (رفيديا والمخفية)، نوفر لك
                  الخصوصية التامة مع خدمات النقل والصيانة.
                </p>
                <Link
                  href="/studentesses"
                  className="w-full flex items-center justify-between p-5 rounded-2xl border border-slate-200 bg-white hover:bg-pink-600 hover:border-pink-600 transition-all text-slate-900 hover:text-white font-black text-lg group/btn shadow-sm"
                >
                  عرض السكنات المتاحة
                  <ArrowRight
                    size={24}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section id="featured" className="py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-right">
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                أحدث <span className="text-gradient">السكنات</span> المضافة
              </h2>
              <p className="text-slate-500 font-bold text-sm md:text-base">
                استعرض مجموعة من أفضل الخيارات المتاحة حالياً في مدينة نابلس
              </p>
            </div>
            <Link
              href="/students"
              className="group flex items-center gap-3 text-primary font-black text-lg hover:text-primary-700 transition-colors"
            >
              عرض الكل
              <ArrowRight
                size={24}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockListings
              .filter((l) => !l.isPending)
              .slice(0, 3)
              .map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
          </div>
        </div>
      </section>

      {/* Property Owner Section - RESTORED */}
      <section id="owner-contact" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right"></div>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 relative z-10">
          <div className="bg-white border border-slate-200 rounded-[4rem] p-10 md:p-20 shadow-xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-all duration-700"></div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black mb-8 border border-primary/20">
                  <Building2 size={16} />
                  <span>خاص بأصحاب العقارات في نابلس</span>
                </div>
                <h2 className="text-3xl md:text-6xl font-black text-slate-900 mb-6 md:mb-8 leading-tight">
                  هل تملك عقاراً وتريد{" "}
                  <span className="text-gradient">تأجيره؟</span>
                </h2>
                <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-12 font-bold">
                  انضم لأكبر منصة سكن طلابي في نابلس. نحن نربطك مباشرة بآلاف
                  الطلاب من جامعة النجاح ونقوم بتسويق عقارك بأفضل صورة احترافية.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link
                    href="https://wa.me/970590000000"
                    className="bg-premium-gradient text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-center"
                  >
                    عرض سكنك الآن
                    <ArrowRight size={24} />
                  </Link>
                  <Link
                    href="/owner/submit"
                    className="bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-black text-xl hover:bg-slate-50 transition-all flex items-center justify-center gap-3 text-center shadow-sm"
                  >
                    دخول لوحة التحكم
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <Users size={24} />
                      </div>
                      <h4 className="text-slate-900 font-black text-lg mb-2">
                        جمهورك جاهز
                      </h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        آلاف الطلاب يبحثون يومياً عن سكنات جامعة النجاح
                      </p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all sm:translate-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="text-slate-900 font-black text-lg mb-2">
                        إدارة احترافية
                      </h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        تحكم كامل في صور ومواصفات وأسعار عقاراتك
                      </p>
                    </div>
                  </div>
                  <div className="space-y-6 mt-12">
                    <div className="bg-premium-gradient p-8 rounded-[2.5rem] shadow-2xl">
                      <h4 className="text-white font-black text-3xl mb-2">
                        100%
                      </h4>
                      <p className="text-white/80 text-sm font-black uppercase tracking-tighter">
                        نسبة إشغال سنوية
                      </p>
                    </div>
                    <div className="bg-white border border-slate-200 p-8 rounded-[2.5rem] hover:border-primary/30 transition-all sm:-translate-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
                        <Building2 size={24} />
                      </div>
                      <h4 className="text-slate-900 font-black text-lg mb-2">
                        توثيق العقار
                      </h4>
                      <p className="text-slate-500 text-sm font-bold leading-relaxed">
                        نقوم بمعاينة عقارك وتجهيزه للتصوير والعرض
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white py-24 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                  <Building2 size={32} />
                </div>
                <span className="text-3xl font-black text-slate-900">
                  سكّني
                </span>
              </div>
              <p className="text-slate-500 max-w-sm mb-10 leading-relaxed text-lg">
                منصة فلسطينية رائدة تهدف لتسهيل حياة الطلاب الدراسية في مدينة
                نابلس من خلال توفير سكنات تليق بهم.
              </p>
              <div className="flex gap-4">
                {[Instagram, Phone, Mail].map((Icon, idx) => (
                  <Link
                    key={idx}
                    href="#"
                    className="w-12 h-12 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                  >
                    <Icon size={22} />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-slate-900 uppercase tracking-wider">
                جامعة النجاح
              </h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    الحرم الجديد
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    الحرم القديم
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    المجمع الطبي
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-slate-500 hover:text-primary transition-colors font-bold"
                  >
                    الأكاديمية
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-8 text-slate-900 uppercase tracking-wider">
                تواصل معنا
              </h4>
              <ul className="space-y-6 text-slate-600 font-bold">
                <li className="flex items-center gap-4 text-sm">
                  <MapPin size={20} className="text-primary" /> فلسطين، نابلس،
                  شارع رفيديا الرئيسي
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Phone size={20} className="text-primary" /> 9720595537190
                </li>
                <li className="flex items-center gap-4 text-sm">
                  <Mail size={20} className="text-primary" />{" "}
                  ammar.shtayeh@gmail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 text-center text-sm text-slate-500 font-bold">
            <p>
              © {new Date().getFullYear()} جميع الحقوق محفوظة لمنصة سكّني
              وصاحبها عمار اشتية - نابلس، فلسطين
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
