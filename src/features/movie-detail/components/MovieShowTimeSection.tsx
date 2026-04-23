"use client";

import React, { useEffect, useState } from "react";
import { movieService } from "@/src/services/movies.service";
import { Showtime } from "@/src/types/movie.type";
import { useRouter } from "next/navigation";

interface Props {
  movieId: string;
}

export default function MovieShowtimesSection({ movieId }: Props) {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const res = await movieService.getMovieShowtimes(movieId);
        if (res.success && res.data.length > 0) {
          setShowtimes(res.data);
          // Mặc định chọn ngày đầu tiên có suất chiếu
          setSelectedDate(res.data[0].day);
        }
      } catch (error) {
        console.error("Lỗi tải lịch chiếu:", error);
      }
    };
    fetchShowtimes();
  }, [movieId]);

  // Lọc ra danh sách các ngày duy nhất (VD: 2024-05-15)
  const uniqueDates = Array.from(new Set(showtimes.map((st) => st.day))).sort();

  // Lọc các suất chiếu thuộc về ngày đang được chọn
  const showtimesForDate = showtimes.filter((st) => st.day === selectedDate);

  // Nhóm các suất chiếu theo Format (2D, 3D, IMAX...)
  const formatGroups = showtimesForDate.reduce(
    (acc, curr) => {
      const formatName = curr.format?.fName || "Tiêu chuẩn";
      if (!acc[formatName]) acc[formatName] = [];
      acc[formatName].push(curr);
      return acc;
    },
    {} as Record<string, Showtime[]>,
  );

  return (
    <section className="bg-surface py-24 px-8 md:px-16" id="booking">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-2">
            <h2 className="text-3xl font-headline font-bold tracking-tight text-white">
              Lịch Chiếu Phim
            </h2>
            <p className="text-on-surface-variant text-sm">
              Chọn ngày để xem các suất chiếu khả dụng.
            </p>
          </div>
        </div>

        {/* Date Picker */}
        <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          {uniqueDates.length === 0 ? (
            <p className="text-on-surface-variant">
              Phim hiện chưa có lịch chiếu.
            </p>
          ) : (
            uniqueDates.map((date) => {
              const isSelected = selectedDate === date;
              // Parse date để hiển thị đẹp hơn nếu cần (Ở đây hiển thị text thô tạm)
              const [year, month, day] = date.split("-");

              return (
                <div
                  key={date}
                  onClick={() => setSelectedDate(date)}
                  className={`flex-shrink-0 w-20 h-24 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                      : "bg-surface-container-low border border-white/5 hover:bg-surface-container-high"
                  }`}
                >
                  <span
                    className={`text-[10px] uppercase font-bold ${isSelected ? "opacity-80" : "text-on-surface-variant"}`}
                  >
                    Th {month}
                  </span>
                  <span
                    className={`text-2xl font-bold ${isSelected ? "" : "text-white"}`}
                  >
                    {day}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Showtimes Grid theo Định dạng */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(formatGroups).map(([formatName, times]) => (
            <div
              key={formatName}
              className={`bg-surface-container-low p-8 rounded-2xl space-y-6 relative overflow-hidden ${formatName.includes("IMAX") ? "border border-primary/20" : "border border-white/5"}`}
            >
              {formatName.includes("IMAX") && (
                <div className="absolute top-0 right-0">
                  <div className="bg-primary text-on-primary text-[8px] font-black uppercase px-3 py-1 tracking-tighter">
                    Premium
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <h3
                  className={`text-lg font-headline font-bold ${formatName.includes("IMAX") ? "text-primary" : "text-white"}`}
                >
                  {formatName}
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {times.map((st) => {
                  // Hiển thị giờ:phút (VD: 19:30)
                  const timeString = st.startTime.substring(0, 5);
                  const isPast = st.status === "COMPLETED"; // Giả định log logic khóa nút

                  return (
                    <button
                      key={st.timeId}
                      disabled={isPast}
                      // THÊM SỰ KIỆN CLICK CHUYỂN TRANG VÀO ĐÂY:
                      onClick={() =>
                        router.push(`/booking/showtime/${st.timeId}`)
                      }
                      className={`py-3 rounded-lg text-sm font-bold transition-all ${
                        isPast
                          ? "bg-surface-container-high/40 text-on-surface-variant opacity-30 cursor-not-allowed line-through"
                          : formatName.includes("IMAX")
                            ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-on-primary"
                            : "bg-surface-container-high text-white border border-white/5 hover:bg-primary hover:text-on-primary"
                      }`}
                    >
                      {timeString}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
