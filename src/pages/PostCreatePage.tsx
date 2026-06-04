import { useState } from "react";
import { useNavigate } from "react-router";
import { createCommunityPost } from "../api/client";
import { Navigation } from "../components/layout/Navigation";
import { getFriendlyCommunityErrorMessage } from "./community/utils";

export default function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);

  const isValid = title.trim().length > 0 && content.trim().length > 0;

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
      const created = await createCommunityPost({ title: trimmedTitle, content: trimmedContent });
      navigate(`/community/${created.id}`);
    } catch (err) {
      const message = getFriendlyCommunityErrorMessage(
        err,
        "게시글 작성에 실패했어요.",
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
          <h1 className="mb-6 text-[26px] font-[800] text-[#2C2C2C]">게시글 작성</h1>

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
                onClick={() => navigate("/community")}
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
                {submitting ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
