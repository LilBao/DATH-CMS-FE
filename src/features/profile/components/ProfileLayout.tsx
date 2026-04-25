"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { userService } from "@/src/services/user.service";
import { checkoutService } from "@/src/services/checkout.service";
import { UserProfile } from "@/src/types/user.type";
import TicketHistory from "./TicketHistory";
import { toast } from "sonner";

export default function ProfileLayout() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"INFO" | "HISTORY">("INFO");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [calculatedPoints, setCalculatedPoints] = useState<number>(0);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    dob: "",
    gender: "MALE",
  });

  // Form States (Mật khẩu)
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        const [profileRes, historyRes] = await Promise.all([
          userService.getProfile(),
          checkoutService.getOrderHistory(),
        ]);

        if (profileRes.success && profileRes.data) {
          setProfile(profileRes.data);
          setFormData({
            fullName: profileRes.data.fullName || "",
            phone: profileRes.data.phone || "",
            dob: profileRes.data.dob || "",
            gender: profileRes.data.gender || "MALE",
          });
        }

        if (historyRes.success && historyRes.data) {
          const orders = historyRes.data;

          const totalSpent = orders.reduce((sum, order) => {
            if (order.orderStatus !== "CANCELED") {
              return sum + (order.total || 0);
            }
            return sum;
          }, 0);

          const points = Math.floor(totalSpent / 1000);
          setCalculatedPoints(points);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu Profile:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await userService.updateProfile(formData);

      if (passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          toast.error("Mật khẩu xác nhận không khớp!");
          setIsSaving(false);
          return;
        }
        await userService.changePassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        });

        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }

      toast.success("Cập nhật thông tin thành công!");
    } catch (error: any) {
      toast.error(
        error?.message || "Cập nhật thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const targetPoints = 5000;
  const progressPercent = Math.min(
    (calculatedPoints / targetPoints) * 100,
    100,
  );
  const pointsNeeded = Math.max(targetPoints - calculatedPoints, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="pt-32 pb-20 px-4 md:px-12 max-w-7xl mx-auto min-h-screen bg-background text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* ================================== */}
        {/* SIDEBAR TÁP VỤ & ĐIỂM THƯỞNG       */}
        {/* ================================== */}
        <aside className="lg:col-span-3 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 shadow-xl">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center text-3xl font-black text-primary ring-4 ring-primary/20 uppercase shadow-lg shadow-primary/10">
                  {profile?.fullName?.charAt(0) || "U"}
                </div>
                <div className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-on-primary shadow-lg">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    edit
                  </span>
                </div>
              </div>
              <h2 className="font-headline font-bold text-xl text-white uppercase tracking-tight">
                {profile?.fullName}
              </h2>
              <p className="text-on-surface-variant text-sm mt-1">
                {calculatedPoints >= targetPoints
                  ? "Premium Director"
                  : "Thành viên Tiêu chuẩn"}
              </p>
            </div>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("INFO")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${activeTab === "INFO" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "INFO" ? "'FILL' 1" : "",
                  }}
                >
                  person
                </span>
                <span className="font-label font-bold text-sm uppercase tracking-wider">
                  Thông tin cá nhân
                </span>
              </button>

              <button
                onClick={() => setActiveTab("HISTORY")}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all group ${activeTab === "HISTORY" ? "bg-primary-container text-on-primary-container" : "text-on-surface-variant hover:bg-surface-container-high"}`}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings:
                      activeTab === "HISTORY" ? "'FILL' 1" : "",
                  }}
                >
                  history
                </span>
                <span className="font-label font-bold text-sm uppercase tracking-wider">
                  Lịch sử đặt vé
                </span>
              </button>
            </nav>
          </div>

          {/* HIỂN THỊ ĐIỂM THƯỞNG DỰA TRÊN TỔNG TIỀN ĐÃ CHI */}
          <div className="bg-primary/5 p-6 rounded-xl border border-primary/10 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div className="flex justify-between items-end mb-2 relative z-10">
              <span className="text-xs uppercase font-bold tracking-widest text-primary">
                Director's Points
              </span>
              <span className="text-3xl font-black font-headline text-primary italic drop-shadow-md">
                {calculatedPoints.toLocaleString("vi-VN")}
              </span>
            </div>
            <div className="h-1.5 bg-surface-variant rounded-full overflow-hidden relative z-10 mt-4">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary-fixed shadow-[0_0_10px_rgba(245,201,72,0.8)] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-3 text-center uppercase tracking-tighter relative z-10 font-medium">
              {calculatedPoints >= targetPoints
                ? "Bạn đã đạt mức hạng cao nhất!"
                : `Bạn còn ${pointsNeeded.toLocaleString("vi-VN")} điểm để lên hạng Premium`}
            </p>
          </div>
        </aside>

        {/* ================================== */}
        {/* NỘI DUNG CHÍNH (Đổi tab tự động)   */}
        {/* ================================== */}
        {activeTab === "INFO" ? (
          <section className="lg:col-span-9 animate-in fade-in duration-300">
            <h1 className="font-headline font-black text-4xl italic tracking-tighter text-white uppercase mb-10">
              Thông tin cá nhân
            </h1>

            <form onSubmit={handleSave} className="space-y-12">
              {/* Box 1: Thông tin cơ bản */}
              <div className="bg-surface-container-low p-8 rounded-xl space-y-8 border border-white/5 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Họ và tên
                    </label>
                    <input
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all font-medium"
                      placeholder="Nhập họ và tên"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Email (Không thể đổi)
                    </label>
                    <input
                      disabled
                      value={profile?.email || ""}
                      className="w-full bg-surface-container-high/50 border-none rounded-lg px-4 py-3 text-on-surface-variant cursor-not-allowed font-medium"
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Số điện thoại
                    </label>
                    <input
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all font-medium"
                      placeholder="Nhập số điện thoại"
                      type="tel"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Ngày sinh
                    </label>
                    <input
                      required
                      value={formData.dob}
                      onChange={(e) =>
                        setFormData({ ...formData, dob: e.target.value })
                      }
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all font-medium [color-scheme:dark]"
                      type="date"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                    Giới tính
                  </label>
                  <div className="flex flex-wrap gap-8">
                    {["MALE", "FEMALE", "OTHER"].map((gender) => (
                      <label
                        key={gender}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="radio"
                          value={gender}
                          checked={formData.gender === gender}
                          onChange={(e) =>
                            setFormData({ ...formData, gender: e.target.value })
                          }
                          className="w-5 h-5 text-primary bg-surface-container-high border-none focus:ring-offset-0 focus:ring-1 focus:ring-primary"
                        />
                        <span className="text-sm font-bold text-on-surface-variant group-hover:text-white transition-colors">
                          {gender === "MALE"
                            ? "Nam"
                            : gender === "FEMALE"
                              ? "Nữ"
                              : "Khác"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box 2: Thay đổi mật khẩu */}
              <div className="bg-surface-container-low p-8 rounded-xl border border-white/5 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                <h3 className="font-headline font-extrabold text-xl uppercase tracking-tight text-primary mb-8 relative z-10">
                  Thay đổi mật khẩu
                </h3>
                <p className="text-xs text-on-surface-variant mb-6 -mt-4 relative z-10">
                  Bỏ trống nếu bạn không muốn thay đổi mật khẩu.
                </p>

                <div className="space-y-6 max-w-md relative z-10">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      value={passwordData.oldPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          oldPassword: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all font-medium"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Mật khẩu mới
                    </label>
                    <input
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all font-medium"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full bg-surface-container-high border-none rounded-lg px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all font-medium"
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </div>
              </div>

              {/* Nút thao tác */}
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <button
                  disabled={isSaving}
                  type="submit"
                  className="w-full sm:w-auto px-12 py-4 bg-primary text-on-primary rounded-full font-label font-black text-sm uppercase tracking-widest hover:shadow-[0_0_25px_rgba(245,201,72,0.4)] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "ĐANG LƯU..." : "LƯU THAY ĐỔI"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <TicketHistory />
        )}
      </div>
    </main>
  );
}
