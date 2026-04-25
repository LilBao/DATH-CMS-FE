export interface Genre {
  genre: string; // Tên thể loại
}

export interface Actor {
  fullName: string;
}

export interface Format {
  fName: string; // 2D, 3D, IMAX...
}

export interface Movie {
  movieId: number;
  mName: string;
  descript: string;
  runTime: number;
  isDub: boolean;
  isSub: boolean;
  releaseDate: string;
  closingDate: string;
  ageRating: string; // K, T13, T16, T18
  posterUrl: string | null;
  trailerUrl: string | null;
  genres: Genre[];
  actors: Actor[];
  formats: Format[];
  slug: string;
}

export interface Showtime {
  timeId: number;
  day: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm:ss"
  endTime: string;
  formatName: string;
  movieId: number;
  movieName: string;
  branchId: number;
  branchName: string;
  roomId: number;
  status: string; // SCHEDULED, ONGOING...
}
