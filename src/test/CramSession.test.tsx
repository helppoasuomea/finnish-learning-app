import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { CramSession } from "@/components/CramComponents/CramSession";
import { CramConfig } from "@/components/CramComponents/CramTypes";
import { Card } from "@/types";

const makeCard = (id: string, userLangCard: string, engCard: string): Card => ({
  _id: id,
  userLangCard,
  engCard,
  cardScore: 0,
});

const cards = [
  makeCard("c1", "hyvä", "good"),
  makeCard("c2", "huono", "bad"),
  makeCard("c3", "kissa", "cat"),
];

const deck = { _id: "d1", deckName: "Test", cards, deckTags: ["Finnish"] };

const baseConfig = (overrides: Partial<CramConfig> = {}): CramConfig => ({
  cards,
  direction: "fi-en",
  style: "flip",
  threshold: 1,
  loop: true,
  mood: "calm",
  countAsReview: false,
  ...overrides,
});

/**
 * Reveal then grade a flip card. Uses two separate act() calls so React flushes
 * the revealed=true state update before the grade key handler executes — the
 * handler closes over `revealed` so they MUST be in separate batches.
 */
const revealAndGrade = (g: "got" | "miss") => {
  act(() => { fireEvent.keyDown(window, { key: " " }); });
  act(() => { fireEvent.keyDown(window, { key: g === "got" ? "2" : "1" }); });
};

describe("CramSession — cleared card must not stay at queue head", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("advances to the next card immediately after threshold=1 got", () => {
    render(
      <CramSession
        deck={deck}
        config={baseConfig({ threshold: 1 })}
        onExit={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText("hyvä")).toBeInTheDocument();

    revealAndGrade("got");

    expect(screen.queryByText("hyvä")).not.toBeInTheDocument();
    expect(screen.getByText("huono")).toBeInTheDocument();
  });

  it("completes and calls onComplete after all cards are cleared (threshold=1)", async () => {
    const twoCards = [makeCard("a", "auto", "car"), makeCard("b", "talo", "house")];
    const onComplete = vi.fn();

    render(
      <CramSession
        deck={{ ...deck, cards: twoCards }}
        config={baseConfig({ cards: twoCards, threshold: 1 })}
        onExit={vi.fn()}
        onComplete={onComplete}
      />,
    );

    revealAndGrade("got");  // clear first card
    revealAndGrade("got");  // clear second card

    act(() => { vi.advanceTimersByTime(500); }); // fire 420 ms onComplete timeout

    expect(onComplete).toHaveBeenCalledOnce();
    const summary = onComplete.mock.calls[0][0];
    expect(summary.cleared).toBe(2);
    expect(summary.accuracy).toBe(100);
  });

  it("does not clear a card until its streak reaches threshold=2", () => {
    // Single card so we can clearly observe it reappearing
    const oneCard = [makeCard("only", "talo", "house")];
    const onComplete = vi.fn();

    render(
      <CramSession
        deck={{ ...deck, cards: oneCard }}
        config={baseConfig({ cards: oneCard, threshold: 2 })}
        onExit={vi.fn()}
        onComplete={onComplete}
      />,
    );

    expect(screen.getByText("talo")).toBeInTheDocument();

    // First correct — streak=1, below threshold=2, not cleared
    revealAndGrade("got");
    expect(screen.getByText("talo")).toBeInTheDocument();
    expect(screen.getByText("0 / 1")).toBeInTheDocument();

    // Second correct — streak=2 ≥ threshold=2, now cleared
    revealAndGrade("got");

    act(() => { vi.advanceTimersByTime(500); });
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it("with loop=false, a missed card is cleared and session moves forward", () => {
    const twoCards = [makeCard("a", "auto", "car"), makeCard("b", "talo", "house")];
    const onComplete = vi.fn();

    render(
      <CramSession
        deck={{ ...deck, cards: twoCards }}
        config={baseConfig({ cards: twoCards, loop: false, threshold: 1 })}
        onExit={vi.fn()}
        onComplete={onComplete}
      />,
    );

    expect(screen.getByText("auto")).toBeInTheDocument();

    revealAndGrade("miss"); // loop=false → miss clears the card

    expect(screen.queryByText("auto")).not.toBeInTheDocument();
    expect(screen.getByText("talo")).toBeInTheDocument();
  });

  it("with loop=true, a missed card is requeued (comes back eventually)", () => {
    const twoCards = [makeCard("a", "auto", "car"), makeCard("b", "talo", "house")];

    render(
      <CramSession
        deck={{ ...deck, cards: twoCards }}
        config={baseConfig({ cards: twoCards, loop: true, threshold: 1 })}
        onExit={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    revealAndGrade("miss"); // "auto" missed → requeued, never at position 0

    // Current card must NOT be the one we just missed
    expect(screen.queryByText("auto")).not.toBeInTheDocument();
    expect(screen.getByText("talo")).toBeInTheDocument();

    // Clear the second card; the missed card is the only one left
    revealAndGrade("got");
    expect(screen.getByText("auto")).toBeInTheDocument();
  });

  it("a non-cleared 'got' card never immediately returns to the front (reinsert ≥ pos 1)", () => {
    // 4-card deck so there are always other cards to show; threshold=2 so grading "got"
    // once does NOT clear the card.
    const fourCards = [
      makeCard("w1", "koira", "dog"),
      makeCard("w2", "kissa", "cat"),
      makeCard("w3", "lintu", "bird"),
      makeCard("w4", "kala", "fish"),
    ];

    render(
      <CramSession
        deck={{ ...deck, cards: fourCards }}
        config={baseConfig({ cards: fourCards, threshold: 2 })}
        onExit={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText("koira")).toBeInTheDocument();

    // Grade "koira" as got (streak=1, threshold=2 → not cleared, requeued at pos ≥ 1)
    revealAndGrade("got");

    // "koira" must NOT be the immediate next card shown
    expect(screen.queryByText("koira")).not.toBeInTheDocument();
  });

  it("progress counter increments when a card is cleared", () => {
    render(
      <CramSession
        deck={deck}
        config={baseConfig({ threshold: 1 })}
        onExit={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText("0 / 3")).toBeInTheDocument();

    revealAndGrade("got");
    expect(screen.getByText("1 / 3")).toBeInTheDocument();

    revealAndGrade("got");
    expect(screen.getByText("2 / 3")).toBeInTheDocument();
  });

  it("undo after a got restores the cleared card to the front", () => {
    render(
      <CramSession
        deck={deck}
        config={baseConfig({ threshold: 1 })}
        onExit={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByText("hyvä")).toBeInTheDocument();

    revealAndGrade("got"); // clear "hyvä"
    expect(screen.queryByText("hyvä")).not.toBeInTheDocument();

    act(() => { fireEvent.keyDown(window, { key: "u" }); }); // undo
    expect(screen.getByText("hyvä")).toBeInTheDocument();
    expect(screen.getByText("0 / 3")).toBeInTheDocument();
  });
});
