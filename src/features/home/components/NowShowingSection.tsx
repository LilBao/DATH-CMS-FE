"use client";

import React, { useEffect, useState } from "react";
import { movieService } from "@/src/services/movies.service";
import { Movie } from "@/src/types/movie.type";
import MoviesCard from "@/src/components/shared/MoviesCard";

type TabType = "NOW_SHOWING" | "COMING_SOON";

export default function NowShowingSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>("NOW_SHOWING");

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const response =
          activeTab === "NOW_SHOWING"
            ? await movieService.getNowShowing()
            : await movieService.getComingSoon();

        if (response.success) {
          setMovies(response.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách phim:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [activeTab]);

  return (
    <section className="px-12 py-20 bg-surface">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-white">
            {activeTab === "NOW_SHOWING" ? "PHIM ĐANG CHIẾU" : "PHIM SẮP CHIẾU"}
          </h2>
          <div className="h-1 w-20 bg-primary"></div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("NOW_SHOWING")}
            className={`font-bold pb-1 px-4 transition-all tracking-wider ${
              activeTab === "NOW_SHOWING"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface/40 hover:text-on-surface"
            }`}
          >
            NOW SHOWING
          </button>
          <button
            onClick={() => setActiveTab("COMING_SOON")}
            className={`font-bold pb-1 px-4 transition-all tracking-wider ${
              activeTab === "COMING_SOON"
                ? "text-primary border-b-2 border-primary"
                : "text-on-surface/40 hover:text-on-surface"
            }`}
          >
            COMING SOON
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] rounded-xl bg-surface-container-high animate-pulse"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <MoviesCard key={movie.movieId} movie={movie} />
            ))
          ) : (
            <p className="text-on-surface/60 col-span-full text-center py-10">
              Hiện chưa có phim nào trong mục này.
            </p>
          )}
        </div>
      )}
    </section>
  );
}
