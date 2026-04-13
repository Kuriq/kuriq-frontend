interface ProgressCardProps {
  weeklyProgress: number;
  completedCourses: number;
  totalCourses: number;
  remainingHours: number;
}

export function ProgressCard({
  weeklyProgress,
  completedCourses,
  totalCourses,
  remainingHours,
}: ProgressCardProps) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 mb-6">
      {/* Progress percentage */}
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[14px] text-[#777777] font-[400]">
          이번 주 진행률
        </span>
        <span className="text-[28px] font-[800] text-[#3B6B4A]">
          {weeklyProgress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-[#E5E0D8] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3B6B4A] rounded-full transition-all duration-500"
            style={{ width: `${weeklyProgress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-[13px] text-[#777777]">
        <span>
          {completedCourses}/{totalCourses} 강좌 완료
        </span>
        <span>남은 시간: 약 {remainingHours}시간</span>
      </div>
    </div>
  );
}
