import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getProfile, type UserProfile } from "../api/client";

interface AuthContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: UserProfile | null;
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
  const [user, setUser] = useState<UserProfile | null>(null);

  // Fetch profile on mount if token exists
  useEffect(() => {
    if (accessToken) {
      getProfile()
        .then(setUser)
        .catch(() => {
          // 토큰이 유효하지 않으면 제거
          localStorage.removeItem("accessToken");
          setAccessToken(null);
          setUser(null);
        });
    }
  }, [accessToken]);

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
    const profile = await getProfile();
    setUser(profile);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, ageGroup?: string) => {
    await apiSignup(email, password, name, ageGroup);
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
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!accessToken, accessToken, user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
