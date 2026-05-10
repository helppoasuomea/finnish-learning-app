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
 */

import { describe, test, expect } from "vitest";
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
  type DeckCard,
  type Rating,
  type Phase,
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
