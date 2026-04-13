import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { AIReviewNoteModal } from "../components/AIReviewNoteModal";

export default function AIReviewNoteDemoPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="대시보드" />

      {/* Main content - Simulated Dashboard */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-[32px] font-[800] text-[#2C2C2C] mb-8">
            나의 대시보드
          </h1>

          {/* Sample dashboard content */}
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="bg-white border border-[#E5E0D8] rounded-2xl p-6 shadow-sm"
              >
                <div className="h-32 bg-[#F8F6F1] rounded-xl mb-4" />
                <h3 className="text-[16px] font-[600] text-[#2C2C2C] mb-2">
                  강좌 카드 {item}
                </h3>
                <p className="text-[13px] text-[#777777]">
                  학습 진행 중인 강좌입니다.
                </p>
              </div>
            ))}
          </div>

          {/* Button to reopen modal */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-[#3B6B4A] text-white rounded-xl text-[15px] font-[600] hover:bg-[#2d5438] transition-colors shadow-sm"
            >
              AI 복습 노트 다시 열기
            </button>
          </div>
        </div>
      </main>

      {/* AI Review Note Modal */}
      <AIReviewNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        courseTitle="파이썬 데이터 분석 기초"
        weekNumber="1주차"
      />
    </div>
  );
}
