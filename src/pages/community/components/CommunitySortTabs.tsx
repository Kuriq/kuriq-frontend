import type { CommunitySort } from "../types";

const sortOptions: Array<{ label: string; value: CommunitySort }> = [
  { label: "최신순", value: "latest" },
  { label: "댓글많은순", value: "comments" },
];

export function CommunitySortTabs({ value, onChange }: { value: CommunitySort; onChange: (value: CommunitySort) => void }) {
  return (
    <div className="flex items-center gap-2">
      {sortOptions.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`rounded-full px-4 py-2 text-[13px] font-[700] transition-colors ${
            value === option.value
              ? "bg-[#E8F0EA] text-[#3B6B4A]"
              : "bg-white text-[#777777] border border-[#E5E0D8] hover:border-[#3B6B4A]"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
