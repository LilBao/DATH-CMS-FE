import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl shadow-2xl shadow-black/20 flex justify-between items-center px-8 py-4 max-w-none">
      <div className="text-2xl font-black text-[#f5c948] tracking-tighter italic">
        CINEMA DIRECTOR’S CUT
      </div>
      <div className="hidden md:flex items-center space-x-10">
        <a
          className="font-headline tracking-widest uppercase text-sm font-bold text-[#f5c948] border-b-2 border-[#f5c948] pb-1"
          href="#"
        >
          Phim
        </a>
        <a
          className="font-headline tracking-widest uppercase text-sm font-bold text-[#e5e2e1] hover:text-[#f5c948] transition-colors"
          href="#"
        >
          Rạp
        </a>
        <a
          className="font-headline tracking-widest uppercase text-sm font-bold text-[#e5e2e1] hover:text-[#f5c948] transition-colors"
          href="#"
        >
          Khuyến mãi
        </a>
      </div>
      <div className="flex items-center space-x-6">
        <div className="relative group hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary w-64 transition-all"
            placeholder="Tìm tên phim..."
            type="text"
          />
        </div>
        <button className="relative group scale-95 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-primary text-2xl">
            shopping_cart
          </span>
          <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold px-1 rounded-full">
            2
          </span>
        </button>
        <Link
          href="/login"
          className="bg-primary text-on-primary px-6 py-2 rounded-full font-label font-bold text-sm tracking-wide hover:opacity-80 transition-all duration-300 scale-95 active:scale-90"
        >
          Đăng nhập
        </Link>
      </div>
    </nav>
  );
}
