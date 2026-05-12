import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function LoadingRoadmapPage() {
  const navigate = useNavigate();
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

  // Simulate loading - navigate to roadmap result after 12 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/roadmap-result");
    }, 12000);

    return () => clearTimeout(timeout);
  }, [navigate]);

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

          {/* Quri SVG - Thinking Expression (Desktop: 120px, Mobile: 96px) */}
          <svg 
            className="relative z-10 w-24 h-24 md:w-[120px] md:h-[120px]" 
            viewBox="0 0 120 120" 
            fill="none"
            style={{ animation: 'gentleBob 3s ease-in-out infinite' }}
          >
            {/* Body */}
            <ellipse cx="60" cy="67.5" rx="34.5" ry="40.5" fill="#E8985E" />
            <ellipse cx="60" cy="75" rx="22.5" ry="27" fill="#FFF3EB" />
            
            {/* Ear tufts */}
            <path d="M 34.5 37.5 Q 27 22.5 30 19.5 Q 34.5 15 40.5 25.5 L 37.5 40.5 Z" fill="#D67A45" />
            <path d="M 85.5 37.5 Q 93 22.5 90 19.5 Q 85.5 15 79.5 25.5 L 82.5 40.5 Z" fill="#D67A45" />
            
            {/* Eyes - THINKING (looking upward) */}
            {/* Left eye */}
            <ellipse cx="48" cy="48" rx="13.5" ry="15" fill="white" />
            <ellipse cx="48" cy="45" rx="8.25" ry="9" fill="#2C2C2C" />
            <circle cx="49.5" cy="42" r="3.75" fill="white" />
            
            {/* Right eye */}
            <ellipse cx="72" cy="48" rx="13.5" ry="15" fill="white" />
            <ellipse cx="72" cy="45" rx="8.25" ry="9" fill="#2C2C2C" />
            <circle cx="73.5" cy="42" r="3.75" fill="white" />
            
            {/* Beak */}
            <path d="M 60 60 L 55.5 67.5 L 64.5 67.5 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="1.5" />
            
            {/* Graduation cap */}
            <ellipse cx="60" cy="27" rx="30" ry="7.5" fill="#2C2C2C" />
            <rect x="45" y="19.5" width="30" height="7.5" fill="#2C2C2C" />
            <rect x="34.5" y="19.5" width="51" height="3" fill="#2C2C2C" />
            
            {/* Tassel */}
            <line x1="85.5" y1="21" x2="93" y2="18" stroke="#E8985E" strokeWidth="2.25" />
            <circle cx="93" cy="18" r="3" fill="#E8985E" />
            
            {/* Thought bubble - small dots */}
            <circle cx="85" cy="35" r="2.5" fill="#D67A45" opacity="0.4" />
            <circle cx="92" cy="28" r="3.5" fill="#D67A45" opacity="0.3" />
            <circle cx="100" cy="22" r="4.5" fill="#D67A45" opacity="0.2" />
          </svg>
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

        {/* Debug button (remove in production) */}
        <button
          onClick={() => navigate("/roadmap")}
          className="mt-8 px-4 py-2 rounded-lg text-xs opacity-30 hover:opacity-100 transition-opacity"
          style={{ backgroundColor: '#E5E0D8', color: '#777777' }}
        >
          결과로 바로 가기 (테스트용)
        </button>
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