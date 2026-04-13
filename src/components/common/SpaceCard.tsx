import { Wifi, Plug, ChevronRight } from "lucide-react";

interface SpaceCardProps {
  name: string;
  category: string;
  categoryColor: "green" | "orange";
  distance: string;
  hours: string;
  hasWifi: boolean;
  hasPower: boolean;
  address?: string;
  note?: string;
  isExpanded: boolean;
  onClick: () => void;
}

export function SpaceCard({
  name,
  category,
  categoryColor,
  distance,
  hours,
  hasWifi,
  hasPower,
  address,
  note,
  isExpanded,
  onClick,
}: SpaceCardProps) {
  const categoryBgColor =
    categoryColor === "green" ? "bg-[#3B6B4A] text-white" : "bg-[#E8985E] text-white";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 transition-all cursor-pointer ${
        isExpanded
          ? "border-2 border-[#3B6B4A] shadow-md"
          : "border border-[#E5E0D8] hover:border-[#3B6B4A]"
      }`}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[16px] font-[800] text-[#2C2C2C]">{name}</h3>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-[600] whitespace-nowrap ${categoryBgColor}`}
        >
          {category}
        </span>
      </div>

      {/* Info text */}
      <p className="text-[13px] text-[#777777] mb-3">
        거리: {distance} | 운영: {hours}
      </p>

      {/* Amenities */}
      <div className="flex items-center gap-3">
        {hasWifi && (
          <div className="flex items-center gap-1 text-[#3B6B4A]">
            <Wifi className="w-4 h-4" />
          </div>
        )}
        {hasPower && (
          <div className="flex items-center gap-1 text-[#3B6B4A]">
            <Plug className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Expanded details */}
      {isExpanded && address && (
        <div className="mt-4 pt-4 border-t border-[#E5E0D8]">
          <p className="text-[13px] text-[#2C2C2C] mb-2">
            <span className="font-[600]">주소:</span> {address}
          </p>
          {note && (
            <p className="text-[13px] text-[#777777] mb-4">
              <span className="font-[600]">안내:</span> {note}
            </p>
          )}
          <div className="flex justify-end">
            <button className="px-4 py-2 border border-[#3B6B4A] text-[#3B6B4A] rounded-lg text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors flex items-center gap-1">
              길찾기
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
