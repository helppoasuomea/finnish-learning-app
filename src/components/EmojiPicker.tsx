import { useEffect, useRef, useState } from "react";

const EMOJIS = [
  // Study
  "📚", "📖", "📝", "✏️", "🎓", "💡", "💬", "🗣️", "🔤", "📌", "🧠", "🗒️",
  // Flags
  "🇫🇮", "🇯🇵", "🇪🇸", "🇩🇪", "🇫🇷", "🇰🇷", "🇨🇳", "🇻🇳", "🇮🇹", "🇵🇹", "🇬🇷", "🇸🇪", "🇳🇴", "🇩🇰", "🇪🇪", "🇧🇷",
  // Vibes
  "☕", "🌿", "🌸", "✨", "🌙", "⭐", "🌊", "🌺", "🍂", "🌱", "🌼", "🎵", "🎨", "🎭", "🏡", "🌈",
  // Fun
  "🎯", "💎", "🗺️", "📜", "🧩", "🏆", "🔮", "🌍", "🦋", "🎲", "🦊", "🐻",
];

interface Props {
  value?: string;
  onChange: (emoji: string) => void;
}

export const EmojiPicker: React.FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handlePick = (emoji: string) => {
    onChange(emoji);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6 }}>
      <button
        type="button"
        className="ep-trigger"
        onClick={() => setOpen(v => !v)}
        title="Choose an emoji"
      >
        {value ? (
          <span className="ep-trigger-emoji">{value}</span>
        ) : (
          <span className="ep-trigger-placeholder">＋ emoji</span>
        )}
      </button>
      {value && (
        <button type="button" className="ep-clear" onClick={handleClear} title="Remove emoji">×</button>
      )}

      {open && (
        <div className="ep-popover">
          <div className="ep-grid">
            {EMOJIS.map(e => (
              <button
                key={e}
                type="button"
                className={`ep-emoji-btn ${value === e ? "is-selected" : ""}`}
                onClick={() => handlePick(e)}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
