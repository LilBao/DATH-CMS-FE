// src/services/auth.service.ts
import api from "./api";
import {
  LoginPayload,
  RegisterPayload,
  AuthResponse,
  ApiResponse,
} from "../types/auth.type";

export const authService = {
  login: (data: LoginPayload) => {
    return api.post<any, ApiResponse<AuthResponse>>("/auth/login", data);
  },

  register: (data: RegisterPayload) => {
    return api.post<any, ApiResponse<AuthResponse>>("/auth/register", data);
  },
};
