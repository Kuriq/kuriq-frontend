import { ExternalLink } from "lucide-react";
import type { CommunityReviewCourse } from "../types";
import { getPlatformLabel } from "../../../utils/platform";

export function CommunityCourseSearchCard({
  course,
  selected,
  onSelect,
}: {
  course: CommunityReviewCourse;
  selected: boolean;
  onSelect: (course: CommunityReviewCourse) => void;
}) {
  return (
    <div className={`rounded-[18px] border p-4 transition-colors ${selected ? "border-[#3B6B4A] bg-[#F5FAF6]" : "border-[#E5E0D8] bg-white"}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="mb-1 text-[16px] font-[800] text-[#2C2C2C]">{course.title}</h3>
          <p className="text-[13px] text-[#777777]">{course.institution}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#E8F0EA] px-3 py-1 text-[11px] font-[700] text-[#3B6B4A]">
              {getPlatformLabel(course.platform)}
            </span>
            <span className="rounded-full bg-[#F3E5F5] px-3 py-1 text-[11px] font-[700] text-[#9C27B0]">
              {course.category}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {course.url ? (
            <a
              href={course.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-[#E5E0D8] bg-white px-4 py-2 text-[12px] font-[700] text-[#666666]"
            >
              강좌 보기
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => onSelect(course)}
            className={`rounded-full px-4 py-2 text-[12px] font-[700] transition-colors ${selected ? "bg-[#3B6B4A] text-white" : "bg-[#F8F6F1] text-[#3B6B4A] hover:bg-[#E8F0EA]"}`}
          >
            {selected ? "선택됨" : "리뷰 보기"}
          </button>
        </div>
      </div>
    </div>
  );
}
