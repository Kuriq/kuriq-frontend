import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import kuriLogo from "../../assets/images/kuri-logo.png";
import { IoIosSettings } from "react-icons/io";
import { Menu, X } from "lucide-react";

interface NavigationProps {
  activeMenu?: string;
}

export function Navigation({ activeMenu = "홈" }: NavigationProps) {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { label: "홈", path: "/" },
    { label: "로드맵", path: "/roadmap" },
    { label: "대시보드", path: "/dashboard" },
    { label: "강좌 검색", path: "/search" },
    { label: "장소 탐색", path: "/learning-spaces" },
    { label: "커뮤니티", path: "/community" },
    { label: "마이페이지", path: "/mypage" },
    { label: "설정", path: "/notifications", icon: true },
  ];

  const handleLogout = async () => {
    setMobileOpen(false);
    await logout();
    navigate("/auth", { replace: true });
  };

  return (
    <>
      <nav className="bg-white border-b border-[#E5E0D8] px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={kuriLogo} alt="큐릭 로고" className="w-8 h-8" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#3B6B4A] font-[800] text-[20px] leading-none">큐릭</span>
              <span className="text-[#777777] text-[13px] leading-none">Kuriq</span>
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-2">
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

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-[#2C2C2C] hover:bg-[#F8F6F1] transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="메뉴 열기"
          >
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-[280px] bg-white shadow-xl flex flex-col nav-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E0D8]">
              <Link
                to="/"
                className="flex items-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <img src={kuriLogo} alt="큐릭 로고" className="w-7 h-7" />
                <span className="text-[#3B6B4A] font-[800] text-[18px] leading-none">큐릭</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-[#777777] hover:bg-[#F8F6F1] transition-colors"
                aria-label="메뉴 닫기"
              >
                <X size={20} />
              </button>
            </div>

            {/* Menu items */}
            <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-[15px] ${
                    item.label === activeMenu
                      ? "bg-[#E8F0EA] text-[#3B6B4A] font-[600]"
                      : "text-[#2C2C2C] font-[400] hover:bg-[#F8F6F1]"
                  }`}
                >
                  {item.icon ? <IoIosSettings className="w-4 h-4" /> : null}
                  {item.label === "설정" ? "설정" : item.label}
                </Link>
              ))}
            </nav>

            {/* Auth button */}
            <div className="px-3 py-4 border-t border-[#E5E0D8]">
              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 rounded-xl text-[#777777] font-[400] hover:bg-[#F8F6F1] transition-colors text-left text-[15px]"
                >
                  로그아웃
                </button>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full px-4 py-3 rounded-xl bg-[#3B6B4A] text-white font-[600] text-center text-[15px] hover:bg-[#2d5438] transition-colors"
                >
                  로그인
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
