import { useState, useEffect, useMemo, useRef } from "react";
import { X } from "lucide-react";
import { Card } from "@/types";
import { enqueue as enqueueReview } from "@/utils/reviewAnswerQueue";
import { CramConfig, CramQueueEntry, CramHistoryRow, CramSummary } from "./CramTypes";

function cramPhase(c: Card): "seed" | "sprout" | "sapling" | "tree" {
  if (c.cardScore === 0) return "seed";
  if (c.cardScore <= 2) return "sprout";
  if (c.cardScore <= 4) return "sapling";
  return "tree";
}

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = new Array(b.length + 1), v1 = new Array(b.length + 1);
  for (let i = 0; i <= b.length; i++) v0[i] = i;
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      const cost = a[i] === b[j] ? 0 : 1;
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost);
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

/**
 * Returns a random re-insertion index so cards don't cycle predictably.
 * "got"  → latter 50 % of queue (spaced well apart).
 * "miss" → middle third (comes back soon enough to reinforce, but not immediately).
 */
function reinsertPos(queueLen: number, mode: "got" | "miss"): number {
  if (queueLen <= 0) return 0;
  if (queueLen === 1) return 1;
  if (mode === "got") {
    const lo = Math.max(1, Math.floor(queueLen * 0.5));
    return lo + Math.floor(Math.random() * (queueLen - lo + 1));
  }
  const lo = Math.max(1, Math.floor(queueLen * 0.3));
  const hi = Math.max(lo, Math.min(queueLen, Math.floor(queueLen * 0.7)));
  return lo + Math.floor(Math.random() * (hi - lo + 1));
}

function crShuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface Props {
  deck: { _id: string; deckName: string; cards: Card[]; deckTags: string[] };
  config: CramConfig;
  onExit: () => void;
  onComplete: (summary: CramSummary) => void;
}

export const CramSession: React.FC<Props> = ({ deck, config, onExit, onComplete }) => {
  const { cards: initialCards, direction, style, countAsReview, loop, threshold, mood } = config;

  const [queue, setQueue] = useState<CramQueueEntry[]>(() =>
    initialCards.map(c => ({ card: c, streak: 0, seenCount: 0, firstTry: null }))
  );
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [typedValue, setTypedValue] = useState("");
  const [typedResult, setTypedResult] = useState<"correct" | "close" | "wrong" | null>(null);
  const [mcPick, setMcPick] = useState<{ i: number; correct: boolean } | null>(null);
  const [cleared, setCleared] = useState<Set<string>>(() => new Set());
  const [history, setHistory] = useState<CramHistoryRow[]>([]);
  const [coached, setCoached] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [startTs] = useState(() => Date.now());
  const [dirForCard, setDirForCard] = useState<"fi-en" | "en-fi">("fi-en");
  const [styleForCard, setStyleForCard] = useState<"flip" | "mc" | "type">(
    style === "mixed" ? "flip" : style as "flip" | "mc" | "type"
  );
  const cardMetaRef = useRef<Record<string, { d: "fi-en" | "en-fi"; s: "flip" | "mc" | "type" }>>({});

  const current = queue[idx];
  const allDone = cleared.size === initialCards.length;

  useEffect(() => {
    if (allDone) return;
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTs) / 1000)), 500);
    return () => clearInterval(t);
  }, [allDone, startTs]);

  useEffect(() => {
    if (!current) return;
    const key = `${idx}-${current.card._id}-${current.seenCount}`;
    let meta = cardMetaRef.current[key];
    if (!meta) {
      const d = direction === "mixed"
        ? (Math.random() < 0.5 ? "fi-en" : "en-fi") as "fi-en" | "en-fi"
        : direction as "fi-en" | "en-fi";
      const s = style === "mixed"
        ? (["flip", "mc", "type"] as const)[Math.floor(Math.random() * 3)]
        : style as "flip" | "mc" | "type";
      meta = { d, s };
      cardMetaRef.current[key] = meta;
    }
    setDirForCard(meta.d);
    setStyleForCard(meta.s);
    setRevealed(false);
    setTypedValue("");
    setTypedResult(null);
    setMcPick(null);
  }, [idx, current?.card._id, current?.seenCount]);

  useEffect(() => {
    if (!allDone) return;
    const ms = Date.now() - startTs;
    const firstTryCorrect = history.filter(h => h.firstTry === "got").length;
    const uniqueCount = initialCards.length;
    const reshown = history.length - uniqueCount;
    const missedCards = initialCards.filter(c =>
      history.some(h => h.cardId === c._id && h.grade === "miss")
    );
    const accuracy = uniqueCount > 0 ? Math.round((firstTryCorrect / uniqueCount) * 100) : 100;
    const t = setTimeout(() => {
      onComplete({
        cleared: uniqueCount,
        accuracy,
        reshown: Math.max(0, reshown),
        durationMs: ms,
        durationSec: Math.floor(ms / 1000),
        missedCards,
        countAsReview,
        history,
      });
    }, 420);
    return () => clearTimeout(t);
  }, [allDone]);

  const frontText = () => !current ? "" : dirForCard === "fi-en" ? current.card.userLangCard : current.card.engCard;
  const backText = () => !current ? "" : dirForCard === "fi-en" ? current.card.engCard : current.card.userLangCard;

  const mcOptions = useMemo(() => {
    if (!current || styleForCard !== "mc") return [];
    const right = backText();
    const pool = deck.cards.filter(c => c._id !== current.card._id);
    const ph = cramPhase(current.card);
    const scored = pool.map(c => {
      const cph = cramPhase(c);
      const sameType = (c as any).type && (c as any).type === (current.card as any).type ? 2 : 0;
      const samePh = cph === ph ? 1 : 0;
      return { c, score: sameType + samePh + Math.random() * 0.5 };
    });
    scored.sort((a, b) => b.score - a.score);
    const distractors = scored.slice(0, 8).map(s =>
      dirForCard === "fi-en" ? s.c.engCard : s.c.userLangCard
    );
    const seen = new Set([right]);
    const picks: string[] = [];
    for (const d of distractors) {
      if (picks.length >= 3) break;
      if (seen.has(d)) continue;
      seen.add(d); picks.push(d);
    }
    while (picks.length < 3) picks.push("—");
    return crShuffle([...picks, right]).map(t => ({ text: t, isCorrect: t === right }));
  }, [current?.card._id, current?.seenCount, styleForCard, dirForCard]);

  const grade = (g: "got" | "miss") => {
    if (!current) return;
    const cardId = current.card._id;
    const isFirstSee = current.seenCount === 0 && !history.some(h => h.cardId === cardId);

    setHistory(h => [...h, {
      cardId,
      card: current.card,
      grade: g,
      firstTry: isFirstSee ? g : null,
      dir: dirForCard,
      style: styleForCard,
      ts: Date.now(),
    }]);

    if (countAsReview) {
      enqueueReview({
        cardId,
        deckId: deck._id,
        grade: g === "got" ? "good" : "again",
        clientTimeIso: new Date().toISOString(),
      });
    }

    setQueue(q => {
      const next = [...q];
      const entry = { ...next[idx] };
      entry.seenCount += 1;

      if (g === "got") {
        entry.streak += 1;
        if (entry.streak >= threshold) {
          setCleared(c => { const n = new Set(c); n.add(cardId); return n; });
          next.splice(idx, 1);
          return next;
        }
        next.splice(idx, 1);
        next.splice(reinsertPos(next.length, "got"), 0, entry);
        return next;
      } else {
        entry.streak = 0;
        if (!coached) setCoached(true);
        if (!loop) {
          setCleared(c => { const n = new Set(c); n.add(cardId); return n; });
          next.splice(idx, 1);
          return next;
        }
        next.splice(idx, 1);
        next.splice(reinsertPos(next.length, "miss"), 0, entry);
        return next;
      }
    });
  };

  const pickMc = (i: number) => {
    const opt = mcOptions[i];
    if (!opt) return;
    setMcPick({ i, correct: opt.isCorrect });
    setRevealed(true);
    setTimeout(() => grade(opt.isCorrect ? "got" : "miss"), 700);
  };

  const submitTyped = () => {
    if (!typedValue.trim()) return;
    const target = backText().trim().toLowerCase();
    const given = typedValue.trim().toLowerCase();
    let r: "correct" | "close" | "wrong" = "wrong";
    if (target === given) r = "correct";
    else if (levenshtein(target, given) <= Math.max(1, Math.floor(target.length * 0.2))) r = "close";
    setTypedResult(r);
    setRevealed(true);
    setTimeout(() => grade(r === "wrong" ? "miss" : "got"), 900);
  };

  const undo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setCleared(c => { const n = new Set(c); n.delete(last.cardId); return n; });
    setQueue(q => {
      const existing = q.findIndex(e => e.card._id === last.cardId);
      if (existing >= 0) {
        const next = [...q];
        const entry = { ...next[existing] };
        entry.streak = Math.max(0, entry.streak - (last.grade === "got" ? 1 : 0));
        entry.seenCount = Math.max(0, entry.seenCount - 1);
        next.splice(existing, 1);
        next.splice(idx, 0, entry);
        return next;
      }
      const addBack = [...q];
      addBack.splice(idx, 0, { card: last.card, streak: 0, seenCount: 0, firstTry: null });
      return addBack;
    });
    setRevealed(true);
    setTypedResult(null);
    setMcPick(null);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); onExit(); return; }
      if (allDone) return;
      if (e.key === "u" || e.key === "U" || e.key === "ArrowLeft") { e.preventDefault(); undo(); return; }
      if (styleForCard === "flip") {
        if (e.key === " ") { e.preventDefault(); setRevealed(r => !r); return; }
        if (!revealed) return;
        if (e.key === "1") { e.preventDefault(); grade("miss"); }
        if (e.key === "2") { e.preventDefault(); grade("got"); }
      } else if (styleForCard === "mc") {
        const n = parseInt(e.key, 10);
        if (!isNaN(n) && n >= 1 && n <= 4 && !mcPick) { e.preventDefault(); pickMc(n - 1); }
      } else if (styleForCard === "type") {
        if (e.key === "Enter") {
          e.preventDefault();
          if (!typedResult) submitTyped();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [revealed, typedResult, mcPick, styleForCard, allDone, queue, idx, coached]);

  const uniqueCount = initialCards.length;
  const progressPct = (cleared.size / uniqueCount) * 100;
  const toReSee = queue.length;
  const firstTryCorrect = history.filter(h => h.firstTry === "got").length;
  const firstTrySeen = history.filter(h => h.firstTry !== null).length;
  const accuracy = firstTrySeen > 0 ? Math.round((firstTryCorrect / firstTrySeen) * 100) : 100;

  if (!current) return null;
  const ph = cramPhase(current.card);
  const lang = deck.deckTags[0] || "target";

  return (
    <div className="cr-session" data-mood={mood}>
      <div className="cr-top">
        <button className="cr-close" onClick={onExit} title="Exit (Esc)" aria-label="Exit session">
          <X size={15} />
        </button>
        <div className="cr-top-progress">
          <div className="cr-bar">
            <div className="cr-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="cr-top-stats mono">
            <span>{cleared.size} / {uniqueCount}</span>
            {toReSee > 0 && (
              <span style={{ color: mood === "focus" ? "var(--tk-persimmon)" : "var(--tk-ink-3)" }}>
                · {toReSee} to re-see
              </span>
            )}
          </div>
        </div>
        <div className="cr-top-meter">
          <span className="mono" style={{ color: mood === "focus" ? "var(--tk-persimmon)" : "var(--tk-ink-2)" }}>
            {fmtTime(elapsed)}
          </span>
          <span className="mono">{accuracy}%</span>
        </div>
      </div>

      <div className="cr-body">
        <div className="cr-deckname">
          <span className={`cr-phase-pill cr-ph-${ph}`}>{ph}</span>
          {deck.deckName}
        </div>

        {/* Flip */}
        {styleForCard === "flip" && (
          <div
            className={`cr-card-stage${revealed ? " is-revealed" : ""}`}
            onClick={() => !revealed && setRevealed(true)}
          >
            <div className="cr-card-inner">
              <div className="cr-card-front">
                <div className="cr-card-eyebrow mono">
                  {dirForCard === "fi-en" ? ((current.card as any).type || "word") : "english"}
                </div>
                <div className="cr-term">{frontText()}</div>
                {dirForCard === "fi-en" && (current.card as any).pronunciation && (
                  <div className="cr-ipa">{(current.card as any).pronunciation}</div>
                )}
                {!revealed && (
                  <div className="cr-card-hint mono">TAP OR SPACE TO REVEAL</div>
                )}
              </div>
              {revealed && (
                <div className="cr-card-back">
                  <div className="cr-card-eyebrow mono">
                    {dirForCard === "fi-en" ? "english" : ((current.card as any).type || "word")}
                  </div>
                  <div className="cr-answer">{backText()}</div>
                  {(current.card as any).comment && (
                    <div className="cr-note">{(current.card as any).comment}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MC */}
        {styleForCard === "mc" && (
          <div className="cr-mc-stage">
            <div className="cr-mc-prompt-wrap">
              <div className="cr-card-eyebrow mono">
                {dirForCard === "fi-en" ? ((current.card as any).type || "word") : "english"}
              </div>
              <div className="cr-mc-prompt">{frontText()}</div>
              {dirForCard === "fi-en" && (current.card as any).pronunciation && (
                <div className="cr-ipa">{(current.card as any).pronunciation}</div>
              )}
            </div>
            <div className="cr-mc-grid">
              {mcOptions.map((opt, i) => {
                const state = mcPick == null ? "idle"
                  : opt.isCorrect ? "correct"
                  : mcPick.i === i ? "wrong" : "faded";
                return (
                  <button
                    key={i}
                    className="cr-mc-opt"
                    data-state={state}
                    onClick={() => !mcPick && pickMc(i)}
                    disabled={!!mcPick}
                  >
                    <span className="cr-mc-num mono">{i + 1}</span>
                    <span className="cr-mc-text">{opt.text}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Type */}
        {styleForCard === "type" && (
          <div className="cr-type-stage">
            <div className="cr-card-eyebrow mono">
              Type in {dirForCard === "fi-en" ? "English" : lang}
            </div>
            <div className="cr-mc-prompt">{frontText()}</div>
            <div className="cr-type-input-wrap" data-state={typedResult ?? "idle"}>
              <input
                autoFocus
                className="cr-type-input"
                value={typedValue}
                onChange={e => setTypedValue(e.target.value)}
                disabled={!!typedResult}
                placeholder="type the answer…"
                onKeyDown={e => { if (e.key === "Enter" && !typedResult) submitTyped(); }}
              />
              {!typedResult && (
                <button
                  className={`tk-btn tk-btn-sm ${mood === "focus" ? "cr-btn-focus" : "tk-btn-accent"}`}
                  disabled={!typedValue.trim()}
                  onClick={submitTyped}
                >
                  Check →
                </button>
              )}
            </div>
            {typedResult && (
              <div className="cr-type-fb" data-result={typedResult}>
                {typedResult === "correct" && <>Nailed it.</>}
                {typedResult === "close" && <>Close — <em>{backText()}</em></>}
                {typedResult === "wrong" && <>Answer: <em>{backText()}</em></>}
              </div>
            )}
          </div>
        )}

        {coached && history.length <= 2 && history[history.length - 1]?.grade === "miss" && (
          <div className="cr-coach">We'll bring this one back in a moment.</div>
        )}
      </div>

      {/* Grade bar — flip only */}
      {styleForCard === "flip" && revealed && (
        <div className="cr-grade-bar">
          <button className="cr-grade cr-grade-miss" onClick={() => grade("miss")}>
            <span className="cr-grade-key mono">1</span>
            <span className="cr-grade-x">✗</span>
            <span>Miss</span>
          </button>
          <button className="cr-grade cr-grade-got" onClick={() => grade("got")}>
            <span className="cr-grade-key mono">2</span>
            <span className="cr-grade-x">✓</span>
            <span>Got it</span>
          </button>
        </div>
      )}
      {styleForCard === "flip" && !revealed && (
        <div className="cr-grade-bar cr-grade-bar-hint mono">
          SPACE to flip · ←/U to undo · ESC to exit
        </div>
      )}

      <div className="cr-foot-hint mono">
        {styleForCard === "mc" && "1–4 to pick · ←/U undo · ESC exit"}
        {styleForCard === "type" && "ENTER to submit · ←/U undo · ESC exit"}
        {styleForCard === "flip" && revealed && "1 miss · 2 got · ← undo · ESC exit"}
      </div>
    </div>
  );
};
