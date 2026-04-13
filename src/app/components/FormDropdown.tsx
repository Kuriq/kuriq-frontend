import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FormDropdownProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

export function FormDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = "선택해주세요",
}: FormDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-5">
      <label className="block text-[13px] font-[600] text-[#2C2C2C] mb-2">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-12 px-4 bg-white border border-[#E5E0D8] rounded-xl text-[14px] text-left outline-none focus:border-[#3B6B4A] focus:ring-2 focus:ring-[#E8F0EA] transition-all flex items-center justify-between"
        >
          <span className={value ? "text-[#2C2C2C]" : "text-[#AAAAAA]"}>
            {value || placeholder}
          </span>
          <ChevronDown className="w-4 h-4 text-[#777777]" />
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-[#E5E0D8] rounded-xl shadow-lg py-2 z-20 max-h-[240px] overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-[14px] hover:bg-[#F8F6F1] transition-colors ${
                    value === option
                      ? "text-[#3B6B4A] font-[600] bg-[#E8F0EA]"
                      : "text-[#2C2C2C]"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
