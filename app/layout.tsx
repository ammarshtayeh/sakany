import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سكّني | منصة سكن الطلاب والطالبات",
  description: "المنصة الأولى لربط الطلاب بأصحاب العقارات في أرقى السكنات",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "سكّني",
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
