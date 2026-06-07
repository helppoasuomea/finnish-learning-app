import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { X, RotateCcw, Volume2, Clock, ArrowRight, SkipForward } from "lucide-react";
import { Card } from "@/types";
import { enqueue, dequeue, getPendingCount, type PrevSnapshot } from "@/utils/reviewAnswerQueue";
import {
  type Rating,
  type DeckCard,
  phaseOf,
  projectIntervals,
  gradePhaseTransition,
  relativeTime,
  deriveCardState,
} from "@/utils/srs";

const LEECH_THRESHOLD = 6;

// ── Strength strips (4 dots: meaning / listen / contrast / produce) ───────────

function StrengthStrips({ card }: { card: Partial<Card> }) {
  // Approximate strength from stability: 0→25→50→75→100 as stability grows
  const stab = card.stability ?? card.reviewInterval ?? 0;
  const reps  = card.reps ?? card.cardScore ?? 0;
  if (reps === 0) return null;
  const meaningStrength = Math.min(4, Math.floor(stab / 7));
  const dims = [
    { key: "meaning",  val: meaningStrength,                    title: "Meaning recall" },
    { key: "listen",   val: 0,                                  title: "Listening (not yet tested)" },
    { key: "contrast", val: (card as any).confusionPartnerId ? Math.min(2, meaningStrength) : 0, title: "Contrast" },
    { key: "produce",  val: 0,                                  title: "Production (not yet tested)" },
  ];
  return (
    <div className="rvs-strength" title="Word strength (meaning · listen · contrast · produce)">
      {dims.map(d => (
        <div key={d.key} className="rvs-strength-dim" title={d.title}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`rvs-strength-dot ${i < d.val ? "is-on" : ""}`} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ── Leech rescue sheet ────────────────────────────────────────────────────────

const LEECH_ACTIONS = [
  { id: "contrast", label: "Add a contrast pair", desc: "recommended" },
  { id: "edit",     label: "Edit the card — add a clearer note", desc: "" },
  { id: "rest",     label: "Rest this card for two weeks", desc: "" },
  { id: "suspend",  label: "Suspend it — I'll come back to it", desc: "" },
] as const;

function LeechRescueSheet({
  card,
  onAction,
  onSkip,
}: {
  card: DeckCard;
  onAction: (action: string) => void;
  onSkip: () => void;
}) {
  const lapses = card.lapses ?? 0;
  const hasPartner = !!(card as any).confusionPartnerId;
  return (
    <div className="rvs-leech-overlay">
      <div className="rvs-leech">
        <div className="rvs-leech-title">This word needs a different shape.</div>
        <div className="rvs-leech-body">
          <strong>{card.userLangCard}</strong> has lapsed {lapses} times.{" "}
          {hasPartner
            ? "Looking at your history, you might be confusing it with a similar word."
            : "That usually means the card is ambiguous, not that you can't learn it."
          }
        </div>
        <div className="rvs-leech-actions">
          {LEECH_ACTIONS.map(a => (
            <button key={a.id} className="rvs-leech-action" onClick={() => onAction(a.id)}>
              <span className="rvs-leech-action-label">{a.label}</span>
              {a.id === "contrast" && hasPartner && (
                <span className="rvs-leech-rec">recommended</span>
              )}
            </button>
          ))}
        </div>
        <button className="rvs-leech-skip" onClick={onSkip}>Skip for now</button>
      </div>
    </div>
  );
}

function kindDotColor(kind: string | undefined): string {
  switch (kind) {
    case "sentence": return "var(--tk-tag-sky, #8AA0B0)";
    case "cloze":    return "var(--tk-tag-plum, #A07D8E)";
    case "grammar":  return "var(--tk-tag-clay, #C89B7C)";
    default:         return "var(--tk-accent)";
  }
}

function GrammarPrompt({ text }: { text: string }) {
  const colonIdx = text.indexOf(": ");
  if (colonIdx === -1) {
    return <div className="rvs-card-fi">{text}</div>;
  }
  const label = text.slice(0, colonIdx + 2);
  const target = text.slice(colonIdx + 2);
  return (
    <div className="rvs-card-fi">
      <span style={{ color: "var(--tk-ink-3)", fontWeight: 400 }}>{label}</span>
      <em style={{ fontStyle: "italic", color: "var(--tk-ink)" }}>{target}</em>
    </div>
  );
}

export const ReviewSession: React.FC<{
  queue: DeckCard[];
  onClose: () => void;
  onDone: (summary: { reviewed: number; history: { card: DeckCard; grade: Rating }[] }) => void;
}> = ({ queue, onClose, onDone }) => {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState<{ card: DeckCard; grade: Rating; prevSnapshot: PrevSnapshot }[]>([]);
  const [pendingCount, setPendingCount] = useState(() => getPendingCount());
  const [graduation, setGraduation] = useState<{
    card: DeckCard;
    from: string;
    to: string;
    pendingGrade: Rating;
  } | null>(null);
  const gradTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [leechSheet, setLeechSheet] = useState<DeckCard | null>(null);

  // Cloze state
  const [clozeInput, setClozeInput] = useState("");
  const [clozeResult, setClozeResult] = useState<"correct" | "wrong" | null>(null);
  const clozeInputRef = useRef<HTMLInputElement>(null);

  const total = queue.length;
  const current = queue[idx];
  const pct = total > 0 ? ((idx / total) * 100) : 0;
  const intervals = current ? projectIntervals(current) : { again: "", hard: "", good: "", easy: "" };
  const lastSeen = current ? relativeTime(current.lastReviewDate ?? current.lastSeenAt) : null;

  const cardKind = current?.cardKind ?? "word";

  // For cloze: split sentence by ___
  const clozeParts = cardKind === "cloze" ? (current?.userLangCard ?? "").split("___") : [];
  const clozeAnswer = current?.comment ?? "";

  // Reset cloze state on card change
  useEffect(() => {
    setClozeInput("");
    setClozeResult(null);
    if (cardKind === "cloze") {
      setTimeout(() => clozeInputRef.current?.focus(), 80);
    }
  }, [idx, cardKind]);

  const commitGrade = (g: Rating, historySnapshot: { card: DeckCard; grade: Rating; prevSnapshot: PrevSnapshot }[], currentIdx: number) => {
    const card = queue[currentIdx];
    const prevSnapshot: PrevSnapshot = {
      stability: card.stability ?? null,
      ease: card.ease ?? null,
      lapses: card.lapses ?? null,
      reps: card.reps ?? null,
      lastSeenAt: card.lastSeenAt ?? null,
      dueAt: card.dueAt ?? null,
    };
    enqueue({ cardId: card._id, deckId: card.deckId, grade: g, clientTimeIso: new Date().toISOString() });
    setPendingCount(getPendingCount());
    const newHistory = [...historySnapshot, { card, grade: g, prevSnapshot }];
    if (currentIdx >= total - 1) {
      onDone({ reviewed: total, history: newHistory });
    } else {
      setHistory(newHistory);
      setIdx(currentIdx + 1);
      setRevealed(false);
    }
  };

  const grade = (g: Rating) => {
    if (!current) return;
    // Leech rescue: show sheet after "again" on cards past the lapse threshold
    if (g === "again" && (current.reps ?? 0) > 0) {
      const newLapses = (current.lapses ?? 0) + 1;
      if (newLapses >= LEECH_THRESHOLD) {
        commitGrade(g, history, idx);
        setLeechSheet(current);
        return;
      }
    }
    const transition = gradePhaseTransition(current, g);
    if (transition) {
      setGraduation({ card: current, from: phaseOf(current), to: transition, pendingGrade: g });
    } else {
      commitGrade(g, history, idx);
    }
  };

  const handleLeechAction = (action: string) => {
    if (!leechSheet) return;
    // Suspend the card if user picks 'suspend' or 'rest'
    if (action === "suspend" || action === "rest") {
      const days = action === "rest" ? 14 : 0;
      const dueAt = days > 0 ? new Date(Date.now() + days * 86400000).toISOString() : null;
      axios.post(`/review/cards/${leechSheet._id}/suspend`, {
        deckId: leechSheet.deckId,
        suspended: action === "suspend",
        ...(dueAt && { dueAt }),
      }).catch(() => {});
    }
    setLeechSheet(null);
  };

  useEffect(() => {
    if (graduation) {
      gradTimerRef.current = setTimeout(() => {
        const { pendingGrade } = graduation;
        setGraduation(null);
        commitGrade(pendingGrade, history, idx);
      }, 1600);
    }
    return () => {
      if (gradTimerRef.current) clearTimeout(gradTimerRef.current);
    };
  }, [graduation]);

  const checkCloze = () => {
    if (!clozeInput.trim()) return;
    const normalize = (s: string) => s.trim().toLowerCase().replace(/[.,!?;:]/g, "");
    const correct = normalize(clozeInput) === normalize(clozeAnswer);
    setClozeResult(correct ? "correct" : "wrong");
    setRevealed(true);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const wasDequeued = dequeue(last.card._id);
    if (!wasDequeued) {
      const base = (axios.defaults.baseURL as string ?? '').replace(/\/$/, '');
      fetch(`${base}/review/answer/${last.card._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckId: last.card.deckId, prevSnapshot: last.prevSnapshot }),
        credentials: 'include',
      }).catch(() => {});
    }
    setPendingCount(getPendingCount());
    setHistory(history.slice(0, -1));
    setIdx(idx - 1);
    setRevealed(true);
  };

  const speak = () => {
    if (!current) return;
    const utterance = new SpeechSynthesisUtterance(current.userLangCard);
    utterance.lang = "fi-FI";
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      // Cloze: Enter checks, Tab skips
      if (cardKind === "cloze") {
        if (!revealed) {
          if (e.key === "Tab") { e.preventDefault(); setRevealed(true); }
          // Enter is handled by the input's onKeyDown
        } else {
          if (e.key === "1") grade("again");
          else if (e.key === "2") grade("hard");
          else if (e.key === "3") grade("good");
          else if (e.key === "4") grade("easy");
        }
        return;
      }
      // Other card kinds
      if (e.key === " " && !revealed) {
        e.preventDefault();
        setRevealed(true);
      } else if (revealed) {
        if (e.key === "1") grade("again");
        else if (e.key === "2") grade("hard");
        else if (e.key === "3") grade("good");
        else if (e.key === "4") grade("easy");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, idx, history, graduation, cardKind, clozeInput]);

  if (!current) return null;

  const kindBadgeLabel =
    cardKind === "cloze"    ? "Cloze · Type the answer" :
    cardKind === "sentence" ? "Sentence" :
    cardKind === "grammar"  ? `Grammar · ${(current.type ?? "").replace(/\b\w/g, c => c.toUpperCase()) || "Form drill"}` :
    null;

  const reviewCount = current.reps ?? current.cardScore ?? 0;
  const lapses = current.lapses ?? 0;

  return (
    <div className="rvs-overlay">
      <div className="rvs-top">
        <div className="rvs-top-left">
          <button className="rvs-close" onClick={onClose}><X size={16} /></button>
          <div className="rvs-progress-track">
            <div className="rvs-progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="rvs-progress-text">{idx + 1} / {total}</div>
        </div>
        <div className="rvs-top-right">
          {pendingCount > 0 && (
            <span className="rvs-sync-badge" title={`${pendingCount} answer${pendingCount > 1 ? 's' : ''} pending sync`}>
              ● {pendingCount}
            </span>
          )}
          <button className="rvs-undo" onClick={undo} disabled={history.length === 0}>
            <RotateCcw size={12} /> Undo
          </button>
        </div>
      </div>

      <div className="rvs-body">
        <div className="rvs-card" key={current._id}>
          {/* Phase + deck row */}
          <div className="rvs-card-top">
            <span className="rvs-card-phase" data-phase={phaseOf(current)}>{phaseOf(current)}</span>
            <span className="rvs-card-deck">{current.deckName}</span>
            <span className="rvs-review-kind">
              {(current as any).confusionPartnerId ? "Compare" : "Recall"}
            </span>
          </div>

          {/* Kind pill (sentence / cloze / grammar only) */}
          {kindBadgeLabel && (
            <div className="rvs-kind-pill">
              <span className="rvs-kind-dot" style={{ background: kindDotColor(cardKind) }} />
              {kindBadgeLabel}
            </div>
          )}

          {/* ── Word card (default) ── */}
          {(cardKind === "word" || !cardKind) && (
            <>
              <div className="rvs-card-fi">{current.userLangCard}</div>
              <div className="rvs-card-meta">
                <button className="rvs-card-speak" onClick={speak}><Volume2 size={14} /></button>
              </div>
              {revealed && (
                <div className="rvs-card-back">
                  <div className="rvs-card-en">{current.engCard}</div>
                  {current.pronunciation && <div className="rvs-card-note">{current.pronunciation}</div>}
                </div>
              )}
            </>
          )}

          {/* ── Sentence card ── */}
          {cardKind === "sentence" && (
            <>
              <div className="rvs-card-fi">{current.userLangCard}</div>
              <div className="rvs-speak-row">
                <button className="rvs-card-speak-lg" onClick={speak}><Volume2 size={15} /></button>
                <span className="rvs-speak-label">tap to hear</span>
              </div>
              {revealed && (
                <div className="rvs-card-back">
                  <div className="rvs-card-en">{current.engCard}</div>
                  {current.comment && <div className="rvs-card-note">{current.comment}</div>}
                </div>
              )}
            </>
          )}

          {/* ── Cloze card ── */}
          {cardKind === "cloze" && (
            <>
              <div className="rvs-cloze-sentence">
                {clozeParts.map((part, i) => (
                  <React.Fragment key={i}>
                    {part && <span className="rvs-cloze-part">{part}</span>}
                    {i < clozeParts.length - 1 && (
                      revealed ? (
                        <span className={`rvs-cloze-revealed-word${clozeResult ? ` is-${clozeResult}` : ""}`}>
                          {clozeResult === "correct" ? clozeInput : clozeAnswer}
                        </span>
                      ) : (
                        <input
                          ref={i === 0 ? clozeInputRef : undefined}
                          className="rvs-cloze-input"
                          value={clozeInput}
                          onChange={e => setClozeInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") { e.preventDefault(); checkCloze(); }
                            if (e.key === "Tab")   { e.preventDefault(); setRevealed(true); }
                          }}
                          spellCheck={false}
                          autoComplete="off"
                          size={1}
                        />
                      )
                    )}
                  </React.Fragment>
                ))}
              </div>
              {!revealed && (
                <div className="rvs-cloze-check-hint">
                  <kbd>↵</kbd> to check <span style={{ margin: "0 4px", color: "var(--tk-ink-5)" }}>·</span> <kbd>tab</kbd> to skip
                </div>
              )}
              {revealed && current.engCard && (
                <div className="rvs-card-back">
                  <div style={{ fontSize: 15, color: "var(--tk-ink-3)", fontStyle: "italic" }}>{current.engCard}</div>
                </div>
              )}
            </>
          )}

          {/* ── Grammar card ── */}
          {cardKind === "grammar" && (
            <>
              <GrammarPrompt text={current.userLangCard} />
              {revealed && (
                <div className="rvs-card-back">
                  <div className="rvs-card-en">{current.engCard}</div>
                  {current.pronunciation && <div className="rvs-card-note">{current.pronunciation}</div>}
                  {current.comment && (
                    <div className="rvs-grammar-rule">{current.comment}</div>
                  )}
                </div>
              )}
            </>
          )}

          {/* Strength strips */}
          {revealed && <StrengthStrips card={current} />}

          {/* Footnote */}
          <div className="rvs-card-footnote">
            <Clock size={11} />
            {lastSeen ? `Last seen ${lastSeen}` : "Not yet reviewed"}
            {reviewCount > 0 && <> · {reviewCount} review{reviewCount !== 1 ? "s" : ""}</>}
            {lapses > 0 && <> · {lapses} lapse{lapses !== 1 ? "s" : ""}</>}
            {deriveCardState(current) === "leech" && (
              <span className="rvs-leech-badge" title={`Lapsed ${lapses} times`}>stuck</span>
            )}
          </div>
        </div>

        {/* Below-card controls */}
        {!revealed ? (
          cardKind !== "cloze" ? (
            <>
              <button className="rvs-reveal" onClick={() => setRevealed(true)}>Show answer</button>
              <div className="rvs-reveal-hint">SPACE TO REVEAL</div>
            </>
          ) : null
        ) : (
          <div className="rvs-grade">
            {([
              { key: "again", label: "Again", n: 1 },
              { key: "hard",  label: "Hard",  n: 2 },
              { key: "good",  label: "Good",  n: 3 },
              { key: "easy",  label: "Easy",  n: 4 },
            ] as { key: Rating; label: string; n: number }[]).map(btn => (
              <button
                key={btn.key}
                className="rvs-grade-btn"
                data-grade={btn.key}
                onClick={() => grade(btn.key)}
              >
                <span className="rvs-grade-key">{btn.n}</span>
                <span className="rvs-grade-label">{btn.label}</span>
                <span className="rvs-grade-interval">{intervals[btn.key]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {leechSheet && (
        <LeechRescueSheet
          card={leechSheet}
          onAction={handleLeechAction}
          onSkip={() => setLeechSheet(null)}
        />
      )}

      {graduation && (
        <div className="rvs-grad-overlay">
          <div className="rvs-grad">
            <div className="rvs-grad-eyebrow">A word grew</div>
            <div className="rvs-grad-word">{graduation.card.userLangCard}</div>
            <div className="rvs-grad-transition">
              <div style={{ opacity: 0.45, textAlign: "center" }}>
                <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tk-ink-3)" }}>{graduation.from}</div>
              </div>
              <ArrowRight size={18} style={{ color: "var(--tk-accent)" }} />
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 10.5, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tk-accent-deep)", fontWeight: 600 }}>{graduation.to}</div>
              </div>
            </div>
            <div className="rvs-grad-line">
              {graduation.to === "sprout" && "It took, and it's reaching for light. We'll come back to it tomorrow."}
              {graduation.to === "sapling" && "Its roots are holding. You won't see this one as often now."}
              {graduation.to === "tree" && "This word is yours. It joins the canopy of things you know for good."}
            </div>
            <div className="rvs-grad-cont">Continuing in a moment…</div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ReviewDone: React.FC<{
  summary: { reviewed: number; history: { card: DeckCard; grade: Rating }[] };
  onClose: () => void;
  onContinue: () => void;
}> = ({ summary, onClose, onContinue }) => {
  const { reviewed, history } = summary;
  const again = history.filter(h => h.grade === "again").length;
  const correct = reviewed - again;
  const accuracy = reviewed > 0 ? Math.round((correct / reviewed) * 100) : 0;

  return (
    <div className="rvs-overlay">
      <div className="rvs-top">
        <div className="rvs-top-left">
          <button className="rvs-close" onClick={onClose}><X size={16} /></button>
        </div>
      </div>
      <div className="rvs-body">
        <div className="rvs-done">
          <div className="rvs-done-seal" style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--tk-accent)", color: "var(--tk-paper)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 24px" }}>✓</div>
          <h1 className="rvs-done-title">Quiet work done.</h1>
          <p className="rvs-done-sub">You finished today's review. The algorithm will bring these back when you need them.</p>
          <div className="rvs-done-grid">
            <div>
              <div className="rvs-done-grid-num">{reviewed}</div>
              <div className="rvs-done-grid-label">Reviewed</div>
            </div>
            <div>
              <div className="rvs-done-grid-num">{accuracy}<span style={{ fontSize: 16, color: "var(--tk-ink-3)" }}>%</span></div>
              <div className="rvs-done-grid-label">Accuracy</div>
            </div>
            <div>
              <div className="rvs-done-grid-num">{again}</div>
              <div className="rvs-done-grid-label">Re-shown</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="tk-btn tk-btn-ghost" onClick={onClose}>Back to Review</button>
            <button className="tk-btn tk-btn-accent" onClick={onContinue}>Study a deck</button>
          </div>
        </div>
      </div>
    </div>
  );
};
