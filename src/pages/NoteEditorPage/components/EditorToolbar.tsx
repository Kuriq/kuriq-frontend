import { Bold, Italic, List, ListOrdered, Code, Link, ChevronDown, Sparkles } from "lucide-react";

interface EditorToolbarProps {
  onAiOrganize: () => void;
  disabled: boolean;
}

export function EditorToolbar({ onAiOrganize, disabled }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-2 px-2">
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors font-bold"
          title="Bold"
          style={{ color: "#777777" }}
        >
          <Bold size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors italic"
          title="Italic"
          style={{ color: "#777777" }}
        >
          <Italic size={16} />
        </button>
        <div className="w-px h-6 bg-[#E5E0D8]" />
        <button
          className="h-8 px-3 flex items-center gap-1 rounded hover:bg-white transition-colors text-sm"
          style={{ color: "#777777" }}
        >
          <span>제목</span>
          <ChevronDown size={14} />
        </button>
        <div className="w-px h-6 bg-[#E5E0D8]" />
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
          title="Bullet list"
          style={{ color: "#777777" }}
        >
          <List size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
          title="Numbered list"
          style={{ color: "#777777" }}
        >
          <ListOrdered size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
          title="Code block"
          style={{ color: "#777777" }}
        >
          <Code size={16} />
        </button>
        <button
          className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
          title="Link"
          style={{ color: "#777777" }}
        >
          <Link size={16} />
        </button>
      </div>

      <button
        onClick={onAiOrganize}
        disabled={disabled}
        className="h-9 px-4 flex items-center gap-2 rounded-lg border-2 font-medium text-sm transition-colors disabled:opacity-40"
        style={{
          borderColor: "#3B6B4A",
          color: "#3B6B4A",
          backgroundColor: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#E8F0EA";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <Sparkles size={16} />
        <span>AI 정리</span>
      </button>
    </div>
  );
}
