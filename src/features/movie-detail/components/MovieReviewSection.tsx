"use client";

import React, { useEffect, useState } from "react";
import { reviewService } from "@/src/services/review.service";
import { ReviewResponse, Movie } from "@/src/types/movie.type";
import { useUserStore } from "@/src/store/userStore";
import { toast } from "sonner";

interface Props {
    movie?: Movie;
    slug?: string;
}

export default function MovieReviewSection({ movie: initialMovie, slug }: Props) {
    const { user } = useUserStore();
    const [movie, setMovie] = useState<Movie | null>(initialMovie || null);
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(10);
    const [comment, setComment] = useState("");

    const fetchReviews = async (movieSlug: string) => {
        try {
            const res = await reviewService.getReviewsBySlug(movieSlug);
            if (res.success) {
                setReviews(res.data);
            }
        } catch (error) {
            console.error("Lỗi tải đánh giá:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            let currentMovie = movie;
            if (!currentMovie && slug) {
                try {
                    const { movieService } = await import("@/src/services/movies.service");
                    const res = await movieService.getMovieBySlug(slug);
                    if (res.success) {
                        setMovie(res.data);
                        currentMovie = res.data;
                    }
                } catch (error) {
                    console.error("Lỗi tải thông tin phim cho review:", error);
                }
            }

            if (currentMovie) {
                fetchReviews(currentMovie.slug);
            }
        };
        init();
    }, [slug, movie?.slug]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error("Vui lòng đăng nhập để đánh giá!");
            return;
        }

        if (!movie) return;

        if (comment.trim().length < 5) {
            toast.error("Nội dung đánh giá quá ngắn!");
            return;
        }

        setSubmitting(true);
        try {
            const res = await reviewService.createReview({
                movieId: movie.movieId,
                rating,
                comment,
            });

            if (res.success) {
                toast.success("Cảm ơn bạn đã đánh giá!");
                setComment("");
                setRating(10);
                fetchReviews(movie.slug);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Gửi đánh giá thất bại!");
        } finally {
            setSubmitting(false);
        }
    };

    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "0";

    return (
        <section className="py-20 max-w-7xl mx-auto px-4 md:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                {/* Left: Summary & Stats */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                        <h2 className="font-headline font-black text-3xl italic tracking-tighter text-white uppercase mb-8">
                            Đánh giá từ <br /> <span className="text-primary">Khán giả</span>
                        </h2>

                        <div className="flex items-center gap-6">
                            <div className="relative">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="42"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        className="text-surface-container-highest"
                                    />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="42"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        fill="transparent"
                                        strokeDasharray={264}
                                        strokeDashoffset={264 - (264 * parseFloat(averageRating)) / 10}
                                        className="text-primary transition-all duration-1000"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-3xl font-black font-headline text-white italic">
                                        {averageRating}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-on-surface-variant text-sm font-medium">
                                    {reviews.length} lượt đánh giá
                                </p>
                                <div className="flex text-primary">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            star
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Review Form */}
                    <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-xl">
                        <h3 className="font-headline font-bold text-xl text-white uppercase mb-6">
                            Gửi đánh giá của bạn
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                                    Số điểm (1 - 10)
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {[...Array(10)].map((_, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => setRating(i + 1)}
                                            className={`w-10 h-10 rounded-lg font-black transition-all ${rating === i + 1
                                                ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-110"
                                                : "bg-surface-container-high text-on-surface-variant hover:text-white"
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest px-1">
                                    Nhận xét
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Chia sẻ cảm nhận của bạn về bộ phim..."
                                    className="w-full bg-surface-container-high border-none rounded-xl px-4 py-3 text-white focus:ring-1 focus:ring-primary transition-all min-h-[120px] text-sm"
                                />
                            </div>

                            <button
                                disabled={submitting}
                                type="submit"
                                className="w-full bg-primary text-on-primary py-4 rounded-full font-label font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {submitting ? "Đang gửi..." : "Gửi đánh giá"}
                            </button>

                            {!user && (
                                <p className="text-[10px] text-on-surface-variant text-center uppercase tracking-tighter">
                                    Vui lòng đăng nhập để thực hiện đánh giá
                                </p>
                            )}
                        </form>
                    </div>
                </div>

                {/* Right: Review List */}
                <div className="lg:col-span-8 space-y-6">
                    <h2 className="font-headline font-black text-2xl text-white uppercase flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary">chat_bubble</span>
                        Bình luận mới nhất
                    </h2>

                    <div className="space-y-6 max-h-[800px] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/10">
                        {loading ? (
                            <div className="flex flex-col gap-6">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-40 bg-surface-container-low rounded-3xl animate-pulse"></div>
                                ))}
                            </div>
                        ) : reviews.length === 0 ? (
                            <div className="bg-surface-container-low/30 border border-dashed border-white/10 rounded-3xl p-12 text-center">
                                <span className="material-symbols-outlined text-5xl text-on-surface-variant/30 mb-4">
                                    reviews
                                </span>
                                <p className="text-on-surface-variant font-medium">
                                    Chưa có đánh giá nào cho bộ phim này. <br /> Hãy là người đầu tiên chia sẻ cảm nhận!
                                </p>
                            </div>
                        ) : (
                            reviews.map((review, idx) => (
                                <div
                                    key={idx}
                                    className="bg-surface-container-low p-6 rounded-3xl border border-white/5 hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-surface-container-high overflow-hidden border-2 border-white/5">
                                                {review.customerAvatar ? (
                                                    <img src={review.customerAvatar} alt={review.customerName} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-black uppercase">
                                                        {review.customerName.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-white font-bold text-sm uppercase tracking-tight group-hover:text-primary transition-colors">
                                                    {review.customerName}
                                                </h4>
                                                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">
                                                    {review.reviewDate}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                                            <span className="text-primary font-black text-sm italic">{review.rating}</span>
                                            <span className="material-symbols-outlined text-primary text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                                star
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-on-surface-variant text-sm leading-relaxed font-light italic">
                                        "{review.comment}"
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
