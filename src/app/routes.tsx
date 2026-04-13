import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import RoadmapPage from "./pages/RoadmapPage";
import DashboardPage from "./pages/DashboardPage";
import SearchPage from "./pages/SearchPage";
import MyPage from "./pages/MyPage";
import AuthPage from "./pages/AuthPage";
import NotificationSettingsPage from "./pages/NotificationSettingsPage";
import AIReviewNoteDemoPage from "./pages/AIReviewNoteDemoPage";
import QuizPage from "./pages/QuizPage";
import LearningSpacesPage from "./pages/LearningSpacesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/roadmap",
    element: <RoadmapPage />,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
  },
  {
    path: "/search",
    element: <SearchPage />,
  },
  {
    path: "/mypage",
    element: <MyPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/notifications",
    element: <NotificationSettingsPage />,
  },
  {
    path: "/ai-review-demo",
    element: <AIReviewNoteDemoPage />,
  },
  {
    path: "/quiz",
    element: <QuizPage />,
  },
  {
    path: "/learning-spaces",
    element: <LearningSpacesPage />,
  },
]);