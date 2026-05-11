interface CompletionItemProps {
  courseName: string;
  platform: string;
  date: string;
}

export function CompletionItem({ courseName, platform, date }: CompletionItemProps) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    "KOCW": "bg-[#EBF5FB] text-[#3498DB]",
    "온국민평생배움터": "bg-[#FFF3EB] text-[#E8985E]",
    "서울시 평생학습포털": "bg-[#F3E5F5] text-[#9C27B0]",
  };

  return (
    <div className="flex items-start gap-3 mb-4 last:mb-0">
      {/* Checkmark icon */}
      <div className="flex-shrink-0 mt-0.5">
        <div className="w-5 h-5 rounded-md bg-[#3B6B4A] flex items-center justify-center">
          <svg
            width="12"
            height="9"
            viewBox="0 0 12 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 4L4.5 7.5L11 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="text-[14px] font-[600] text-[#2C2C2C] mb-1.5">
          {courseName}
        </h4>
        <div className="flex items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-[600] ${
              platformColors[platform] || platformColors["K-MOOC"]
            }`}
          >
            {platform}
          </span>
          <span className="text-[12px] text-[#777777]">{date} 이수</span>
        </div>
      </div>
    </div>
  );
}
