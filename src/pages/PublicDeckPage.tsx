import { useState, useEffect, useContext, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Users, BookOpen, Clock, ChevronLeft, Plus, Check, Play } from "lucide-react";
import axios from "axios";
import { DeckContext } from "@/contexts/DeckContext";
import { UserContext } from "@/contexts/UserContext";
import { formatLevelLabel } from "@/utils/levelDisplay";

interface PublicCard {
  _id: string;
  engCard: string;
  userLangCard: string;
}

interface PublicDeckData {
  _id: string;
  deckName: string;
  publicDeckName: string;
  deckTags: string[];
  publicTags: string[];
  showPublicTags: boolean;
  publicDescription: string;
  showPublicDescription: boolean;
  description: string;
  level: string;
  category: string;
  saves: number;
  publisherName: string;
  showPublisherName: boolean;
  updatedAt: string;
  cards: PublicCard[];
}

type Tab = "preview" | "cherry" | "try";
type TryPhase = "front" | "back";

function estMinutes(count: number) {
  return Math.max(1, Math.round((count * 36) / 60));
}

function formatUpdated(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

// ── Try 5 cards session ───────────────────────────────────────────────────────
function TrySession({ cards, onExit }: { cards: PublicCard[]; onExit: () => void }) {
  const preview = cards.slice(0, 5);
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<TryPhase>("front");
  const [done, setDone] = useState(false);
  const [agains, setAgains] = useState(0);

  const card = preview[idx];

  const reveal = useCallback(() => {
    if (phase === "front") setPhase("back");
  }, [phase]);

  const respond = useCallback((rating: "again" | "hard" | "easy") => {
    if (rating === "again") setAgains(a => a + 1);
    if (idx < preview.length - 1) {
      setIdx(i => i + 1);
      setPhase("front");
    } else {
      setDone(true);
    }
  }, [idx, preview.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); reveal(); }
      if (phase === "back") {
        if (e.key === "1") respond("again");
        if (e.key === "2") respond("hard");
        if (e.key === "3") respond("easy");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [phase, reveal, respond]);

  if (done) {
    return (
      <div className="pd-try-done">
        <div className="pd-try-done-icon">✓</div>
        <div className="pd-try-done-title">Preview complete</div>
        <div className="pd-try-done-sub">
          {agains === 0
            ? "You nailed all 5 cards. Clone the deck to study the rest."
            : `${agains} card${agains !== 1 ? "s" : ""} need more practice. Clone the deck to keep going.`}
        </div>
        <button className="tk-btn tk-btn-ghost" onClick={onExit} style={{ marginTop: 8 }}>
          ← Back to preview
        </button>
      </div>
    );
  }

  return (
    <div className="pd-try-wrap">
      {/* Progress bar */}
      <div className="pd-try-progress">
        {preview.map((_, i) => (
          <div key={i} className={`pd-try-seg ${i < idx ? "is-done" : i === idx ? "is-active" : ""}`} />
        ))}
        <span className="pd-try-progress-label">{idx + 1} / {preview.length}</span>
      </div>

      {/* Card face — only one face visible at a time */}
      <button className="pd-try-card-big" onClick={reveal} tabIndex={-1}>
        {phase === "front" ? (
          <div className="pd-try-front">
            <span className="pd-try-term">{card.userLangCard}</span>
            <span className="pd-try-cue">TAP TO REVEAL</span>
          </div>
        ) : (
          <div className="pd-try-back">
            <span className="pd-try-term">{card.userLangCard}</span>
            <span className="pd-try-answer">{card.engCard}</span>
          </div>
        )}
      </button>

      {/* Actions */}
      {phase === "front" ? (
        <button className="pd-try-show-btn" onClick={reveal}>
          Show answer <kbd>space</kbd>
        </button>
      ) : (
        <div className="pd-try-rating">
          <button className="pd-try-rate is-again" onClick={() => respond("again")}>
            <span className="pd-try-rate-key">1</span> Again
          </button>
          <button className="pd-try-rate is-hard" onClick={() => respond("hard")}>
            <span className="pd-try-rate-key">2</span> Hard
          </button>
          <button className="pd-try-rate is-easy" onClick={() => respond("easy")}>
            <span className="pd-try-rate-key">3</span> Easy
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export const PublicDeckPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { refreshDecks } = useContext(DeckContext);
  const { user } = useContext(UserContext);

  const [deck, setDeck] = useState<PublicDeckData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [tab, setTab] = useState<Tab>("preview");
  const [cloning, setCloning] = useState(false);
  const [cloned, setCloned] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [cherryCloning, setCherryCloning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get<PublicDeckData>(`/browse/${id}`)
      .then(r => { setDeck(r.data); setLoading(false); })
      .catch(err => {
        setLoading(false);
        if (err.response?.status === 404) setNotFound(true);
      });
  }, [id]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleClone = async () => {
    if (!deck || cloned || cloning) return;
    setCloning(true);
    try {
      const res = await axios.post(`/browse/${deck._id}/save`);
      setCloned(true);
      refreshDecks();
      showToast(`"${res.data.deckName}" added to your library`);
    } catch {
      showToast("Couldn't save deck");
    } finally {
      setCloning(false);
    }
  };

  const handleCherryPick = async () => {
    if (!deck || selected.size === 0 || cherryCloning) return;
    setCherryCloning(true);
    try {
      await axios.post(`/browse/${deck._id}/save`, { cardIds: [...selected] });
      refreshDecks();
      setDeck(prev => prev ? { ...prev, saves: prev.saves + 1 } : prev);
      showToast(`${selected.size} card${selected.size !== 1 ? "s" : ""} added to your library`);
      setSelected(new Set());
      setTab("preview");
    } catch {
      showToast("Couldn't save cards");
    } finally {
      setCherryCloning(false);
    }
  };

  const toggleCard = (cardId: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="tk-page" style={{ paddingTop: 48 }}>
        <div style={{ fontSize: 13, color: "var(--tk-ink-3)" }}>Loading…</div>
      </div>
    );
  }

  if (notFound || !deck) {
    return (
      <div className="tk-page" style={{ paddingTop: 48 }}>
        <div style={{ fontSize: 15, color: "var(--tk-ink-2)", marginBottom: 12 }}>Deck not found or not public.</div>
        <button className="tk-btn tk-btn-ghost" onClick={() => navigate("/browse")}>← Back to Browse</button>
      </div>
    );
  }

  const displayName = deck.publicDeckName || deck.deckName;
  const letter = displayName.trim()[0]?.toUpperCase() ?? "?";
  const displayDescription = deck.showPublicDescription ? (deck.publicDescription || deck.description) : null;
  const displayTags = deck.showPublicTags ? (deck.publicTags?.length ? deck.publicTags : deck.deckTags) : [];
  const updatedLabel = formatUpdated(deck.updatedAt);
  const tryCount = Math.min(5, deck.cards.length);

  return (
    <div className="tk-page pd-page">
      {/* Breadcrumb */}
      <button className="pd-breadcrumb" onClick={() => navigate("/browse")}>
        <ChevronLeft size={13} />
        <span>Library</span>
        <span style={{ color: "var(--tk-ink-4)" }}>/</span>
        <span>{deck.category || deck.deckTags[0] || "Decks"}</span>
        <span style={{ color: "var(--tk-ink-4)" }}>/</span>
        <span style={{ color: "var(--tk-ink)" }}>{displayName.toUpperCase()}</span>
      </button>

      <div className="pd-layout">
        {/* ── Main ── */}
        <div className="pd-main">
          {/* Hero */}
          <div className="pd-hero">
            <div style={{ position: "relative", display: "inline-block", flexShrink: 0 }}>
              <div className="pd-avatar">{letter}</div>
              {deck.level && <span className="pd-level-badge">{formatLevelLabel(deck.level, user?.difficultyLabel)}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="tk-eyebrow" style={{ marginBottom: 6 }}>
                PUBLIC DECK{deck.category ? ` · ${deck.category.toUpperCase()}` : ""}
              </div>
              <h1 className="pd-title">{displayName}</h1>
              {displayDescription && <p className="pd-description">{displayDescription}</p>}
              <div className="pd-meta">
                <span className="pd-meta-item"><Users size={12} /> {deck.saves.toLocaleString()} learners</span>
                <span className="pd-meta-sep">·</span>
                <span className="pd-meta-item"><BookOpen size={12} /> {deck.cards.length} cards</span>
                <span className="pd-meta-sep">·</span>
                <span className="pd-meta-item"><Clock size={12} /> {estMinutes(deck.cards.length)} min</span>
                {updatedLabel && (
                  <><span className="pd-meta-sep">·</span><span className="pd-meta-item">Updated {updatedLabel}</span></>
                )}
                {deck.showPublisherName && deck.publisherName && (
                  <><span className="pd-meta-sep">·</span>
                  <span className="pd-meta-item">By <em style={{ fontStyle: "italic", color: "var(--tk-ink-2)" }}>{deck.publisherName}</em></span></>
                )}
              </div>
              {displayTags.length > 0 && (
                <div className="pd-tags">
                  {displayTags.map(t => <span key={t} className="pd-tag">#{t}</span>)}
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="pd-tabs">
            <button className={`pd-tab ${tab === "preview" ? "is-on" : ""}`} onClick={() => setTab("preview")}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview cards
            </button>
            <button className={`pd-tab ${tab === "cherry" ? "is-on" : ""}`} onClick={() => setTab("cherry")}>
              <Check size={13} />
              Cherry-pick
              {selected.size > 0 && <span className="pd-tab-count">{selected.size}</span>}
            </button>
            {tryCount > 0 && (
              <button className={`pd-tab ${tab === "try" ? "is-on" : ""}`} onClick={() => setTab("try")}>
                <Play size={11} />
                Try {tryCount} cards
              </button>
            )}
          </div>

          {/* Preview */}
          {tab === "preview" && (
            <div className="pd-card-list">
              {deck.cards.map((card, i) => (
                <div key={card._id} className="pd-card-row">
                  <span className="pd-card-num">{i + 1}</span>
                  <span className="pd-card-term">{card.userLangCard}</span>
                  <span className="pd-card-trans">{card.engCard}</span>
                </div>
              ))}
            </div>
          )}

          {/* Cherry-pick */}
          {tab === "cherry" && (
            <div className="pd-cherry">
              <div className="pd-cherry-hint">Select the cards you want to save to your library.</div>
              <div className="pd-card-list">
                {deck.cards.map((card, i) => (
                  <label key={card._id} className={`pd-card-row pd-cherry-row ${selected.has(card._id) ? "is-selected" : ""}`}>
                    <input type="checkbox" checked={selected.has(card._id)} onChange={() => toggleCard(card._id)} style={{ display: "none" }} />
                    <span className="pd-cherry-check">{selected.has(card._id) ? "✓" : ""}</span>
                    <span className="pd-card-num">{i + 1}</span>
                    <span className="pd-card-term">{card.userLangCard}</span>
                    <span className="pd-card-trans">{card.engCard}</span>
                  </label>
                ))}
              </div>
              {selected.size > 0 && (
                <div className="pd-cherry-bar">
                  <span style={{ fontSize: 13, color: "var(--tk-ink-2)" }}>
                    {selected.size} card{selected.size !== 1 ? "s" : ""} selected
                  </span>
                  <button className="tk-btn tk-btn-accent" onClick={handleCherryPick} disabled={cherryCloning}>
                    {cherryCloning ? "Saving…" : `Save ${selected.size} card${selected.size !== 1 ? "s" : ""}`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Try session */}
          {tab === "try" && (
            <TrySession cards={deck.cards} onExit={() => setTab("preview")} />
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="pd-sidebar">
          {/* Add to your decks */}
          <div className="tx-aside-card" style={{ padding: 20 }}>
            <div className="tk-eyebrow" style={{ marginBottom: 14 }}>Add to your decks</div>
            <button
              className="tk-btn tk-btn-accent"
              style={{ width: "100%", justifyContent: "center", gap: 8, fontSize: 13 }}
              onClick={handleClone}
              disabled={cloning || cloned}
            >
              {cloned
                ? <><Check size={14} /> Saved to library</>
                : cloning
                  ? "Saving…"
                  : <><Plus size={14} /> Clone full deck · {deck.cards.length} cards</>}
            </button>
            <div style={{ textAlign: "center", fontSize: 11.5, color: "var(--tk-ink-4)", margin: "12px 0" }}>— or —</div>
            <button
              className="tk-btn tk-btn-ghost"
              style={{ width: "100%", justifyContent: "center", gap: 6, fontSize: 13 }}
              onClick={() => setTab("cherry")}
            >
              <Check size={13} /> Cherry-pick cards
            </button>
          </div>

          {/* Try before you save */}
          {tryCount > 0 && (
            <div className="tx-aside-card" style={{ padding: 20, marginTop: 12, background: "var(--tk-paper-deep)" }}>
              <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Try before you save</div>
              <p style={{ fontSize: 12.5, color: "var(--tk-ink-3)", lineHeight: 1.55, margin: "0 0 14px" }}>
                A {tryCount}-card mini Learn session, no account needed.
              </p>
              <button
                className="tk-btn tk-btn-ghost"
                style={{ width: "100%", justifyContent: "center", gap: 6, fontSize: 13 }}
                onClick={() => setTab("try")}
              >
                <Play size={12} /> Start {tryCount}-card preview
              </button>
            </div>
          )}

          {/* Provenance */}
          <div className="tx-aside-card" style={{ padding: 20, marginTop: 12, background: "var(--tk-paper-deep)" }}>
            <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Provenance</div>
            <p style={{ fontSize: 12, color: "var(--tk-ink-3)", lineHeight: 1.6, margin: 0 }}>
              Words sourced from <em>Wiktionary</em> &amp; <em>Tatoeba</em> (CC-BY-SA), curated and edited by the Tokō team.{" "}
              <span style={{ color: "var(--tk-accent)", cursor: "pointer" }}>About our sources →</span>
            </p>
          </div>
        </aside>
      </div>

      {toast && (
        <div className="tx-toast" style={{ left: "50%", right: "auto", transform: "translateX(-50%)" }}>
          <span style={{ fontSize: 13 }}>{toast}</span>
        </div>
      )}
    </div>
  );
};
