import { useState, useMemo } from "react";
import { X, Check, Star } from "lucide-react";
import { Deck, Card } from "@/types";
import { CramConfig, CramDirection, CramStyle, CramMood } from "./CramTypes";

function cramPhase(c: Card): "seed" | "sprout" | "sapling" | "tree" {
  if (c.cardScore === 0) return "seed";
  if (c.cardScore <= 2) return "sprout";
  if (c.cardScore <= 4) return "sapling";
  return "tree";
}

function estMinutes(count: number): number {
  return Math.max(1, Math.round((count * 8) / 60));
}

interface Props {
  deck: Deck;
  onClose: () => void;
  onStart: (config: CramConfig) => void;
}

export const CramSetup: React.FC<Props> = ({ deck, onClose, onStart }) => {
  const pool = deck.cards;

  const [selected, setSelected] = useState<Set<string>>(() => new Set(pool.map(c => c._id)));
  const [direction, setDirection] = useState<CramDirection>("mixed");
  const [style, setStyle] = useState<CramStyle>("flip");
  const [countAsReview, setCountAsReview] = useState(false);
  const [loop, setLoop] = useState(true);
  const [threshold, setThreshold] = useState<1 | 2 | 3>(1);
  const [mood, setMood] = useState<CramMood>("calm");
  const [showAll, setShowAll] = useState(false);

  const selectedCards = useMemo(() => pool.filter(c => selected.has(c._id)), [selected, pool]);
  const visibleCards = showAll ? pool : pool.slice(0, 18);

  const toggleCard = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const quickPick = (which: string) => {
    let ids: string[] = [];
    if (which === "all") ids = pool.map(c => c._id);
    else if (which === "learning") ids = pool.filter(c => c.cardScore > 0 && c.cardScore < 5).map(c => c._id);
    else if (which === "favorites") ids = pool.filter(c => c.favorite).map(c => c._id);
    else if (which === "notStudied") ids = pool.filter(c => c.cardScore === 0).map(c => c._id);
    else if (which === "seeds") ids = pool.filter(c => cramPhase(c) === "seed").map(c => c._id);
    else if (which === "sprouts") ids = pool.filter(c => cramPhase(c) === "sprout").map(c => c._id);
    else if (which === "none") ids = [];
    setSelected(new Set(ids));
  };

  const handleStart = () => {
    if (selectedCards.length === 0) return;
    onStart({
      cards: selectedCards,
      direction,
      style,
      countAsReview,
      loop,
      threshold: loop ? threshold : 1,
      mood,
    });
  };

  const canStart = selectedCards.length > 0;
  const lang = deck.deckTags[0] || "FI";

  return (
    <div className="cr-setup-scrim" onClick={onClose}>
      <div className="cr-setup" onClick={e => e.stopPropagation()} data-mood={mood}>
        <div className="cr-setup-head">
          <div>
            <div className="text-eyebrow" style={{ marginBottom: 6, color: "var(--tk-persimmon)" }}>Cram</div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 30, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
              Drill <em style={{ fontStyle: "italic" }}>{deck.deckName}</em>
            </div>
            <div style={{ fontSize: 13, color: "var(--tk-ink-3)", marginTop: 6, fontStyle: "italic", fontFamily: "var(--font-display)" }}>
              Short-term focus. No penalty for running it twice.
            </div>
          </div>
          <button className="tk-icon-btn" onClick={onClose} aria-label="Close">
            <X size={15} />
          </button>
        </div>

        <div className="cr-setup-body">
          {/* Left: scope */}
          <div className="cr-col">
            <div className="cr-col-head">
              <div className="text-eyebrow">Scope</div>
              <span className="mono" style={{ fontSize: 11, color: "var(--tk-ink-3)" }}>
                {selectedCards.length} / {pool.length} selected
              </span>
            </div>

            <div className="cr-quickpicks">
              {([
                ["all", "All"],
                ["learning", "Still learning"],
                ["favorites", "★ Favorites"],
                ["notStudied", "Not studied"],
                ["seeds", "Seeds"],
                ["sprouts", "Sprouts"],
                ["none", "Clear"],
              ] as [string, string][]).map(([k, l]) => (
                <button key={k} className="cr-qp" onClick={() => quickPick(k)}>{l}</button>
              ))}
            </div>

            <div className="cr-card-list">
              {visibleCards.map(c => {
                const on = selected.has(c._id);
                const ph = cramPhase(c);
                return (
                  <button
                    key={c._id}
                    className="cr-card-row"
                    data-on={String(on)}
                    onClick={() => toggleCard(c._id)}
                  >
                    <span className="cr-check" data-on={String(on)}>
                      {on && <Check size={11} />}
                    </span>
                    <span className={`cr-phase-dot cr-ph-${ph}`} />
                    <span className="cr-row-fi">{c.userLangCard}</span>
                    <span className="cr-row-en">{c.engCard}</span>
                    {c.favorite && <Star size={11} style={{ color: "var(--tk-persimmon)" }} />}
                  </button>
                );
              })}
              {!showAll && pool.length > 18 && (
                <button className="cr-more" onClick={() => setShowAll(true)}>
                  Show {pool.length - 18} more →
                </button>
              )}
            </div>
          </div>

          {/* Right: knobs */}
          <div className="cr-col cr-col-knobs">
            <div className="cr-knob">
              <div className="cr-knob-label">Mood</div>
              <div className="cr-segset">
                {([["calm", "Calm"], ["focus", "Focus"]] as [CramMood, string][]).map(([k, l]) => (
                  <button key={k} className="cr-seg" data-on={String(mood === k)} onClick={() => setMood(k)}>{l}</button>
                ))}
              </div>
              <div className="cr-knob-help">
                {mood === "calm" ? "Quiet paper, matcha accent." : "Exam-room black, persimmon pressure."}
              </div>
            </div>

            <div className="cr-knob">
              <div className="cr-knob-label">Direction</div>
              <div className="cr-segset">
                {([
                  ["fi-en", `${lang} → EN`],
                  ["en-fi", `EN → ${lang}`],
                  ["mixed", "Mixed"],
                ] as [CramDirection, string][]).map(([k, l]) => (
                  <button key={k} className="cr-seg" data-on={String(direction === k)} onClick={() => setDirection(k)}>{l}</button>
                ))}
              </div>
            </div>

            <div className="cr-knob">
              <div className="cr-knob-label">Answer style</div>
              <div className="cr-segset cr-segset-4">
                {([
                  ["flip", "Flip"],
                  ["mc", "Choose"],
                  ["type", "Type"],
                  ["mixed", "Mix"],
                ] as [CramStyle, string][]).map(([k, l]) => (
                  <button key={k} className="cr-seg" data-on={String(style === k)} onClick={() => setStyle(k)}>{l}</button>
                ))}
              </div>
              <div className="cr-knob-help">
                {style === "flip" && "Fastest. You self-grade after the reveal."}
                {style === "mc" && "Recognize from four options."}
                {style === "type" && "Produce it — hardest, deepest."}
                {style === "mixed" && "Rotates through all three."}
              </div>
            </div>

            <div className="cr-knob">
              <label className="cr-check-row">
                <input type="checkbox" checked={loop} onChange={e => setLoop(e.target.checked)} />
                <span>
                  <span className="cr-check-label">Loop until known</span>
                  <span className="cr-check-help">Missed cards come back in this session.</span>
                </span>
              </label>
              {loop && (
                <div className="cr-threshold">
                  <span className="cr-threshold-label">Correct in a row to clear</span>
                  <div className="cr-segset cr-segset-3">
                    {([1, 2, 3] as (1 | 2 | 3)[]).map(n => (
                      <button key={n} className="cr-seg" data-on={String(threshold === n)} onClick={() => setThreshold(n)}>{n}×</button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="cr-knob cr-toggle-row">
              <label className="cr-toggle">
                <input type="checkbox" checked={countAsReview} onChange={e => setCountAsReview(e.target.checked)} />
                <span className="cr-toggle-track"><span className="cr-toggle-thumb" /></span>
                <span className="cr-toggle-copy">
                  <span className="cr-check-label">Count these as real reviews</span>
                  <span className="cr-check-help">
                    {countAsReview
                      ? "Grades will update each card's SRS schedule."
                      : "Cram won't touch your review schedule. Recommended."}
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="cr-setup-foot">
          <div className="cr-foot-stats">
            <span className="mono">{selectedCards.length} cards</span>
            <span style={{ color: "var(--tk-ink-4)" }}>·</span>
            <span style={{ fontStyle: "italic", fontFamily: "var(--font-display)" }}>
              ~{estMinutes(selectedCards.length)} min{loop ? " (plus re-sees)" : ""}
            </span>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="tk-btn tk-btn-ghost" onClick={onClose}>Cancel</button>
            <button
              className={`tk-btn ${mood === "focus" ? "cr-btn-focus" : "tk-btn-accent"}`}
              disabled={!canStart}
              onClick={handleStart}
              style={!canStart ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
            >
              {canStart ? <>Start cramming →</> : "Pick at least one card"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
