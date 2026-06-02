import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";
import { useAuth } from "../context/AuthContext";
import { getUserStats, getCategoryStats, getLearningHistory, type UserStats, type CategoryStat, type LearningHistoryItem } from "../api/client";
import { getPlatformLabel } from "../utils/platform";

export default function MyPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [history, setHistory] = useState<LearningHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserStats(), getCategoryStats(), getLearningHistory(0, 5)])
      .then(([s, c, h]) => {
        setStats(s);
        setCategories(c);
        setHistory(h);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatHours = (hours: number) => {
    if (hours < 1) return `${Math.round(hours * 60)}분`;
    return `${hours}시간`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

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
              <h1 className="text-[22px] font-[800] text-[#2C2C2C] mb-1">
                {loading ? "로딩 중..." : `${user?.name}님의 학습 기록`}
              </h1>
              <p className="text-[13px] text-[#777777]">가입일: 2026.03.15</p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-4 gap-4 mb-12">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 animate-pulse">
                  <div className="h-8 bg-[#E5E0D8] rounded mb-2" />
                  <div className="h-7 bg-[#E5E0D8] rounded mb-1" />
                  <div className="h-4 bg-[#E5E0D8] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 mb-12">
              <StatSummaryCard icon="📚" value={`${stats?.totalCompletedCourses ?? 0}개`} label="이수 강좌" />
              <StatSummaryCard icon="⏱" value={formatHours(stats?.totalLearningHours ?? 0)} label="총 학습 시간" />
              <StatSummaryCard icon="🔥" value={`${stats?.streakDays ?? 0}일`} label="연속 학습" />
              <StatSummaryCard icon="✅" value={`${stats?.completedRoadmapCount ?? 0}개`} label="완료 로드맵" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-5">🗺️ 분야별 학습 현황</h2>
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="mb-5 last:mb-0 animate-pulse">
                      <div className="flex justify-between mb-2">
                        <div className="h-4 bg-[#E5E0D8] rounded w-24" />
                        <div className="h-4 bg-[#E5E0D8] rounded w-16" />
                      </div>
                      <div className="h-2.5 bg-[#E5E0D8] rounded-full" />
                    </div>
                  ))
                ) : categories.length === 0 ? (
                  <p className="text-[14px] text-[#777777] text-center py-4">아직 학습 기록이 없습니다.</p>
                ) : (
                  categories.map(cat => (
                    <SubjectProgressItem
                      key={cat.category}
                      subject={cat.category}
                      progress={cat.progressPercent}
                      completedCount={cat.completedCount}
                    />
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-5">📜 최근 이수 내역</h2>
              <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} className="flex items-start gap-3 mb-4 last:mb-0 animate-pulse">
                      <div className="w-5 h-5 bg-[#E5E0D8] rounded-md flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="h-4 bg-[#E5E0D8] rounded w-3/4 mb-1.5" />
                        <div className="h-4 bg-[#E5E0D8] rounded w-1/2" />
                      </div>
                    </div>
                  ))
                ) : history.length === 0 ? (
                  <p className="text-[14px] text-[#777777] text-center py-4">이수한 강좌가 없습니다.</p>
                ) : (
                  history.map(item => (
                    <RecentCompletionItem
                      key={item.id}
                      courseName={item.courseTitle}
                      platform={item.platform}
                      date={formatDate(item.completedAt)}
                    />
                  ))
                )}
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
                  {categories.length > 0
                    ? `${categories[0].category}을(를) 잘 마무리했어요! 다음 단계로 도전해볼까요?`
                    : "아직 학습 기록이 없어요. 첫 강좌를 시작해보세요!"}
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
    전국평생학습: "bg-[#FDEEF3] text-[#C75B7A]",
    서울시평생학습포털: "bg-[#F3E5F5] text-[#9C27B0]",
  };
  const displayPlatform = getPlatformLabel(platform);

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
              platformColors[displayPlatform] || platformColors["K-MOOC"]
            }`}
          >
            {displayPlatform}
          </span>
          <span className="text-[12px] text-[#777777]">{date} 이수</span>
        </div>
      </div>
    </div>
  );
}
