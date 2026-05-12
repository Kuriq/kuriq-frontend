import { useState } from "react";
import { ChevronRight, Plug, Wifi } from "lucide-react";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";

interface LearningSpace {
  id: string;
  name: string;
  category: string;
  categoryColor: "green" | "orange";
  distance: string;
  hours: string;
  hasWifi: boolean;
  hasPower: boolean;
  address: string;
  note: string;
  mapX: number;
  mapY: number;
  filterType: string;
}

interface MapPin {
  id: string;
  name: string;
  x: number;
  y: number;
  isActive: boolean;
}

const learningSpaces: LearningSpace[] = [
  {
    id: "1",
    name: "강남개포도서관",
    category: "공공 도서관",
    categoryColor: "green",
    distance: "1.2km",
    hours: "09:00 - 22:00",
    hasWifi: true,
    hasPower: true,
    address: "서울 강남구 선릉로 116",
    note: "2층 제1열람실에서 노트북 사용이 가능해요.",
    mapX: 35,
    mapY: 45,
    filterType: "도서관",
  },
  {
    id: "2",
    name: "강남50플러스센터",
    category: "50플러스",
    categoryColor: "orange",
    distance: "1.8km",
    hours: "09:00 - 18:00",
    hasWifi: true,
    hasPower: true,
    address: "서울 강남구 논현로 507",
    note: "50세 이상 누구나 이용 가능한 학습 공간입니다.",
    mapX: 65,
    mapY: 35,
    filterType: "50플러스",
  },
  {
    id: "3",
    name: "강남구립도서관",
    category: "공공 도서관",
    categoryColor: "green",
    distance: "2.0km",
    hours: "09:00 - 20:00",
    hasWifi: true,
    hasPower: true,
    address: "서울 강남구 개포로 613",
    note: "3층 멀티미디어실에서 온라인 강좌를 들을 수 있어요.",
    mapX: 72,
    mapY: 68,
    filterType: "도서관",
  },
];

const filterCategories = [
  { id: "all", label: "전체" },
  { id: "도서관", label: "도서관" },
  { id: "평생학습관", label: "평생학습관" },
  { id: "50플러스", label: "50플러스" },
  { id: "카페", label: "카페" },
];

export default function LearningSpacesPage() {
  const [activeFilter, setActiveFilter] = useState("도서관");
  const [expandedCardId, setExpandedCardId] = useState("1");

  const filteredSpaces =
    activeFilter === "all"
      ? learningSpaces
      : learningSpaces.filter((space) => space.filterType === activeFilter);

  const mapPins = filteredSpaces.map((space) => ({
    id: space.id,
    name: space.name,
    x: space.mapX,
    y: space.mapY,
    isActive: space.id === expandedCardId,
  }));

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="대시보드" />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-[40%] bg-[#F8F6F1] overflow-y-auto">
          <div className="p-8">
            <div className="mb-6">
              <h1 className="text-[24px] font-[800] text-[#2C2C2C] mb-2">
                📍 내 주변 학습 공간
              </h1>
              <p className="text-[14px] text-[#777777]">
                현재 위치(서울시 강남구) 반경 2km 이내의 무료 공공 학습 공간이에요.
              </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {filterCategories.map((category) => (
                <CategoryChip
                  key={category.id}
                  label={category.label}
                  isActive={activeFilter === category.id}
                  onClick={() => setActiveFilter(category.id)}
                />
              ))}
            </div>

            <div className="space-y-4">
              {filteredSpaces.map((space) => (
                <LearningSpaceCard
                  key={space.id}
                  {...space}
                  isExpanded={space.id === expandedCardId}
                  onClick={() => setExpandedCardId(space.id)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="w-[60%] relative">
          <LearningSpaceMap pins={mapPins} userLocation={{ x: 50, y: 50 }} />
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

function CategoryChip({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
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

function LearningSpaceCard({
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
}: {
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
}) {
  const categoryBgColor =
    categoryColor === "green"
      ? "bg-[#3B6B4A] text-white"
      : "bg-[#E8985E] text-white";

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 transition-all cursor-pointer ${
        isExpanded
          ? "border-2 border-[#3B6B4A] shadow-md"
          : "border border-[#E5E0D8] hover:border-[#3B6B4A]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="text-[16px] font-[800] text-[#2C2C2C]">{name}</h3>
        <span
          className={`px-2.5 py-1 rounded-full text-[11px] font-[600] whitespace-nowrap ${categoryBgColor}`}
        >
          {category}
        </span>
      </div>

      <p className="text-[13px] text-[#777777] mb-3">
        거리: {distance} | 운영: {hours}
      </p>

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

function LearningSpaceMap({
  pins,
  userLocation,
}: {
  pins: MapPin[];
  userLocation: { x: number; y: number };
}) {
  return (
    <div className="relative w-full h-full bg-[#E8F0EA] overflow-hidden">
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3B6B4A" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      <svg className="absolute inset-0 w-full h-full">
        <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#CCCCCC" strokeWidth="3" />
        <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#CCCCCC" strokeWidth="3" />
        <line x1="30%" y1="0" x2="30%" y2="100%" stroke="#CCCCCC" strokeWidth="3" />
        <line x1="70%" y1="0" x2="70%" y2="100%" stroke="#CCCCCC" strokeWidth="3" />
      </svg>

      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
      >
        <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75" />
        <div className="relative w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-md text-[11px] font-[600] text-[#2C2C2C] shadow-md">
          현재 위치
        </div>
      </div>

      <div
        className="absolute transform -translate-x-1/2 -translate-y-full"
        style={{
          left: `${userLocation.x}%`,
          top: `${userLocation.y - 8}%`,
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <OwlMascot size={48} />
      </div>

      {pins.map((pin) => (
        <div
          key={pin.id}
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <div className="relative">
            <svg width="32" height="40" viewBox="0 0 32 40" fill="none" className="drop-shadow-lg">
              <path
                d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
                fill={pin.isActive ? "#3B6B4A" : "#999999"}
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>

            {pin.isActive && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1.5 rounded-lg text-[12px] font-[600] text-[#2C2C2C] shadow-lg border border-[#E5E0D8]">
                {pin.name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-[#E5E0D8] transform rotate-45" />
              </div>
            )}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes float {
          0%,
          100% {
            transform: translate(-50%, -100%) translateY(0px);
          }
          50% {
            transform: translate(-50%, -100%) translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
