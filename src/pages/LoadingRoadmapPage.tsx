import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import kuriLoading from "../assets/images/kuri-loading.png";
import { generateRoadmap } from "../api/client";

const PENDING_ROADMAP_PROMPT_KEY = "pendingRoadmapPrompt";

export default function LoadingRoadmapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const messages = [
    "큐리가 강좌를 찾고 있어요...",
    "여러 플랫폼에서 적합한 강좌를 골라내고 있어요...",
    "맞춤 로드맵을 설계하고 있어요..."
  ];

  // Rotate messages every 3 seconds
  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);

    return () => clearInterval(messageInterval);
  }, [messages.length]);

  // Animate dots every 500ms
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setActiveDot((prev) => (prev + 1) % 4);
    }, 500);

    return () => clearInterval(dotInterval);
  }, []);

  // 실제 로드맵 생성 후 결과 페이지로 이동
  useEffect(() => {
    let cancelled = false;
    const state = (location.state as { roadmapId?: string; prompt?: string } | null) ?? null;
    const roadmapId = state?.roadmapId;
    const prompt = state?.prompt ?? sessionStorage.getItem(PENDING_ROADMAP_PROMPT_KEY);

    if (roadmapId) {
      sessionStorage.removeItem(PENDING_ROADMAP_PROMPT_KEY);
      navigate("/roadmap-result", { state: { roadmapId } });
      return;
    }

    if (!prompt) {
      navigate("/");
      return;
    }

    const run = async () => {
      try {
        sessionStorage.setItem(PENDING_ROADMAP_PROMPT_KEY, prompt);
        const roadmap = await generateRoadmap(prompt);
        if (!cancelled) {
          sessionStorage.removeItem(PENDING_ROADMAP_PROMPT_KEY);
          navigate("/roadmap-result", { state: { roadmapId: roadmap.id } });
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "로드맵 생성에 실패했습니다.";
          setError(message);
        }
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [navigate, location.state]);

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: '#F8F6F1' }}
      >
        <div className="w-full max-w-[420px] rounded-[24px] border border-[#E5E0D8] bg-white p-8 text-center shadow-sm">
          <img src={kuriLoading} alt="" className="mx-auto mb-5 h-[88px] w-[88px] object-contain" />
          <h1 className="mb-3 text-[22px] font-[800] text-[#2C2C2C]">로드맵 생성에 실패했어요</h1>
          <p className="mb-6 text-[14px] leading-relaxed text-[#777777]">{error}</p>
          <button
            type="button"
            onClick={() => {
              sessionStorage.removeItem(PENDING_ROADMAP_PROMPT_KEY);
              navigate("/");
            }}
            className="rounded-full bg-[#3B6B4A] px-6 py-3 text-[14px] font-[700] text-white transition-colors hover:bg-[#2d5438]"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#F8F6F1' }}
    >
      <div className="flex flex-col items-center">
        {/* Quri Mascot with Pulse Rings */}
        <div className="relative mb-8 md:mb-12">
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute rounded-full"
              style={{
                width: '140px',
                height: '140px',
                backgroundColor: 'rgba(232, 152, 94, 0.12)',
                animation: 'pulseRing 2s ease-out infinite'
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: '170px',
                height: '170px',
                backgroundColor: 'rgba(232, 152, 94, 0.07)',
                animation: 'pulseRing 2s ease-out infinite 0.6s'
              }}
            />
          </div>
          <img
            src={kuriLoading}
            alt=""
            className="relative z-10 w-24 h-24 md:w-[120px] md:h-[120px]"
            style={{ animation: 'gentleBob 3s ease-in-out infinite' }}
          />
        </div>

        {/* Loading Message - with fade transition */}
        <div className="h-16 md:h-20 flex items-center justify-center mb-3 md:mb-4">
          <p
            key={currentMessageIndex}
            className="font-medium text-center px-4 animate-fadeInOut"
            style={{
              color: '#2C2C2C',
              fontSize: 'clamp(15px, 4vw, 18px)',
              lineHeight: '1.5'
            }}
          >
            {messages[currentMessageIndex]}
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 mb-4 md:mb-6">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: activeDot === index ? '#E8985E' : '#E5E0D8',
                transform: activeDot === index ? 'scale(1.3)' : 'scale(1)',
                opacity: activeDot === index ? 1 : 0.6
              }}
            />
          ))}
        </div>

        {/* Timing Info */}
        <p
          className="text-center text-[13px]"
          style={{ color: '#AAAAAA' }}
        >
          보통 10~15초 정도 걸려요
        </p>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulseRing {
          0% {
            transform: scale(0.85);
            opacity: 0.7;
          }
          60% {
            opacity: 0.2;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        @keyframes gentleBob {
          0%, 100% {
            transform: translateY(0px) rotate(-2deg);
          }
          50% {
            transform: translateY(-8px) rotate(2deg);
          }
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          10% {
            opacity: 1;
            transform: translateY(0px);
          }
          90% {
            opacity: 1;
            transform: translateY(0px);
          }
          100% {
            opacity: 0;
            transform: translateY(-10px);
          }
        }

        .animate-fadeInOut {
          animation: fadeInOut 3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
