import { useState } from "react";

export function CommunityCommentComposer({
  onSubmit,
  disabled,
}: {
  onSubmit: (payload: { content: string; anonymous: boolean }) => Promise<void>;
  disabled?: boolean;
}) {
  const [content, setContent] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || submitting || disabled) return;

    try {
      setSubmitting(true);
      await onSubmit({ content: trimmed, anonymous });
      setContent("");
      setAnonymous(false);
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
      <div className="mt-3 flex items-center justify-between gap-3">
        <label className="inline-flex items-center gap-2 text-[12px] text-[#777777]">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(event) => setAnonymous(event.target.checked)}
            disabled={disabled || submitting}
            className="h-4 w-4 rounded border-[#D8D0C5] text-[#3B6B4A] focus:ring-[#3B6B4A]"
          />
          익명 댓글
        </label>
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
