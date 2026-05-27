import { useState, useCallback, useEffect } from "react";
import { generateQuiz, submitQuiz, getNoteByCourse, type QuizQuestion, type QuizResult as QuizResponseType } from "../../api/client";

interface QuizResult {
  totalQuestions: number;
  correctCount: number;
  scorePercent: number;
  results: Array<{
    questionId: string;
    isCorrect: boolean;
    explanation: string;
    feedback: string;
    weakTopic: string;
  }>;
}

interface UseNoteQuizReturn {
  quizStarted: boolean;
  quizLoading: boolean;
  quizSessionId: string;
  quizQuestions: QuizQuestion[];
  currentQuestion: number;
  quizAnswers: Record<number, string>;
  quizResult: QuizResult | null;
  showQuizResult: boolean;
  expandedQuestion: number | null;
  handleStartQuiz: () => Promise<void>;
  handleSelectAnswer: (optionId: string) => void;
  handleSubmitQuiz: () => Promise<void>;
  handleNextQuestion: () => void;
  setShowQuizResult: (show: boolean) => void;
  setExpandedQuestion: (num: number | null) => void;
}

export function useNoteQuiz(courseId: string): UseNoteQuizReturn {
  const [noteId, setNoteId] = useState<string | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizSessionId, setQuizSessionId] = useState("");
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  // Get noteId from courseId
  useEffect(() => {
    if (!courseId) return;
    getNoteByCourse(courseId)
      .then((note) => setNoteId(note.noteId))
      .catch(() => {});
  }, [courseId]);

  const handleStartQuiz = useCallback(async () => {
    if (!noteId) return;
    setQuizLoading(true);
    try {
      const res = await generateQuiz(noteId);
      setQuizSessionId(res.quizSessionId);
      setQuizQuestions(res.questions);
      setQuizStarted(true);
      setCurrentQuestion(0);
      setQuizAnswers({});
      setQuizResult(null);
      setShowQuizResult(false);
    } catch {
      alert("퀴즈 생성에 실패했습니다.");
    } finally {
      setQuizLoading(false);
    }
  }, [noteId, setShowQuizResult]);

  const handleSelectAnswer = useCallback((optionId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [currentQuestion]: optionId }));
  }, [currentQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, quizQuestions.length]);

  const handleSubmitQuiz = useCallback(async () => {
    if (!quizSessionId) return;
    setQuizLoading(true);
    try {
      const answers = quizQuestions.map((q, i) => ({
        questionId: q.questionId,
        answer: quizAnswers[i] || "",
      }));
      const res = await submitQuiz(quizSessionId, answers);
      setQuizResult({
        totalQuestions: res.totalQuestions,
        correctCount: res.correctCount,
        scorePercent: res.scorePercent,
        results: res.results,
      });
      setShowQuizResult(true);
    } catch {
      alert("채점에 실패했습니다.");
    } finally {
      setQuizLoading(false);
    }
  }, [quizSessionId, quizQuestions, quizAnswers]);

  return {
    quizStarted,
    quizLoading,
    quizSessionId,
    quizQuestions,
    currentQuestion,
    quizAnswers,
    quizResult,
    showQuizResult,
    expandedQuestion,
    handleStartQuiz,
    handleSelectAnswer,
    handleNextQuestion,
    handleSubmitQuiz,
    setShowQuizResult,
    setExpandedQuestion,
  };
}
