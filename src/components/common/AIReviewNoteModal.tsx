import { useState } from "react";
import { Modal, ModalCloseButton } from "./Modal";
import { OwlMascot } from "./OwlMascot";
import { Pencil, Send } from "lucide-react";

interface AIReviewNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  weekNumber?: string;
}

export function AIReviewNoteModal({
  isOpen,
  onClose,
  courseTitle = "파이썬 데이터 분석 기초",
  weekNumber = "1주차",
}: AIReviewNoteModalProps) {
  const [question, setQuestion] = useState("");

  const handleAskQuestion = () => {
    if (question.trim()) {
      console.log("Question asked:", question);
      alert(`질문: ${question}\n\n큐리가 곧 답변을 준비할게요!`);
      setQuestion("");
    }
  };

  const keyConcepts = [
    {
      title: "리스트(List)",
      description: "순서가 있는 데이터의 모음입니다. 꺾쇠괄호 []를 사용합니다.",
    },
    {
      title: "딕셔너리(Dictionary)",
      description:
        "키(Key)와 값(Value)이 한 쌍으로 이루어진 데이터입니다. 중괄호 {}를 사용합니다.",
    },
    {
      title: "인덱싱(Indexing)",
      description: "데이터의 위치 번호를 통해 특정 값을 찾아내는 방법입니다.",
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="720px">
      <div className="p-10">
        {/* Modal Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <OwlMascot size={48} />
              <Pencil className="w-4 h-4 text-[#E8985E] absolute -bottom-0.5 -right-0.5" />
            </div>
            <h2 className="text-[20px] font-[800] text-[#3B6B4A]">
              AI 복습 노트
            </h2>
          </div>
          <ModalCloseButton onClose={onClose} />
        </div>

        {/* Course Title */}
        <h3 className="text-[24px] font-[800] text-[#2C2C2C] mb-6">
          [{weekNumber}] {courseTitle}
        </h3>

        {/* Summary Section */}
        <div className="bg-[#E8F0EA] rounded-xl p-5 mb-8">
          <h4 className="text-[16px] font-[800] text-[#2C2C2C] mb-3">
            한눈에 보는 요약 💡
          </h4>
          <p className="text-[15px] text-[#2C2C2C] leading-relaxed">
            이 강좌에서는 파이썬의 기본 데이터 구조인 리스트와 딕셔너리의 차이를
            배우고, 데이터를 효율적으로 저장하고 불러오는 방법을 익혔습니다.
          </p>
        </div>

        {/* Key Concepts Section */}
        <div className="mb-8">
          <h4 className="text-[16px] font-[800] text-[#2C2C2C] mb-4">
            핵심 개념 정리 📚
          </h4>
          <div className="space-y-3">
            {keyConcepts.map((concept, index) => (
              <div
                key={index}
                className="border border-[#E5E0D8] rounded-xl p-4 bg-white"
              >
                <h5 className="text-[15px] font-[800] text-[#2C2C2C] mb-1.5">
                  {concept.title}
                </h5>
                <p className="text-[14px] text-[#777777] leading-relaxed">
                  {concept.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Next Step Section */}
        <div className="mb-8">
          <h4 className="text-[16px] font-[800] text-[#2C2C2C] mb-3">
            다음 학습과의 연결 🔗
          </h4>
          <p className="text-[15px] text-[#2C2C2C] leading-relaxed">
            여기서 배운 리스트와 딕셔너리 개념은 다음 강좌인 '판다스(Pandas)
            기초'에서 데이터프레임을 만들 때 핵심적으로 사용됩니다.
          </p>
        </div>

        {/* Interactive Footer */}
        <div className="pt-6 border-t border-[#E5E0D8]">
          <p className="text-[13px] text-[#777777] mb-3">
            이해가 안 되는 부분이 있나요?
          </p>
          <div className="relative">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleAskQuestion()}
              placeholder="예: 리스트와 튜플의 차이가 뭐야?"
              className="w-full h-12 pl-4 pr-28 bg-[#F8F6F1] border border-[#E5E0D8] rounded-xl text-[14px] text-[#2C2C2C] placeholder:text-[#AAAAAA] outline-none focus:border-[#3B6B4A] focus:ring-2 focus:ring-[#E8F0EA] transition-all"
            />
            <button
              onClick={handleAskQuestion}
              disabled={!question.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#3B6B4A] text-white rounded-lg text-[13px] font-[600] hover:bg-[#2d5438] transition-colors disabled:bg-[#C0C0C0] disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              질문하기
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
