interface CourseCardProps {
  name: string;
  platform: string;
  level: string;
  duration: string;
}

export function CourseCard({ name, platform, level, duration }: CourseCardProps) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    "평생교육진흥원": "bg-[#E8F0EA] text-[#3B6B4A]",
    "한국형 온라인 공개강좌": "bg-[#E8F0EA] text-[#3B6B4A]",
  };

  const levelColors: Record<string, string> = {
    "입문": "bg-[#FFF3EB] text-[#E8985E]",
    "초급": "bg-[#FFF3EB] text-[#E8985E]",
    "중급": "bg-[#FEF3E7] text-[#E67E22]",
  };

  const durationColors = "bg-[#EBF5FB] text-[#3498DB]";

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 hover:border-[#3B6B4A] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-[14px] font-[600] text-[#2C2C2C] mb-3">
            {name}
          </h4>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-[600] ${platformColors[platform] || platformColors["K-MOOC"]}`}>
              {platform}
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-[600] ${levelColors[level] || levelColors["입문"]}`}>
              {level}
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-[600] ${durationColors}`}>
              {duration}
            </span>
          </div>
        </div>
        <button className="ml-4 px-4 py-2 border border-[#3B6B4A] text-[#3B6B4A] rounded-full text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors whitespace-nowrap">
          수강 신청 →
        </button>
      </div>
    </div>
  );
}
