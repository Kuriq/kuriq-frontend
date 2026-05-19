import { useState } from "react";
import { useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { OwlMascot } from "../components/common/OwlMascot";
import { generateRoadmap } from "../api/client";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const suggestionChips = [
    "🎯 AI·데이터 입문",
    "📚 한국어교원 준비",
    "💼 디지털 마케팅",
    "🎨 취미·교양 탐색"
  ];

  const handleGenerateRoadmap = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const roadmap = await generateRoadmap(inputText.trim());
      navigate("/roadmap-result", { state: { roadmap } });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "로드맵 생성에 실패했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChipClick = (chip: string) => {
    const textOnly = chip.replace(/[^\w\s가-힣·]/g, '').trim();
    setInputText(`${textOnly}에 관심이 있습니다. 어디서부터 시작하면 좋을까요?`);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      <Navigation activeMenu="홈" />

      <main className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-[640px] w-full flex flex-col items-center">
          <div className="mb-6">
            <OwlMascot size={96} variant="normal" />
          </div>

          <h1 className="text-[28px] font-[800] text-[#2C2C2C] mb-3 text-center">
            안녕하세요! 큐리예요 🦉
          </h1>

          <p className="text-[15px] text-[#777777] text-center mb-8 max-w-[420px] leading-relaxed">
            배우고 싶은 것을 편하게 말씀해 주세요. 공공 교육 강좌로 맞춤 학습 로드맵을 만들어 드릴게요.
          </p>

          <div className="w-full max-w-[560px] bg-white rounded-[20px] border border-[#E5E0D8] p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-6">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="비전공자인데 파이썬부터 시작해서 데이터 분석까지 배우고 싶어요. 주 5시간 정도 쓸 수 있습니다."
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
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2 bg-white border border-[#E5E0D8] rounded-full text-[13px] text-[#2C2C2C] hover:border-[#3B6B4A] hover:bg-[#E8F0EA] transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#AAAAAA]">
            추천 키워드를 눌러 빠르게 시작할 수 있어요
          </p>
        </div>
      </main>
    </div>
  );
}
