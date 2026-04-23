"use client";

import React, { useEffect, useState } from "react";
import { checkoutService } from "@/src/services/checkout.service";

export default function TicketHistory() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UPCOMING">("ALL");

  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);

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
    if (filter === "UPCOMING") return order.status === "UPCOMING";
    return true;
  });

  return (
    <section className="lg:col-span-9 relative">
      <div className="flex items-end justify-between mb-10">
        <h1 className="font-headline font-black text-4xl italic tracking-tighter text-white uppercase">
          Lịch sử đặt vé
        </h1>
        <div className="flex gap-4">
          <button
            onClick={() => setFilter("ALL")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-colors ${filter === "ALL" ? "bg-surface-container-high text-primary" : "border border-white/10 text-on-surface-variant hover:text-primary"}`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilter("UPCOMING")}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase transition-colors ${filter === "UPCOMING" ? "bg-surface-container-high text-primary" : "border border-white/10 text-on-surface-variant hover:text-primary"}`}
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
          filteredOrders.map((order, idx) => {
            const isUpcoming = order.status === "UPCOMING";

            return (
              <div
                key={idx}
                className={`group relative bg-surface-container-low rounded-xl overflow-hidden flex flex-col md:flex-row transition-all hover:bg-surface-container-high border border-white/5 ${!isUpcoming ? "opacity-80 grayscale-[0.5] hover:opacity-100 hover:grayscale-0" : ""}`}
              >
                <div className="w-full md:w-48 h-64 md:h-auto overflow-hidden flex-shrink-0">
                  <img
                    src={
                      order.moviePoster ||
                      "https://i.ibb.co/3pQG6qX/vip-cinema.jpg"
                    }
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
                            Đã chiếu
                          </span>
                        )}
                        <span className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">
                          {order.format || "2D Digital"}
                        </span>
                      </div>
                      <h3
                        className={`font-headline font-extrabold text-2xl uppercase tracking-tight ${isUpcoming ? "text-primary" : "text-white/80"}`}
                      >
                        {order.movieName || "Tên phim"}
                      </h3>
                      <p className="text-on-surface-variant mt-2 font-medium">
                        {order.cinemaName || "Rạp chiếu"}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs uppercase font-bold text-on-surface-variant block">
                        Ghế
                      </span>
                      <span className="text-xl font-headline font-black text-white">
                        {order.seats?.join(", ") || "A1"}
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
                          {order.date || "dd/mm/yyyy"}
                        </span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">
                          Giờ
                        </span>
                        <span className="text-base font-bold text-white">
                          {order.time || "HH:mm"}
                        </span>
                      </div>
                      {isUpcoming && (
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest block">
                            Tổng tiền
                          </span>
                          <span className="text-base font-black text-primary italic">
                            {(order.totalAmount || 0).toLocaleString("vi-VN")}đ
                          </span>
                        </div>
                      )}
                    </div>

                    {isUpcoming ? (
                      <button
                        onClick={() => setSelectedTicket(order)}
                        className="group/btn relative px-8 py-3 bg-gradient-to-r from-primary to-primary-container rounded-full text-on-primary font-label font-bold text-sm uppercase flex items-center gap-2 hover:shadow-[0_0_20px_rgba(245,201,72,0.4)] transition-all active:scale-95"
                      >
                        <span className="material-symbols-outlined text-lg">
                          qr_code_2
                        </span>{" "}
                        Xem vé
                      </button>
                    ) : (
                      <button className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-bold uppercase text-on-surface-variant hover:text-primary transition-colors">
                        Xem chi tiết
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL QR CODE */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#131313]/90 backdrop-blur-md transition-opacity">
          <div className="relative w-full max-w-md bg-surface-container-high rounded-xl overflow-hidden shadow-2xl border border-white/5 animate-in zoom-in duration-200">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-4 right-4 text-on-surface-variant hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-3xl">close</span>
            </button>
            <div className="p-8 text-center">
              <h4 className="font-headline font-black text-2xl text-primary uppercase tracking-tighter mb-1">
                {selectedTicket.movieName || "Tên phim"}
              </h4>
              <p className="text-on-surface-variant text-xs uppercase tracking-widest mb-8">
                {selectedTicket.cinemaName} - Suất {selectedTicket.time}
              </p>

              <div className="bg-white p-6 rounded-xl inline-block mb-8 shadow-[0_0_40px_rgba(245,201,72,0.2)]">
                <div className="w-48 h-48 bg-white relative flex items-center justify-center">
                  {/* Mã QR giả định - Nếu có thư viện gen QR thì nhúng vào đây */}
                  <span className="material-symbols-outlined text-black text-9xl">
                    qr_code_2
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-left">
                <div className="bg-surface p-4 rounded-lg text-center">
                  <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                    Mã đặt vé
                  </span>
                  <span className="text-3xl font-black font-headline tracking-[0.3em] text-white uppercase">
                    {selectedTicket.orderCode || "DC-X982L"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-surface/50 p-3 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Phòng chiếu
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {selectedTicket.roomName || "01"}
                    </span>
                  </div>
                  <div className="bg-surface/50 p-3 rounded-lg">
                    <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">
                      Ghế
                    </span>
                    <span className="text-lg font-bold text-primary">
                      {selectedTicket.seats?.join(", ") || "H12"}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-[10px] text-on-surface-variant uppercase tracking-widest leading-relaxed">
                Vui lòng xuất trình mã này tại quầy soát vé.
                <br />
                Chúc bạn có trải nghiệm điện ảnh tuyệt vời.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
