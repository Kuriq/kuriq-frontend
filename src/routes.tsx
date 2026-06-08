import { createBrowserRouter, Navigate } from "react-router";
import { useAuth } from "./context/AuthContext";
import Home from "./pages/Home";
import MyRoadmapsPage from "./pages/MyRoadmapsPage";
import RoadmapResultPage from "./pages/RoadmapResultPage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";
import AuthPage from "./pages/AuthPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import AIReviewNoteDemoPage from "./pages/AIReviewNoteDemoPage";
import QuizPage from "./pages/QuizPage";
import LearningSpacesPage from "./pages/LearningSpacesPage";
import NoteEditorPage from "./pages/NoteEditorPage";
import LoadingRoadmapPage from "./pages/LoadingRoadmapPage";
import NotFoundPage from "./pages/NotFoundPage";
import CommunityPage from "./pages/CommunityPage";
import PostCreatePage from "./pages/PostCreatePage";
import CommunityPostDetailPage from "./pages/CommunityPostDetailPage";

// ── Protected Route Wrapper ──────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // useAuth는 RouterProvider 내부에서 동작하므로 별도 컴포넌트로 분리
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
}

// ── Route Definitions ────────────────────────────────
// Public routes (로그인 없이 접근 가능)
//   /, /auth, /search, /ai-review-demo
// Protected routes (로그인 필요)
//   /roadmap, /roadmap-result, /loading-roadmap, /dashboard,
//   /mypage, /notifications, /quiz, /note-editor

export const router = createBrowserRouter([
  // Public
  { path: "/", element: <Home /> },
  { path: "/auth", element: <AuthPage /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/learning-spaces", element: <ProtectedRoute><LearningSpacesPage /></ProtectedRoute> },
  { path: "/community", element: <ProtectedRoute><CommunityPage /></ProtectedRoute> },
  { path: "/community/create", element: <ProtectedRoute><PostCreatePage /></ProtectedRoute> },
  { path: "/community/:postId/edit", element: <ProtectedRoute><PostCreatePage /></ProtectedRoute> },
  { path: "/community/:postId", element: <ProtectedRoute><CommunityPostDetailPage /></ProtectedRoute> },
  { path: "/ai-review-demo", element: <AIReviewNoteDemoPage /> },

  // Protected
  { path: "/roadmap", element: <ProtectedRoute><MyRoadmapsPage /></ProtectedRoute> },
  { path: "/roadmap-result", element: <ProtectedRoute><RoadmapResultPage /></ProtectedRoute> },
  { path: "/loading-roadmap", element: <ProtectedRoute><LoadingRoadmapPage /></ProtectedRoute> },
  { path: "/dashboard", element: <ProtectedRoute><DashboardPage /></ProtectedRoute> },
  { path: "/mypage", element: <ProtectedRoute><MyPage /></ProtectedRoute> },
  { path: "/notifications", element: <ProtectedRoute><NotificationSettingsPage /></ProtectedRoute> },
  { path: "/quiz", element: <ProtectedRoute><QuizPage /></ProtectedRoute> },
  { path: "/note-editor", element: <ProtectedRoute><NoteEditorPage /></ProtectedRoute> },

  // 404 Not Found (catch-all)
  { path: "*", element: <NotFoundPage /> },
]);
