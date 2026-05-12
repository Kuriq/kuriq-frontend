import { useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";

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

  const activeFilters: Array<{ label: string; onRemove: () => void }> = [
    platform ? { label: platform, onRemove: () => setPlatform("") } : null,
    category ? { label: category, onRemove: () => setCategory("") } : null,
    level ? { label: level, onRemove: () => setLevel("") } : null,
    duration ? { label: duration, onRemove: () => setDuration("") } : null,
    hasCertificate
      ? { label: "수료증", onRemove: () => setHasCertificate(false) }
      : null,
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
              options={["K-MOOC", "KOCW", "온국민평생배움터", "서울시 평생학습포털"]}
              value={platform}
              onChange={setPlatform}
            />
            <FilterDropdownButton
              label="카테고리"
              options={["인문", "사회", "공학", "IT/SW", "자연과학", "교육", "예술", "의약학"]}
              value={category}
              onChange={setCategory}
            />
            <FilterDropdownButton
              label="난이도"
              options={["입문", "초급", "중급", "심화"]}
              value={level}
              onChange={setLevel}
            />
            <FilterDropdownButton
              label="수강 기간"
              options={["4주 이하", "4~8주", "8~12주", "12주 이상"]}
              value={duration}
              onChange={setDuration}
            />

            <button
              type="button"
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
              총 247개의 강좌를 찾았어요
            </h2>
            <SortMenu value={sortBy} onChange={setSortBy} />
          </div>

          <div className="space-y-4">
            {mockCourses.map((course) => (
              <SearchResultCard key={`${course.courseName}-${course.platform}`} {...course} />
            ))}
          </div>
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
  const sortOptions = ["추천순", "인기순", "최신순", "강좌명순"];

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
  courseName,
  institution,
  platform,
  level,
  duration,
}: {
  courseName: string;
  institution: string;
  platform: string;
  level: string;
  duration: string;
}) {
  const platformColors: Record<string, string> = {
    "K-MOOC": "bg-[#E8F0EA] text-[#3B6B4A]",
    KOCW: "bg-[#EBF5FB] text-[#3498DB]",
    온국민평생배움터: "bg-[#FFF3EB] text-[#E8985E]",
    서울시평생학습포털: "bg-[#F3E5F5] text-[#9C27B0]",
  };

  const levelColors: Record<string, string> = {
    입문: "bg-[#FFF3EB] text-[#E8985E]",
    초급: "bg-[#FFF3EB] text-[#E8985E]",
    중급: "bg-[#FEF3E7] text-[#E67E22]",
    심화: "bg-[#FFEBEE] text-[#E53935]",
  };

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-5 hover:border-[#3B6B4A] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-[16px] font-[800] text-[#2C2C2C] mb-1">{courseName}</h3>
          <p className="text-[13px] text-[#777777] mb-3">{institution}</p>
          <div className="flex flex-wrap gap-2">
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-[600] ${
                platformColors[platform] || platformColors["K-MOOC"]
              }`}
            >
              {platform}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[11px] font-[600] ${
                levelColors[level] || levelColors.입문
              }`}
            >
              {level}
            </span>
            <span className="px-3 py-1 rounded-full text-[11px] font-[600] bg-[#EBF5FB] text-[#3498DB]">
              {duration}
            </span>
          </div>
        </div>
        <button className="ml-4 px-5 py-2.5 border border-[#3B6B4A] text-[#3B6B4A] rounded-full text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors whitespace-nowrap">
          수강 신청 →
        </button>
      </div>
    </div>
  );
}
