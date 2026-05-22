import { useState } from "react";
import { Sparkles } from "lucide-react";
import { type AiOrganizeResponse } from "../../../api/client";

interface OrganizeTabProps {
  aiOrganizeResult: AiOrganizeResponse | null;
  showAIResult: boolean;
  onAiOrganize: () => void;
}

export function OrganizeTab({ aiOrganizeResult, showAIResult, onAiOrganize }: OrganizeTabProps) {
  return (
    <div className="flex flex-col gap-6">
      {/* Generate Button */}
      <button
        onClick={onAiOrganize}
        className="w-full h-11 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-opacity"
        style={{ backgroundColor: "#3B6B4A", color: "white" }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = "0.9"}
        onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
      >
        <Sparkles size={16} />
        <span>🤖 AI 에게 노트 정리 요청</span>
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
              {aiOrganizeResult.summary.split("\n").map((line, i) => (
                <SummaryLine key={i} text={line} />
              ))}
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
                  <p className="text-sm leading-relaxed pr-2" style={{ color: "#2C2C2C" }}>
                    {suggestion}
                  </p>
                  <button
                    className="mt-2 text-xs font-medium transition-colors"
                    style={{ color: "#E8985E" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#D17A42"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#E8985E"}
                  >
                    + 노트에 추가
                  </button>
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
        <p className="text-sm leading-relaxed flex-1" style={{ color: "#2C2C2C" }}>
          {text}
        </p>
        {isHovered && (
          <button
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
