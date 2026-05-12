import { createBrowserRouter } from "react-router";
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

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/roadmap",
    element: <MyRoadmapsPage />,
  },
  {
    path: "/roadmap-result",
    element: <RoadmapResultPage />,
  },
  {
    path: "/loading-roadmap",
    element: <LoadingRoadmapPage />,
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
  {
    path: "/note-editor",
    element: <NoteEditorPage />,
  },
]);