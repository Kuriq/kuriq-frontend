import { Heart } from "lucide-react";
import type { CourseReviewItem } from "../../../api/client";
import { getDifficultyMatchLabel, getPriorKnowledgeLabel, formatRelativeKoreanDate } from "../utils";
import { CommunityRatingStars } from "./CommunityRatingStars";

export function CommunityReviewCard({
  review,
  isMine,
  likePending,
  onLike,
  onEdit,
  onDelete,
  deletePending,
}: {
  review: CourseReviewItem;
  isMine?: boolean;
  likePending?: boolean;
  onLike?: (reviewId: string) => void;
  onEdit?: (review: CourseReviewItem) => void;
  onDelete?: (review: CourseReviewItem) => void;
  deletePending?: boolean;
}) {
  const tags = [getPriorKnowledgeLabel(review.priorKnowledge), getDifficultyMatchLabel(review.difficultyMatch)].filter(Boolean);

  return (
    <article className="rounded-[18px] border border-[#E5E0D8] bg-white p-5">
      <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <p className="text-[15px] font-[800] text-[#2C2C2C]">{review.authorName}</p>
            {review.anonymous ? <span className="rounded-full bg-[#F8F6F1] px-2.5 py-1 text-[11px] font-[700] text-[#7A6F62]">익명</span> : null}
            {isMine ? <span className="rounded-full bg-[#FFF3EB] px-2.5 py-1 text-[11px] font-[700] text-[#E07A3F]">내 리뷰</span> : null}
          </div>
          <div className="flex items-center gap-2">
            <CommunityRatingStars value={review.rating} size="sm" />
            <span className="text-[12px] text-[#999999]">{formatRelativeKoreanDate(review.createdAt)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onLike?.(review.id)}
            disabled={!onLike || likePending}
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-[700] transition-colors ${review.likedByMe ? "bg-[#FDEEF3] text-[#C75B7A]" : "bg-[#F8F6F1] text-[#666666]"}`}
          >
            <Heart className={`h-4 w-4 ${review.likedByMe ? "fill-current" : ""}`} />
            {review.likeCount}
          </button>

          {isMine ? (
            <>
              <button
                type="button"
                onClick={() => onEdit?.(review)}
                className="rounded-full border border-[#E5E0D8] bg-white px-3 py-1.5 text-[12px] font-[700] text-[#666666]"
              >
                수정
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(review)}
                disabled={deletePending}
                className="rounded-full border border-[#F0CAD5] bg-white px-3 py-1.5 text-[12px] font-[700] text-[#C75B7A] disabled:opacity-40"
              >
                삭제
              </button>
            </>
          ) : null}
        </div>
      </div>

      {tags.length > 0 ? (
        <div className="mb-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full bg-[#F8F6F1] px-3 py-1 text-[11px] font-[700] text-[#666666]">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <p className="whitespace-pre-wrap text-[14px] leading-[1.7] text-[#4A4A4A]">
        {review.content?.trim() ? review.content : "본문 없이 별점만 남긴 리뷰예요."}
      </p>
    </article>
  );
}
