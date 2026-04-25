"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAccessToken, removeTokens } from "@/src/lib/token";
import { authService } from "@/src/services/auth.service";
import { User } from "@/src/types/auth.type";

export default function Header() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Kiểm tra đăng nhập khi Component được mount
  useEffect(() => {
    setIsMounted(true);

    const fetchUser = async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const response = await authService.getMe();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          removeTokens();
        }
      } catch (error) {
        console.error("Lỗi xác thực:", error);
        removeTokens();
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    removeTokens();
    setUser(null);
    router.push("/login");
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl shadow-2xl shadow-black/20 flex justify-between items-center px-8 py-4 max-w-none">
      {/* 1. Logo */}
      <Link
        href="/"
        className="text-2xl font-black text-[#f5c948] tracking-tighter italic"
      >
        CMS
      </Link>

      {/* 2. Menu Điều Hướng */}
      <div className="hidden md:flex items-center space-x-10">
        <Link
          className="font-headline tracking-widest uppercase text-sm font-bold text-[#f5c948] border-b-2 border-[#f5c948] pb-1"
          href="/"
        >
          Phim
        </Link>
        <Link
          className="font-headline tracking-widest uppercase text-sm font-bold text-[#e5e2e1] hover:text-[#f5c948] transition-colors"
          href="#"
        >
          Rạp
        </Link>
        <Link
          className="font-headline tracking-widest uppercase text-sm font-bold text-[#e5e2e1] hover:text-[#f5c948] transition-colors"
          href="#"
        >
          Khuyến mãi
        </Link>
      </div>

      {/* 3. Tiện ích & Nút Đăng Nhập / Dropdown */}
      <div className="flex items-center space-x-6">
        {/* Khung tìm kiếm */}
        <div className="relative group hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="bg-surface-container-high border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-1 focus:ring-primary w-64 transition-all text-white placeholder:text-on-surface-variant/50"
            placeholder="Tìm tên phim..."
            type="text"
          />
        </div>

        {/* Nút Giỏ hàng / Thông báo (Chỉ hiện trang trí) */}
        <button className="relative group scale-95 active:scale-90 transition-transform">
          <span className="material-symbols-outlined text-primary text-2xl">
            notifications
          </span>
          {user && (
            <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary text-[10px] font-bold px-1 rounded-full">
              1
            </span>
          )}
        </button>

        {/* LOGIC HIỂN THỊ USER / NÚT ĐĂNG NHẬP */}
        <div className="min-w-[120px] flex justify-end">
          {!isMounted ? (
            <div className="w-28 h-9 bg-surface-container-high rounded-full animate-pulse"></div>
          ) : user ? (
            <div className="relative group">
              <button className="flex items-center gap-2 bg-surface-container-high px-4 py-2 rounded-full border border-white/5 hover:border-primary/30 transition-colors">
                <span className="material-symbols-outlined text-primary text-xl">
                  account_circle
                </span>
                <span className="font-label text-sm font-bold text-white max-w-[100px] truncate">
                  {user.fullName}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant text-sm group-hover:rotate-180 transition-transform">
                  expand_more
                </span>
              </button>

              {/* Khung Dropdown */}
              <div className="absolute right-0 mt-3 w-56 bg-surface-container-low border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right translate-y-2 group-hover:translate-y-0 flex flex-col overflow-hidden py-2">
                <div className="px-4 py-3 border-b border-white/5 mb-1">
                  <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                    Tài khoản
                  </p>
                  <p className="text-sm font-bold text-primary truncate">
                    {user.email}
                  </p>
                </div>

                <Link
                  href="/history"
                  className="px-4 py-3 text-sm text-white hover:bg-primary/10 hover:text-primary flex items-center gap-3 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    receipt_long
                  </span>{" "}
                  Lịch sử giao dịch
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-3 transition-colors text-left w-full"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    logout
                  </span>{" "}
                  Đăng xuất
                </button>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-primary text-on-primary px-6 py-2 rounded-full font-label font-bold text-sm tracking-wide hover:opacity-80 transition-all duration-300 scale-95 active:scale-90 flex items-center gap-2"
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
