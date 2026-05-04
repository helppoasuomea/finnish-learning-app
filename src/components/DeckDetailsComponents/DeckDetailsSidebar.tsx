import { useContext, useEffect, useState } from "react";
import { Flame } from "lucide-react";
import axios from "axios";
import { DeckContext } from "@/contexts/DeckContext";
import { useFetchAllHistory, HistoryItem } from "@/state/hooks/useLearningHistoryHooks";
import { MemoryGoalPanel } from "./MemoryGoalPanel";
import { PublishPanel } from "./PublishPanel";
import type { MemoryGoalTier } from "@/types";

interface Props {
  deckId: string;
  deckName: string;
}

function relativeDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diff = (today.getTime() - target.getTime()) / 86400000;
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function nextReviewLabel(cards: { nextReviewDate?: string | null; cardScore?: number }[]): string {
  const dueDates = cards
    .filter(c => (c.cardScore ?? 0) < 5 && c.nextReviewDate)
    .map(c => new Date(c.nextReviewDate!))
    .filter(d => !isNaN(d.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (!dueDates.length) return "No reviews due";
  const earliest = dueDates[0];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = new Date(today.getTime() + 86400000);
  const target = new Date(earliest.getFullYear(), earliest.getMonth(), earliest.getDate());

  if (target <= today) return "Tonight";
  if (target.getTime() === tomorrow.getTime()) return "Tomorrow";
  return earliest.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export const DeckDetailsSidebar: React.FC<Props> = ({ deckId, deckName }) => {
  const userId = localStorage.getItem("userId");
  const { decks } = useContext(DeckContext);
  const { history, fetchHistory } = useFetchAllHistory(userId);
  const currentDeck = decks.find((d: any) => d._id === deckId);
  const memoryTier: MemoryGoalTier = currentDeck?.memoryGoal?.tier ?? 'sapling';
  const [streak, setStreak] = useState<number>(0);

  useEffect(() => {
    fetchHistory();
    axios.get("/review/stats").then(r => setStreak(r.data.currentStreak ?? 0)).catch(() => {});
  }, [deckId]);

  const upcomingDecks = decks
    .filter(d => d._id !== deckId)
    .map(d => ({
      ...d,
      dueCount: (d.cards || []).filter((c: any) => (c.cardScore ?? 0) < 5).length,
      when: nextReviewLabel(d.cards || []),
    }))
    .filter(d => d.dueCount > 0)
    .sort((a, b) => b.dueCount - a.dueCount)
    .slice(0, 3);

  const sevenDaysAgo = Date.now() - 7 * 86400000;
  const recentHistory = history
    .filter(h => new Date(h.date).getTime() >= sevenDaysAgo)
    .slice(0, 5);

  const getDeckName = (h: HistoryItem) => {
    if (h.deckId) {
      const d = decks.find((d: any) => d._id === h.deckId);
      if (d) return d.deckName;
    }
    return deckName;
  };

  return (
    <>
      {upcomingDecks.length > 0 && (
        <div className="tx-aside-card" style={{ padding: 20, marginBottom: 16 }}>
          <div className="tk-eyebrow" style={{ marginBottom: 12 }}>Upcoming reviews</div>
          {upcomingDecks.map((d, i) => (
            <div key={d._id} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 0",
              borderTop: i > 0 ? "1px solid var(--tk-rule-soft)" : "none",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "var(--tk-paper-deep)", border: "1px solid var(--tk-rule)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600, color: "var(--tk-ink-2)", flexShrink: 0,
              }}>
                {d.deckName[0].toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: "var(--tk-ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.deckName}</div>
                <div style={{ fontSize: 11.5, color: "var(--tk-ink-3)" }}>{d.dueCount} cards · {d.when}</div>
              </div>
              <span style={{ fontSize: 13, color: "var(--tk-ink-3)" }}>→</span>
            </div>
          ))}
        </div>
      )}

      <div className="tx-aside-card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div className="tk-eyebrow">Recent sessions</div>
          <div style={{ fontSize: 11, color: "var(--tk-ink-3)" }}>last 7 days</div>
        </div>
        {recentHistory.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--tk-ink-3)", fontStyle: "italic" }}>
            No sessions in the last 7 days.
          </div>
        ) : (
          <>
            {recentHistory.map((h, i) => (
              <div key={h.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 0",
                borderTop: i > 0 ? "1px solid var(--tk-rule-soft)" : "none",
              }}>
                <div>
                  <div style={{ fontSize: 13, color: "var(--tk-ink)", fontWeight: 500 }}>{relativeDate(h.date)}</div>
                  <div style={{ fontSize: 11.5, color: "var(--tk-ink-3)" }}>
                    {h.quizType === "learn" ? "Learn" : "Review"} · {getDeckName(h)}
                  </div>
                </div>
                <div className="tk-mono" style={{
                  fontSize: 12.5,
                  color: h.correctAnswers === h.cardsStudied ? "var(--tk-accent)" : "var(--tk-ink-2)",
                }}>
                  {h.correctAnswers ?? "—"}/{h.cardsStudied}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 12, borderTop: "1px solid var(--tk-rule-soft)", paddingTop: 10 }}>
              <button
                style={{
                  background: "none", border: "none", padding: 0, cursor: "pointer",
                  fontSize: 12.5, color: "var(--tk-accent)", fontWeight: 500,
                }}
              >
                See full history →
              </button>
            </div>
          </>
        )}
      </div>

      <MemoryGoalPanel deckId={deckId} currentTier={memoryTier} />

      <PublishPanel
        deckId={deckId}
        deckName={deckName}
        deckTags={(currentDeck as any)?.deckTags ?? []}
        deckDescription={(currentDeck as any)?.description ?? ""}
        initialState={{
          isPublic:              (currentDeck as any)?.isPublic ?? false,
          level:                 (currentDeck as any)?.level ?? "",
          category:              (currentDeck as any)?.category ?? "",
          publicDeckName:        (currentDeck as any)?.publicDeckName ?? "",
          publicDescription:     (currentDeck as any)?.publicDescription ?? "",
          showPublicDescription: (currentDeck as any)?.showPublicDescription ?? true,
          publisherName:         (currentDeck as any)?.publisherName ?? "",
          showPublisherName:     (currentDeck as any)?.showPublisherName ?? false,
          publicTags:            (currentDeck as any)?.publicTags ?? [],
          showPublicTags:        (currentDeck as any)?.showPublicTags ?? true,
        }}
      />

      <div className="tx-aside-card" style={{ padding: 20, background: "var(--tk-paper-deep)", marginTop: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Flame size={18} style={{ color: "var(--tk-persimmon)" }} />
          <div>
            <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {streak} days
            </div>
            <div className="tk-eyebrow" style={{ marginTop: 2 }}>current streak</div>
          </div>
        </div>
      </div>
    </>
  );
};
