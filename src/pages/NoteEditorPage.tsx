import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { ChevronRight } from "lucide-react";
import kuriWink from "../../assets/images/kuri-wink.png";
import { useNote } from "./NoteEditorPage/useNote";
import { useNoteChat } from "./NoteEditorPage/useNoteChat";
import { useNoteQuiz } from "./NoteEditorPage/useNoteQuiz";
import { EditorToolbar } from "./NoteEditorPage/components/EditorToolbar";
import { OrganizeTab } from "./NoteEditorPage/components/OrganizeTab";
import { ChatTab } from "./NoteEditorPage/components/ChatTab";
import { QuizTab } from "./NoteEditorPage/components/QuizTab";
import { QuizResultModal } from "./NoteEditorPage/components/QuizResultModal";

export default function NoteEditorPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId") || "";

  const [activeTab, setActiveTab] = useState<"organize" | "quiz" | "chat">("chat");

  // Custom hooks
  const {
    noteContent,
    courseTitle,
    courseCategory,
    platform,
    characterCount,
    lastSavedAt,
    saving,
    loading,
    noteId,
    aiOrganizeResult,
    showOrganizeResult,
    setNoteContent,
    handleAiOrganize,
    handleManualSave,
    addContentToNote,
  } = useNote(courseId);

  const {
    chatMessages,
    chatInput,
    chatLoading,
    setChatInput,
    handleSendMessage,
    chatEndRef,
  } = useNoteChat(courseId);

  const {
    quizStarted,
    quizLoading,
    quizSessionId,
    quizQuestions,
    currentQuestion,
    quizAnswers,
    quizResult,
    showQuizResult,
    expandedQuestion,
    handleStartQuiz,
    handleSelectAnswer,
    handleNextQuestion,
    handleSubmitQuiz,
    setShowQuizResult,
    setExpandedQuestion,
  } = useNoteQuiz(courseId);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F6F1" }}>
      <Navigation activeMenu="" />

      <div className="max-w-[1440px] mx-auto px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors"
          style={{ color: "#777777" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#3B6B4A")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#777777")}
        >
          <span>←</span>
          <span>대시보드</span>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-[600px]">
            <p className="text-[16px] text-[#777777]">노트를 불러오는 중...</p>
          </div>
        ) : (
          <div className="flex gap-4">
          {/* LEFT AREA - Note Editor (60%) */}
          <div className="flex-[6] flex flex-col gap-4">
            {/* Header Strip */}
            <div className="bg-white rounded-xl p-4 border border-[#E5E0D8]">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg font-bold" style={{ color: "#2C2C2C" }}>
                  {courseTitle || "강좌명 로딩 중..."}
                </h1>
                {platform && (
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#E8F0EA", color: "#3B6B4A" }}
                  >
                    {platform}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: "#AAAAAA" }}>
                  {characterCount}자
                </span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleManualSave}
                    disabled={!noteId || saving || !noteContent}
                    className="px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1"
                    style={{
                      backgroundColor: saving || !noteContent ? "#E5E0D8" : "#3B6B4A",
                      color: "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      if (!saving && noteContent) {
                        e.currentTarget.style.backgroundColor = "#2D553A";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!saving && noteContent) {
                        e.currentTarget.style.backgroundColor = "#3B6B4A";
                      }
                    }}
                  >
                    {saving ? "💾 저장 중..." : "💾 저장하기"}
                  </button>
                  <span className="text-[11px]" style={{ color: "#AAAAAA" }}>
                    {lastSavedAt
                      ? `자동 저장됨 · ${new Date(lastSavedAt).toLocaleTimeString()}`
                      : "저장되지 않음"}
                  </span>
                </div>
              </div>
            </div>

            {/* Editor Toolbar */}
            <EditorToolbar onAiOrganize={handleAiOrganize} disabled={!noteId || loading} />

            {/* Main Editor Area */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E0D8] min-h-[500px]">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-full min-h-[480px] resize-none outline-none font-normal leading-relaxed"
                style={{
                  color: "#2C2C2C",
                  fontSize: "14px",
                  lineHeight: "1.8",
                  fontFamily: 'Pretendard, "Noto Sans KR", sans-serif',
                }}
                placeholder="노트를 작성해보세요..."
              />
            </div>
          </div>

          {/* RIGHT PANEL - AI Assistant (40%) */}
          <div className="flex-[4] flex flex-col gap-4">
            {/* Tab Selector */}
            <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => {
                    setActiveTab("organize");
                    setShowAIResult(false);
                  }}
                  className="flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2"
                  style={{
                    color: activeTab === "organize" ? "#3B6B4A" : "#777777",
                    borderBottomColor: activeTab === "organize" ? "#3B6B4A" : "transparent",
                    backgroundColor: activeTab === "organize" ? "#F8F6F1" : "transparent",
                  }}
                >
                  🤖 AI 정리
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2"
                  style={{
                    color: activeTab === "quiz" ? "#3B6B4A" : "#777777",
                    borderBottomColor: activeTab === "quiz" ? "#3B6B4A" : "transparent",
                    backgroundColor: activeTab === "quiz" ? "#F8F6F1" : "transparent",
                  }}
                >
                  📝 퀴즈 풀기
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2"
                  style={{
                    color: activeTab === "chat" ? "#3B6B4A" : "#777777",
                    borderBottomColor: activeTab === "chat" ? "#3B6B4A" : "transparent",
                    backgroundColor: activeTab === "chat" ? "#F8F6F1" : "transparent",
                  }}
                >
                  💬 큐리에게 질문
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "organize" && (
                  <div className="max-h-[500px] overflow-y-auto">
                    <OrganizeTab
                      aiOrganizeResult={aiOrganizeResult}
                      showAIResult={showOrganizeResult}
                      onAiOrganize={handleAiOrganize}
                      onAddSummaryLine={(line: string) => {
                        if (line.trim()) {
                          addContentToNote(line);
                        }
                      }}
                      onAddSuggestion={(suggestion: string) => {
                        addContentToNote(suggestion);
                      }}
                    />
                  </div>
                )}
                {activeTab === "quiz" && (
                  <QuizTab
                    quizStarted={quizStarted}
                    quizLoading={quizLoading}
                    quizQuestions={quizQuestions}
                    currentQuestion={currentQuestion}
                    quizAnswers={quizAnswers}
                    quizResult={quizResult}
                    handleStartQuiz={handleStartQuiz}
                    handleSelectAnswer={handleSelectAnswer}
                    handleNextQuestion={handleNextQuestion}
                    handleSubmitQuiz={handleSubmitQuiz}
                  />
                )}
                {activeTab === "chat" && (
                  <ChatTab
                    chatMessages={chatMessages}
                    chatInput={chatInput}
                    chatLoading={chatLoading}
                    setChatInput={setChatInput}
                    handleSendMessage={handleSendMessage}
                    chatEndRef={chatEndRef}
                  />
                )}
              </div>
            </div>
          </div>
          </div>
        )}
      </div>

      {/* Quiz Result Modal */}
      {showQuizResult && quizResult && (
        <QuizResultModal
          quizResult={quizResult}
          expandedQuestion={expandedQuestion}
          setExpandedQuestion={setExpandedQuestion}
          onClose={() => setShowQuizResult(false)}
          onRetry={async () => {
            setShowQuizResult(false);
            await handleStartQuiz();
          }}
        />
      )}
    </div>
  );
}
