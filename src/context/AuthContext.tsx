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

  // 마운트 시 한 번만 실행 — accessToken 변경 시 재실행 안 함
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      getProfile()
        .then((profile) => {
          setUser(profile);
        })
        .catch(() => {
          // 다시 확인 — login()이 이미 토큰을 저장했을 수 있음
          const currentToken = localStorage.getItem("accessToken");
          if (!currentToken) {
            // 토큰이 유효하지 않으면 제거
            localStorage.removeItem("accessToken");
            setAccessToken(null);
            setUser(null);
          }
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []); // 빈 배열 → 마운트 시 한 번만

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      return;
    }
    const profile = await getProfile();
    setUser(profile);
  }, []);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "accessToken") setAccessToken(e.newValue);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    localStorage.setItem("accessToken", res.accessToken); // 먼저 저장 → getProfile이 토큰 읽을 수 있음
    try {
      const profile = await getProfile(); // localStorage에서 토큰 읽어서 호출
      setUser(profile);
    } catch (e) {
      console.error("❌ getProfile 실패:", e); // 실패해도 로그인은 유지
    }
    setAccessToken(res.accessToken); // getProfile 성공/실패 상관없이 반드시 실행
    setIsLoading(false);
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string, ageGroup?: string) => {
    await apiSignup(email, password, name, ageGroup);
    await login(email, password);
  }, [login]);

  const logout = useCallback(async () => {
    console.error("logout 호출됨!", new Error().stack); // 호출 위치 추적
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
      {console.log("🔍 accessToken state:", accessToken) as any}
      {children}
    </AuthContext.Provider>
  );
}
