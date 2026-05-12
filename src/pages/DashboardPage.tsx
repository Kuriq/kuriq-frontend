import { Navigation } from "../components/layout/Navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8F6F1] flex flex-col">
      {/* Navigation */}
      <Navigation activeMenu="대시보드" />

      {/* Main content */}
      <main className="flex-1 px-8 py-12">
        <div className="max-w-[1100px] mx-auto">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="font-bold" style={{ color: '#2C2C2C', fontSize: '24px' }}>
                이번 주 학습
              </h1>
              <div className="flex items-center gap-2">
                <button 
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <ChevronLeft size={16} color="#777777" />
                </button>
                <span className="text-sm" style={{ color: '#777777' }}>
                  Week 3 · 4월 14일 ~ 4월 20일
                </span>
                <button 
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                  style={{ backgroundColor: 'white', border: '1px solid #E5E0D8' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  <ChevronRight size={16} color="#777777" />
                </button>
              </div>
            </div>
          </div>

          {/* Quri Greeting Card */}
          <div 
            className="rounded-[14px] p-4 mb-6 flex items-center gap-3"
            style={{ backgroundColor: '#E8F0EA' }}
          >
            {/* Quri Winking */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <ellipse cx="18" cy="20.25" rx="10.5" ry="12" fill="#E8985E" />
              <ellipse cx="18" cy="22.5" rx="6.75" ry="8.25" fill="#FFF3EB" />
              <path d="M 10.5 11.25 Q 8.25 6.75 9 5.25 Q 10.5 4.5 12 7.5 L 11.25 12 Z" fill="#D67A45" />
              <path d="M 25.5 11.25 Q 27.75 6.75 27 5.25 Q 25.5 4.5 24 7.5 L 24.75 12 Z" fill="#D67A45" />
              {/* Left eye - open */}
              <circle cx="14.25" cy="15.75" r="4.2" fill="white" />
              <circle cx="14.7" cy="15.75" r="2.55" fill="#2C2C2C" />
              <circle cx="15" cy="15" r="1.2" fill="white" />
              {/* Right eye - winking */}
              <path d="M 19.5 15.75 Q 21.75 14.5 24 15.75" stroke="#2C2C2C" strokeWidth="2" strokeLinecap="round" fill="none" />
              <path d="M 18 18 L 16.5 20.25 L 19.5 20.25 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="0.5" />
              <ellipse cx="18" cy="8.25" rx="9" ry="2.25" fill="#2C2C2C" />
              <rect x="13.5" y="6" width="9" height="2.25" fill="#2C2C2C" />
              <rect x="10.5" y="6" width="15" height="0.75" fill="#2C2C2C" />
            </svg>
            <p className="text-sm font-medium" style={{ color: '#2C2C2C' }}>
              절반 넘었어요! 잘 하고 있어요 🎉
            </p>
          </div>

          {/* Two-column layout */}
          <div className="flex gap-6">
            {/* LEFT COLUMN (65%) */}
            <div style={{ flex: '0 0 65%' }}>
              {/* Progress Card */}
              <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: '1px solid #E5E0D8' }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm" style={{ color: '#2C2C2C' }}>이번 주 진행률</span>
                  <span className="font-bold" style={{ color: '#3B6B4A', fontSize: '22px' }}>50%</span>
                </div>
                {/* Progress bar */}
                <div 
                  className="w-full h-2.5 rounded-full mb-3 overflow-hidden"
                  style={{ backgroundColor: '#E5E0D8' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#3B6B4A', width: '50%' }}
                  />
                </div>
                <div className="flex items-center justify-between text-[13px]" style={{ color: '#777777' }}>
                  <span>2/4 강좌 완료</span>
                  <span>남은 시간: 약 3시간</span>
                </div>
              </div>

              {/* Section title */}
              <h2 className="font-bold mb-4" style={{ color: '#2C2C2C', fontSize: '18px' }}>
                📋 이번 주 강좌
              </h2>

              {/* Course cards */}
              <div className="space-y-3">
                {/* Course 1 - Completed */}
                <div 
                  className="rounded-xl p-4 flex items-center gap-4"
                  style={{ 
                    backgroundColor: '#F0F7ED',
                    border: '1px solid #C8E0D0'
                  }}
                >
                  {/* Checkbox */}
                  <div 
                    className="flex-shrink-0 w-[22px] h-[22px] rounded flex items-center justify-center"
                    style={{ backgroundColor: '#3B6B4A' }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7L5.5 10.5L12 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>

                  {/* Course info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm" style={{ color: '#777777', textDecoration: 'line-through' }}>
                        모두를 위한 파이썬 (3/10강)
                      </p>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                      >
                        K-MOOC
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                      >
                        입문
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{ borderColor: '#3B6B4A', color: '#3B6B4A', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F0EA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      📝 노트 보기
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{ borderColor: '#3B6B4A', color: '#3B6B4A', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F0EA'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      🔁 복습하기
                    </button>
                  </div>
                </div>

                {/* Course 2 - In Progress */}
                <div 
                  className="bg-white rounded-xl p-4 flex items-center gap-4"
                  style={{ border: '1px solid #E5E0D8' }}
                >
                  {/* Empty checkbox */}
                  <div 
                    className="flex-shrink-0 w-[22px] h-[22px] rounded"
                    style={{ border: '2px solid #E5E0D8' }}
                  />

                  {/* Course info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
                        파이썬 프로그래밍 기초 (1/8강)
                      </p>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#E3F2FD', color: '#1976D2' }}
                      >
                        KOCW
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#FFF9C4', color: '#827717' }}
                      >
                        초급
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors"
                      style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#3B6B4A';
                        e.currentTarget.style.color = '#3B6B4A';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#E5E0D8';
                        e.currentTarget.style.color = '#777777';
                      }}
                    >
                      📝 노트 작성
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
                      style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      이어듣기 →
                    </button>
                  </div>
                </div>

                {/* Course 3 - Not Started */}
                <div 
                  className="bg-white rounded-xl p-4 flex items-center gap-4"
                  style={{ border: '1px solid #E5E0D8' }}
                >
                  {/* Empty checkbox */}
                  <div 
                    className="flex-shrink-0 w-[22px] h-[22px] rounded"
                    style={{ border: '2px solid #E5E0D8' }}
                  />

                  {/* Course info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm" style={{ color: '#777777' }}>
                        데이터 분석 입문 (0/12강)
                      </p>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#FFE8D6', color: '#A05A2C' }}
                      >
                        온국민평생배움터
                      </span>
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium"
                        style={{ backgroundColor: '#FFF9C4', color: '#827717' }}
                      >
                        초급
                      </span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-sm font-medium transition-opacity"
                      style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      시작하기 →
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (35%) */}
            <div style={{ flex: '0 0 35%' }}>
              {/* Section title */}
              <h2 className="font-bold mb-4" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                📍 전체 로드맵
              </h2>

              {/* Vertical Timeline */}
              <div className="bg-white rounded-2xl p-5 mb-6" style={{ border: '1px solid #E5E0D8' }}>
                <div className="relative space-y-5">
                  {/* Vertical line */}
                  <div 
                    className="absolute left-[15px] top-[15px] bottom-[15px] w-0.5"
                    style={{ backgroundColor: '#E5E0D8' }}
                  />

                  {/* Week 1 - Completed */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                    >
                      1
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                        파이썬 기초
                      </p>
                      <span className="text-xs font-medium" style={{ color: '#4CAF50' }}>
                        완료
                      </span>
                    </div>
                  </div>

                  {/* Week 2 - Completed */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                    >
                      2
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                        데이터 타입
                      </p>
                      <span className="text-xs font-medium" style={{ color: '#4CAF50' }}>
                        완료
                      </span>
                    </div>
                  </div>

                  {/* Week 3 - Current */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base z-10"
                      style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                    >
                      3
                    </div>
                    <div className="flex-1 pt-2">
                      <p className="text-sm font-bold mb-1" style={{ color: '#2C2C2C' }}>
                        데이터 시각화
                      </p>
                      <span className="text-xs font-medium" style={{ color: '#3B6B4A' }}>
                        📌 현재 진행 중
                      </span>
                    </div>
                  </div>

                  {/* Week 4 - Future */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: 'white', border: '2px solid #E5E0D8', color: '#AAAAAA' }}
                    >
                      4
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm" style={{ color: '#AAAAAA' }}>
                        웹 크롤링
                      </p>
                    </div>
                  </div>

                  {/* Week 5 - Future */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: 'white', border: '2px solid #E5E0D8', color: '#AAAAAA' }}
                    >
                      5
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm" style={{ color: '#AAAAAA' }}>
                        API 활용
                      </p>
                    </div>
                  </div>

                  {/* Week 6 - Future */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: 'white', border: '2px solid #E5E0D8', color: '#AAAAAA' }}
                    >
                      6
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm" style={{ color: '#AAAAAA' }}>
                        데이터베이스
                      </p>
                    </div>
                  </div>

                  {/* Week 7 - Future */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: 'white', border: '2px solid #E5E0D8', color: '#AAAAAA' }}
                    >
                      7
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm" style={{ color: '#AAAAAA' }}>
                        프로젝트 실습
                      </p>
                    </div>
                  </div>

                  {/* Week 8 - Future */}
                  <div className="relative flex items-start gap-3">
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10"
                      style={{ backgroundColor: 'white', border: '2px solid #E5E0D8', color: '#AAAAAA' }}
                    >
                      8
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm" style={{ color: '#AAAAAA' }}>
                        최종 평가
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div 
                className="rounded-xl p-4 space-y-3"
                style={{ backgroundColor: '#FFF3EB', border: '1px solid #FFE0CC' }}
              >
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>🔥</span>
                  <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
                    연속 학습 12일
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: '20px' }}>📚</span>
                  <p className="text-sm font-bold" style={{ color: '#2C2C2C' }}>
                    이번 주 3시간 학습
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}