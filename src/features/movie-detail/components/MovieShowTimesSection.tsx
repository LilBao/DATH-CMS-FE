"use client";

import React, { useEffect, useState } from "react";
import { movieService } from "@/src/services/movies.service";
import { Showtime } from "@/src/types/movie.type";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Ticket } from "lucide-react";

interface Props {
  slug: string;
}

export default function MovieShowTimesSection({ slug }: Props) {
  const router = useRouter();
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null);

  useEffect(() => {
    const fetchShowtimes = async () => {
      try {
        const res = await movieService.getMovieShowtimes(slug);
        if (res.success && res.data.length > 0) {
          setShowtimes(res.data);
          setSelectedDate(res.data[0].day);
        }
      } catch (error) {
        console.error("Lỗi tải lịch chiếu:", error);
      }
    };
    fetchShowtimes();
  }, [slug]);

  const uniqueDates = Array.from(new Set(showtimes.map((st) => st.day))).sort();

  const showtimesForDate = showtimes.filter((st) => st.day === selectedDate);

  const branchesForDate = Array.from(
    new Map(
      showtimesForDate.map((st) => [
        st.branchId,
        { branchId: st.branchId, branchName: st.branchName },
      ]),
    ).values(),
  );

  useEffect(() => {
    if (branchesForDate.length > 0) {
      if (
        !selectedBranchId ||
        !branchesForDate.some((b) => b.branchId === selectedBranchId)
      ) {
        setSelectedBranchId(branchesForDate[0].branchId);
      }
    } else {
      setSelectedBranchId(null);
    }
  }, [selectedDate, branchesForDate]);

  const showtimesForBranch = showtimesForDate.filter(
    (st) => st.branchId === selectedBranchId,
  );

  const formatGroups = showtimesForBranch.reduce(
    (acc, curr) => {
      const formatName = curr.formatName;

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

        {/* Filter Section */}
        <div className="space-y-10">
          {/* Date Picker */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-on-surface-variant">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-widest">
                Chọn ngày chiếu
              </span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
              {uniqueDates.length === 0 ? (
                <p className="text-on-surface-variant">
                  Phim hiện chưa có lịch chiếu.
                </p>
              ) : (
                uniqueDates.map((date) => {
                  const isSelected = selectedDate === date;
                  const [year, month, day] = date.split("-");

                  return (
                    <div
                      key={date}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-20 h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${isSelected
                        ? "bg-primary text-on-primary shadow-2xl shadow-primary/40 scale-105"
                        : "bg-surface-container-low border border-white/5 hover:bg-surface-container-high hover:border-white/10"
                        }`}
                    >
                      <span
                        className={`text-[10px] uppercase font-bold tracking-tighter ${isSelected ? "opacity-80" : "text-on-surface-variant"}`}
                      >
                        Th {month}
                      </span>
                      <span
                        className={`text-2xl font-black ${isSelected ? "" : "text-white"}`}
                      >
                        {day}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Branch Selector */}
          {selectedDate && branchesForDate.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <MapPin className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Chọn rạp chiếu
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {branchesForDate.map((branch) => {
                  const isSelected = selectedBranchId === branch.branchId;
                  return (
                    <button
                      key={branch.branchId}
                      onClick={() => setSelectedBranchId(branch.branchId)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 border ${isSelected
                        ? "bg-primary/10 text-primary border-primary shadow-lg shadow-primary/10"
                        : "bg-surface-container-low text-on-surface-variant border-white/5 hover:border-white/20 hover:text-white"
                        }`}
                    >
                      {branch.branchName}
                    </button>
                  );
                })}
              </div>
            </div>
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
                  const timeString = st.startTime.substring(0, 5);
                  const isPast = st.status === "COMPLETED";

                  return (
                    <button
                      key={st.timeId}
                      disabled={isPast}
                      onClick={() =>
                        router.push(`/booking/showtime/${st.timeId}`)
                      }
                      className={`py-3 rounded-lg text-sm font-bold transition-all ${isPast
                        ? "bg-surface-container-high/40 text-on-surface-variant opacity-30 cursor-not-allowed line-through"
                        : formatName.includes("IMAX")
                          ? "bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-on-primary"
                          : "bg-surface-container-high text-white border border-white/5 hover:bg-primary hover:text-on-primary"
                        }`}
                    >
                      <div className="flex flex-col items-center">
                        <span>{timeString}</span>
                        <span className="text-[9px] opacity-60 font-medium tracking-tighter mt-0.5">
                          {st.rPrice.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
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
