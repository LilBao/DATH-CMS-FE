import api from "./api";
import { ApiResponse } from "../types/auth.type";
import {
  UserProfile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/user.type";

export const userService = {
  // Lấy thông tin chi tiết user
  getProfile: () => {
    return api.get<any, ApiResponse<UserProfile>>("/auth/me");
  },

  // Cập nhật thông tin cá nhân
  updateProfile: (data: UpdateProfilePayload) => {
    return api.put<any, ApiResponse<UserProfile>>("/customers/me", data);
  },

  // Đổi mật khẩu
  changePassword: (data: ChangePasswordPayload) => {
    return api.put<any, ApiResponse<any>>("/users/change-password", data);
  },
};
