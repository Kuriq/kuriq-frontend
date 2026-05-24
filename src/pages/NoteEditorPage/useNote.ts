import { useState, useEffect, useCallback } from "react";
import { getNoteByCourse, saveNote, aiOrganizeNote, createNote, type AiOrganizeResponse } from "../../api/client";

interface UseNoteReturn {
  noteContent: string;
  courseTitle: string;
  platform: string;
  characterCount: number;
  lastSavedAt: string | null;
  saving: boolean;
  loading: boolean;
  aiOrganizeResult: AiOrganizeResponse | null;
  noteId: string | null;
  setNoteContent: (content: string) => void;
  handleAiOrganize: () => Promise<void>;
}

export function useNote(courseId: string): UseNoteReturn {
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [platform, setPlatform] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiOrganizeResult, setAiOrganizeResult] = useState<AiOrganizeResponse | null>(null);

  // Load or create note on mount
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    getNoteByCourse(courseId)
      .then((note) => {
        setNoteId(note.noteId);
        setNoteContent(note.content);
        setCourseTitle(note.courseTitle);
        setPlatform(note.platform);
        setLastSavedAt(note.lastSavedAt);
      })
      .catch(async (err) => {
        console.log("노트 조회 실패, 생성 시도:", err);
        // 404 = 노트 없음 → 생성
        try {
          const created = await createNote({ courseId, content: "학습 노트를 작성해보세요." });
          setNoteId(created.noteId);
          setNoteContent("");
          setCourseTitle("");
          setPlatform("");
          setLastSavedAt(null);
          // URL 업데이트
          window.history.replaceState({}, "", `/note-editor?noteId=${created.noteId}`);
        } catch (createErr) {
          console.error("노트 생성 실패:", createErr);
        }
      })
      .finally(() => setLoading(false));
  }, [courseId]);

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
    if (noteContent.length < 50) {
      alert("AI 정리는 50 자 이상 작성 후 사용해주세요.");
      return;
    }
    try {
      const res = await aiOrganizeNote(noteId);
      setAiOrganizeResult(res);
    } catch (err) {
      console.error("AI 노트 정리 실패:", err);
      alert("AI 노트 정리에 실패했습니다.");
    }
  }, [noteId, noteContent]);

  return {
    noteContent,
    courseTitle,
    platform,
    characterCount: noteContent.length,
    lastSavedAt,
    saving,
    loading,
    noteId,
    aiOrganizeResult,
    setNoteContent,
    handleAiOrganize,
  };
}
