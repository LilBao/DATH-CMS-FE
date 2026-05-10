import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { ReviewResponse, ReviewRequest } from "../types/movie.type";

export const reviewService = {
  createReview: (data: ReviewRequest) => {
    return api.post<any, ApiResponse<ReviewResponse>>("/reviews", data);
  },

  getReviewsBySlug: (slug: string) => {
    return api.get<any, ApiResponse<ReviewResponse[]>>(`/reviews/movie/slug/${slug}`);
  },
};
