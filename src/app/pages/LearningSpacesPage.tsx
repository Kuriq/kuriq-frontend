import { useState } from "react";
import { Navigation } from "../components/Navigation";
import { FilterChip } from "../components/FilterChip";
import { SpaceCard } from "../components/SpaceCard";
import { MapView } from "../components/MapView";

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

  const handleCardClick = (spaceId: string) => {
    setExpandedCardId(spaceId);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="대시보드" />

      {/* Main content - Split view */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - List */}
        <div className="w-[40%] bg-[#F8F6F1] overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-[24px] font-[800] text-[#2C2C2C] mb-2">
                📍 내 주변 학습 공간
              </h1>
              <p className="text-[14px] text-[#777777]">
                현재 위치(서울시 강남구) 반경 2km 이내의 무료 공공 학습 공간이에요.
              </p>
            </div>

            {/* Filter chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
              {filterCategories.map((category) => (
                <FilterChip
                  key={category.id}
                  label={category.label}
                  isActive={activeFilter === category.id}
                  onClick={() => setActiveFilter(category.id)}
                />
              ))}
            </div>

            {/* Space cards */}
            <div className="space-y-4">
              {filteredSpaces.map((space) => (
                <SpaceCard
                  key={space.id}
                  name={space.name}
                  category={space.category}
                  categoryColor={space.categoryColor}
                  distance={space.distance}
                  hours={space.hours}
                  hasWifi={space.hasWifi}
                  hasPower={space.hasPower}
                  address={space.address}
                  note={space.note}
                  isExpanded={space.id === expandedCardId}
                  onClick={() => handleCardClick(space.id)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div className="w-[60%] relative">
          <MapView
            pins={mapPins}
            userLocation={{ x: 50, y: 50 }}
          />
        </div>
      </div>

      {/* Hide scrollbar for filter chips */}
      <style jsx>{`
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
