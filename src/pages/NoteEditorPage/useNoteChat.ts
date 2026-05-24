import { useState, useEffect, useRef, useCallback } from "react";
import { getChatHistory, sendChatMessage, getNoteByCourse, type ChatMessage } from "../../api/client";

interface UseNoteChatReturn {
  chatMessages: ChatMessage[];
  chatInput: string;
  chatLoading: boolean;
  setChatInput: (input: string) => void;
  handleSendMessage: () => Promise<void>;
  chatEndRef: React.RefObject<HTMLDivElement>;
}

export function useNoteChat(courseId: string): UseNoteChatReturn {
  const [noteId, setNoteId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Get noteId from courseId
  useEffect(() => {
    if (!courseId) return;
    getNoteByCourse(courseId)
      .then((note) => setNoteId(note.noteId))
      .catch(() => {});
  }, [courseId]);

  // Load chat history on mount
  useEffect(() => {
    if (noteId) {
      getChatHistory(noteId, 0, 50)
        .then((res) => setChatMessages(res.content.reverse()))
        .catch(() => {});
    }
  }, [noteId]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = useCallback(async () => {
    if (!chatInput.trim() || !noteId || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    setChatLoading(true);

    // Optimistically add user message
    setChatMessages((prev) => [
      ...prev,
      { chatId: "tmp", role: "user", message: userMsg, timestamp: new Date().toISOString() },
    ]);

    try {
      const res = await sendChatMessage(noteId, userMsg);
      setChatMessages((prev) => [
        ...prev,
        {
          chatId: res.chatId,
          role: "assistant",
          message: res.message,
          noteReferences: res.noteReferences,
          timestamp: res.timestamp,
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          chatId: "err",
          role: "assistant",
          message: "답변 생성에 실패했습니다. 다시 시도해주세요.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  }, [chatInput, noteId, chatLoading]);

  return {
    chatMessages,
    chatInput,
    chatLoading,
    setChatInput,
    handleSendMessage,
    chatEndRef,
  };
}
