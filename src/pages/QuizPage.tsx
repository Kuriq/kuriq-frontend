import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Check, ChevronLeft } from "lucide-react";
import { OwlMascot } from "../components/common/OwlMascot";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const quizData: QuizQuestion[] = [
  {
    id: 1,
    question: "파이썬에서 순서가 있는 데이터의 모음을 저장하며, 꺾쇠괄호 []를 사용하는 자료형은?",
    options: ["딕셔너리 (Dictionary)", "리스트 (List)", "튜플 (Tuple)", "문자열 (String)"],
    correctAnswer: 1,
    explanation: "리스트는 여러 데이터를 순서대로 저장할 때 사용하는 가장 기본적인 자료형입니다.",
  },
  {
    id: 2,
    question: "파이썬에서 키(Key)와 값(Value)의 쌍으로 데이터를 저장하며, 중괄호 {}를 사용하는 자료형은 무엇인가요?",
    options: ["리스트 (List)", "딕셔너리 (Dictionary)", "튜플 (Tuple)", "문자열 (String)"],
    correctAnswer: 1,
    explanation: "딕셔너리는 '이름: 홍길동, 나이: 30'처럼 의미를 부여하여 데이터를 저장할 때 아주 유용하답니다.",
  },
  {
    id: 3,
    question: "데이터의 위치 번호를 통해 특정 값을 찾아내는 방법을 무엇이라고 하나요?",
    options: ["슬라이싱 (Slicing)", "인덱싱 (Indexing)", "루핑 (Looping)", "필터링 (Filtering)"],
    correctAnswer: 1,
    explanation: "인덱싱은 리스트나 문자열에서 위치(인덱스)를 사용해 특정 요소에 접근하는 방법입니다.",
  },
  {
    id: 4,
    question: "파이썬에서 변경할 수 없는(immutable) 자료형은 무엇인가요?",
    options: ["리스트 (List)", "딕셔너리 (Dictionary)", "튜플 (Tuple)", "세트 (Set)"],
    correctAnswer: 2,
    explanation: "튜플은 한 번 생성되면 내용을 변경할 수 없는 자료형으로, 안전하게 데이터를 보호할 때 유용합니다.",
  },
  {
    id: 5,
    question: "파이썬에서 중복을 허용하지 않는 자료형은 무엇인가요?",
    options: ["리스트 (List)", "딕셔너리 (Dictionary)", "튜플 (Tuple)", "세트 (Set)"],
    correctAnswer: 3,
    explanation: "세트는 중복된 값을 자동으로 제거하는 자료형으로, 고유한 값들만 저장하고 싶을 때 사용합니다.",
  },
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(true);
  const [correctAnswers, setCorrectAnswers] = useState(1);

  const currentQuestion = quizData[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.length) * 100;

  const handleOptionSelect = (optionIndex: number) => {
    if (showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);
    if (optionIndex === currentQuestion.correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizData.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      return;
    }

    alert(
      `퀴즈 완료! 🎉\n\n총 ${quizData.length}문제 중 ${
        correctAnswers + (selectedOption === currentQuestion.correctAnswer ? 1 : 0)
      }문제를 맞추셨습니다!`,
    );
    navigate("/dashboard");
  };

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
            <div className="absolute left-1/2 -translate-x-1/2 text-center">
              <h1 className="text-[20px] font-[800] text-[#3B6B4A] mb-2">AI 맞춤 퀴즈</h1>
              <p className="text-[13px] text-[#777777] font-[600]">
                문제 {currentQuestionIndex + 1} / {quizData.length}
              </p>
            </div>
          </div>

          <div className="w-full max-w-[600px] mx-auto">
            <div className="h-2 bg-[#E5E0D8] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#3B6B4A] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[640px] mx-auto mt-8">
          <h2 className="text-[24px] font-[800] text-[#2C2C2C] leading-relaxed mb-8">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3 mb-10">
            {currentQuestion.options.map((option, index) => (
              <div key={option}>
                <QuizOptionCard
                  number={index + 1}
                  text={option}
                  isSelected={selectedOption === index}
                  isCorrect={showFeedback && index === currentQuestion.correctAnswer}
                  isWrong={
                    showFeedback && selectedOption === index && index !== currentQuestion.correctAnswer
                  }
                  onClick={() => handleOptionSelect(index)}
                  showFeedback={showFeedback}
                />

                {showFeedback && index === currentQuestion.correctAnswer && (
                  <QuizExplanationPanel
                    isCorrect={selectedOption === currentQuestion.correctAnswer}
                    explanation={currentQuestion.explanation}
                  />
                )}
              </div>
            ))}
          </div>

          {showFeedback && (
            <button
              type="button"
              onClick={handleNextQuestion}
              className="w-full py-4 bg-[#3B6B4A] text-white rounded-2xl text-[16px] font-[800] hover:bg-[#2d5438] transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {currentQuestionIndex < quizData.length - 1 ? "다음 문제 풀기" : "퀴즈 완료하기"}
              <ArrowRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}

function QuizOptionCard({
  number,
  text,
  isSelected,
  isCorrect,
  isWrong,
  onClick,
  showFeedback,
}: {
  number: number;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  showFeedback: boolean;
}) {
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
      type="button"
      onClick={onClick}
      disabled={showFeedback}
      className={`w-full p-5 rounded-2xl text-left transition-all duration-200 text-[16px] flex items-center justify-between ${optionClasses} ${
        showFeedback ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span className={showFeedback && (isCorrect || isWrong) ? "text-[#2C2C2C] font-[800]" : "text-[#2C2C2C] font-[600]"}>
        {number}. {text}
      </span>

      {showFeedback && isCorrect && (
        <div className="w-7 h-7 bg-[#3B6B4A] rounded-full flex items-center justify-center flex-shrink-0 ml-3">
          <Check className="w-4 h-4 text-white" strokeWidth={3} />
        </div>
      )}
    </button>
  );
}

function QuizExplanationPanel({
  isCorrect,
  explanation,
}: {
  isCorrect: boolean;
  explanation: string;
}) {
  return (
    <div className={`rounded-xl p-5 mt-3 ${isCorrect ? "bg-[#FFF3EB]" : "bg-[#FFE8E8]"}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <OwlMascot size={32} />
        </div>
        <div>
          <h4 className="text-[15px] font-[800] text-[#2C2C2C] mb-2">
            {isCorrect ? "정답이에요! 🎉" : "아쉬워요! 😢"}
          </h4>
          <p className="text-[14px] text-[#2C2C2C] leading-relaxed">{explanation}</p>
        </div>
      </div>
    </div>
  );
}
