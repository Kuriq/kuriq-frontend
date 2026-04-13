import { useNavigate } from "react-router";
import { Navigation } from "../../components/layout/Navigation";
import { OwlMascot } from "../../components/common/OwlMascot";
import { WeekSection } from "../../components/common/WeekSection";

export default function RoadmapPage() {
  const navigate = useNavigate();
  const weekData = [
    {
      weekNumber: 1,
      title: "파이썬 기초 다지기",
      totalHours: 5,
      courses: [
        {
          name: "모두를 위한 파이썬",
          platform: "K-MOOC",
          level: "입문",
          duration: "3시간"
        },
        {
          name: "파이썬으로 시작하는 프로그래밍",
          platform: "평생교육진흥원",
          level: "입문",
          duration: "2시간"
        }
      ]
    },
    {
      weekNumber: 2,
      title: "데이터 다루기 기본",
      totalHours: 5,
      courses: [
        {
          name: "데이터 과학을 위한 파이썬 입문",
          platform: "K-MOOC",
          level: "초급",
          duration: "3시간"
        },
        {
          name: "Pandas 기초와 데이터 전처리",
          platform: "평생교육진흥원",
          level: "초급",
          duration: "2시간"
        }
      ]
    },
    {
      weekNumber: 3,
      title: "데이터 시각화 기초",
      totalHours: 5,
      courses: [
        {
          name: "Python으로 배우는 데이터 시각화",
          platform: "K-MOOC",
          level: "초급",
          duration: "3시간"
        },
        {
          name: "matplotlib와 seaborn 실습",
          platform: "한국형 온라인 공개강좌",
          level: "중급",
          duration: "2시간"
        }
      ]
    }
  ];

  const handleStartRoadmap = () => {
    console.log("로드맵 시작하기");
    navigate("/dashboard");
  };

  const handleRegenerate = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="로드맵" />

      {/* Main content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-[800px] mx-auto">
          {/* Top section with mascot and heading */}
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0">
              <OwlMascot size={40} variant="winking" />
            </div>
            <div>
              <h1 className="text-[24px] font-[800] text-[#2C2C2C] mb-2">
                맞춤 로드맵이 완성됐어요!
              </h1>
              <p className="text-[14px] text-[#777777]">
                8주 과정 · 주 5시간 · 강좌 16개
              </p>
            </div>
          </div>

          {/* Goal summary card */}
          <div className="bg-[#E8F0EA] rounded-[14px] p-6 mb-10">
            <div className="flex items-start gap-3">
              <span className="text-[24px]">🎯</span>
              <div>
                <h2 className="text-[16px] font-[800] text-[#3B6B4A] mb-2">
                  학습 목표
                </h2>
                <p className="text-[14px] text-[#2C2C2C] leading-relaxed">
                  비전공자 → 파이썬 기반 데이터 분석 역량 습득
                </p>
              </div>
            </div>
          </div>

          {/* Weekly roadmap timeline */}
          <div className="mb-8">
            {weekData.map((week) => (
              <WeekSection
                key={week.weekNumber}
                weekNumber={week.weekNumber}
                title={week.title}
                totalHours={week.totalHours}
                courses={week.courses}
              />
            ))}

            {/* Continuation indicator */}
            <div className="text-center py-6">
              <p className="text-[14px] text-[#999999]">
                ⋯ Week 4~8 계속 ⋯
              </p>
            </div>
          </div>

          {/* Bottom action buttons */}
          <div className="flex justify-center gap-4 pb-12">
            <button
              onClick={handleStartRoadmap}
              className="px-8 py-3 bg-[#3B6B4A] text-white rounded-full font-[600] text-[15px] hover:bg-[#2d5438] transition-colors"
            >
              이 로드맵 시작하기
            </button>
            <button
              onClick={handleRegenerate}
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