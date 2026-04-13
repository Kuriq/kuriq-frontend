import { Check } from "lucide-react";

interface QuizOptionProps {
  number: number;
  text: string;
  isSelected: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  onClick: () => void;
  showFeedback: boolean;
}

export function QuizOption({
  number,
  text,
  isSelected,
  isCorrect,
  isWrong,
  onClick,
  showFeedback,
}: QuizOptionProps) {
  const getOptionClasses = () => {
    if (showFeedback && isCorrect) {
      return "bg-[#E8F0EA] border-[#3B6B4A] border-2";
    }
    if (showFeedback && isWrong) {
      return "bg-[#FFE8E8] border-[#D84848] border-2";
    }
    if (isSelected) {
      return "bg-[#F8F6F1] border-[#3B6B4A] border-2";
    }
    return "bg-white border-[#E5E0D8] border hover:border-[#3B6B4A] hover:bg-[#F8F6F1]";
  };

  const getTextClasses = () => {
    if (showFeedback && (isCorrect || isWrong)) {
      return "text-[#2C2C2C] font-[800]";
    }
    return "text-[#2C2C2C] font-[600]";
  };

  return (
    <button
      onClick={onClick}
      disabled={showFeedback}
      className={`w-full p-5 rounded-2xl text-left transition-all duration-200 text-[16px] flex items-center justify-between ${getOptionClasses()} ${
        showFeedback ? "cursor-default" : "cursor-pointer"
      }`}
    >
      <span className={getTextClasses()}>
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
