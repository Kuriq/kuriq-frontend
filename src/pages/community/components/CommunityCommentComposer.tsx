import { useState } from "react";

export function CommunityCommentComposer({
  onSubmit,
  disabled,
}: {
  onSubmit: (content: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || submitting || disabled) return;

    try {
      setSubmitting(true);
      await onSubmit(trimmed);
      setContent("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-[16px] border border-[#E5E0D8] bg-white p-4">
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={disabled}
        placeholder={disabled ? "로그인 후 댓글을 남길 수 있어요" : "댓글을 남겨보세요"}
        className="min-h-[110px] w-full resize-none rounded-[12px] border border-[#EEE7DD] px-4 py-3 text-[14px] text-[#2C2C2C] outline-none focus:border-[#3B6B4A] disabled:cursor-not-allowed disabled:bg-[#F8F6F1] disabled:text-[#999999]"
      />
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[12px] text-[#999999]">대댓글은 아직 지원하지 않아요.</p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || submitting || !content.trim()}
          className="rounded-full bg-[#3B6B4A] px-5 py-2 text-[13px] font-[700] text-white transition-colors hover:bg-[#2d5438] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "등록 중..." : "댓글 등록"}
        </button>
      </div>
    </div>
  );
}
