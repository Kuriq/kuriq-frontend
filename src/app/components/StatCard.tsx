interface StatCardProps {
  icon: string;
  value: string;
  label: string;
}

export function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="bg-white border border-[#E5E0D8] rounded-2xl p-6 text-center">
      <div className="text-[32px] mb-2">{icon}</div>
      <div className="text-[28px] font-[800] text-[#3B6B4A] mb-1">
        {value}
      </div>
      <div className="text-[13px] text-[#777777] font-[400]">
        {label}
      </div>
    </div>
  );
}
