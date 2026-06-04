export function formatRelativeKoreanDate(value: string) {
  const target = new Date(value).getTime();
  const now = Date.now();
  const diffMinutes = Math.max(1, Math.floor((now - target) / 60000));

  if (diffMinutes < 60) return `${diffMinutes}분 전`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}시간 전`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}일 전`;

  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatCommentCount(count: number) {
  return `${count}개 댓글`;
}

const PRIOR_KNOWLEDGE_LABELS = {
  BEGINNER: "처음 접해봐요",
  LITTLE: "조금 알아요",
  INTERMEDIATE: "어느 정도 알아요",
  ADVANCED: "잘 알아요",
} as const;

const DIFFICULTY_MATCH_LABELS = {
  EASY: "생각보다 쉬웠어요",
  FIT: "난이도가 딱 맞았어요",
  HARD: "생각보다 어려웠어요",
} as const;

export function getFriendlyCommunityErrorMessage(
  error: unknown,
  fallbackMessage: string,
  unauthorizedMessage = "로그인 정보가 만료되었어요. 다시 로그인해 주세요."
) {
  const message = error instanceof Error ? error.message : fallbackMessage;

  if (message === "UNAUTHORIZED") return unauthorizedMessage;
  if (message === "Failed to fetch") return "서버에 연결하지 못했어요. 잠시 후 다시 시도해 주세요.";
  if (/^HTTP\s\d+$/.test(message)) return fallbackMessage;

  return message;
}

export function getPriorKnowledgeLabel(value?: keyof typeof PRIOR_KNOWLEDGE_LABELS | null) {
  if (!value) return null;
  return PRIOR_KNOWLEDGE_LABELS[value] ?? value;
}

export function getDifficultyMatchLabel(value?: keyof typeof DIFFICULTY_MATCH_LABELS | null) {
  if (!value) return null;
  return DIFFICULTY_MATCH_LABELS[value] ?? value;
}
