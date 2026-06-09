import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { login as apiLogin, signup as apiSignup, logout as apiLogout, getProfile, type UserProfile } from "../api/client";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, ageGroup?: string) => Promise<void>;
  logout: () => Promise<void>;
  setUserProfile: (profile: UserProfile | null) => void;
  refreshUser: () => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(true);

  // 앱 최초 로드 시 토큰 검증
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setIsLoading(false);
      return;
    }
    getProfile()
      .then((profile) => setUser(profile))
      .catch(() => {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      return;
    }
    const profile = await getProfile();
    setUser(profile);
  }, []);

  // 다른 탭에서 로그아웃 시 동기화
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
    const profile = await getProfile().catch(() => null);
    if (profile) setUser(profile);
    setAccessToken(res.accessToken);
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
    <AuthContext.Provider value={{ isAuthenticated: !!accessToken, isLoading, accessToken, user, login, signup, logout, setUserProfile: setUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
