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
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover"
          alt={featuredMovie.mName}
          src={featuredMovie.posterUrl || ""}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent"></div>
      </div>

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
        </div>
      </div>
    </section>
  );
}
