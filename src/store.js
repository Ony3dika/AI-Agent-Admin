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
    }),
    {
      name: "admin",
      getStorage: () => sessionStorage, // Specify the storage type (localStorage or sessionStorage)
    }
  )
);