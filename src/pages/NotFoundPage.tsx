import { Link } from "react-router";
import kuriDefault from "../assets/images/kuri-default.png";
import { Home, BookOpen, Map, User } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center">
        {/* Owl Mascot with Animation */}
        <div className="flex justify-center mb-8">
          <img
            src={kuriDefault}
            alt="큐리 마스코트"
            className="w-40 h-40 animate-bounce"
          />
        </div>

        {/* 404 Error Message */}
        <div className="mb-8">
          <h1 className="text-[120px] font-bold text-[#3B6B4A] leading-none mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-[#2C2C2C] mb-4">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="text-lg text-[#666666] mb-8">
            큐리가 열심히 찾아봤지만, 요청하신 페이지가 존재하지 않아요.
            <br />
            주소를 다시 확인하시거나 아래 링크를 이용해주세요.
          </p>
        </div>

        {/* Primary CTA */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-[#3B6B4A] text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#2d5439] transition-colors mb-12"
        >
          <Home size={24} />
          홈으로 돌아가기
        </Link>

        {/* Quick Links */}
        <div className="border-t border-[#E0DDD4] pt-8">
          <p className="text-sm text-[#888888] mb-6">도움이 될 만한 페이지</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/dashboard"
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl hover:shadow-md transition-shadow border border-[#E0DDD4]"
            >
              <div className="w-12 h-12 rounded-full bg-[#3B6B4A]/10 flex items-center justify-center">
                <BookOpen size={24} className="text-[#3B6B4A]" />
              </div>
              <span className="font-semibold text-[#2C2C2C]">대시보드</span>
            </Link>

            <Link
              to="/roadmap"
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl hover:shadow-md transition-shadow border border-[#E0DDD4]"
            >
              <div className="w-12 h-12 rounded-full bg-[#E8985E]/10 flex items-center justify-center">
                <Map size={24} className="text-[#E8985E]" />
              </div>
              <span className="font-semibold text-[#2C2C2C]">내 로드맵</span>
            </Link>

            <Link
              to="/mypage"
              className="flex flex-col items-center gap-3 p-6 bg-white rounded-xl hover:shadow-md transition-shadow border border-[#E0DDD4]"
            >
              <div className="w-12 h-12 rounded-full bg-[#3B6B4A]/10 flex items-center justify-center">
                <User size={24} className="text-[#3B6B4A]" />
              </div>
              <span className="font-semibold text-[#2C2C2C]">마이페이지</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
