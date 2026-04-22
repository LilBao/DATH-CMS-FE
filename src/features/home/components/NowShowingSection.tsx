"use client"; // Vì dùng useEffect và useState nên phải khai báo đây là Client Component

import React, { useEffect, useState } from "react";
import { movieService } from "@/src/services/movies.service";
import { Movie } from "@/src/types/movie.type";
import MovieCard from "@/src/components/shared/MoviesCard"; // Component dùng chung

export default function NowShowingSection() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const response = await movieService.getNowShowing();
        if (response.success) {
          setMovies(response.data); // Gán data từ Spring Boot vào State
        }
      } catch (error) {
        console.error("Lỗi tải phim đang chiếu:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="px-12 py-20 bg-surface">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="font-headline text-4xl font-bold tracking-tight text-white">
            PHIM ĐANG CHIẾU
          </h2>
          <div className="h-1 w-20 bg-primary"></div>
        </div>
        <div className="flex space-x-4">
          <button className="text-primary font-bold border-b-2 border-primary pb-1 px-4 transition-all tracking-wider">
            NOW SHOWING
          </button>
          <button className="text-on-surface/40 font-bold hover:text-on-surface pb-1 px-4 transition-all tracking-wider">
            COMING SOON
          </button>
        </div>
      </div>

      {loading ? (
        // Hiển thị loading skeleton (Nếu có shadcn ui thì dùng Skeleton)
        <div className="text-center text-white py-10">
          Đang tải danh sách phim...
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {movies.map((movie) => (
            <MovieCard key={movie.movieId} movie={movie} />
          ))}
        </div>
      )}
    </section>
  );
}
