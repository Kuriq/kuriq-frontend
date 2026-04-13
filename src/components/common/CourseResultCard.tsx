interface CourseResultCardProps {
  courseName: string;
  institution: string;
  platform: string;
  level: string;
  duration: string;
}

export function CourseResultCard({
  courseName,
  institution,
  platform,
  level,
  duration,
}: CourseResultCardProps) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    "KOCW": "bg-[#EBF5FB] text-[#3498DB]",
    "온국민평생배움터": "bg-[#FFF3EB] text-[#E8985E]",
    "서울시 평생학습포털": "bg-[#F3E5F5] text-[#9C27B0]",
  };

  const levelColors: Record<string, string> = {
    "입문": "bg-[#FFF3EB] text-[#E8985E]",
    "초급": "bg-[#FFF3EB] text-[#E8985E]",
    "중급": "bg-[#FEF3E7] text-[#E67E22]",
    "심화": "bg-[#FFEBEE] text-[#E53935]",
  };

  const durationColors = "bg-[#EBF5FB] text-[#3498DB]";

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 hover:border-[#3B6B4A] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-[16px] font-[800] text-[#2C2C2C] mb-1">
            {courseName}
          </h3>
          <p className="text-[13px] text-[#777777] mb-3">{institution}</p>
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
        <button className="ml-4 px-5 py-2.5 border border-[#3B6B4A] text-[#3B6B4A] rounded-full text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors whitespace-nowrap">
          수강 신청 →
        </button>
      </div>
    </div>
  );
}
