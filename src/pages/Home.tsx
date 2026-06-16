import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const PENDING_ROADMAP_PROMPT_KEY = "pendingRoadmapPrompt";
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // 신규 가입 안내 토스트 state
  const [showNewUserToast, setShowNewUserToast] = useState(false);

  // 소셜 신규 가입 후 홈 진입 시 토스트 표시
  useEffect(() => {
    if (sessionStorage.getItem("showNewUserToast") === "true") {
      sessionStorage.removeItem("showNewUserToast");
      setShowNewUserToast(true);
      // 4초 후 자동으로 사라짐
      setTimeout(() => setShowNewUserToast(false), 4000);
    }
  }, []);

  const suggestionChips = [
    { label: "🎯 AI/데이터 입문", prompt: "비전공자인데 AI와 데이터 분석에 관심이 있습니다. 파이썬 기초부터 데이터 분석까지 단계별로 배우고 싶어요. 주 5시간 정도 투자할 수 있습니다." },
    { label: "📈 주식투자 입문", prompt: "주식 투자를 처음 시작하려고 합니다. 기초 경제 개념부터 투자 분석 방법까지 체계적으로 배우고 싶어요. 초보자도 이해하기 쉬운 과정으로 추천해 주세요." },
    { label: "🌍 외국어 기초", prompt: "외국어(영어/일본어/중국어)를 기초부터 배우고 싶습니다. 회화 중심으로 일상 대화를 할 수 있을 때까지 공부하고 싶어요. 주 3-4시간 정도 가능합니다." },
    { label: "💻 코딩 첫걸음", prompt: "코딩을 완전히 처음 시작합니다. 어떤 언어부터 배워야 할지 모르겠어요. 쉽고 재미있게 시작할 수 있는 프로그래밍 입문 과정을 추천해 주세요." },
    { label: "📊 엑셀/오피스", prompt: "직장에서 쓸 수 있는 엑셀 실력을 키우고 싶습니다. 기초 함수부터 피벗 테이블, 차트 만들기까지 업무에 바로 적용할 수 있는 과정이 필요해요." },
    { label: "🎨 취미·교양", prompt: "평소 관심 있던 취미와 교양 분야를 배우고 싶습니다. 사진, 음악, 미술 등 일상에서 즐길 수 있는 강좌를 추천해 주세요." }
  ];

  const handleChipClick = (chip: typeof suggestionChips[0]) => {
    setInputText(chip.prompt);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="홈" />

      <main className="flex-1 flex items-center justify-center px-4 py-10 sm:px-8 sm:py-16">
        <div className="max-w-[640px] w-full flex flex-col items-center page-enter">
          <div className="mb-6">
            <OwlMascot size={96} variant="normal" />
          </div>

          <h1 className="text-[28px] font-[800] text-[#2C2C2C] mb-3 text-center">
            안녕하세요! 큐리예요 🦉
          </h1>

          <p className="text-[15px] text-[#777777] text-center mb-8 max-w-[420px] leading-relaxed">
            배우고 싶은 것을 편하게 말씀해 주세요. 공공 교육 강좌로 맞춤 학습 로드맵을 만들어 드릴게요.
          </p>

          <div className="w-full max-w-[560px] bg-white rounded-[20px] border border-[#E5E0D8] p-4 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="예) 비전공자인데 파이썬부터 시작해서 데이터 분석까지 배우고 싶어요. 주 5시간 정도 쓸 수 있습니다."
              className="w-full h-[120px] resize-none bg-transparent border-none outline-none text-[#2C2C2C] placeholder:text-[#AAAAAA] font-[400] text-[15px] leading-relaxed"
            />

            <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#F0F0F0]">
              <p className="text-[12px] text-[#999999] max-w-[280px]">
                예: 관심 분야, 현재 수준, 목표, 주당 학습 시간
              </p>
              <button
                onClick={handleGenerateRoadmap}
                disabled={!inputText.trim() || loading}
                className="px-6 py-2.5 bg-[#3B6B4A] text-white rounded-full font-[600] text-[14px] hover:bg-[#2d5438] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#3B6B4A]"
              >
                {loading ? "생성 중..." : "로드맵 생성하기"}
              </button>
            </div>
          </div>

          {error && (
            <div className="w-full max-w-[560px] bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-[14px] text-center">
              {error}
            </div>
          )}

          <div className="flex flex-wrap justify-center gap-2 mb-3">
            {suggestionChips.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2 bg-white border border-[#E5E0D8] rounded-full text-[13px] text-[#2C2C2C] hover:border-[#3B6B4A] hover:bg-[#E8F0EA] transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#AAAAAA]">
            추천 키워드를 눌러 빠르게 시작할 수 있어요
          </p>
        </div>
      </main>

      {/* 신규 가입 안내 토스트 — 소셜 로그인으로 새 계정 생성 시 표시 */}
      {showNewUserToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-2xl bg-[#2C2C2C] px-5 py-3.5 shadow-lg animate-fade-in">
          <span className="text-[14px] text-white whitespace-nowrap">새 계정으로 가입되었습니다. 이전 데이터는 복구되지 않아요.</span>
        </div>
      )}
    </div>
  );
}
