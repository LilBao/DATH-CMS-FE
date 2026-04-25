"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "@/src/services/booking.service";
import { Seat, ShowtimeDetails, SeatType } from "@/src/types/booking.type";

interface Props {
  timeId: string;
}

export default function SeatSelectionLayout({ timeId }: Props) {
  const router = useRouter();

  const [showtime, setShowtime] = useState<ShowtimeDetails | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  // State lưu ghế user đang chọn
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        setLoading(true);
        const [showtimeRes, seatsRes] = await Promise.all([
          bookingService.getShowtimeDetails(timeId),
          bookingService.getSeatsByShowtime(timeId),
        ]);

        if (showtimeRes.success) setShowtime(showtimeRes.data);
        if (seatsRes.success) {
          // Mapping dữ liệu từ BE sang FE format
          const mappedSeats = seatsRes.data.map((beSeat: any) => {
            const rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const rowName = rowLetters[beSeat.sRow - 1] || `R${beSeat.sRow}`;
            const number = beSeat.sColumn.toString();

            // Mapping sType (Tạm giả định: 1: STANDARD, 2: VIP, 3: SWEETBOX)
            let type: SeatType = "STANDARD";
            let price = 60000;
            if (beSeat.sType === 2) {
              type = "VIP";
              price = 90000;
            } else if (beSeat.sType === 3) {
              type = "SWEETBOX";
              price = 150000;
            }

            return {
              ...beSeat,
              rowName,
              number,
              type,
              price,
              sStatus: beSeat.sStatus,
            };
          });
          setSeats(mappedSeats);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu phòng chiếu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, [timeId]);

  // Hàm xử lý khi bấm vào 1 ghế
  const handleToggleSeat = (seat: Seat) => {
    if (seat.isBooked || seat.sStatus === false) return; // Không cho click ghế đã bán hoặc bị hỏng

    const existingIndex = selectedSeats.findIndex(
      (s) => s.sRow === seat.sRow && s.sColumn === seat.sColumn,
    );
    if (existingIndex >= 0) {
      // Bỏ chọn
      const newSeats = [...selectedSeats];
      newSeats.splice(existingIndex, 1);
      setSelectedSeats(newSeats);
    } else {
      // Thêm mới
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  // Hàm chuyển sang trang thanh toán
  const handleContinue = () => {
    const bookingData = {
      timeId: timeId,
      seats: selectedSeats,
      seatsTotal: totalPrice,
    };
    sessionStorage.setItem("booking_temp_data", JSON.stringify(bookingData));
    router.push("/checkout");
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

  // Thuật toán: Nhóm ghế theo Hàng (RowName) để render động
  const groupedSeats = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.rowName]) acc[seat.rowName] = [];
      acc[seat.rowName].push(seat);
      return acc;
    },
    {} as Record<string, Seat[]>,
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-primary">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold tracking-widest uppercase text-sm">
          Đang tải sơ đồ rạp...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative pb-32">
      {/* Top Nav (Data động từ showtime API) */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/70 backdrop-blur-xl shadow-2xl shadow-black/20 flex justify-between items-center px-4 md:px-8 py-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="text-on-surface hover:text-primary transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="hidden md:inline font-label uppercase tracking-widest text-xs font-bold">
              Quay lại
            </span>
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <h2 className="font-headline font-bold text-base md:text-lg tracking-wide uppercase text-on-surface">
            {showtime?.movieName || "Đang cập nhật..."}
          </h2>
          <p className="text-[10px] text-on-surface-variant tracking-[0.2em] font-medium uppercase mt-1">
            {showtime?.branchName} • {showtime?.roomName} •{" "}
            {showtime?.startTime?.substring(0, 5)}, {showtime?.date}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
              Thời gian
            </span>
            <span className="text-primary font-headline font-extrabold text-xl">
              10:00
            </span>
          </div>
          <span className="material-symbols-outlined text-primary scale-125">
            timer
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Màn hình */}
        <div className="mb-16 text-center flex flex-col items-center">
          <div className="w-full max-w-3xl" style={{ perspective: "500px" }}>
            <div className="h-2 w-full bg-primary/40 rounded-full shadow-[0_0_40px_rgba(245,201,72,0.3)] transform rotateX(-45deg)"></div>
            <div className="h-24 w-full opacity-40 bg-gradient-to-b from-primary/20 to-transparent"></div>
            <p className="mt-4 text-[10px] font-label tracking-[0.5em] text-on-surface-variant uppercase">
              Màn Hình / Screen
            </p>
          </div>
        </div>

        {/* Lưới ghế (Render động từ groupedSeats) */}
        <div className="flex flex-col items-center overflow-x-auto pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="min-w-max flex flex-col gap-2">
            {Object.keys(groupedSeats)
              .sort()
              .map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-center gap-2"
                >
                  {/* Tên hàng bên trái */}
                  <div className="w-6 flex items-center justify-center font-label text-xs text-on-surface-variant opacity-40">
                    {row}
                  </div>

                  {/* Danh sách ghế trong hàng */}
                  <div className="flex gap-2">
                    {groupedSeats[row]
                      .sort((a, b) => parseInt(a.number) - parseInt(b.number))
                      .map((seat, index) => {
                        const isSelected = selectedSeats.some(
                          (s) =>
                            s.sRow === seat.sRow && s.sColumn === seat.sColumn,
                        );
                        const isVIP = seat.type === "VIP";
                        const isSweetbox = seat.type === "SWEETBOX";

                        // Tính toán tạo khoảng trống lối đi (Thường ở giữa rạp)
                        // Giả sử có 10 ghế 1 hàng, ta tách ở sau ghế số 2 và sau ghế số 8 để có 2 lối đi
                        const isAisle =
                          index === 2 || index === groupedSeats[row].length - 3;

                        return (
                          <React.Fragment key={`${seat.sRow}-${seat.sColumn}`}>
                            <div
                              onClick={() => handleToggleSeat(seat)}
                              className={`
                            flex items-center justify-center cursor-pointer transition-all
                            ${isSweetbox ? "w-20 h-8 rounded-md" : "w-8 h-8 rounded-sm text-[8px]"}
                            ${seat.isBooked || seat.sStatus === false
                                  ? "bg-surface bg-red-500 cursor-not-allowed text-red-500 border border-red-500"
                                  : isSelected
                                    ? "bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(245,201,72,0.5)]"
                                    : isSweetbox
                                      ? "bg-secondary-container/20 border border-secondary/40 hover:bg-secondary-container/40 text-secondary"
                                      : isVIP
                                        ? "border border-primary/40 bg-surface-container-highest text-primary/60 hover:bg-primary/20"
                                        : "bg-surface-container-highest text-on-surface-variant/60 hover:bg-surface-container-high"
                                }
                          `}
                            >
                              {isSweetbox ? (
                                <div className="flex items-center gap-1">
                                  <span
                                    className={`text-[8px] font-bold ${isSelected ? "text-on-primary" : "text-secondary/60"}`}
                                  >
                                    {seat.rowName}
                                    {seat.number}
                                  </span>
                                  <span
                                    className="material-symbols-outlined text-sm"
                                    style={{
                                      fontVariationSettings: "'FILL' 1",
                                    }}
                                  >
                                    favorite
                                  </span>
                                </div>
                              ) : (
                                <>
                                  {seat.rowName}
                                  {seat.number}
                                </>
                              )}
                            </div>
                            {/* Thêm khoảng trống lối đi nếu thoả điều kiện */}
                            {isAisle && <div className="w-4"></div>}
                          </React.Fragment>
                        );
                      })}
                  </div>

                  {/* Tên hàng bên phải */}
                  <div className="w-6 flex items-center justify-center font-label text-xs text-on-surface-variant opacity-40">
                    {row}
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Chú thích */}
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4 bg-surface-container-low p-6 rounded-xl border border-white/5 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-sm bg-surface-container-highest"></div>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Thường
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-sm border border-primary/40 bg-surface-container-highest"></div>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              VIP
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-sm bg-secondary-container/20 border border-secondary/40 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-secondary text-[10px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Sweetbox
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-sm bg-primary shadow-[0_0_10px_rgba(245,201,72,0.4)]"></div>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Đang chọn
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-sm bg-surface opacity-20"></div>
            <span className="text-[10px] uppercase tracking-wider text-on-surface-variant">
              Đã bán
            </span>
          </div>
        </div>
      </main>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 w-full bg-surface-container-low/90 backdrop-blur-2xl border-t border-white/5 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
          <div className="flex items-center justify-between w-full md:w-auto gap-4 md:gap-8">
            <div className="flex flex-col w-1/2 md:w-auto">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Ghế đã chọn
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {selectedSeats.length === 0 ? (
                  <span className="text-sm text-on-surface/50 italic">
                    Chưa chọn
                  </span>
                ) : null}
                {selectedSeats.map((s) => (
                  <span
                    key={`${s.sRow}-${s.sColumn}`}
                    className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-bold border border-primary/20"
                  >
                    {s.rowName}
                    {s.number}
                  </span>
                ))}
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden md:block"></div>
            <div className="flex flex-col text-right md:text-left w-1/2 md:w-auto">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
                Tổng thanh toán
              </span>
              <span className="text-xl md:text-2xl font-headline font-black text-primary tracking-tight">
                {totalPrice.toLocaleString("vi-VN")}{" "}
                <span className="text-[10px] font-medium">VNĐ</span>
              </span>
            </div>
          </div>
          <div className="w-full md:w-auto flex gap-3">
            <button
              onClick={() => router.back()}
              className="flex-1 md:flex-none border border-white/10 px-6 py-3 rounded-full font-label font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all"
            >
              Đổi suất
            </button>
            <button
              onClick={handleContinue}
              disabled={selectedSeats.length === 0}
              className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary-container text-on-primary px-8 py-3 rounded-full font-label font-extrabold text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:opacity-90 disabled:opacity-50 transition-all active:scale-95"
            >
              Tiếp tục
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
