import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { DeckContext } from "@/contexts/DeckContext";
import type { MemoryGoalTier, Card } from "@/types";

interface Props {
  deckId: string;
  currentTier: MemoryGoalTier;
}

const TIERS: {
  id: MemoryGoalTier;
  label: string;
  pct: number;
  load: string;
  desc: string;
}[] = [
  { id: "seedling",  label: "Seedling",  pct: 80, load: "0.7x", desc: "Just exploring. Some words will fade." },
  { id: "sapling",   label: "Sapling",   pct: 85, load: "1.0x", desc: "You'll keep most of these long-term." },
  { id: "tree",      label: "Tree",      pct: 90, load: "1.7x", desc: "Recall on demand for daily use." },
  { id: "heartwood", label: "Heartwood", pct: 95, load: "2.5x", desc: "Recall reliably even after long gaps." },
];

function TierIcon({ tier, size = 16 }: { tier: MemoryGoalTier; size?: number }) {
  const paths: Record<MemoryGoalTier, string> = {
    seedling:  "M12 22V13M12 13C12 13 8 10 8 6a4 4 0 018 0c0 4-4 7-4 7z",
    sapling:   "M12 22V10M12 10C12 10 7 7 7 3a5 5 0 0110 0c0 4-5 7-5 7zM9 16c-1.5 0-3-1-3-3",
    tree:      "M12 22V12M12 12l-4-4m4 4l4-4M12 8l-3-3m3 3l3-3M12 5V2",
    heartwood: "M12 22V12M5 12c0-3.9 3.1-7 7-7s7 3.1 7 7-3.1 7-7 7-7-3.1-7-7z",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[tier]} />
    </svg>
  );
}

const TIER_LOAD: Record<MemoryGoalTier, number> = {
  seedling: 0.7, sapling: 1.0, tree: 1.7, heartwood: 2.5,
};

/**
 * Compute a 14-day forecast, previewing a given tier.
 * Scales the remaining time-to-due for each card by currentLoad / previewLoad.
 * Overdue cards always fall on day 0. New cards (reps=0) always fall on day 0.
 */
function computeForecast(
  cards: Card[],
  currentTier: MemoryGoalTier,
  previewTier: MemoryGoalTier,
  days = 14,
): number[] {
  const scaleFactor = TIER_LOAD[currentTier] / TIER_LOAD[previewTier];
  const now = Date.now();

  const dayBoundaries = Array.from({ length: days }, (_, i) => {
    const start = new Date(now);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + i);
    const end = new Date(start);
    end.setHours(23, 59, 59, 999);
    return { start: start.getTime(), end: end.getTime() };
  });

  return dayBoundaries.map(({ start, end }, i) => {
    return cards.filter(c => {
      if (c.suspended) return false;

      // New cards and cards with no schedule → always today
      if ((c.reps || 0) === 0 || !c.dueAt) return i === 0;

      const rawDue = new Date(c.dueAt).getTime();
      const remaining = rawDue - now;

      // Already overdue → count today regardless of tier
      const dueMs = remaining <= 0 ? now : now + remaining * scaleFactor;

      return i === 0 ? dueMs <= end : dueMs >= start && dueMs <= end;
    }).length;
  });
}

export function MemoryGoalPanel({ deckId, currentTier }: Props) {
  const [selected, setSelected] = useState<MemoryGoalTier>(currentTier);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSelected(currentTier);
  }, [currentTier]);
  const { decks, setDecks } = useContext(DeckContext) as any;

  const deck = decks.find((d: any) => d._id === deckId);
  const forecast = deck ? computeForecast(deck.cards || [], currentTier, selected) : Array(14).fill(0);
  const totalReviews = forecast.reduce((a, b) => a + b, 0);
  const maxBar = Math.max(...forecast, 1);

  const isDirty = selected !== currentTier;

  async function handleSave() {
    setSaving(true);
    try {
      await axios.put(`/decks/${deckId}/memory-goal`, { tier: selected });
      setDecks((prev: any[]) =>
        prev.map(d => d._id === deckId ? { ...d, memoryGoal: { tier: selected } } : d)
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  function handleCancel() {
    setSelected(currentTier);
  }

  const activeTier = TIERS.find(t => t.id === selected)!;

  return (
    <div className="tx-aside-card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid var(--tk-rule-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--tk-ink)" }}>Memory goal</div>
          <div style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
            textTransform: "uppercase", color: "var(--tk-accent)",
            background: "var(--tk-accent-wash)", borderRadius: 4,
            padding: "2px 7px",
          }}>
            {activeTier.label}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--tk-ink-3)", marginTop: 4, lineHeight: 1.45 }}>
          A long-term promise. The scheduler bends intervals to match — you'll see these cards more or less often.
        </div>
      </div>

      {/* Tier list */}
      <div style={{ padding: "8px 0" }}>
        {TIERS.map((tier) => {
          const isSelected = selected === tier.id;
          const isCurrent = currentTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => setSelected(tier.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12,
                padding: "9px 20px", border: "none", cursor: "pointer", textAlign: "left",
                background: isSelected ? "var(--tk-accent-wash)" : "transparent",
                transition: "background 0.12s",
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: isSelected ? "var(--tk-accent-soft)" : "var(--tk-paper-deep)",
                border: `1px solid ${isSelected ? "var(--tk-accent)" : "var(--tk-rule)"}`,
                color: isSelected ? "var(--tk-accent)" : "var(--tk-ink-3)",
              }}>
                <TierIcon tier={tier.id} size={14} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--tk-ink)" }}>{tier.label}</span>
                  <span style={{ fontSize: 11, color: "var(--tk-ink-3)" }}>{tier.pct}%</span>
                  {isCurrent && !isDirty && (
                    <span style={{
                      fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em",
                      textTransform: "uppercase", color: "var(--tk-accent)",
                      background: "var(--tk-accent-wash)", borderRadius: 3,
                      padding: "1px 5px",
                    }}>NOW</span>
                  )}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--tk-ink-3)", marginTop: 1 }}>{tier.desc}</div>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 600, color: isSelected ? "var(--tk-accent)" : "var(--tk-ink-4)",
                fontVariantNumeric: "tabular-nums", flexShrink: 0,
              }}>
                {tier.load}<br />
                <span style={{ fontSize: 9.5, fontWeight: 400, textTransform: "uppercase", letterSpacing: "0.04em" }}>LOAD</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Forecast */}
      <div style={{ padding: "12px 20px 14px", borderTop: "1px solid var(--tk-rule-soft)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--tk-ink-3)" }}>
            14-day forecast · {activeTier.label}
          </div>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--tk-ink-2)" }}>
            {totalReviews} reviews
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height: 32 }}>
          {forecast.map((count, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
              <div style={{
                height: `${Math.max(2, Math.round((count / maxBar) * 28))}px`,
                borderRadius: 2,
                background: count > 0 ? "var(--tk-accent)" : "var(--tk-rule)",
                opacity: i === 0 ? 1 : 0.45 + (0.55 * count / maxBar),
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{
        padding: "10px 20px", borderTop: "1px solid var(--tk-rule-soft)",
        display: "flex", gap: 8, justifyContent: "flex-end",
      }}>
        <button className="tk-btn tk-btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }}
          onClick={handleCancel} disabled={!isDirty || saving}>
          Cancel
        </button>
        <button
          className="tk-btn tk-btn-accent"
          style={{ fontSize: 12, padding: "5px 14px", opacity: (!isDirty && !saved) ? 0.5 : 1 }}
          onClick={handleSave}
          disabled={(!isDirty && !saved) || saving}
        >
          {saved ? "Saved ✓" : saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
