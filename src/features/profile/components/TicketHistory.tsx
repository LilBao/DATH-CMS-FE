"use client";

import React, { useEffect, useState } from "react";
import { checkoutService } from "@/src/services/checkout.service";
import { OrderResponse } from "@/src/types/checkout.type";

export default function TicketHistory() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING">("ALL");

  const [selectedOrder, setSelectedOrder] = useState<OrderResponse | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await checkoutService.getOrderHistory();
        if (res.success && res.data) {
          setOrders(res.data);
        }
      } catch (error) {
        console.error("Lỗi tải lịch sử vé:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (filter === "UPCOMING") return order.orderStatus === "UPCOMING";
    return true;
  });

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <section className="lg:col-span-9 relative">
      <div className="flex items-end justify-between mb-10">
        <h1 className="font-headline font-black text-4xl italic tracking-tighter text-white uppercase">
          Lịch sử đặt vé
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-colors ${
              filter === "ALL"
                ? "bg-surface-container-high text-primary"
                : "border border-white/10 text-on-surface-variant hover:text-primary"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-colors ${
              filter === "UPCOMING"
                ? "bg-surface-container-high text-primary"
                : "border border-white/10 text-on-surface-variant hover:text-primary"
            }`}
          >
            Sắp chiếu
          </button>
        </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-primary py-10">
            Đang tải lịch sử vé...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-on-surface-variant bg-surface-container-low p-10 rounded-xl border border-white/5">
            Bạn chưa có vé nào trong mục này.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isUpcoming = order.orderStatus === "UPCOMING";
            const firstTicket = order.ticketDetails?.[0];
            const seats = order.ticketDetails?.map((t) => t.seatName).join(", ");

            return (
              <div
                key={order.orderId}
                onClick={() => setSelectedOrder(order)}
                className={`group cursor-pointer relative bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row transition-all hover:bg-surface-container-high border border-white/5 ${
                  !isUpcoming ? "opacity-80 grayscale-[0.5] hover:opacity-100 hover:grayscale-0" : ""
                }`}
              >
                <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src="https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg"
                    alt="Movie Poster"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex-1 p-8 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        {isUpcoming ? (
                          <span className="px-3 py-0.5 bg-primary text-on-primary text-[10px] font-black rounded uppercase tracking-widest">
                            Sắp chiếu
                          </span>
                        ) : (
                          <span className="px-3 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-black rounded uppercase tracking-widest">
                            {order.orderStatus === "PAID" ? "Đã thanh toán" : order.orderStatus}
                          </span>
                        )}
                        <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                          2D Digital
                        </span>
                      </div>
                      <h3
                        className={`font-headline font-extrabold text-2xl uppercase tracking-tight ${
                          isUpcoming ? "text-primary" : "text-white/80"
                        }`}
                      >
                        {firstTicket?.movieName || "Đơn hàng #" + order.orderId}
                      </h3>
                      <p className="text-on-surface-variant mt-2 font-medium">
                        {firstTicket?.branchName || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-bold text-on-surface-variant block">
                        Ghế
                      </span>
                      <span className="text-xl font-headline font-black text-white">
                        {seats || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-10">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">
                          Ngày
                        </span>
                        <span className="text-base font-bold text-white">
                          {firstTicket ? formatDate(firstTicket.showtime) : formatDate(order.orderTime)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">
                          Giờ
                        </span>
                        <span className="text-base font-bold text-white">
                          {firstTicket ? formatTime(firstTicket.showtime) : formatTime(order.orderTime)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">
                          Tổng tiền
                        </span>
                        <span className="text-base font-black text-primary italic">
                          {(order.total || 0).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>

                    <button
                      className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase transition-colors ${
                        isUpcoming
                          ? "bg-primary text-on-primary hover:shadow-[0_0_20px_rgba(245,201,72,0.4)]"
                          : "border border-white/10 text-on-surface-variant hover:text-primary"
                      }`}
                    >
                      {isUpcoming ? "Xem vé" : "Chi tiết"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131313]/95 backdrop-blur-xl transition-opacity">
          <div className="relative w-full max-w-2xl bg-surface-container-high rounded-2xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in duration-200">
            {/* Header */}
            <div className="bg-surface-container-highest p-6 flex justify-between items-center border-b border-white/5">
              <div>
                <h4 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter">
                  Chi tiết đơn hàng
                </h4>
                <p className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">
                  Mã đơn: #{selectedOrder.orderId} • {formatDate(selectedOrder.orderTime)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Tickets Section */}
              {selectedOrder.ticketDetails?.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">confirmation_number</span>
                    <h5 className="text-sm font-black uppercase tracking-widest text-white">Vé xem phim</h5>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-surface-container-low p-5 rounded-xl border border-white/5">
                      <h6 className="font-headline font-bold text-xl text-primary uppercase mb-1">
                        {selectedOrder.ticketDetails[0].movieName}
                      </h6>
                      <p className="text-on-surface-variant text-xs mb-4">
                        {selectedOrder.ticketDetails[0].branchName} • {selectedOrder.ticketDetails[0].screenRoomName}
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface p-3 rounded-lg">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Suất chiếu</span>
                          <span className="text-sm font-bold text-white">
                            {formatTime(selectedOrder.ticketDetails[0].showtime)} - {formatDate(selectedOrder.ticketDetails[0].showtime)}
                          </span>
                        </div>
                        <div className="bg-surface p-3 rounded-lg">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Ghế</span>
                          <span className="text-sm font-bold text-white">
                            {selectedOrder.ticketDetails.map(t => t.seatName).join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Addons Section */}
              {selectedOrder.addonDetails?.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">fastfood</span>
                    <h5 className="text-sm font-black uppercase tracking-widest text-white">Bắp nước & Phụ kiện</h5>
                  </div>
                  <div className="bg-surface-container-low rounded-xl border border-white/5 divide-y divide-white/5">
                    {selectedOrder.addonDetails.map((addon, i) => (
                      <div key={i} className="p-4 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-white">{addon.pName}</p>
                          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Số lượng: {addon.quantity}</p>
                        </div>
                        <p className="text-sm font-black text-primary">
                          {(addon.price * addon.quantity).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Summary */}
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs text-on-surface-variant uppercase font-bold">
                    <span>Tạm tính</span>
                    <span>{selectedOrder.originalTotal.toLocaleString("vi-VN")}đ</span>
                  </div>
                  {selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-xs text-secondary uppercase font-bold">
                      <span>Giảm giá</span>
                      <span>-{selectedOrder.discountAmount.toLocaleString("vi-VN")}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-2 border-t border-white/5">
                    <span className="text-sm font-black uppercase text-white">Tổng cộng</span>
                    <span className="text-2xl font-black text-primary italic">
                      {selectedOrder.total.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-on-surface-variant uppercase font-bold">
                  <span className="material-symbols-outlined text-xs">payments</span>
                  Thanh toán qua: {selectedOrder.paymentMethod}
                </div>
              </div>

              {/* QR Code Placeholder for tickets */}
              {selectedOrder.orderStatus === "UPCOMING" && (
                <div className="mt-8 text-center">
                  <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-[0_0_30px_rgba(245,201,72,0.15)]">
                    <span className="material-symbols-outlined text-black text-8xl">qr_code_2</span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest leading-relaxed">
                    Vui lòng quét mã này tại quầy để nhận vé.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
