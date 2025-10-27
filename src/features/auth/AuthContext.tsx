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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // This effect will run once on mount to check for an existing session
    const token = localStorage.getItem("authToken");
    if (token) {
      // Here you might want to add a call to an API endpoint like `/auth/me`
      // to verify the token and get fresh user data. For now, we'll assume
      // the token means the user is authenticated.
      setIsAuthenticated(true);
      // You might need to fetch user data here and setUser()
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (credentials: { email: string; password: string }) => {
      // Map the form's `email` field to the API's `identifier` field.
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
        // Log the detailed error from the server to the console
        console.error("Login failed:", error.response?.data || error.message);

        // Re-throw the error so the UI layer (e.g., the form) can catch it and display a message
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
      // Immediately update the authentication state
      setIsAuthenticated(false);
      setUser(null);
      // Clear the token from storage
      localStorage.removeItem("authToken");
      // Redirect to the sign-in page
      router.push("/sign-in");
    }
  }, [router]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, isLoading, login, logout }}
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
