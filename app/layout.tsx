import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سكني | منصة سكن الطلاب والطالبات",
  description: "المنصة الأولى لربط الطلاب بأصحاب العقارات في أرقى السكنات",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased font-almarai">
        {children}
      </body>
    </html>
  );
}
