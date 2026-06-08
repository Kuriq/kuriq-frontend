import type { CommunityTab } from "../types";

const tabs: Array<{ value: CommunityTab; label: string; description: string }> = [
  { value: "posts", label: "자유게시판", description: "학습 경험과 질문을 자유롭게 나눠요" },
  { value: "reviews", label: "강좌 리뷰", description: "수강 후기를 확인하고 별점을 남겨요" },
];

export function CommunitySectionTabs({
  value,
  onChange,
}: {
  value: CommunityTab;
  onChange: (value: CommunityTab) => void;
}) {
  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-2">
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={`rounded-[18px] border px-5 py-4 text-left transition-all ${
              active
                ? "border-[#3B6B4A] bg-[#E8F0EA] shadow-sm"
                : "border-[#E5E0D8] bg-white hover:border-[#CFC7BC]"
            }`}
          >
            <p className={`mb-1 text-[16px] font-[800] ${active ? "text-[#2D5A3A]" : "text-[#2C2C2C]"}`}>{tab.label}</p>
            <p className="text-[13px] text-[#777777]">{tab.description}</p>
          </button>
        );
      })}
    </div>
  );
}
