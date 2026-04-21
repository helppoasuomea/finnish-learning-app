import { useEffect, useRef, useState } from "react";
import { X, RotateCcw, Volume2, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/types";
import { enqueue, dequeue, getPendingCount, type PrevSnapshot } from "@/utils/reviewAnswerQueue";

type Rating = "again" | "hard" | "good" | "easy";
type DeckCard = Card & { deckId: string; deckName: string };

function phaseOf(card: DeckCard): string {
  const reps = card.reps ?? card.cardScore;
  const stability = card.stability ?? card.reviewInterval ?? 1;
  if (reps === 0) return "seed";
  if (stability < 7) return "sprout";
  if (stability < 90) return "sapling";
  return "tree";
}

function projectIntervals(card: DeckCard): { again: string; hard: string; good: string; easy: string } {
  const reps = card.reps ?? card.cardScore;
  const stability = Math.max(1, card.stability ?? card.reviewInterval ?? 1);
  const ease = card.ease ?? card.easeFactor ?? 2.5;

  const fmt = (d: number) =>
    d < 1 / 24
      ? `${Math.round(d * 24 * 60)} min`
      : d < 1
      ? `${Math.round(d * 24)} h`
      : d < 30
      ? `${Math.round(d)} d`
      : d < 365
      ? `${(d / 30).toFixed(1)} mo`
      : `${(d / 365).toFixed(1)} y`;

  if (reps === 0) {
    return { again: "10 min", hard: "5 min", good: "1 d", easy: "4 d" };
  }
  return {
    again: "10 min",
    hard: fmt(stability * 1.2),
    good: fmt(stability * ease),
    easy: fmt(stability * ease * 1.3),
  };
}

function gradePhaseTransition(card: DeckCard, grade: Rating): string | null {
  if (grade === "again" || grade === "hard") return null;
  const phase = phaseOf(card);
  const stability = Math.max(1, card.stability ?? card.reviewInterval ?? 1);
  const ease = card.ease ?? card.easeFactor ?? 2.5;
  const mult = grade === "easy" ? ease * 1.3 : ease;
  const nextStab = stability * mult;
  if (phase === "seed") return "sprout";
  if (phase === "sprout" && nextStab >= 7) return "sapling";
  if (phase === "sapling" && nextStab >= 90) return "tree";
  return null;
}

function relativeTime(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const days = Math.round((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days}d ago`;
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

  const total = queue.length;
  const current = queue[idx];
  const pct = total > 0 ? ((idx / total) * 100) : 0;
  const intervals = current ? projectIntervals(current) : { again: "", hard: "", good: "", easy: "" };
  const lastSeen = current ? relativeTime(current.lastReviewDate) : null;

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
    const transition = gradePhaseTransition(current, g);
    if (transition) {
      setGraduation({ card: current, from: phaseOf(current), to: transition, pendingGrade: g });
    } else {
      commitGrade(g, history, idx);
    }
  };

  useEffect(() => {
    if (graduation) {
      gradTimerRef.current = setTimeout(() => {
        const { pendingGrade } = graduation;
        setGraduation(null);
        commitGrade(pendingGrade, history, idx);
      }, 2800);
    }
    return () => {
      if (gradTimerRef.current) clearTimeout(gradTimerRef.current);
    };
  }, [graduation]);

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    const wasDequeued = dequeue(last.card._id);
    if (!wasDequeued) {
      // Already sent to server — ask it to restore the exact pre-grade state
      fetch(`/api/review/answer/${last.card._id}`, {
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
      } else if (e.key === " " && !revealed) {
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
  }, [revealed, idx, history, graduation]);

  if (!current) return null;

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
          <div className="rvs-card-top">
            <span className="rvs-card-phase" data-phase={phaseOf(current)}>{phaseOf(current)}</span>
            <span className="rvs-card-deck">{current.deckName}</span>
          </div>
          <div className="rvs-card-fi">{current.userLangCard}</div>
          <div className="rvs-card-meta">
            <button className="rvs-card-speak" onClick={speak}><Volume2 size={14} /></button>
          </div>
          {revealed && (
            <div className="rvs-card-back">
              <div className="rvs-card-en">{current.engCard}</div>
            </div>
          )}
          <div className="rvs-card-footnote">
            <Clock size={11} />
            {lastSeen ? `Last seen ${lastSeen}` : "Not yet reviewed"}
            {current.cardScore > 0 && <> · {current.cardScore} review{current.cardScore !== 1 ? "s" : ""}</>}
          </div>
        </div>

        {!revealed ? (
          <>
            <button className="rvs-reveal" onClick={() => setRevealed(true)}>Show answer</button>
            <div className="rvs-reveal-hint">SPACE TO REVEAL</div>
          </>
        ) : (
          <div className="rvs-grade">
            {([
              { key: "again", label: "Again", n: 1 },
              { key: "hard", label: "Hard", n: 2 },
              { key: "good", label: "Good", n: 3 },
              { key: "easy", label: "Easy", n: 4 },
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
