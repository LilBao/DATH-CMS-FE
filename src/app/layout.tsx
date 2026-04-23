import type { Metadata } from "next";
import { Manrope, Inter } from "next/font/google";
import "./globals.css";
// Import Header và Footer từ thư mục components
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";

// Cấu hình Font chữ
const manrope = Manrope({
  subsets: ["latin", "vietnamese"],
  variable: "--font-manrope",
});

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cinema Director's Cut",
  description: "Trải nghiệm điện ảnh thượng lưu",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning giúp sửa cái lỗi đỏ lòm ở bước trước do Extension trình duyệt
    <html lang="vi" className="dark" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          }
        `}</style>
      </head>
      <body
        className={`${manrope.variable} ${inter.variable} font-body selection:bg-primary selection:text-on-primary bg-background text-on-background`}
      >
        {/* Đưa Header lên trên cùng */}
        <Header />

        {/* Nội dung trang chủ (từ page.tsx) sẽ được render vào đây */}
        {children}

        {/* Đưa Footer xuống dưới cùng */}
        <Footer />

        {/* Nút FAB chat góc phải dưới cùng */}
        <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
          <span className="material-symbols-outlined">chat_bubble</span>
        </button>
      </body>
    </html>
  );
}
