"use client";

import React, { useEffect, useState } from "react";
import { movieService } from "@/src/services/movies.service";
import { Movie } from "@/src/types/movie.type";

export default function HeroSection() {
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const getHeroMovie = async () => {
      try {
        const response = await movieService.getNowShowing();
        if (response.success && response.data.length > 0) {
          setFeaturedMovie(response.data[0]); // Lấy phim đầu tiên làm banner
        }
      } catch (error) {
        console.error("Lỗi Hero API:", error);
      }
    };
    getHeroMovie();
  }, []);

  if (!featuredMovie)
    return <div className="h-[870px] bg-background animate-pulse" />;

  return (
    <section className="relative h-[870px] w-full overflow-hidden flex items-end px-12 pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt={featuredMovie.mName}
          src={featuredMovie.posterUrl || ""}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
      </div>

      {/* Main Hero Content */}
      <div className="relative z-10 max-w-3xl space-y-6">
        <div className="flex items-center space-x-3 mb-2">
          <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-sm text-xs font-bold tracking-widest uppercase">
            HOT NOW
          </span>
          <span className="text-on-surface-variant text-sm font-medium">
            Thời lượng: {featuredMovie.runTime} phút
          </span>
        </div>

        <h1 className="font-headline text-6xl md:text-8xl font-extrabold tracking-tighter leading-none italic text-primary uppercase">
          {featuredMovie.mName}
        </h1>

        {/* MỚI THÊM: Đoạn text mô tả (Nếu API movie có trường mô tả, bạn có thể thay thế text tĩnh này) */}
        <p className="font-body text-lg text-on-surface/80 max-w-xl leading-relaxed line-clamp-3">
          Hành trình điện ảnh đầy kịch tính đang chờ đón bạn. Khám phá ngay tác
          phẩm bom tấn được mong đợi nhất tháng này tại hệ thống rạp chiếu của
          chúng tôi.
        </p>

        <div className="flex items-center space-x-4 pt-4">
          <button className="bg-primary text-on-primary px-8 py-4 rounded-full font-label font-bold text-base flex items-center space-x-2 hover:shadow-[0_0_20px_rgba(245,201,72,0.4)] transition-all scale-95 active:scale-90">
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              confirmation_number
            </span>
            <span>ĐẶT VÉ NGAY</span>
          </button>

          {/* MỚI THÊM: Nút xem trailer */}
          <button className="bg-transparent border border-on-surface/20 text-on-surface px-8 py-4 rounded-full font-label font-bold text-base flex items-center space-x-2 hover:bg-on-surface/10 transition-all scale-95 active:scale-90">
            <span className="material-symbols-outlined">play_circle</span>
            <span>XEM TRAILER</span>
          </button>
        </div>
      </div>

      {/* MỚI THÊM: Khối Bento Highlight bên phải */}
      <div className="absolute right-12 bottom-24 hidden xl:grid grid-cols-1 gap-4 w-72">
        <div className="glass-card p-4 rounded-xl border border-white/5 space-y-2">
          <p className="text-xs text-primary font-bold uppercase tracking-widest">
            Đang thịnh hành
          </p>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-16 bg-surface-container-high rounded overflow-hidden">
              {/* Dùng luôn ảnh của phim đang chiếu */}
              <img
                className="w-full h-full object-cover"
                alt={featuredMovie.mName}
                src={featuredMovie.posterUrl || ""}
              />
            </div>
            <div>
              <h4 className="text-sm font-bold line-clamp-1">
                {featuredMovie.mName}
              </h4>
              <div className="flex items-center text-xs text-on-surface-variant">
                <span
                  className="material-symbols-outlined text-[14px] text-primary mr-1"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                8.9/10
              </div>
            </div>
          </div>
        </div>
        <div className="glass-card p-4 rounded-xl border border-white/5 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-on-surface-variant font-medium">
              Giá vé từ
            </p>
            <p className="text-xl font-bold text-primary">85.000đ</p>
          </div>
          <span className="material-symbols-outlined text-primary-container">
            local_activity
          </span>
        </div>
      </div>
    </section>
  );
}
