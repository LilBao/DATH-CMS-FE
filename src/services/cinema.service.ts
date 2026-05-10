import api from "./api";
import { ApiResponse } from "../types/auth.type";
import { BranchResponse, ScreenRoomResponse } from "../types/cinema.type";
import { Movie } from "../types/movie.type";

export const cinemaService = {
  // Lấy danh sách tất cả chi nhánh
  getAllBranches: () => {
    return api.get<any, ApiResponse<BranchResponse[]>>("/branches");
  },

  // Lấy thông tin chi nhánh theo ID
  getBranchById: (id: number) => {
    return api.get<any, ApiResponse<BranchResponse>>(`/branches/${id}`);
  },

  // Tìm kiếm chi nhánh theo tên
  searchBranches: (name: string) => {
    return api.get<any, ApiResponse<BranchResponse[]>>("/branches/search", {
      params: { name },
    });
  },

  // Lấy danh sách tất cả phòng chiếu của một chi nhánh
  getRoomsByBranch: (branchId: number) => {
    return api.get<any, ApiResponse<ScreenRoomResponse[]>>(`/branches/${branchId}/rooms`);
  },

  // Lấy thông tin chi tiết phòng chiếu
  getRoomDetail: (branchId: number, roomId: number) => {
    return api.get<any, ApiResponse<ScreenRoomResponse>>(`/branches/${branchId}/rooms/${roomId}`);
  },

  // Lấy danh sách phim đang chiếu tại một chi nhánh cụ thể
  getNowShowingAtBranch: (branchId: number) => {
    return api.get<any, ApiResponse<Movie[]>>(`/branches/${branchId}/now-showing`);
  },
};

