import { useCallback, useEffect, useState } from "react";
import { Heart, MessageSquare, Eye } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { createCommunityComment, getCommunityPost, toggleCommunityPostLike, type CommunityPostDetail } from "../api/client";
import { Navigation } from "../components/layout/Navigation";
import { useAuth } from "../context/AuthContext";
import { CommunityCommentComposer } from "./community/components/CommunityCommentComposer";
import { CommunityCommentThread } from "./community/components/CommunityCommentThread";
import { CommunityEmptyState } from "./community/components/CommunityEmptyState";
import { formatRelativeKoreanDate, getFriendlyCommunityErrorMessage } from "./community/utils";

export default function CommunityPostDetailPage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [post, setPost] = useState<CommunityPostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [likePending, setLikePending] = useState(false);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [commentError, setCommentError] = useState<string | null>(null);

  const loadPost = useCallback(async (options?: { increaseView?: boolean }) => {
    if (!postId) return;

    setLoading(true);
    setError(null);
    setNeedsLogin(false);

    try {
      const data = await getCommunityPost(postId, options);
      setPost(data);
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(err, "게시글을 불러오지 못했어요.");
      setError(message);
      setNeedsLogin(message.includes("로그인"));
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    void loadPost({ increaseView: true });
  }, [loadPost]);

  const handleToggleLike = async () => {
    if (!postId || !post || likePending) return;
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      setLikePending(true);
      setLikeError(null);
      const result = await toggleCommunityPostLike(postId);
      setPost((prev) => prev ? { ...prev, likedByMe: result.liked, likeCount: result.likeCount } : prev);
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(err, "좋아요 처리에 실패했어요.");
      setLikeError(message);
    } finally {
      setLikePending(false);
    }
  };

  const handleCreateComment = async ({ content, anonymous }: { content: string; anonymous: boolean }) => {
    if (!postId) return;
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    try {
      setCommentError(null);
      await createCommunityComment(postId, { content, anonymous });
      await loadPost({ increaseView: false });
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(err, "댓글 등록에 실패했어요.");
      setCommentError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="커뮤니티" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[980px]">
          <Link to="/community" className="mb-5 inline-flex text-[14px] font-[700] text-[#3B6B4A] hover:underline">
            ← 커뮤니티로 돌아가기
          </Link>

          {loading ? (
            <div className="rounded-[18px] border border-[#E5E0D8] bg-white px-6 py-12 text-center text-[15px] text-[#777777]">게시글을 불러오는 중이에요...</div>
          ) : error || !post ? (
            <CommunityEmptyState
              title="게시글을 불러오지 못했어요"
              description={error ?? "게시글을 찾을 수 없어요."}
              actionLabel={needsLogin ? "로그인하기" : "다시 시도"}
              onAction={needsLogin ? () => navigate("/auth") : () => void loadPost()}
            />
          ) : (
            <div className="space-y-6">
              <article className="rounded-[24px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#E8F0EA] px-3 py-1 text-[11px] font-[700] text-[#3B6B4A] whitespace-nowrap">자유게시판</span>
                      {post.anonymous ? <span className="rounded-full bg-[#F8F6F1] px-3 py-1 text-[11px] font-[700] text-[#7A6F62]">익명</span> : null}
                    </div>
                    <h1 className="mb-2 text-[28px] font-[800] leading-tight text-[#2C2C2C]">{post.title}</h1>
                    <p className="text-[14px] text-[#777777]">{post.authorName} · {formatRelativeKoreanDate(post.createdAt)}</p>
                  </div>
                </div>

                <div className="mb-6 whitespace-pre-wrap text-[15px] leading-[1.8] text-[#444444]">{post.content}</div>

                <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#888888]">
                  <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" />{post.viewCount}</span>
                  <span className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" />{post.commentCount}</span>
                  <button
                    type="button"
                    onClick={handleToggleLike}
                    disabled={likePending}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 transition-colors ${post.likedByMe ? "bg-[#FDEEF3] text-[#C75B7A]" : "bg-[#F8F6F1] text-[#666666]"}`}
                  >
                    <Heart className={`h-4 w-4 ${post.likedByMe ? "fill-current" : ""}`} />
                    {post.likeCount}
                  </button>
                </div>

                {likeError ? <p className="mt-3 text-[12px] text-[#C75B7A]">{likeError}</p> : null}
              </article>

              <section>
                <h2 className="mb-3 text-[18px] font-[800] text-[#2C2C2C]">댓글</h2>
                <div className="space-y-4">
                  <CommunityCommentComposer onSubmit={handleCreateComment} disabled={!isAuthenticated} />
                  {!isAuthenticated ? <p className="text-[12px] text-[#999999]">댓글 작성은 로그인 후 이용할 수 있어요.</p> : null}
                  {commentError ? <p className="text-[12px] text-[#C75B7A]">{commentError}</p> : null}
                  <CommunityCommentThread comments={post.comments} />
                </div>
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
