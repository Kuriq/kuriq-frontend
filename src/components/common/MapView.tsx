import { OwlMascot } from "./OwlMascot";

interface MapPin {
  id: string;
  name: string;
  x: number;
  y: number;
  isActive: boolean;
}

interface MapViewProps {
  pins: MapPin[];
  userLocation: { x: number; y: number };
}

export function MapView({ pins, userLocation }: MapViewProps) {
  return (
    <div className="relative w-full h-full bg-[#E8F0EA] overflow-hidden">
      {/* Map background pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#3B6B4A"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Simplified map roads */}
      <svg className="absolute inset-0 w-full h-full">
        <line
          x1="0"
          y1="40%"
          x2="100%"
          y2="40%"
          stroke="#CCCCCC"
          strokeWidth="3"
        />
        <line
          x1="0"
          y1="70%"
          x2="100%"
          y2="70%"
          stroke="#CCCCCC"
          strokeWidth="3"
        />
        <line
          x1="30%"
          y1="0"
          x2="30%"
          y2="100%"
          stroke="#CCCCCC"
          strokeWidth="3"
        />
        <line
          x1="70%"
          y1="0"
          x2="70%"
          y2="100%"
          stroke="#CCCCCC"
          strokeWidth="3"
        />
      </svg>

      {/* User location */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${userLocation.x}%`, top: `${userLocation.y}%` }}
      >
        {/* Glowing pulse effect */}
        <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75" />
        <div className="relative w-6 h-6 bg-blue-500 rounded-full border-4 border-white shadow-lg" />
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-2 py-1 rounded-md text-[11px] font-[600] text-[#2C2C2C] shadow-md">
          현재 위치
        </div>
      </div>

      {/* Quri mascot floating above user location */}
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

      {/* Map pins */}
      {pins.map((pin) => (
        <div
          key={pin.id}
          className="absolute transform -translate-x-1/2 -translate-y-full"
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          {/* Pin */}
          <div className="relative">
            <svg
              width="32"
              height="40"
              viewBox="0 0 32 40"
              fill="none"
              className="drop-shadow-lg"
            >
              <path
                d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40C16 40 32 24.837 32 16C32 7.163 24.837 0 16 0Z"
                fill={pin.isActive ? "#3B6B4A" : "#999999"}
              />
              <circle cx="16" cy="16" r="6" fill="white" />
            </svg>

            {/* Tooltip */}
            {pin.isActive && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-white px-3 py-1.5 rounded-lg text-[12px] font-[600] text-[#2C2C2C] shadow-lg border border-[#E5E0D8]">
                {pin.name}
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-r border-b border-[#E5E0D8] transform rotate-45" />
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Floating animation keyframes */}
      <style jsx>{`
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
