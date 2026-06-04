import { Heart, Eye, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import type { CommunityPostCardItem } from "../types";
import { formatRelativeKoreanDate } from "../utils";

export function CommunityPostCard({ post }: { post: CommunityPostCardItem }) {
  return (
    <Link
      to={`/community/${post.id}`}
      className="block rounded-[20px] border border-[#E5E0D8] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#3B6B4A]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-[#E8F0EA] px-3 py-1 text-[11px] font-[700] text-[#3B6B4A] whitespace-nowrap">
              자유게시판
            </span>
            {post.anonymous ? <span className="rounded-full bg-[#F8F6F1] px-3 py-1 text-[11px] font-[700] text-[#7A6F62]">익명</span> : null}
          </div>
          <h3 className="mb-1 text-[18px] font-[800] text-[#2C2C2C]">{post.title}</h3>
          <p className="text-[13px] text-[#777777]">
            {post.authorName} · {formatRelativeKoreanDate(post.createdAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[12px] text-[#8A8A8A]">
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F6F1] px-3 py-1.5"><Heart className="h-4 w-4" />{post.likeCount}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F6F1] px-3 py-1.5"><MessageSquare className="h-4 w-4" />{post.commentCount}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-[#F8F6F1] px-3 py-1.5"><Eye className="h-4 w-4" />{post.viewCount}</span>
      </div>
    </Link>
  );
}
