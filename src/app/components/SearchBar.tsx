import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  return (
    <div className="bg-white border border-[#E5E0D8] rounded-[14px] h-[52px] flex items-center px-5 gap-3 shadow-sm">
      <Search className="w-5 h-5 text-[#777777] flex-shrink-0" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="강좌 검색 (예: 파이썬, 한국어교원, 데이터 분석)"
        className="flex-1 bg-transparent border-none outline-none text-[#2C2C2C] placeholder:text-[#AAAAAA] text-[14px]"
      />
      <button
        onClick={onSearch}
        className="px-6 py-2 bg-[#3B6B4A] text-white rounded-full font-[600] text-[14px] hover:bg-[#2d5438] transition-colors flex-shrink-0"
      >
        검색
      </button>
    </div>
  );
}
