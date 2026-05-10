// src/types/auth.type.ts
export interface LoginPayload {
  email: string;
  password: string;
  provider?: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  dob: string; // Định dạng YYYY-MM-DD
  gender: string; // M, F
}

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
