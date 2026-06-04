import { useEffect, useMemo, useState } from "react";
import type {
  CourseReviewDifficultyMatch,
  CourseReviewItem,
  CourseReviewPriorKnowledge,
  CourseReviewUpsertRequest,
} from "../../../api/client";
import { CommunityRatingStars } from "./CommunityRatingStars";

const priorKnowledgeOptions: Array<{ value: CourseReviewPriorKnowledge; label: string }> = [
  { value: "BEGINNER", label: "처음 접해봐요" },
  { value: "LITTLE", label: "조금 알아요" },
  { value: "INTERMEDIATE", label: "어느 정도 알아요" },
  { value: "ADVANCED", label: "잘 알아요" },
];

const difficultyOptions: Array<{ value: CourseReviewDifficultyMatch; label: string }> = [
  { value: "EASY", label: "생각보다 쉬웠어요" },
  { value: "FIT", label: "난이도가 딱 맞았어요" },
  { value: "HARD", label: "생각보다 어려웠어요" },
];

function getInitialForm(review?: CourseReviewItem | null): CourseReviewUpsertRequest {
  return {
    rating: review?.rating ?? 0,
    content: review?.content ?? "",
    priorKnowledge: review?.priorKnowledge ?? null,
    difficultyMatch: review?.difficultyMatch ?? null,
  };
}

export function CommunityReviewComposer({
  courseTitle,
  myReview,
  submitting,
  deleting,
  error,
  onSubmit,
  onDelete,
}: {
  courseTitle: string;
  myReview?: CourseReviewItem;
  submitting: boolean;
  deleting: boolean;
  error: string | null;
  onSubmit: (payload: CourseReviewUpsertRequest) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [form, setForm] = useState<CourseReviewUpsertRequest>(getInitialForm(myReview));

  useEffect(() => {
    setForm(getInitialForm(myReview));
  }, [courseTitle, myReview?.id]);

  const isEditMode = Boolean(myReview);
  const isValid = form.rating >= 1 && form.rating <= 5 && (form.content?.length ?? 0) <= 1000;
  const contentLength = form.content?.length ?? 0;

  const helperText = useMemo(
    () => (isEditMode ? `${courseTitle}에 남긴 내 리뷰를 수정할 수 있어요.` : "강좌를 이수한 사용자만 리뷰를 작성할 수 있어요."),
    [courseTitle, isEditMode]
  );

  return (
    <div className="rounded-[20px] border border-[#E5E0D8] bg-white p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-[18px] font-[800] text-[#2C2C2C]">{isEditMode ? "내 리뷰 수정" : "리뷰 작성"}</h3>
          <p className="text-[13px] text-[#777777]">{helperText}</p>
        </div>
        <p className="text-[12px] text-[#999999]">{courseTitle}</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">별점</label>
          <div className="flex items-center gap-3">
            <CommunityRatingStars value={form.rating} onChange={(rating) => setForm((prev) => ({ ...prev, rating }))} />
            <span className="text-[13px] text-[#777777]">{form.rating > 0 ? `${form.rating}점` : "별점을 선택해 주세요"}</span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">사전 지식</span>
            <select
              value={form.priorKnowledge ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, priorKnowledge: (event.target.value || null) as CourseReviewPriorKnowledge | null }))}
              className="h-[46px] w-full rounded-[12px] border border-[#E5E0D8] px-4 text-[14px] text-[#2C2C2C] outline-none focus:border-[#3B6B4A]"
            >
              <option value="">선택 안 함</option>
              {priorKnowledgeOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">난이도 체감</span>
            <select
              value={form.difficultyMatch ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, difficultyMatch: (event.target.value || null) as CourseReviewDifficultyMatch | null }))}
              className="h-[46px] w-full rounded-[12px] border border-[#E5E0D8] px-4 text-[14px] text-[#2C2C2C] outline-none focus:border-[#3B6B4A]"
            >
              <option value="">선택 안 함</option>
              {difficultyOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div>
          <label className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">후기</label>
          <textarea
            value={form.content ?? ""}
            onChange={(event) => setForm((prev) => ({ ...prev, content: event.target.value.slice(0, 1000) }))}
            placeholder="강좌가 어떤 점에서 도움이 되었는지 남겨 주세요"
            className="min-h-[160px] w-full resize-none rounded-[14px] border border-[#E5E0D8] px-4 py-3 text-[14px] text-[#2C2C2C] outline-none focus:border-[#3B6B4A]"
          />
          <p className="mt-2 text-right text-[12px] text-[#999999]">{contentLength}/1000</p>
        </div>

        {error ? <p className="rounded-[12px] bg-[#FFF4F6] px-4 py-3 text-[13px] text-[#C75B7A]">{error}</p> : null}

        <div className="flex flex-wrap justify-end gap-3">
          {isEditMode ? (
            <button
              type="button"
              onClick={() => void onDelete()}
              disabled={deleting}
              className="rounded-full border border-[#F0CAD5] bg-white px-5 py-3 text-[14px] font-[700] text-[#C75B7A] disabled:opacity-40"
            >
              {deleting ? "삭제 중..." : "리뷰 삭제"}
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => void onSubmit(form)}
            disabled={submitting || !isValid}
            className="rounded-full bg-[#3B6B4A] px-6 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {submitting ? (isEditMode ? "수정 중..." : "등록 중...") : isEditMode ? "리뷰 수정하기" : "리뷰 등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
