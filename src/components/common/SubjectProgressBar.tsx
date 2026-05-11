interface SubjectProgressBarProps {
  subject: string;
  progress: number;
  completedCount: number;
}

export function SubjectProgressBar({
  subject,
  progress,
  completedCount,
}: SubjectProgressBarProps) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[14px] font-[600] text-[#2C2C2C]">
          {subject}
        </span>
        <span className="text-[12px] text-[#777777]">
          {completedCount}개 이수
        </span>
      </div>
      <div className="w-full h-2.5 bg-[#E5E0D8] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3B6B4A] rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
