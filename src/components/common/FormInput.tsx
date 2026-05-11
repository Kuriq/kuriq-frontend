import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  isPassword?: boolean;
}

export function FormInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  helperText,
  isPassword = false,
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="mb-5">
      <label className="block text-[13px] font-[600] text-[#2C2C2C] mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 px-4 bg-white border border-[#E5E0D8] rounded-xl text-[14px] text-[#2C2C2C] placeholder:text-[#AAAAAA] outline-none focus:border-[#3B6B4A] focus:ring-2 focus:ring-[#E8F0EA] transition-all"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#777777] hover:text-[#3B6B4A] transition-colors"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
      {helperText && (
        <p className="text-[11px] text-[#777777] mt-1.5">{helperText}</p>
      )}
    </div>
  );
}
