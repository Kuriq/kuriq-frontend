import { OwlMascot } from "./OwlMascot";

interface QuizExplanationProps {
  isCorrect: boolean;
  explanation: string;
}

export function QuizExplanation({ isCorrect, explanation }: QuizExplanationProps) {
  return (
    <div
      className={`rounded-xl p-5 mt-3 ${
        isCorrect ? "bg-[#FFF3EB]" : "bg-[#FFE8E8]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <OwlMascot size={32} />
        </div>
        <div>
          <h4 className="text-[15px] font-[800] text-[#2C2C2C] mb-2">
            {isCorrect ? "정답이에요! 🎉" : "아쉬워요! 😢"}
          </h4>
          <p className="text-[14px] text-[#2C2C2C] leading-relaxed">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  );
}
