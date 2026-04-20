type GameKey = "flashcards" | "match" | "type";

interface Props {
  onOpen: (game: GameKey) => void;
}

const FlashcardsGlyph = () => (
  <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
    <rect x="2"  y="5" width="22" height="24" rx="3" fill="var(--tk-paper-edge)" stroke="var(--tk-rule)" />
    <rect x="10" y="2" width="22" height="24" rx="3" fill="var(--tk-card)" stroke="var(--tk-ink-4)" />
    <line x1="14" y1="10" x2="28" y2="10" stroke="var(--tk-ink-3)" strokeWidth="1" />
    <line x1="14" y1="14" x2="24" y2="14" stroke="var(--tk-ink-4)" strokeWidth="1" />
  </svg>
);

const MatchGlyph = () => (
  <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
    <rect x="2"  y="4"  width="14" height="10" rx="2" fill="var(--tk-accent-wash)" stroke="var(--tk-accent)" />
    <rect x="24" y="4"  width="14" height="10" rx="2" fill="var(--tk-card)" stroke="var(--tk-ink-4)" />
    <rect x="2"  y="18" width="14" height="10" rx="2" fill="var(--tk-card)" stroke="var(--tk-ink-4)" />
    <rect x="24" y="18" width="14" height="10" rx="2" fill="var(--tk-accent-wash)" stroke="var(--tk-accent)" />
    <path d="M16 9 L24 9" stroke="var(--tk-accent)" strokeWidth="1.2" strokeDasharray="2 2" />
    <path d="M16 23 L24 23" stroke="var(--tk-accent)" strokeWidth="1.2" strokeDasharray="2 2" />
  </svg>
);

const TypeGlyph = () => (
  <svg width="40" height="32" viewBox="0 0 40 32" fill="none">
    <rect x="3" y="8" width="34" height="16" rx="2" fill="var(--tk-card)" stroke="var(--tk-ink-4)" />
    <line x1="8"  y1="16" x2="16" y2="16" stroke="var(--tk-ink)" strokeWidth="1.5" />
    <line x1="18" y1="16" x2="24" y2="16" stroke="var(--tk-ink)" strokeWidth="1.5" />
    <line x1="26" y1="16" x2="32" y2="16" stroke="var(--tk-ink-4)" strokeWidth="1.5" strokeDasharray="2 2" />
    <rect x="27" y="11" width="1.5" height="10" fill="var(--tk-accent)">
      <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite" />
    </rect>
  </svg>
);

const GAMES: { key: GameKey; label: string; line: string; time: string; Glyph: () => JSX.Element }[] = [
  { key: "flashcards", label: "Flashcards", line: "Flip through at your own pace.", time: "no timer", Glyph: FlashcardsGlyph },
  { key: "match",      label: "Match",      line: "Pair the word with its meaning.", time: "~2 min",  Glyph: MatchGlyph },
  { key: "type",       label: "Type it",    line: "See the meaning, type the word.", time: "~3 min", Glyph: TypeGlyph },
];

export const WarmUpTray: React.FC<Props> = ({ onOpen }) => (
  <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 14 }}>
      <div className="tk-eyebrow">Warm up · optional practice</div>
      <span style={{ fontSize: 11.5, color: "var(--tk-ink-3)", fontStyle: "italic" }}>
        Doesn't affect your review schedule.
      </span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
      {GAMES.map(g => (
        <button
          key={g.key}
          onClick={() => onOpen(g.key)}
          className="wu-card"
          style={{
            textAlign: "left", padding: 18,
            background: "var(--tk-paper)", border: "1px solid var(--tk-rule)",
            borderRadius: 8, cursor: "pointer",
            display: "flex", flexDirection: "column", gap: 10, minHeight: 128,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <g.Glyph />
            <span className="tk-mono" style={{ fontSize: 10.5, color: "var(--tk-ink-3)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{g.time}</span>
          </div>
          <div>
            <div style={{ fontSize: 15, color: "var(--tk-ink)", fontWeight: 500, marginBottom: 3 }}>{g.label}</div>
            <div style={{ fontSize: 12.5, color: "var(--tk-ink-3)", fontStyle: "italic", lineHeight: 1.45 }}>{g.line}</div>
          </div>
        </button>
      ))}
    </div>
  </div>
);
