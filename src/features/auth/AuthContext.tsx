// src/features/auth/AuthContext.tsx

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { User } from "./model/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>; // <-- PERUBAHAN 1: Ditambahkan ke interface
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // PERUBAHAN 2: 'checkUser' dipindah ke luar 'useEffect' dan dibungkus 'useCallback'
  const checkUser = useCallback(async () => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const response = await apiClient.get<{ user: User }>("/auth/me");
        setUser(response.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]); // 'useEffect' sekarang hanya memanggil 'checkUser'

  // PERUBAHAN 3: Fungsi 'refetchUser' yang baru ditambahkan DI SINI
  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    await checkUser();
    setIsLoading(false);
  }, [checkUser]);

  // INI ADALAH FUNGSI LOGIN ASLI ANDA (TIDAK DIHAPUS)
  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const apiCredentials = {
        identifier: credentials.email,
        password: credentials.password,
      };

      try {
        const response = await apiClient.post<{ user: User; token: string }>(
          "/auth/login",
          apiCredentials
        );
        const { user, token } = response.data;

        if (token) {
          localStorage.setItem("authToken", token);
          setIsAuthenticated(true);
          setUser(user);
          const rolePath = (user.role || "user").toLowerCase();
          router.push(`/${rolePath}`);
        }
      } catch (error: any) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
      }
    },
    [router]
  );

  // INI ADALAH FUNGSI LOGOUT ASLI ANDA (TIDAK DIHAPUS)
  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("authToken");
      router.push("/sign-in");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        isLoading,
        login,
        logout,
        refetchUser, // <-- PERUBAHAN 4: Ditambahkan ke 'value' provider
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
