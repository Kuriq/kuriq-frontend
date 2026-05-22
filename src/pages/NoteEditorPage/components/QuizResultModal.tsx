import { ChevronRight } from "lucide-react";
import kuriWink from "../../../assets/images/kuri-wink.png";

interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    explanation: string;
    weakTopic: string;
  }>;
}

interface QuizResultModalProps {
  quizResult: QuizResult;
  expandedQuestion: number | null;
  setExpandedQuestion: (num: number | null) => void;
  onClose: () => void;
  onRetry: () => void;
}

export function QuizResultModal({
  quizResult,
  expandedQuestion,
  setExpandedQuestion,
  onClose,
  onRetry,
}: QuizResultModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[20px] p-8 max-w-[640px] w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Quri Mascot - Winking */}
        <div className="flex justify-center mb-6">
          <img src={kuriWink} alt="" style={{ width: 80, height: 80 }} />
        </div>

        {/* Title */}
        <h2 className="text-center font-bold mb-6" style={{ color: "#2C2C2C", fontSize: "24px" }}>
          퀴즈 완료!
        </h2>

        {/* Score Circle */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="#E5E0D8" strokeWidth="12" />
              <circle
                cx="80" cy="80" r="70"
                fill="none"
                stroke="#3B6B4A"
                strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 70 * (quizResult.scorePercent / 100)} ${2 * Math.PI * 70}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-bold" style={{ color: "#2C2C2C", fontSize: "36px" }}>
                {quizResult.scorePercent}%
              </span>
            </div>
          </div>
          <p className="font-bold mb-4" style={{ color: "#2C2C2C", fontSize: "16px" }}>
            {quizResult.totalQuestions}문제 중 {quizResult.correctCount}문제 정답
          </p>
          <p className="font-bold text-center" style={{ color: "#3B6B4A", fontSize: "20px" }}>
            {quizResult.scorePercent >= 80
              ? "잘 하셨어요!"
              : quizResult.scorePercent >= 50
              ? "조금 더 노력해봐요!"
              : "복습이 필요해요!"}
          </p>
        </div>

        {/* Weak Topics Section */}
        {quizResult.results.some((r) => !r.isCorrect && r.weakTopic) && (
          <div className="mb-6">
            <h3 className="font-bold mb-3" style={{ color: "#2C2C2C", fontSize: "14px" }}>
              🔍 복습이 필요한 부분
            </h3>
            <div className="flex gap-2 flex-wrap">
              {quizResult.results
                .filter((r) => !r.isCorrect && r.weakTopic)
                .map((r, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{ backgroundColor: "#FFE4D1", color: "#D17A42" }}
                  >
                    {r.weakTopic}
                  </span>
                ))}
            </div>
          </div>
        )}

        {/* Question Breakdown (Collapsible) */}
        <div className="mb-6">
          <button
            onClick={() => setExpandedQuestion(expandedQuestion === null ? 0 : null)}
            className="w-full flex items-center justify-between mb-3 transition-colors"
            style={{ color: "#2C2C2C" }}
          >
            <h3 className="font-bold" style={{ fontSize: "14px" }}>문제별 상세 보기</h3>
            <ChevronRight
              size={20}
              className="transition-transform"
              style={{ transform: expandedQuestion !== null ? "rotate(90deg)" : "rotate(0deg)" }}
            />
          </button>

          {expandedQuestion !== null && (
            <div className="space-y-2">
              {quizResult.results.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E0D8] bg-white"
                >
                  <span style={{ fontSize: "18px" }}>{r.isCorrect ? "✓" : "✕"}</span>
                  <p className="flex-1 text-sm" style={{ color: "#2C2C2C" }}>
                    {r.explanation}
                  </p>
                  <span
                    className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                    style={{
                      backgroundColor: r.isCorrect ? "#E8F0EA" : "#FFE8E8",
                      color: r.isCorrect ? "#3B6B4A" : "#E57373",
                    }}
                  >
                    {r.isCorrect ? "정답" : "오답"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onRetry}
            className="flex-1 h-11 rounded-lg font-medium text-sm border-2 transition-colors"
            style={{ borderColor: "#3B6B4A", color: "#3B6B4A", backgroundColor: "transparent" }}
          >
            다시 풀기
          </button>
          <button
            onClick={onClose}
            className="flex-1 h-11 rounded-lg font-medium text-sm transition-opacity"
            style={{ backgroundColor: "#3B6B4A", color: "white" }}
          >
            노트로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}
