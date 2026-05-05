"use client";

import React, { useEffect, useState } from "react";
import { cinemaService } from "@/src/services/cinema.service";
import { BranchResponse, ScreenRoomResponse } from "@/src/types/cinema.type";
import { Movie } from "@/src/types/movie.type";
import Link from "next/link";

const DEFAULT_CINEMA_IMAGE = "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop";

export default function CinemaDetails({ cinema }: { cinema: BranchResponse | null }) {
  const [rooms, setRooms] = useState<ScreenRoomResponse[]>([]);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  const [loadingMovies, setLoadingMovies] = useState(false);

  useEffect(() => {
    if (cinema) {
      const fetchData = async () => {
        setLoadingRooms(true);
        setLoadingMovies(true);
        try {
          const [roomsRes, moviesRes] = await Promise.all([
            cinemaService.getRoomsByBranch(cinema.branchId),
            cinemaService.getNowShowingAtBranch(cinema.branchId),
          ]);

          if (roomsRes.success) setRooms(roomsRes.data);
          if (moviesRes.success) setMovies(moviesRes.data);
        } catch (error) {
          console.error("Failed to fetch branch data:", error);
        } finally {
          setLoadingRooms(false);
          setLoadingMovies(false);
        }
      };

      fetchData();
    } else {
      setRooms([]);
      setMovies([]);
    }
  }, [cinema]);

  if (!cinema) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-on-surface/40 bg-surface-container/30 rounded-3xl border-2 border-dashed border-white/10 p-12">
        <span className="material-symbols-outlined text-6xl mb-4">movie_edit</span>
        <p className="font-bold tracking-wide">Vui lòng chọn rạp để xem chi tiết</p>
      </div>
    );
  }

  const city = cinema.bAddress.split(",").pop()?.trim() || "Việt Nam";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Image */}
      <div className="relative h-[300px] rounded-3xl overflow-hidden group">
        <img
          src={DEFAULT_CINEMA_IMAGE}
          alt={cinema.bName}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
        <div className="absolute bottom-6 left-8">
          <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
            {cinema.bName}
          </h2>
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined text-sm">location_on</span>
            <span className="text-sm font-bold uppercase tracking-wider">{city}</span>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">info</span>
            </div>
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Thông tin rạp</h3>
          </div>
          <p className="text-on-surface/80 text-sm leading-relaxed mb-4">
            {cinema.bAddress}
          </p>
          <div className="flex flex-col gap-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-on-surface/60">
              <span className="material-symbols-outlined text-sm">person</span>
              <span>Quản lý: {cinema.managerName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface/60">
              <span className="material-symbols-outlined text-sm">phone</span>
              <span>Hotline: {cinema.phoneNumbers.join(" - ")}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-all border border-white/10">
              Xem bản đồ
            </button>
          </div>
        </div>

        <div className="bg-surface-container p-6 rounded-2xl border border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
              <span className="material-symbols-outlined">meeting_room</span>
            </div>
            <h3 className="font-bold text-white uppercase tracking-widest text-sm">Phòng chiếu ({cinema.totalRooms})</h3>
          </div>
          {loadingRooms ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-10 bg-white/5 rounded-xl"></div>
              <div className="h-10 bg-white/5 rounded-xl"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
              {rooms.map((room) => (
                <div key={room.roomId} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <div>
                    <p className="text-xs font-bold text-white">Phòng {room.roomId} - {room.rType}</p>
                    <p className="text-[10px] text-on-surface/60">{room.totalSeats} ghế • {room.rCapacity} chỗ</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-primary">{room.basePrice.toLocaleString()}đ</p>
                    <p className="text-[10px] text-on-surface/40">Giá cơ bản</p>
                  </div>
                </div>
              ))}
              {rooms.length === 0 && (
                <p className="text-xs text-on-surface/40 italic">Chưa có thông tin phòng chiếu</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Now Showing Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-tight italic">
            PHIM ĐANG <span className="text-gradient">CHIẾU</span> TẠI RẠP
          </h3>
          <Link href="/movies" className="text-xs font-bold text-primary hover:underline uppercase tracking-widest">
            Xem tất cả
          </Link>
        </div>

        {loadingMovies ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[2/3] bg-surface-container rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {movies.map((movie) => (
              <Link
                key={movie.movieId}
                href={`/movies/${movie.slug}`}
                className="group relative aspect-[2/3] rounded-2xl overflow-hidden border border-white/5 hover:border-primary/50 transition-all"
              >
                <img
                  src={movie.posterUrl || "/images/placeholder-poster.jpg"}
                  alt={movie.mName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <h4 className="text-xs font-bold text-white line-clamp-2">{movie.mName}</h4>
                  <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-tighter">
                    {movie.formats.map(f => f.fName).join(" / ")}
                  </p>
                </div>
                {/* Age Rating Badge */}
                <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-black/60 backdrop-blur-md rounded text-[9px] font-black text-primary border border-primary/20">
                  {movie.ageRating}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-surface-container rounded-2xl p-8 text-center border border-white/5">
            <p className="text-on-surface/40 text-sm mb-4 italic">Hiện không có phim nào đang chiếu tại rạp này.</p>
            <Link href="/movies" className="text-primary font-bold text-sm hover:underline uppercase tracking-widest">
              Xem lịch chiếu tại rạp khác
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
