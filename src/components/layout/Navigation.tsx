import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import kuriLogo from "../../assets/images/kuri-logo.png";
import { IoIosSettings } from "react-icons/io";

interface NavigationProps {
  activeMenu?: string;
}

export function Navigation({ activeMenu = "홈" }: NavigationProps) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { label: "홈", path: "/" },
    { label: "로드맵", path: "/roadmap" },
    { label: "대시보드", path: "/dashboard" },
    { label: "강좌 검색", path: "/search" },
    { label: "장소추천", path: "/learning-spaces" },
    { label: "마이페이지", path: "/mypage" },
    { label: "알림 설정", path: "/notifications", icon: true },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <nav className="bg-white border-b border-[#E5E0D8] px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={kuriLogo} alt="큐릭 로고" className="w-8 h-8" />
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
              className={`px-4 py-2 rounded-full transition-colors flex items-center gap-1.5 ${
                item.label === activeMenu
                  ? "bg-[#E8F0EA] text-[#3B6B4A] font-[600]"
                  : "text-[#2C2C2C] font-[400] hover:bg-[#F8F6F1]"
              }`}
            >
              {item.icon ? <IoIosSettings className="w-4 h-4" /> : item.label}
            </Link>
          ))}

          {/* Auth button */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="ml-2 px-4 py-2 rounded-full text-[#777777] font-[400] hover:bg-[#F8F6F1] transition-colors"
            >
              로그아웃
            </button>
          ) : (
            <Link
              to="/auth"
              className="ml-2 px-4 py-2 rounded-full bg-[#3B6B4A] text-white font-[600] hover:bg-[#2d5438] transition-colors"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
