"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/src/services/auth.service";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    gender: "MALE",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError("Mật khẩu xác nhận không khớp!");
    }

    setIsLoading(true);
    setError("");

    try {
      const { confirmPassword, ...payload } = formData;
      const response = await authService.register(payload);

      if (response && response.success !== false) {
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        router.push("/login");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Lỗi đăng ký. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-10 rounded-3xl w-full max-w-xl border border-white/10 shadow-2xl my-10">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-headline font-black text-primary tracking-tighter italic uppercase">
          Đăng Ký Thành Viên
        </h2>
        <p className="text-on-surface-variant text-sm mt-2">
          Nhận ngay ưu đãi đặc quyền từ Director's Club
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form
        onSubmit={handleRegister}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Họ và Tên
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="email@domain.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Xác nhận MK
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Số điện thoại
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            placeholder="090xxxxxxx"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">
            Ngày sinh & Giới tính
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              required
              className="w-2/3 bg-surface-container-high border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-1/3 bg-surface-container-high border border-white/5 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            >
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="md:col-span-2 w-full bg-primary text-on-primary py-4 rounded-full font-label font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 mt-4"
        >
          {isLoading ? "Đang xử lý..." : "Đăng Ký"}
        </button>
      </form>

      <div className="mt-8 text-center text-sm text-on-surface-variant">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary font-bold hover:underline">
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}
