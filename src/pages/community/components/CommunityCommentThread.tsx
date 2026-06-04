import type { CommunityCommentItem } from "../types";
import { formatRelativeKoreanDate } from "../utils";

function CommentItem({ comment, depth = 0 }: { comment: CommunityCommentItem; depth?: number }) {
  return (
    <div className={`${depth > 0 ? "ml-6 border-l border-[#EEE7DD] pl-4" : ""}`}>
      <div className="rounded-[14px] bg-[#FCFBF8] border border-[#EEE7DD] px-4 py-3">
        <div className="mb-1 flex items-center gap-2 text-[13px]">
          <span className="font-[700] text-[#2C2C2C]">{comment.authorName ?? "삭제된 사용자"}</span>
          <span className="text-[#999999]">{formatRelativeKoreanDate(comment.createdAt)}</span>
        </div>
        <p className={`text-[14px] leading-relaxed ${comment.isDeleted ? "text-[#AAAAAA] italic" : "text-[#555555]"}`}>
          {comment.content}
        </p>
      </div>

      {comment.replies.length > 0 ? (
        <div className="mt-3 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommunityCommentThread({ comments }: { comments: CommunityCommentItem[] }) {
  if (comments.length === 0) {
    return <div className="rounded-[14px] border border-dashed border-[#E5E0D8] bg-white px-4 py-6 text-center text-[14px] text-[#888888]">아직 댓글이 없어요.</div>;
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}
