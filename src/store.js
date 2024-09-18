import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useStore = create(
  persist(
    (set) => ({
      user: {
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
      },
      updateUser: (newUser) =>
        set((state) => ({
          user: { ...state.user, ...newUser },
        })),

      // Coach
      coach: {
        name: null,
        voice: "",
        language: "",
        status: "",
        category: "",
        id: "",
        avatar: "",
      },
      updateCoach: (newCoach) =>
        set((state) => ({
          coach: { ...state.coach, ...newCoach },
        })),
    }),

    {
      name: "admin",
      getStorage: () => sessionStorage, // Specify the storage type (localStorage or sessionStorage)
    }
  )
);
