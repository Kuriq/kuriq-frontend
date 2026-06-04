import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertCircle, ChevronRight, LocateFixed, MapPin, Plug, RefreshCcw, Wifi } from "lucide-react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { getNearbySpaces, type StudySpace } from "../api/client";
import { Navigation } from "../components/layout/Navigation";
import kuriWink from "../assets/images/kuri-wink.png";
import "leaflet/dist/leaflet.css";

type FilterType = "all" | "LIBRARY" | "LIFELONG_LEARNING" | "CAFE";

type Coordinates = {
  lat: number;
  lng: number;
  label: string;
};

type UiSpace = StudySpace & {
  categoryLabel: string;
  categoryColor: "green" | "orange";
  distanceLabel: string;
  hoursLabel: string;
  description: string;
};

type MapPinData = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  categoryColor: "green" | "orange";
  categoryLabel: string;
};

type FocusTarget = {
  lat: number;
  lng: number;
  zoom?: number;
  key: string;
};

const DEFAULT_RADIUS = 2000;
const MAX_RADIUS = 10000;
const DEFAULT_COORDINATES: Coordinates = {
  lat: 37.4979,
  lng: 127.0276,
  label: "강남역",
};

const filterCategories: Array<{ id: FilterType; label: string }> = [
  { id: "all", label: "전체" },
  { id: "LIBRARY", label: "도서관" },
  { id: "LIFELONG_LEARNING", label: "평생학습관" },
  { id: "CAFE", label: "카페" },
];

const radiusOptions = [
  { value: 1000, label: "1km" },
  { value: 2000, label: "2km" },
  { value: 5000, label: "5km" },
  { value: 10000, label: "10km" },
];

function createCurrentLocationIcon(imageSrc: string) {
  return L.divIcon({
    className: "current-location-marker",
    html: `
      <div class="quri-current-marker">
        <div class="quri-current-marker__pulse"></div>
        <img src="${imageSrc}" alt="큐리 현재 위치" class="quri-current-marker__image" />
      </div>
    `,
    iconSize: [54, 54],
    iconAnchor: [27, 40],
    popupAnchor: [0, -30],
  });
}

function createPlaceIcon(color: "green" | "orange") {
  const fill = color === "green" ? "#3B6B4A" : "#E8985E";
  return L.divIcon({
    className: "study-space-marker",
    html: `
      <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z" fill="${fill}" />
        <circle cx="16" cy="16" r="6" fill="white" />
      </svg>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -34],
  });
}

function getCategoryMeta(type: StudySpace["type"]) {
  switch (type) {
    case "LIBRARY":
      return { label: "도서관", color: "green" as const, description: "집중하기 좋은 공공 학습 공간" };
    case "LIFELONG_LEARNING":
      return { label: "평생학습관", color: "green" as const, description: "공공 평생학습 공간" };
    case "FIFTY_PLUS":
      return { label: "50플러스", color: "orange" as const, description: "50플러스 학습 공간" };
    case "YOUTH_CENTER":
      return { label: "청년센터", color: "green" as const, description: "공공 청년 지원 공간" };
    case "CAFE":
    default:
      return { label: "카페", color: "orange" as const, description: "민간 카페/스터디카페" };
  }
}

function formatDistance(distanceMeters: number) {
  if (distanceMeters >= 1000) return `${(distanceMeters / 1000).toFixed(distanceMeters >= 10000 ? 0 : 1)}km`;
  return `${distanceMeters}m`;
}

function buildPlaceLink(space: StudySpace) {
  return `https://map.kakao.com/link/to/${encodeURIComponent(space.name)},${space.latitude},${space.longitude}`;
}

export default function LearningSpacesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [expandedCardId, setExpandedCardId] = useState<string | null>(null);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [spaces, setSpaces] = useState<StudySpace[]>([]);
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [locationMessage, setLocationMessage] = useState("현재 위치를 확인하는 중이에요.");
  const [isLoading, setIsLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<FocusTarget | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const locateUser = useCallback(() => {
    setIsLocating(true);

    if (!navigator.geolocation) {
      setCoordinates(DEFAULT_COORDINATES);
      setLocationMessage("브라우저 위치 기능을 사용할 수 없어 강남역 기준으로 안내해요.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextCoordinates = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "현재 위치",
        };
        setCoordinates(nextCoordinates);
        setFocusTarget({ ...nextCoordinates, zoom: 15, key: `current-${Date.now()}` });
        setLocationMessage("현재 위치를 기준으로 주변 학습 공간을 찾고 있어요.");
        setIsLocating(false);
      },
      () => {
        setCoordinates(DEFAULT_COORDINATES);
        setFocusTarget({ ...DEFAULT_COORDINATES, zoom: 15, key: `fallback-${Date.now()}` });
        setLocationMessage("위치 권한이 없어 강남역 기준으로 안내해요.");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 * 60 * 5 }
    );
  }, []);

  useEffect(() => {
    locateUser();
  }, [locateUser]);

  useEffect(() => {
    if (!coordinates) return;

    let cancelled = false;
    const effectiveRadius = Math.min(radius, MAX_RADIUS);

    const loadSpaces = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const selectedType = activeFilter === "all" ? undefined : activeFilter;
        const data = await getNearbySpaces(coordinates.lat, coordinates.lng, effectiveRadius, selectedType);
        if (cancelled) return;
        setSpaces(data);
        setExpandedCardId((prev) => (data.some((space) => space.id === prev) ? prev : data[0]?.id ?? null));
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : "학습 공간을 불러오지 못했어요.";
        setError(message === "UNAUTHORIZED" ? "로그인 후 장소 추천을 이용할 수 있어요." : message);
        setSpaces([]);
        setExpandedCardId(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadSpaces();
    return () => {
      cancelled = true;
    };
  }, [activeFilter, coordinates, radius]);

  const uiSpaces = useMemo<UiSpace[]>(() => {
    return spaces.map((space) => {
      const meta = getCategoryMeta(space.type);
      return {
        ...space,
        categoryLabel: meta.label,
        categoryColor: meta.color,
        distanceLabel: formatDistance(space.distanceMeters),
        hoursLabel: space.operatingHours || (space.type === "CAFE" ? "운영 시간 정보 없음" : "운영 시간 정보 준비 중"),
        description: meta.description,
      };
    });
  }, [spaces]);

  const filteredSpaces = useMemo(() => {
    return activeFilter === "all" ? uiSpaces : uiSpaces.filter((space) => space.type === activeFilter);
  }, [activeFilter, uiSpaces]);

  const mapPins = useMemo<MapPinData[]>(() => {
    return filteredSpaces.map((space) => ({
      id: space.id,
      name: space.name,
      latitude: space.latitude,
      longitude: space.longitude,
      categoryColor: space.categoryColor,
      categoryLabel: space.categoryLabel,
    }));
  }, [filteredSpaces]);

  const handleSelectSpace = useCallback((space: UiSpace) => {
    setExpandedCardId(space.id);
    setFocusTarget({ lat: space.latitude, lng: space.longitude, zoom: 16, key: `${space.id}-${Date.now()}` });
  }, []);

  useEffect(() => {
    if (!expandedCardId) return;
    const card = cardRefs.current[expandedCardId];
    if (card) card.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [expandedCardId]);

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="장소추천" />

      <main className="flex-1 px-3 py-8 sm:px-5 lg:px-6 lg:py-10">
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)] lg:h-[min(820px,calc(100vh-170px))] lg:items-stretch">
            <section className="bg-white rounded-[28px] border border-[#E5E0D8] shadow-sm overflow-hidden min-h-[420px] lg:h-full">
              <div className="flex h-full min-h-0 flex-col p-5 sm:p-6 lg:p-7">
                <div className="mb-6">
                  <div className="mb-4">
                    <div className="min-w-0">
                      <h1 className="text-[22px] sm:text-[24px] font-[800] text-[#2C2C2C] mb-2 leading-tight">📍 내 주변 학습 공간</h1>
                      <p className="text-[13px] sm:text-[14px] text-[#777777] leading-relaxed break-keep">
                        현재 위치를 기준으로 주변 학습 공간을 지도와 목록으로 확인해 보세요.
                      </p>
                    </div>
                  </div>

                  <div className="bg-[#F8F6F1] border border-[#E5E0D8] rounded-2xl px-4 py-3 flex items-start gap-3">
                    <LocateFixed className="w-[18px] h-[18px] text-[#3B6B4A] mt-0.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-[700] text-[#2C2C2C] mb-1 leading-tight">
                        {coordinates?.label ?? "위치 확인 중"} · 반경 {radius / 1000}km
                      </p>
                      <p className="text-[12px] text-[#777777] leading-[1.45] break-keep">{locationMessage}</p>

                      <div className="mt-2.5 flex justify-end">
                        <button
                          type="button"
                          onClick={locateUser}
                          className="shrink-0 px-3 py-1.5 rounded-xl border border-[#D8D1C5] bg-white text-[11px] font-[600] text-[#3B6B4A] hover:bg-[#E8F0EA] transition-colors flex items-center gap-1.5"
                        >
                          <RefreshCcw className={`w-3 h-3 ${isLocating ? "animate-spin" : ""}`} />
                          위치 새로고침
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-[13px] font-[700] text-[#5B5B5B] mb-2">검색 반경</p>
                  <div className="flex gap-2 flex-wrap">
                    {radiusOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRadius(option.value)}
                          className={`px-3.5 py-2 rounded-full text-[13px] font-[600] transition-all whitespace-nowrap ${
                            radius === option.value
                              ? "bg-[#3B6B4A] text-white"
                              : "bg-white text-[#2C2C2C] border border-[#E5E0D8] hover:border-[#3B6B4A]"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                  {filterCategories.map((category) => (
                    <CategoryChip
                      key={category.id}
                      label={category.label}
                      isActive={activeFilter === category.id}
                      onClick={() => setActiveFilter(category.id)}
                    />
                  ))}
                  </div>
                </div>

                {!error && !isLoading ? (
                  <div className="mb-4 flex items-center justify-between gap-3 text-[12px] text-[#8A8A8A]">
                    <span>내 주변 학습 공간 {filteredSpaces.length}곳</span>
                    <span className="hidden lg:block">목록은 내부 스크롤로 볼 수 있어요.</span>
                  </div>
                ) : null}

                <div className="flex-1 min-h-0">
                {error ? (
                  <div className="bg-[#FFF4F4] border border-[#F0C7C7] rounded-2xl p-5 text-[#8B3A3A] flex gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-[700] mb-1">장소 정보를 불러오지 못했어요.</p>
                      <p className="text-[13px]">{error}</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="bg-[#F8F6F1] border border-[#E5E0D8] rounded-2xl p-6 text-[14px] text-[#777777]">
                    주변 학습 공간을 불러오는 중이에요...
                  </div>
                ) : filteredSpaces.length === 0 ? (
                  <div className="bg-[#F8F6F1] border border-[#E5E0D8] rounded-2xl p-6 text-[14px] text-[#777777]">
                    선택한 조건에 맞는 장소가 아직 없어요. 반경을 넓혀서 다시 확인해 보세요.
                  </div>
                ) : (
                  <div className="h-full min-h-0 overflow-y-auto pr-1 sm:pr-2">
                    <div className="space-y-3">
                    {filteredSpaces.map((space) => (
                      <div key={space.id} ref={(node) => { cardRefs.current[space.id] = node; }}>
                        <LearningSpaceCard
                          space={space}
                          isExpanded={space.id === expandedCardId}
                          onClick={() => handleSelectSpace(space)}
                        />
                      </div>
                    ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            </section>

            <section className="relative rounded-[28px] overflow-hidden border border-[#E5E0D8] shadow-sm bg-white min-h-[420px] h-[420px] sm:h-[520px] lg:h-full">
              <LearningSpaceMap
                pins={mapPins}
                userLocation={coordinates}
                locationLabel={coordinates?.label ?? "현재 위치"}
                radius={radius}
                focusTarget={focusTarget}
                onSelectPin={(spaceId) => {
                  const target = filteredSpaces.find((space) => space.id === spaceId);
                  if (target) handleSelectSpace(target);
                }}
              />
            </section>
          </div>
        </div>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

function CategoryChip({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 px-3.5 py-2 rounded-full text-[13px] font-[600] whitespace-nowrap transition-all ${
        isActive ? "bg-[#3B6B4A] text-white" : "bg-white text-[#2C2C2C] border border-[#E5E0D8] hover:border-[#3B6B4A]"
      }`}
    >
      {label}
    </button>
  );
}

function LearningSpaceCard({
  space,
  isExpanded,
  onClick,
}: {
  space: UiSpace;
  isExpanded: boolean;
  onClick: () => void;
}) {
  const categoryBgColor = space.categoryColor === "green" ? "bg-[#3B6B4A] text-white" : "bg-[#E8985E] text-white";

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl p-4 transition-all cursor-pointer ${
        isExpanded ? "bg-[#FCFBF8] border-2 border-[#3B6B4A] shadow-md" : "bg-white border border-[#E5E0D8] hover:border-[#3B6B4A]"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div>
          <h3 className="text-[15px] sm:text-[16px] font-[800] text-[#2C2C2C]">{space.name}</h3>
          <p className="text-[12px] text-[#8A8A8A] mt-1">{space.description}</p>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-[600] whitespace-nowrap ${categoryBgColor}`}>
          {space.categoryLabel}
        </span>
      </div>

      <p className="text-[13px] text-[#777777] mb-3 leading-relaxed">거리: {space.distanceLabel} | 운영: {space.hoursLabel}</p>

      <div className="flex items-center gap-3 min-h-5">
        {space.hasWifi ? <div className="flex items-center gap-1 text-[#3B6B4A] text-[12px] font-[600]"><Wifi className="w-4 h-4" />와이파이</div> : null}
        {space.hasPowerOutlet ? <div className="flex items-center gap-1 text-[#3B6B4A] text-[12px] font-[600]"><Plug className="w-4 h-4" />콘센트</div> : null}
        {!space.hasWifi && !space.hasPowerOutlet ? <span className="text-[12px] text-[#999999]">편의시설 정보 없음</span> : null}
      </div>

      {isExpanded ? (
        <div className="mt-4 pt-4 border-t border-[#E5E0D8] space-y-2">
          <p className="text-[13px] text-[#2C2C2C]"><span className="font-[600]">주소:</span> {space.address}</p>
          {space.phone ? <p className="text-[13px] text-[#2C2C2C]"><span className="font-[600]">전화:</span> {space.phone}</p> : null}

          <div className="flex justify-end pt-2">
            <a
              href={buildPlaceLink(space)}
              target="_blank"
              rel="noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="px-4 py-2 border border-[#3B6B4A] text-[#3B6B4A] rounded-lg text-[13px] font-[600] hover:bg-[#E8F0EA] transition-colors flex items-center gap-1"
            >
              카카오맵에서 열기
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LearningSpaceMap({
  pins,
  userLocation,
  locationLabel,
  radius,
  focusTarget,
  onSelectPin,
}: {
  pins: MapPinData[];
  userLocation: Coordinates | null;
  locationLabel: string;
  radius: number;
  focusTarget: FocusTarget | null;
  onSelectPin: (spaceId: string) => void;
}) {
  const initialCenter: [number, number] = userLocation ? [userLocation.lat, userLocation.lng] : [DEFAULT_COORDINATES.lat, DEFAULT_COORDINATES.lng];
  const currentLocationIcon = useMemo(() => createCurrentLocationIcon(kuriWink), []);

  return (
    <div className="relative w-full h-full bg-[#E8F0EA] overflow-hidden">
      <div className="absolute top-6 left-6 z-[1000] bg-white/95 border border-[#E5E0D8] rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm">
        <div className="flex items-center gap-2 text-[#2C2C2C] font-[700] text-[14px] mb-1">
          <MapPin className="w-4 h-4 text-[#3B6B4A]" />
          {locationLabel}
        </div>
        <p className="text-[12px] text-[#777777]">반경 {radius / 1000}km 안의 추천 장소</p>
      </div>

      <div className="absolute bottom-5 right-5 z-[1000] hidden sm:flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-3 py-2 text-[12px] text-[#666666] shadow-sm backdrop-blur-sm">
        <span className="font-[600] text-[#3B6B4A]">TIP</span>
        <span>지도를 드래그해서 둘러보세요</span>
      </div>

      <MapContainer center={initialCenter} zoom={14} className="w-full h-full z-0" scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapViewportController center={initialCenter} pins={pins} focusTarget={focusTarget} />

        {userLocation ? (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={currentLocationIcon}>
            <Popup><div className="text-[13px] font-[600]">큐리 현재 위치</div></Popup>
          </Marker>
        ) : null}

        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.latitude, pin.longitude]}
            icon={createPlaceIcon(pin.categoryColor)}
            eventHandlers={{ click: () => onSelectPin(pin.id) }}
          >
            <Popup>
              <div className="min-w-[160px]">
                <div className="text-[13px] font-[800] text-[#2C2C2C]">{pin.name}</div>
                <div className="text-[12px] text-[#777777] mt-1">{pin.categoryLabel}</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.9); opacity: 0.65; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes quriBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .leaflet-container { width: 100%; height: 100%; }
        .current-location-marker, .study-space-marker { background: transparent; border: none; }
        .quri-current-marker {
          position: relative;
          width: 54px;
          height: 54px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .quri-current-marker__pulse {
          position: absolute;
          inset: 8px;
          border-radius: 9999px;
          background: rgba(59, 107, 74, 0.18);
          animation: pulse 2s ease-out infinite;
        }
        .quri-current-marker__image {
          position: relative;
          width: 48px;
          height: 48px;
          object-fit: contain;
          filter: drop-shadow(0 8px 12px rgba(0,0,0,0.2));
          animation: quriBounce 1.6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

function MapViewportController({
  center,
  pins,
  focusTarget,
}: {
  center: [number, number];
  pins: MapPinData[];
  focusTarget: FocusTarget | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!focusTarget) return;
    map.flyTo([focusTarget.lat, focusTarget.lng], focusTarget.zoom ?? 16, { animate: true, duration: 0.5 });
  }, [focusTarget, map]);

  useEffect(() => {
    if (focusTarget) return;
    if (pins.length === 0) {
      map.setView(center, 14, { animate: true });
      return;
    }
    const bounds = L.latLngBounds([center, ...pins.map((pin) => [pin.latitude, pin.longitude] as [number, number])]);
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [center, focusTarget, map, pins]);

  return null;
}
