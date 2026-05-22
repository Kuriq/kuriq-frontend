import { useState, useEffect, useCallback } from "react";
import { getNoteByCourse, saveNote, aiOrganizeNote, type AiOrganizeResponse } from "../../api/client";

interface UseNoteReturn {
  noteContent: string;
  courseTitle: string;
  platform: string;
  characterCount: number;
  lastSavedAt: string | null;
  saving: boolean;
  aiOrganizeResult: AiOrganizeResponse | null;
  setNoteContent: (content: string) => void;
  handleAiOrganize: () => Promise<void>;
}

export function useNote(noteId: string): UseNoteReturn {
  const [noteContent, setNoteContent] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [aiOrganizeResult, setAiOrganizeResult] = useState<AiOrganizeResponse | null>(null);

  // Load note on mount
  useEffect(() => {
    if (noteId) {
      getNoteByCourse(noteId)
        .then((note) => {
          setNoteContent(note.content);
          setCourseTitle(note.courseTitle);
          setPlatform(note.platform);
          setLastSavedAt(note.lastSavedAt);
        })
        .catch(() => {
          setNoteContent("");
        });
    }
  }, [noteId]);

  // Auto-save note (debounce 3s)
  useEffect(() => {
    if (!noteId || !noteContent) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        const res = await saveNote(noteId, { content: noteContent });
        setLastSavedAt(res.lastSavedAt);
      } catch (err) {
        console.error("노트 저장 실패:", err);
      } finally {
        setSaving(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [noteContent, noteId]);

  const handleAiOrganize = useCallback(async () => {
    if (!noteId) return;
    try {
      const res = await aiOrganizeNote(noteId);
      setAiOrganizeResult(res);
    } catch (err) {
      console.error("AI 노트 정리 실패:", err);
      alert("AI 노트 정리에 실패했습니다.");
    }
  }, [noteId]);

  return {
    noteContent,
    courseTitle,
    platform,
    characterCount: noteContent.length,
    lastSavedAt,
    saving,
    aiOrganizeResult,
    setNoteContent,
    handleAiOrganize,
  };
}
