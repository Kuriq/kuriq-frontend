import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface SortDropdownProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    "추천순",
    "인기순",
    "최신순",
    "강좌명순",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 text-[14px] text-[#2C2C2C] font-[400] hover:text-[#3B6B4A] transition-colors flex items-center gap-1"
      >
        {value}
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-1 right-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 min-w-[120px] z-20">
            {sortOptions.map((option) => (
              <button
                key={option}
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
