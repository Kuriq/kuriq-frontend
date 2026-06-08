import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { MessageSquarePlus } from "lucide-react";
import { getCommunityPosts, getMyCommunityComments, getMyCommunityPosts, type CommunityPostPageResponse, type CommunityPostSummary } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import type { CommunitySort } from "../types";
import { CommunityEmptyState } from "./CommunityEmptyState";
import { CommunityPostCard } from "./CommunityPostCard";
import { CommunitySortTabs } from "./CommunitySortTabs";
import { getFriendlyCommunityErrorMessage } from "../utils";

export function CommunityPostsSection({ mineOnly = false, commentOnly = false }: { mineOnly?: boolean; commentOnly?: boolean }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sort, setSort] = useState<CommunitySort>("latest");
  const [page, setPage] = useState(0);
  const [postPage, setPostPage] = useState<CommunityPostPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNeedsLogin(false);

    try {
      let data: CommunityPostPageResponse;

      if (commentOnly) {
        const commentData = await getMyCommunityComments(page, 20);
        const mappedPosts: CommunityPostSummary[] = commentData.content.map((comment) => ({
          id: comment.postId,
          title: comment.postTitle,
          authorName: comment.anonymous ? "익명" : (user?.name ?? "나"),
          anonymous: comment.anonymous,
          viewCount: 0,
          likeCount: 0,
          commentCount: 0,
          createdAt: comment.createdAt,
        }));

        data = {
          content: mappedPosts,
          currentPage: commentData.currentPage,
          totalPages: commentData.totalPages,
          totalElements: commentData.totalElements,
          hasNext: commentData.hasNext,
        };
      } else if (mineOnly) {
        data = await getMyCommunityPosts(page, 20);
      } else {
        data = await getCommunityPosts({ sort, page, size: 20 });
      }

      setPostPage(data);
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(err, "게시글을 불러오지 못했어요.");
      setError(message);
      setNeedsLogin(message.includes("로그인"));
      setPostPage(null);
    } finally {
      setLoading(false);
    }
  }, [commentOnly, mineOnly, page, sort, user?.name]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const posts = postPage?.content ?? [];
  const title = useMemo(() => {
    if (commentOnly) return "작성한 댓글";
    if (mineOnly) return "작성한 글";
    return "자유게시판";
  }, [commentOnly, mineOnly]);

  const description = useMemo(() => {
    if (commentOnly) return "내가 남긴 댓글과 답글을 최근 순으로 확인할 수 있어요.";
    if (mineOnly) return "내가 작성한 게시글만 모아 볼 수 있어요.";
    return "질문, 후기, 팁을 편하게 남기고 다른 학습자와 소통해 보세요.";
  }, [commentOnly, mineOnly]);

  return (
    <section className="space-y-6">
      <div className="rounded-[24px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[12px] font-[700] tracking-[0.08em] text-[#3B6B4A]">FREE BOARD</p>
            <h2 className="mb-2 text-[24px] font-[800] text-[#2C2C2C]">{title}</h2>
            <p className="text-[14px] text-[#777777]">{description}</p>
          </div>

          {!mineOnly && !commentOnly ? (
            <Link
              to="/community/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3B6B4A] px-5 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438]"
            >
              <MessageSquarePlus className="h-4 w-4" />
              글 작성하기
            </Link>
          ) : null}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#F0EBE2] pt-5 sm:flex-row sm:items-center sm:justify-between">
          {!mineOnly && !commentOnly ? <CommunitySortTabs value={sort} onChange={(next) => { setSort(next); setPage(0); }} /> : <div />}
          <p className="text-[13px] text-[#888888]">총 {postPage?.totalElements ?? 0}개의 글</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[18px] border border-[#E5E0D8] bg-white px-6 py-12 text-center text-[15px] text-[#777777] shadow-sm">
          게시글을 불러오는 중이에요...
        </div>
      ) : error ? (
        <CommunityEmptyState
          title="게시글을 불러오지 못했어요"
          description={error}
          actionLabel={needsLogin ? "로그인하기" : "다시 시도"}
          onAction={needsLogin ? () => navigate("/auth") : () => void loadPosts()}
        />
      ) : posts.length === 0 ? (
        <CommunityEmptyState title={commentOnly ? "작성한 댓글이 없어요" : mineOnly ? "작성한 글이 없어요" : "아직 게시글이 없어요"} description={commentOnly ? "커뮤니티에서 첫 댓글을 남겨 보세요." : mineOnly ? "첫 번째 글을 작성해 보세요." : "첫 번째 글을 작성해 보세요."} />
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {postPage && postPage.totalPages > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={page === 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-[13px] text-[#777777] disabled:opacity-40"
          >
            이전
          </button>
          <span className="text-[13px] text-[#666666]">{page + 1} / {postPage.totalPages}</span>
          <button
            type="button"
            disabled={!postPage.hasNext}
            onClick={() => setPage((prev) => prev + 1)}
            className="rounded-lg border border-[#E5E0D8] bg-white px-3 py-2 text-[13px] text-[#777777] disabled:opacity-40"
          >
            다음
          </button>
        </div>
      ) : null}
    </section>
  );
}
