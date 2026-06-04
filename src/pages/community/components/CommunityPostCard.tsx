import { Heart, Eye, MessageSquare } from "lucide-react";
import { Link } from "react-router";
import type { CommunityPostCardItem } from "../types";
import { formatRelativeKoreanDate } from "../utils";

export function CommunityPostCard({ post }: { post: CommunityPostCardItem }) {
  return (
    <Link
      to={`/community/${post.id}`}
      className="block rounded-[16px] border border-[#E5E0D8] bg-white p-5 transition-all hover:border-[#3B6B4A] hover:shadow-sm"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-[800] text-[#2C2C2C] mb-1">{post.title}</h3>
          <p className="text-[13px] text-[#777777]">
            {post.authorName} · {formatRelativeKoreanDate(post.createdAt)}
          </p>
        </div>
        <span className="rounded-full bg-[#E8F0EA] px-3 py-1 text-[12px] font-[700] text-[#3B6B4A] whitespace-nowrap">
          자유게시판
        </span>
      </div>

      <div className="flex items-center gap-4 text-[13px] text-[#8A8A8A]">
        <span className="inline-flex items-center gap-1"><Heart className="h-4 w-4" />{post.likeCount}</span>
        <span className="inline-flex items-center gap-1"><MessageSquare className="h-4 w-4" />{post.commentCount}</span>
        <span className="inline-flex items-center gap-1"><Eye className="h-4 w-4" />{post.viewCount}</span>
      </div>
    </Link>
  );
}
