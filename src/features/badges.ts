import type { UserBadge, UserStats } from "../api/client";

export const REQUIRED_BADGE_TYPES = [
  "SEEDLING",
  "STREAK_3",
  "STREAK_7",
  "STREAK_30",
  "STREAK_100",
  "COURSE_5",
  "COURSE_10",
  "COURSE_30",
  "ROADMAP_1",
  "ROADMAP_3",
  "FIRST_POST",
] as const;

export const BADGE_CATEGORY_ORDER = ["시작", "스트릭", "누적", "커뮤니티", "특별"] as const;

type BadgeCategory = (typeof BADGE_CATEGORY_ORDER)[number];

type BadgeMeta = {
  emoji: string;
  category: BadgeCategory;
  condition: string;
  order: number;
  isSpecial?: boolean;
};

const BADGE_META: Record<string, BadgeMeta> = {
  SEEDLING: { emoji: "🌱", category: "시작", condition: "첫 강좌 완료", order: 1 },
  FIRST_POST: { emoji: "💬", category: "커뮤니티", condition: "첫 게시글 작성", order: 10 },
  STREAK_3: { emoji: "🔥", category: "스트릭", condition: "3일 연속 학습", order: 2 },
  STREAK_7: { emoji: "⚡", category: "스트릭", condition: "7일 연속 학습", order: 3 },
  STREAK_30: { emoji: "💎", category: "스트릭", condition: "30일 연속 학습", order: 4 },
  STREAK_100: { emoji: "👑", category: "스트릭", condition: "100일 연속 학습", order: 5 },
  COURSE_5: { emoji: "📕", category: "누적", condition: "강좌 5개 완료", order: 6 },
  COURSE_10: { emoji: "📗", category: "누적", condition: "강좌 10개 완료", order: 7 },
  COURSE_30: { emoji: "📘", category: "누적", condition: "강좌 30개 완료", order: 8 },
  ROADMAP_1: { emoji: "🗺️", category: "누적", condition: "로드맵 1개 완료", order: 9 },
  ROADMAP_3: { emoji: "🌐", category: "누적", condition: "로드맵 3개 완료", order: 11 },
  QURI_MASTER: { emoji: "🏆", category: "특별", condition: "모든 뱃지 획득", order: 12, isSpecial: true },
};

const FALLBACK_META: BadgeMeta = {
  emoji: "🏅",
  category: "특별",
  condition: "뱃지 달성",
  order: 999,
};

export type BadgeViewModel = UserBadge & {
  emoji: string;
  category: BadgeCategory;
  condition: string;
  unlocked: boolean;
  unlockedDate?: string;
  isSpecial: boolean;
  progress?: { current: number; total: number };
};

function formatBadgeDate(acquiredAt: string) {
  const date = new Date(acquiredAt);
  if (Number.isNaN(date.getTime())) return undefined;
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} 획득`;
}

function clampProgress(current: number, total: number) {
  return { current: Math.max(0, Math.min(current, total)), total };
}

function getProgressForBadge(badgeType: string, stats: UserStats | null, badges: UserBadge[]) {
  if (badgeType === "QURI_MASTER") {
    const current = badges.filter((badge) => badge.acquired && REQUIRED_BADGE_TYPES.includes(badge.badgeType as (typeof REQUIRED_BADGE_TYPES)[number])).length;
    return clampProgress(current, REQUIRED_BADGE_TYPES.length);
  }

  if (!stats) return undefined;

  switch (badgeType) {
    case "SEEDLING":
      return clampProgress(stats.totalCompletedCourses, 1);
    case "STREAK_3":
      return clampProgress(stats.streakDays, 3);
    case "STREAK_7":
      return clampProgress(stats.streakDays, 7);
    case "STREAK_30":
      return clampProgress(stats.streakDays, 30);
    case "STREAK_100":
      return clampProgress(stats.streakDays, 100);
    case "COURSE_5":
      return clampProgress(stats.totalCompletedCourses, 5);
    case "COURSE_10":
      return clampProgress(stats.totalCompletedCourses, 10);
    case "COURSE_30":
      return clampProgress(stats.totalCompletedCourses, 30);
    case "ROADMAP_1":
      return clampProgress(stats.completedRoadmapCount, 1);
    case "ROADMAP_3":
      return clampProgress(stats.completedRoadmapCount, 3);
    default:
      return undefined;
  }
}

export function mapBadgesToViewModels(badges: UserBadge[], stats: UserStats | null): BadgeViewModel[] {
  return badges
    .map((badge) => {
      const meta = BADGE_META[badge.badgeType] ?? FALLBACK_META;

      return {
        ...badge,
        emoji: meta.emoji,
        category: meta.category,
        condition: meta.condition,
        unlocked: badge.acquired,
        unlockedDate: badge.acquiredAt ? formatBadgeDate(badge.acquiredAt) : undefined,
        isSpecial: Boolean(meta.isSpecial),
        progress: badge.acquired ? undefined : getProgressForBadge(badge.badgeType, stats, badges),
      };
    })
    .sort((a, b) => (BADGE_META[a.badgeType]?.order ?? FALLBACK_META.order) - (BADGE_META[b.badgeType]?.order ?? FALLBACK_META.order));
}

export function groupBadgesByCategory(badges: BadgeViewModel[]) {
  return BADGE_CATEGORY_ORDER.map((category) => ({
    category,
    badges: badges.filter((badge) => badge.category === category),
  })).filter((section) => section.badges.length > 0);
}

export function getBadgeCategoryIcon(category: BadgeCategory) {
  switch (category) {
    case "시작":
      return "🌱";
    case "스트릭":
      return "🔥";
    case "누적":
      return "📚";
    case "커뮤니티":
      return "💬";
    case "특별":
    default:
      return "🏆";
  }
}

export function getBadgeSummary(badges: BadgeViewModel[]) {
  const acquiredBadges = badges.filter((badge) => badge.unlocked);
  const latestUnlocked = [...acquiredBadges]
    .sort((a, b) => new Date(b.acquiredAt ?? 0).getTime() - new Date(a.acquiredAt ?? 0).getTime())
    .slice(0, 4);
  const nextLockedBadge = badges.find((badge) => !badge.unlocked);

  return {
    totalCount: badges.length,
    acquiredCount: acquiredBadges.length,
    progressPercentage: badges.length ? Math.round((acquiredBadges.length / badges.length) * 100) : 0,
    latestUnlocked,
    nextLockedBadge,
  };
}
