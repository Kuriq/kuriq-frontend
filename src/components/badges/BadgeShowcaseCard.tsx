import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { BadgeViewModel } from "../../features/badges";

export function BadgeShowcaseCard({
  href,
  acquiredCount,
  totalCount,
  progressPercentage,
  latestUnlocked,
  nextLockedBadge,
}: {
  href: string;
  acquiredCount: number;
  totalCount: number;
  progressPercentage: number;
  latestUnlocked: BadgeViewModel[];
  nextLockedBadge?: BadgeViewModel;
}) {
  const previewBadges = latestUnlocked.length > 0 ? latestUnlocked : nextLockedBadge ? [nextLockedBadge] : [];

  return (
    <Link
      to={href}
      className="group block rounded-[24px] border border-[#DCE7DF] bg-gradient-to-r from-[#EAF3ED] via-white to-[#FFF4EC] p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-6"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[12px] font-[700] text-[#3B6B4A]">
            <span>🏅</span>
            <span>나의 뱃지</span>
          </div>
          <h3 className="text-[20px] font-[800] text-[#2C2C2C]">{acquiredCount}개 획득 · {progressPercentage}% 달성</h3>
          <p className="mt-2 text-[14px] leading-relaxed text-[#5F6D62]">
            {nextLockedBadge
              ? `다음 목표는 '${nextLockedBadge.displayName}' 뱃지예요.`
              : "모든 뱃지를 획득했어요. 큐리와 함께한 기록이 멋져요!"}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 lg:min-w-[300px] lg:justify-end">
          <div className="flex -space-x-2">
            {previewBadges.map((badge) => (
              <div
                key={badge.badgeType}
                className={`flex h-11 w-11 items-center justify-center rounded-full border-2 bg-white text-[20px] shadow-sm ${
                  badge.unlocked ? "border-[#3B6B4A]" : "border-[#E5E0D8] grayscale opacity-60"
                }`}
              >
                {badge.emoji}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D6E1D9] bg-white text-[12px] font-[800] text-[#3B6B4A]">
              {acquiredCount}/{totalCount}
            </div>
            <ChevronRight className="h-5 w-5 text-[#3B6B4A] transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
