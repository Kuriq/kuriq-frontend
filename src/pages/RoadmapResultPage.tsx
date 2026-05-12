import { useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";

const weekData = [
  {
    weekNumber: 1,
    title: "파이썬 기초 다지기",
    totalHours: 5,
    courses: [
      { name: "모두를 위한 파이썬", platform: "K-MOOC", level: "입문", duration: "3시간" },
      { name: "파이썬으로 시작하는 프로그래밍", platform: "평생교육진흥원", level: "입문", duration: "2시간" },
    ],
  },
  {
    weekNumber: 2,
    title: "데이터 다루기 기본",
    totalHours: 5,
    courses: [
      { name: "데이터 과학을 위한 파이썬 입문", platform: "K-MOOC", level: "초급", duration: "3시간" },
      { name: "Pandas 기초와 데이터 전처리", platform: "평생교육진흥원", level: "초급", duration: "2시간" },
    ],
  },
  {
    weekNumber: 3,
    title: "데이터 시각화 기초",
    totalHours: 5,
    courses: [
      { name: "Python으로 배우는 데이터 시각화", platform: "K-MOOC", level: "초급", duration: "3시간" },
      { name: "matplotlib와 seaborn 실습", platform: "한국형 온라인 공개강좌", level: "중급", duration: "2시간" },
    ],
  },
];

export default function RoadmapResultPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="로드맵" />

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-start gap-4 mb-8">
            <div className="flex-shrink-0">
              <OwlMascot size={40} variant="winking" />
            </div>
            <div>
              <h1 className="text-[24px] font-[800] text-[#2C2C2C] mb-2">맞춤 로드맵이 완성됐어요!</h1>
              <p className="text-[14px] text-[#777777]">8주 과정 · 주 5시간 · 강좌 16개</p>
            </div>
          </div>

          <div className="bg-[#E8F0EA] rounded-[14px] p-6 mb-10">
            <div className="flex items-start gap-3">
              <span className="text-[24px]">🎯</span>
              <div>
                <h2 className="text-[16px] font-[800] text-[#3B6B4A] mb-2">학습 목표</h2>
                <p className="text-[14px] text-[#2C2C2C] leading-relaxed">비전공자 → 파이썬 기반 데이터 분석 역량 습득</p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            {weekData.map((week) => (
              <RoadmapWeekSection key={week.weekNumber} {...week} />
            ))}

            <div className="text-center py-6">
              <p className="text-[14px] text-[#999999]">⋯ Week 4~8 계속 ⋯</p>
            </div>
          </div>

          <div className="flex justify-center gap-4 pb-12">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
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

function RoadmapWeekSection({
  weekNumber,
  title,
  totalHours,
  courses,
}: {
  weekNumber: number;
  title: string;
  totalHours: number;
  courses: Array<{ name: string; platform: string; level: string; duration: string }>;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#3B6B4A] text-white flex items-center justify-center font-[800] text-[16px] flex-shrink-0">
          {weekNumber}
        </div>
        <div className="flex-1">
          <h3 className="text-[18px] font-[800] text-[#2C2C2C] mb-1">{title}</h3>
          <p className="text-[13px] text-[#777777]">Week {weekNumber} · 총 {totalHours}시간</p>
        </div>
      </div>

      <div className="ml-[54px] space-y-3">
        {courses.map((course) => (
          <RoadmapCourseCard key={`${weekNumber}-${course.name}`} {...course} />
        ))}
      </div>
    </div>
  );
}

function RoadmapCourseCard({
  name,
  platform,
  level,
  duration,
}: {
  name: string;
  platform: string;
  level: string;
  duration: string;
}) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    평생교육진흥원: "bg-[#E8F0EA] text-[#3B6B4A]",
    한국형온라인공개강좌: "bg-[#E8F0EA] text-[#3B6B4A]",
  };

  const levelColors: Record<string, string> = {
    입문: "bg-[#FFF3EB] text-[#E8985E]",
    초급: "bg-[#FFF3EB] text-[#E8985E]",
    중급: "bg-[#FEF3E7] text-[#E67E22]",
  };

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 hover:border-[#3B6B4A] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="text-[14px] font-[600] text-[#2C2C2C] mb-3">{name}</h4>
          <div className="flex flex-wrap gap-2">
            <span className={`px-3 py-1 rounded-full text-[11px] font-[600] ${platformColors[platform] || platformColors["K-MOOC"]}`}>
              {platform}
            </span>
            <span className={`px-3 py-1 rounded-full text-[11px] font-[600] ${levelColors[level] || levelColors.입문}`}>
              {level}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-[600] bg-[#EBF5FB] text-[#3498DB]">{duration}</span>
          </div>
        </div>
        <button className="ml-4 px-4 py-2 border border-[#3B6B4A] text-[#3B6B4A] rounded-full text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors whitespace-nowrap">
          수강 신청 →
        </button>
      </div>
    </div>
  );
}
