import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Thẻ main chiếm phần không gian còn lại, đẩy Footer xuống đáy nếu nội dung ngắn */}
      <main className="flex-grow relative pt-20">{children}</main>
      <Footer />

      {/* Nút Chat hiển thị chung cho toàn bộ web Customer */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all z-40">
        <span className="material-symbols-outlined">chat_bubble</span>
      </button>
    </div>
  );
}
