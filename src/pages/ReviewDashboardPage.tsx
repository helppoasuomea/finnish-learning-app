import { useState, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Check, CalendarDays } from "lucide-react";
import { useDeckContext } from "@/contexts/DeckContext";
import { UserContext } from "@/contexts/UserContext";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ReviewSession, ReviewDone } from "@/components/ReviewSession";
import { flushQueue } from "@/utils/reviewAnswerQueue";
import { Card } from "@/types";
import {
  type DeckCard,
  type Rating,
  isDueToday as isDueTodayFn,
  detectLoadState,
  dueQueueComparator,
  MEMORY_SHELVES,
} from "@/utils/srs";
import axios from "axios";

const DAILY_CAP = 25;

const SHELF_COLOR: Record<string, string> = {
  seed:    "var(--tk-ink-4)",
  sprout:  "#C79B6E",
  sapling: "var(--tk-accent)",
  tree:    "var(--tk-accent-deep)",
};

const DAY_ABBR = ["S", "M", "T", "W", "T", "F", "S"];

function startOfDay(d = new Date()) { const r = new Date(d); r.setHours(0,0,0,0); return r; }
function endOfDay  (d = new Date()) { const r = new Date(d); r.setHours(23,59,59,999); return r; }

// ── Sub-components ────────────────────────────────────────────────────────────

const AwayBanner: React.FC<{ awayDays: number; onRestart: () => void }> = ({ awayDays, onRestart }) => (
  <div className="rv-away-banner">
    <div className="rv-away-banner-body">
      <span className="rv-away-leaf">🌿</span>
      <div>
        <div className="rv-away-title">Away for {awayDays} {awayDays === 1 ? "day" : "days"} — your streak is safe.</div>
        <div className="rv-away-sub">We held cards back gently. Nothing was pushed into 'lapsed' while you were gone.</div>
      </div>
    </div>
    <button className="rv-away-btn" onClick={onRestart}>Gentle restart</button>
  </div>
);

const NudgeIndicator: React.FC<{ hasCalendar: boolean }> = ({ hasCalendar }) => (
  <div className="rv-nudge">
    <div className="rv-nudge-label">Next nudge</div>
    {hasCalendar ? (
      <div className="rv-nudge-row">
        <div className="rv-nudge-cal-icon">
          <CalendarDays size={14} />
          <span className="rv-nudge-cal-day">17</span>
        </div>
        <div>
          <div className="rv-nudge-time">Tomorrow, 8:00 AM</div>
          <div className="rv-nudge-via">via Google Calendar</div>
        </div>
      </div>
    ) : (
      <div className="rv-nudge-connect">Connect a reminder →</div>
    )}
  </div>
);

const WhatHappensNext: React.FC = () => (
  <div className="rv-whn">
    <div className="rv-whn-title">What happens next</div>
    {[
      { phase: "seed",    label: "Seed",    desc: "you save a word" },
      { phase: "sprout",  label: "Sprout",  desc: "you recall it correctly — it moves on" },
      { phase: "sapling", label: "Sapling", desc: "the interval grows — days, then weeks" },
      { phase: "tree",    label: "Tree",    desc: "it settles into long memory" },
    ].map((r, i, arr) => (
      <div key={r.phase}>
        <div className="rv-whn-row">
          <span className={`rv-whn-badge rv-whn-badge--${r.phase}`}>{r.label}</span>
          <span className="rv-whn-desc">{r.desc}</span>
        </div>
        {i < arr.length - 1 && <div className="rv-whn-rule" />}
      </div>
    ))}
    <div className="rv-whn-footer">The schedule does the remembering. You just show up.</div>
  </div>
);

const ForecastChart: React.FC<{
  forecast: { dayAbbr: string; isToday: boolean; newN: number; learnN: number; reviewN: number; total: number }[];
  forecastMax: number;
  avgPerDay: number;
}> = ({ forecast, forecastMax, avgPerDay }) => (
  <>
    <div className="rv-hero-side-label">
      <span>14-day forecast</span>
      <span style={{ opacity: 0.7 }}>avg {avgPerDay}/day</span>
    </div>
    <div className="rv-forecast">
      {forecast.map((f, i) => {
        const totalH = 140;
        const h      = Math.max(3, (f.total / forecastMax) * totalH);
        const hNew   = f.total > 0 ? (f.newN   / f.total) * h : 0;
        const hLearn = f.total > 0 ? (f.learnN / f.total) * h : 0;
        const hRev   = h - hNew - hLearn;
        return (
          <div key={i} className="rv-fc-day" data-today={String(f.isToday)}>
            <div className="rv-fc-bar" style={{ height: h }}>
              {hNew   > 0 && <span className="rv-fc-new"      style={{ height: hNew   }} />}
              {hLearn > 0 && <span className="rv-fc-learning" style={{ height: hLearn }} />}
              {hRev   > 0 && <span className="rv-fc-review"   style={{ height: hRev   }} />}
            </div>
          </div>
        );
      })}
    </div>
    <div className="rv-fc-labels">
      {forecast.map((f, i) => (
        <div key={i} data-today={String(f.isToday)}>{i === 0 ? "T" : f.dayAbbr}</div>
      ))}
    </div>
    <div className="rv-fc-legend">
      <span><i style={{ background: "var(--tk-persimmon)" }} />new</span>
      <span><i style={{ background: "#C79B6E" }} />learning</span>
      <span><i style={{ background: "var(--tk-accent)" }} />review</span>
    </div>
  </>
);

// ── Main component ────────────────────────────────────────────────────────────

export const ReviewDashboardPage: React.FC = () => {
  const { decks, refreshDecks } = useDeckContext();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const today    = useMemo(() => startOfDay(), []);
  const todayEnd = useMemo(() => endOfDay(), []);

  const allCards = useMemo<DeckCard[]>(() =>
    decks.flatMap(d => d.cards.map(c => ({ ...c, deckId: d._id, deckName: d.deckName }))),
    [decks]
  );

  // awayDays = days since any card was last reviewed
  const awayDays = useMemo(() => {
    const reviewed = allCards.filter(c => c.lastSeenAt ?? c.lastReviewDate);
    if (reviewed.length === 0) return 0;
    const mostRecent = Math.max(...reviewed.map(c =>
      new Date(c.lastSeenAt ?? c.lastReviewDate ?? 0).getTime()
    ));
    return Math.floor((Date.now() - mostRecent) / 86400000);
  }, [allCards]);

  const dueCards = useMemo(
    () => allCards.filter(c => isDueTodayFn(c, todayEnd)),
    [allCards, todayEnd]
  );

  const sortedDue = useMemo(() => [...dueCards].sort(dueQueueComparator()), [dueCards]);

  const newCount    = useMemo(() => dueCards.filter(c => (c.reps ?? 0) === 0).length, [dueCards]);
  const learnCount  = useMemo(() => dueCards.filter(c => (c.reps ?? 0) > 0 && (c.stability ?? 1) < 1).length, [dueCards]);
  const reviewCount = useMemo(() => dueCards.filter(c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 1).length, [dueCards]);
  const totalDue    = dueCards.length;
  const overdueCount = useMemo(() =>
    allCards.filter(c => {
      if ((c.reps ?? 0) === 0) return false;
      const due = c.dueAt ?? c.nextReviewDate ?? null;
      return due && new Date(due) < today;
    }).length, [allCards, today]);

  const matureCards = useMemo(() => allCards.filter(c => (c.stability ?? 1) >= 7).length, [allCards]);

  const tomorrowDue = useMemo(() => {
    const tStart = new Date(today.getTime() + 86400000);
    const tEnd   = new Date(tStart); tEnd.setHours(23,59,59,999);
    return allCards.filter(c => {
      if ((c.reps ?? 0) === 0) return false;
      const due = c.dueAt ?? c.nextReviewDate ?? null;
      if (!due) return false;
      const d = new Date(due);
      return d >= tStart && d <= tEnd;
    }).length;
  }, [allCards, today]);

  const weekMore = useMemo(() => allCards.filter(c => {
    const dueStr = c.dueAt ?? c.nextReviewDate ?? null;
    if (!dueStr || (c.reps ?? 0) === 0) return false;
    const diff = Math.round((startOfDay(new Date(dueStr)).getTime() - today.getTime()) / 86400000);
    return diff > 0 && diff <= 7;
  }).length, [allCards, today]);

  const estMin    = Math.max(1, Math.round(totalDue * 0.3));
  const weekTotal = weekMore + totalDue;

  const forecast = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const dayStart = new Date(today.getTime() + i * 86400000);
    const dayEnd   = new Date(dayStart); dayEnd.setHours(23,59,59,999);
    const cards = allCards.filter(c => {
      if (c.suspended) return false;
      if (i === 0) return isDueTodayFn(c, dayEnd);
      if ((c.reps ?? 0) === 0) return false;
      const due = c.dueAt ?? c.nextReviewDate ?? null;
      if (!due) return false;
      const d = new Date(due);
      return d >= dayStart && d <= dayEnd;
    });
    return {
      dayAbbr:  DAY_ABBR[dayStart.getDay()],
      isToday:  i === 0,
      newN:     cards.filter(c => (c.reps ?? 0) === 0).length,
      learnN:   cards.filter(c => (c.reps ?? 0) > 0 && (c.stability ?? 1) < 1).length,
      reviewN:  cards.filter(c => (c.reps ?? 0) > 0 && (c.stability ?? 1) >= 1).length,
      total:    cards.length,
    };
  }), [allCards, today]);

  const forecastMax = useMemo(() => Math.max(1, ...forecast.map(f => f.total)), [forecast]);
  const avgPerDay   = Math.round(forecast.reduce((s, f) => s + f.total, 0) / 14);

  const shelves    = useMemo(() => MEMORY_SHELVES.map(s => ({ ...s, cards: allCards.filter(s.filter).length })), [allCards]);
  const maxShelf   = useMemo(() => Math.max(1, ...shelves.map(s => s.cards)), [shelves]);

  const nextMilestone = useMemo(() => {
    const targets = [50, 100, 200, 500, 1000, 2000];
    const target  = targets.find(t => t > matureCards) ?? 2000;
    const prevT   = targets[Math.max(0, targets.indexOf(target) - 1)] ?? 0;
    return { target, name: `${target} mature`, pct: Math.min(100, Math.round((matureCards - prevT) / Math.max(1, target - prevT) * 100)) };
  }, [matureCards]);

  const todayDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const hasDecks  = decks.length > 0;
  const loadState = detectLoadState(awayDays, hasDecks, totalDue);
  const userName  = user?.name?.split(" ")[0] ?? "";
  const streak    = user?.currentStreak ?? 0;
  const hasCalendar = user?.hasCalendarToken ?? false;

  const [session, setSession] = useState<"running" | null>(null);
  const [sessionQueue, setSessionQueue] = useState<DeckCard[]>([]);
  const [summary, setSummary] = useState<{ reviewed: number; history: { card: DeckCard; grade: Rating }[] } | null>(null);

  const handleDone = async (s: typeof summary) => {
    setSummary(s);
    await flushQueue();
    refreshDecks();
    if (!s) return;
    const userId = localStorage.getItem("userId");
    const byDeck = new Map<string, { deckId: string; correct: number; total: number }>();
    s.history.forEach(({ card, grade }) => {
      const entry = byDeck.get(card.deckId) ?? { deckId: card.deckId, correct: 0, total: 0 };
      entry.total += 1;
      if (grade === "good" || grade === "easy") entry.correct += 1;
      byDeck.set(card.deckId, entry);
    });
    byDeck.forEach(({ deckId, correct, total }) => {
      axios.post("/learning-history/save-quiz-result", {
        userId,
        deckId,
        cardsStudied: total,
        correctAnswers: correct,
        quizType: "review",
      }).catch(() => {});
    });
  };

  const startSession = (queue = sortedDue) => {
    setSessionQueue(queue);
    setSession("running");
  };

  // ── Render hero main ───────────────────────────────────────────────────────

  const renderHeroMain = () => {
    if (loadState === "zero-fresh") {
      return (
        <div className="rv-hero-main">
          <div className="rv-hero-kicker"><span className="dot" />Today · —</div>
          <div className="rv-zero-fresh-plant" aria-hidden="true">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <line x1="32" y1="56" x2="32" y2="28" stroke="var(--tk-ink-3)" strokeWidth="2" strokeLinecap="round"/>
              <path d="M32 28 C32 20 20 14 14 20 C20 20 28 24 32 28Z" fill="var(--tk-accent)" opacity="0.7"/>
              <path d="M32 34 C32 26 44 20 50 26 C44 26 36 30 32 34Z" fill="var(--tk-accent)" opacity="0.5"/>
              <ellipse cx="32" cy="57" rx="10" ry="3" fill="var(--tk-ink-4)" opacity="0.3"/>
            </svg>
          </div>
          <div className="rv-hero-serif">Nothing planted yet.</div>
          <div className="rv-hero-sub" style={{ marginBottom: 28 }}>
            Save a word from the Translate page or add a deck, and your first card will land here — ready for a gentle first review.
          </div>
          <div className="rv-hero-cta">
            <button className="rv-start-btn" onClick={() => navigate("/")}>
              <span className="rv-start-btn-label"><Play size={14} /> Go to Translate</span>
            </button>
            <button className="rv-cta-secondary" onClick={() => navigate("/view-all-decks")}>Browse starter decks →</button>
          </div>
        </div>
      );
    }

    if (loadState === "zero-clear") {
      return (
        <div className="rv-hero-main">
          <div className="rv-hero-kicker"><span className="dot" />Today · {todayDate}</div>
          <div className="rv-zero-clear-icon"><Check size={20} strokeWidth={2.5} /></div>
          <div className="rv-hero-serif">You're clear for today.</div>
          <div className="rv-hero-sub" style={{ marginBottom: 28 }}>
            Tomorrow <strong>{tomorrowDue} {tomorrowDue === 1 ? "card" : "cards"}</strong> come back for a visit.{streak > 0 ? ` Streak ${streak} is safe — rest is part of the method.` : ""}
          </div>
          <div className="rv-hero-cta">
            <button className="rv-start-btn" onClick={() => navigate("/view-all-decks")}>
              <span className="rv-start-btn-label">Browse your words</span>
            </button>
            <button className="rv-cta-secondary" onClick={() => startSession()}>Study ahead (5) →</button>
          </div>
        </div>
      );
    }

    if (loadState === "backlog") {
      return (
        <div className="rv-hero-main">
          <div className="rv-hero-kicker">
            <span className="dot" />Today · {todayDate}
            <span style={{ marginLeft: 8, fontSize: 12, fontStyle: "italic", color: "var(--tk-ink-3)" }}>· easing back in</span>
          </div>
          <div className="rv-hero-count">
            <div className="rv-hero-num">{totalDue}</div>
            <div className="rv-hero-label" style={{ fontStyle: "italic" }}>waiting for you</div>
          </div>
          <div className="rv-hero-sub">
            Some are older than they wanted to be. We'll show the ones that miss you first — one small sitting at a time.
          </div>
          <div className="rv-hero-chips">
            {overdueCount > 0 && <span className="rv-chip rv-chip--overdue"><span className="rv-chip-dot" style={{ background: "var(--tk-persimmon)" }} />{overdueCount} overdue</span>}
            {learnCount > 0   && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "#C79B6E" }} />{learnCount} learning</span>}
            {reviewCount > 0  && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-accent)" }} />{reviewCount} due today</span>}
          </div>
          <div className="rv-hero-cta">
            <button className="rv-start-btn" onClick={() => startSession(sortedDue.slice(0, DAILY_CAP))}>
              <span className="rv-start-btn-label"><Play size={14} /> Ease back in</span>
              <span className="mono">{Math.min(DAILY_CAP, totalDue)} cards · ~{Math.max(1, Math.round(Math.min(DAILY_CAP, totalDue) * 0.32))} min</span>
            </button>
            <button className="rv-cta-secondary" onClick={() => startSession()}>Show me everything</button>
          </div>
        </div>
      );
    }

    if (loadState === "seedling") {
      return (
        <div className="rv-hero-main">
          <div className="rv-hero-kicker"><span className="dot" />Today · {todayDate}</div>
          {userName && <div className="rv-hero-greeting">Welcome back, {userName}.</div>}
          <div className="rv-hero-serif">Your first handful.</div>
          <div className="rv-hero-count-inline">
            <span className="rv-hero-num">{totalDue}</span>
            <span style={{ color: "var(--tk-ink-3)", fontSize: 15, marginLeft: 10 }}>· about {estMin} {estMin === 1 ? "minute" : "minutes"}</span>
          </div>
          <div className="rv-hero-chips">
            {newCount   > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-persimmon)" }} />{newCount} new</span>}
            {learnCount > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "#C79B6E" }} />{learnCount} coming back</span>}
          </div>
          <div className="rv-hero-cta" style={{ marginBottom: 16 }}>
            <button className="rv-start-btn" onClick={() => startSession()}>
              <span className="rv-start-btn-label">🌱 Plant them</span>
              <span className="mono">{totalDue} cards</span>
            </button>
          </div>
          <div className="rv-hero-hint">
            New words bloom into <span className="rv-hero-hint-badge">Sprouts</span> after their first correct recall — then settle on longer shelves as you remember them again.
          </div>
        </div>
      );
    }

    if (loadState === "full") {
      return (
        <div className="rv-hero-main">
          <div className="rv-hero-kicker"><span className="dot" />Today · {todayDate}</div>
          <div className="rv-hero-count">
            <div className="rv-hero-num">{totalDue}</div>
            <div className="rv-hero-label">cards — a longer sit than usual</div>
          </div>
          <div className="rv-hero-sub">
            Start with {DAILY_CAP} for now, or work through everything.{weekTotal > totalDue ? ` ${weekTotal} more across the week.` : ""}
          </div>
          <div className="rv-hero-chips">
            {newCount    > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-persimmon)" }} />{newCount} new</span>}
            {learnCount  > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "#C79B6E" }} />{learnCount} learning</span>}
            {reviewCount > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-accent)" }} />{reviewCount} due review</span>}
          </div>
          <div className="rv-hero-cta">
            <button className="rv-start-btn" onClick={() => startSession(sortedDue.slice(0, DAILY_CAP))}>
              <span className="rv-start-btn-label"><Play size={14} /> Review {DAILY_CAP} now</span>
              <span className="mono">~{Math.round(DAILY_CAP * 0.32)} min</span>
            </button>
            <button className="rv-cta-secondary" onClick={() => startSession()}>Or do all {totalDue} →</button>
          </div>
        </div>
      );
    }

    if (loadState === "flood") {
      const short  = Math.round(DAILY_CAP / 2);
      const usual  = DAILY_CAP;
      const longer = DAILY_CAP * 2;
      return (
        <div className="rv-hero-main">
          <div className="rv-hero-kicker"><span className="dot" />Today · {todayDate}</div>
          <div className="rv-hero-count">
            <div className="rv-hero-num">{totalDue}</div>
            <div className="rv-hero-label">cards waiting</div>
          </div>
          <div className="rv-hero-sub" style={{ marginBottom: 20 }}>Choose your pace for today.</div>
          <div className="rv-flood-plans">
            {[
              { n: short,  label: "Quick pass",   desc: `${short} cards · ~${Math.round(short * 0.32)} min`, recommended: false },
              { n: usual,  label: "Usual",         desc: `${usual} cards · ~${Math.round(usual * 0.32)} min`, recommended: true  },
              { n: longer, label: "Longer sit",    desc: `${longer} cards · ~${Math.round(longer * 0.32)} min`, recommended: false },
            ].map(plan => (
              <button
                key={plan.n}
                className={`rv-flood-plan${plan.recommended ? " rv-flood-plan--rec" : ""}`}
                onClick={() => startSession(sortedDue.slice(0, plan.n))}
              >
                {plan.recommended && <span className="rv-flood-rec-badge">Recommended</span>}
                <span className="rv-flood-plan-label">{plan.label}</span>
                <span className="rv-flood-plan-desc">{plan.desc}</span>
              </button>
            ))}
          </div>
          <button className="rv-cta-secondary" style={{ marginTop: 12 }} onClick={() => startSession()}>
            I want to power through all {totalDue} →
          </button>
        </div>
      );
    }

    // calm (default)
    return (
      <div className="rv-hero-main">
        <div className="rv-hero-kicker"><span className="dot" />Today · {todayDate}</div>
        <div className="rv-hero-count">
          <div className="rv-hero-num">{totalDue}</div>
          <div className="rv-hero-label">{totalDue === 1 ? "card due" : "cards due"}</div>
        </div>
        <div className="rv-hero-sub">
          About {estMin} {estMin === 1 ? "minute" : "minutes"} of quiet attention.{weekTotal > totalDue ? ` ${weekTotal} more across the week.` : ""}
        </div>
        <div className="rv-hero-chips">
          {newCount    > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-persimmon)" }} />{newCount} new</span>}
          {learnCount  > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "#C79B6E" }} />{learnCount} learning</span>}
          {reviewCount > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-accent)" }} />{reviewCount} due review</span>}
        </div>
        <div className="rv-hero-cta">
          <button className="rv-start-btn" onClick={() => startSession()}>
            <span className="rv-start-btn-label"><Play size={14} /> Begin review</span>
            <span className="mono">{totalDue} cards</span>
          </button>
          <button className="rv-cta-secondary" onClick={() => navigate("/view-all-decks")}>Custom session…</button>
        </div>
      </div>
    );
  };

  // ── Render side panel ──────────────────────────────────────────────────────

  const renderHeroSide = () => {
    if (loadState === "zero-fresh") {
      return (
        <div className="rv-hero-side">
          <WhatHappensNext />
          <NudgeIndicator hasCalendar={hasCalendar} />
        </div>
      );
    }
    return (
      <div className="rv-hero-side">
        <ForecastChart forecast={forecast} forecastMax={forecastMax} avgPerDay={avgPerDay} />
        <div className="rv-hero-side-divider" />
        <NudgeIndicator hasCalendar={hasCalendar} />
      </div>
    );
  };

  // ── Full render ────────────────────────────────────────────────────────────

  return (
    <div className="tk-page" style={{ maxWidth: 1100, position: "relative" }}>
      <div className="tk-page-header" style={{ marginBottom: 14 }}>
        <div>
          <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Review · reading room</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "-0.03em", lineHeight: 1.05, marginBottom: 10 }}>
            The shelf, tended.
          </h1>
          <p style={{ color: "var(--tk-ink-3)", fontSize: 15, fontStyle: "italic", fontFamily: "var(--font-display)" }}>
            Spaced repetition remembers the intervals, so you don't have to.
          </p>
        </div>
      </div>

      {loadState === "backlog" && (
        <AwayBanner awayDays={awayDays} onRestart={() => startSession(sortedDue.slice(0, DAILY_CAP))} />
      )}

      <div className="rv-hero">
        {renderHeroMain()}
        {renderHeroSide()}
      </div>

      {loadState !== "zero-fresh" && (
        <>
          <div className="rv-section-head">
            <div className="rv-section-title">Memory map · <em>where your words live</em></div>
            <div className="rv-section-desc">Each column is an interval band. Taller columns are shelves with more words currently settling there.</div>
          </div>
          <div className="rv-shelves">
            {shelves.map(s => {
              const h   = s.cards > 0 ? Math.max(8, (s.cards / maxShelf) * 150) : 4;
              const low = h < 24;
              return (
                <div key={s.id} className="rv-shelf">
                  <div
                    className="rv-shelf-bar"
                    data-low={String(low)}
                    style={{ height: h, background: SHELF_COLOR[s.phase], opacity: s.id === "unseen" ? 0.45 : 0.85 }}
                  >
                    <div className="rv-shelf-bar-count">{s.cards > 0 ? s.cards : ""}</div>
                  </div>
                  <div className="rv-shelf-foot">
                    <div className="rv-shelf-foot-interval">{s.interval}</div>
                    <div className="rv-shelf-foot-label">{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="rv-shelves-legend">
            <span>← fresh memory</span>
            <span>{allCards.length} words across all shelves</span>
            <span>long-term memory →</span>
          </div>

          {allCards.length > 0 && (
            <>
              <div className="rv-section-head" style={{ marginTop: 32 }}>
                <div className="rv-section-title">Your rhythm</div>
                <div className="rv-section-desc">Progress across all shelves.</div>
              </div>
              <div className="rv-stats">
                <div className="rv-stat-card" style={{ gridColumn: "span 3" }}>
                  <div className="rv-stat-eyebrow">Retention estimate</div>
                  <div className="rv-ring">
                    <ProgressRing value={allCards.length > 0 ? Math.round(matureCards / allCards.length * 100) : 0} size={60} stroke={3} />
                    <div>
                      <div className="rv-stat-big">{allCards.length > 0 ? Math.round(matureCards / allCards.length * 100) : 0}<span className="unit">%</span></div>
                      <div className="rv-stat-sub">mature / total</div>
                    </div>
                  </div>
                </div>
                <div className="rv-stat-card" style={{ gridColumn: "span 3" }}>
                  <div className="rv-stat-eyebrow">Due today</div>
                  <div className="rv-stat-big">{totalDue}<span className="unit">cards</span></div>
                  <div className="rv-trend">
                    {forecast.slice(0, 14).map((f, i) => (
                      <div key={i} style={{ height: `${forecastMax > 0 ? (f.total / forecastMax) * 100 : 0}%` }} />
                    ))}
                  </div>
                </div>
                <div className="rv-stat-card" style={{ gridColumn: "span 3" }}>
                  <div className="rv-stat-eyebrow">Mature cards</div>
                  <div className="rv-stat-big">{matureCards}</div>
                  <div className="rv-stat-sub">of {allCards.length} total · <span className="pos">{allCards.length > 0 ? Math.round(matureCards / allCards.length * 100) : 0}%</span></div>
                </div>
                <div className="rv-stat-card" style={{ gridColumn: "span 3" }}>
                  <div className="rv-stat-eyebrow">Next milestone</div>
                  <div className="rv-stat-big" style={{ fontSize: 22, marginTop: 8 }}>{nextMilestone.name}</div>
                  <div className="rv-stat-sub" style={{ marginTop: 10 }}>
                    <div style={{ height: 4, background: "var(--tk-paper-deep)", borderRadius: 100, overflow: "hidden", marginBottom: 6 }}>
                      <div style={{ height: "100%", background: "var(--tk-accent)", width: `${nextMilestone.pct}%` }} />
                    </div>
                    {matureCards} / {nextMilestone.target}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {session === "running" && !summary && (
        <ReviewSession queue={sessionQueue} onClose={() => setSession(null)} onDone={handleDone} />
      )}
      {summary && (
        <ReviewDone
          summary={summary}
          onClose={() => { setSession(null); setSummary(null); }}
          onContinue={() => { setSession(null); setSummary(null); navigate("/view-all-decks"); }}
        />
      )}
    </div>
  );
};
