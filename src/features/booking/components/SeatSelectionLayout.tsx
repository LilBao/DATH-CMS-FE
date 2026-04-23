"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Seat, ShowtimeDetails } from "@/src/types/booking.type";

interface Props {
  timeId: string;
}

export default function SeatSelectionLayout({ timeId }: Props) {
  const router = useRouter();

  // States giả định cho UI (Sẽ thay bằng data thật từ API)
  const [showtime, setShowtime] = useState<ShowtimeDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  // TODO: Gọi API bookingService.getSeatsByShowtime(timeId) ở đây

  // MOCK DATA để test giao diện
  const rows = ["A", "B", "G", "H", "L"];
  const cols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const handleToggleSeat = (
    seatCode: string,
    type: string,
    price: number,
    isBooked: boolean,
  ) => {
    if (isBooked) return;

    const existingIndex = selectedSeats.findIndex(
      (s) => s.rowName + s.number === seatCode,
    );
    if (existingIndex >= 0) {
      // Bỏ chọn
      const newSeats = [...selectedSeats];
      newSeats.splice(existingIndex, 1);
      setSelectedSeats(newSeats);
    } else {
      // Thêm mới
      setSelectedSeats([
        ...selectedSeats,
        {
          seatId: Math.random(),
          rowName: seatCode.charAt(0),
          number: seatCode.slice(1),
          type: type as any,
          isBooked: false,
          price,
        },
      ]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  return (
    <div className="min-h-screen bg-background relative pb-32">
      {/* Top Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl shadow-2xl shadow-black/20 flex justify-between items-center px-8 py-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="text-on-surface hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-label uppercase tracking-widest text-xs font-bold">
              Quay lại
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="font-headline font-bold text-lg tracking-wide uppercase text-on-surface">
            KIẾN TẠO THẾ GIỚI
          </h2>
          <p className="text-[10px] text-on-surface-variant tracking-[0.2em] font-medium">
            DIRECTOR'S CUT QUẬN 1 • RẠP 01 • 19:30, Hôm nay
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
              Thời gian
            </span>
            <span className="text-primary font-headline font-extrabold text-xl">
              09:54
            </span>
          </div>
          <span className="material-symbols-outlined text-primary scale-125">
            timer
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Màn hình */}
        <div className="mb-20 text-center flex flex-col items-center">
          <div className="w-full max-w-3xl" style={{ perspective: "500px" }}>
            <div className="h-2 w-full bg-primary/40 rounded-full shadow-[0_0_40px_rgba(245,201,72,0.3)] transform rotateX(-45deg)"></div>
            <div className="h-24 w-full opacity-40 bg-gradient-to-b from-primary/20 to-transparent"></div>
            <p className="mt-4 text-[10px] font-label tracking-[0.5em] text-on-surface-variant uppercase">
              Màn Hình / Screen
            </p>
          </div>
        </div>

        {/* Lưới ghế */}
        <div className="flex flex-col items-center overflow-x-auto pb-8">
          <div
            className="grid gap-2 min-w-[700px]"
            style={{ gridTemplateColumns: "repeat(14, minmax(0, 1fr))" }}
          >
            {rows.map((row) => (
              <React.Fragment key={row}>
                <div className="flex items-center justify-center font-label text-xs text-on-surface-variant opacity-40">
                  {row}
                </div>

                {cols.map((col) => {
                  const seatCode = `${row}${col}`;
                  const isVIP = row === "G" || row === "H";
                  const isSweetbox = row === "L";
                  const isBooked = seatCode === "B2" || seatCode === "B3"; // Mock ghế đã bán
                  const isSelected = selectedSeats.some(
                    (s) => s.rowName + s.number === seatCode,
                  );
                  const price = isSweetbox ? 150000 : isVIP ? 120000 : 85000;

                  // Spacer tạo lối đi (sau cột 2 và cột 8)
                  const spacer =
                    col === 2 || col === 8 ? (
                      <div key={`space-${col}`} className="w-4"></div>
                    ) : null;

                  if (isSweetbox) {
                    // Sweetbox render logic (chiếm 2 cột)
                    if (col % 2 === 0) return spacer; // Chỉ render cột lẻ cho sweetbox
                    return (
                      <React.Fragment key={seatCode}>
                        <div
                          onClick={() =>
                            handleToggleSeat(
                              seatCode,
                              "SWEETBOX",
                              price,
                              isBooked,
                            )
                          }
                          className={`col-span-2 w-full h-8 rounded-sm flex items-center justify-center cursor-pointer transition-all ${
                            isSelected
                              ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(245,201,72,0.5)]"
                              : "bg-secondary-container/20 border border-secondary/40 hover:bg-secondary-container/40"
                          }`}
                          style={{ gridColumn: "span 2 / span 2" }}
                        >
                          <span
                            className={`text-[8px] font-bold mr-1 ${isSelected ? "text-on-primary" : "text-secondary/40"}`}
                          >
                            {seatCode}
                          </span>
                          <span
                            className={`material-symbols-outlined text-sm ${isSelected ? "text-on-primary" : "text-secondary"}`}
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            favorite
                          </span>
                        </div>
                        {spacer}
                      </React.Fragment>
                    );
                  }

                  return (
                    <React.Fragment key={seatCode}>
                      <div
                        onClick={() =>
                          handleToggleSeat(
                            seatCode,
                            isVIP ? "VIP" : "STANDARD",
                            price,
                            isBooked,
                          )
                        }
                        className={`w-8 h-8 rounded-sm flex items-center justify-center text-[8px] transition-all cursor-pointer ${
                          isBooked
                            ? "bg-surface opacity-20 cursor-not-allowed"
                            : isSelected
                              ? "bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(245,201,72,0.5)]"
                              : isVIP
                                ? "border border-primary/40 bg-surface-container-highest text-primary/60 hover:bg-primary/20"
                                : "bg-surface-container-highest text-on-surface-variant/60 hover:bg-surface-container-high"
                        }`}
                      >
                        {seatCode}
                      </div>
                      {spacer}
                    </React.Fragment>
                  );
                })}

                <div className="flex items-center justify-center font-label text-xs text-on-surface-variant opacity-40">
                  {row}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Bar Tích hợp */}
      <div className="fixed bottom-0 w-full bg-surface-container-low/90 backdrop-blur-2xl border-t border-white/5 z-40">
        <div className="max-w-7xl mx-auto px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-8 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Ghế đã chọn
              </span>
              <div className="flex gap-2 mt-1">
                {selectedSeats.length === 0 ? (
                  <span className="text-sm text-on-surface/50 italic">
                    Chưa chọn ghế
                  </span>
                ) : null}
                {selectedSeats.map((s) => (
                  <span
                    key={s.rowName + s.number}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/20"
                  >
                    {s.rowName}
                    {s.number}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-10 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Tổng thanh toán
              </span>
              <span className="text-2xl font-headline font-black text-primary tracking-tight">
                {totalPrice.toLocaleString("vi-VN")}{" "}
                <span className="text-xs font-medium">VNĐ</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary-container text-on-primary px-12 py-4 rounded-full font-label font-extrabold text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
              disabled={selectedSeats.length === 0}
            >
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
