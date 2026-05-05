"use client";

import React, { useEffect, useState } from "react";
import { checkoutService } from "@/src/services/checkout.service";
import { PaymentDetailResponse } from "@/src/types/checkout.type";
import { useUserStore } from "@/src/store/userStore";

export default function PaymentHistory() {
  const { user } = useUserStore();
  const [payments, setPayments] = useState<PaymentDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await checkoutService.getPaymentHistory();
        if (res.success) {
          const sortedData = [...res.data].sort(
            (a, b) =>
              new Date(b.paymentTime).getTime() -
              new Date(a.paymentTime).getTime()
          );
          setPayments(sortedData);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử thanh toán:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filteredPayments = payments.filter(
    (p) =>
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.orderId.toString().includes(searchTerm)
  );

  const totalSpent = payments.reduce((acc, p) => acc + (p.paymentStatus === "COMPLETED" ? p.amount : 0), 0);
  const successCount = payments.filter(p => p.paymentStatus === "COMPLETED").length;

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return {
          label: "Thành công",
          color: "text-green-400 bg-green-400/10 border-green-400/20",
          icon: "check_circle"
        };
      case "FAILED":
        return {
          label: "Thất bại",
          color: "text-red-400 bg-red-400/10 border-red-400/20",
          icon: "cancel"
        };
      case "PENDING":
        return {
          label: "Đang chờ",
          color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
          icon: "pending"
        };
      default:
        return {
          label: status,
          color: "text-on-surface-variant bg-surface-container-highest border-white/5",
          icon: "help"
        };
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toUpperCase()) {
      case "VNPAY": return "payments";
      case "MOMO": return "account_balance_wallet";
      case "STRIPE": return "credit_card";
      default: return "receipt_long";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-surface-container-low rounded-2xl border border-white/5"></div>
          ))}
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 w-full bg-surface-container-low rounded-2xl border border-white/5"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 lg:col-span-9">
      {/* 1. Dashboard Thống kê */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-primary/10 transition-colors"></div>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 px-1">Tổng chi tiêu</p>
          <h3 className="text-3xl font-black font-headline text-primary italic tracking-tight">
            {totalSpent.toLocaleString("vi-VN")}đ
          </h3>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-green-400 font-bold bg-green-400/10 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            TỔNG TÍCH LŨY
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-blue-400/10 transition-colors"></div>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 px-1">Giao dịch thành công</p>
          <h3 className="text-3xl font-black font-headline text-white italic tracking-tight">
            {successCount} <span className="text-sm not-italic font-medium text-on-surface-variant">/ {payments.length}</span>
          </h3>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-blue-400 font-bold bg-blue-400/10 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-xs">verified</span>
            UY TÍN THÀNH VIÊN
          </div>
        </div>

        <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-purple-400/10 transition-colors"></div>
          <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 px-1">Hạng thành viên</p>
          <h3 className="text-3xl font-black font-headline text-purple-400 italic tracking-tight uppercase">
            {user?.rank || user?.membership?.rank || "Standard"}
          </h3>
          <div className="flex items-center gap-2 mt-4 text-[10px] text-purple-400 font-bold bg-purple-400/10 w-fit px-2 py-1 rounded">
            <span className="material-symbols-outlined text-xs">workspace_premium</span>
            ƯU ĐÃI ĐẶC QUYỀN
          </div>
        </div>
      </section>

      {/* 2. Thanh tìm kiếm & Lọc */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <h2 className="font-headline font-black text-2xl italic tracking-tighter text-white uppercase px-1">
          Lịch sử giao dịch
        </h2>
        <div className="relative w-full md:w-96 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            search
          </span>
          <input
            type="text"
            placeholder="Tìm mã giao dịch, đơn hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-low border border-white/5 rounded-full py-3.5 pl-12 pr-6 text-sm text-white focus:ring-1 focus:ring-primary focus:border-primary/50 transition-all outline-none shadow-lg placeholder:text-on-surface-variant/50"
          />
        </div>
      </div>

      {/* 3. Danh sách Giao dịch */}
      {payments.length === 0 ? (
        <div className="bg-surface-container-low rounded-3xl p-20 text-center border border-dashed border-white/10 flex flex-col items-center">
          <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mb-6 shadow-2xl">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/50">receipt_long</span>
          </div>
          <h4 className="text-xl font-bold text-white mb-2">Chưa có giao dịch</h4>
          <p className="text-on-surface-variant max-w-xs mx-auto text-sm">
            Bạn chưa thực hiện giao dịch nào. Hãy bắt đầu đặt vé ngay để nhận ưu đãi!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPayments.map((p) => {
            const status = getStatusConfig(p.paymentStatus);
            return (
              <div
                key={p.paymentId}
                className="group bg-surface-container-low p-6 rounded-2xl border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(245,201,72,0.05)] flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                <div className="flex items-center gap-6">
                  {/* Icon Phương thức */}
                  <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-all duration-500 shadow-inner">
                    <span className="material-symbols-outlined text-2xl">
                      {getPaymentMethodIcon(p.paymentMethod)}
                    </span>
                  </div>

                  {/* Thông tin chính */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-black text-white italic text-lg tracking-tight">
                        #{p.orderId}
                      </span>
                      <span className="text-[10px] bg-primary/10 text-primary px-2.5 py-1 rounded font-black uppercase tracking-widest border border-primary/20">
                        {p.paymentMethod}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface-variant text-xs font-medium">
                      <span className="material-symbols-outlined text-xs">fingerprint</span>
                      <span className="truncate max-w-[150px] uppercase">{p.transactionId || "No Transaction ID"}</span>
                    </div>
                  </div>
                </div>

                {/* Thời gian & Số tiền */}
                <div className="flex items-center justify-between md:justify-end flex-grow gap-12">
                  <div className="text-right space-y-1">
                    <p className="text-xs text-on-surface-variant font-bold flex items-center justify-end gap-2">
                      <span className="material-symbols-outlined text-xs">calendar_today</span>
                      {new Date(p.paymentTime).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="text-2xl font-black font-headline text-primary italic drop-shadow-sm">
                      {p.amount.toLocaleString("vi-VN")}đ
                    </p>
                  </div>

                  {/* Trạng thái Badge */}
                  <div
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest shadow-sm ${status.color}`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {status.icon}
                    </span>
                    {status.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
