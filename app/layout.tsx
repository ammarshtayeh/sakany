import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سكنو | منصة سكن طلاب جامعة النجاح الوطنية في نابلس",
  description:
    "أول منصة فلسطينية متخصصة في توفير السكنات الطلابية الآمنة لطلاب وطالبات جامعة النجاح في نابلس. سكنات موثقة بالقرب من الحرم الجديد والقديم والأكاديمية.",
  keywords: [
    "سكن طلاب نابلس",
    "سكن طالبات نابلس",
    "جامعة النجاح",
    "سكن جامعة النجاح",
    "شقق للإيجار نابلس",
    "سكن طلابي فلسطين",
    "الحرم الجديد",
    "الحرم القديم",
    "رفيديا",
    "شارع تونس",
    "سكن آمن للطالبات",
    "استوديو للطلاب",
    "غرف للإيجار نابلس",
    "سكنو",
    "sakannu",
  ],
  authors: [{ name: "سكنو - Sakannu" }],
  creator: "عمار اشتية",
  publisher: "سكنو",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "سكنو",
  },
  openGraph: {
    type: "website",
    locale: "ar_PS",
    url: "https://sakannu.vercel.app",
    siteName: "سكنو - منصة سكن طلاب جامعة النجاح",
    title: "سكنو | منصة سكن طلاب جامعة النجاح الوطنية في نابلس",
    description:
      "أول منصة فلسطينية متخصصة في توفير السكنات الطلابية الآمنة لطلاب وطالبات جامعة النجاح. سكنات موثقة 100% في نابلس.",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "سكنو - منصة سكن طلاب جامعة النجاح",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "سكنو | منصة سكن طلاب جامعة النجاح الوطنية",
    description:
      "أول منصة فلسطينية متخصصة في توفير السكنات الطلابية الآمنة في نابلس",
    images: ["/images/hero.png"],
    creator: "@sakannu_ps",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code", // سيتم تحديثه لاحقاً
  },
};

export const viewport = {
  themeColor: "#3b82f6", // Updated to Blue to match new theme
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased font-almarai">{children}</body>
    </html>
  );
}
