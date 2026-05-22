import { type QuizQuestion } from "../../../api/client";

interface QuizTabProps {
  quizStarted: boolean;
  quizLoading: boolean;
  quizQuestions: QuizQuestion[];
  currentQuestion: number;
  quizAnswers: Record<number, string>;
  quizResult: { totalQuestions: number; correctCount: number; scorePercent: number } | null;
  handleStartQuiz: () => void;
  handleSelectAnswer: (optionId: string) => void;
  handleSubmitQuiz: () => void;
}

export function QuizTab({
  quizStarted,
  quizLoading,
  quizQuestions,
  currentQuestion,
  quizAnswers,
  quizResult,
  handleStartQuiz,
  handleSelectAnswer,
  handleSubmitQuiz,
}: QuizTabProps) {
  if (!quizStarted) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold" style={{ color: "#2C2C2C", fontSize: "16px" }}>
            노트 내용 기반 퀴즈
          </h3>
          <span className="text-sm" style={{ color: "#777777" }}>
            AI 생성
          </span>
        </div>
        <button
          onClick={handleStartQuiz}
          disabled={quizLoading}
          className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
          style={{ backgroundColor: "#3B6B4A", color: "white" }}
        >
          {quizLoading ? "생성 중..." : "🎯 퀴즈 시작하기"}
        </button>
      </div>
    );
  }

  if (quizResult) {
    return (
      <div className="text-center">
        <h3 className="font-bold mb-2" style={{ color: "#2C2C2C", fontSize: "18px" }}>
          퀴즈 완료!
        </h3>
        <p className="text-sm mb-4" style={{ color: "#777777" }}>
          {quizResult.totalQuestions}문제 중 {quizResult.correctCount}문제 정답 ({quizResult.scorePercent}%)
        </p>
        <button
          onClick={handleSubmitQuiz}
          className="w-full h-11 rounded-lg font-medium text-sm"
          style={{ backgroundColor: "#3B6B4A", color: "white" }}
        >
          결과 상세 보기
        </button>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];
  if (!question) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold" style={{ color: "#2C2C2C", fontSize: "16px" }}>
          노트 내용 기반 퀴즈
        </h3>
        <span className="text-sm" style={{ color: "#777777" }}>
          {quizQuestions.length}문제
        </span>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: "#2C2C2C" }}>
            문제 {currentQuestion + 1} / {quizQuestions.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {quizQuestions.map((_, num) => (
            <div
              key={num}
              className="w-3 h-3 rounded-full"
              style={{
                backgroundColor: num <= currentQuestion ? "#3B6B4A" : "#E5E0D8",
              }}
            />
          ))}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E0D8]">
        <span
          className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3"
          style={{ backgroundColor: "#E8F0EA", color: "#3B6B4A" }}
        >
          {question.type === "MULTIPLE_CHOICE" ? "객관식" : question.type === "TRUE_FALSE" ? "OX" : "단답형"}
        </span>

        <h4 className="font-bold mb-4" style={{ color: "#2C2C2C", fontSize: "15px", lineHeight: "1.5" }}>
          {question.question}
        </h4>

        {question.options && (
          <div className="flex flex-col gap-2">
            {question.options.map((option) => {
              const isSelected = quizAnswers[currentQuestion] === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelectAnswer(option.id)}
                  className="w-full min-h-[48px] px-4 py-3 rounded-lg text-left text-sm transition-all flex items-center justify-between gap-2"
                  style={{
                    backgroundColor: isSelected ? "#F8F6F1" : "white",
                    border: `1px solid ${isSelected ? "#3B6B4A" : "#E5E0D8"}`,
                    color: "#2C2C2C",
                  }}
                >
                  <span>
                    <strong>{option.id}.</strong> {option.text}
                  </span>
                  {isSelected && (
                    <span className="text-sm font-bold whitespace-nowrap" style={{ color: "#3B6B4A" }}>
                      ✓ 선택
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Next / Submit Button */}
      <button
        onClick={() => {
          if (currentQuestion < quizQuestions.length - 1) {
            // 다음 문제 (실제로는 useNoteQuiz 에서 처리)
          } else {
            handleSubmitQuiz();
          }
        }}
        disabled={!quizAnswers[currentQuestion] || quizLoading}
        className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-40"
        style={{
          backgroundColor: quizAnswers[currentQuestion] ? "#3B6B4A" : "#E5E0D8",
          color: quizAnswers[currentQuestion] ? "white" : "#AAAAAA",
        }}
      >
        {quizLoading ? "채점 중..." : currentQuestion < quizQuestions.length - 1 ? "다음 문제 →" : "퀴즈 제출하기"}
      </button>
    </div>
  );
}
