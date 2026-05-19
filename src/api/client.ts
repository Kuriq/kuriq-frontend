const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function getHeaders(extra: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...extra };
  const token = localStorage.getItem("accessToken");
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: getHeaders(options.headers as Record<string, string>),
    credentials: "include",
  });

  if (res.status === 401) {
    // 토큰 만료 → refresh 시도
    const refreshed = await refreshToken();
    if (!refreshed) throw new Error("UNAUTHORIZED");
    // 재시도
    const retry = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: getHeaders(options.headers as Record<string, string>),
      credentials: "include",
    });
    if (!retry.ok) throw new Error(`HTTP ${retry.status}`);
    return retry.json();
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.message || `HTTP ${res.status}`);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────

export async function login(email: string, password: string) {
  return request<{ accessToken: string }>("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function signup(email: string, password: string, name: string, ageGroup?: string) {
  return request<{ message: string }>("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, password, name, ageGroup }),
  });
}

export async function logout() {
  return request<void>("/api/v1/auth/logout", { method: "POST" });
}

export async function refreshToken() {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) return false;
    const data = await res.json();
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export async function getSocialAuthorizeUrl(provider: "kakao" | "google" | "naver") {
  return request<{ authorizationUrl: string }>(`/api/v1/auth/social/${provider}/authorize`);
}

export async function socialCallback(code: string, state?: string) {
  const params = new URLSearchParams({ code });
  if (state) params.set("state", state);
  return request<{ accessToken: string }>(`/api/v1/auth/social/callback?${params}`);
}

// ── Course Search ─────────────────────────────────────

export interface CourseSearchResult {
  content: Array<{
    id: string;
    title: string;
    platform: string;
    institution: string;
    category: string;
    difficulty: string;
    durationWeeks: number;
    estimatedHours: number;
    hasCertificate: boolean;
    url: string;
  }>;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
}

export async function searchCourses(params: {
  keyword?: string;
  platform?: string;
  difficulty?: string;
  category?: string;
  page?: number;
  size?: number;
}) {
  const qs = new URLSearchParams();
  if (params.keyword) qs.set("keyword", params.keyword);
  if (params.platform) qs.set("platform", params.platform);
  if (params.difficulty) qs.set("difficulty", params.difficulty);
  if (params.category) qs.set("category", params.category);
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.size !== undefined) qs.set("size", String(params.size));
  return request<CourseSearchResult>(`/api/v1/courses/search?${qs}`);
}

// ── Study Spaces ──────────────────────────────────────

export interface StudySpace {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  phone: string;
  hasWifi: boolean;
  hasPowerOutlet: boolean;
  distanceMeters: number;
}

export async function getNearbySpaces(lat: number, lng: number, radius = 2000) {
  return request<StudySpace[]>(`/api/v1/spaces/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
}

// ── User Profile ──────────────────────────────────────

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  ageGroup?: string;
}

export async function getProfile() {
  return request<UserProfile>("/api/v1/users/me");
}

export async function deleteAccount(password?: string) {
  if (password) {
    return request<void>(`/api/v1/users/me?password=${encodeURIComponent(password)}`, { method: "DELETE" });
  }
  return request<void>("/api/v1/users/me", { method: "DELETE" });
}

// ── Social Accounts ───────────────────────────────────

export interface SocialAccount {
  id: string;
  provider: string;
  email: string;
  linkedAt: string;
}

export async function getSocialAccounts() {
  return request<SocialAccount[]>("/api/v1/users/me/social-accounts");
}

export async function unlinkSocialAccount(provider: string) {
  return request<void>(`/api/v1/users/me/social-accounts/${provider}`, { method: "DELETE" });
}

// ── Notification Settings ─────────────────────────────

export interface NotificationSettings {
  emailEnabled: boolean;
  kakaoEnabled: boolean;
  learningDay: string;
  learningTime: string;
  weeklyStartAlert: boolean;
  incompleteReminder: boolean;
  inactivityAlert: boolean;
  completionAlert: boolean;
}

export async function getNotificationSettings() {
  return request<NotificationSettings>("/api/v1/users/me/notifications/settings");
}

export async function updateNotificationSettings(settings: Partial<NotificationSettings>) {
  return request<NotificationSettings>("/api/v1/users/me/notifications/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}

// ── Learning Stats ────────────────────────────────────

export interface UserStats {
  totalCompletedCourses: number;
  totalLearningHours: number;
  streakDays: number;
  completedRoadmapCount: number;
}

export async function getUserStats() {
  return request<UserStats>("/api/v1/users/me/stats");
}

export interface CategoryStat {
  category: string;
  completedCount: number;
  progressPercent: number;
}

export async function getCategoryStats() {
  return request<CategoryStat[]>("/api/v1/users/me/stats/categories");
}

export interface LearningHistoryItem {
  id: string;
  courseId: string;
  courseTitle: string;
  platform: string;
  category: string;
  completedAt: string;
  sourceRoadmapId: string;
}

export async function getLearningHistory(page = 0, size = 20) {
  return request<LearningHistoryItem[]>(`/api/v1/users/me/history?page=${page}&size=${size}`);
}
