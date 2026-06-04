import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Star } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import {
  createCourseReview,
  deleteMyCourseReview,
  getCourseReviewSummary,
  getCourseReviews,
  getMyCourseReview,
  searchCourses,
  toggleCourseReviewLike,
  updateMyCourseReview,
  type CourseReviewItem,
  type CourseReviewPageResponse,
  type CourseReviewSummary,
  type CourseReviewUpsertRequest,
} from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import type { CommunityReviewCourse } from "../types";
import { getFriendlyCommunityErrorMessage } from "../utils";
import { CommunityCourseSearchCard } from "./CommunityCourseSearchCard";
import { CommunityEmptyState } from "./CommunityEmptyState";
import { CommunityReviewCard } from "./CommunityReviewCard";
import { CommunityReviewComposer } from "./CommunityReviewComposer";
import { CommunityRatingStars } from "./CommunityRatingStars";

const COURSE_PAGE_SIZE = 6;
const REVIEW_PAGE_SIZE = 10;

function getSelectedCourse(searchParams: URLSearchParams): CommunityReviewCourse | null {
  const id = searchParams.get("courseId");
  if (!id) return null;

  return {
    id,
    title: searchParams.get("title") || "선택한 강좌",
    institution: searchParams.get("institution") || "기관 정보 없음",
    platform: searchParams.get("platform") || "",
    category: searchParams.get("category") || "기타",
    difficulty: "",
    durationWeeks: 0,
    estimatedHours: 0,
    hasCertificate: false,
    url: searchParams.get("url") || "",
  };
}

export function CommunityReviewSection() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const selectedCourse = useMemo(() => getSelectedCourse(searchParams), [searchParams]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CommunityReviewCourse[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [summary, setSummary] = useState<CourseReviewSummary | null>(null);
  const [reviewPage, setReviewPage] = useState<CourseReviewPageResponse | null>(null);
  const [myReview, setMyReview] = useState<CourseReviewItem | undefined>();
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewPageIndex, setReviewPageIndex] = useState(0);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [deletePending, setDeletePending] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [likeReviewId, setLikeReviewId] = useState<string | null>(null);
  const [likeError, setLikeError] = useState<string | null>(null);

  const handleSearchCourses = useCallback(async () => {
    const keyword = searchQuery.trim();
    if (!keyword) {
      setSearchResults([]);
      setSearchError("강좌명을 입력해 주세요.");
      return;
    }

    setSearchLoading(true);
    setSearchError(null);
    try {
      const response = await searchCourses({ keyword, page: 0, size: COURSE_PAGE_SIZE, sort: "latest" });
      setSearchResults(response.content);
      if (response.content.length === 0) {
        setSearchError("검색 결과가 없어요. 다른 키워드로 다시 찾아보세요.");
      }
    } catch (err) {
      setSearchResults([]);
      setSearchError(getFriendlyCommunityErrorMessage(err, "강좌 검색에 실패했어요."));
    } finally {
      setSearchLoading(false);
    }
  }, [searchQuery]);

  const updateSelectedCourse = useCallback((course: CommunityReviewCourse | null) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("tab", "reviews");

    if (course) {
      nextParams.set("courseId", course.id);
      nextParams.set("title", course.title);
      nextParams.set("institution", course.institution);
      nextParams.set("platform", course.platform);
      nextParams.set("category", course.category);
      if (course.url) nextParams.set("url", course.url);
      else nextParams.delete("url");
    } else {
      ["courseId", "title", "institution", "platform", "category", "url"].forEach((key) => nextParams.delete(key));
    }

    setSearchParams(nextParams, { replace: true });
    setReviewPageIndex(0);
    setFormError(null);
    setLikeError(null);
  }, [searchParams, setSearchParams]);

  const loadSelectedCourseData = useCallback(async (pageNum: number) => {
    if (!selectedCourse?.id) {
      setSummary(null);
      setReviewPage(null);
      setMyReview(undefined);
      setReviewError(null);
      return;
    }

    setReviewLoading(true);
    setReviewError(null);

    try {
      const [summaryResponse, reviewsResponse, myReviewResponse] = await Promise.all([
        getCourseReviewSummary(selectedCourse.id),
        getCourseReviews(selectedCourse.id, { page: pageNum, size: REVIEW_PAGE_SIZE }),
        getMyCourseReview(selectedCourse.id).catch((err) => {
          const message = err instanceof Error ? err.message : "";
          if (message === "UNAUTHORIZED") return undefined;
          throw err;
        }),
      ]);

      setSummary(summaryResponse);
      setReviewPage(reviewsResponse);
      setMyReview(myReviewResponse);
      setReviewPageIndex(pageNum);
    } catch (err) {
      setSummary(null);
      setReviewPage(null);
      setMyReview(undefined);
      setReviewError(getFriendlyCommunityErrorMessage(err, "리뷰를 불러오지 못했어요."));
    } finally {
      setReviewLoading(false);
    }
  }, [selectedCourse?.id]);

  useEffect(() => {
    if (!selectedCourse?.id) return;
    void loadSelectedCourseData(reviewPageIndex);
  }, [selectedCourse?.id, reviewPageIndex, loadSelectedCourseData]);

  const visibleReviews = useMemo(() => {
    const content = reviewPage?.content ?? [];
    return myReview ? content.filter((review) => review.id !== myReview.id) : content;
  }, [myReview, reviewPage?.content]);

  const handleReviewSubmit = async (payload: CourseReviewUpsertRequest) => {
    if (!selectedCourse) return;

    try {
      setFormSubmitting(true);
      setFormError(null);
      if (myReview) {
        await updateMyCourseReview(selectedCourse.id, payload);
      } else {
        await createCourseReview(selectedCourse.id, payload);
      }
      await loadSelectedCourseData(0);
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(
        err,
        myReview ? "리뷰 수정에 실패했어요." : "리뷰 등록에 실패했어요."
      );
      setFormError(message);
      if (message.includes("로그인")) navigate("/auth");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteMyReview = async () => {
    if (!selectedCourse || !myReview) return;

    try {
      setDeletePending(true);
      setFormError(null);
      await deleteMyCourseReview(selectedCourse.id);
      await loadSelectedCourseData(0);
    } catch (err) {
      setFormError(getFriendlyCommunityErrorMessage(err, "리뷰 삭제에 실패했어요."));
    } finally {
      setDeletePending(false);
    }
  };

  const handleToggleLike = async (reviewId: string) => {
    try {
      setLikeReviewId(reviewId);
      setLikeError(null);
      const response = await toggleCourseReviewLike(reviewId);

      setMyReview((prev) => prev?.id === reviewId ? { ...prev, likedByMe: response.liked, likeCount: response.likeCount } : prev);
      setReviewPage((prev) => prev ? {
        ...prev,
        content: prev.content.map((review) => review.id === reviewId
          ? { ...review, likedByMe: response.liked, likeCount: response.likeCount }
          : review),
      } : prev);
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(err, "리뷰 좋아요 처리에 실패했어요.");
      setLikeError(message);
      if (message.includes("로그인")) navigate("/auth");
    } finally {
      setLikeReviewId(null);
    }
  };

  const handleEditFromCard = (review: CourseReviewItem) => {
    setMyReview(review);
    setFormError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="space-y-6">
      <div className="rounded-[20px] border border-[#E5E0D8] bg-white p-5 sm:p-6">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="mb-2 text-[24px] font-[800] text-[#2C2C2C]">강좌 리뷰</h2>
            <p className="text-[14px] text-[#777777]">강좌를 검색해 리뷰를 확인하고, 이수한 강좌라면 후기를 남겨보세요.</p>
          </div>
          {selectedCourse ? (
            <button
              type="button"
              onClick={() => updateSelectedCourse(null)}
              className="self-start rounded-full border border-[#E5E0D8] bg-[#F8F6F1] px-4 py-2 text-[13px] font-[700] text-[#666666]"
            >
              선택 해제
            </button>
          ) : null}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#999999]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void handleSearchCourses();
              }}
              placeholder="리뷰를 볼 강좌명을 검색해 주세요"
              className="h-[52px] w-full rounded-[16px] border border-[#E5E0D8] bg-[#FCFBF8] pl-11 pr-4 text-[14px] text-[#2C2C2C] outline-none focus:border-[#3B6B4A]"
            />
          </div>
          <button
            type="button"
            onClick={() => void handleSearchCourses()}
            disabled={searchLoading}
            className="rounded-full bg-[#3B6B4A] px-6 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438] disabled:opacity-40"
          >
            {searchLoading ? "검색 중..." : "강좌 검색"}
          </button>
        </div>

        {searchError ? <p className="mt-3 text-[13px] text-[#C75B7A]">{searchError}</p> : null}

        {searchResults.length > 0 ? (
          <div className="mt-5 grid gap-3">
            {searchResults.map((course) => (
              <CommunityCourseSearchCard
                key={course.id}
                course={course}
                selected={selectedCourse?.id === course.id}
                onSelect={updateSelectedCourse}
              />
            ))}
          </div>
        ) : null}
      </div>

      {!selectedCourse ? (
        <CommunityEmptyState
          title="강좌를 먼저 선택해 주세요"
          description="검색창에서 강좌를 찾으면 해당 강좌의 리뷰 목록과 작성 폼이 열려요."
        />
      ) : reviewLoading ? (
        <div className="rounded-[18px] border border-[#E5E0D8] bg-white px-6 py-12 text-center text-[15px] text-[#777777]">
          리뷰를 불러오는 중이에요...
        </div>
      ) : reviewError ? (
        <CommunityEmptyState title="리뷰를 불러오지 못했어요" description={reviewError} actionLabel="다시 시도" onAction={() => void loadSelectedCourseData(reviewPageIndex)} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[20px] border border-[#E5E0D8] bg-white p-5 sm:p-6">
              <p className="mb-2 text-[12px] font-[700] text-[#3B6B4A]">선택한 강좌</p>
              <h3 className="mb-2 text-[22px] font-[800] text-[#2C2C2C]">{selectedCourse.title}</h3>
              <p className="text-[14px] text-[#777777]">{selectedCourse.institution}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="rounded-[16px] bg-[#F8F6F1] px-4 py-3">
                  <p className="text-[12px] text-[#888888]">평균 별점</p>
                  <div className="mt-1 flex items-center gap-2">
                    <Star className="h-4 w-4 fill-current text-[#E7A53D]" />
                    <span className="text-[20px] font-[800] text-[#2C2C2C]">{summary?.averageRating?.toFixed(1) ?? "0.0"}</span>
                  </div>
                </div>
                <div className="rounded-[16px] bg-[#F8F6F1] px-4 py-3">
                  <p className="text-[12px] text-[#888888]">리뷰 수</p>
                  <p className="mt-1 text-[20px] font-[800] text-[#2C2C2C]">{summary?.reviewCount ?? 0}개</p>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] border border-[#E5E0D8] bg-[#FCFBF8] p-5 sm:p-6">
              <p className="mb-3 text-[14px] font-[800] text-[#2C2C2C]">후기 분위기</p>
              <div className="mb-3 flex items-center gap-2">
                <CommunityRatingStars value={Math.round(summary?.averageRating ?? 0)} />
                <span className="text-[13px] text-[#666666]">수강생 평점을 기준으로 표시돼요.</span>
              </div>
              <p className="text-[13px] leading-[1.7] text-[#777777]">
                리뷰는 최신순으로 보여주고, 좋아요 수는 다른 수강생의 공감을 의미해요. 이수한 강좌라면 직접 리뷰를 남길 수 있어요.
              </p>
            </div>
          </div>

          <CommunityReviewComposer
            courseTitle={selectedCourse.title}
            myReview={myReview}
            submitting={formSubmitting}
            deleting={deletePending}
            error={formError}
            onSubmit={handleReviewSubmit}
            onDelete={handleDeleteMyReview}
          />

          {myReview ? (
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h3 className="text-[18px] font-[800] text-[#2C2C2C]">내 리뷰</h3>
                <p className="text-[12px] text-[#999999]">수정과 삭제는 여기서 바로 할 수 있어요.</p>
              </div>
              <CommunityReviewCard
                review={myReview}
                isMine
                likePending={likeReviewId === myReview.id}
                onLike={handleToggleLike}
                onEdit={handleEditFromCard}
                onDelete={() => void handleDeleteMyReview()}
                deletePending={deletePending}
              />
            </div>
          ) : null}

          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-[18px] font-[800] text-[#2C2C2C]">전체 리뷰</h3>
              <p className="text-[13px] text-[#888888]">총 {reviewPage?.totalElements ?? 0}개</p>
            </div>

            {likeError ? <p className="mb-3 text-[13px] text-[#C75B7A]">{likeError}</p> : null}

            {visibleReviews.length === 0 ? (
              <CommunityEmptyState title="아직 공개된 리뷰가 많지 않아요" description="첫 리뷰를 남기고 다른 수강생에게 도움을 줘 보세요." />
            ) : (
              <div className="space-y-3">
                {visibleReviews.map((review) => (
                  <CommunityReviewCard
                    key={review.id}
                    review={review}
                    isMine={review.authorId === user?.id}
                    likePending={likeReviewId === review.id}
                    onLike={handleToggleLike}
                    onEdit={review.authorId === user?.id ? handleEditFromCard : undefined}
                    onDelete={review.authorId === user?.id ? () => void handleDeleteMyReview() : undefined}
                    deletePending={deletePending && review.authorId === user?.id}
                  />
                ))}
              </div>
            )}

            {reviewPage && reviewPage.totalPages > 1 ? (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  type="button"
                  disabled={reviewPageIndex === 0}
                  onClick={() => setReviewPageIndex((prev) => Math.max(prev - 1, 0))}
                  className="rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-[13px] text-[#777777] disabled:opacity-40"
                >
                  이전
                </button>
                <span className="text-[13px] text-[#666666]">{reviewPageIndex + 1} / {reviewPage.totalPages}</span>
                <button
                  type="button"
                  disabled={!reviewPage.hasNext}
                  onClick={() => setReviewPageIndex((prev) => prev + 1)}
                  className="rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-[13px] text-[#777777] disabled:opacity-40"
                >
                  다음
                </button>
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
