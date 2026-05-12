import { useState } from "react";
import { useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { Sparkles, MoreVertical, ChevronDown } from "lucide-react";

type FilterType = "all" | "completed" | "abandoned";

export default function MyRoadmapsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  // For demonstration, we'll show the page with roadmaps
  // Change hasRoadmaps to false to see the empty state
  const hasRoadmaps = true;

  if (!hasRoadmaps) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#F8F6F1' }}>
        <Navigation activeMenu="로드맵" />
        
        <main className="flex-1 px-8 py-8">
          <div className="max-w-[1000px] mx-auto">
            {/* Empty State */}
            <div className="flex flex-col items-center justify-center" style={{ minHeight: '60vh' }}>
              {/* Large Quri Owl */}
              <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="mb-6">
                <ellipse cx="60" cy="67.5" rx="34.5" ry="40.5" fill="#E8985E" />
                <ellipse cx="60" cy="75" rx="22.5" ry="27" fill="#FFF3EB" />
                <path d="M 34.5 37.5 Q 27 22.5 30 19.5 Q 34.5 15 40.5 25.5 L 37.5 40.5 Z" fill="#D67A45" />
                <path d="M 85.5 37.5 Q 93 22.5 90 19.5 Q 85.5 15 79.5 25.5 L 82.5 40.5 Z" fill="#D67A45" />
                <circle cx="48" cy="52.5" r="13.5" fill="white" />
                <circle cx="72" cy="52.5" r="13.5" fill="white" />
                <circle cx="48.5" cy="52.5" r="8.25" fill="#2C2C2C" />
                <circle cx="71.5" cy="52.5" r="8.25" fill="#2C2C2C" />
                <circle cx="49.5" cy="49.5" r="3.75" fill="white" />
                <circle cx="72.5" cy="49.5" r="3.75" fill="white" />
                <path d="M 60 60 L 55.5 67.5 L 64.5 67.5 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="1.5" />
                <ellipse cx="60" cy="27" rx="30" ry="7.5" fill="#2C2C2C" />
                <rect x="45" y="19.5" width="30" height="7.5" fill="#2C2C2C" />
                <rect x="34.5" y="19.5" width="51" height="3" fill="#2C2C2C" />
                <line x1="85.5" y1="21" x2="93" y2="18" stroke="#E8985E" strokeWidth="2.25" />
                <circle cx="93" cy="18" r="3" fill="#E8985E" />
              </svg>

              <h2 className="font-bold mb-2" style={{ color: '#2C2C2C', fontSize: '20px' }}>
                아직 만든 로드맵이 없어요
              </h2>
              <p className="mb-8 text-center" style={{ color: '#777777', fontSize: '14px' }}>
                큐리와 함께 첫 맞춤 로드맵을 만들어 볼까요?
              </p>

              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 h-12 px-6 rounded-lg font-medium transition-opacity"
                style={{ backgroundColor: '#3B6B4A', color: 'white', fontSize: '15px' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Sparkles size={18} />
                <span>+ 첫 로드맵 만들기</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F1' }}>
      <Navigation activeMenu="로드맵" />
      
      <main className="flex-1 px-8 py-8">
        <div className="max-w-[1000px] mx-auto">
          {/* PAGE HEADER */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <h1 className="font-bold" style={{ color: '#2C2C2C', fontSize: '28px' }}>
                🗺️ 내 로드맵
              </h1>
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 h-11 px-5 rounded-lg font-medium transition-opacity"
                style={{ backgroundColor: '#3B6B4A', color: 'white', fontSize: '14px' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <Sparkles size={16} />
                <span>+ 새 로드맵 만들기</span>
              </button>
            </div>
            <p style={{ color: '#777777', fontSize: '14px' }}>
              지금까지 만든 학습 로드맵을 관리해요
            </p>
          </div>

          {/* ACTIVE ROADMAP SECTION */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold" style={{ color: '#2C2C2C', fontSize: '18px' }}>
                📌 진행 중인 로드맵
              </h2>
              <span 
                className="px-2 py-1 rounded text-xs"
                style={{ backgroundColor: '#E5E0D8', color: '#777777' }}
              >
                1개
              </span>
            </div>

            {/* Big Featured Active Roadmap Card */}
            <div 
              className="bg-white rounded-2xl p-6"
              style={{ 
                border: '2px solid #3B6B4A',
                boxShadow: '0 2px 8px rgba(59, 107, 74, 0.08)'
              }}
            >
              {/* Top Row */}
              <div className="flex items-start gap-3 mb-4">
                {/* Quri Icon */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
                  <ellipse cx="16" cy="18" rx="9.2" ry="10.8" fill="#E8985E" />
                  <ellipse cx="16" cy="20" rx="6" ry="7.2" fill="#FFF3EB" />
                  <path d="M 9.2 10 Q 7.2 6 8 5.2 Q 9.2 4 10.8 6.8 L 10 10.8 Z" fill="#D67A45" />
                  <path d="M 22.8 10 Q 24.8 6 24 5.2 Q 22.8 4 21.2 6.8 L 22 10.8 Z" fill="#D67A45" />
                  <circle cx="12.8" cy="14" r="3.6" fill="white" />
                  <circle cx="19.2" cy="14" r="3.6" fill="white" />
                  <circle cx="13" cy="14" r="2.2" fill="#2C2C2C" />
                  <circle cx="19" cy="14" r="2.2" fill="#2C2C2C" />
                  <circle cx="13.2" cy="13.2" r="1" fill="white" />
                  <circle cx="19.2" cy="13.2" r="1" fill="white" />
                  <path d="M 16 16 L 14.8 18 L 17.2 18 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="0.4" />
                  <ellipse cx="16" cy="7.2" rx="8" ry="2" fill="#2C2C2C" />
                  <rect x="12" y="5.2" width="8" height="2" fill="#2C2C2C" />
                  <rect x="9.2" y="5.2" width="13.6" height="0.8" fill="#2C2C2C" />
                </svg>

                {/* Title and Status */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold" style={{ color: '#2C2C2C', fontSize: '20px' }}>
                      파이썬 기반 데이터 분석
                    </h3>
                    <span 
                      className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                      style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                    >
                      📌 진행 중
                    </span>
                  </div>
                  <p className="text-sm truncate" style={{ color: '#555555' }}>
                    비전공자 → 파이썬 기반 데이터 분석 역량 습득
                  </p>
                </div>

                {/* 3-dot Menu */}
                <button 
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors"
                  style={{ color: '#777777' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Meta Info Row */}
              <div className="flex items-center gap-4 mb-4 text-[13px]" style={{ color: '#777777' }}>
                <span>📅 8주 과정</span>
                <span>⏰ 주 5시간</span>
                <span>📚 16개 강좌</span>
                <span>🏫 3개 플랫폼</span>
              </div>

              {/* Progress Section */}
              <div 
                className="rounded-xl p-4 mb-4"
                style={{ backgroundColor: '#F8F6F1' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm" style={{ color: '#2C2C2C' }}>
                    전체 진행률
                  </span>
                  <span className="font-bold" style={{ color: '#3B6B4A', fontSize: '18px' }}>
                    37.5%
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div 
                  className="w-full h-3 rounded-full mb-2 overflow-hidden"
                  style={{ backgroundColor: '#E5E0D8' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#3B6B4A', width: '37.5%' }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs" style={{ color: '#777777' }}>
                  <span>6/16 강좌 완료</span>
                  <span>시작일: 2026.04.01 · D+15</span>
                </div>
              </div>

              {/* Weekly Indicator Row */}
              <div className="flex items-center gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
                  <div
                    key={week}
                    className="rounded-full"
                    style={{
                      width: week === 3 ? '12px' : '10px',
                      height: week === 3 ? '12px' : '10px',
                      backgroundColor: week <= 2 ? '#3B6B4A' : week === 3 ? '#3B6B4A' : '#E5E0D8',
                      border: week > 3 ? '1px solid #D0CCC4' : 'none'
                    }}
                    title={`Week ${week}`}
                  />
                ))}
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => navigate("/roadmap-result")}
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
                  상세 보기
                </button>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity"
                  style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  대시보드로 이동 →
                </button>
              </div>
            </div>
          </div>

          {/* FILTER & SORT ROW */}
          <div className="flex items-center justify-between mb-4">
            {/* Filter Chips */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter("all")}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeFilter === "all" ? '#3B6B4A' : 'white',
                  color: activeFilter === "all" ? 'white' : '#777777',
                  border: `1px solid ${activeFilter === "all" ? '#3B6B4A' : '#E5E0D8'}`
                }}
              >
                전체
              </button>
              <button
                onClick={() => setActiveFilter("completed")}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeFilter === "completed" ? '#3B6B4A' : 'white',
                  color: activeFilter === "completed" ? 'white' : '#777777',
                  border: `1px solid ${activeFilter === "completed" ? '#3B6B4A' : '#E5E0D8'}`
                }}
              >
                완료됨
              </button>
              <button
                onClick={() => setActiveFilter("abandoned")}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: activeFilter === "abandoned" ? '#3B6B4A' : 'white',
                  color: activeFilter === "abandoned" ? 'white' : '#777777',
                  border: `1px solid ${activeFilter === "abandoned" ? '#3B6B4A' : '#E5E0D8'}`
                }}
              >
                중단됨
              </button>
            </div>

            {/* Sort Dropdown */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm border transition-colors"
              style={{ borderColor: '#E5E0D8', color: '#777777', backgroundColor: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
            >
              <span>최근 생성순</span>
              <ChevronDown size={14} />
            </button>
          </div>

          {/* PAST ROADMAPS SECTION */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold" style={{ color: '#2C2C2C', fontSize: '18px' }}>
                📚 지난 로드맵
              </h2>
              <span 
                className="text-xs"
                style={{ color: '#999999' }}
              >
                총 4개
              </span>
            </div>

            {/* Grid of Past Roadmap Cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card 1 - COMPLETED */}
              <div 
                className="bg-white rounded-2xl p-5"
                style={{ border: '1px solid #E5E0D8' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                  >
                    ✅ 완료
                  </span>
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#777777' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <h3 className="font-bold mb-2 line-clamp-2" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                  한국어교원 자격 준비 로드맵
                </h3>
                <p className="text-[13px] mb-3 truncate" style={{ color: '#777777' }}>
                  한국어교원 2급 자격증 취득 목표
                </p>

                <div className="text-xs mb-3" style={{ color: '#999999' }}>
                  12주 과정 · 24개 강좌 · 모두 이수
                </div>

                {/* Progress Bar - 100% */}
                <div 
                  className="w-full h-2 rounded-full mb-3 overflow-hidden"
                  style={{ backgroundColor: '#E5E0D8' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#4CAF50', width: '100%' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                    완료일: 2026.03.28
                  </span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
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
                    📊 이수 내역 보기
                  </button>
                </div>
              </div>

              {/* Card 2 - ABANDONED */}
              <div 
                className="bg-white rounded-2xl p-5 opacity-90"
                style={{ border: '1px solid #E5E0D8' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#F5F5F5', color: '#999999' }}
                  >
                    ⏸ 중단됨
                  </span>
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#777777' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <h3 className="font-bold mb-2 line-clamp-2" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                  디지털 마케팅 기초
                </h3>
                <p className="text-[13px] mb-3 truncate" style={{ color: '#777777' }}>
                  온라인 마케팅 실무 능력 배양
                </p>

                <div className="text-xs mb-3" style={{ color: '#999999' }}>
                  8주 과정 · 12개 강좌
                </div>

                {/* Progress Bar - 25% */}
                <div 
                  className="w-full h-2 rounded-full mb-3 overflow-hidden"
                  style={{ backgroundColor: '#E5E0D8' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#BBBBBB', width: '25%' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                    시작: 2026.02.10 · 마지막: 2026.02.25
                  </span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap"
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
                    🔄 다시 시작하기
                  </button>
                </div>
              </div>

              {/* Card 3 - COMPLETED */}
              <div 
                className="bg-white rounded-2xl p-5"
                style={{ border: '1px solid #E5E0D8' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                  >
                    ✅ 완료
                  </span>
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#777777' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <h3 className="font-bold mb-2 line-clamp-2" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                  파이썬 웹 개발 입문
                </h3>
                <p className="text-[13px] mb-3 truncate" style={{ color: '#777777' }}>
                  Flask와 Django 기초 학습
                </p>

                <div className="text-xs mb-3" style={{ color: '#999999' }}>
                  10주 과정 · 18개 강좌 · 모두 이수
                </div>

                {/* Progress Bar - 100% */}
                <div 
                  className="w-full h-2 rounded-full mb-3 overflow-hidden"
                  style={{ backgroundColor: '#E5E0D8' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#4CAF50', width: '100%' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                    완료일: 2026.01.15
                  </span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"
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
                    📊 이수 내역 보기
                  </button>
                </div>
              </div>

              {/* Card 4 - ABANDONED */}
              <div 
                className="bg-white rounded-2xl p-5 opacity-90"
                style={{ border: '1px solid #E5E0D8' }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span 
                    className="px-2.5 py-1 rounded-full text-xs font-medium"
                    style={{ backgroundColor: '#F5F5F5', color: '#999999' }}
                  >
                    ⏸ 중단됨
                  </span>
                  <button 
                    className="w-7 h-7 flex items-center justify-center rounded-lg transition-colors"
                    style={{ color: '#777777' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F8F6F1'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>

                <h3 className="font-bold mb-2 line-clamp-2" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                  통계학 기초 다지기
                </h3>
                <p className="text-[13px] mb-3 truncate" style={{ color: '#777777' }}>
                  데이터 분석을 위한 기초 통계
                </p>

                <div className="text-xs mb-3" style={{ color: '#999999' }}>
                  6주 과정 · 10개 강좌
                </div>

                {/* Progress Bar - 10% */}
                <div 
                  className="w-full h-2 rounded-full mb-3 overflow-hidden"
                  style={{ backgroundColor: '#E5E0D8' }}
                >
                  <div 
                    className="h-full rounded-full"
                    style={{ backgroundColor: '#BBBBBB', width: '10%' }}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                    시작: 2025.12.01 · 마지막: 2025.12.10
                  </span>
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors whitespace-nowrap"
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
                    🔄 다시 시작하기
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-center gap-2 mt-8 mb-12">
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: 'white', border: '1px solid #E5E0D8', color: '#777777' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
            >
              &lt;
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg font-medium"
              style={{ backgroundColor: '#3B6B4A', color: 'white' }}
            >
              1
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: 'white', border: '1px solid #E5E0D8', color: '#777777' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
            >
              2
            </button>
            <button
              className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
              style={{ backgroundColor: 'white', border: '1px solid #E5E0D8', color: '#777777' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#3B6B4A'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#E5E0D8'}
            >
              &gt;
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}