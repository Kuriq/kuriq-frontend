interface FormCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string | React.ReactNode;
}

export function FormCheckbox({ checked, onChange, label }: FormCheckboxProps) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div className="relative flex-shrink-0 mt-0.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <div className="w-5 h-5 border-2 border-[#E5E0D8] rounded-md bg-white peer-checked:bg-[#3B6B4A] peer-checked:border-[#3B6B4A] transition-all group-hover:border-[#3B6B4A]">
          {checked && (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <path
                d="M5 10L8.5 13.5L15 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      <span className="text-[13px] text-[#2C2C2C] leading-relaxed">
        {label}
      </span>
    </label>
  );
}
