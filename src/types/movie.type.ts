export interface Genre {
  genreId: number;
  genre: string;
}

export interface Movie {
  movieId: number;
  mName: string;
  runTime: number;
  ageRating: string;
  posterUrl: string | null;
  genres: Genre[];
  // Có thể thêm các field khác như director, cast, trailerUrl... nếu BE trả về
}
