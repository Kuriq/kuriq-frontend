import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { createCommunityPost, getCommunityPost, updateCommunityPost } from "../api/client";
import { Navigation } from "../components/layout/Navigation";
import { useAuth } from "../context/AuthContext";
import { getFriendlyCommunityErrorMessage } from "./community/utils";

export default function PostCreatePage() {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  const isEditMode = useMemo(() => Boolean(postId), [postId]);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

  useEffect(() => {
    if (!postId) return;

    const loadPost = async () => {
      try {
        setLoadingPost(true);
        setError(null);
        setNeedsLogin(false);
        setForbidden(false);
        const post = await getCommunityPost(postId, { increaseView: false });

        if (user?.id && post.authorId !== user.id) {
          setForbidden(true);
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setAnonymous(post.anonymous);
      } catch (err) {
        const message = getFriendlyCommunityErrorMessage(err, "게시글 정보를 불러오지 못했어요.");
        setError(message);
        setNeedsLogin(message.includes("로그인"));
      } finally {
        setLoadingPost(false);
      }
    };

    void loadPost();
  }, [postId, user?.id]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      setError("제목과 내용을 모두 입력해 주세요.");
      setNeedsLogin(false);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      setNeedsLogin(false);
      if (isEditMode && postId) {
        await updateCommunityPost(postId, { title: trimmedTitle, content: trimmedContent, anonymous });
        navigate(`/community/${postId}`);
      } else {
        const created = await createCommunityPost({ title: trimmedTitle, content: trimmedContent, anonymous });
        navigate(`/community/${created.id}`);
      }
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(
        err,
        isEditMode ? "게시글 수정에 실패했어요." : "게시글 작성에 실패했어요.",
        "로그인 정보가 만료되었어요. 내용을 확인한 뒤 다시 로그인해 주세요."
      );
      setError(message);
      setNeedsLogin(message.includes("로그인"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="커뮤니티" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[860px]">
          {loadingPost ? (
            <div className="rounded-[20px] border border-[#E5E0D8] bg-white px-6 py-12 text-center text-[15px] text-[#777777]">
              게시글 정보를 불러오는 중이에요...
            </div>
          ) : forbidden ? (
            <div className="rounded-[20px] border border-[#F0CAD5] bg-white px-6 py-12 text-center text-[15px] text-[#A94A67]">
              본인이 작성한 글만 수정할 수 있어요.
            </div>
          ) : (
            <>
          <div className="mb-6 rounded-[24px] border border-[#E5E0D8] bg-white p-6 shadow-sm sm:p-7">
            <p className="mb-2 text-[12px] font-[700] tracking-[0.08em] text-[#3B6B4A]">WRITE POST</p>
            <h1 className="mb-2 text-[26px] font-[800] text-[#2C2C2C]">{isEditMode ? "게시글 수정" : "게시글 작성"}</h1>
            <p className="text-[14px] text-[#777777]">
              {isEditMode ? "작성한 내용을 수정하고 다시 저장해 보세요." : "자유게시판에 질문이나 학습 경험을 남겨보세요."}
            </p>
          </div>

          <div className="rounded-[20px] border border-[#E5E0D8] bg-white p-6 sm:p-8">
            <div className="mb-6 rounded-[14px] bg-[#F8F6F1] px-4 py-3 text-[14px] text-[#666666]">
              현재 커뮤니티는 <span className="font-[700] text-[#3B6B4A]">자유 게시판</span>만 지원해요.
            </div>

            <div className="mb-6">
              <label className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">제목</label>
              <input
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value.slice(0, 50))}
                placeholder="제목을 입력해 주세요"
                className="h-[50px] w-full rounded-[14px] border border-[#E5E0D8] px-4 text-[15px] text-[#2C2C2C] outline-none focus:border-[#3B6B4A]"
              />
              <p className="mt-2 text-right text-[12px] text-[#999999]">{title.length}/50</p>
            </div>

            <div>
              <label className="mb-2 block text-[14px] font-[700] text-[#2C2C2C]">내용</label>
              <textarea
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="자유롭게 학습 경험이나 질문을 남겨 주세요"
                className="min-h-[320px] w-full resize-none rounded-[14px] border border-[#E5E0D8] px-4 py-4 text-[15px] leading-relaxed text-[#2C2C2C] outline-none focus:border-[#3B6B4A]"
              />
            </div>

            <label className="mt-5 inline-flex items-center gap-2 text-[13px] text-[#666666]">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(event) => setAnonymous(event.target.checked)}
                className="h-4 w-4 rounded border-[#D8D0C5] text-[#3B6B4A] focus:ring-[#3B6B4A]"
              />
              익명으로 게시글 작성하기
            </label>

            {error ? (
              <div className="mt-4 flex flex-col items-start gap-3 rounded-[14px] bg-[#FFF4F6] px-4 py-3 text-[13px] text-[#C75B7A]">
                <p>{error}</p>
                {needsLogin ? (
                  <button
                    type="button"
                    onClick={() => navigate("/auth")}
                    className="rounded-full border border-[#F0CAD5] bg-white px-4 py-2 text-[12px] font-[700] text-[#A94A67]"
                  >
                    로그인하러 가기
                  </button>
                ) : null}
              </div>
            ) : null}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(isEditMode && postId ? `/community/${postId}` : "/community")}
                className="rounded-full border border-[#E5E0D8] bg-white px-5 py-3 text-[14px] font-[700] text-[#666666] hover:bg-[#F8F6F1]"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting || !isValid}
                className="rounded-full bg-[#3B6B4A] px-6 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? (isEditMode ? "저장 중..." : "등록 중...") : (isEditMode ? "저장하기" : "등록하기")}
              </button>
            </div>
          </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
