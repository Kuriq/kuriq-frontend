import { Navigation } from "../../components/layout/Navigation";
import { OwlMascot } from "../../components/common/OwlMascot";
import { ProgressCard } from "../../components/common/ProgressCard";
import { CourseProgressCard } from "../../components/common/CourseProgressCard";
import { RoadmapTimeline } from "../../components/common/RoadmapTimeline";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="대시보드" />

      {/* Main content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-[1100px] mx-auto">
          {/* Header row */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-[24px] font-[800] text-[#2C2C2C] mb-2">
                이번 주 학습
              </h1>
              <p className="text-[14px] text-[#777777]">
                Week 1 · 4월 1일 ~ 4월 7일
              </p>
            </div>

            {/* Owl mascot with speech bubble */}
            <div className="relative">
              <div className="bg-[#E8F0EA] rounded-2xl px-5 py-3 pr-14 border border-[#C8E0D0] shadow-sm">
                <p className="text-[13px] text-[#2C2C2C] font-[400] max-w-[280px]">
                  좋은 출발이에요! 첫 강의 이수 완료 🎉
                </p>
              </div>
              <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                <OwlMascot size={36} variant="normal" />
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="flex gap-8">
            {/* LEFT COLUMN (65%) */}
            <div className="flex-1" style={{ width: "65%" }}>
              {/* Progress card */}
              <ProgressCard
                weeklyProgress={50}
                completedCourses={1}
                totalCourses={2}
                remainingHours={2}
              />

              {/* Section title */}
              <h2 className="text-[18px] font-[800] text-[#2C2C2C] mb-4">
                📋 이번 주 강좌
              </h2>

              {/* Course cards */}
              <div className="space-y-3">
                <CourseProgressCard
                  isCompleted={true}
                  courseName="모두를 위한 파이썬"
                  progress="3/10강"
                  platform="K-MOOC"
                  platformColor="bg-[#E8F0EA] text-[#3B6B4A]"
                />
                <CourseProgressCard
                  isCompleted={false}
                  courseName="파이썬 프로그래밍 기초"
                  progress="1/8강"
                  platform="KOCW"
                  platformColor="bg-[#EBF5FB] text-[#3498DB]"
                />
              </div>
            </div>

            {/* RIGHT COLUMN (35%) */}
            <div className="flex-shrink-0" style={{ width: "35%" }}>
              <RoadmapTimeline currentWeek={1} totalWeeks={8} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
