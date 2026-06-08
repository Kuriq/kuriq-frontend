import { Send } from "lucide-react";
import kuriLogo from "../../../assets/images/kuri-logo.png";
import { type ChatMessage } from "../../../api/client";

interface ChatTabProps {
  chatMessages: ChatMessage[];
  chatInput: string;
  chatLoading: boolean;
  setChatInput: (input: string) => void;
  handleSendMessage: () => void;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export function ChatTab({
  chatMessages,
  chatInput,
  chatLoading,
  setChatInput,
  handleSendMessage,
  chatEndRef,
}: ChatTabProps) {
  return (
    <div className="flex flex-col h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <img src={kuriLogo} alt="" style={{ width: 24, height: 24 }} className="flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-bold" style={{ color: "#2C2C2C", fontSize: "14px" }}>
            큐리에게 질문하기
          </h3>
          <p className="text-[11px]" style={{ color: "#AAAAAA" }}>
            노트 내용을 참고하여 답변합니다
          </p>
        </div>
      </div>

      {/* Chat Message History (Scrollable) */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm" style={{ color: "#AAAAAA" }}>아직 대화가 없어요. 질문을 남겨보세요!</p>
          </div>
        )}
        {chatMessages.map((message) => {
          if (message.role === "user") {
            return (
              <div key={message.chatId} className="flex justify-end">
                <div
                  className="max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-sm"
                  style={{ backgroundColor: "#3B6B4A", color: "white" }}
                >
                  <p className="text-sm leading-relaxed">{message.message}</p>
                </div>
              </div>
            );
          } else {
            return (
              <div key={message.chatId} className="flex gap-2">
                <img src={kuriLogo} alt="" style={{ width: 24, height: 24 }} className="flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div
                    className="max-w-[90%] px-4 py-3 rounded-2xl rounded-tl-sm"
                    style={{ backgroundColor: "#F0F0F0" }}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: "#2C2C2C" }}>
                      {message.message}
                    </p>
                  </div>
                  {message.noteReferences && message.noteReferences.length > 0 && (
                    <button
                      className="mt-1 text-[11px] italic transition-colors"
                      style={{ color: "#AAAAAA" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "#3B6B4A"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "#AAAAAA"}
                    >
                      📌 참고한 노트: {message.noteReferences.join(", ")}
                    </button>
                  )}
                </div>
              </div>
            );
          }
        })}
        {chatLoading && (
          <div className="flex gap-2">
            <img src={kuriLogo} alt="" style={{ width: 24, height: 24 }} className="flex-shrink-0 mt-1" />
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm" style={{ backgroundColor: "#F0F0F0" }}>
              <p className="text-sm" style={{ color: "#AAAAAA" }}>답변을 생성중이에요...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
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
              color: "#2C2C2C",
              fontFamily: 'Pretendard, "Noto Sans KR", sans-serif',
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!chatInput.trim() || chatLoading}
            className="w-11 h-11 rounded-lg flex items-center justify-center transition-opacity disabled:opacity-40"
            style={{ backgroundColor: "#3B6B4A", color: "white" }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
