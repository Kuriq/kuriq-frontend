import { useState, useEffect, useCallback } from "react";
import { getNoteByCourse, saveNote, aiOrganizeNote, createNote, type AiOrganizeResponse } from "../../api/client";

interface UseNoteReturn {
  noteContent: string;
  courseTitle: string;
  courseCategory: string;
  platform: string;
  characterCount: number;
  lastSavedAt: string | null;
  saving: boolean;
  loading: boolean;
  aiOrganizeLoading: boolean;
  aiOrganizeResult: AiOrganizeResponse | null;
  showOrganizeResult: boolean;
  setShowOrganizeResult: (show: boolean) => void;
  noteId: string | null;
  setNoteContent: (content: string) => void;
  handleAiOrganize: () => Promise<void>;
  handleManualSave: () => Promise<void>;
  addContentToNote: (content: string) => void;
}

export function useNote(courseId: string, initialCourseTitle = ""): UseNoteReturn {
  const [noteId, setNoteId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState("");
  const [courseTitle, setCourseTitle] = useState(initialCourseTitle);
  const [courseCategory, setCourseCategory] = useState("");
  const [platform, setPlatform] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiOrganizeLoading, setAiOrganizeLoading] = useState(false);
  const [aiOrganizeResult, setAiOrganizeResult] = useState<AiOrganizeResponse | null>(null);
  const [showOrganizeResult, setShowOrganizeResult] = useState(false);

  // Load note on mount (기존 노트 있으면 불러오기, 없으면 새 노트 모드)
  useEffect(() => {
    if (!courseId) return;

    setLoading(true);
    getNoteByCourse(courseId)
      .then((note) => {
        setNoteId(note.noteId);
        setNoteContent(note.content);
        setCourseTitle(note.courseTitle);
        setCourseCategory("기타");
        setPlatform(note.platform);
        setLastSavedAt(note.lastSavedAt);
      })
      .catch((err) => {
        // 404 = 노트 없음 → 새 노트 모드로 진입 (내용 입력 후 저장 시 생성)
        console.log("노트 없음, 새 노트 모드:", err);
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  // Manual save function
  const handleManualSave = useCallback(async () => {
    if (!noteContent) return;
    setSaving(true);
    try {
      let currentNoteId = noteId;
      if (!currentNoteId) {
        // 첫 저장 시 노트 생성
        const created = await createNote({ courseId, content: noteContent });
        currentNoteId = created.noteId;
        setNoteId(created.noteId);
        const note = await getNoteByCourse(courseId);
        setCourseTitle(note.courseTitle);
        setCourseCategory("기타");
        setPlatform(note.platform);
        setLastSavedAt(note.lastSavedAt);
        window.history.replaceState({}, "", `/note-editor?courseId=${courseId}&courseTitle=${encodeURIComponent(note.courseTitle)}`);
        return true;
      }
      const res = await saveNote(currentNoteId, { content: noteContent });
      setLastSavedAt(res.lastSavedAt);
      return true;
    } catch (err) {
      console.error("노트 저장 실패:", err);
      throw err;
    } finally {
      setSaving(false);
    }
  }, [noteId, noteContent, courseId]);

  // Auto-save note (debounce 3s)
  useEffect(() => {
    if (!noteContent) return;

    const timer = setTimeout(async () => {
      setSaving(true);
      try {
        if (!noteId) {
          // 첫 자동저장 시 노트 생성
          const created = await createNote({ courseId, content: noteContent });
          setNoteId(created.noteId);
          const note = await getNoteByCourse(courseId);
          setCourseTitle(note.courseTitle);
          setCourseCategory("기타");
          setPlatform(note.platform);
          setLastSavedAt(note.lastSavedAt);
          window.history.replaceState({}, "", `/note-editor?courseId=${courseId}&courseTitle=${encodeURIComponent(note.courseTitle)}`);
        } else {
          const res = await saveNote(noteId, { content: noteContent });
          setLastSavedAt(res.lastSavedAt);
        }
      } catch (err) {
        console.error("노트 저장 실패:", err);
      } finally {
        setSaving(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [noteContent, noteId, courseId]);

  // Add content to note
  const addContentToNote = useCallback((content: string) => {
    setNoteContent((prev) => {
      const newContent = prev.trim() ? `${prev}\n\n${content}` : content;
      return newContent;
    });
  }, []);

  const handleAiOrganize = useCallback(async () => {
    if (!noteId || aiOrganizeLoading) return;
    if (noteContent.length < 50) {
      alert("AI 정리는 50 자 이상 작성 후 사용해주세요.");
      return;
    }
    try {
      setAiOrganizeLoading(true);
      const res = await aiOrganizeNote(noteId, courseCategory || "기타");
      setAiOrganizeResult(res);
      setShowOrganizeResult(true);
    } catch (err) {
      console.error("AI 노트 정리 실패:", err);
      alert("AI 노트 정리에 실패했습니다.");
    } finally {
      setAiOrganizeLoading(false);
    }
  }, [aiOrganizeLoading, noteId, noteContent, courseCategory]);

  return {
    noteContent,
    courseTitle,
    courseCategory,
    platform,
    characterCount: noteContent.length,
    lastSavedAt,
    saving,
    loading,
    aiOrganizeLoading,
    noteId,
    aiOrganizeResult,
    showOrganizeResult,
    setShowOrganizeResult,
    setNoteContent,
    handleAiOrganize,
    handleManualSave,
    addContentToNote,
  };
}
