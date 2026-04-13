import { CourseCard } from "./CourseCard";

interface Course {
  name: string;
  platform: string;
  level: string;
  duration: string;
}

interface WeekSectionProps {
  weekNumber: number;
  title: string;
  totalHours: number;
  courses: Course[];
}

export function WeekSection({ weekNumber, title, totalHours, courses }: WeekSectionProps) {
  return (
    <div className="mb-8">
      {/* Week header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#3B6B4A] text-white flex items-center justify-center font-[800] text-[16px] flex-shrink-0">
          {weekNumber}
        </div>
        <div className="flex-1">
          <h3 className="text-[18px] font-[800] text-[#2C2C2C] mb-1">
            {title}
          </h3>
          <p className="text-[13px] text-[#777777]">
            Week {weekNumber} · 총 {totalHours}시간
          </p>
        </div>
      </div>

      {/* Course cards */}
      <div className="ml-[54px] space-y-3">
        {courses.map((course, index) => (
          <CourseCard
            key={index}
            name={course.name}
            platform={course.platform}
            level={course.level}
            duration={course.duration}
          />
        ))}
      </div>
    </div>
  );
}
