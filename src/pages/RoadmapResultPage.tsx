import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";
import { getRoadmap, type Roadmap, type RoadmapWeek, type RoadmapItem } from "../api/client";
import { getPlatformLabel } from "../utils/platform";

export default function RoadmapResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Home에서 생성 후 전달받은 경우
    if (location.state?.roadmap) {
      setRoadmap(location.state.roadmap);
      setLoading(false);
      return;
    }

    // roadmapId로 조회
    const roadmapId = location.state?.roadmapId;
    if (roadmapId) {
      getRoadmap(roadmapId)
        .then(setRoadmap)
        .catch(() => setError("로드맵을 불러오지 못했습니다."))
        .finally(() => setLoading(false));
    } else {
      setError("로드맵 정보를 찾을 수 없습니다.");
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="로드맵" />
        <main className="flex-1 px-8 py-12 flex items-center justify-center">
          <p className="text-[16px] text-[#777777]">로드맵을 불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="로드맵" />
        <main className="flex-1 px-8 py-12 flex flex-col items-center justify-center">
          <p className="text-[16px] text-red-600 mb-4">{error || "로드맵이 없습니다."}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-[#3B6B4A] text-white rounded-full font-[600] text-[14px]"
          >
            홈으로 돌아가기
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="로드맵" />

      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12">
        <div className="max-w-[800px] mx-auto page-enter">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0">
              <OwlMascot size={40} variant="winking" />
            </div>
            <div>
              <h1 className="text-[24px] font-[800] text-[#2C2C2C] mb-2">맞춤 로드맵이 완성됐어요!</h1>
              <p className="text-[14px] text-[#777777]">
                {roadmap.totalWeeks}주 과정 · 강좌 {roadmap.totalCourses}개
              </p>
            </div>
          </div>

          <div className="bg-[#E8F0EA] rounded-[14px] p-6 mb-10">
            <div className="flex items-start gap-3">
              <span className="text-[24px]">🎯</span>
              <div>
                <h2 className="text-[16px] font-[800] text-[#3B6B4A] mb-2">학습 목표</h2>
                <p className="text-[14px] text-[#2C2C2C] leading-relaxed">{roadmap.goal}</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            {roadmap.weeks.map((week) => (
              <RoadmapWeekSection key={week.weekNumber} week={week} />
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 pb-12">
            <button
              type="button"
              onClick={() => navigate("/dashboard", { state: { roadmapId: roadmap.id } })}
              className="px-8 py-3 bg-[#3B6B4A] text-white rounded-full font-[600] text-[15px] hover:bg-[#2d5438] transition-colors"
            >
              이 로드맵 시작하기
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-8 py-3 bg-white border border-[#E5E0D8] text-[#2C2C2C] rounded-full font-[600] text-[15px] hover:border-[#3B6B4A] hover:bg-[#E8F0EA] transition-colors"
            >
              다시 생성하기
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function RoadmapWeekSection({ week }: { week: RoadmapWeek }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#3B6B4A] text-white flex items-center justify-center font-[800] text-[16px] flex-shrink-0">
          {week.weekNumber}
        </div>
        <div className="flex-1">
          <h3 className="text-[18px] font-[800] text-[#2C2C2C] mb-1">{week.title}</h3>
          <p className="text-[13px] text-[#777777]">
            Week {week.weekNumber} · 총 {week.totalHours}시간 · {week.completedCount}/{week.totalCount} 완료
          </p>
        </div>
      </div>

      <div className="ml-6 sm:ml-[54px] space-y-3">
        {week.items.map((item) => (
          <RoadmapCourseCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

function RoadmapCourseCard({ item }: { item: RoadmapItem }) {
  const { course } = item;
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    KOCW: "bg-[#EBF5FB] text-[#3498DB]",
    온국민평생배움터: "bg-[#FFF3EB] text-[#E8985E]",
    전국평생학습: "bg-[#F3E5F5] text-[#9C27B0]",
  };
  const displayPlatform = getPlatformLabel(course.platform);

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 hover:border-[#3B6B4A] transition-colors card-hover">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-[14px] font-[600] text-[#2C2C2C] mb-3">{course.title}</h4>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-[600] ${platformColors[displayPlatform] || platformColors["K-MOOC"]}`}>
              {displayPlatform}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-[600] bg-[#F3E5F5] text-[#9C27B0]">
              {course.category}
            </span>
          </div>
        </div>
        <a
          href={course.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 px-4 py-2 border border-[#3B6B4A] text-[#3B6B4A] rounded-full text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors whitespace-nowrap"
        >
          수강 신청 →
        </a>
      </div>
    </div>
  );
}
