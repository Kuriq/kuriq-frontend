import { useState } from "react";
import { useNavigate } from "react-router";
import { Navigation } from "../components/layout/Navigation";
import { Sparkles, Bold, Italic, List, ListOrdered, Code, Link, ChevronDown, Send, ChevronRight } from "lucide-react";

export default function NoteEditorPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"organize" | "quiz" | "chat">("chat");
  const [showAIResult, setShowAIResult] = useState(true); // Show result state by default
  const [noteContent, setNoteContent] = useState(`## 1강 - 변수와 자료형

파이썬에서 변수는 따로 타입을 선언하지 않아도 된다. 값을 할당하면 자동으로 타입이 결정된다.

### 핵심 내용

• 리스트: 순서 있음, 수정 가능(mutable)
• 딕셔너리: 키-값 쌍, 키는 고유해야 함
• 튜플: 수정 불가 (immutable)

\`\`\`python
# 변수 선언 예제
name = "큐리"
age = 25
scores = [90, 85, 95]
\`\`\`

추가로 정리할 내용...`);

  // Chat states
  const [chatInput, setChatInput] = useState("");
  const [chatMessages] = useState([
    {
      id: 1,
      role: "user" as const,
      content: "리스트랑 튜플 차이가 뭐야?"
    },
    {
      id: 2,
      role: "assistant" as const,
      content: "노트에 '리스트: 순서 있음, 수정 가능(mutable)'이라고 정리하셨죠! 여기에 보충하자면, 튜플(tuple)은 리스트와 거의 같지만 한 가지 큰 차이가 있어요.\n\n리스트는 생성한 후에도 값을 변경할 수 있지만 (예: my_list[0] = 10), 튜플은 한 번 생성하면 내용을 절대 바꿀 수 없어요.\n\n• 리스트 예시: [1, 2, 3] → 값 변경 가능\n• 튜플 예시: (1, 2, 3) → 값 변경 불가능",
      reference: "리스트: 순서 있음, 수정 가능(mutable) / 튜플: 수정 불가 (immutable)"
    },
    {
      id: 3,
      role: "user" as const,
      content: "그럼 언제 튜플을 써야 해?"
    },
    {
      id: 4,
      role: "assistant" as const,
      content: "좋은 질문이에요! 튜플은 데이터가 변경되면 안 되는 상황에서 사용합니다.\n\n예를 들어:\n• 좌표값 (x, y) = (10, 20)\n• 날짜 (년, 월, 일) = (2024, 4, 16)\n• 설정값이나 상수\n\n이렇게 한 번 정하면 바뀌면 안 되는 값들을 튜플로 저장하면 실수로 값을 바꾸는 것을 방지할 수 있어요.",
      reference: "튜플: 수정 불가 (immutable)"
    }
  ]);

  // Quiz result modal state
  const [showQuizResult, setShowQuizResult] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const totalQuestions = 5;
  
  const quizData = {
    question: "파이썬에서 리스트와 튜플의 가장 큰 차이점은?",
    options: [
      { id: "A", text: "리스트는 변경 가능, 튜플은 변경 불가" },
      { id: "B", text: "리스트는 숫자만, 튜플은 문자만 저장" },
      { id: "C", text: "리스트는 순서 없음, 튜플은 순서 있음" },
      { id: "D", text: "차이 없음" }
    ],
    correctAnswer: "A",
    explanation: "노트에서 '리스트: 순서 있음, 수정 가능(mutable)'이라고 정리하셨죠. 튜플은 수정 불가(immutable)한 특성을 가지고 있어서, 한 번 생성되면 내용을 변경할 수 없습니다."
  };

  const keywords = ["변수", "자료형", "동적 타이핑", "리스트", "딕셔너리"];
  
  const suggestions = [
    "튜플(tuple)과 리스트의 차이점에 대해서도 정리해 보면 좋을 것 같아요.",
    "반복문에서 break와 continue의 차이도 함께 정리하면 도움이 될 거예요."
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F8F6F1' }}>
      <Navigation activeMenu="" />
      
      <div className="max-w-[1440px] mx-auto px-8 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 mb-6 text-sm font-medium transition-colors"
          style={{ color: '#777777' }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#3B6B4A'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#777777'}
        >
          <span>←</span>
          <span>대시보드</span>
        </button>

        {/* Main Content: Split View */}
        <div className="flex gap-4">
          {/* LEFT AREA - Note Editor (60%) */}
          <div className="flex-[6] flex flex-col gap-4">
            {/* Header Strip */}
            <div className="bg-white rounded-xl p-4 border border-[#E5E0D8]">
              {/* Top Row */}
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-lg font-bold" style={{ color: '#2C2C2C' }}>
                  모두를 위한 파이썬
                </h1>
                <span
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                >
                  K-MOOC
                </span>
                <span className="text-[13px]" style={{ color: '#777777' }}>
                  서울대학교
                </span>
              </div>
              
              {/* Bottom Row */}
              <div className="flex items-center justify-between">
                <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                  1,247자
                </span>
                <span className="text-[11px]" style={{ color: '#AAAAAA' }}>
                  💾 자동 저장됨 · 방금 전
                </span>
              </div>
            </div>

            {/* Editor Toolbar */}
            <div className="flex items-center justify-between gap-2 px-2">
              <div className="flex items-center gap-2">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors font-bold"
                  title="Bold"
                  style={{ color: '#777777' }}
                >
                  <Bold size={16} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors italic"
                  title="Italic"
                  style={{ color: '#777777' }}
                >
                  <Italic size={16} />
                </button>
                <div className="w-px h-6 bg-[#E5E0D8]" />
                <button
                  className="h-8 px-3 flex items-center gap-1 rounded hover:bg-white transition-colors text-sm"
                  style={{ color: '#777777' }}
                >
                  <span>제목</span>
                  <ChevronDown size={14} />
                </button>
                <div className="w-px h-6 bg-[#E5E0D8]" />
                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                  title="Bullet list"
                  style={{ color: '#777777' }}
                >
                  <List size={16} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                  title="Numbered list"
                  style={{ color: '#777777' }}
                >
                  <ListOrdered size={16} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                  title="Code block"
                  style={{ color: '#777777' }}
                >
                  <Code size={16} />
                </button>
                <button
                  className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
                  title="Link"
                  style={{ color: '#777777' }}
                >
                  <Link size={16} />
                </button>
              </div>

              <button
                className="h-9 px-4 flex items-center gap-2 rounded-lg border-2 font-medium text-sm transition-colors"
                style={{ 
                  borderColor: '#3B6B4A',
                  color: '#3B6B4A',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E8F0EA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Sparkles size={16} />
                <span>AI 정리</span>
              </button>
            </div>

            {/* Main Editor Area */}
            <div className="bg-white rounded-xl p-6 border border-[#E5E0D8] min-h-[500px]">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full h-full min-h-[480px] resize-none outline-none font-normal leading-relaxed"
                style={{ 
                  color: '#2C2C2C',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  fontFamily: 'Pretendard, "Noto Sans KR", sans-serif'
                }}
                placeholder="노트를 작성해보세요..."
              />
            </div>
          </div>

          {/* RIGHT PANEL - AI Assistant (40%) */}
          <div className="flex-[4] flex flex-col gap-4">
            {/* Tab Selector */}
            <div className="bg-white rounded-xl border border-[#E5E0D8] overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("organize")}
                  className="flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2"
                  style={{
                    color: activeTab === "organize" ? '#3B6B4A' : '#777777',
                    borderBottomColor: activeTab === "organize" ? '#3B6B4A' : 'transparent',
                    backgroundColor: activeTab === "organize" ? '#F8F6F1' : 'transparent'
                  }}
                >
                  🤖 AI 정리
                </button>
                <button
                  onClick={() => setActiveTab("quiz")}
                  className="flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2"
                  style={{
                    color: activeTab === "quiz" ? '#3B6B4A' : '#777777',
                    borderBottomColor: activeTab === "quiz" ? '#3B6B4A' : 'transparent',
                    backgroundColor: activeTab === "quiz" ? '#F8F6F1' : 'transparent'
                  }}
                >
                  📝 퀴즈 풀기
                </button>
                <button
                  onClick={() => setActiveTab("chat")}
                  className="flex-1 py-3 px-4 text-sm font-medium transition-colors border-b-2"
                  style={{
                    color: activeTab === "chat" ? '#3B6B4A' : '#777777',
                    borderBottomColor: activeTab === "chat" ? '#3B6B4A' : 'transparent',
                    backgroundColor: activeTab === "chat" ? '#F8F6F1' : 'transparent'
                  }}
                >
                  💬 큐리에게 질문
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "organize" && (
                  <div className="flex flex-col gap-6">
                    {/* Generate Button */}
                    <button
                      onClick={() => setShowAIResult(true)}
                      className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity"
                      style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      <Sparkles size={16} />
                      <span>🤖 AI에게 노트 정리 요청</span>
                    </button>

                    {/* AI Result */}
                    {showAIResult && (
                      <div className="flex flex-col gap-6">
                        {/* Section 1: Keywords */}
                        <div>
                          <h3 className="font-bold mb-3" style={{ color: '#2C2C2C', fontSize: '14px' }}>
                            🔑 핵심 키워드
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className="px-3 py-1.5 rounded-full text-xs font-medium"
                                style={{ backgroundColor: '#E8E4F3', color: '#6B4F9C' }}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Section 2: Structured Summary */}
                        <div>
                          <h3 className="font-bold mb-3" style={{ color: '#2C2C2C', fontSize: '14px' }}>
                            📋 구조화 요약
                          </h3>
                          <div
                            className="rounded-lg p-4 space-y-2"
                            style={{ backgroundColor: '#F8F6F1' }}
                          >
                            <SummaryLine text="### 파이썬 기초 문법" />
                            <SummaryLine text="- 변수: 타입 선언 없이 값 할당으로 자동 결정" />
                            <SummaryLine text="- 기본 타입: int, float, str, bool" />
                            <SummaryLine text="- 리스트와 딕셔너리는 수정 가능(mutable)" />
                            <SummaryLine text="- 튜플은 수정 불가(immutable)" />
                          </div>
                        </div>

                        {/* Section 3: Suggestions */}
                        <div>
                          <h3 className="font-bold mb-3" style={{ color: '#2C2C2C', fontSize: '14px' }}>
                            💡 보충하면 좋을 내용
                          </h3>
                          <div className="flex flex-col gap-3">
                            {suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="rounded-lg p-4 group relative"
                                style={{ backgroundColor: '#FFF3EB' }}
                              >
                                <p className="text-sm leading-relaxed pr-2" style={{ color: '#2C2C2C' }}>
                                  {suggestion}
                                </p>
                                <button
                                  className="mt-2 text-xs font-medium transition-colors"
                                  style={{ color: '#E8985E' }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = '#D17A42'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = '#E8985E'}
                                >
                                  + 노트에 추가
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Bottom Note */}
                        <p className="text-[11px] text-center" style={{ color: '#AAAAAA' }}>
                          노트 내용은 덮어쓰지 않고, 선택한 항목만 추가됩니다
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "quiz" && (
                  <div className="flex flex-col gap-4">
                    {!quizStarted ? (
                      // Before starting
                      <>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                            노트 내용 기반 퀴즈
                          </h3>
                          <span className="text-sm" style={{ color: '#777777' }}>
                            5문제
                          </span>
                        </div>
                        <button
                          onClick={() => setQuizStarted(true)}
                          className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity"
                          style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          🎯 퀴즈 시작하기
                        </button>
                      </>
                    ) : (
                      // Quiz in progress
                      <>
                        {/* Header with title and question count */}
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                            노트 내용 기반 퀴즈
                          </h3>
                          <span className="text-sm" style={{ color: '#777777' }}>
                            5문제
                          </span>
                        </div>

                        {/* Progress */}
                        <div className="flex flex-col gap-2 mb-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium" style={{ color: '#2C2C2C' }}>
                              문제 {currentQuestion} / {totalQuestions}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((num) => (
                              <div
                                key={num}
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: num <= currentQuestion ? '#3B6B4A' : '#E5E0D8'
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white rounded-xl p-5 border border-[#E5E0D8]">
                          {/* Question type label */}
                          <span
                            className="inline-block px-2 py-1 rounded-full text-xs font-medium mb-3"
                            style={{ backgroundColor: '#E8F0EA', color: '#3B6B4A' }}
                          >
                            객관식
                          </span>

                          {/* Question */}
                          <h4 className="font-bold mb-4" style={{ color: '#2C2C2C', fontSize: '15px', lineHeight: '1.5' }}>
                            {quizData.question}
                          </h4>

                          {/* Options */}
                          <div className="flex flex-col gap-2">
                            {quizData.options.map((option) => {
                              const isSelected = selectedAnswer === option.id;
                              const isCorrect = option.id === quizData.correctAnswer;
                              const showResult = showExplanation && isSelected;

                              return (
                                <button
                                  key={option.id}
                                  onClick={() => {
                                    setSelectedAnswer(option.id);
                                    setShowExplanation(true);
                                  }}
                                  className="w-full min-h-[48px] px-4 py-3 rounded-lg text-left text-sm transition-all flex items-center justify-between gap-2"
                                  style={{
                                    backgroundColor: isSelected && showExplanation
                                      ? (isCorrect ? '#E8F0EA' : '#FFE8E8')
                                      : (isSelected ? '#F8F6F1' : 'white'),
                                    border: `1px solid ${
                                      isSelected && showExplanation
                                        ? (isCorrect ? '#3B6B4A' : '#E57373')
                                        : (isSelected ? '#3B6B4A' : '#E5E0D8')
                                    }`,
                                    color: '#2C2C2C'
                                  }}
                                >
                                  <span>
                                    <strong>{option.id}.</strong> {option.text}
                                  </span>
                                  {showResult && (
                                    <span
                                      className="text-sm font-bold whitespace-nowrap"
                                      style={{ color: isCorrect ? '#3B6B4A' : '#E57373' }}
                                    >
                                      {isCorrect ? '✓ 정답!' : '✕ 오답'}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Explanation (shown after answering) */}
                        {showExplanation && selectedAnswer && (
                          <div
                            className="rounded-xl p-4"
                            style={{ backgroundColor: '#FFFBF0', border: '1px solid #FFE8A3' }}
                          >
                            <h5 className="font-bold mb-2 text-sm flex items-center gap-2" style={{ color: '#2C2C2C' }}>
                              <span>💡</span>
                              <span>해설</span>
                            </h5>
                            <p className="text-sm leading-relaxed mb-3" style={{ color: '#2C2C2C' }}>
                              {quizData.explanation}
                            </p>
                            <button
                              className="text-sm font-medium underline transition-colors"
                              style={{ color: '#3B6B4A' }}
                              onMouseEnter={(e) => e.currentTarget.style.color = '#2A4D34'}
                              onMouseLeave={(e) => e.currentTarget.style.color = '#3B6B4A'}
                            >
                              📌 이 부분 다시 보기
                            </button>
                          </div>
                        )}

                        {/* Next Question Button */}
                        <button
                          onClick={() => {
                            if (currentQuestion < totalQuestions) {
                              setCurrentQuestion(currentQuestion + 1);
                              setSelectedAnswer(null);
                              setShowExplanation(false);
                            }
                          }}
                          disabled={!selectedAnswer}
                          className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity"
                          style={{
                            backgroundColor: selectedAnswer ? '#3B6B4A' : '#E5E0D8',
                            color: selectedAnswer ? 'white' : '#AAAAAA',
                            cursor: selectedAnswer ? 'pointer' : 'not-allowed',
                            opacity: selectedAnswer ? 1 : 0.6
                          }}
                          onMouseEnter={(e) => {
                            if (selectedAnswer) e.currentTarget.style.opacity = '0.9';
                          }}
                          onMouseLeave={(e) => {
                            if (selectedAnswer) e.currentTarget.style.opacity = '1';
                          }}
                        >
                          다음 문제 →
                        </button>
                      </>
                    )}
                  </div>
                )}

                {activeTab === "chat" && (
                  <div className="flex flex-col h-[600px]">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-4">
                      {/* Quri Owl Icon */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <ellipse cx="12" cy="13.5" rx="7" ry="8" fill="#E8985E" />
                        <ellipse cx="12" cy="15" rx="4.5" ry="5.5" fill="#FFF3EB" />
                        <path d="M 7 7.5 Q 5.5 4.5 6.5 3.5 Q 7 3 8 5 L 7.5 8 Z" fill="#D67A45" />
                        <path d="M 17 7.5 Q 18.5 4.5 17.5 3.5 Q 17 3 16 5 L 16.5 8 Z" fill="#D67A45" />
                        <circle cx="9.5" cy="10.5" r="2.8" fill="white" />
                        <circle cx="14.5" cy="10.5" r="2.8" fill="white" />
                        <circle cx="9.8" cy="10.5" r="1.7" fill="#2C2C2C" />
                        <circle cx="14.2" cy="10.5" r="1.7" fill="#2C2C2C" />
                        <circle cx="10" cy="10" r="0.8" fill="white" />
                        <circle cx="14.5" cy="10" r="0.8" fill="white" />
                        <path d="M 12 12 L 11 13.5 L 13 13.5 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="0.3" />
                        <ellipse cx="12" cy="5.5" rx="6" ry="1.5" fill="#2C2C2C" />
                        <rect x="9" y="4" width="6" height="1.5" fill="#2C2C2C" />
                        <rect x="7" y="4" width="10" height="0.5" fill="#2C2C2C" />
                        <line x1="17" y1="4.3" x2="18.5" y2="3.5" stroke="#E8985E" strokeWidth="0.5" />
                        <circle cx="18.5" cy="3.5" r="0.6" fill="#E8985E" />
                      </svg>
                      <div className="flex-1">
                        <h3 className="font-bold" style={{ color: '#2C2C2C', fontSize: '14px' }}>
                          큐리에게 질문하기
                        </h3>
                        <p className="text-[11px]" style={{ color: '#AAAAAA' }}>
                          노트 내용을 참고하여 답변합니다
                        </p>
                      </div>
                    </div>

                    {/* Chat Message History (Scrollable) */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                      {chatMessages.map((message) => {
                        if (message.role === "user") {
                          return (
                            <div key={message.id} className="flex justify-end">
                              <div
                                className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm"
                                style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                              >
                                <p className="text-sm leading-relaxed">
                                  {message.content}
                                </p>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div key={message.id} className="flex gap-2">
                              {/* Quri Avatar */}
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-1">
                                <ellipse cx="12" cy="13.5" rx="7" ry="8" fill="#E8985E" />
                                <ellipse cx="12" cy="15" rx="4.5" ry="5.5" fill="#FFF3EB" />
                                <path d="M 7 7.5 Q 5.5 4.5 6.5 3.5 Q 7 3 8 5 L 7.5 8 Z" fill="#D67A45" />
                                <path d="M 17 7.5 Q 18.5 4.5 17.5 3.5 Q 17 3 16 5 L 16.5 8 Z" fill="#D67A45" />
                                <circle cx="9.5" cy="10.5" r="2.8" fill="white" />
                                <circle cx="14.5" cy="10.5" r="2.8" fill="white" />
                                <circle cx="9.8" cy="10.5" r="1.7" fill="#2C2C2C" />
                                <circle cx="14.2" cy="10.5" r="1.7" fill="#2C2C2C" />
                                <circle cx="10" cy="10" r="0.8" fill="white" />
                                <circle cx="14.5" cy="10" r="0.8" fill="white" />
                                <path d="M 12 12 L 11 13.5 L 13 13.5 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="0.3" />
                                <ellipse cx="12" cy="5.5" rx="6" ry="1.5" fill="#2C2C2C" />
                                <rect x="9" y="4" width="6" height="1.5" fill="#2C2C2C" />
                                <rect x="7" y="4" width="10" height="0.5" fill="#2C2C2C" />
                              </svg>

                              {/* Message bubble */}
                              <div className="flex-1">
                                <div
                                  className="max-w-[90%] px-4 py-3 rounded-2xl rounded-tl-sm"
                                  style={{ backgroundColor: '#F0F0F0' }}
                                >
                                  <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#2C2C2C' }}>
                                    {message.content}
                                  </p>
                                </div>
                                {message.reference && (
                                  <button
                                    className="mt-1 text-[11px] italic transition-colors"
                                    style={{ color: '#AAAAAA' }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#3B6B4A'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#AAAAAA'}
                                  >
                                    📌 참고한 노트: {message.reference}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        }
                      })}
                    </div>

                    {/* Bottom Input Area (Sticky) */}
                    <div className="border-t border-[#E5E0D8] pt-4">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          placeholder="궁금한 것을 물어보세요..."
                          className="flex-1 h-11 px-4 rounded-lg border border-[#E5E0D8] outline-none text-sm"
                          style={{
                            color: '#2C2C2C',
                            fontFamily: 'Pretendard, "Noto Sans KR", sans-serif'
                          }}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              // Handle send message
                            }
                          }}
                        />
                        <button
                          className="w-11 h-11 rounded-lg flex items-center justify-center transition-opacity"
                          style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                      <p className="text-[11px] text-center mt-2" style={{ color: '#AAAAAA' }}>
                        오늘 남은 질문: 3/5 (무료)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Result Modal */}
      {showQuizResult && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={() => setShowQuizResult(false)}
        >
          <div 
            className="bg-white rounded-[20px] p-8 max-w-[640px] w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Quri Mascot - Winking */}
            <div className="flex justify-center mb-6">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                {/* Body */}
                <ellipse cx="40" cy="45" rx="23" ry="27" fill="#E8985E" />
                <ellipse cx="40" cy="50" rx="15" ry="18" fill="#FFF3EB" />
                
                {/* Ear tufts */}
                <path d="M 23 25 Q 18 15 20 13 Q 23 10 27 17 L 25 27 Z" fill="#D67A45" />
                <path d="M 57 25 Q 62 15 60 13 Q 57 10 53 17 L 55 27 Z" fill="#D67A45" />
                
                {/* Left eye - OPEN */}
                <circle cx="32" cy="35" r="9" fill="white" />
                <circle cx="32.5" cy="35" r="5.5" fill="#2C2C2C" />
                <circle cx="33.5" cy="33" r="2.5" fill="white" />
                
                {/* Right eye - WINKING (line) */}
                <path d="M 42 35 Q 48 33 54 35" stroke="#2C2C2C" strokeWidth="3" strokeLinecap="round" fill="none" />
                
                {/* Beak */}
                <path d="M 40 40 L 37 45 L 43 45 Z" fill="#E8985E" stroke="#D67A45" strokeWidth="1" />
                
                {/* Graduation cap */}
                <ellipse cx="40" cy="18" rx="20" ry="5" fill="#2C2C2C" />
                <rect x="30" y="13" width="20" height="5" fill="#2C2C2C" />
                <rect x="23" y="13" width="34" height="2" fill="#2C2C2C" />
                
                {/* Tassel */}
                <line x1="57" y1="14" x2="62" y2="12" stroke="#E8985E" strokeWidth="1.5" />
                <circle cx="62" cy="12" r="2" fill="#E8985E" />
                
                {/* Celebration sparkles */}
                <text x="10" y="25" fontSize="16">✨</text>
                <text x="62" y="50" fontSize="16">✨</text>
              </svg>
            </div>

            {/* Title */}
            <h2 className="text-center font-bold mb-6" style={{ color: '#2C2C2C', fontSize: '24px' }}>
              퀴즈 완료!
            </h2>

            {/* Score Circle */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-40 h-40 mb-4">
                {/* SVG Circle Chart */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Background circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#E5E0D8"
                    strokeWidth="12"
                  />
                  {/* Progress circle (80% = 4/5) */}
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    fill="none"
                    stroke="#3B6B4A"
                    strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 70 * 0.8} ${2 * Math.PI * 70}`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Percentage in center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold" style={{ color: '#2C2C2C', fontSize: '36px' }}>
                    80%
                  </span>
                </div>
              </div>
              <p className="font-bold mb-4" style={{ color: '#2C2C2C', fontSize: '16px' }}>
                5문제 중 4문제 정답
              </p>
              <p className="font-bold text-center" style={{ color: '#3B6B4A', fontSize: '20px' }}>
                잘 하셨어요!
              </p>
            </div>

            {/* Quri Feedback Card */}
            <div 
              className="rounded-xl p-4 mb-6 flex gap-3"
              style={{ backgroundColor: '#FFF3EB' }}
            >
              {/* Small Quri Icon */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                <ellipse cx="12" cy="13.5" rx="7" ry="8" fill="#E8985E" />
                <ellipse cx="12" cy="15" rx="4.5" ry="5.5" fill="#FFF3EB" />
                <circle cx="9.5" cy="10.5" r="2.8" fill="white" />
                <circle cx="14.5" cy="10.5" r="2.8" fill="white" />
                <circle cx="9.8" cy="10.5" r="1.7" fill="#2C2C2C" />
                <circle cx="14.2" cy="10.5" r="1.7" fill="#2C2C2C" />
                <path d="M 12 12 L 11 13.5 L 13 13.5 Z" fill="#E8985E" />
                <ellipse cx="12" cy="5.5" rx="6" ry="1.5" fill="#2C2C2C" />
                <rect x="9" y="4" width="6" height="1.5" fill="#2C2C2C" />
              </svg>
              <p className="text-sm leading-relaxed" style={{ color: '#8B5A3C' }}>
                5문제 중 4개를 맞혔어요! '자료형 명칭' 부분을 노트에서 한 번 더 확인해 보세요.
              </p>
            </div>

            {/* Weak Topics Section */}
            <div className="mb-6">
              <h3 className="font-bold mb-3" style={{ color: '#2C2C2C', fontSize: '14px' }}>
                🔍 복습이 필요한 부분
              </h3>
              <div className="flex gap-2">
                <span 
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: '#FFE4D1', color: '#D17A42' }}
                >
                  자료형 명칭
                </span>
              </div>
            </div>

            {/* Question Breakdown (Collapsible) */}
            <div className="mb-6">
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === null ? 0 : null)}
                className="w-full flex items-center justify-between mb-3 transition-colors"
                style={{ color: '#2C2C2C' }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#3B6B4A'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#2C2C2C'}
              >
                <h3 className="font-bold" style={{ fontSize: '14px' }}>
                  문제별 상세 보기
                </h3>
                <ChevronRight 
                  size={20} 
                  className="transition-transform"
                  style={{ transform: expandedQuestion !== null ? 'rotate(90deg)' : 'rotate(0deg)' }}
                />
              </button>
              
              {expandedQuestion !== null && (
                <div className="space-y-2">
                  {[
                    { id: 1, correct: true, question: "파이썬에서 변수를 선언할 때 타입을 명시해야 한다?" },
                    { id: 2, correct: true, question: "파이썬에서 리스트와 튜플의 가장 큰 차이점은?" },
                    { id: 3, correct: false, question: "딕셔너리에서 키는 중복될 수 있다?" },
                    { id: 4, correct: true, question: "리스트는 수정 가능(mutable)한 자료형이다?" },
                    { id: 5, correct: true, question: "튜플은 한 번 생성되면 변경할 수 없다?" }
                  ].map((q) => (
                    <div 
                      key={q.id}
                      className="flex items-center gap-3 p-3 rounded-lg border border-[#E5E0D8] bg-white"
                    >
                      <span style={{ fontSize: '18px' }}>
                        {q.correct ? '✓' : '✕'}
                      </span>
                      <p className="flex-1 text-sm" style={{ color: '#2C2C2C' }}>
                        {q.question}
                      </p>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                        style={{ 
                          backgroundColor: q.correct ? '#E8F0EA' : '#FFE8E8',
                          color: q.correct ? '#3B6B4A' : '#E57373'
                        }}
                      >
                        {q.correct ? '정답' : '오답'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowQuizResult(false);
                  setQuizStarted(false);
                  setCurrentQuestion(1);
                  setSelectedAnswer(null);
                  setShowExplanation(false);
                }}
                className="flex-1 h-11 rounded-lg font-medium text-sm border-2 transition-colors"
                style={{ 
                  borderColor: '#3B6B4A',
                  color: '#3B6B4A',
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#E8F0EA';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                다시 풀기
              </button>
              <button
                onClick={() => setShowQuizResult(false)}
                className="flex-1 h-11 rounded-lg font-medium text-sm transition-opacity"
                style={{ backgroundColor: '#3B6B4A', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                노트로 돌아가기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper component for summary lines with hover add button
function SummaryLine({ text }: { text: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm leading-relaxed flex-1" style={{ color: '#2C2C2C' }}>
          {text}
        </p>
        {isHovered && (
          <button
            className="text-xs font-medium whitespace-nowrap transition-colors"
            style={{ color: '#3B6B4A' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#2A4D34'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#3B6B4A'}
          >
            + 노트에 추가
          </button>
        )}
      </div>
    </div>
  );
}