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

  if (res.status === 401 || res.status === 403) {
    // 토큰 만료 또는 인증 실패 → refresh 시도
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

export interface CourseSearchItem {
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
}

export interface CourseSearchResult {
  content: CourseSearchItem[];
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
  sort?: string;
  page?: number;
  size?: number;
}) {
  const qs = new URLSearchParams();
  if (params.keyword) qs.set("keyword", params.keyword);
  if (params.platform) qs.set("platform", params.platform);
  if (params.difficulty) qs.set("difficulty", params.difficulty);
  if (params.category) qs.set("category", params.category);
  if (params.sort) qs.set("sort", params.sort);
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.size !== undefined) qs.set("size", String(params.size));
  return request<CourseSearchResult>(`/api/v1/courses/search?${qs}`);
}

// ── Course Reviews ─────────────────────────────────────

export type CourseReviewPriorKnowledge = "BEGINNER" | "LITTLE" | "INTERMEDIATE" | "ADVANCED";
export type CourseReviewDifficultyMatch = "EASY" | "FIT" | "HARD";

export interface CourseReviewSummary {
  averageRating: number;
  reviewCount: number;
}

export interface CourseReviewItem {
  id: string;
  authorId: string;
  authorName: string;
  anonymous: boolean;
  rating: number;
  content: string | null;
  priorKnowledge: CourseReviewPriorKnowledge | null;
  difficultyMatch: CourseReviewDifficultyMatch | null;
  likeCount: number;
  likedByMe: boolean;
  createdAt: string;
}

export interface CourseReviewPageResponse {
  content: CourseReviewItem[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface CourseReviewLikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface CourseReviewUpsertRequest {
  rating: number;
  content?: string;
  anonymous?: boolean;
  priorKnowledge?: CourseReviewPriorKnowledge | null;
  difficultyMatch?: CourseReviewDifficultyMatch | null;
}

export async function getCourseReviewSummary(courseId: string) {
  return request<CourseReviewSummary>(`/api/v1/courses/${courseId}/reviews/summary`);
}

export async function getCourseReviews(courseId: string, params: { page?: number; size?: number } = {}) {
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.size !== undefined) qs.set("size", String(params.size));
  return request<CourseReviewPageResponse>(`/api/v1/courses/${courseId}/reviews?${qs.toString()}`);
}

export async function getMyCourseReview(courseId: string) {
  return request<CourseReviewItem | undefined>(`/api/v1/courses/${courseId}/reviews/me`);
}

export async function createCourseReview(courseId: string, data: CourseReviewUpsertRequest) {
  return request<CourseReviewItem>(`/api/v1/courses/${courseId}/reviews`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMyCourseReview(courseId: string, data: CourseReviewUpsertRequest) {
  return request<CourseReviewItem>(`/api/v1/courses/${courseId}/reviews/me`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMyCourseReview(courseId: string) {
  return request<void>(`/api/v1/courses/${courseId}/reviews/me`, {
    method: "DELETE",
  });
}

export async function toggleCourseReviewLike(reviewId: string) {
  return request<CourseReviewLikeResponse>(`/api/v1/reviews/${reviewId}/like`, {
    method: "POST",
  });
}

// ── Community Posts ───────────────────────────────────

export interface CommunityPostSummary {
  id: string;
  title: string;
  authorName: string;
  anonymous: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
}

export interface CommunityPostComment {
  id: string;
  authorId: string;
  authorName: string | null;
  anonymous: boolean;
  content: string;
  isDeleted: boolean;
  parentId: string | null;
  createdAt: string;
  replies: CommunityPostComment[];
}

export interface CommunityPostDetail {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  anonymous: boolean;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  createdAt: string;
  updatedAt: string;
  comments: CommunityPostComment[];
}

export interface CommunityPostPageResponse {
  content: CommunityPostSummary[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  hasNext: boolean;
}

export interface CommunityLikeResponse {
  liked: boolean;
  likeCount: number;
}

export interface CommunityCreatePostRequest {
  title: string;
  content: string;
  anonymous?: boolean;
}

export interface CommunityCreateCommentRequest {
  content: string;
  anonymous?: boolean;
  parentId?: string | null;
}

export async function getCommunityPosts(params: {
  sort?: "latest" | "views" | "popular";
  page?: number;
  size?: number;
}) {
  const qs = new URLSearchParams();
  if (params.sort) qs.set("sort", params.sort);
  if (params.page !== undefined) qs.set("page", String(params.page));
  if (params.size !== undefined) qs.set("size", String(params.size));
  return request<CommunityPostPageResponse>(`/api/v1/posts?${qs.toString()}`);
}

export async function getCommunityPost(postId: string, options?: { increaseView?: boolean }) {
  const qs = new URLSearchParams();
  if (options?.increaseView !== undefined) qs.set("increaseView", String(options.increaseView));
  return request<CommunityPostDetail>(`/api/v1/posts/${postId}${qs.toString() ? `?${qs.toString()}` : ""}`);
}

export async function createCommunityPost(data: CommunityCreatePostRequest) {
  return request<CommunityPostSummary>("/api/v1/posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function toggleCommunityPostLike(postId: string) {
  return request<CommunityLikeResponse>(`/api/v1/posts/${postId}/like`, {
    method: "POST",
  });
}

export async function createCommunityComment(postId: string, data: CommunityCreateCommentRequest) {
  return request<CommunityPostComment>(`/api/v1/posts/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Study Spaces ──────────────────────────────────────

export interface StudySpace {
  id: string;
  name: string;
  type: string;
  address: string;
  latitude: number;
  longitude: number;
  operatingHours: string | null;
  phone: string | null;
  hasWifi: boolean | null;
  hasPowerOutlet: boolean | null;
  distanceMeters: number;
}

export async function getNearbySpaces(lat: number, lng: number, radius = 2000, type?: string) {
  const qs = new URLSearchParams({ lat: String(lat), lng: String(lng), radius: String(radius) });
  if (type && type !== "all") qs.set("type", type);
  return request<StudySpace[]>(`/api/v1/spaces/nearby?${qs.toString()}`);
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

// ── Roadmap ───────────────────────────────────────────

export interface RoadmapCourse {
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
}

export interface RoadmapItem {
  id: string;
  weekNumber: number;
  orderInWeek: number;
  isCompleted: boolean;
  completedAt: string | null;
  course: RoadmapCourse;
}

export interface RoadmapWeek {
  weekNumber: number;
  title: string;
  description: string;
  totalHours: number;
  completedCount: number;
  totalCount: number;
  weekProgressPercent: number;
  items: RoadmapItem[];
}

export interface Roadmap {
  id: string;
  title: string;
  goal: string;
  prompt: string;
  totalWeeks: number;
  weeklyHours: number;
  totalCourses: number;
  isActive: boolean;
  isCompleted: boolean;
  currentWeek: number;
  progressPercent: number;
  createdAt: string;
  activatedAt: string | null;
  completedAt: string | null;
  weeks: RoadmapWeek[];
}

export interface RoadmapListResponse {
  content: Roadmap[];
  currentPage: number;
  size: number;
}

export async function generateRoadmap(prompt: string) {
  return request<Roadmap>("/api/v1/roadmap/generate", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
}

export async function getMyRoadmaps(page = 0, size = 10) {
  return request<RoadmapListResponse>(`/api/v1/roadmap/me?page=${page}&size=${size}`);
}

export async function getRoadmap(roadmapId: string) {
  return request<Roadmap>(`/api/v1/roadmap/${roadmapId}`);
}

export async function activateRoadmap(roadmapId: string) {
  return request<Roadmap>(`/api/v1/roadmap/${roadmapId}/activate`, {
    method: "PATCH",
  });
}

export async function deleteRoadmap(roadmapId: string) {
  return request<void>(`/api/v1/roadmap/${roadmapId}`, { method: "DELETE" });
}

// ── Quiz ──────────────────────────────────────────────

export interface QuizQuestion {
  questionId: string;
  type: string; // "MULTIPLE_CHOICE" | "TRUE_FALSE" | "SHORT_ANSWER"
  question: string;
  options?: Array<{ id: string; text: string }>;
}

export interface QuizGenerateResponse {
  quizSessionId: string;
  courseId: string;
  noteId: string;
  questions: QuizQuestion[];
}

export async function generateQuiz(noteId: string, excludeSessionIds?: string[]) {
  return request<QuizGenerateResponse>("/api/v1/quiz/generate", {
    method: "POST",
    body: JSON.stringify({ noteId, excludeSessionIds }),
  });
}

export interface QuizAnswer {
  questionId: string;
  answer: string | boolean;
}

export interface QuizSubmitRequest {
  answers: QuizAnswer[];
}

export interface QuizResult {
  questionId: string;
  type: string;
  isCorrect: boolean;
  result: string; // "CORRECT" | "PARTIAL" | "WRONG" | "GRADING_FAILED"
  userAnswer: string | boolean;
  correctAnswer: string | boolean;
  explanation: string;
  feedback: string;
  noteReference: string;
  weakTopic: string;
}

export interface QuizSubmitResponse {
  quizSessionId: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  results: QuizResult[];
  quriMessage: string;
  weakTopics: string[];
}

export async function submitQuiz(quizSessionId: string, answers: QuizAnswer[]) {
  return request<QuizSubmitResponse>(`/api/v1/quiz/${quizSessionId}/submit`, {
    method: "POST",
    body: JSON.stringify({ answers }),
  });
}

export interface QuizHistoryItem {
  quizSessionId: string;
  courseId: string;
  courseTitle: string;
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  submittedAt: string | null;
  createdAt: string;
}

export interface QuizHistoryResponse {
  content: QuizHistoryItem[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}

export async function getQuizHistory(courseId?: string, page = 0, size = 10) {
  const qs = new URLSearchParams();
  if (courseId) qs.set("courseId", courseId);
  qs.set("page", String(page));
  qs.set("size", String(size));
  return request<QuizHistoryResponse>(`/api/v1/quiz/history?${qs}`);
}

// ── Note Chat ─────────────────────────────────────────

export interface ChatMessage {
  chatId: string;
  role: string; // "user" | "assistant"
  message: string;
  noteReferences?: string[];
  timestamp: string;
}

export interface ChatHistoryResponse {
  content: ChatMessage[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
}

export async function getChatHistory(noteId: string, page = 0, size = 20) {
  return request<ChatHistoryResponse>(
    `/api/v1/notes/${noteId}/chat/history?page=${page}&size=${size}`
  );
}

export interface ChatSendResponse {
  chatId: string;
  role: string;
  message: string;
  noteReferences?: string[];
  timestamp: string;
}

export async function sendChatMessage(noteId: string, message: string) {
  return request<ChatSendResponse>(`/api/v1/notes/${noteId}/chat`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}

export async function resetChatHistory(noteId: string) {
  return request<{ message: string }>(`/api/v1/notes/${noteId}/chat/history`, {
    method: "DELETE",
  });
}

// ── Note ──────────────────────────────────────────────

export interface NoteCreateRequest {
  courseId: string;
  content: string;
}

export interface NoteCreateResponse {
  noteId: string;
  courseId: string;
  message: string;
}

export interface NoteDetail {
  noteId: string;
  courseId: string;
  courseTitle: string;
  platform: string;
  content: string;
  characterCount: number;
  lastSavedAt: string;
  createdAt: string;
}

export interface NoteSaveRequest {
  content: string;
}

export interface NoteSaveResponse {
  noteId: string;
  message: string;
  lastSavedAt: string;
}

export interface AiOrganizeResponse {
  keywords: string[];
  structuredSummary: string;
  suggestions: string[];
}

export async function createNote(data: NoteCreateRequest) {
  return request<NoteCreateResponse>("/api/v1/notes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getNoteByCourse(courseId: string) {
  return request<NoteDetail>(`/api/v1/notes?courseId=${courseId}`);
}

export async function saveNote(noteId: string, data: NoteSaveRequest) {
  return request<NoteSaveResponse>(`/api/v1/notes/${noteId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function aiOrganizeNote(noteId: string, courseCategory: string) {
  return request<AiOrganizeResponse>(`/api/v1/notes/${noteId}/ai-organize`, {
    method: "POST",
    body: JSON.stringify({ courseCategory }),
  });
}

export async function deleteNote(noteId: string) {
  return request<{ message: string }>(`/api/v1/notes/${noteId}`, {
    method: "DELETE",
  });
}

// ── Progress ────────────────────────────────────────────

export interface RoadmapItemResponse {
  id: string;
  weekNumber: number;
  orderInWeek: number;
  isCompleted: boolean;
  completedAt: string | null;
  course: RoadmapCourse;
}

export async function completeItem(roadmapItemId: string) {
  return request<RoadmapItemResponse>("/api/v1/progress/complete", {
    method: "POST",
    body: JSON.stringify({ roadmapItemId }),
  });
}

export async function uncompleteItem(roadmapItemId: string) {
  return request<RoadmapItemResponse>(`/api/v1/progress/complete/${roadmapItemId}`, {
    method: "DELETE",
  });
}
