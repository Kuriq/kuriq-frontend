import { Navigation } from "../../components/layout/Navigation";
import { StatCard } from "../../components/common/StatCard";
import { SubjectProgressBar } from "../../components/common/SubjectProgressBar";
import { CompletionItem } from "../../components/common/CompletionItem";
import { OwlMascot } from "../../components/common/OwlMascot";
import { User } from "lucide-react";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="마이페이지" />

      {/* Main content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-[900px] mx-auto">
          {/* Profile section */}
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-full bg-[#E8F0EA] flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-[#3B6B4A]" />
            </div>
            <div>
              <h1 className="text-[22px] font-[800] text-[#2C2C2C] mb-1">
                이정호님의 학습 기록
              </h1>
              <p className="text-[13px] text-[#777777]">
                가입일: 2026.03.15
              </p>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-4 gap-4 mb-12">
            <StatCard icon="📚" value="12개" label="이수 강좌" />
            <StatCard icon="⏱" value="47시간" label="총 학습 시간" />
            <StatCard icon="🔥" value="18일" label="연속 학습" />
            <StatCard icon="✅" value="1개" label="완료 로드맵" />
          </div>

          {/* Two-column section */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* LEFT: Subject progress */}
            <div>
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-5">
                🗺️ 분야별 학습 현황
              </h2>
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                <SubjectProgressBar
                  subject="프로그래밍 (파이썬)"
                  progress={75}
                  completedCount={6}
                />
                <SubjectProgressBar
                  subject="데이터 분석"
                  progress={45}
                  completedCount={4}
                />
                <SubjectProgressBar
                  subject="통계학 기초"
                  progress={25}
                  completedCount={2}
                />
              </div>
            </div>

            {/* RIGHT: Recent completions */}
            <div>
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-5">
                📜 최근 이수 내역
              </h2>
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                <CompletionItem
                  courseName="모두를 위한 파이썬"
                  platform="K-MOOC"
                  date="2026.03.28"
                />
                <CompletionItem
                  courseName="데이터 과학을 위한 통계학"
                  platform="KOCW"
                  date="2026.03.25"
                />
                <CompletionItem
                  courseName="엑셀 데이터 분석 실전"
                  platform="온국민평생배움터"
                  date="2026.03.20"
                />
              </div>
            </div>
          </div>

          {/* Recommendation card */}
          <div className="bg-[#FFF3EB] border border-[#FFE5D0] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <OwlMascot size={44} variant="winking" />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-[800] text-[#E8985E] mb-2">
                  큐리의 다음 추천
                </h3>
                <p className="text-[14px] text-[#2C2C2C] leading-relaxed">
                  파이썬 기초를 잘 마무리했어요! 다음으로 머신러닝 입문 과정은 어떨까요?
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
