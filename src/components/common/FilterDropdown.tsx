import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FilterDropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterDropdown({ label, options, value, onChange }: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
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
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 left-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 min-w-[160px] z-20">
            <button
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
