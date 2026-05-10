// src/components/shared/MoviesCard.tsx
import { Movie } from "@/src/types/movie.type";
import Link from "next/link";

interface MoviesCardProps {
  movie: Movie;
}

export default function MoviesCard({ movie }: MoviesCardProps) {
  const status = movie.releaseDate <= new Date().toISOString() ? "NOW_SHOWING" : "COMING_SOON";

  return (
    <div className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container-low shadow-xl cursor-pointer">
      <img
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        alt={movie.mName}
        src={
          movie.posterUrl ||
          "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0"
        }
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80"></div>

      <div className="absolute top-3 right-3 bg-secondary-container text-white px-2 py-1 rounded text-[10px] font-bold">
        {movie.ageRating}
      </div>

      <div className="absolute bottom-0 inset-x-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-headline font-bold text-lg mb-1 leading-tight text-white uppercase group-hover:text-primary transition-colors line-clamp-2">
          {movie.mName}
        </h3>
        <p className="text-xs text-on-surface-variant mb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          {movie.genres?.join(", ")}
        </p>
        <Link href={status === 'NOW_SHOWING' ? `/movie/${movie.slug}` : "#"}>
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold text-sm tracking-widest opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
            {status === 'NOW_SHOWING' ? "MUA VÉ" : "SẮP CHIẾU"}
          </button>
        </Link>
      </div>
    </div>
  );
}
