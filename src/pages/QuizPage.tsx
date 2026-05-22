import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { OwlMascot } from "../components/common/OwlMascot";
import { generateQuiz, submitQuiz, type QuizQuestion, type QuizResult } from "../api/client";

type QuizPhase = "loading" | "answering" | "feedback" | "result";

export default function QuizPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const noteId = searchParams.get("noteId") || "";

  const [phase, setPhase] = useState<QuizPhase>("loading");
  const [quizSessionId, setQuizSessionId] = useState<string>("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shortAnswer, setShortAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate quiz on mount
  useEffect(() => {
    if (!noteId) {
      setError("노트 ID가 없습니다.");
      setPhase("result");
      return;
    }
    setLoading(true);
    generateQuiz(noteId)
      .then((res) => {
        setQuizSessionId(res.quizSessionId);
        setQuestions(res.questions);
        setPhase("answering");
      })
      .catch(() => setError("퀴즈 생성에 실패했습니다."))
      .finally(() => setLoading(false));
  }, [noteId]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    setSelectedOption(optionId);
  };

  const handleSubmitAnswer = async () => {
    if (!currentQuestion) return;

    // For multiple choice, show feedback immediately
    if (currentQuestion.type === "MULTIPLE_CHOICE") {
      setShowFeedback(true);
      return;
    }

    // For short answer / true-false, move to next or submit
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShortAnswer("");
      return;
    }

    // Last question — submit all answers
    await submitAllAnswers();
  };

  const submitAllAnswers = async () => {
    if (!quizSessionId) return;
    setLoading(true);
    try {
      // Build answers from state
      const answers = questions.map((q, i) => {
        // This is simplified — in production you'd track all answers
        return { questionId: q.questionId, answer: selectedOption || shortAnswer || "" };
      });
      const res = await submitQuiz(quizSessionId, answers);
      setResults(res.results);
      setPhase("result");
    } catch {
      setError("채점에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShortAnswer("");
      setShowFeedback(false);
    } else {
      submitAllAnswers();
    }
  };

  if (loading && phase === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center">
          <OwlMascot size={80} variant="normal" />
          <p className="mt-4 text-[16px] text-[#777777]">AI가 퀴즈를 만들고 있어요...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] text-red-600 mb-4">{error}</p>
          <button onClick={() => navigate("/dashboard")} className="px-6 py-2.5 bg-[#3B6B4A] text-white rounded-full font-[600] text-[14px]">
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const correctCount = results.filter((r) => r.isCorrect).length;
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <header className="bg-[#F8F6F1] py-6 px-8 border-b border-[#E5E0D8]">
          <div className="max-w-[1200px] mx-auto">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[14px] text-[#777777] hover:text-[#2C2C2C] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              대시보드로 돌아가기
            </button>
          </div>
        </header>
        <main className="flex-1 px-8 py-12">
          <div className="max-w-[640px] mx-auto text-center">
            <OwlMascot size={80} variant="winking" />
            <h2 className="text-[28px] font-[800] text-[#2C2C2C] mt-6 mb-2">퀴즈 완료!</h2>
            <p className="text-[18px] text-[#777777] mb-8">
              총 {results.length}문제 중 {correctCount}문제 정답
            </p>
            <div className="space-y-4 text-left">
              {results.map((result, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${result.isCorrect ? "bg-[#E8F0EA] border-[#3B6B4A]" : "bg-[#FFE8E8] border-[#D84848]"}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[16px] font-[800]">Q{i + 1}</span>
                    {result.isCorrect ? (
                      <span className="px-2 py-0.5 bg-[#3B6B4A] text-white rounded-full text-[12px] font-[600]">정답</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-[#D84848] text-white rounded-full text-[12px] font-[600]">오답</span>
                    )}
                  </div>
                  <p className="text-[14px] text-[#2C2C2C] mb-2">{result.explanation}</p>
                  {result.feedback && <p className="text-[13px] text-[#777777]">{result.feedback}</p>}
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-8 w-full py-4 bg-[#3B6B4A] text-white rounded-2xl text-[16px] font-[800] hover:bg-[#2d5438] transition-colors"
            >
              대시보드로 돌아가기
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <header className="bg-[#F8F6F1] py-6 px-8 border-b border-[#E5E0D8]">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-[14px] text-[#777777] hover:text-[#2C2C2C] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              대시보드로 돌아가기
            </button>
            <div className="text-center">
              <h1 className="text-[20px] font-[800] text-[#3B6B4A] mb-2">AI 맞춤 퀴즈</h1>
              <p className="text-[13px] text-[#777777] font-[600]">
                문제 {currentQuestionIndex + 1} / {questions.length}
              </p>
            </div>
          </div>
          <div className="w-full max-w-[600px] mx-auto">
            <div className="h-2 bg-[#E5E0D8] rounded-full overflow-hidden">
              <div className="h-full bg-[#3B6B4A] transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[640px] mx-auto mt-8">
          <h2 className="text-[24px] font-[800] text-[#2C2C2C] leading-relaxed mb-8">
            {currentQuestion.question}
          </h2>

          {currentQuestion.type === "MULTIPLE_CHOICE" && currentQuestion.options && (
            <div className="space-y-3 mb-10">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option.id;
                const isCorrect = showFeedback && option.id === "B"; // Simplified — use real answer from submit
                const isWrong = showFeedback && isSelected && option.id !== "B";
                const optionClasses =
                  showFeedback && isCorrect
                    ? "bg-[#E8F0EA] border-[#3B6B4A] border-2"
                    : showFeedback && isWrong
                    ? "bg-[#FFE8E8] border-[#D84848] border-2"
                    : isSelected
                    ? "bg-[#F8F6F1] border-[#3B6B4A] border-2"
                    : "bg-white border-[#E5E0D8] border hover:border-[#3B6B4A] hover:bg-[#F8F6F1]";

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleOptionSelect(option.id)}
                    disabled={showFeedback}
                    className={`w-full p-5 rounded-2xl text-left transition-all duration-200 text-[16px] flex items-center justify-between ${optionClasses} ${showFeedback ? "cursor-default" : "cursor-pointer"}`}
                  >
                    <span className={showFeedback && (isCorrect || isWrong) ? "text-[#2C2C2C] font-[800]" : "text-[#2C2C2C] font-[600]"}>
                      {option.id}. {option.text}
                    </span>
                    {showFeedback && isCorrect && (
                      <div className="w-7 h-7 bg-[#3B6B4A] rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "SHORT_ANSWER" && (
            <div className="mb-10">
              <textarea
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                placeholder="답안을 입력하세요"
                className="w-full h-[120px] p-4 bg-white border border-[#E5E0D8] rounded-2xl text-[16px] outline-none focus:border-[#3B6B4A] resize-none"
              />
            </div>
          )}

          {currentQuestion.type === "TRUE_FALSE" && (
            <div className="space-y-3 mb-10">
              {[
                { id: "true", label: "O" },
                { id: "false", label: "X" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleOptionSelect(opt.id)}
                  disabled={showFeedback}
                  className={`w-full p-5 rounded-2xl text-center transition-all duration-200 text-[24px] font-[800] ${
                    selectedOption === opt.id
                      ? "bg-[#3B6B4A] text-white"
                      : "bg-white border border-[#E5E0D8] hover:border-[#3B6B4A]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {showFeedback && (
            <div className="rounded-xl p-5 mt-3 bg-[#FFF3EB]">
              <div className="flex items-start gap-3">
                <OwlMascot size={32} />
                <div>
                  <h4 className="text-[15px] font-[800] text-[#2C2C2C] mb-2">답을 선택했어요!</h4>
                  <p className="text-[14px] text-[#2C2C2C] leading-relaxed">
                    다음 문제로 넘어가거나, 마지막 문제라면 제출하세요.
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={currentQuestion.type === "MULTIPLE_CHOICE" && !showFeedback ? handleSubmitAnswer : handleNextQuestion}
            disabled={loading}
            className="w-full py-4 bg-[#3B6B4A] text-white rounded-2xl text-[16px] font-[800] hover:bg-[#2d5438] transition-colors shadow-sm flex items-center justify-center gap-2 mt-6 disabled:opacity-40"
          >
            {loading ? "채점 중..." : currentQuestionIndex < questions.length - 1 ? "다음 문제 풀기" : "퀴즈 제출하기"}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
