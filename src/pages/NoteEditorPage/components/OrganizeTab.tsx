import { useState } from "react";
import { Sparkles, Plus } from "lucide-react";
import { type AiOrganizeResponse } from "../../../api/client";

interface OrganizeTabProps {
  aiOrganizeResult: AiOrganizeResponse | null;
  aiOrganizeLoading: boolean;
  showAIResult: boolean;
  onAiOrganize: () => void;
  onAddSummaryLine?: (line: string) => void;
  onAddSuggestion?: (suggestion: string) => void;
}

export function OrganizeTab({ 
  aiOrganizeResult, 
  aiOrganizeLoading,
  showAIResult,
  onAiOrganize,
  onAddSummaryLine,
  onAddSuggestion 
}: OrganizeTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Generate Button */}
      <button
        onClick={onAiOrganize}
        disabled={aiOrganizeLoading}
        className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        style={{ backgroundColor: "#3B6B4A", color: "white" }}
        onMouseEnter={(e) => {
          if (!aiOrganizeLoading) e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          if (!aiOrganizeLoading) e.currentTarget.style.opacity = "1";
        }}
      >
        <Sparkles size={16} />
        <span>{aiOrganizeLoading ? "🤖 AI가 노트를 정리하는 중..." : "🤖 AI 에게 노트 정리 요청"}</span>
      </button>

      {/* AI Result */}
      {showAIResult && aiOrganizeResult && (
        <div className="flex flex-col gap-6">
          {/* Section 1: Keywords */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: "#2C2C2C", fontSize: "14px" }}>
              🔑 핵심 키워드
            </h3>
            <div className="flex flex-wrap gap-2">
              {aiOrganizeResult.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{ backgroundColor: "#E8E4F3", color: "#6B4F9C" }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Section 2: Structured Summary */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: "#2C2C2C", fontSize: "14px" }}>
              📋 구조화 요약
            </h3>
            <div
              className="rounded-lg p-4 space-y-2"
              style={{ backgroundColor: "#F8F6F1" }}
            >
              <MarkdownRenderer content={aiOrganizeResult.structuredSummary} onAddLine={onAddSummaryLine} />
            </div>
          </div>

          {/* Section 3: Suggestions */}
          <div>
            <h3 className="font-bold mb-3" style={{ color: "#2C2C2C", fontSize: "14px" }}>
              💡 보충하면 좋을 내용
            </h3>
            <div className="flex flex-col gap-3">
              {aiOrganizeResult.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="rounded-lg p-4 group relative"
                  style={{ backgroundColor: "#FFF3EB" }}
                >
                  <p className="text-sm leading-relaxed pr-8" style={{ color: "#2C2C2C" }}>
                    {suggestion}
                  </p>
                  {onAddSuggestion && (
                    <button
                      onClick={() => onAddSuggestion(suggestion)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                      style={{ color: "#E8985E" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#FFE5CC"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <Plus size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Note */}
          <p className="text-[11px] text-center" style={{ color: "#AAAAAA" }}>
            노트 내용은 덮어쓰지 않고, 선택한 항목만 추가됩니다
          </p>
        </div>
      )}
    </div>
  );
}

// Markdown renderer component with hover add button
function MarkdownRenderer({ content, onAddLine }: { content: string; onAddLine?: (line: string) => void }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const lines = content.split("\n");
  
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        // Header (###)
        if (line.startsWith("###")) {
          return (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-bold" style={{ color: "#2C2C2C", fontSize: "13px" }}>
                  {line.replace(/^###\s*/, "")}
                </h4>
                {onAddLine && hoveredIndex === i && (
                  <button
                    onClick={() => onAddLine(line)}
                    className="text-xs font-medium whitespace-nowrap transition-colors"
                    style={{ color: "#3B6B4A" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#2A4D34"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#3B6B4A"}
                  >
                    + 노트에 추가
                  </button>
                )}
              </div>
            </div>
          );
        }
        // Bold list item (- **text**: description)
        if (line.startsWith("- **")) {
          const match = line.match(/^- \*\*(.+?)\*\*(.*)$/);
          return (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs" style={{ color: "#3B6B4A" }}>•</span>
                  <p className="text-sm" style={{ color: "#2C2C2C" }}>
                    <strong>{match?.[1]}</strong>
                    {match?.[2]?.replace(/^[:\s]+/, "")}
                  </p>
                </div>
                {onAddLine && hoveredIndex === i && (
                  <button
                    onClick={() => onAddLine(line)}
                    className="text-xs font-medium whitespace-nowrap transition-colors"
                    style={{ color: "#3B6B4A" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#2A4D34"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#3B6B4A"}
                  >
                    + 노트에 추가
                  </button>
                )}
              </div>
            </div>
          );
        }
        // Regular list item (- text)
        if (line.startsWith("- ")) {
          return (
            <div
              key={i}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <span className="text-xs" style={{ color: "#3B6B4A" }}>•</span>
                  <p className="text-sm" style={{ color: "#2C2C2C" }}>
                    {line.substring(2)}
                  </p>
                </div>
                {onAddLine && hoveredIndex === i && (
                  <button
                    onClick={() => onAddLine(line)}
                    className="text-xs font-medium whitespace-nowrap transition-colors"
                    style={{ color: "#3B6B4A" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#2A4D34"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#3B6B4A"}
                  >
                    + 노트에 추가
                  </button>
                )}
              </div>
            </div>
          );
        }
        // Empty line
        if (line.trim() === "") {
          return <div key={i} className="h-2" />;
        }
        // Regular text
        return (
          <div
            key={i}
            className="relative group"
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm" style={{ color: "#2C2C2C" }}>
                {line}
              </p>
              {onAddLine && hoveredIndex === i && (
                <button
                  onClick={() => onAddLine(line)}
                  className="text-xs font-medium whitespace-nowrap transition-colors"
                  style={{ color: "#3B6B4A" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#2A4D34"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#3B6B4A"}
                >
                  + 노트에 추가
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
