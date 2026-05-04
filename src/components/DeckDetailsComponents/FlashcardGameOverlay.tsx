import { useState, useEffect } from "react";
import { GameOverlay } from "./GameOverlay";
import { ArrowLeft, ArrowRight, Shuffle, Star } from "lucide-react";
import { Card } from "@/types";

interface Props {
  deckName: string;
  cards: Card[];
  onClose: () => void;
}

export const FlashcardGameOverlay: React.FC<Props> = ({ deckName, cards, onClose }) => {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [favs, setFavs] = useState<Set<string>>(new Set());
  const [direction, setDirection] = useState<"fi-en" | "en-fi">("fi-en");

  const card = cards[idx];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === " ") { e.preventDefault(); setFlipped(f => !f); }
      if (e.key === "ArrowRight") { setIdx(i => (i + 1) % cards.length); setFlipped(false); }
      if (e.key === "ArrowLeft")  { setIdx(i => (i - 1 + cards.length) % cards.length); setFlipped(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cards.length]);

  const next = () => { setIdx(i => (i + 1) % cards.length); setFlipped(false); };
  const prev = () => { setIdx(i => (i - 1 + cards.length) % cards.length); setFlipped(false); };

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    const n = new Set(favs);
    favs.has(card._id) ? n.delete(card._id) : n.add(card._id);
    setFavs(n);
  };

  const front = direction === "fi-en" ? card.userLangCard : card.engCard;
  const back  = direction === "fi-en" ? card.engCard : card.userLangCard;
  const showIpa = direction === "fi-en" && card.pronunciation;

  return (
    <GameOverlay
      title="Flashcards"
      deckName={deckName}
      onClose={onClose}
      progress={((idx + 1) / cards.length) * 100}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setDirection(d => d === "fi-en" ? "en-fi" : "fi-en")}>
            <Shuffle size={13} />
            {direction === "fi-en" ? "FI → EN" : "EN → FI"}
          </button>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button className="fc-nav-btn" onClick={prev}><ArrowLeft size={14} /></button>
            <span className="tk-mono" style={{ fontSize: 12, color: "var(--tk-ink-3)", minWidth: 70, textAlign: "center" }}>
              {String(idx + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
            </span>
            <button className="fc-nav-btn" onClick={next}><ArrowRight size={14} /></button>
          </div>
          <div style={{ fontSize: 11, color: "var(--tk-ink-4)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.08em" }}>
            SPACE TO FLIP
          </div>
        </div>
      }
    >
      <div className="fcg-stage">
        <div className={`fcg-card ${flipped ? "is-flipped" : ""}`} onClick={() => setFlipped(f => !f)}>
          <div className="fcg-inner">
            <div className="fcg-face">
              <div className="fcg-corner-left">{direction === "fi-en" ? (card.type || "") : "english"}</div>
              <button className="fcg-fav" onClick={toggleFav} style={{ color: favs.has(card._id) ? "var(--tk-persimmon)" : "var(--tk-ink-4)" }}>
                <Star size={16} />
              </button>
              <div className="fcg-term">{front}</div>
              {showIpa && <div className="fcg-ipa">{card.pronunciation}</div>}
              <div className="fcg-hint">click or press space</div>
            </div>
            <div className="fcg-face fcg-face-back">
              <div className="fcg-corner-left">{direction === "fi-en" ? "english" : (card.type || "")}</div>
              <div className="fcg-term-back">{back}</div>
            </div>
          </div>
        </div>
      </div>
    </GameOverlay>
  );
};
