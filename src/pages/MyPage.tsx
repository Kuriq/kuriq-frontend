import { useEffect, useMemo, useState } from "react";
import { ChevronRight, User } from "lucide-react";
import { Link } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { BadgeShowcaseCard } from "../components/badges/BadgeShowcaseCard";
import { OwlMascot } from "../components/common/OwlMascot";
import { useAuth } from "../context/AuthContext";
import { getUserStats, getCategoryStats, getLearningHistory, getMyBadges, type UserStats, type CategoryStat, type LearningHistoryItem, type UserBadge } from "../api/client";
import { getBadgeSummary, mapBadgesToViewModels } from "../features/badges";
import { getPlatformLabel } from "../utils/platform";

export default function MyPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [history, setHistory] = useState<LearningHistoryItem[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getUserStats(), getCategoryStats(), getLearningHistory(0, 5), getMyBadges()])
      .then(([s, c, h, b]) => {
        setStats(s);
        setCategories(c);
        setHistory(h);
        setBadges(b);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const badgeViewModels = useMemo(() => mapBadgesToViewModels(badges, stats), [badges, stats]);
  const badgeSummary = useMemo(() => getBadgeSummary(badgeViewModels), [badgeViewModels]);

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

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-8 flex flex-col gap-4 rounded-[24px] border border-[#E5E0D8] bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E8F0EA]">
                <User className="w-7 h-7 text-[#3B6B4A]" />
              </div>
              <div>
                <h1 className="mb-1 text-[22px] font-[800] text-[#2C2C2C]">
                  {loading ? "로딩 중..." : `${user?.name}님의 학습 기록`}
                </h1>
                <p className="text-[13px] text-[#777777]">가입일: 2026.03.15</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 self-start rounded-full bg-[#F8F6F1] px-4 py-2 text-[13px] font-[600] text-[#5F6D62] sm:self-auto">
              <span>🏅</span>
              <span>{loading ? "뱃지 불러오는 중..." : `${badgeSummary.acquiredCount}개의 뱃지 보유`}</span>
            </div>
          </div>

          {loading ? (
            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white border border-[#E5E0D8] rounded-2xl p-6 animate-pulse">
                  <div className="h-8 bg-[#E5E0D8] rounded mb-2" />
                  <div className="h-7 bg-[#E5E0D8] rounded mb-1" />
                  <div className="h-4 bg-[#E5E0D8] rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatSummaryCard icon="📚" value={`${stats?.totalCompletedCourses ?? 0}개`} label="이수 강좌" />
              <StatSummaryCard icon="⏱" value={formatHours(stats?.totalLearningHours ?? 0)} label="총 학습 시간" />
              <StatSummaryCard icon="🔥" value={`${stats?.streakDays ?? 0}일`} label="연속 학습" />
              <StatSummaryCard icon="✅" value={`${stats?.completedRoadmapCount ?? 0}개`} label="완료 로드맵" />
            </div>
          )}

          <div className="mb-10">
            <BadgeShowcaseCard
              href="/badges"
              acquiredCount={badgeSummary.acquiredCount}
              totalCount={badgeSummary.totalCount}
              progressPercentage={badgeSummary.progressPercentage}
              latestUnlocked={badgeSummary.latestUnlocked}
              nextLockedBadge={badgeSummary.nextLockedBadge}
            />
          </div>

          <div className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-2">
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

          <div className="rounded-2xl border border-[#FFE5D0] bg-[#FFF3EB] p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="flex-shrink-0">
                <OwlMascot size={44} variant="winking" />
              </div>
              <div className="flex-1">
                <h3 className="text-[16px] font-[800] text-[#E8985E] mb-2">큐리의 다음 추천</h3>
                <p className="text-[14px] text-[#2C2C2C] leading-relaxed">
                  {badgeSummary.nextLockedBadge
                    ? `다음 뱃지 '${badgeSummary.nextLockedBadge.displayName}'를 목표로 학습을 이어가 보세요.`
                    : categories.length > 0
                      ? `${categories[0].category}을(를) 잘 마무리했어요! 다음 단계로 도전해볼까요?`
                      : "아직 학습 기록이 없어요. 첫 강좌를 시작해보세요!"}
                </p>
                <Link to="/badges" className="mt-3 inline-flex items-center gap-1 text-[13px] font-[700] text-[#D57D3F] hover:underline">
                  뱃지 전체 보기
                  <ChevronRight className="h-4 w-4" />
                </Link>
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
    <div className="rounded-2xl border border-[#E5E0D8] bg-white p-5 text-center sm:p-6">
      <div className="text-[32px] mb-2">{icon}</div>
      <div className="break-keep text-[24px] font-[800] text-[#3B6B4A] sm:text-[28px] mb-1">{value}</div>
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
