import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import kuriLoading from "../assets/images/kuri-loading.png";

export default function LoadingRoadmapPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [activeDot, setActiveDot] = useState(0);

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

  // Navigate to roadmap result with the roadmapId
  useEffect(() => {
    const roadmapId = location.state?.roadmapId;
    if (!roadmapId) {
      navigate("/");
      return;
    }

    const timeout = setTimeout(() => {
      navigate("/roadmap-result", { state: { roadmapId } });
    }, 12000);

    return () => clearTimeout(timeout);
  }, [navigate, location.state]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#F8F6F1' }}
    >
      <div className="flex flex-col items-center">
        {/* Quri Mascot with Thinking Expression + Pulse Animation */}
        <div className="relative mb-8 md:mb-12">
          {/* Pulse rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="absolute rounded-full animate-pulse-ring"
              style={{
                width: '140px',
                height: '140px',
                backgroundColor: 'rgba(232, 152, 94, 0.1)',
                animation: 'pulseRing 2s ease-out infinite'
              }}
            />
            <div
              className="absolute rounded-full animate-pulse-ring-delayed"
              style={{
                width: '160px',
                height: '160px',
                backgroundColor: 'rgba(232, 152, 94, 0.08)',
                animation: 'pulseRing 2s ease-out infinite 0.5s'
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
            transform: scale(0.8);
            opacity: 0.6;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: scale(1.2);
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
