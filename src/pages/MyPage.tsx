import { User } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";

export default function MyPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="마이페이지" />

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-14 h-14 rounded-full bg-[#E8F0EA] flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-[#3B6B4A]" />
            </div>
            <div>
              <h1 className="text-[22px] font-[800] text-[#2C2C2C] mb-1">이정호님의 학습 기록</h1>
              <p className="text-[13px] text-[#777777]">가입일: 2026.03.15</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mb-12">
            <StatSummaryCard icon="📚" value="12개" label="이수 강좌" />
            <StatSummaryCard icon="⏱" value="47시간" label="총 학습 시간" />
            <StatSummaryCard icon="🔥" value="18일" label="연속 학습" />
            <StatSummaryCard icon="✅" value="1개" label="완료 로드맵" />
          </div>

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-5">🗺️ 분야별 학습 현황</h2>
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                <SubjectProgressItem subject="프로그래밍 (파이썬)" progress={75} completedCount={6} />
                <SubjectProgressItem subject="데이터 분석" progress={45} completedCount={4} />
                <SubjectProgressItem subject="통계학 기초" progress={25} completedCount={2} />
              </div>
            </div>

            <div>
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-5">📜 최근 이수 내역</h2>
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                <RecentCompletionItem courseName="모두를 위한 파이썬" platform="K-MOOC" date="2026.03.28" />
                <RecentCompletionItem courseName="데이터 과학을 위한 통계학" platform="KOCW" date="2026.03.25" />
                <RecentCompletionItem
                  courseName="엑셀 데이터 분석 실전"
                  platform="온국민평생배움터"
                  date="2026.03.20"
                />
              </div>
            </div>
          </div>

          <div className="bg-[#FFF3EB] border border-[#FFE5D0] rounded-2xl p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <OwlMascot size={44} variant="winking" />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-[800] text-[#E8985E] mb-2">큐리의 다음 추천</h3>
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

function StatSummaryCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 text-center">
      <div className="text-[32px] mb-2">{icon}</div>
      <div className="text-[28px] font-[800] text-[#3B6B4A] mb-1">{value}</div>
      <div className="text-[13px] text-[#777777] font-[400]">{label}</div>
    </div>
  );
}

function SubjectProgressItem({
  subject,
  progress,
  completedCount,
}: {
  subject: string;
  progress: number;
  completedCount: number;
}) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[14px] font-[600] text-[#2C2C2C]">{subject}</span>
        <span className="text-[12px] text-[#777777]">{completedCount}개 이수</span>
      </div>
      <div className="w-full h-2.5 bg-[#E5E0D8] rounded-full overflow-hidden">
        <div className="h-full bg-[#3B6B4A] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

function RecentCompletionItem({
  courseName,
  platform,
  date,
}: {
  courseName: string;
  platform: string;
  date: string;
}) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    KOCW: "bg-[#EBF5FB] text-[#3498DB]",
    온국민평생배움터: "bg-[#FFF3EB] text-[#E8985E]",
    서울시평생학습포털: "bg-[#F3E5F5] text-[#9C27B0]",
  };

  return (
    <div className="flex items-start gap-3 mb-4 last:mb-0">
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-5 h-5 rounded-md bg-[#3B6B4A] flex items-center justify-center">
          <svg width="12" height="9" viewBox="0 0 12 9" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 4L4.5 7.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-[600] text-[#2C2C2C] mb-1.5">{courseName}</h4>
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-[600] ${
              platformColors[platform] || platformColors["K-MOOC"]
            }`}
          >
            {platform}
          </span>
          <span className="text-[12px] text-[#777777]">{date} 이수</span>
        </div>
      </div>
    </div>
  );
}
