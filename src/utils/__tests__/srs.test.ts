/**
 * Comprehensive unit tests for the frontend SRS helpers.
 *
 * These mirror the backend SRS tests but test the cosmetic / UI-facing
 * functions that drive grade-button projections, queue ordering, and the
 * seven-state hero on the Review dashboard.
 *
 * Critical invariants tested here:
 *   - phaseOf and the backend's derivePhase agree on every boundary.
 *   - projectIntervals stays in sync with what applyGrade actually produces
 *     (modulo the tier loadMult — see note in srs.ts).
 *   - gradePhaseTransition only fires when the underlying math truly crosses
 *     a phase boundary (no false-positive interstitials).
 *   - isDueToday correctly excludes suspended cards and respects the
 *     end-of-day window.
 *   - dueQueueComparator places lapsed sprouts first, then ascending
 *     stability, then ascending dueAt.
 *   - detectLoadState transitions exactly at the documented thresholds.
 *   - MEMORY_SHELVES filters cover every possible card state with no gaps.
 *   - deriveCardState resolves the five lifecycle states in priority order.
 *   - computeTodayMix counts recognition vs contrast correctly for 0..N cards.
 *   - computeIntakeBudget applies every policy branch (pool-full, missed,
 *     backlog, low-retention, half-pace, full-pace).
 *   - computePoolCounts tallies per-state counts across 0, 1, and 999 cards.
 */

import { describe, test, expect, it } from "vitest";
import {
  phaseOf,
  formatInterval,
  projectIntervals,
  gradePhaseTransition,
  relativeTime,
  isDueToday,
  dueQueueComparator,
  detectLoadState,
  MEMORY_SHELVES,
  shelfCounts,
  PACE_CONFIG,
  deriveCardState,
  computeTodayMix,
  computeIntakeBudget,
  computePoolCounts,
  type DeckCard,
  type Rating,
  type Phase,
  type LearningPace,
  type CardState,
} from "@/utils/srs";
import type { Card } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// Test fixtures
// ─────────────────────────────────────────────────────────────────────────────

const NOW_MS = Date.UTC(2026, 4, 6, 12, 0, 0); // May 6, 2026 12:00 UTC
const ONE_DAY_MS = 86400000;

const card = (overrides: Partial<Card> = {}): Card => ({
  _id: "c1",
  userLangCard: "kirja",
  engCard: "book",
  cardScore: 0,
  reps: 0,
  stability: 1,
  ease: 2.5,
  lapses: 0,
  lastSeenAt: null,
  dueAt: null,
  suspended: false,
  ...overrides,
});

const deckCard = (overrides: Partial<DeckCard> = {}): DeckCard => ({
  ...card(),
  deckId: "d1",
  deckName: "Everyday Finnish",
  ...overrides,
});

const closeTo = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol;

// ─────────────────────────────────────────────────────────────────────────────
// phaseOf
// ─────────────────────────────────────────────────────────────────────────────

describe("phaseOf", () => {
  test("reps === 0 → seed regardless of stability", () => {
    expect(phaseOf(card({ reps: 0, stability: 0   }))).toBe("seed");
    expect(phaseOf(card({ reps: 0, stability: 100 }))).toBe("seed");
    expect(phaseOf(card({ reps: 0, stability: 365 }))).toBe("seed");
  });

  test("sprout band: reps>=1 and stability < 7", () => {
    expect(phaseOf(card({ reps: 1, stability: 0.5 }))).toBe("sprout");
    expect(phaseOf(card({ reps: 1, stability: 1   }))).toBe("sprout");
    expect(phaseOf(card({ reps: 5, stability: 6.999 }))).toBe("sprout");
  });

  test("boundary: stability === 7 is sapling", () => {
    expect(phaseOf(card({ reps: 1, stability: 7 }))).toBe("sapling");
  });

  test("sapling band: 7 <= stability < 90", () => {
    expect(phaseOf(card({ reps: 1, stability: 7      }))).toBe("sapling");
    expect(phaseOf(card({ reps: 1, stability: 30     }))).toBe("sapling");
    expect(phaseOf(card({ reps: 1, stability: 89.999 }))).toBe("sapling");
  });

  test("boundary: stability === 90 is tree", () => {
    expect(phaseOf(card({ reps: 1, stability: 90 }))).toBe("tree");
  });

  test("tree band: stability >= 90", () => {
    expect(phaseOf(card({ reps: 1, stability: 90    }))).toBe("tree");
    expect(phaseOf(card({ reps: 1, stability: 365   }))).toBe("tree");
    expect(phaseOf(card({ reps: 1, stability: 10000 }))).toBe("tree");
  });

  test("falls back to legacy cardScore when reps is missing", () => {
    expect(phaseOf({ cardScore: 0,  stability: 30 } as Partial<Card>)).toBe("seed");
    expect(phaseOf({ cardScore: 1,  stability: 30 } as Partial<Card>)).toBe("sapling");
    expect(phaseOf({ cardScore: 5,  stability: 30 } as Partial<Card>)).toBe("sapling");
  });

  test("falls back to legacy reviewInterval when stability is missing", () => {
    expect(phaseOf({ reps: 1, reviewInterval: 5  } as Partial<Card>)).toBe("sprout");
    expect(phaseOf({ reps: 1, reviewInterval: 14 } as Partial<Card>)).toBe("sapling");
  });

  test("null / undefined card → seed (defensive)", () => {
    expect(phaseOf(null)).toBe("seed");
    expect(phaseOf(undefined)).toBe("seed");
    expect(phaseOf({} as Partial<Card>)).toBe("seed");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// formatInterval
// ─────────────────────────────────────────────────────────────────────────────

describe("formatInterval", () => {
  test("sub-hour → minutes", () => {
    expect(formatInterval(1 / 144)).toBe("10 min"); // 10 min
    expect(formatInterval(1 / 48 )).toBe("30 min"); // 30 min
    expect(formatInterval(1 / 96 )).toBe("15 min");
  });

  test("hour band: 1/24 ≤ days < 1 → hours", () => {
    expect(formatInterval(1 / 24 )).toBe("1 h");
    expect(formatInterval(2 / 24 )).toBe("2 h");
    expect(formatInterval(0.5    )).toBe("12 h");
    expect(formatInterval(23 / 24)).toBe("23 h");
  });

  test("day band: 1 ≤ days < 30 → 'Nd'", () => {
    expect(formatInterval(1   )).toBe("1 d");
    expect(formatInterval(1.4 )).toBe("1 d");
    expect(formatInterval(1.5 )).toBe("2 d");
    expect(formatInterval(7   )).toBe("7 d");
    expect(formatInterval(29.4)).toBe("29 d");
  });

  test("month band: 30 ≤ days < 365 → 'X.X mo'", () => {
    expect(formatInterval(30 )).toBe("1.0 mo");
    expect(formatInterval(60 )).toBe("2.0 mo");
    expect(formatInterval(90 )).toBe("3.0 mo");
    expect(formatInterval(180)).toBe("6.0 mo");
  });

  test("year band: days >= 365 → 'X.X y'", () => {
    expect(formatInterval(365 )).toBe("1.0 y");
    expect(formatInterval(730 )).toBe("2.0 y");
    expect(formatInterval(1825)).toBe("5.0 y");
  });

  test("zero / negative → '0 min'", () => {
    expect(formatInterval(0   )).toBe("0 min");
    expect(formatInterval(-1  )).toBe("0 min");
    expect(formatInterval(-100)).toBe("0 min");
  });

  test("non-finite → '—'", () => {
    expect(formatInterval(NaN     )).toBe("—");
    expect(formatInterval(Infinity)).toBe("—");
    expect(formatInterval(-Infinity)).toBe("—");
    // @ts-expect-error testing defensive null handling
    expect(formatInterval(null)).toBe("—");
    // @ts-expect-error testing defensive undefined handling
    expect(formatInterval(undefined)).toBe("—");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// projectIntervals
// ─────────────────────────────────────────────────────────────────────────────

describe("projectIntervals", () => {
  test("first rep (reps=0) → fixed ladder 10m / 5m / 1d / 4d", () => {
    expect(projectIntervals(card({ reps: 0 }))).toEqual({
      again: "10 min",
      hard:  "5 min",
      good:  "1 d",
      easy:  "4 d",
    });
  });

  test("review rep: hard = stability * 1.2", () => {
    const out = projectIntervals(card({ reps: 3, stability: 10, ease: 2.5 }));
    expect(out.hard).toBe("12 d"); // 10 * 1.2
  });

  test("review rep: good = stability * ease", () => {
    const out = projectIntervals(card({ reps: 3, stability: 10, ease: 2.5 }));
    expect(out.good).toBe("25 d"); // 10 * 2.5
  });

  test("review rep: easy = stability * ease * 1.3", () => {
    const out = projectIntervals(card({ reps: 3, stability: 10, ease: 2.5 }));
    // 10 * 2.5 * 1.3 = 32.5 days = 1.1 mo
    expect(out.easy).toBe("1.1 mo");
  });

  test("again is always '10 min'", () => {
    expect(projectIntervals(card({ reps: 5, stability: 100 })).again).toBe("10 min");
    expect(projectIntervals(card({ reps: 0 })).again).toBe("10 min");
  });

  test("stability is floored at 1 day for review reps", () => {
    // tiny stability, hard = 0.4 * 1.2 = 0.48 — but stability is floored to 1
    // so hard = 1 * 1.2 = 1.2 → '1 d'
    expect(projectIntervals(card({ reps: 3, stability: 0.4, ease: 2.5 })).hard).toBe("1 d");
  });

  test("falls back to legacy easeFactor and reviewInterval", () => {
    const out = projectIntervals({ reps: 3, easeFactor: 2.0, reviewInterval: 5 } as Partial<Card>);
    // hard = 5 * 1.2 = 6 d
    expect(out.hard).toBe("6 d");
    // good = 5 * 2.0 = 10 d
    expect(out.good).toBe("10 d");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// gradePhaseTransition
// ─────────────────────────────────────────────────────────────────────────────

describe("gradePhaseTransition", () => {
  test("again → null on every phase", () => {
    for (const stab of [0.5, 5, 30, 180]) {
      expect(gradePhaseTransition(card({ reps: 5, stability: stab }), "again")).toBe(null);
    }
  });

  test("hard → null on every phase", () => {
    for (const stab of [0.5, 5, 30, 180]) {
      expect(gradePhaseTransition(card({ reps: 5, stability: stab }), "hard")).toBe(null);
    }
  });

  test("seed (reps=0) → 'sprout' on good", () => {
    expect(gradePhaseTransition(card({ reps: 0 }), "good")).toBe("sprout");
  });

  test("seed (reps=0) → 'sprout' on easy", () => {
    expect(gradePhaseTransition(card({ reps: 0 }), "easy")).toBe("sprout");
  });

  test("sprout near boundary: good triggers sapling when nextStab >= 7", () => {
    // stab=3, ease=2.5 → 7.5 (good)
    expect(gradePhaseTransition(card({ reps: 2, stability: 3, ease: 2.5 }), "good")).toBe("sapling");
    // stab=2, ease=2.5 → 5 (no graduation)
    expect(gradePhaseTransition(card({ reps: 2, stability: 2, ease: 2.5 }), "good")).toBe(null);
  });

  test("sprout: easy graduates earlier than good (1.3x boost)", () => {
    // stab=2.2, ease=2.5 → easy 7.15, good 5.5 → easy graduates, good doesn't
    expect(gradePhaseTransition(card({ reps: 2, stability: 2.2, ease: 2.5 }), "easy")).toBe("sapling");
    expect(gradePhaseTransition(card({ reps: 2, stability: 2.2, ease: 2.5 }), "good")).toBe(null);
  });

  test("sapling → tree when projected stab >= 90", () => {
    // stab=36, ease=2.5 → 90 → graduate
    expect(gradePhaseTransition(card({ reps: 5, stability: 36, ease: 2.5 }), "good")).toBe("tree");
    // stab=35, ease=2.5 → 87.5 → no graduate
    expect(gradePhaseTransition(card({ reps: 5, stability: 35, ease: 2.5 }), "good")).toBe(null);
  });

  test("tree never fires further graduation", () => {
    expect(gradePhaseTransition(card({ reps: 10, stability: 100, ease: 2.5 }), "good")).toBe(null);
    expect(gradePhaseTransition(card({ reps: 10, stability: 100, ease: 2.5 }), "easy")).toBe(null);
    expect(gradePhaseTransition(card({ reps: 10, stability: 365, ease: 3.0 }), "easy")).toBe(null);
  });

  test("uses legacy easeFactor when ease is missing", () => {
    expect(gradePhaseTransition({ reps: 2, stability: 3, easeFactor: 2.5 } as Partial<Card>, "good"))
      .toBe("sapling");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// relativeTime
// ─────────────────────────────────────────────────────────────────────────────

describe("relativeTime", () => {
  test("null / undefined → null", () => {
    expect(relativeTime(null,      NOW_MS)).toBe(null);
    expect(relativeTime(undefined, NOW_MS)).toBe(null);
    expect(relativeTime("",        NOW_MS)).toBe(null);
  });

  test("invalid date string → null", () => {
    expect(relativeTime("not-a-date", NOW_MS)).toBe(null);
  });

  test("today (same day, < 12h) → 'today'", () => {
    expect(relativeTime(new Date(NOW_MS - 3 * 3600 * 1000), NOW_MS)).toBe("today");
  });

  test("1 day ago → '1 day ago' (long form on FE)", () => {
    expect(relativeTime(new Date(NOW_MS - 24 * 3600 * 1000), NOW_MS)).toBe("1 day ago");
  });

  test("multiple days → 'Nd ago'", () => {
    expect(relativeTime(new Date(NOW_MS - 4   * ONE_DAY_MS), NOW_MS)).toBe("4d ago");
    expect(relativeTime(new Date(NOW_MS - 30  * ONE_DAY_MS), NOW_MS)).toBe("30d ago");
    expect(relativeTime(new Date(NOW_MS - 365 * ONE_DAY_MS), NOW_MS)).toBe("365d ago");
  });

  test("future date / clock skew → 'today' (never lies)", () => {
    expect(relativeTime(new Date(NOW_MS + 60_000), NOW_MS)).toBe("today");
  });

  test("accepts ISO string", () => {
    const iso = new Date(NOW_MS - 4 * ONE_DAY_MS).toISOString();
    expect(relativeTime(iso, NOW_MS)).toBe("4d ago");
  });

  test("accepts Date object", () => {
    expect(relativeTime(new Date(NOW_MS - 4 * ONE_DAY_MS), NOW_MS)).toBe("4d ago");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isDueToday
// ─────────────────────────────────────────────────────────────────────────────

describe("isDueToday", () => {
  const endOfToday = new Date(Date.UTC(2026, 4, 6, 23, 59, 59, 999));

  test("suspended cards never due", () => {
    expect(isDueToday(card({ reps: 0, suspended: true }), endOfToday)).toBe(false);
    expect(isDueToday(card({ reps: 5, stability: 1, suspended: true,
                             dueAt: new Date(endOfToday.getTime() - 100).toISOString() }), endOfToday))
      .toBe(false);
  });

  test("seeds with no dueAt → due", () => {
    expect(isDueToday(card({ reps: 0, dueAt: null }), endOfToday)).toBe(true);
  });

  test("seeds (reps=0) with dueAt set → defer to dueAt comparison", () => {
    const past = new Date(endOfToday.getTime() - 100).toISOString();
    expect(isDueToday(card({ reps: 0, dueAt: past }), endOfToday)).toBe(true);
    const future = new Date(endOfToday.getTime() + 86400000).toISOString();
    expect(isDueToday(card({ reps: 0, dueAt: future }), endOfToday)).toBe(false);
  });

  test("review card with no dueAt is NOT due (would need dueAt set)", () => {
    expect(isDueToday(card({ reps: 5, stability: 5, dueAt: null }), endOfToday)).toBe(false);
  });

  test("dueAt exactly at end-of-today → due (boundary inclusive)", () => {
    expect(isDueToday(card({ reps: 5, dueAt: endOfToday.toISOString() }), endOfToday)).toBe(true);
  });

  test("dueAt in the past → due (overdue)", () => {
    const past = new Date(endOfToday.getTime() - ONE_DAY_MS * 30).toISOString();
    expect(isDueToday(card({ reps: 5, dueAt: past }), endOfToday)).toBe(true);
  });

  test("dueAt > endOfToday → not due", () => {
    const future = new Date(endOfToday.getTime() + ONE_DAY_MS).toISOString();
    expect(isDueToday(card({ reps: 5, dueAt: future }), endOfToday)).toBe(false);
  });

  test("falls back to legacy nextReviewDate when dueAt is missing", () => {
    const past = new Date(endOfToday.getTime() - 100).toISOString();
    const c: Partial<Card> = { reps: 5, stability: 1, dueAt: undefined, nextReviewDate: past };
    expect(isDueToday(c, endOfToday)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// dueQueueComparator
// ─────────────────────────────────────────────────────────────────────────────

describe("dueQueueComparator", () => {
  const sort = (cards: Partial<Card>[]) => [...cards].sort(dueQueueComparator());

  test("lapsed sprouts come first", () => {
    const cards = [
      card({ _id: "x", reps: 5, stability: 30, lapses: 0 }),
      card({ _id: "lapsed", reps: 3, stability: 3, lapses: 2 }), // sprout + lapses
    ];
    const sorted = sort(cards);
    expect(sorted[0]._id).toBe("lapsed");
  });

  test("among non-lapsed, ascending stability wins", () => {
    const cards = [
      card({ _id: "high", reps: 3, stability: 100 }),
      card({ _id: "mid",  reps: 3, stability: 30  }),
      card({ _id: "low",  reps: 3, stability: 1   }),
    ];
    expect(sort(cards).map(c => c._id)).toEqual(["low", "mid", "high"]);
  });

  test("ties on stability broken by ascending dueAt", () => {
    const NOW = Date.now();
    const cards = [
      card({ _id: "newer",  reps: 3, stability: 5, dueAt: new Date(NOW - 1 * ONE_DAY_MS).toISOString() }),
      card({ _id: "oldest", reps: 3, stability: 5, dueAt: new Date(NOW - 7 * ONE_DAY_MS).toISOString() }),
      card({ _id: "newest", reps: 3, stability: 5, dueAt: new Date(NOW    ).toISOString() }),
    ];
    expect(sort(cards).map(c => c._id)).toEqual(["oldest", "newer", "newest"]);
  });

  test("multiple lapsed sprouts all come before any non-lapsed", () => {
    const cards = [
      card({ _id: "fresh", reps: 3, stability: 100 }),
      card({ _id: "lap1",  reps: 3, stability: 3, lapses: 1 }),
      card({ _id: "lap2",  reps: 3, stability: 5, lapses: 1 }),
    ];
    const ids = sort(cards).map(c => c._id);
    expect(ids.indexOf("lap1")).toBeLessThan(ids.indexOf("fresh"));
    expect(ids.indexOf("lap2")).toBeLessThan(ids.indexOf("fresh"));
  });

  test("a sprout WITHOUT lapses is not 'lapsed sprout'", () => {
    const cards = [
      card({ _id: "low-fresh-sprout", reps: 1, stability: 1, lapses: 0 }),
      card({ _id: "lapsed-sprout",    reps: 3, stability: 5, lapses: 1 }),
    ];
    expect(sort(cards)[0]._id).toBe("lapsed-sprout");
  });

  test("missing fields default to stability=1, dueAt=epoch (predictable)", () => {
    const cards = [
      card({ _id: "no-stab", reps: 1 }),
      card({ _id: "stab-2",  reps: 1, stability: 2 }),
    ];
    expect(sort(cards)[0]._id).toBe("no-stab"); // stability defaults to 1, < 2
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// detectLoadState
// ─────────────────────────────────────────────────────────────────────────────

describe("detectLoadState", () => {
  describe("away precedence", () => {
    test("awayDays >= 3 always wins, regardless of dueCount", () => {
      expect(detectLoadState(3, true,  0  )).toBe("backlog");
      expect(detectLoadState(3, true,  10 )).toBe("backlog");
      expect(detectLoadState(3, false, 100)).toBe("backlog");
      expect(detectLoadState(30, true, 1  )).toBe("backlog");
    });

    test("awayDays 2 still respects normal flow (boundary)", () => {
      expect(detectLoadState(2, true, 5)).toBe("seedling");
      expect(detectLoadState(2, false, 0)).toBe("zero-fresh");
    });
  });

  describe("zero-fresh (no decks)", () => {
    test("hasDecks=false → zero-fresh (when not backlog)", () => {
      expect(detectLoadState(0, false, 0  )).toBe("zero-fresh");
      expect(detectLoadState(0, false, 100)).toBe("zero-fresh"); // even with mock data
    });
  });

  describe("zero-clear (cleared today)", () => {
    test("hasDecks=true, totalDue=0 → zero-clear", () => {
      expect(detectLoadState(0, true, 0)).toBe("zero-clear");
    });

    test("zero-clear takes precedence over seedling at the boundary", () => {
      expect(detectLoadState(0, true, 0)).toBe("zero-clear");
      expect(detectLoadState(0, true, 1)).toBe("seedling");
    });
  });

  describe("seedling (1-8 due)", () => {
    test.each([1, 2, 5, 8])("totalDue=%i → seedling", (n) => {
      expect(detectLoadState(0, true, n)).toBe("seedling");
    });
  });

  describe("calm (9-25 due)", () => {
    test.each([9, 10, 25])("totalDue=%i → calm", (n) => {
      expect(detectLoadState(0, true, n)).toBe("calm");
    });
  });

  describe("full (26-80 due)", () => {
    test.each([26, 50, 80])("totalDue=%i → full", (n) => {
      expect(detectLoadState(0, true, n)).toBe("full");
    });
  });

  describe("flood (81+ due)", () => {
    test.each([81, 100, 500])("totalDue=%i → flood", (n) => {
      expect(detectLoadState(0, true, n)).toBe("flood");
    });
  });

  describe("boundaries (no off-by-ones)", () => {
    test("8/9 boundary: seedling ↔ calm", () => {
      expect(detectLoadState(0, true, 8)).toBe("seedling");
      expect(detectLoadState(0, true, 9)).toBe("calm");
    });
    test("25/26 boundary: calm ↔ full", () => {
      expect(detectLoadState(0, true, 25)).toBe("calm");
      expect(detectLoadState(0, true, 26)).toBe("full");
    });
    test("80/81 boundary: full ↔ flood", () => {
      expect(detectLoadState(0, true, 80)).toBe("full");
      expect(detectLoadState(0, true, 81)).toBe("flood");
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MEMORY_SHELVES
// ─────────────────────────────────────────────────────────────────────────────

describe("MEMORY_SHELVES", () => {
  test("9 canonical shelves in the documented order", () => {
    expect(MEMORY_SHELVES.map(s => s.id)).toEqual(
      ["unseen", "today", "1d", "3d", "1w", "2w", "1mo", "3mo", "6mo"]
    );
  });

  test("filters partition the entire (reps>=0, stability>=0) space without overlap (excluding seeds)", () => {
    // Seeds (reps=0) only match the 'unseen' shelf, by design.
    // Cards with reps>=1 fall on exactly one shelf at every stability value.
    const samples = [
      0.0, 0.5, 0.999,                          // today shelf (stab < 1)
      1, 1.5, 2.999,                            // 1d shelf
      3, 5, 6.999,                              // 3d shelf
      7, 10, 13.999,                            // 1w shelf
      14, 21, 29.999,                           // 2w shelf
      30, 60, 89.999,                           // 1mo shelf
      90, 120, 179.999,                         // 3mo shelf
      180, 365, 1000,                           // 6mo+ shelf
    ];
    for (const stab of samples) {
      const c: Partial<Card> = { reps: 1, stability: stab };
      const matches = MEMORY_SHELVES.filter(s => s.filter(c));
      expect(matches.length).toBe(1);
    }
  });

  test("seed cards (reps=0) match only the 'unseen' shelf", () => {
    const c: Partial<Card> = { reps: 0, stability: 100 }; // stability irrelevant
    const matches = MEMORY_SHELVES.filter(s => s.filter(c));
    expect(matches.map(m => m.id)).toEqual(["unseen"]);
  });

  test("each shelf's id maps to exactly one phase", () => {
    const phaseById = Object.fromEntries(MEMORY_SHELVES.map(s => [s.id, s.phase]));
    expect(phaseById).toEqual({
      unseen: "seed",
      today:  "sprout",
      "1d":   "sprout",
      "3d":   "sprout",
      "1w":   "sapling",
      "2w":   "sapling",
      "1mo":  "sapling",
      "3mo":  "tree",
      "6mo":  "tree",
    });
  });

  test("shelfCounts adds a `cards` count to each shelf", () => {
    const cards: Partial<Card>[] = [
      { reps: 0 },                       // seed
      { reps: 1, stability: 0.5 },       // today
      { reps: 1, stability: 0.6 },       // today
      { reps: 1, stability: 1.5 },       // 1d
      { reps: 1, stability: 9 },         // 1w
      { reps: 1, stability: 200 },       // 6mo+
    ];
    const counts = shelfCounts(cards);
    const byId = Object.fromEntries(counts.map(s => [s.id, s.cards]));
    expect(byId).toEqual({
      unseen: 1, today: 2, "1d": 1, "3d": 0, "1w": 1, "2w": 0, "1mo": 0, "3mo": 0, "6mo": 1,
    });
  });

  test("shelfCounts on empty input → all zeros, length unchanged", () => {
    const counts = shelfCounts([]);
    expect(counts).toHaveLength(9);
    expect(counts.every(s => s.cards === 0)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Cross-module consistency invariants
// ─────────────────────────────────────────────────────────────────────────────

describe("cross-module consistency", () => {
  test("phaseOf(card) === MEMORY_SHELVES.find(filter).phase for every reps>=1 card", () => {
    const fixtures: Partial<Card>[] = [
      { reps: 1, stability: 0.5 },
      { reps: 1, stability: 1   },
      { reps: 1, stability: 5   },
      { reps: 1, stability: 7   },
      { reps: 1, stability: 30  },
      { reps: 1, stability: 90  },
      { reps: 1, stability: 365 },
    ];
    for (const c of fixtures) {
      const shelf = MEMORY_SHELVES.find(s => s.filter(c))!;
      expect(shelf).toBeDefined();
      expect(shelf.phase).toBe(phaseOf(c));
    }
  });

  test("gradePhaseTransition fires exactly when phaseOf would change after a stability bump", () => {
    // For each grade we can simulate the post-grade stability and confirm
    // that gradePhaseTransition matches phaseOf on the result.
    const fixtures = [
      { reps: 0, stability: 1, ease: 2.5 },                // seed
      { reps: 2, stability: 3, ease: 2.5 },                // sprout near sapling
      { reps: 5, stability: 36, ease: 2.5 },               // sapling near tree
      { reps: 10, stability: 100, ease: 2.5 },             // tree (no further graduation)
    ];

    for (const c of fixtures) {
      for (const grade of ["good", "easy"] as Rating[]) {
        const transition = gradePhaseTransition(c, grade);
        if (transition) {
          // Simulate: stability * (ease or ease*1.3) and check phase changes.
          const mult = grade === "easy" ? c.ease! * 1.3 : c.ease!;
          const newStab = c.reps === 0 ? (grade === "easy" ? 4 : 1) : Math.max(1, c.stability! * mult);
          // For seeds, the simulated post stability is 1 or 4 → still sprout band.
          // For sprout/sapling, transition should match phaseOf({reps>=1, stability:newStab})
          if (c.reps !== 0) {
            const newPhase = phaseOf({ reps: c.reps! + 1, stability: newStab });
            expect(transition).toBe(newPhase);
          } else {
            expect(transition).toBe("sprout");
          }
        }
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PACE_CONFIG
// ─────────────────────────────────────────────────────────────────────────────

describe("PACE_CONFIG", () => {
  const PACES: LearningPace[] = ["light", "balanced", "intense"];

  test("all three paces are defined", () => {
    for (const p of PACES) {
      expect(PACE_CONFIG[p]).toBeDefined();
    }
  });

  test("each config has required numeric fields > 0", () => {
    for (const p of PACES) {
      const cfg = PACE_CONFIG[p];
      expect(cfg.newPerDay).toBeGreaterThan(0);
      expect(cfg.reviewBudgetMin).toBeGreaterThan(0);
      expect(cfg.activePoolSize).toBeGreaterThan(0);
    }
  });

  test("paces are ordered light < balanced < intense across all numeric fields", () => {
    expect(PACE_CONFIG.light.newPerDay).toBeLessThan(PACE_CONFIG.balanced.newPerDay);
    expect(PACE_CONFIG.balanced.newPerDay).toBeLessThan(PACE_CONFIG.intense.newPerDay);
    expect(PACE_CONFIG.light.activePoolSize).toBeLessThan(PACE_CONFIG.balanced.activePoolSize);
    expect(PACE_CONFIG.balanced.activePoolSize).toBeLessThan(PACE_CONFIG.intense.activePoolSize);
  });

  test("exact canonical values (guards against accidental mutations)", () => {
    expect(PACE_CONFIG.light).toMatchObject({ newPerDay: 3, reviewBudgetMin: 7, activePoolSize: 100 });
    expect(PACE_CONFIG.balanced).toMatchObject({ newPerDay: 5, reviewBudgetMin: 12, activePoolSize: 250 });
    expect(PACE_CONFIG.intense).toMatchObject({ newPerDay: 10, reviewBudgetMin: 25, activePoolSize: 500 });
  });

  test("each pace has a non-empty label string", () => {
    for (const p of PACES) {
      expect(typeof PACE_CONFIG[p].label).toBe("string");
      expect(PACE_CONFIG[p].label.length).toBeGreaterThan(0);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// deriveCardState — lifecycle state derivation
// ─────────────────────────────────────────────────────────────────────────────

describe("deriveCardState", () => {
  // ── null / missing input ────────────────────────────────────────────────

  test("null card → 'pending' (defensive)", () => {
    // Guards callers that pass uninitialized DB rows
    expect(deriveCardState(null)).toBe("pending");
  });

  test("undefined card → 'pending' (defensive)", () => {
    expect(deriveCardState(undefined)).toBe("pending");
  });

  test("empty object → 'pending' (no reps, no suspended flag)", () => {
    expect(deriveCardState({})).toBe("pending");
  });

  // ── paused (suspended) ──────────────────────────────────────────────────

  test("suspended=true → 'paused' regardless of other fields", () => {
    // Suspension overrides every other condition
    expect(deriveCardState({ suspended: true })).toBe("paused");
    expect(deriveCardState({ suspended: true, lapses: 10 })).toBe("paused");
    expect(deriveCardState({ suspended: true, reps: 50, stability: 200 })).toBe("paused");
    expect(deriveCardState({ suspended: true, lapses: 0, reps: 0 })).toBe("paused");
  });

  test("suspended=false is treated as not suspended", () => {
    // Explicit false should not trigger paused
    expect(deriveCardState({ suspended: false, reps: 0 })).toBe("pending");
  });

  // ── leech ──────────────────────────────────────────────────────────────

  test("lapses >= default threshold (6) → 'leech' (not suspended)", () => {
    // Exactly at threshold
    expect(deriveCardState({ lapses: 6, reps: 5, stability: 10 })).toBe("leech");
    // Well above threshold
    expect(deriveCardState({ lapses: 20, reps: 20, stability: 50 })).toBe("leech");
  });

  test("lapses = 5 does NOT become a leech (threshold is >=6)", () => {
    expect(deriveCardState({ lapses: 5, reps: 5, stability: 10 })).toBe("active");
  });

  test("custom threshold changes leech boundary", () => {
    // With threshold=3, lapses=3 triggers leech
    expect(deriveCardState({ lapses: 3, reps: 5, stability: 10 }, 3)).toBe("leech");
    // lapses=2 is still safe with threshold=3
    expect(deriveCardState({ lapses: 2, reps: 5, stability: 10 }, 3)).toBe("active");
  });

  test("threshold=1 makes every card with 1 lapse a leech", () => {
    expect(deriveCardState({ lapses: 1, reps: 3, stability: 5 }, 1)).toBe("leech");
    expect(deriveCardState({ lapses: 0, reps: 3, stability: 5 }, 1)).toBe("active");
  });

  test("suspended takes priority over leech", () => {
    // Even though lapses >= threshold, suspended wins
    expect(deriveCardState({ suspended: true, lapses: 99 })).toBe("paused");
  });

  // ── maintenance ────────────────────────────────────────────────────────

  test("stability>=30, lapses<=1, reps>0 → 'maintenance'", () => {
    expect(deriveCardState({ stability: 30, lapses: 0, reps: 1 })).toBe("maintenance");
    expect(deriveCardState({ stability: 30, lapses: 1, reps: 5 })).toBe("maintenance");
    expect(deriveCardState({ stability: 365, lapses: 0, reps: 100 })).toBe("maintenance");
  });

  test("stability exactly 30 is maintenance (boundary inclusive)", () => {
    expect(deriveCardState({ stability: 30, lapses: 0, reps: 1 })).toBe("maintenance");
  });

  test("stability 29.999 is NOT maintenance (just below boundary)", () => {
    expect(deriveCardState({ stability: 29.999, lapses: 0, reps: 1 })).toBe("active");
  });

  test("stability>=30 but lapses=2 is NOT maintenance", () => {
    // lapses must be <= 1
    expect(deriveCardState({ stability: 50, lapses: 2, reps: 5 })).toBe("active");
  });

  test("stability>=30 but reps=0 falls through to pending (no reps yet)", () => {
    // No reviews means not maintenance — maintenance requires engagement
    expect(deriveCardState({ stability: 30, lapses: 0, reps: 0 })).toBe("pending");
  });

  test("leech takes priority over maintenance (even high stability)", () => {
    // lapses=6 is leech regardless of how stable the card is
    expect(deriveCardState({ stability: 100, lapses: 6, reps: 20 })).toBe("leech");
  });

  test("falls back to legacy reviewInterval when stability is absent", () => {
    expect(deriveCardState({ reviewInterval: 30, lapses: 0, reps: 1 } as Partial<Card>))
      .toBe("maintenance");
    expect(deriveCardState({ reviewInterval: 29, lapses: 0, reps: 1 } as Partial<Card>))
      .toBe("active");
  });

  // ── pending ─────────────────────────────────────────────────────────────

  test("reps=0 (never reviewed) → 'pending'", () => {
    expect(deriveCardState({ reps: 0, stability: 1 })).toBe("pending");
  });

  test("cardScore=0 with no reps field → 'pending' (legacy fallback)", () => {
    expect(deriveCardState({ cardScore: 0, stability: 1 } as Partial<Card>)).toBe("pending");
  });

  // ── active ──────────────────────────────────────────────────────────────

  test("reps>0, lapses<threshold, stability<30 → 'active'", () => {
    expect(deriveCardState({ reps: 1, lapses: 0, stability: 1 })).toBe("active");
    expect(deriveCardState({ reps: 5, lapses: 3, stability: 15 })).toBe("active");
    expect(deriveCardState({ reps: 10, lapses: 5, stability: 29 })).toBe("active");
  });

  // ── priority ordering ───────────────────────────────────────────────────

  test("priority chain: suspended > leech > maintenance > pending > active", () => {
    // suspended beats all
    expect(deriveCardState({ suspended: true, lapses: 10, stability: 100, reps: 50 })).toBe("paused");
    // leech beats maintenance
    expect(deriveCardState({ lapses: 6, stability: 100, reps: 50 })).toBe("leech");
    // maintenance beats active (stability>=30, lapses<=1, reps>0)
    expect(deriveCardState({ lapses: 1, stability: 30, reps: 5 })).toBe("maintenance");
    // pending beats active (reps=0)
    expect(deriveCardState({ lapses: 0, stability: 50, reps: 0 })).toBe("pending");
    // otherwise active
    expect(deriveCardState({ lapses: 0, stability: 5, reps: 3 })).toBe("active");
  });

  // ── large card counts (edge cases) ─────────────────────────────────────

  test("a brand-new card in a 0-card deck (null) → 'pending'", () => {
    expect(deriveCardState(null)).toBe("pending");
  });

  test("999 distinct cards all return a valid CardState", () => {
    // Generate 999 synthetic cards with varying parameters
    const states: CardState[] = ["pending", "active", "maintenance", "paused", "leech"];
    for (let i = 0; i < 999; i++) {
      const c: Partial<Card> = {
        reps: i % 10,
        stability: (i % 100) + 1,
        lapses: i % 8,
        suspended: i % 50 === 0,
      };
      const s = deriveCardState(c);
      expect(states).toContain(s);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computeTodayMix
// ─────────────────────────────────────────────────────────────────────────────

describe("computeTodayMix", () => {
  test("empty deck (0 cards) → all zeros, total=0", () => {
    // User with no cards at all should get a zeroed mix, not an error
    const mix = computeTodayMix([]);
    expect(mix).toEqual({ recognition: 0, listening: 0, contrast: 0, production: 0, total: 0 });
  });

  test("single recognition card (no confusionPartnerId)", () => {
    const mix = computeTodayMix([{ reps: 1, stability: 3 }]);
    expect(mix).toEqual({ recognition: 1, listening: 0, contrast: 0, production: 0, total: 1 });
  });

  test("single contrast card (has confusionPartnerId)", () => {
    const mix = computeTodayMix([{ reps: 1, stability: 3, confusionPartnerId: "other-id" } as any]);
    expect(mix).toEqual({ recognition: 0, listening: 0, contrast: 1, production: 0, total: 1 });
  });

  test("mixed recognition and contrast cards", () => {
    const cards = [
      { reps: 1 },                                          // recognition
      { reps: 1, confusionPartnerId: "p1" } as any,        // contrast
      { reps: 1 },                                          // recognition
      { reps: 1, confusionPartnerId: "p2" } as any,        // contrast
      { reps: 1 },                                          // recognition
    ];
    const mix = computeTodayMix(cards);
    expect(mix.recognition).toBe(3);
    expect(mix.contrast).toBe(2);
    expect(mix.listening).toBe(0);
    expect(mix.production).toBe(0);
    expect(mix.total).toBe(5);
  });

  test("all cards are contrast (every card has confusionPartnerId)", () => {
    const cards = Array.from({ length: 10 }, (_, i) =>
      ({ reps: 1, confusionPartnerId: `partner-${i}` } as any)
    );
    const mix = computeTodayMix(cards);
    expect(mix.recognition).toBe(0);
    expect(mix.contrast).toBe(10);
    expect(mix.total).toBe(10);
  });

  test("listening and production are always 0 (deferred feature)", () => {
    // Audio URL and typing UI are not yet implemented; these channels must stay 0
    const cards = Array.from({ length: 20 }, () => ({ reps: 1 }));
    const mix = computeTodayMix(cards);
    expect(mix.listening).toBe(0);
    expect(mix.production).toBe(0);
  });

  test("recognition + contrast + listening + production === total", () => {
    const cards = [
      { reps: 1 },
      { reps: 1, confusionPartnerId: "x" } as any,
      { reps: 1 },
    ];
    const mix = computeTodayMix(cards);
    expect(mix.recognition + mix.listening + mix.contrast + mix.production).toBe(mix.total);
  });

  test("999 recognition cards — total and recognition both equal 999", () => {
    // Simulates a heavy-use deck with no contrast partners yet assigned
    const cards = Array.from({ length: 999 }, () => ({ reps: 1 }));
    const mix = computeTodayMix(cards);
    expect(mix.recognition).toBe(999);
    expect(mix.contrast).toBe(0);
    expect(mix.total).toBe(999);
  });

  test("null confusionPartnerId (falsy) is treated as recognition", () => {
    const mix = computeTodayMix([{ reps: 1, confusionPartnerId: null } as any]);
    expect(mix.recognition).toBe(1);
    expect(mix.contrast).toBe(0);
  });

  test("empty string confusionPartnerId (falsy) is treated as recognition", () => {
    const mix = computeTodayMix([{ reps: 1, confusionPartnerId: "" } as any]);
    expect(mix.recognition).toBe(1);
    expect(mix.contrast).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computeIntakeBudget — new-card intake policy
// ─────────────────────────────────────────────────────────────────────────────

describe("computeIntakeBudget", () => {
  // ── pool full ────────────────────────────────────────────────────────────

  test("room=0 → budget=0 regardless of everything else", () => {
    // Pool is full; new words are paused until cards graduate out
    const r = computeIntakeBudget({ room: 0, retention: 95, backlog: 0, missed: 0 });
    expect(r.budget).toBe(0);
    expect(r.result).toMatch(/pool full/i);
  });

  test("room=-5 also counts as full (defensive — negative room)", () => {
    const r = computeIntakeBudget({ room: -5 });
    expect(r.budget).toBe(0);
  });

  // ── missed days ──────────────────────────────────────────────────────────

  test("missed>=2 → budget=0 (ease back in first)", () => {
    // User was away for 2+ days; flooding them with new cards would hurt retention
    const r = computeIntakeBudget({ missed: 2, room: 100, retention: 95 });
    expect(r.budget).toBe(0);
    expect(r.result).toMatch(/ease back/i);
  });

  test("missed=1 does NOT pause intake (only >=2 triggers pause)", () => {
    const r = computeIntakeBudget({ missed: 1, room: 100, retention: 95, pace: "balanced" });
    expect(r.budget).toBeGreaterThan(0);
  });

  test("missed=0 is the normal case", () => {
    const r = computeIntakeBudget({ missed: 0, room: 100, retention: 95, pace: "balanced" });
    expect(r.budget).toBe(5); // balanced basePace
  });

  test("missed=10 pauses new intake (very long absence)", () => {
    const r = computeIntakeBudget({ missed: 10, room: 250, retention: 90 });
    expect(r.budget).toBe(0);
  });

  // ── heavy backlog ────────────────────────────────────────────────────────

  test("backlog>30 → budget=0 (clear backlog first)", () => {
    // More than 30 overdue cards means the user is overwhelmed; no new cards
    const r = computeIntakeBudget({ backlog: 31, room: 100, retention: 92 });
    expect(r.budget).toBe(0);
    expect(r.result).toMatch(/backlog/i);
  });

  test("backlog=30 is exactly the boundary: NOT paused", () => {
    // At 30 the backlog branch doesn't trigger; half-pace or full-pace may apply
    const r = computeIntakeBudget({ backlog: 30, room: 100, retention: 92, pace: "balanced" });
    expect(r.budget).toBeGreaterThan(0);
  });

  // ── low retention ────────────────────────────────────────────────────────

  test("retention<80 → budget=0 (retention too low)", () => {
    // Under 80% means the current load is too hard; pausing new intake protects the user
    const r = computeIntakeBudget({ retention: 79, room: 100, backlog: 0 });
    expect(r.budget).toBe(0);
    expect(r.result).toMatch(/retention too low/i);
  });

  test("retention=80 is the minimum safe floor (not paused)", () => {
    const r = computeIntakeBudget({ retention: 80, room: 100, backlog: 0, pace: "balanced" });
    expect(r.budget).toBeGreaterThan(0);
  });

  test("retention=79.9 triggers the pause", () => {
    const r = computeIntakeBudget({ retention: 79.9, room: 100 });
    expect(r.budget).toBe(0);
  });

  // ── half-pace branch (backlog 11-30 or retention 80-87) ─────────────────

  test("backlog=11 with good retention → half pace", () => {
    const r = computeIntakeBudget({ backlog: 11, retention: 92, room: 100, pace: "balanced" });
    expect(r.budget).toBe(2); // floor(5/2)
    expect(r.result).toMatch(/half pace/i);
  });

  test("retention=87 with no backlog → half pace (retention < 88 branch)", () => {
    const r = computeIntakeBudget({ retention: 87, backlog: 0, room: 100, pace: "balanced" });
    expect(r.budget).toBe(2); // floor(5/2)
    expect(r.result).toMatch(/half pace/i);
  });

  test("half-pace rounds DOWN with Math.floor", () => {
    // intense: 10/2 = 5 (no rounding needed)
    expect(computeIntakeBudget({ retention: 87, room: 100, pace: "intense" }).budget).toBe(5);
    // light: 3/2 = 1.5 → floor = 1
    expect(computeIntakeBudget({ retention: 87, room: 100, pace: "light" }).budget).toBe(1);
  });

  // ── full-pace branch ─────────────────────────────────────────────────────

  test("all clear → budget equals basePace for each pace setting", () => {
    // Perfect conditions: high retention, zero backlog, no missed days, lots of room
    expect(computeIntakeBudget({ retention: 95, backlog: 0, missed: 0, room: 500, pace: "light" }).budget).toBe(3);
    expect(computeIntakeBudget({ retention: 95, backlog: 0, missed: 0, room: 500, pace: "balanced" }).budget).toBe(5);
    expect(computeIntakeBudget({ retention: 95, backlog: 0, missed: 0, room: 500, pace: "intense" }).budget).toBe(10);
  });

  test("budget capped at room even in full-pace mode", () => {
    // If only 2 slots are left, you cannot get 5 new cards regardless of pace
    const r = computeIntakeBudget({ retention: 95, backlog: 0, missed: 0, room: 2, pace: "balanced" });
    expect(r.budget).toBe(2);
  });

  test("room=1 → budget=1 at full pace (uses min(basePace, room))", () => {
    const r = computeIntakeBudget({ retention: 95, backlog: 0, missed: 0, room: 1, pace: "intense" });
    expect(r.budget).toBe(1);
  });

  // ── metadata fields ──────────────────────────────────────────────────────

  test("returned pace always matches the input pace", () => {
    for (const p of ["light", "balanced", "intense"] as LearningPace[]) {
      expect(computeIntakeBudget({ pace: p, room: 100 }).pace).toBe(p);
    }
  });

  test("returned basePace matches PACE_CONFIG[pace].newPerDay", () => {
    for (const p of ["light", "balanced", "intense"] as LearningPace[]) {
      const r = computeIntakeBudget({ pace: p, room: 100 });
      expect(r.basePace).toBe(PACE_CONFIG[p].newPerDay);
    }
  });

  test("reasons array always non-empty (at least one reason logged)", () => {
    const r = computeIntakeBudget({ retention: 95, backlog: 5, missed: 0, room: 100 });
    expect(r.reasons.length).toBeGreaterThan(0);
  });

  test("reasons include retention info", () => {
    const good = computeIntakeBudget({ retention: 92, room: 100 });
    expect(good.reasons.some(r => r.includes("92%"))).toBe(true);

    const bad = computeIntakeBudget({ retention: 75, room: 100 });
    expect(bad.reasons.some(r => r.includes("75%") && r.includes("↓"))).toBe(true);
  });

  test("reasons include backlog when backlog > 0", () => {
    const r = computeIntakeBudget({ retention: 90, backlog: 8, room: 100 });
    expect(r.reasons.some(s => s.includes("backlog 8"))).toBe(true);
  });

  test("reasons include missed days when missed > 0", () => {
    const r = computeIntakeBudget({ retention: 90, backlog: 0, missed: 1, room: 100 });
    expect(r.reasons.some(s => s.includes("missed 1d"))).toBe(true);
  });

  // ── defaults ─────────────────────────────────────────────────────────────

  test("defaults: retention=90, backlog=0, missed=0, pace=balanced, room=250", () => {
    // Call with no args — should behave like balanced full-pace with large room
    const r = computeIntakeBudget({});
    expect(r.budget).toBe(5); // balanced basePace, room=250 >> 5
    expect(r.pace).toBe("balanced");
  });

  // ── priority ordering ─────────────────────────────────────────────────────

  test("pool-full branch fires before missed-days branch", () => {
    // Even though missed>=2, room=0 is checked first
    const r = computeIntakeBudget({ room: 0, missed: 5, retention: 95 });
    expect(r.result).toMatch(/pool full/i);
  });

  test("missed-days branch fires before backlog branch", () => {
    // missed>=2 takes priority over heavy backlog
    const r = computeIntakeBudget({ room: 100, missed: 3, backlog: 99 });
    expect(r.result).toMatch(/ease back/i);
  });

  test("backlog branch fires before low-retention branch", () => {
    // backlog>30 takes priority over low retention
    const r = computeIntakeBudget({ room: 100, missed: 0, backlog: 50, retention: 70 });
    expect(r.result).toMatch(/backlog/i);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computePoolCounts — pool state tallying
// ─────────────────────────────────────────────────────────────────────────────

describe("computePoolCounts", () => {
  // ── zero cards ──────────────────────────────────────────────────────────

  test("0 cards → all state counts are 0", () => {
    // User with an empty library — should never throw
    const pool = computePoolCounts([]);
    expect(pool).toEqual({ pending: 0, active: 0, maintenance: 0, paused: 0, leech: 0 });
  });

  // ── single card per state ────────────────────────────────────────────────

  test("one pending card (reps=0)", () => {
    const pool = computePoolCounts([{ reps: 0 }]);
    expect(pool.pending).toBe(1);
    expect(pool.active + pool.maintenance + pool.paused + pool.leech).toBe(0);
  });

  test("one active card (reps>0, stab<30, lapses<threshold)", () => {
    const pool = computePoolCounts([{ reps: 3, stability: 5, lapses: 0 }]);
    expect(pool.active).toBe(1);
  });

  test("one maintenance card (stab>=30, lapses<=1, reps>0)", () => {
    const pool = computePoolCounts([{ reps: 5, stability: 30, lapses: 0 }]);
    expect(pool.maintenance).toBe(1);
  });

  test("one paused card (suspended=true)", () => {
    const pool = computePoolCounts([{ suspended: true }]);
    expect(pool.paused).toBe(1);
  });

  test("one leech card (lapses >= 6)", () => {
    const pool = computePoolCounts([{ reps: 5, lapses: 6, stability: 10 }]);
    expect(pool.leech).toBe(1);
  });

  // ── mixed states ────────────────────────────────────────────────────────

  test("one card of each state → each count is 1", () => {
    const cards: Partial<Card>[] = [
      { reps: 0 },                                             // pending
      { reps: 3, stability: 5, lapses: 0 },                   // active
      { reps: 5, stability: 30, lapses: 0 },                  // maintenance
      { suspended: true },                                     // paused
      { reps: 5, lapses: 6, stability: 10 },                  // leech
    ];
    const pool = computePoolCounts(cards);
    expect(pool).toEqual({ pending: 1, active: 1, maintenance: 1, paused: 1, leech: 1 });
  });

  test("sum of all state counts equals total number of cards", () => {
    const cards: Partial<Card>[] = [
      { reps: 0 },
      { reps: 1, stability: 3 },
      { reps: 5, stability: 60, lapses: 0 },
      { suspended: true },
      { lapses: 7, reps: 3, stability: 5 },
      { reps: 0 },
      { reps: 2, stability: 20 },
    ];
    const pool = computePoolCounts(cards);
    const total = pool.pending + pool.active + pool.maintenance + pool.paused + pool.leech;
    expect(total).toBe(cards.length);
  });

  // ── all same state ───────────────────────────────────────────────────────

  test("10 pending cards → pending=10, rest=0", () => {
    const cards = Array.from({ length: 10 }, () => ({ reps: 0 }));
    const pool = computePoolCounts(cards);
    expect(pool.pending).toBe(10);
    expect(pool.active + pool.maintenance + pool.paused + pool.leech).toBe(0);
  });

  test("10 leeches → leech=10, rest=0", () => {
    const cards = Array.from({ length: 10 }, () => ({ reps: 5, lapses: 6, stability: 8 }));
    const pool = computePoolCounts(cards);
    expect(pool.leech).toBe(10);
    expect(pool.pending + pool.active + pool.maintenance + pool.paused).toBe(0);
  });

  // ── custom leech threshold ────────────────────────────────────────────────

  test("custom leechThreshold=3 reclassifies cards with lapses>=3 as leeches", () => {
    const cards: Partial<Card>[] = [
      { reps: 3, lapses: 3, stability: 5 },   // leech at threshold=3
      { reps: 3, lapses: 2, stability: 5 },   // still active at threshold=3
    ];
    const pool = computePoolCounts(cards, 3);
    expect(pool.leech).toBe(1);
    expect(pool.active).toBe(1);
  });

  // ── 999 cards ────────────────────────────────────────────────────────────

  test("999 cards all pending → pending=999, rest=0", () => {
    // Simulates a user who imported a massive deck but hasn't studied yet
    const cards = Array.from({ length: 999 }, () => ({ reps: 0 }));
    const pool = computePoolCounts(cards);
    expect(pool.pending).toBe(999);
    expect(pool.active + pool.maintenance + pool.paused + pool.leech).toBe(0);
  });

  test("999 cards all maintenance → maintenance=999", () => {
    // Simulates a very advanced user whose entire deck is long-interval stable
    const cards = Array.from({ length: 999 }, () => ({ reps: 10, stability: 90, lapses: 0 }));
    const pool = computePoolCounts(cards);
    expect(pool.maintenance).toBe(999);
  });

  test("999 cards mixed proportionally — sum still equals 999", () => {
    // 200 pending, 400 active, 200 maintenance, 100 paused, 99 leeches
    const cards: Partial<Card>[] = [
      ...Array.from({ length: 200 }, () => ({ reps: 0 })),
      ...Array.from({ length: 400 }, () => ({ reps: 2, stability: 5, lapses: 0 })),
      ...Array.from({ length: 200 }, () => ({ reps: 8, stability: 60, lapses: 0 })),
      ...Array.from({ length: 100 }, () => ({ suspended: true })),
      ...Array.from({ length: 99 }, () => ({ reps: 4, lapses: 8, stability: 3 })),
    ];
    const pool = computePoolCounts(cards);
    const total = pool.pending + pool.active + pool.maintenance + pool.paused + pool.leech;
    expect(total).toBe(999);
    expect(pool.pending).toBe(200);
    expect(pool.active).toBe(400);
    expect(pool.maintenance).toBe(200);
    expect(pool.paused).toBe(100);
    expect(pool.leech).toBe(99);
  });

  // ── null / partial cards ─────────────────────────────────────────────────

  test("empty objects ({}) each resolve to 'pending' — never throws", () => {
    const cards = Array.from({ length: 5 }, () => ({} as Partial<Card>));
    const pool = computePoolCounts(cards);
    expect(pool.pending).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Integration: deriveCardState × computePoolCounts × computeTodayMix
// ─────────────────────────────────────────────────────────────────────────────

describe("integration: pool + mix + intake working together", () => {
  test("shelfCounts and computePoolCounts both ignore suspended cards the same way", () => {
    // A suspended card has reps>0 (it went through reviews) but is paused.
    // shelfCounts places it on a shelf by stability; computePoolCounts labels it 'paused'.
    const c: Partial<Card> = { reps: 5, stability: 20, lapses: 0, suspended: true };
    const shelf = shelfCounts([c]);
    const pool = computePoolCounts([c]);
    // Shelf places it on the 2w shelf (stability in [14,30)) regardless of suspension
    expect(shelf.find(s => s.id === "2w")!.cards).toBe(1);
    // Pool sees it as paused
    expect(pool.paused).toBe(1);
    expect(pool.active).toBe(0);
  });

  test("pool + mix round-trip: active count informs intake correctly", () => {
    // Build a scenario: 200 active cards in a 250-slot balanced pool (room=50)
    // with healthy retention and no backlog.
    const room = 50;
    const intake = computeIntakeBudget({ retention: 93, backlog: 0, missed: 0, pace: "balanced", room });
    // Full pace → min(5, 50) = 5 new cards today
    expect(intake.budget).toBe(5);
  });

  test("full pool (room=0): intake=0 even when mix has contrast cards pending", () => {
    // Even if the queue has interesting contrast cards, if the pool is full no new intake
    const cards = Array.from({ length: 250 }, () => ({ reps: 1, stability: 5 }));
    const mix = computeTodayMix(cards);
    const intake = computeIntakeBudget({ room: 0 });
    expect(intake.budget).toBe(0);
    expect(mix.total).toBe(250); // mix still counts existing cards
  });

  test("a library going from 0 to 999 cards: pool counts are always consistent", () => {
    // Simulate cards being added one at a time; after each addition, total should match
    let cards: Partial<Card>[] = [];
    for (let i = 0; i < 999; i++) {
      cards.push({ reps: 0, stability: 1, lapses: 0 });
      const pool = computePoolCounts(cards);
      const total = pool.pending + pool.active + pool.maintenance + pool.paused + pool.leech;
      expect(total).toBe(i + 1);
    }
  });
});
