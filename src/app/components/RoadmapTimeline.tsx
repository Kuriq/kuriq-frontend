interface RoadmapTimelineProps {
  currentWeek: number;
  totalWeeks: number;
}

export function RoadmapTimeline({ currentWeek, totalWeeks }: RoadmapTimelineProps) {
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6">
      <h3 className="text-[16px] font-[800] text-[#2C2C2C] mb-6">
        📍 전체 로드맵 진행
      </h3>

      <div className="relative">
        {weeks.map((week, index) => {
          const isCurrent = week === currentWeek;
          const isPast = week < currentWeek;
          const isLast = index === weeks.length - 1;

          return (
            <div key={week} className="relative">
              <div className="flex items-center gap-4 mb-6">
                {/* Circle indicator */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-[800] text-[14px] ${
                      isCurrent
                        ? "bg-[#3B6B4A] text-white"
                        : isPast
                        ? "bg-[#E8F0EA] text-[#3B6B4A]"
                        : "bg-[#F0F0F0] text-[#999999]"
                    }`}
                  >
                    {week}
                  </div>

                  {/* Connecting line */}
                  {!isLast && (
                    <div
                      className={`absolute left-1/2 top-10 w-0.5 h-6 -translate-x-1/2 ${
                        isPast ? "bg-[#3B6B4A]" : "bg-[#E0E0E0]"
                      }`}
                    />
                  )}
                </div>

                {/* Week label */}
                <div className="flex-1">
                  <span
                    className={`text-[13px] font-[600] ${
                      isCurrent
                        ? "text-[#3B6B4A]"
                        : isPast
                        ? "text-[#777777]"
                        : "text-[#999999]"
                    }`}
                  >
                    Week {week}
                  </span>
                  {isCurrent && (
                    <div className="mt-1 text-[12px] text-[#3B6B4A] font-[600]">
                      📌 현재 진행 중
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
