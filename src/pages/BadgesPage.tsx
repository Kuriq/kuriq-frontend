import { useEffect, useMemo, useState } from "react";
import { Award, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { getMyBadges, getUserStats, type UserBadge, type UserStats } from "../api/client";
import { OwlMascot } from "../components/common/OwlMascot";
import { Navigation } from "../components/layout/Navigation";
import { getBadgeCategoryIcon, getBadgeSummary, groupBadgesByCategory, mapBadgesToViewModels, type BadgeViewModel } from "../features/badges";

export default function BadgesPage() {
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadBadges = async () => {
      setLoading(true);
      setError(null);

      const [badgeResult, statsResult] = await Promise.allSettled([getMyBadges(), getUserStats()]);
      if (cancelled) return;

      if (badgeResult.status === "fulfilled") {
        setBadges(badgeResult.value);
      } else {
        setError("뱃지 정보를 불러오지 못했어요.");
      }

      if (statsResult.status === "fulfilled") {
        setStats(statsResult.value);
      }

      setLoading(false);
    };

    void loadBadges();
    return () => {
      cancelled = true;
    };
  }, []);

  const badgeViewModels = useMemo(() => mapBadgesToViewModels(badges, stats), [badges, stats]);
  const summary = useMemo(() => getBadgeSummary(badgeViewModels), [badgeViewModels]);
  const sections = useMemo(() => groupBadgesByCategory(badgeViewModels), [badgeViewModels]);

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="마이페이지" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1080px]">
          <div className="mb-6 flex items-center gap-2 text-[14px]">
            <Link to="/mypage" className="text-[#777777] hover:text-[#3B6B4A] transition-colors">
              마이페이지
            </Link>
            <ChevronRight size={16} className="text-[#999999]" />
            <span className="font-semibold text-[#2C2C2C]">🏅 나의 뱃지</span>
          </div>

          {error ? (
            <div className="rounded-[18px] border border-[#F0CAD5] bg-white px-6 py-12 text-center text-[15px] text-[#A94A67]">
              {error}
            </div>
          ) : (
            <>
              <div className="mb-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_320px]">
                <section className="rounded-[24px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-7">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#F8F6F1] px-3 py-1 text-[12px] font-[700] text-[#3B6B4A]">
                        <span>🏅</span>
                        <span>나의 뱃지</span>
                      </div>
                      <h1 className="text-[26px] font-[800] text-[#2C2C2C]">학습 기록이 쌓일수록 뱃지도 함께 모여요</h1>
                      <p className="mt-2 text-[14px] leading-relaxed text-[#777777]">
                        백엔드와 연동된 실제 획득 뱃지만 보여줘요. 강좌 완료, 스트릭, 커뮤니티 활동에 따라 자동으로 지급돼요.
                      </p>
                    </div>
                    <OwlMascot size={72} variant={summary.acquiredCount > 0 ? "winking" : "normal"} />
                  </div>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {summary.latestUnlocked.length > 0 ? (
                      summary.latestUnlocked.map((badge) => (
                        <div key={badge.badgeType} className="inline-flex items-center gap-2 rounded-full border border-[#D9E6DC] bg-[#F8FDF9] px-3 py-2 text-[13px] font-[700] text-[#3B6B4A]">
                          <span className="text-[18px]">{badge.emoji}</span>
                          <span>{badge.displayName}</span>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-full border border-dashed border-[#E5E0D8] px-4 py-2 text-[13px] text-[#888888]">
                        아직 획득한 뱃지가 없어요.
                      </div>
                    )}
                  </div>
                </section>

                <section className="rounded-[24px] border border-[#E5E0D8] bg-white p-6 shadow-sm">
                  <div className="mx-auto mb-4 flex h-[76px] w-[76px] items-center justify-center rounded-full border-[6px] border-[#E8F0EA] text-[18px] font-[800] text-[#3B6B4A]">
                    {summary.progressPercentage}%
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] text-[#777777]">총 {summary.totalCount}개 중</p>
                    <p className="mt-1 text-[28px] font-[800] text-[#2C2C2C]">{summary.acquiredCount}개</p>
                    <p className="text-[14px] font-[600] text-[#3B6B4A]">획득 완료</p>
                  </div>

                  {summary.nextLockedBadge ? (
                    <div className="mt-5 rounded-2xl bg-[#FFF3EB] px-4 py-4">
                      <p className="text-[12px] font-[700] text-[#E8985E]">다음 목표</p>
                      <p className="mt-1 text-[16px] font-[800] text-[#2C2C2C]">{summary.nextLockedBadge.displayName}</p>
                      <p className="mt-1 text-[13px] text-[#777777]">{summary.nextLockedBadge.condition}</p>
                    </div>
                  ) : null}
                </section>
              </div>

              {loading ? (
                <div className="space-y-8">
                  {[1, 2, 3].map((section) => (
                    <div key={section}>
                      <div className="mb-4 h-6 w-32 animate-pulse rounded bg-[#E5E0D8]" />
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[1, 2, 3, 4].map((card) => (
                          <div key={card} className="h-[210px] animate-pulse rounded-[18px] border border-[#E5E0D8] bg-white" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {sections.map((section) => (
                    <section key={section.category}>
                      <h2 className="mb-4 flex items-center gap-2 text-[18px] font-[800] text-[#2C2C2C]">
                        <span>{getBadgeCategoryIcon(section.category)}</span>
                        <span>{section.category}</span>
                      </h2>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {section.badges.map((badge) => (
                          <BadgeCard key={badge.badgeType} badge={badge} />
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              )}

              <div className="mt-10 flex flex-col gap-4 rounded-[20px] border border-[#FFE5D0] bg-[#FFF3EB] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <OwlMascot size={56} variant="winking" />
                  <div>
                    <p className="text-[16px] font-[800] text-[#E8985E]">큐리의 응원</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-[#2C2C2C]">
                      {summary.nextLockedBadge
                        ? `지금 페이스면 '${summary.nextLockedBadge.displayName}' 뱃지도 금방이에요.`
                        : "모든 뱃지를 모았어요. 이제 큐리 마스터답게 꾸준함을 이어가 봐요!"}
                    </p>
                  </div>
                </div>
                <Award className="hidden h-10 w-10 text-[#E8985E] sm:block" />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

function BadgeCard({ badge }: { badge: BadgeViewModel }) {
  const progressPercent = badge.progress ? Math.round((badge.progress.current / badge.progress.total) * 100) : 0;

  if (badge.isSpecial) {
    return (
      <div className={`rounded-[20px] p-6 xl:col-span-2 ${badge.unlocked ? "border-2 border-[#E8985E] bg-white shadow-md shadow-[#E8985E]/10" : "border border-[#E5E0D8] bg-[#F5F5F3]"}`}>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="relative text-[62px] leading-none">
            <span className={badge.unlocked ? "" : "grayscale opacity-50"}>{badge.emoji}</span>
            {!badge.unlocked ? <span className="absolute inset-0 flex items-center justify-center text-[30px]">🔒</span> : null}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className={`text-[20px] font-[800] ${badge.unlocked ? "text-[#2C2C2C]" : "text-[#888888]"}`}>{badge.displayName}</h3>
            <p className={`mt-1 text-[14px] ${badge.unlocked ? "text-[#777777]" : "text-[#999999]"}`}>{badge.condition}</p>

            {badge.unlockedDate ? (
              <p className="mt-3 text-[13px] font-[700] text-[#E8985E]">{badge.unlockedDate}</p>
            ) : badge.progress ? (
              <ProgressBar current={badge.progress.current} total={badge.progress.total} percentage={progressPercent} />
            ) : null}
          </div>

          <OwlMascot size={72} variant={badge.unlocked ? "winking" : "normal"} />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-[18px] p-5 text-center transition-all ${badge.unlocked ? "border-2 border-[#3B6B4A] bg-white shadow-sm shadow-[#3B6B4A]/10" : "border border-[#E5E0D8] bg-[#F5F5F3]"}`}>
      <div className="relative inline-flex mb-3 text-[46px] leading-none">
        <span className={badge.unlocked ? "" : "grayscale opacity-40"}>{badge.emoji}</span>
        {!badge.unlocked ? <span className="absolute inset-0 flex items-center justify-center text-[24px]">🔒</span> : null}
      </div>
      <h3 className={`text-[15px] font-[800] ${badge.unlocked ? "text-[#2C2C2C]" : "text-[#888888]"}`}>{badge.displayName}</h3>
      <p className={`mt-1 min-h-[36px] text-[13px] leading-[1.45] ${badge.unlocked ? "text-[#777777]" : "text-[#999999]"}`}>{badge.condition}</p>

      {badge.unlockedDate ? (
        <p className="mt-3 text-[12px] font-[700] text-[#3B6B4A]">{badge.unlockedDate}</p>
      ) : badge.progress ? (
        <ProgressBar current={badge.progress.current} total={badge.progress.total} percentage={progressPercent} />
      ) : (
        <p className="mt-3 text-[12px] text-[#AAAAAA]">조건을 달성하면 자동 획득</p>
      )}
    </div>
  );
}

function ProgressBar({ current, total, percentage }: { current: number; total: number; percentage: number }) {
  return (
    <div className="mt-3 text-left">
      <div className="mb-1 flex items-center justify-between text-[11px] text-[#999999]">
        <span>{current}/{total}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D8]">
        <div className="h-full rounded-full bg-[#3B6B4A] transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
