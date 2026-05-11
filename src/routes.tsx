import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import RoadmapPage from "./pages/Roadmap";
import DashboardPage from "./pages/Dashboard";
import SearchPage from "./pages/Search";
import MyPage from "./pages/MyPage";
import AuthPage from "./pages/Auth";
import NotificationSettingsPage from "./pages/NotificationSettings";
import AIReviewNoteDemoPage from "./pages/AIReviewNote";
import QuizPage from "./pages/Quiz";
import LearningSpacesPage from "./pages/LearningSpaces";

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