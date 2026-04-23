import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { Seat, ShowtimeDetails } from "../types/booking.type";

export const bookingService = {
  // Lấy chi tiết thông tin của suất chiếu (Tên phim, rạp, giờ...)
  getShowtimeDetails: (timeId: string) => {
    return api.get<any, ApiResponse<ShowtimeDetails>>(`/showtimes/${timeId}`);
  },

  // Lấy danh sách ghế của suất chiếu đó
  getSeatsByShowtime: (timeId: string) => {
    return api.get<any, ApiResponse<Seat[]>>(`/showtimes/${timeId}/seats`);
  },
};
