import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";
import { searchCourses, type CourseSearchResult } from "../api/client";
import { getPlatformFilterValue, getPlatformLabel } from "../utils/platform";

// 프론트 정렬 라벨 → 백엔드 정렬 파라매터 매핑
const sortMap: Record<string, string> = {
  "최신순": "latest",
  "인기순": "latest", // 백엔드에 인기순 없으면 최신순으로 폴백
  "강좌명순": "title",
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [platform, setPlatform] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("최신순");
  
  const [results, setResults] = useState<CourseSearchResult["content"]>([]);
  const [loading, setLoading] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [page, setPage] = useState(0);
  const size = 20;
  const hasHandledInitialFilterEffect = useRef(false);

  const fetchCourses = useCallback(async (pageNum = 0) => {
    setLoading(true);
    try {
      const res = await searchCourses({
        keyword: searchQuery || undefined,
        platform: platform ? getPlatformFilterValue(platform) : undefined,
        category: category || undefined,
        sort: sortMap[sortBy] || "latest",
        page: pageNum,
        size,
      });
      setResults(res.content);
      setTotalElements(res.totalElements);
      setPage(res.currentPage);
    } catch (err) {
      console.error("강좌 검색 실패:", err);
      setResults([]);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, platform, category, sortBy]);

  const handleSearch = () => {
    setPage(0);
    fetchCourses(0);
  };

  const handleResetFilters = () => {
    setPlatform("");
    setCategory("");
    setSortBy("최신순");
  };

  // 필터 변경 시 즉시 검색 실행
  useEffect(() => {
    if (!hasHandledInitialFilterEffect.current) {
      hasHandledInitialFilterEffect.current = true;
      return;
    }

    setPage(0);
    fetchCourses(0);
  }, [platform, category, fetchCourses]);

  // 초기 로딩 시 전체 강좌 조회
  useEffect(() => {
    fetchCourses(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeFilters = [
    platform ? { label: platform, onRemove: () => setPlatform("") } : null,
    category ? { label: category, onRemove: () => setCategory("") } : null,
  ].filter(Boolean) as Array<{ label: string; onRemove: () => void }>;

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="강좌 검색" />

      <main className="flex-1 px-8 py-12">
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-6">
            <SearchInputBar
              value={searchQuery}
              onChange={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <FilterDropdownButton
              label="플랫폼"
              options={["온국민평생배움터", "K-MOOC", "KOCW", "전국평생학습"]}
              value={platform}
              onChange={setPlatform}
            />
            <FilterDropdownButton
              label="카테고리"
              options={["인문·교양", "사회·법", "자연과학·공학", "IT·데이터", "의료·보건", "예술·문화", "경영·경제", "외국어", "취미·생활", "기타"]}
              value={category}
              onChange={setCategory}
            />

            <div className="flex-1" />

            {activeFilters.length > 0 && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-[13px] text-[#777777] hover:text-[#3B6B4A] transition-colors font-[400]"
              >
                필터 초기화
              </button>
            )}
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {activeFilters.map((filter) => (
                <ActiveFilterChip
                  key={filter.label}
                  label={filter.label}
                  onRemove={filter.onRemove}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-between mb-5 pt-4">
            <h2 className="text-[16px] text-[#2C2C2C] font-[600]">
              {loading ? "검색 중..." : `총 ${totalElements}개의 강좌를 찾았어요`}
            </h2>
            <SortMenu value={sortBy} onChange={setSortBy} />
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-[#E5E0D8] rounded-2xl p-5 animate-pulse">
                  <div className="h-5 bg-[#E5E0D8] rounded w-1/3 mb-2" />
                  <div className="h-4 bg-[#E5E0D8] rounded w-1/4 mb-3" />
                  <div className="flex gap-2">
                    <div className="h-5 bg-[#E5E0D8] rounded-full w-16" />
                    <div className="h-5 bg-[#E5E0D8] rounded-full w-12" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-[16px] text-[#777777] mb-2">검색 결과가 없습니다</p>
              <p className="text-[14px] text-[#AAAAAA]">다른 키워드로 검색해보세요</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((course) => (
                <SearchResultCard key={course.id} {...course} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalElements > size && (
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(totalElements / size)}
              onPageChange={fetchCourses}
            />
          )}
        </div>
      </main>
    </div>
  );
}

function SearchInputBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-[14px] h-[52px] flex items-center px-5 gap-3 shadow-sm">
      <Search className="w-5 h-5 text-[#777777] flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch()}
        placeholder="강좌 검색 (예: 파이썬, 한국어교원, 데이터 분석)"
        className="flex-1 bg-transparent border-none outline-none text-[#2C2C2C] placeholder:text-[#AAAAAA] text-[14px]"
      />
      <button
        type="button"
        onClick={onSearch}
        className="px-6 py-2 bg-[#3B6B4A] text-white rounded-full font-[600] text-[14px] hover:bg-[#2d5438] transition-colors flex-shrink-0"
      >
        검색
      </button>
    </div>
  );
}

function FilterDropdownButton({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    // 이미 선택된 옵션을 다시 클릭하면 해제 (토글)
    if (value === option) {
      onChange("");
    } else {
      onChange(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`px-4 py-2 border rounded-full text-[13px] font-[600] transition-colors flex items-center gap-1.5 ${
          value
            ? "border-[#3B6B4A] bg-[#E8F0EA] text-[#3B6B4A]"
            : "border-[#E5E0D8] bg-white text-[#2C2C2C] hover:border-[#C0C0C0]"
        }`}
      >
        {value || label}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-2 left-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 min-w-[160px] z-20">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setIsOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-[13px] text-[#777777] hover:bg-[#F8F6F1] transition-colors"
            >
              전체
            </button>
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionClick(option)}
                className={`w-full px-4 py-2 text-left text-[13px] hover:bg-[#F8F6F1] transition-colors ${
                  value === option ? "text-[#3B6B4A] font-[600]" : "text-[#2C2C2C]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ActiveFilterChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onRemove}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F0EA] text-[#3B6B4A] text-[12px] font-[600] hover:bg-[#dce8df] transition-colors"
    >
      {label}
      <X className="w-3.5 h-3.5" />
    </button>
  );
}

function SortMenu({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const sortOptions = ["최신순", "인기순", "강좌명순"];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="px-3 py-1.5 text-[14px] text-[#2C2C2C] font-[400] hover:text-[#3B6B4A] transition-colors flex items-center gap-1"
      >
        {value}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full mt-1 right-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 min-w-[120px] z-20">
            {sortOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-[13px] hover:bg-[#F8F6F1] transition-colors ${
                  value === option ? "text-[#3B6B4A] font-[600]" : "text-[#2C2C2C]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SearchResultCard({
  id,
  title,
  institution,
  platform,
  category,
  url,
}: {
  id: string;
  title: string;
  institution: string;
  platform: string;
  category: string;
  url: string;
}) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    KOCW: "bg-[#EBF5FB] text-[#3498DB]",
    온국민평생배움터: "bg-[#FFF3EB] text-[#E8985E]",
    전국평생학습: "bg-[#FDEEF3] text-[#C75B7A]",
    서울시평생학습포털: "bg-[#F3E5F5] text-[#9C27B0]",
  };
  const displayPlatform = getPlatformLabel(platform);

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 hover:border-[#3B6B4A] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-[16px] font-[800] text-[#2C2C2C] mb-1">{title}</h3>
          <p className="text-[13px] text-[#777777] mb-3">{institution}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-[600] ${
                platformColors[displayPlatform] || platformColors["K-MOOC"]
              }`}
            >
              {displayPlatform}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-[600] bg-[#F3E5F5] text-[#9C27B0]">
              {category}
            </span>
          </div>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-4 px-5 py-2.5 border border-[#3B6B4A] text-[#3B6B4A] rounded-full text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors whitespace-nowrap"
        >
          수강 신청 →
        </a>
      </div>
    </div>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  const pageGroupSize = 5;
  const groupStart = Math.floor(currentPage / pageGroupSize) * pageGroupSize;
  const groupEnd = Math.min(groupStart + pageGroupSize, totalPages);
  const pageNumbers = Array.from({ length: groupEnd - groupStart }, (_, index) => groupStart + index);
  const hasPreviousGroup = groupStart > 0;
  const hasNextGroup = groupEnd < totalPages;

  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button
        disabled={!hasPreviousGroup}
        onClick={() => onPageChange(Math.max(groupStart - pageGroupSize, 0))}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40"
        style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'white' }}
      >
        이전
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
            page === currentPage
              ? "bg-[#3B6B4A] border-[#3B6B4A] text-white font-[600]"
              : "bg-white border-[#E5E0D8] text-[#777777] hover:border-[#3B6B4A]"
          }`}
        >
          {page + 1}
        </button>
      ))}

      {hasNextGroup ? <span className="px-2 py-1.5 text-sm text-[#777777]">...</span> : null}

      <button
        disabled={!hasNextGroup}
        onClick={() => onPageChange(groupStart + pageGroupSize)}
        className="px-3 py-1.5 rounded-lg text-sm border transition-colors disabled:opacity-40"
        style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'white' }}
      >
        다음
      </button>
    </div>
  );
}
