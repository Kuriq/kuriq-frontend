import { Link } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import kuriDefault from "../assets/images/kuri-default.png";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="" />

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-[520px] rounded-[28px] border border-[#E5E0D8] bg-white px-8 py-10 text-center shadow-sm">
          <img
            src={kuriDefault}
            alt="큐리 마스코트"
            className="mx-auto mb-5 h-[96px] w-[96px] object-contain"
          />

          <p className="mb-2 text-[13px] font-[700] text-[#3B6B4A]">404 NOT FOUND</p>
          <h1 className="mb-3 text-[28px] font-[800] text-[#2C2C2C]">페이지를 찾을 수 없어요</h1>
          <p className="mb-7 break-keep text-[14px] leading-relaxed text-[#777777]">
            요청한 페이지 주소가 잘못됐거나,
            <br />
            더 이상 제공되지 않는 페이지일 수 있어요.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="rounded-full bg-[#3B6B4A] px-6 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438]"
            >
              홈으로 돌아가기
            </Link>
            <Link
              to="/roadmap"
              className="rounded-full border border-[#E5E0D8] bg-white px-6 py-3 text-[14px] font-[700] text-[#2C2C2C] transition-colors hover:bg-[#F8F6F1]"
            >
              내 로드맵 보기
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
