interface CourseProgressCardProps {
  isCompleted: boolean;
  courseName: string;
  progress: string;
  platform: string;
  platformColor: string;
}

export function CourseProgressCard({
  isCompleted,
  courseName,
  progress,
  platform,
  platformColor,
}: CourseProgressCardProps) {
  return (
    <div
      className={`border rounded-2xl p-5 ${
        isCompleted
          ? "bg-[#E8F0EA] border-[#C8E0D0]"
          : "bg-white border-[#E5E0D8]"
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex-shrink-0 mt-1">
          {isCompleted ? (
            <div className="w-6 h-6 rounded-md bg-[#3B6B4A] flex items-center justify-center">
              <svg
                width="14"
                height="10"
                viewBox="0 0 14 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5L5 9L13 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div className="w-6 h-6 rounded-md border-2 border-[#D0D0D0] bg-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`text-[14px] font-[600] mb-2 ${
              isCompleted
                ? "text-[#3B6B4A] line-through decoration-2"
                : "text-[#2C2C2C]"
            }`}
          >
            {courseName} ({progress})
          </h4>
          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-[600] ${platformColor}`}
            >
              {platform}
            </span>
          </div>
        </div>

        {/* Action button */}
        <button
          className={`flex-shrink-0 px-4 py-2 rounded-full text-[13px] font-[600] border transition-colors ${
            isCompleted
              ? "border-[#3B6B4A] text-[#3B6B4A] hover:bg-[#C8E0D0]"
              : "border-[#3B6B4A] text-[#3B6B4A] hover:bg-[#E8F0EA]"
          }`}
        >
          {isCompleted ? "복습하기" : "이어듣기 →"}
        </button>
      </div>
    </div>
  );
}
