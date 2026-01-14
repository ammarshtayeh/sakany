import Link from 'next/link';
import { Building2, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-4">
      <Navbar />
      <div className="relative">
        <h1 className="text-[12rem] md:text-[20rem] font-black text-white/5 leading-none">404</h1>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="bg-premium-gradient p-4 rounded-3xl text-white shadow-2xl shadow-primary/40 mb-8 animate-bounce">
                <Building2 size={64} />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">عذراً، الصفحة غير موجودة</h2>
            <p className="text-slate-400 text-lg md:text-xl max-w-md mb-12 font-bold">
                يبدو أنك سلكت طريقاً خاطئاً، السكن الذي تبحث عنه قد تم حجز أو انتقل لعنوان آخر.
            </p>
            <Link 
                href="/" 
                className="btn-primary flex items-center gap-3 text-xl px-12 py-5"
            >
                <Home size={24} />
                العودة للرئيسية
            </Link>
        </div>
      </div>
    </div>
  );
}
