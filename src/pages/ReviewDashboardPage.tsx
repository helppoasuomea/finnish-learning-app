import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import { useDeckContext } from "@/contexts/DeckContext";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { ReviewSession, ReviewDone } from "@/components/ReviewSession";
import { Card } from "@/types";

type DeckCard = Card & { deckId: string; deckName: string };
type Rating = "again" | "hard" | "good" | "easy";

const MEMORY_SHELVES = [
  { id: "unseen",  interval: "unseen",  label: "Seed",          phase: "seed",    minDays: null, maxDays: null  },
  { id: "today",   interval: "today",   label: "Sprout",        phase: "sprout",  minDays: 0,    maxDays: 1     },
  { id: "1d",      interval: "1 day",   label: "Sprout · 1d",   phase: "sprout",  minDays: 1,    maxDays: 2     },
  { id: "3d",      interval: "3 days",  label: "Sprout · 3d",   phase: "sprout",  minDays: 2,    maxDays: 6     },
  { id: "1w",      interval: "1 week",  label: "Sapling · 1w",  phase: "sapling", minDays: 6,    maxDays: 12    },
  { id: "2w",      interval: "2 weeks", label: "Sapling · 2w",  phase: "sapling", minDays: 12,   maxDays: 25    },
  { id: "1mo",     interval: "1 month", label: "Sapling · 1mo", phase: "sapling", minDays: 25,   maxDays: 75    },
  { id: "3mo",     interval: "3 mo",    label: "Tree · 3mo",    phase: "tree",    minDays: 75,   maxDays: 150   },
  { id: "6mo",     interval: "6 mo+",   label: "Tree · 6mo+",   phase: "tree",    minDays: 150,  maxDays: null  },
];

const SHELF_COLOR: Record<string, string> = {
  seed: "var(--tk-ink-4)",
  sprout: "#C79B6E",
  sapling: "var(--tk-accent)",
  tree: "var(--tk-accent-deep)",
};

const DAY_ABBR = ["S","M","T","W","T","F","S"];

function startOfDay(d = new Date()) {
  const r = new Date(d); r.setHours(0,0,0,0); return r;
}

function daysBetween(from: Date, to: Date) {
  return Math.round((to.getTime() - from.getTime()) / 86400000);
}

export const ReviewDashboardPage: React.FC = () => {
  const { decks } = useDeckContext();
  const navigate = useNavigate();
  const today = useMemo(() => startOfDay(), []);

  const allCards = useMemo<DeckCard[]>(() =>
    decks.flatMap(d => d.cards.map(c => ({ ...c, deckId: d._id, deckName: d.deckName }))),
    [decks]
  );

  const isDueToday = (c: DeckCard) => {
    if (c.cardScore === 0 && !c.nextReviewDate) return true;
    if (!c.nextReviewDate) return false;
    return startOfDay(new Date(c.nextReviewDate)) <= today;
  };

  const dueCards    = useMemo(() => allCards.filter(isDueToday), [allCards, today]);
  const newCount    = useMemo(() => allCards.filter(c => c.cardScore === 0 && !c.nextReviewDate).length, [allCards]);
  const learnCount  = useMemo(() => dueCards.filter(c => c.cardScore >= 1 && c.cardScore <= 2).length, [dueCards]);
  const reviewCount = useMemo(() => dueCards.filter(c => c.cardScore >= 3).length, [dueCards]);
  const totalDue    = newCount + learnCount + reviewCount;
  const matureCards = useMemo(() => allCards.filter(c => c.cardScore >= 3).length, [allCards]);

  const weekMore = useMemo(() => allCards.filter(c => {
    if (!c.nextReviewDate) return false;
    const due = startOfDay(new Date(c.nextReviewDate));
    const diff = daysBetween(today, due);
    return diff > 0 && diff <= 7;
  }).length, [allCards, today]);

  const estMin = Math.max(1, Math.round(totalDue * 0.3));
  const weekTotal = weekMore + totalDue;

  const forecast = useMemo(() => Array.from({ length: 14 }, (_, i) => {
    const day = new Date(today.getTime() + i * 86400000);
    const cards = allCards.filter(c => {
      if (i === 0 && c.cardScore === 0 && !c.nextReviewDate) return true;
      if (!c.nextReviewDate) return false;
      return startOfDay(new Date(c.nextReviewDate)).getTime() === day.getTime();
    });
    const newN    = cards.filter(c => c.cardScore === 0).length;
    const learnN  = cards.filter(c => c.cardScore >= 1 && c.cardScore <= 2).length;
    const reviewN = cards.filter(c => c.cardScore >= 3).length;
    return { day, dayAbbr: DAY_ABBR[day.getDay()], isToday: i === 0, newN, learnN, reviewN, total: cards.length };
  }), [allCards, today]);

  const forecastMax = useMemo(() => Math.max(1, ...forecast.map(f => f.total)), [forecast]);
  const avgPerDay   = Math.round(forecast.reduce((s, f) => s + f.total, 0) / 14);

  const shelves = useMemo(() => MEMORY_SHELVES.map(s => {
    const count = allCards.filter(c => {
      if (s.minDays === null) return c.cardScore === 0 && !c.nextReviewDate;
      const interval = c.reviewInterval ?? 0;
      if (s.maxDays === null) return interval >= s.minDays;
      return interval >= s.minDays && interval < s.maxDays;
    }).length;
    return { ...s, cards: count };
  }), [allCards]);

  const maxShelf = useMemo(() => Math.max(1, ...shelves.map(s => s.cards)), [shelves]);

  const nextMilestone = useMemo(() => {
    const targets = [50, 100, 200, 500, 1000, 2000];
    const target = targets.find(t => t > matureCards) ?? 2000;
    const prevTarget = targets[Math.max(0, targets.indexOf(target) - 1)] ?? 0;
    return { target, name: `${target} mature`, pct: Math.min(100, Math.round((matureCards - prevTarget) / Math.max(1, target - prevTarget) * 100)) };
  }, [matureCards]);

  const todayDate = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const [session, setSession] = useState<"running" | null>(null);
  const [summary, setSummary] = useState<{ reviewed: number; history: { card: DeckCard; grade: Rating }[] } | null>(null);

  return (
    <div className="tk-page" style={{ maxWidth: 1100, position: "relative" }}>
      <div className="tk-page-header" style={{ marginBottom: 14 }}>
        <div>
          <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Review · reading room</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 44px)", fontWeight: 500, letterSpacing: "-0.03em", color: "var(--tk-ink)", lineHeight: 1.1, marginBottom: 8 }}>
            The shelf, tended.
          </h1>
          <p style={{ color: "var(--tk-ink-3)", fontSize: 15, fontStyle: "italic" }}>
            Spaced repetition remembers the intervals, so you don't have to.
          </p>
        </div>
      </div>

      <div className="rv-hero">
        <div className="rv-hero-main">
          <div className="rv-hero-kicker">
            <span className="dot"/>Today · {todayDate}
          </div>
          <div className="rv-hero-count">
            <div className="rv-hero-num">{totalDue}</div>
            <div className="rv-hero-label">cards due</div>
          </div>
          <div className="rv-hero-sub">
            About {estMin} {estMin === 1 ? "minute" : "minutes"} of quiet attention. {weekTotal > totalDue ? `${weekTotal} more across the week.` : ""}
          </div>
          <div className="rv-hero-chips">
            {newCount > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-persimmon)" }}/>{newCount} new</span>}
            {learnCount > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "#C79B6E" }}/>{learnCount} learning</span>}
            {reviewCount > 0 && <span className="rv-chip"><span className="rv-chip-dot" style={{ background: "var(--tk-accent)" }}/>{reviewCount} due review</span>}
            {totalDue === 0 && <span style={{ fontSize: 15, color: "var(--tk-accent)", fontWeight: 500 }}>All caught up ✓</span>}
          </div>
          {totalDue > 0 && (
            <div className="rv-hero-cta">
              <button className="rv-start-btn" onClick={() => setSession("running")}>
                <Play size={14}/> Begin review <span className="mono">{totalDue} cards</span>
              </button>
              <button className="rv-cta-secondary" onClick={() => navigate("/view-all-decks")}>Custom session…</button>
            </div>
          )}
        </div>

        <div className="rv-hero-side">
          <div className="rv-hero-side-label">
            <span>14-day forecast</span>
            <span style={{ opacity: 0.7 }}>avg {avgPerDay}/day</span>
          </div>
          <div className="rv-forecast">
            {forecast.map((f, i) => {
              const totalH = 140;
              const h = Math.max(3, (f.total / forecastMax) * totalH);
              const hNew   = f.total > 0 ? (f.newN / f.total) * h : 0;
              const hLearn = f.total > 0 ? (f.learnN / f.total) * h : 0;
              const hRev   = h - hNew - hLearn;
              return (
                <div key={i} className="rv-fc-day" data-today={String(f.isToday)}>
                  <div className="rv-fc-bar" style={{ height: h }}>
                    {hNew > 0 && <span className="rv-fc-new" style={{ height: hNew }}/>}
                    {hLearn > 0 && <span className="rv-fc-learning" style={{ height: hLearn }}/>}
                    {hRev > 0 && <span className="rv-fc-review" style={{ height: hRev }}/>}
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
            <span><i style={{ background: "var(--tk-persimmon)" }}/>new</span>
            <span><i style={{ background: "#C79B6E" }}/>learning</span>
            <span><i style={{ background: "var(--tk-accent)" }}/>review</span>
          </div>
        </div>
      </div>

      <div className="rv-section-head">
        <div className="rv-section-title">Memory map · <em>where your words live</em></div>
        <div className="rv-section-desc">Each column is an interval band. Taller columns are shelves with more words currently settling there.</div>
      </div>
      <div className="rv-shelves">
        {shelves.map(s => {
          const h = s.cards > 0 ? Math.max(8, (s.cards / maxShelf) * 150) : 4;
          const low = h < 24;
          return (
            <div key={s.id} className="rv-shelf">
              <div className="rv-shelf-bar" data-low={String(low)} style={{ height: h, background: SHELF_COLOR[s.phase], opacity: s.id === "unseen" ? 0.45 : 0.85 }}>
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
              <div key={i} style={{ height: `${forecastMax > 0 ? (f.total / forecastMax) * 100 : 0}%` }}/>
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
              <div style={{ height: "100%", background: "var(--tk-accent)", width: `${nextMilestone.pct}%` }}/>
            </div>
            {matureCards} / {nextMilestone.target}
          </div>
        </div>
      </div>

      {session === "running" && !summary && (
        <ReviewSession queue={dueCards} onClose={() => setSession(null)} onDone={(s) => setSummary(s)} />
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
