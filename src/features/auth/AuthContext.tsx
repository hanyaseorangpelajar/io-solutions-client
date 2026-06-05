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
import type { UserDto } from "./model/types";

function setCookie(name: string, value: string, days: number) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function deleteCookie(name: string) {
  document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserDto | null;
  isLoading: boolean;
  login: (credentials: {
    identifier: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const refetchUser = useCallback(async () => {
    try {
      const response = await apiClient.get<UserDto>("/auth/me");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
    if (token) {
      refetchUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [refetchUser]);

  const login = useCallback(
    async (credentials: { identifier: string; password: string }) => {
      try {
        /**
         * Mapping 'identifier' dari form UI menjadi 'username'
         * agar sesuai dengan skema validasi backend.
         */
        const apiPayload = {
          username: credentials.identifier,
          password: credentials.password,
        };

        const response = await apiClient.post<{ user: UserDto; token: string }>(
          "/auth/login",
          apiPayload,
        );
        const { user: userData, token } = response.data;

        if (token) {
          localStorage.setItem("authToken", token);
          setCookie("authToken", token, 1);

          setIsAuthenticated(true);
          setUser(userData);
        }
      } catch (error: any) {
        console.error("Login failed:", error.response?.data || error.message);
        localStorage.removeItem("authToken");
        deleteCookie("authToken");
        setIsAuthenticated(false);
        setUser(null);
        throw error;
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      localStorage.removeItem("authToken");
      deleteCookie("authToken");

      setIsAuthenticated(false);
      setUser(null);
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
        refetchUser,
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
