"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import { setTokens } from "@/src/lib/token";
import { useUserStore } from "@/src/store/userStore";
import { UserProfile } from "@/src/types/user.type";
import Link from "next/link";

export default function LoginForm() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [provider, setProvider] = useState("LOCAL");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password, provider });

      if (response && response.data && response.data.accessToken) {
        setTokens(response.data.accessToken, response.data.refreshToken);
        setUser(response.data.user as unknown as UserProfile);
        router.push("/");
        router.refresh();
      } else {
        setError("Email hoặc mật khẩu không chính xác.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Đã có lỗi xảy ra khi kết nối máy chủ.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-10 rounded-3xl w-full max-w-md border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-black text-primary tracking-tighter italic uppercase">
          Đăng Nhập
        </h2>
        <p className="text-on-surface-variant text-sm mt-2">
          Trở lại với trải nghiệm điện ảnh thượng lưu
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="nhapemail@domain.com"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
              Mật khẩu
            </label>
            <a href="#" className="text-xs text-primary hover:underline">
              Quên mật khẩu?
            </a>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-on-primary py-4 rounded-full font-label font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 mt-4"
        >
          {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-on-surface-variant">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-primary font-bold hover:underline"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
