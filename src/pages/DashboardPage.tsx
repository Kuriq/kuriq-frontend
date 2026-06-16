import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getRoadmap, getMyRoadmaps, type Roadmap, type RoadmapWeek, type RoadmapItem, completeItem, uncompleteItem, getRecommendations, type NextCourse } from "../api/client";
import kuriWink from "../assets/images/kuri-wink.png";
import kuriSuccess from "../assets/images/kuri-success.png";
import { getPlatformLabel } from "../utils/platform";

export default function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [recommendations, setRecommendations] = useState<NextCourse[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. state로 전달받은 roadmapId 우선 사용
        const stateRoadmapId = (location.state as { roadmapId?: string } | null)?.roadmapId;

        let roadmapId: string | undefined = stateRoadmapId;

        // 2. 없으면 활성 로드맵 조회
        if (!roadmapId) {
          const myRoadmaps = await getMyRoadmaps(0, 10);
          const active = myRoadmaps.content.find((r) => r.isActive);
          if (active) {
            roadmapId = active.id;
          }
        }

        if (!roadmapId) {
          if (!cancelled) {
            setError("활성화된 로드맵이 없습니다. 로드맵을 먼저 생성해주세요.");
            setLoading(false);
          }
          return;
        }

        const data = await getRoadmap(roadmapId);
        if (!cancelled) {
          setRoadmap(data);
          const idx = data.weeks.findIndex((w) => w.weekNumber === data.currentWeek);
          setCurrentWeekIndex(idx >= 0 ? idx : 0);

          try {
            const recs = await getRecommendations(roadmapId);
            if (!cancelled) setRecommendations(recs ?? []);
          } catch {
            // 추천 실패해도 대시보드는 정상 표시
          }

          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError("로드맵을 불러오지 못했습니다.");
          setLoading(false);
        }
      }
    };

    loadDashboard();
    return () => { cancelled = true; };
  }, [location.state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="대시보드" />
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 flex items-center justify-center">
          <p className="text-[16px] text-[#777777]">대시보드를 불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (error || !roadmap) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="대시보드" />
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 flex flex-col items-center justify-center">
          <p className="text-[16px] text-[#777777] mb-4">{error || "활성화된 로드맵이 없습니다."}</p>
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

  const currentWeek = roadmap.weeks[currentWeekIndex];
  const prevWeek = currentWeekIndex > 0 ? roadmap.weeks[currentWeekIndex - 1] : null;
  const nextWeek = currentWeekIndex < roadmap.weeks.length - 1 ? roadmap.weeks[currentWeekIndex + 1] : null;
  const selectedWeekNumber = currentWeek?.weekNumber ?? roadmap.currentWeek;

  // currentWeek 가 없으면 에러 처리
  if (!currentWeek) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="대시보드" />
        <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12 flex flex-col items-center justify-center">
          <p className="text-[16px] text-[#777777] mb-4">주차 정보를 불러올 수 없습니다.</p>
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

  // 강좌 완료 상태 토글 핸들러
  const handleToggleComplete = (itemId: string, willBeCompleted: boolean) => {
    let nextSelectedWeekIndex: number | null = null;

    setRoadmap((prev) => {
      if (!prev) return null;

      const nextWeeks = prev.weeks.map((week) => {
        const targetItem = week.items.find((i) => i.id === itemId);
        if (!targetItem) return week;

        const nextCompletedCount = willBeCompleted
          ? week.completedCount + 1
          : week.completedCount - 1;

        return {
          ...week,
          items: week.items.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  isCompleted: willBeCompleted,
                  completedAt: willBeCompleted ? new Date().toISOString() : null,
                }
              : item
          ),
          completedCount: nextCompletedCount,
          weekProgressPercent: week.totalCount > 0 ? (nextCompletedCount / week.totalCount) * 100 : 0,
        };
      });

      const nextTotalItems = nextWeeks.reduce((sum, week) => sum + week.items.length, 0);
      const nextCompletedItems = nextWeeks.reduce(
        (sum, week) => sum + week.items.filter((i) => i.isCompleted).length,
        0
      );
      const nextProgressPercent = nextTotalItems > 0 ? (nextCompletedItems / nextTotalItems) * 100 : 0;
      const nextIsCompleted = nextTotalItems > 0 && nextCompletedItems === nextTotalItems;
      const nextCurrentWeek = nextWeeks.find((week) => week.items.some((item) => !item.isCompleted))?.weekNumber ?? prev.totalWeeks;
      const selectedWeekNumber = prev.weeks[currentWeekIndex]?.weekNumber;

      if (selectedWeekNumber === prev.currentWeek) {
        const candidateIndex = nextWeeks.findIndex((week) => week.weekNumber === nextCurrentWeek);
        nextSelectedWeekIndex = candidateIndex >= 0 ? candidateIndex : 0;
      }

      if (!prev.isCompleted && nextIsCompleted) {
        setShowCompletionModal(true);
      }

      return {
        ...prev,
        weeks: nextWeeks,
        isCompleted: nextIsCompleted,
        currentWeek: nextCurrentWeek,
        progressPercent: nextProgressPercent,
        completedAt: nextIsCompleted ? new Date().toISOString() : prev.completedAt,
      };
    });

    if (nextSelectedWeekIndex !== null) {
      setCurrentWeekIndex(nextSelectedWeekIndex);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="대시보드" />

      <main className="flex-1 px-4 py-8 sm:px-8 sm:py-12">
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
          <div className="flex flex-col lg:flex-row gap-6 page-enter">
            {/* LEFT COLUMN */}
            <div className="w-full lg:w-[65%]">
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
                  <CourseCard key={item.id} item={item} onToggleComplete={handleToggleComplete} />
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="w-full lg:w-[35%]">
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
                    const isCurrent = week.weekNumber === selectedWeekNumber;
                    const isFuture = week.weekNumber > selectedWeekNumber;
                    const shouldFillCircle = isCompleted || isCurrent;

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
                            backgroundColor: shouldFillCircle ? '#3B6B4A' : 'white',
                            border: shouldFillCircle ? 'none' : '2px solid #E5E0D8',
                            color: shouldFillCircle ? 'white' : '#AAAAAA',
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
                    진행률 {roadmap.progressPercent.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* 다음 추천 강좌 */}
              {recommendations.length > 0 && (
                <div className="mt-4">
                  <h2 className="font-bold mb-3" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                    🎯 큐리의 다음 추천
                  </h2>
                  <div className="space-y-3">
                    {recommendations.map((rec) => (
                      <div
                        key={rec.courseId}
                        className="bg-white rounded-xl p-4"
                        style={{ border: '1px solid #E5E0D8' }}
                      >
                        <p className="text-sm font-bold mb-1" style={{ color: '#2C2C2C' }}>
                          {rec.title}
                        </p>
                        <p className="text-xs mb-2" style={{ color: '#777777' }}>
                          {rec.institution}
                        </p>
                        <p className="text-xs mb-3" style={{ color: '#3B6B4A' }}>
                          {rec.message}
                        </p>

                        {rec.url ? (
                          <a
                            href={rec.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                          >
                            강좌 보기 →
                          </a>
                        ) : (
                          <span
                            className="inline-block text-xs font-medium px-3 py-1.5 rounded-lg"
                            style={{ backgroundColor: '#D7D2C9', color: '#6F6A62' }}
                          >
                            링크 준비 중
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {showCompletionModal && roadmap && (
        <RoadmapCompletionModal
          goal={roadmap.goal}
          onClose={() => setShowCompletionModal(false)}
          onGoMyRoadmaps={() => navigate("/roadmap")}
        />
      )}
    </div>
  );
}

function CourseCard({ item, onToggleComplete }: { item: RoadmapItem; onToggleComplete: (itemId: string, willBeCompleted: boolean) => void }) {
  const navigate = useNavigate();
  const { course, isCompleted } = item;
  const [loading, setLoading] = useState(false);

  const handleNoteClick = () => {
    navigate(`/note-editor?courseId=${course.id}&courseTitle=${encodeURIComponent(course.title)}`);
  };

  const handleCheckboxClick = async () => {
    setLoading(true);
    try {
      const willBeCompleted = !isCompleted;
      if (isCompleted) {
        await uncompleteItem(item.id);
      } else {
        await completeItem(item.id);
      }
      onToggleComplete(item.id, willBeCompleted);
    } catch (err) {
      console.error("강좌 완료 상태 변경 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    KOCW: "bg-[#E3F2FD] text-[#1976D2]",
    온국민평생배움터: "bg-[#FFE8D6] text-[#A05A2C]",
    전국평생학습: "bg-[#FDEEF3] text-[#C75B7A]",
    서울시평생학습포털: "bg-[#F3E5F5] text-[#9C27B0]",
  };
  const displayPlatform = getPlatformLabel(course.platform);

  return (
    <div
      className="rounded-xl p-4 flex items-center gap-4 card-hover"
      style={{
        backgroundColor: isCompleted ? '#F0F7ED' : 'white',
        border: `1px solid ${isCompleted ? '#C8E0D0' : '#E5E0D8'}`
      }}
    >
      <button
        type="button"
        onClick={handleCheckboxClick}
        disabled={loading}
        className="flex-shrink-0 w-[22px] h-[22px] rounded flex items-center justify-center transition-colors disabled:opacity-50"
        style={{ backgroundColor: isCompleted ? '#3B6B4A' : 'transparent', border: isCompleted ? 'none' : '2px solid #E5E0D8' }}
      >
        {!loading && isCompleted && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {loading && (
          <svg className="animate-spin" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <circle cx="7" cy="7" r="6" stroke="#3B6B4A" strokeWidth="2" fill="none" opacity="0.3"/>
            <path d="M7 1a6 6 0 0 1 6 6" stroke="#3B6B4A" strokeWidth="2" fill="none"/>
          </svg>
        )}
      </button>

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
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${platformColors[displayPlatform] || platformColors["K-MOOC"]}`}>
            {displayPlatform}
          </span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#F3E5F5] text-[#9C27B0]">
            {course.category}
          </span>
        </div>
        {course.institution && (
          <p className="text-xs" style={{ color: '#999999' }}>{course.institution}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          disabled={loading}
          onClick={handleNoteClick}
          className="hidden sm:block px-4 py-2 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50"
          style={{ borderColor: '#777777', color: '#777777', backgroundColor: 'transparent' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          {loading ? "로딩 중..." : "📝 노트 보기"}
        </button>
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
          <a
            href={course.url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
            style={{ borderColor: '#3B6B4A', color: '#3B6B4A', backgroundColor: 'transparent' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F0EA'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            🔁 복습하기
          </a>
        )}
      </div>
    </div>
  );
}

function RoadmapCompletionModal({
  goal,
  onClose,
  onGoMyRoadmaps,
}: {
  goal: string;
  onClose: () => void;
  onGoMyRoadmaps: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
      <div className="w-full max-w-[460px] rounded-[28px] bg-white p-8 text-center shadow-2xl border border-[#E5E0D8]">
        <img
          src={kuriSuccess}
          alt="로드맵 완료"
          className="mx-auto mb-5 h-[120px] w-[120px] animate-bounce object-contain drop-shadow-[0_10px_20px_rgba(59,107,74,0.18)]"
        />
        <p className="mb-2 text-[14px] font-[700] text-[#3B6B4A]">로드맵 완료</p>
        <h2 className="mb-3 text-[24px] font-[800] text-[#2C2C2C]">끝까지 해냈어요!</h2>
        <p className="mb-7 break-keep text-[14px] leading-relaxed text-[#777777]">
          <span className="font-[700] text-[#2C2C2C]">{goal}</span>
          <br />
          학습 여정을 모두 마쳤어요. 정말 수고 많았어요.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onGoMyRoadmaps}
            className="flex-1 rounded-full bg-[#3B6B4A] px-5 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438]"
          >
            내 로드맵 보기
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-[#E5E0D8] bg-white px-5 py-3 text-[14px] font-[700] text-[#2C2C2C] transition-colors hover:bg-[#F8F6F1]"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
