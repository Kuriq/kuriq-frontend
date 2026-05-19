import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout } from "../api/client";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, ageGroup?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken")
  );

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "accessToken") setAccessToken(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem("accessToken", res.accessToken);
    setAccessToken(res.accessToken);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, ageGroup?: string) => {
    await apiSignup(email, password, name, ageGroup);
    // 회원가입 후 자동 로그인
    await login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // 서버 로그아웃 실패해도 로컬에서는 제거
    }
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!accessToken, accessToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
