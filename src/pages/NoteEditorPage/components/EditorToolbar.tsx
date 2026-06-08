import { Bold, Italic, List, ListOrdered, Code, Link, ChevronDown } from "lucide-react";

interface EditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onHeading: (level: string) => void;
  onBulletList: () => void;
  onNumberedList: () => void;
  onCodeBlock: () => void;
  onLink: () => void;
}

export function EditorToolbar({
  onBold,
  onItalic,
  onHeading,
  onBulletList,
  onNumberedList,
  onCodeBlock,
  onLink,
}: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-2 px-2">
      <button
        onClick={onBold}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors font-bold"
        title="Bold"
        style={{ color: "#777777" }}
      >
        <Bold size={16} />
      </button>
      <button
        onClick={onItalic}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors italic"
        title="Italic"
        style={{ color: "#777777" }}
      >
        <Italic size={16} />
      </button>
      <div className="w-px h-6 bg-[#E5E0D8]" />
      <div className="relative group">
        <button
          className="h-8 px-3 flex items-center gap-1 rounded hover:bg-white transition-colors text-sm"
          style={{ color: "#777777" }}
        >
          <span>제목</span>
          <ChevronDown size={14} />
        </button>
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#E5E0D8] rounded-lg shadow-lg py-1 min-w-[120px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <button
            onClick={() => onHeading("h1")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-[#F8F6F1] transition-colors"
            style={{ color: "#2C2C2C" }}
          >
            제목 1
          </button>
          <button
            onClick={() => onHeading("h2")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-[#F8F6F1] transition-colors"
            style={{ color: "#2C2C2C" }}
          >
            제목 2
          </button>
          <button
            onClick={() => onHeading("h3")}
            className="w-full px-3 py-2 text-left text-sm hover:bg-[#F8F6F1] transition-colors"
            style={{ color: "#2C2C2C" }}
          >
            제목 3
          </button>
        </div>
      </div>
      <div className="w-px h-6 bg-[#E5E0D8]" />
      <button
        onClick={onBulletList}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
        title="Bullet list"
        style={{ color: "#777777" }}
      >
        <List size={16} />
      </button>
      <button
        onClick={onNumberedList}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
        title="Numbered list"
        style={{ color: "#777777" }}
      >
        <ListOrdered size={16} />
      </button>
      <button
        onClick={onCodeBlock}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
        title="Code block"
        style={{ color: "#777777" }}
      >
        <Code size={16} />
      </button>
      <button
        onClick={onLink}
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-white transition-colors"
        title="Link"
        style={{ color: "#777777" }}
      >
        <Link size={16} />
      </button>
    </div>
  );
}
