import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { Sparkles, MoreVertical, ChevronDown } from "lucide-react";
import { getMyRoadmaps, deleteRoadmap, activateRoadmap, type Roadmap } from "../api/client";
import kuriDefault from "../assets/images/kuri-default.png";
import kuriLogo from "../assets/images/kuri-logo.png";

type FilterType = "all" | "completed" | "abandoned";

const formatProgressPercent = (value: number) => value.toFixed(1);

export default function MyRoadmapsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setLoading(true);
    getMyRoadmaps(page, 10)
      .then((res) => {
        setRoadmaps(res.content);
        setHasMore(res.content.length >= 10);
      })
      .catch(() => setError("로드맵을 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [page]);

  const handleDelete = async (roadmapId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await deleteRoadmap(roadmapId);
      setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapId));
    } catch {
      alert("삭제에 실패했습니다.");
    }
  };

  const handleActivate = async (roadmapId: string) => {
    try {
      await activateRoadmap(roadmapId);
      setRoadmaps((prev) =>
        prev.map((r) =>
          r.id === roadmapId ? { ...r, isActive: true } : { ...r, isActive: false }
        )
      );
    } catch {
      alert("활성화에 실패했습니다.");
    }
  };

  const filteredRoadmaps = roadmaps.filter((r) => {
    if (activeFilter === "completed") return r.isCompleted;
    if (activeFilter === "abandoned") return !r.isCompleted && !r.isActive;
    return true;
  });

  const activeRoadmap = roadmaps.find((r) => r.isActive);
  const pastRoadmaps = filteredRoadmaps.filter((r) => r.id !== activeRoadmap?.id);

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="로드맵" />
        <main className="flex-1 px-8 py-8 flex items-center justify-center">
          <p className="text-[16px] text-[#777777]">로드맵을 불러오는 중...</p>
        </main>
      </div>
    );
  }

  if (roadmaps.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
        <Navigation activeMenu="로드맵" />
        <main className="flex-1 px-8 py-8">
          <div className="max-w-[1000px] mx-auto">
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
              <img src={kuriDefault} alt="" className="mb-6" style={{ width: 120, height: 120 }} />
              <h2 className="font-bold mb-2" style={{ color: '#2C2C2C', fontSize: '20px' }}>
                아직 만든 로드맵이 없어요
              </h2>
              <p className="mb-8 text-center" style={{ color: '#777777', fontSize: '14px' }}>
                큐리와 함께 첫 맞춤 로드맵을 만들어 볼까요?
              </p>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 h-12 px-6 rounded-lg font-medium transition-opacity"
                style={{ backgroundColor: '#3B6B4A', color: 'white', fontSize: '15px' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Sparkles size={18} />
                <span>+ 첫 로드맵 만들기</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="로드맵" />

      <main className="flex-1 px-8 py-8">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-bold" style={{ color: '#2C2C2C', fontSize: '28px' }}>
                🗺️ 내 로드맵
              </h1>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 h-11 px-5 rounded-lg font-medium transition-opacity"
                style={{ backgroundColor: '#3B6B4A', color: 'white', fontSize: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Sparkles size={16} />
                <span>+ 새 로드맵 만들기</span>
              </button>
            </div>
            <p style={{ color: '#777777', fontSize: '14px' }}>
              지금까지 만든 학습 로드맵을 관리해요
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-[14px]">
              {error}
            </div>
          )}

          {/* Active Roadmap */}
          {activeRoadmap && (
            <div className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold" style={{ color: '#2C2C2C', fontSize: '18px' }}>
                  📌 진행 중인 로드맵
                </h2>
                <span className="px-2 py-1 rounded text-xs" style={{ backgroundColor: '#E5E0D8', color: '#777777' }}>
                  1개
                </span>
              </div>

              <div
                className="bg-white rounded-2xl p-6"
                style={{ border: '2px solid #3B6B4A', boxShadow: '0 2px 8px rgba(59, 107, 74, 0.08)' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <img src={kuriLogo} alt="" className="flex-shrink-0" style={{ width: 32, height: 32 }} />

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold" style={{ color: '#2C2C2C', fontSize: '20px' }}>
                        {activeRoadmap.title || activeRoadmap.goal}
                      </h3>
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap" style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}>
                        📌 진행 중
                      </span>
                    </div>
                    <p className="text-sm truncate" style={{ color: '#555555' }}>
                      {activeRoadmap.goal}
                    </p>
                  </div>

                  <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#777777' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    onClick={() => handleDelete(activeRoadmap.id)}
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-4 text-[13px]" style={{ color: '#777777' }}>
                  <span>📅 {activeRoadmap.totalWeeks}주 과정</span>
                  <span>📚 {activeRoadmap.totalCourses}개 강좌</span>
                </div>

                <div className="rounded-xl p-4 mb-4" style={{ backgroundColor: '#F8F6F1' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm" style={{ color: '#2C2C2C' }}>전체 진행률</span>
                    <span className="font-bold" style={{ color: '#3B6B4A', fontSize: '18px' }}>
                      {formatProgressPercent(activeRoadmap.progressPercent)}%
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full mb-2 overflow-hidden" style={{ backgroundColor: '#E5E0D8' }}>
                    <div
                      className="h-full rounded-full"
                      style={{ backgroundColor: '#3B6B4A', width: `${activeRoadmap.progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs" style={{ color: '#777777' }}>
                    <span>시작일: {formatDate(activeRoadmap.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: activeRoadmap.totalWeeks }, (_, i) => i + 1).map((week) => (
                    <div
                      key={week}
                      className="rounded-full"
                      style={{
                        width: week === activeRoadmap.currentWeek ? '12px' : '10px',
                        height: week === activeRoadmap.currentWeek ? '12px' : '10px',
                        backgroundColor: week < activeRoadmap.currentWeek ? '#3B6B4A' : week === activeRoadmap.currentWeek ? '#3B6B4A' : '#E5E0D8',
                        border: week > activeRoadmap.currentWeek ? '1px solid #D0CCC4' : 'none'
                      }}
                      title={`Week ${week}`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => navigate("/roadmap-result", { state: { roadmapId: activeRoadmap.id } })}
                    className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                    style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'transparent' }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B6B4A'; e.currentTarget.style.color = '#3B6B4A'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = '#777777'; }}
                  >
                    상세 보기
                  </button>
                  <button
                    onClick={() => navigate("/dashboard", { state: { roadmapId: activeRoadmap.id } })}
                    className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity"
                    style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                  >
                    대시보드로 이동 →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filter & Sort */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {(["all", "completed", "abandoned"] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: activeFilter === filter ? '#3B6B4A' : 'white',
                    color: activeFilter === filter ? 'white' : '#777777',
                    border: `1px solid ${activeFilter === filter ? '#3B6B4A' : '#E5E0D8'}`
                  }}
                >
                  {filter === "all" ? "전체" : filter === "completed" ? "완료됨" : "중단됨"}
                </button>
              ))}
            </div>

            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors"
              style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
            >
              <span>최근 생성순</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* Past Roadmaps */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold" style={{ color: '#2C2C2C', fontSize: '18px' }}>
                📚 지난 로드맵
              </h2>
              <span className="text-xs" style={{ color: '#999999' }}>
                총 {pastRoadmaps.length}개
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {pastRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="bg-white rounded-2xl p-5"
                  style={{ border: '1px solid #E5E0D8', opacity: roadmap.isCompleted ? 1 : 0.9 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: roadmap.isCompleted ? '#E8F0EA' : '#F5F5F5',
                        color: roadmap.isCompleted ? '#3B6B4A' : '#999999'
                      }}
                    >
                      {roadmap.isCompleted ? "✅ 완료" : "⏸ 중단됨"}
                    </span>
                    <button
                      className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                      style={{ color: '#777777' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      onClick={() => handleDelete(roadmap.id)}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <h3 className="font-bold mb-2 line-clamp-2" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                    {roadmap.title || roadmap.goal}
                  </h3>
                  <p className="text-[13px] mb-3 line-clamp-2" style={{ color: '#777777' }}>
                    {roadmap.goal}
                  </p>

                  <div className="text-xs mb-3" style={{ color: '#999999' }}>
                    {roadmap.totalWeeks}주 과정 · {roadmap.totalCourses}개 강좌
                  </div>

                  <div className="w-full h-2 rounded-full mb-3 overflow-hidden" style={{ backgroundColor: '#E5E0D8' }}>
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: roadmap.isCompleted ? '#4CAF50' : '#BBBBBB',
                        width: `${roadmap.progressPercent}%`
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                      시작: {formatDate(roadmap.createdAt)}
                    </span>
                    <div className="flex gap-2">
                      {!roadmap.isActive && !roadmap.isCompleted && (
                        <button
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap"
                          style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'transparent' }}
                          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B6B4A'; e.currentTarget.style.color = '#3B6B4A'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = '#777777'; }}
                          onClick={() => handleActivate(roadmap.id)}
                        >
                          🔄 다시 시작하기
                        </button>
                      )}
                      <button
                        className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
                        style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'transparent' }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3B6B4A'; e.currentTarget.style.color = '#3B6B4A'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E0D8'; e.currentTarget.style.color = '#777777'; }}
                        onClick={() => navigate("/roadmap-result", { state: { roadmapId: roadmap.id } })}
                      >
                        📊 상세 보기
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination */}
          {hasMore && (
            <div className="flex items-center justify-center gap-2 mt-8 mb-12">
              <button
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40"
                style={{ backgroundColor: 'white', border: '1px solid #E5E0D8', color: '#777777' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
              >
                &lt;
              </button>
              <button
                className="w-9 h-9 flex items-center justify-center rounded-lg font-medium"
                style={{ backgroundColor: '#3B6B4A', color: 'white' }}
              >
                {page + 1}
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                style={{ backgroundColor: 'white', border: '1px solid #E5E0D8', color: '#777777' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
