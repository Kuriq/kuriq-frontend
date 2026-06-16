import { useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { CommunityPostsSection } from "./community/components/CommunityPostsSection";
import { CommunityReviewSection } from "./community/components/CommunityReviewSection";
import { CommunitySectionTabs } from "./community/components/CommunitySectionTabs";
import type { CommunityTab } from "./community/types";

export default function CommunityPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = useMemo<CommunityTab>(() => searchParams.get("tab") === "reviews" ? "reviews" : "posts", [searchParams]);
  const mineOnly = searchParams.get("mine") === "true";
  const commentOnly = searchParams.get("comments") === "me";

  const handleTabChange = (nextTab: CommunityTab) => {
    const nextParams = new URLSearchParams(searchParams);
    if (nextTab === "reviews") nextParams.set("tab", "reviews");
    else nextParams.delete("tab");
    setSearchParams(nextParams, { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="커뮤니티" />

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8 page-enter">
        <div className="mx-auto w-full max-w-[1080px]">
          <div className="mb-8">
            <div>
              <h1 className="mb-2 text-[28px] font-[800] text-[#2C2C2C]">커뮤니티</h1>
              <p className="text-[14px] text-[#777777]">자유게시판과 강좌 리뷰를 한곳에서 확인할 수 있어요.</p>
            </div>
            {(mineOnly || commentOnly) && (
              <div className="mt-4">
                <Link
                  to="/mypage"
                  className="inline-flex rounded-full border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-[700] text-[#666666] hover:border-[#3B6B4A] hover:text-[#3B6B4A]"
                >
                  마이페이지로 이동
                </Link>
              </div>
            )}
          </div>

          <CommunitySectionTabs value={activeTab} onChange={handleTabChange} />

          {activeTab === "posts" ? <CommunityPostsSection mineOnly={mineOnly} commentOnly={commentOnly} /> : <CommunityReviewSection />}
        </div>
      </main>
    </div>
  );
}
