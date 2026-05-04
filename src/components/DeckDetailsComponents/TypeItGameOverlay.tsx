import { useState, useMemo } from "react";
import { GameOverlay } from "./GameOverlay";
import { ArrowRight } from "lucide-react";
import { Card } from "@/types";

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const v0 = Array.from({ length: b.length + 1 }, (_, i) => i);
  const v1 = new Array(b.length + 1);
  for (let i = 0; i < a.length; i++) {
    v1[0] = i + 1;
    for (let j = 0; j < b.length; j++) {
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + (a[i] === b[j] ? 0 : 1));
    }
    for (let j = 0; j <= b.length; j++) v0[j] = v1[j];
  }
  return v1[b.length];
}

interface Props {
  deckName: string;
  cards: Card[];
  onClose: () => void;
}

type ResultType = "correct" | "close" | "wrong" | null;

export const TypeItGameOverlay: React.FC<Props> = ({ deckName, cards, onClose }) => {
  const queue = useMemo(() => {
    const arr = [...cards].slice(0, 8);
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, []);

  const [idx, setIdx] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ResultType>(null);
  const [history, setHistory] = useState<{ card: Card; given: string; result: ResultType }[]>([]);

  const card = queue[idx];
  const complete = idx >= queue.length;

  const submit = () => {
    if (!value.trim() || !card) return;
    const target = card.userLangCard.trim().toLowerCase();
    const given  = value.trim().toLowerCase();
    let r: ResultType = "wrong";
    if (target === given) r = "correct";
    else if (levenshtein(target, given) <= Math.max(1, Math.floor(target.length * 0.2))) r = "close";
    setResult(r);
    setHistory(h => [...h, { card, given: value, result: r }]);
  };

  const advance = () => { setIdx(i => i + 1); setValue(""); setResult(null); };

  const correct = history.filter(h => h.result === "correct").length;
  const close   = history.filter(h => h.result === "close").length;

  if (complete) {
    return (
      <GameOverlay title="Type it" deckName={deckName} onClose={onClose} progress={100}>
        <div className="mg-done">
          <div className="tk-eyebrow" style={{ color: "var(--tk-accent-deep)", marginBottom: 10 }}>Round complete</div>
          <div style={{ fontSize: 40, fontWeight: 500, marginBottom: 20 }}>
            {correct === queue.length ? "Flawless." : correct >= queue.length - 2 ? "Almost there." : "Good warm-up."}
          </div>
          <div style={{ display: "flex", gap: 40, justifyContent: "center", marginBottom: 26 }}>
            <div><div className="tk-eyebrow">Correct</div><div style={{ fontSize: 30, fontWeight: 500 }}>{correct}</div></div>
            <div><div className="tk-eyebrow">Close</div><div style={{ fontSize: 30, fontWeight: 500 }}>{close}</div></div>
            <div><div className="tk-eyebrow">Missed</div><div style={{ fontSize: 30, fontWeight: 500 }}>{queue.length - correct - close}</div></div>
          </div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
            <button className="tk-btn tk-btn-ghost" onClick={onClose}>Back to deck</button>
          </div>
        </div>
      </GameOverlay>
    );
  }

  return (
    <GameOverlay
      title="Type it"
      deckName={deckName}
      onClose={onClose}
      progress={(idx / queue.length) * 100}
      footer={
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div className="tk-mono" style={{ fontSize: 12, color: "var(--tk-ink-3)" }}>{idx + 1} / {queue.length}</div>
          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "var(--tk-ink-3)" }}>
            <span><span style={{ color: "var(--tk-accent)" }}>●</span> {correct} correct</span>
            <span><span style={{ color: "var(--tk-persimmon)" }}>●</span> {close} close</span>
          </div>
          <div style={{ fontSize: 11, color: "var(--tk-ink-4)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.08em" }}>
            ENTER TO SUBMIT
          </div>
        </div>
      }
    >
      <div className="ti-stage">
        <div className="tk-eyebrow" style={{ marginBottom: 12 }}>Translate to Finnish</div>
        <div className="ti-prompt">{card.engCard}</div>
        {card.type && <div className="ti-type">{card.type}</div>}
        <div className="ti-input-wrap" data-state={result || "idle"}>
          <input
            autoFocus
            className="ti-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") { if (!result) submit(); else advance(); }
            }}
            placeholder="type here…"
            disabled={!!result}
          />
          {!result && (
            <button className="tk-btn tk-btn-accent tk-btn-sm" onClick={submit} disabled={!value.trim()}>
              Check <ArrowRight size={12} />
            </button>
          )}
          {result && (
            <button className="tk-btn tk-btn-accent tk-btn-sm" onClick={advance}>
              Next <ArrowRight size={12} />
            </button>
          )}
        </div>
        {result && (
          <div className="ti-feedback" data-result={result}>
            {result === "correct" && <div className="ti-fb-line">Correct.</div>}
            {result === "close"   && <div className="ti-fb-line">Close — the answer was <em>{card.userLangCard}</em>.</div>}
            {result === "wrong"   && <div className="ti-fb-line">Not quite — the answer is <em>{card.userLangCard}</em>.</div>}
          </div>
        )}
      </div>
    </GameOverlay>
  );
};
