/**
 * Lukeā / Tokō — pure SRS helpers (frontend mirror).
 *
 * These are pure functions used by the Review pages and overlays. They do not
 * touch React state, axios, or localStorage. They mirror the backend FSRS
 * math (`lla-backend/services/srs.js`) so that grade-button projections and
 * load-state derivations in the UI stay consistent with what the server
 * actually computes.
 *
 * Where the frontend deliberately diverges from the backend it is documented
 * inline.
 */

import type { Card } from "@/types";

export type Rating    = "again" | "hard" | "good" | "easy";
export type Phase     = "seed" | "sprout" | "sapling" | "tree";
export type LoadState = "calm" | "full" | "flood" | "backlog" | "seedling" | "zero-clear" | "zero-fresh";

export type DeckCard = Card & { deckId: string; deckName: string };

// ─────────────────────────────────────────────────────────────────────────────
// Phase
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Derive a card's phase from `reps` and `stability`.
 *
 * Falls back to legacy `cardScore` for `reps` and legacy `reviewInterval` for
 * `stability` when the FSRS fields are absent — this keeps very old cards
 * (created before the FSRS migration) on a sensible shelf.
 */
export function phaseOf(card: Partial<Card> | null | undefined): Phase {
  if (!card) return "seed";
  const reps = card.reps ?? card.cardScore ?? 0;
  const stability = card.stability ?? card.reviewInterval ?? 1;
  if (reps === 0) return "seed";
  if (stability < 7) return "sprout";
  if (stability < 90) return "sapling";
  return "tree";
}

// ─────────────────────────────────────────────────────────────────────────────
// Interval projections (cosmetic — server is authoritative)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Format a `days` interval as a short human string for the grade buttons.
 *
 * Edge cases:
 *  - sub-day → minutes ("10 min")
 *  - 1d ≤ days < 30 → "Nd" (rounded)
 *  - 30 ≤ days < 365 → "X.X mo"
 *  - 365+ → "X.X y"
 */
export function formatInterval(days: number): string {
  if (days === null || days === undefined || Number.isNaN(days) || !Number.isFinite(days)) {
    return "—";
  }
  if (days <= 0) return "0 min";
  if (days < 1 / 24) return `${Math.round(days * 24 * 60)} min`;
  if (days < 1) return `${Math.round(days * 24)} h`;
  if (days < 30) return `${Math.round(days)} d`;
  if (days < 365) return `${(days / 30).toFixed(1)} mo`;
  return `${(days / 365).toFixed(1)} y`;
}

/**
 * Project the four interval strings shown under the grade buttons.
 *
 * For new cards (reps = 0) we return the canonical first-rep ladder
 * (10m / 5m / 1d / 4d). For review cards we project off `stability` × `ease`.
 *
 * NOTE: this DOES NOT apply the deck's tier loadMult — the buttons show a
 * pre-tier estimate; the actual interval the server commits will be slightly
 * different. The "again" button always shows "10 min" because the server
 * always re-schedules to +10 min on lapse.
 */
export function projectIntervals(card: Partial<Card>): Record<Rating, string> {
  const reps = card.reps ?? card.cardScore ?? 0;
  const stability = Math.max(1, card.stability ?? card.reviewInterval ?? 1);
  const ease = card.ease ?? card.easeFactor ?? 2.5;

  if (reps === 0) {
    return { again: "10 min", hard: "5 min", good: "1 d", easy: "4 d" };
  }
  return {
    again: "10 min",
    hard: formatInterval(stability * 1.2),
    good: formatInterval(stability * ease),
    easy: formatInterval(stability * ease * 1.3),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Graduation prediction
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Predict whether `grade` will move `card` across a phase boundary.
 *
 * Returns the destination phase, or null if no graduation will fire.
 * Mirrors the backend `willGraduate` for UI parity. Pre-tier — when a deck's
 * memoryGoal.tier > 1.0 the actual stability is divided afterward, so a
 * predicted graduation may not actually happen on the server. The interstitial
 * is purely presentational, so this is acceptable.
 */
export function gradePhaseTransition(card: Partial<Card>, grade: Rating): Phase | null {
  if (grade === "again" || grade === "hard") return null;
  const phase = phaseOf(card);
  if (phase === "seed") return "sprout";
  if (phase === "tree") return null;
  const stability = Math.max(1, card.stability ?? card.reviewInterval ?? 1);
  const ease = card.ease ?? card.easeFactor ?? 2.5;
  const mult = grade === "easy" ? ease * 1.3 : ease;
  const nextStab = stability * mult;
  if (phase === "sprout" && nextStab >= 7) return "sapling";
  if (phase === "sapling" && nextStab >= 90) return "tree";
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Time
// ─────────────────────────────────────────────────────────────────────────────

/**
 * "today" / "1 day ago" / "Nd ago" — the format used in card footers.
 *
 * NOTE: on the frontend we say "1 day ago" (long form), where the backend
 * shortens to "1d ago". This is intentional for UI rhythm.
 */
export function relativeTime(dateStr: string | Date | null | undefined, now: number = Date.now()): string | null {
  if (!dateStr) return null;
  const t = new Date(dateStr).getTime();
  if (Number.isNaN(t)) return null;
  const days = Math.round((now - t) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days}d ago`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Due-card filtering
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Whether a card should appear in today's queue.
 *
 * Rules (mirrors backend):
 *   suspended           → not due
 *   reps === 0          → due (seeds always show up until reviewed)
 *   no dueAt set        → due (defensive — treat as seed)
 *   dueAt <= endOfToday → due
 */
export function isDueToday(card: Partial<Card>, endOfToday: Date): boolean {
  if (card.suspended) return false;
  const reps = card.reps ?? 0;
  if (reps === 0 && !card.dueAt) return true;
  const due = card.dueAt ?? card.nextReviewDate ?? null;
  if (!due) return reps === 0;
  return new Date(due) <= endOfToday;
}

/**
 * Sort comparator for the daily queue:
 *   1. Lapsed sprouts first (sprout phase + lapses > 0).
 *   2. Then by ascending stability (lowest first — most fragile).
 *   3. Then by ascending dueAt (oldest backlog first).
 *
 * Returns a comparator suitable for `arr.sort()`.
 */
export function dueQueueComparator(): (a: Partial<Card>, b: Partial<Card>) => number {
  return (a, b) => {
    const lA = phaseOf(a) === "sprout" && (a.lapses ?? 0) > 0;
    const lB = phaseOf(b) === "sprout" && (b.lapses ?? 0) > 0;
    if (lA !== lB) return lA ? -1 : 1;
    const stabDiff = (a.stability ?? 1) - (b.stability ?? 1);
    if (stabDiff !== 0) return stabDiff;
    return (
      new Date(a.dueAt ?? a.nextReviewDate ?? 0).getTime() -
      new Date(b.dueAt ?? b.nextReviewDate ?? 0).getTime()
    );
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Load state — the seven hero variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Pick the hero state from headline data.
 *
 * Order of precedence:
 *   awayDays >= 3       → "backlog"
 *   no decks at all     → "zero-fresh"
 *   no cards due today  → "zero-clear"
 *   1-8 due             → "seedling"
 *   9-25 due            → "calm"
 *   26-80 due           → "full"
 *   80+ due             → "flood"
 */
export function detectLoadState(awayDays: number, hasDecks: boolean, totalDue: number): LoadState {
  if (awayDays >= 3) return "backlog";
  if (!hasDecks) return "zero-fresh";
  if (totalDue === 0) return "zero-clear";
  if (totalDue <= 8) return "seedling";
  if (totalDue <= 25) return "calm";
  if (totalDue <= 80) return "full";
  return "flood";
}

// ─────────────────────────────────────────────────────────────────────────────
// Memory shelves (Memory Map bar chart)
// ─────────────────────────────────────────────────────────────────────────────

export type MemoryShelf = {
  id: string;
  interval: string;
  label: string;
  phase: Phase;
  filter: (c: Partial<Card>) => boolean;
};

export const MEMORY_SHELVES: ReadonlyArray<MemoryShelf> = [
  { id: "unseen", interval: "unseen",  label: "Seed",          phase: "seed",
    filter: c => (c.reps ?? 0) === 0 },
  { id: "today",  interval: "today",   label: "Sprout",        phase: "sprout",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) < 1 },
  { id: "1d",     interval: "1 day",   label: "Sprout · 1d",   phase: "sprout",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 1  && (c.stability ?? 1) < 3 },
  { id: "3d",     interval: "3 days",  label: "Sprout · 3d",   phase: "sprout",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 3  && (c.stability ?? 1) < 7 },
  // Sapling/tree filters guard reps>0 too — otherwise a card with reps=0 and
  // a freak stability value (DB corruption, manual edit) would double-count
  // on the 'unseen' shelf AND a tree shelf.
  { id: "1w",     interval: "1 week",  label: "Sapling · 1w",  phase: "sapling",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 7   && (c.stability ?? 1) < 14 },
  { id: "2w",     interval: "2 weeks", label: "Sapling · 2w",  phase: "sapling",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 14  && (c.stability ?? 1) < 30 },
  { id: "1mo",    interval: "1 month", label: "Sapling · 1mo", phase: "sapling",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 30  && (c.stability ?? 1) < 90 },
  { id: "3mo",    interval: "3 mo",    label: "Tree · 3mo",    phase: "tree",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 90  && (c.stability ?? 1) < 180 },
  { id: "6mo",    interval: "6 mo+",   label: "Tree · 6mo+",   phase: "tree",
    filter: c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 180 },
];

/** Count cards on each shelf. Returns a copy of MEMORY_SHELVES with `cards` added. */
export function shelfCounts<T extends Partial<Card>>(cards: T[]): (MemoryShelf & { cards: number })[] {
  return MEMORY_SHELVES.map(s => ({ ...s, cards: cards.filter(s.filter).length }));
}
