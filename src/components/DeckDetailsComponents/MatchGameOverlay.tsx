import { useState, useEffect, useMemo } from "react";
import { GameOverlay } from "./GameOverlay";
import { Card } from "@/types";

interface Tile {
  id: string;
  pairId: number;
  text: string;
  side: "fi" | "en";
}

interface Props {
  deckName: string;
  cards: Card[];
  onClose: () => void;
}

export const MatchGameOverlay: React.FC<Props> = ({ deckName, cards, onClose }) => {
  const pairs = useMemo(() => {
    const pool = cards.slice(0, 6);
    const tiles: Tile[] = [];
    pool.forEach((c, i) => {
      tiles.push({ id: `fi-${i}`, pairId: i, text: c.userLangCard, side: "fi" });
      tiles.push({ id: `en-${i}`, pairId: i, text: c.engCard, side: "en" });
    });
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
    return tiles;
  }, []);

  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selected, setSelected] = useState<Tile | null>(null);
  const [wrong, setWrong] = useState<{ a: string; b: string } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [start] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const complete = matched.size === pairs.length / 2;

  useEffect(() => {
    if (complete) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - start) / 1000)), 500);
    return () => clearInterval(t);
  }, [complete, start]);

  const click = (tile: Tile) => {
    if (matched.has(tile.pairId) || wrong) return;
    if (!selected) { setSelected(tile); return; }
    if (selected.id === tile.id) { setSelected(null); return; }

    setAttempts(a => a + 1);
    if (selected.pairId === tile.pairId && selected.side !== tile.side) {
      setMatched(prev => { const n = new Set(prev); n.add(tile.pairId); return n; });
      setSelected(null);
    } else {
      setWrong({ a: selected.id, b: tile.id });
      setTimeout(() => { setWrong(null); setSelected(null); }, 600);
    }
  };

  const accuracy = attempts > 0 ? Math.round((pairs.length / 2) / attempts * 100) : 100;
  const progress = (matched.size / (pairs.length / 2)) * 100;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <GameOverlay
      title="Match"
      deckName={deckName}
      onClose={onClose}
      progress={progress}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <div className="tk-eyebrow">Time</div>
              <div className="tk-mono" style={{ fontSize: 16, color: "var(--tk-ink)" }}>{fmt(elapsed)}</div>
            </div>
            <div>
              <div className="tk-eyebrow">Matched</div>
              <div className="tk-mono" style={{ fontSize: 16 }}>{matched.size} / {pairs.length / 2}</div>
            </div>
            <div>
              <div className="tk-eyebrow">Accuracy</div>
              <div className="tk-mono" style={{ fontSize: 16 }}>{accuracy}%</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--tk-ink-4)", fontFamily: "'IBM Plex Mono', Menlo, monospace", letterSpacing: "0.08em" }}>
            TAP TO PAIR
          </div>
        </div>
      }
    >
      {complete ? (
        <div className="mg-done">
          <div className="tk-eyebrow" style={{ color: "var(--tk-accent-deep)", marginBottom: 10 }}>All paired</div>
          <div style={{ fontSize: 42, fontWeight: 500, marginBottom: 18 }}>Hyvin tehty.</div>
          <div style={{ display: "flex", gap: 48, justifyContent: "center", marginBottom: 28 }}>
            <div>
              <div className="tk-eyebrow">Time</div>
              <div style={{ fontSize: 32, fontWeight: 500 }}>{fmt(elapsed)}</div>
            </div>
            <div>
              <div className="tk-eyebrow">Accuracy</div>
              <div style={{ fontSize: 32, fontWeight: 500 }}>{accuracy}%</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="tk-btn tk-btn-ghost" onClick={onClose}>Back to deck</button>
          </div>
        </div>
      ) : (
        <div className="mg-grid">
          {pairs.map(t => {
            const isMatched  = matched.has(t.pairId);
            const isSelected = selected?.id === t.id;
            const isWrong    = !!wrong && (wrong.a === t.id || wrong.b === t.id);
            return (
              <button
                key={t.id}
                className="mg-tile"
                onClick={() => click(t)}
                data-side={t.side}
                data-state={isMatched ? "matched" : isWrong ? "wrong" : isSelected ? "selected" : "idle"}
                disabled={isMatched}
              >
                <div className="mg-tile-side">{t.side === "fi" ? "FI" : "EN"}</div>
                <div className="mg-tile-text">{t.text}</div>
              </button>
            );
          })}
        </div>
      )}
    </GameOverlay>
  );
};
