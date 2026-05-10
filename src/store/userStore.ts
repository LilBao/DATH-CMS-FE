import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile } from "@/src/types/user.type";

interface UserState {
  user: UserProfile | null;
  setUser: (user: UserProfile) => void;
  clearUser: () => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "user-storage",
    }
  )
);
