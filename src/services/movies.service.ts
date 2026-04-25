import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { Movie, Showtime } from "../types/movie.type";

export const movieService = {
  // 1. Phim đang chiếu (NOW SHOWING)
  getNowShowing: () => {
    return api.get<any, ApiResponse<Movie[]>>("/movies/now-showing");
  },

  // 2. Phim sắp chiếu (COMING SOON)
  getComingSoon: () => {
    return api.get<any, ApiResponse<Movie[]>>("/movies/coming-soon");
  },

  // 3. Lấy chi tiết 1 bộ phim
  getMovieBySlug: (slug: string) => {
    return api.get<any, ApiResponse<Movie>>(`/movies/slug/${slug}`);
  },

  // 4. Lấy lịch chiếu của 1 bộ phim
  getMovieShowtimes: (slug: string) => {
    return api.get<any, ApiResponse<Showtime[]>>(
      `/showtimes/movie/${slug}`,
    );
  },
};
