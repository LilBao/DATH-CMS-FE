"use client";

import React, { useEffect, useState } from "react";
import { movieService } from "@/src/services/movies.service";
import { Movie } from "@/src/types/movie.type";

interface Props {
  slug: string;
}

export default function MovieHeroSection({ slug }: Props) {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await movieService.getMovieBySlug(slug);
        if (res.success) setMovie(res.data);
      } catch (error) {
        console.error("Lỗi tải chi tiết phim:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [slug]);

  if (loading)
    return (
      <div className="h-[870px] w-full bg-surface-container animate-pulse"></div>
    );
  if (!movie)
    return (
      <div className="h-[870px] flex items-center justify-center">
        Phim không tồn tại.
      </div>
    );

  return (
    <section className="relative h-[870px] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          alt={movie.mName}
          className="w-full h-full object-cover opacity-40 scale-105 blur-sm"
          src={movie.posterUrl || "https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#131313] from-0% via-[#131313]/80 via-50% to-[#131313]/40 to-100%"></div>
      </div>

      <div className="relative z-10 h-full flex items-end px-8 md:px-16 pb-20">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-end">
          <div className="hidden md:block md:col-span-3">
            <div className="relative group aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
              <img
                alt={movie.mName}
                className="w-full h-full object-cover"
                src={
                  movie.posterUrl || "https://wallpapers.com/images/hd/netflix-background-gs7hjuwvv2g0e9fj.jpg"
                }
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer">
                <span
                  className="material-symbols-outlined text-primary text-6xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_circle
                </span>
              </div>
            </div>
          </div>

          <div className="md:col-span-9 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 text-primary font-headline tracking-[0.2em] text-sm font-bold uppercase">
                {movie.genres?.slice(0, 2).map((g, idx) => (
                  <React.Fragment key={idx}>
                    <span>{g.genre}</span>
                    {idx === 0 && movie.genres.length > 1 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></span>
                    )}
                  </React.Fragment>
                ))}
                <span className="w-1.5 h-1.5 rounded-full bg-surface-container-highest"></span>
                <span>{movie.runTime} Phút</span>
                <span className="bg-secondary-container text-white px-2 py-0.5 rounded text-xs ml-2">
                  {movie.ageRating}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-white tracking-tighter uppercase italic leading-none">
                {movie.mName}
              </h1>
            </div>

            <div className="flex flex-wrap gap-8 py-6 border-y border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Khởi chiếu
                </p>
                <p className="text-sm font-semibold text-white">
                  {movie.releaseDate}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Diễn viên
                </p>
                <p className="text-sm font-semibold text-white">
                  {movie?.actors.join(", ") || "Đang cập nhật..."}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">
                  Phiên bản
                </p>
                <p className="text-sm font-semibold text-white">
                  {movie.isDub ? "Lồng tiếng" : ""}{" "}
                  {movie.isSub && movie.isDub ? "|" : ""}{" "}
                  {movie.isSub ? "Phụ đề" : ""}
                </p>
              </div>
            </div>

            <div className="max-w-2xl">
              <p className="text-on-surface-variant leading-relaxed text-sm md:text-base font-light">
                {movie.descript || "Đang cập nhật mô tả phim..."}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a
                href="#booking"
                className="bg-primary text-on-primary px-10 py-4 rounded-full font-label font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <span className="material-symbols-outlined">
                  confirmation_number
                </span>
                Mua Vé
              </a>
              {movie.trailerUrl && (
                <a
                  href={movie.trailerUrl}
                  target="_blank"
                  className="bg-surface-container-high/50 backdrop-blur-md text-white px-10 py-4 rounded-full font-label font-bold text-sm uppercase tracking-widest border border-white/10 hover:bg-surface-container-highest transition-all"
                >
                  Trailer
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
