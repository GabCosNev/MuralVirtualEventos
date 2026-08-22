import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user.types";
import { AuthContext } from "./AuthContext";
import { api } from "../services/api";
import { registerLogoutHandler } from "../services/authEvents";

interface AuthState {
  user: User | null;
  isLoading: boolean;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({ user: null, isLoading: true });

  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await api.get<User>("/users/me");
        setAuth({ user: response.data, isLoading: false });
      } catch {
        setAuth({ user: null, isLoading: false });
      }
    }

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    registerLogoutHandler(() => {
      setAuth({ user: null, isLoading: false });
    });
  }, []);

  function login(user: User) {
    setAuth({ user, isLoading: false });
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } finally {
      setAuth({ user: null, isLoading: false });
    }
  }

  function updateUser(user: User) {
    setAuth((prev) => ({ ...prev, user }));
  }

  return (
    <AuthContext.Provider
      value={{
        user: auth.user,
        isLoading: auth.isLoading,
        login,
        logout,
        updateUser,
        isAdmin: auth.user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
