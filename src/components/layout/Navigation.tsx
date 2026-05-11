import { Link } from "react-router";

interface NavigationProps {
  activeMenu?: string;
}

export function Navigation({ activeMenu = "홈" }: NavigationProps) {
  const menuItems = [
    { label: "홈", path: "/" },
    { label: "로드맵", path: "/roadmap" },
    { label: "대시보드", path: "/dashboard" },
    { label: "강좌 검색", path: "/search" },
    { label: "학습 장소 탐색", path: "/learning-spaces" },
    { label: "마이페이지", path: "/mypage" },
  ];

  return (
    <nav className="bg-white border-b border-[#E5E0D8] px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="16" cy="18" rx="9.3" ry="10.7" fill="#E8985E" />
              <ellipse cx="16" cy="20" rx="6" ry="7.3" fill="#FFF3EB" />
              <path d="M 9.3 10 Q 7.3 6 8.7 4.7 Q 9.3 4 10.7 6.7 L 10 10.7 Z" fill="#D67A45" />
              <path d="M 22.7 10 Q 24.7 6 23.3 4.7 Q 22.7 4 21.3 6.7 L 22 10.7 Z" fill="#D67A45" />
              <circle cx="12.7" cy="14" r="3.7" fill="white" />
              <circle cx="19.3" cy="14" r="3.7" fill="white" />
              <circle cx="13" cy="14" r="2.3" fill="#2C2C2C" />
              <circle cx="19" cy="14" r="2.3" fill="#2C2C2C" />
              <circle cx="13.3" cy="13.3" r="1" fill="white" />
              <circle cx="19.3" cy="13.3" r="1" fill="white" />
              <path d="M 16 16 L 14.7 18 L 17.3 18 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="0.3" />
              <ellipse cx="16" cy="7.3" rx="8" ry="2" fill="#2C2C2C" />
              <rect x="12" y="5.3" width="8" height="2" fill="#2C2C2C" />
              <rect x="9.3" y="5.3" width="13.3" height="0.7" fill="#2C2C2C" />
              <line x1="22.7" y1="5.7" x2="24.7" y2="4.7" stroke="#E8985E" strokeWidth="0.7" />
              <circle cx="24.7" cy="4.7" r="0.8" fill="#E8985E" />
            </svg>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-[#3B6B4A] font-[800] text-[20px] leading-none">큐릭</span>
            <span className="text-[#777777] text-[13px] leading-none">Kuriq</span>
          </div>
        </Link>

        {/* Menu items */}
        <div className="flex items-center gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`px-4 py-2 rounded-full transition-colors ${
                item.label === activeMenu
                  ? "bg-[#E8F0EA] text-[#3B6B4A] font-[600]"
                  : "text-[#2C2C2C] font-[400] hover:bg-[#F8F6F1]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}