interface FilterChipProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export function FilterChip({ label, isActive, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[13px] font-[600] whitespace-nowrap transition-all ${
        isActive
          ? "bg-[#3B6B4A] text-white"
          : "bg-white text-[#2C2C2C] border border-[#E5E0D8] hover:border-[#3B6B4A]"
      }`}
    >
      {label}
    </button>
  );
}
