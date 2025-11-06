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
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  }, [checkUser]);

  const refetchUser = useCallback(async () => {
    setIsLoading(true);
    await checkUser();
    setIsLoading(false);
  }, [checkUser]);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      const apiCredentials = {
        username: credentials.email,
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
