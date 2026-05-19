import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRoadmap, type Roadmap, type RoadmapWeek, type RoadmapItem } from "../api/client";
import kuriWink from "../assets/images/kuri-wink.png";

export default function DashboardPage() {
  const location = useLocation();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const roadmapId = location.state?.roadmapId;
    if (roadmapId) {
      getRoadmap(roadmapId)
        .then((data) => {
          setRoadmap(data);
          // 현재 진행 주차로 초기화
          const idx = data.weeks.findIndex((w) => w.weekNumber === data.currentWeek);
          setCurrentWeekIndex(idx >= 0 ? idx : 0);
        })
        .catch(() => setError("로드맵을 불러오지 못했습니다."))
        .finally(() => setLoading(false));
    } else {
      setError("활성화된 로드맵이 없습니다.");
      setLoading(false);
    }
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="대시보드" />
        <main className="flex-1 px-8 py-12 flex items-center justify-center">
          <p className="text-[16px] text-[#777777]">대시보드를 불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="대시보드" />
        <main className="flex-1 px-8 py-12 flex flex-col items-center justify-center">
          <p className="text-[16px] text-red-600 mb-4">{error || "활성화된 로드맵이 없습니다."}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2.5 bg-[#3B6B4A] text-white rounded-full font-[600] text-[14px]"
          >
            돌아가기
          </button>
        </main>
      </div>
    );
  }

  const currentWeek = roadmap.weeks[currentWeekIndex];
  const prevWeek = currentWeekIndex > 0 ? roadmap.weeks[currentWeekIndex - 1] : null;
  const nextWeek = currentWeekIndex < roadmap.weeks.length - 1 ? roadmap.weeks[currentWeekIndex + 1] : null;

  const weekStartDay = new Date();
  const weekEndDay = new Date();
  weekEndDay.setDate(weekEndDay.getDate() + 6);
  const formatDateShort = (d: Date) => `${d.getMonth() + 1}월 ${d.getDate()}일`;

  // 주차별 완료된 강좌 수 계산
  const totalCompletedItems = roadmap.weeks.reduce(
    (sum, w) => sum + w.items.filter((i) => i.isCompleted).length,
    0
  );
  const totalItems = roadmap.weeks.reduce((sum, w) => sum + w.items.length, 0);

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="대시보드" />

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[1100px] mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="font-bold" style={{ color: '#2C2C2C', fontSize: '24px' }}>
                이번 주 학습
              </h1>
              <div className="flex items-center gap-2">
                <button
                  disabled={!prevWeek}
                  onClick={() => setCurrentWeekIndex((i) => i - 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <ChevronLeft size={16} color="#777777" />
                </button>
                <span className="text-sm" style={{ color: '#777777' }}>
                  Week {currentWeek.weekNumber} · {currentWeek.title}
                </span>
                <button
                  disabled={!nextWeek}
                  onClick={() => setCurrentWeekIndex((i) => i + 1)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                  style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <ChevronRight size={16} color="#777777" />
                </button>
              </div>
            </div>
          </div>

          {/* Quri Greeting Card */}
          <div className="rounded-[14px] p-4 mb-6 flex items-center gap-3" style={{ backgroundColor: '#E8F0EA' }}>
            <img src={kuriWink} alt="" style={{ width: 36, height: 36 }} />
            <p className="text-sm font-medium" style={{ color: '#2C2C2C' }}>
              {roadmap.progressPercent >= 50
                ? "절반 넘었어요! 잘 하고 있어요 🎉"
                : roadmap.progressPercent > 0
                ? "좋은 시작이에요! 계속 가볼까요? 💪"
                : "새로운 시작을 응원해요! 🌟"}
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex gap-6">
            {/* LEFT COLUMN (65%) */}
            <div style={{ flex: '0 0 65%' }}>
              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: '1px solid #E5E0D8' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: '#2C2C2C' }}>이번 주 진행률</span>
                  <span className="font-bold" style={{ color: '#3B6B4A', fontSize: '22px' }}>
                    {currentWeek.totalCount > 0
                      ? Math.round((currentWeek.completedCount / currentWeek.totalCount) * 100)
                      : 0}%
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: '#E5E0D8' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      backgroundColor: '#3B6B4A',
                      width: `${currentWeek.totalCount > 0 ? (currentWeek.completedCount / currentWeek.totalCount) * 100 : 0}%`
                    }}
                  />
                </div>
                <div className="flex items-center justify-between text-[13px]" style={{ color: '#777777' }}>
                  <span>{currentWeek.completedCount}/{currentWeek.totalCount} 강좌 완료</span>
                  <span>남은 시간: 약 {currentWeek.totalHours}시간</span>
                </div>
              </div>

              {/* Section title */}
              <h2 className="font-bold mb-4" style={{ color: '#2C2C2C', fontSize: '18px' }}>
                📋 이번 주 강좌
              </h2>

              {/* Course cards */}
              <div className="space-y-3">
                {currentWeek.items.map((item) => (
                  <CourseCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN (35%) */}
            <div style={{ flex: '0 0 35%' }}>
              <h2 className="font-bold mb-4" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                📍 전체 로드맵
              </h2>

              {/* Vertical Timeline */}
              <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: '1px solid #E5E0D8' }}>
                <div className="relative space-y-5">
                  <div
                    className="absolute left-[15px] top-[15px] bottom-[15px] w-0.5"
                    style={{ backgroundColor: '#E5E0D8' }}
                  />

                  {roadmap.weeks.map((week) => {
                    const isCompleted = week.weekProgressPercent >= 100;
                    const isCurrent = week.weekNumber === roadmap.currentWeek;
                    const isFuture = week.weekNumber > roadmap.currentWeek;

                    return (
                      <div
                        key={week.weekNumber}
                        className="relative flex items-start gap-3 cursor-pointer"
                        onClick={() => {
                          const idx = roadmap.weeks.findIndex((w) => w.weekNumber === week.weekNumber);
                          setCurrentWeekIndex(idx);
                        }}
                      >
                        <div
                          className="flex-shrink-0 z-10 flex items-center justify-center font-bold"
                          style={{
                            width: isCurrent ? '40px' : '32px',
                            height: isCurrent ? '40px' : '32px',
                            borderRadius: '50%',
                            backgroundColor: isCompleted || isCurrent ? '#3B6B4A' : 'white',
                            border: isFuture ? '2px solid #E5E0D8' : 'none',
                            color: isFuture ? '#AAAAAA' : 'white',
                            fontSize: isCurrent ? '16px' : '14px'
                          }}
                        >
                          {week.weekNumber}
                        </div>
                        <div className="flex-1 pt-1">
                          <p
                            className="text-sm mb-1"
                            style={{
                              color: isFuture ? '#AAAAAA' : '#2C2C2C',
                              fontWeight: isCurrent ? 'bold' : 'normal'
                            }}
                          >
                            {week.title}
                          </p>
                          {isCompleted && (
                            <span className="text-xs font-medium" style={{ color: '#4CAF50' }}>
                              완료
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs font-medium" style={{ color: '#3B6B4A' }}>
                              📌 현재 진행 중
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stats Card */}
              <div className="rounded-xl p-4 space-y-3" style={{ backgroundColor: '#FFF3EB', border: '1px solid #FFE0CC' }}>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>📚</span>
                  <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
                    전체 {totalCompletedItems}/{totalItems} 강좌 완료
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>📊</span>
                  <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
                    진행률 {roadmap.progressPercent}%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function CourseCard({ item }: { item: RoadmapItem }) {
  const { course, isCompleted } = item;

  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    KOCW: "bg-[#E3F2FD] text-[#1976D2]",
    온국민평생배움터: "bg-[#FFE8D6] text-[#A05A2C]",
    서울시평생학습포털: "bg-[#F3E5F5] text-[#9C27B0]",
  };

  const levelColors: Record<string, string> = {
    입문: "bg-[#E8F0EA] text-[#3B6B4A]",
    초급: "bg-[#FFF9C4] text-[#827717]",
    중급: "bg-[#FEF3E7] text-[#E67E22]",
    심화: "bg-[#FDE8E8] text-[#C0392B]",
  };

  return (
    <div
      className="rounded-xl p-4 flex items-center gap-4"
      style={{
        backgroundColor: isCompleted ? '#F0F7ED' : 'white',
        border: `1px solid ${isCompleted ? '#C8E0D0' : '#E5E0D8'}`
      }}
    >
      <div
        className="flex-shrink-0 w-[22px] h-[22px] rounded flex items-center justify-center"
        style={{ backgroundColor: isCompleted ? '#3B6B4A' : 'transparent', border: isCompleted ? 'none' : '2px solid #E5E0D8' }}
      >
        {isCompleted && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p
            className="text-sm"
            style={{
              color: isCompleted ? '#777777' : '#2C2C2C',
              fontWeight: isCompleted ? 'normal' : 'bold',
              textDecoration: isCompleted ? 'line-through' : 'none'
            }}
          >
            {course.title}
          </p>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${platformColors[course.platform] || platformColors["K-MOOC"]}`}>
            {course.platform}
          </span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${levelColors[course.difficulty] || levelColors.입문}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {!isCompleted && (
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
            style={{ backgroundColor: '#3B6B4A', color: 'white' }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
            onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
          >
            시작하기 →
          </a>
        )}
        {isCompleted && (
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: '#3B6B4A', color: '#3B6B4A', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F0EA'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🔁 복습하기
          </button>
        )}
      </div>
    </div>
  );
}
