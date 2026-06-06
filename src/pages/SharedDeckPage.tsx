import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ChevronLeft, ChevronRight, BookOpen, RotateCcw } from "lucide-react";
import { UserContext } from "@/contexts/UserContext";

interface SharedCard {
  _id: string;
  userLangCard: string;
  engCard: string;
  type?: string;
  cardKind?: string;
  comment?: string;
  reps?: number;
  stability?: number;
}

interface SharedDeckData {
  slug: string;
  message: string;
  allowSave: boolean;
  shareProgress: boolean;
  requireAuth: boolean;
  deckName: string;
  deckEmoji: string;
  description: string;
  deckTags: string[];
  cardCount: number;
  cards: SharedCard[];
  ownerName: string;
  deckId: string;
}

function MiniFlashcard({ cards, onDone }: { cards: SharedCard[]; onDone: () => void }) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  const card = cards[idx];

  const next = () => {
    if (idx + 1 >= cards.length) { setDone(true); return; }
    setIdx(i => i + 1);
    setRevealed(false);
  };

  if (done) {
    return (
      <div className="sd-mini-done">
        <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "var(--tk-ink)", marginBottom: 6 }}>Nice work!</div>
        <div style={{ fontSize: 13, color: "var(--tk-ink-3)", marginBottom: 20 }}>
          You went through all {cards.length} cards.
        </div>
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onDone}>
          <RotateCcw size={13} /> Back to deck
        </button>
      </div>
    );
  }

  return (
    <div className="sd-mini-session">
      <div className="sd-mini-progress">
        <div style={{ width: `${((idx) / cards.length) * 100}%`, background: "var(--tk-accent)", height: "100%", borderRadius: 999, transition: "width 300ms" }} />
      </div>

      <div className="sd-mini-card" onClick={() => setRevealed(r => !r)} role="button" tabIndex={0} onKeyDown={e => e.key === " " && setRevealed(r => !r)}>
        <div className="sd-mini-word">{card.userLangCard}</div>
        {revealed ? (
          <div className="sd-mini-translation">{card.engCard}</div>
        ) : (
          <div className="sd-mini-hint">tap to reveal</div>
        )}
      </div>

      <div className="sd-mini-nav">
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onDone} style={{ gap: 4 }}>
          <ChevronLeft size={14} /> Exit
        </button>
        <div style={{ fontSize: 12, color: "var(--tk-ink-4)" }}>{idx + 1} / {cards.length}</div>
        <button className="tk-btn tk-btn-accent tk-btn-sm" onClick={next} style={{ gap: 4 }}>
          {idx + 1 < cards.length ? "Next" : "Finish"} <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export const SharedDeckPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useContext(UserContext);

  const [data, setData] = useState<SharedDeckData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [tryMode, setTryMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!slug) return;
    axios.get(`/s/${slug}`)
      .then(r => setData(r.data))
      .catch(e => {
        const msg = e.response?.data?.error ?? "Something went wrong";
        setError(msg === "Unauthorized" ? "Sign-in required to view this deck" : msg);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSave = async () => {
    if (!slug) return;
    setSaving(true);
    try {
      await axios.post(`/s/${slug}/save`);
      setSaved(true);
    } catch {
      setSaved(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="sd-page">
        <div className="sd-loading">Loading…</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="sd-page">
        <div className="sd-error">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔗</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: "var(--tk-ink)", marginBottom: 6 }}>
            {error ?? "Deck not found"}
          </div>
          <div style={{ fontSize: 13, color: "var(--tk-ink-3)", marginBottom: 20 }}>
            This link may have expired or been removed.
          </div>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => navigate("/")}>
            Go home
          </button>
        </div>
      </div>
    );
  }

  const tryCards = data.cards.slice(0, 5);

  return (
    <div className="sd-page">
      <div className="sd-inner">
        {/* Main column */}
        <main className="sd-main">
          {/* Sender / hero */}
          <div className="sd-hero">
            <div className="sd-hero-emoji">{data.deckEmoji || "📚"}</div>
            <div>
              <div className="tk-eyebrow" style={{ marginBottom: 4 }}>Shared by {data.ownerName}</div>
              <h1 className="sd-hero-title">{data.deckName}</h1>
              <div style={{ fontSize: 13, color: "var(--tk-ink-3)", marginTop: 4 }}>
                {data.cardCount} cards
                {data.deckTags?.length > 0 && (
                  <> · {data.deckTags.join(", ")}</>
                )}
              </div>
              {data.message && (
                <blockquote className="sd-message">"{data.message}"</blockquote>
              )}
            </div>
          </div>

          {/* Try 5 cards tab */}
          <div className="sd-actions-bar">
            <button
              className={`sd-tab${tryMode ? " is-active" : ""}`}
              onClick={() => setTryMode(t => !t)}
            >
              <BookOpen size={13} />
              {tryMode ? "Back to preview" : `Try ${tryCards.length} cards`}
            </button>
          </div>

          {tryMode ? (
            <MiniFlashcard cards={tryCards} onDone={() => setTryMode(false)} />
          ) : (
            <div className="sd-card-list">
              {data.cards.slice(0, 20).map((card, i) => (
                <div key={card._id || i} className="sd-card-row">
                  <span className="sd-card-fi">{card.userLangCard}</span>
                  <span className="sd-card-en">{card.engCard}</span>
                </div>
              ))}
              {data.cardCount > 20 && (
                <div className="sd-card-more">
                  + {data.cardCount - 20} more cards
                </div>
              )}
            </div>
          )}
        </main>

        {/* Sidebar */}
        <aside className="sd-aside">
          <div className="sd-aside-card">
            {saved ? (
              <>
                <div style={{ fontSize: 32, marginBottom: 10 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--tk-ink)", marginBottom: 6 }}>Deck saved!</div>
                <div style={{ fontSize: 12.5, color: "var(--tk-ink-3)", marginBottom: 16 }}>
                  You'll find it in your library.
                </div>
                <button className="tk-btn tk-btn-accent" style={{ width: "100%" }} onClick={() => navigate("/view-all-decks")}>
                  Go to library →
                </button>
              </>
            ) : isAuthenticated ? (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tk-ink)", marginBottom: 6 }}>
                  Add to your library
                </div>
                <div style={{ fontSize: 12.5, color: "var(--tk-ink-3)", marginBottom: 14, lineHeight: 1.55 }}>
                  Save this deck and start studying it with spaced repetition.
                </div>
                {data.allowSave ? (
                  <button
                    className="tk-btn tk-btn-accent"
                    style={{ width: "100%" }}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Save deck"}
                  </button>
                ) : (
                  <div style={{ fontSize: 12, color: "var(--tk-ink-4)", fontStyle: "italic" }}>
                    The sender has disabled saving for this link.
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tk-ink)", marginBottom: 6 }}>
                  Start learning for free
                </div>
                <div style={{ fontSize: 12.5, color: "var(--tk-ink-3)", marginBottom: 14, lineHeight: 1.55 }}>
                  Create a free account to save this deck and study with spaced repetition.
                </div>
                <button
                  className="tk-btn tk-btn-accent"
                  style={{ width: "100%", marginBottom: 8 }}
                  onClick={() => navigate("/register")}
                >
                  Create free account
                </button>
                <button
                  className="tk-btn tk-btn-ghost tk-btn-sm"
                  style={{ width: "100%", fontSize: 12 }}
                  onClick={() => navigate("/login")}
                >
                  Sign in
                </button>
              </>
            )}
          </div>

          {data.description && (
            <div className="sd-aside-card" style={{ marginTop: 12 }}>
              <div className="tk-eyebrow" style={{ marginBottom: 8 }}>About</div>
              <div style={{ fontSize: 13, color: "var(--tk-ink-2)", lineHeight: 1.6 }}>{data.description}</div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
