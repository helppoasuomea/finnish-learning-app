import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, BookOpen, Pencil } from "lucide-react";
import { Card } from "@/types";
import { WarmUpTray } from "./WarmUpTray";
import { FlashcardGameOverlay } from "./FlashcardGameOverlay";
import { MatchGameOverlay } from "./MatchGameOverlay";
import { TypeItGameOverlay } from "./TypeItGameOverlay";

type GameKey = "flashcards" | "match" | "type";

interface Props {
  deckId: string;
  deckName: string;
  cards: Card[];
  stillLearning: Card[];
  notStudied: Card[];
  completed: Card[];
  onEditDeck: () => void;
}

const PHASE_ROWS = [
  { key: "seed",    label: "Seed",    color: "var(--ph-seed)",    desc: "Never reviewed" },
  { key: "sprout",  label: "Sprout",  color: "var(--ph-sprout)",  desc: "Still unreliable" },
  { key: "sapling", label: "Sapling", color: "var(--ph-sapling)", desc: "Settling in" },
  { key: "tree",    label: "Tree",    color: "var(--ph-tree)",    desc: "Known for good" },
];

function phaseOf(card: Card): string {
  const reps = (card as any).reps ?? card.cardScore;
  const stability = (card as any).stability ?? card.reviewInterval ?? 1;
  if (reps === 0) return "seed";
  if (stability < 7)  return "sprout";
  if (stability < 90) return "sapling";
  return "tree";
}

function isDue(card: Card): boolean {
  const dueAt = (card as any).dueAt ?? card.nextReviewDate;
  if (dueAt) return new Date(dueAt) <= new Date();
  return (card as any).reps === 0 || card.cardScore < 5;
}

export const DeckOverview: React.FC<Props> = ({ deckId, deckName, cards, stillLearning, notStudied, completed, onEditDeck }) => {
  const [game, setGame] = useState<GameKey | null>(null);
  const navigate = useNavigate();

  const phases = { seed: 0, sprout: 0, sapling: 0, tree: 0 } as Record<string, number>;
  cards.forEach(c => { phases[phaseOf(c)]++; });
  const total = cards.length || 1;

  const recentlyLearning = stillLearning.slice(0, 5);
  const readyToPlant     = notStudied.slice(0, 5);
  const dueCount = cards.filter(isDue).length;
  const nextSessionCount = Math.min(20, dueCount || phases.seed + phases.sprout);

  return (
    <div className="dd-overview-grid">
      {/* Main column */}
      <div>
        {/* Growth card */}
        <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 16, padding: 28, marginBottom: 20 }}>
          <div className="tk-eyebrow" style={{ marginBottom: 14 }}>Growth in this deck</div>
          <div className="dd-growth-bar">
            {PHASE_ROWS.map(r => phases[r.key] > 0 && (
              <div key={r.key} style={{ width: `${phases[r.key] / total * 100}%`, background: r.color }} title={`${r.label}: ${phases[r.key]}`} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {PHASE_ROWS.map(r => (
              <div key={r.key} className="dd-phase-col" style={{ borderLeftColor: r.color }}>
                <div className="dd-phase-count">{phases[r.key]}</div>
                <div className="dd-phase-label">{r.label}</div>
                <div className="dd-phase-desc">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <WarmUpTray onOpen={setGame} />

        {/* Needs another look */}
        {recentlyLearning.length > 0 && (
          <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div className="tk-eyebrow">Needs another look</div>
              <span className="tk-mono" style={{ fontSize: 11, color: "var(--tk-ink-3)" }}>{stillLearning.length} still learning</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {recentlyLearning.map(c => (
                <div key={c._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 4px", borderBottom: "1px solid var(--tk-rule-soft)" }}>
                  <div style={{ flex: 1, fontSize: 15, color: "var(--tk-ink)" }}>{c.userLangCard}</div>
                  <div style={{ flex: 1, fontSize: 13, color: "var(--tk-ink-3)", fontStyle: "italic" }}>{c.engCard}</div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`tl-score-dot ${c.cardScore >= i ? "is-on" : ""}`} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Seeds not yet planted */}
        {readyToPlant.length > 0 && (
          <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 16, padding: 24 }}>
            <div className="tk-eyebrow" style={{ marginBottom: 12 }}>Seeds, not yet planted</div>
            <div style={{ fontStyle: "italic", color: "var(--tk-ink-2)", fontSize: 14, marginBottom: 14 }}>
              {notStudied.length} {notStudied.length === 1 ? "card has" : "cards have"} never been reviewed.
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {readyToPlant.map(c => (
                <span key={c._id} style={{ display: "inline-block", padding: "5px 11px", background: "var(--tk-paper-edge)", border: "1px solid var(--tk-rule)", borderRadius: 100, fontSize: 13, color: "var(--tk-ink-2)" }}>
                  {c.userLangCard}
                </span>
              ))}
              {notStudied.length > readyToPlant.length && (
                <span className="tk-mono" style={{ display: "inline-block", padding: "5px 11px", fontSize: 12, color: "var(--tk-ink-3)" }}>
                  + {notStudied.length - readyToPlant.length} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <div>
        <div style={{ background: "var(--tk-accent-wash)", border: "1px solid var(--tk-accent-soft)", borderRadius: 16, padding: 22, marginBottom: 16 }}>
          <div className="tk-eyebrow" style={{ color: "var(--tk-accent-deep)", marginBottom: 10 }}>Next session</div>
          <div style={{ fontSize: 34, fontWeight: 500, color: "var(--tk-ink)", lineHeight: 1 }}>{nextSessionCount}</div>
          <div style={{ fontSize: 13, color: "var(--tk-ink-3)", marginTop: 6 }}>
            cards ready · ~{Math.round(nextSessionCount * 0.3)} min
          </div>
          <button
            className="tk-btn tk-btn-accent"
            style={{ width: "100%", marginTop: 16, justifyContent: "center" }}
            onClick={() => navigate(`/review`)}
          >
            <Play size={13} /> Start review
          </button>
          <div style={{ fontSize: 11, color: "var(--tk-ink-3)", textAlign: "center", marginTop: 10, fontStyle: "italic" }}>
            Due cards first, then anything fragile. Counts toward your streak.
          </div>
        </div>

        <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 16, padding: 20 }}>
          <div className="tk-eyebrow" style={{ marginBottom: 12 }}>Quick actions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" style={{ justifyContent: "flex-start", width: "100%" }}
              onClick={() => navigate(`/decks/${deckId}`)}>
              <BookOpen size={13} /> Browse all terms
            </button>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" style={{ justifyContent: "flex-start", width: "100%" }}
              onClick={onEditDeck}>
              <Pencil size={13} /> Edit deck details
            </button>
          </div>
        </div>
      </div>

      {/* Game overlays */}
      {game === "flashcards" && <FlashcardGameOverlay deckName={deckName} cards={cards} onClose={() => setGame(null)} />}
      {game === "match"      && <MatchGameOverlay      deckName={deckName} cards={cards} onClose={() => setGame(null)} />}
      {game === "type"       && <TypeItGameOverlay     deckName={deckName} cards={cards} onClose={() => setGame(null)} />}
    </div>
  );
};
