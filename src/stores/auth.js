import { create } from "zustand";

const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem("token") || null,
    role: null,
    login: (user, token) => {
        set({ user, token, role: user?.role || null });
        localStorage.setItem("token", token);
    },
    logout: () => {
        set({ user: null, token: null, role: null });
        localStorage.removeItem("token");
    },
}));

export default useAuthStore;