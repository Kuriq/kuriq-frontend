import { useState } from "react";
import { Navigation } from "../../components/layout/Navigation";
import { SearchBar } from "../../components/common/SearchBar";
import { FilterDropdown } from "../../components/common/FilterDropdown";
import { FilterChip } from "../../components/common/FilterChip";
import { CourseResultCard } from "../../components/common/CourseResultCard";
import { SortDropdown } from "../../components/common/SortDropdown";

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [duration, setDuration] = useState("");
  const [hasCertificate, setHasCertificate] = useState(false);
  const [sortBy, setSortBy] = useState("추천순");

  const handleSearch = () => {
    console.log("검색:", searchQuery);
  };

  const handleResetFilters = () => {
    setPlatform("");
    setCategory("");
    setLevel("");
    setDuration("");
    setHasCertificate(false);
  };

  const activeFilters = [
    platform && { label: platform, onRemove: () => setPlatform("") },
    category && { label: category, onRemove: () => setCategory("") },
    level && { label: level, onRemove: () => setLevel("") },
    duration && { label: duration, onRemove: () => setDuration("") },
    hasCertificate && { label: "수료증", onRemove: () => setHasCertificate(false) },
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  const mockCourses = [
    {
      courseName: "모두를 위한 파이썬",
      institution: "한국외국어대학교",
      platform: "K-MOOC",
      level: "입문",
      duration: "3시간",
    },
    {
      courseName: "데이터 과학을 위한 파이썬 입문",
      institution: "서울대학교",
      platform: "K-MOOC",
      level: "초급",
      duration: "4주",
    },
    {
      courseName: "파이썬 프로그래밍 기초",
      institution: "연세대학교",
      platform: "KOCW",
      level: "입문",
      duration: "8주",
    },
    {
      courseName: "데이터 분석을 위한 Python 활용",
      institution: "고려대학교",
      platform: "K-MOOC",
      level: "중급",
      duration: "6주",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="강좌 검색" />

      {/* Main content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-[1000px] mx-auto">
          {/* Search bar */}
          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          {/* Filter row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <FilterDropdown
              label="플랫폼"
              options={["K-MOOC", "KOCW", "온국민평생배움터", "서울시 평생학습포털"]}
              value={platform}
              onChange={setPlatform}
            />
            <FilterDropdown
              label="카테고리"
              options={["인문", "사회", "공학", "IT/SW", "자연과학", "교육", "예술", "의약학"]}
              value={category}
              onChange={setCategory}
            />
            <FilterDropdown
              label="난이도"
              options={["입문", "초급", "중급", "심화"]}
              value={level}
              onChange={setLevel}
            />
            <FilterDropdown
              label="수강 기간"
              options={["4주 이하", "4~8주", "8~12주", "12주 이상"]}
              value={duration}
              onChange={setDuration}
            />
            <button
              onClick={() => setHasCertificate(!hasCertificate)}
              className={`px-4 py-2 border rounded-full text-[13px] font-[600] transition-colors ${
                hasCertificate
                  ? "border-[#3B6B4A] bg-[#E8F0EA] text-[#3B6B4A]"
                  : "border-[#E5E0D8] bg-white text-[#2C2C2C] hover:border-[#C0C0C0]"
              }`}
            >
              수료증
            </button>

            <div className="flex-1" />

            {activeFilters.length > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-[13px] text-[#777777] hover:text-[#3B6B4A] transition-colors font-[400]"
              >
                필터 초기화
              </button>
            )}
          </div>

          {/* Active filters chips */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((filter, index) => (
                <FilterChip
                  key={index}
                  label={filter.label}
                  onRemove={filter.onRemove}
                />
              ))}
            </div>
          )}

          {/* Results header */}
          <div className="flex items-center justify-between mb-5 pt-4">
            <h2 className="text-[16px] text-[#2C2C2C] font-[600]">
              총 247개의 강좌를 찾았어요
            </h2>
            <SortDropdown value={sortBy} onChange={setSortBy} />
          </div>

          {/* Course results */}
          <div className="space-y-4">
            {mockCourses.map((course, index) => (
              <CourseResultCard
                key={index}
                courseName={course.courseName}
                institution={course.institution}
                platform={course.platform}
                level={course.level}
                duration={course.duration}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
