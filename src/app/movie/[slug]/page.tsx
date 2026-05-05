import React from "react";
import {
  MovieHeroSection,
  MovieShowTimesSection,
  MovieReviewSection,
} from "@/src/features/movie-detail";

export default async function MovieDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <main className="relative w-full pt-20">
      <MovieHeroSection slug={slug} />
      <MovieShowTimesSection slug={slug} />
      <MovieReviewSection slug={slug} />
    </main>
  );
}
