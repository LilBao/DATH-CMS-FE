export interface UserProfile {
  id?: number;
  userId: string;
  email: string;
  fullName?: string;
  name?: string;
  phone?: string;
  dob?: string; // YYYY-MM-DD
  birthday?: string | null;
  gender?: "M" | "F"; // Updated to match backend [M, F]
  avatarUrl?: string | null;
  role: string;
  points: number;
  rank: string;
  membership?: {
    rank: string;
    points: number;
    tier?: string;
  };
}

export interface UpdateProfilePayload {
  name: string;
  sex: "M" | "F"; // Updated to match backend [M, F]
  birthday: string;
  phoneNumber: string;
  avatarUrl?: string | null;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}
