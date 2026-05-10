import { useState, useMemo, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowRight, Users, BookOpen, Clock } from "lucide-react";
import axios from "axios";
import { DeckContext } from "@/contexts/DeckContext";
import { UserContext } from "@/contexts/UserContext";
import { formatLevelLabel } from "@/utils/levelDisplay";

interface PublicDeck {
  _id: string;
  deckName: string;
  publicDeckName: string;
  deckTags: string[];
  publicTags: string[];
  showPublicTags: boolean;
  publicDescription: string;
  description: string;
  level: "A1" | "A2" | "B1" | "B2" | "";
  category: string;
  saves: number;
  featured: boolean;
  deckEmoji?: string;
  cards: { _id: string; engCard: string; userLangCard: string; favorite?: boolean }[];
}

function featuredWords(deck: PublicDeck) {
  const fav = deck.cards.filter(c => c.favorite);
  const pool = fav.length > 0
    ? [...fav].sort((a, b) => a.userLangCard.localeCompare(b.userLangCard))
    : deck.cards;
  return pool.slice(0, 3);
}

function DeckTags({ deck }: { deck: PublicDeck }) {
  const tags = deck.showPublicTags !== false
    ? (deck.publicTags?.length ? deck.publicTags : deck.deckTags.slice(1))
    : [];
  if (!tags.length) return null;
  return (
    <div className="br-card-tags">
      {tags.slice(0, 4).map(t => (
        <span key={t} className="br-card-tag">#{t}</span>
      ))}
    </div>
  );
}

type SortKey = "newest" | "alpha" | "largest";
type LevelBand = "A" | "B" | "C";

const LEVEL_BAND_LABEL: Record<LevelBand, string> = {
  A: "Beginner",
  B: "Intermediate",
  C: "Advanced",
};

function formatLevelBandLabel(band: LevelBand, mode?: "plain" | "cefr" | "both"): string {
  if (mode === "cefr") return band;
  if (mode === "both") return `${LEVEL_BAND_LABEL[band]} · ${band}`;
  return LEVEL_BAND_LABEL[band];
}

function estMinutes(count: number) {
  return Math.max(1, Math.round((count * 36) / 60));
}

function DeckAvatar({ name, emoji, size = 32 }: { name: string; emoji?: string; size?: number }) {
  if (emoji) return (
    <div className="br-avatar" style={{ width: size, height: size, background: "var(--tk-paper-deep)", fontSize: size * 0.55 }}>
      {emoji}
    </div>
  );
  const letter = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <div className="br-avatar" style={{ width: size, height: size, fontSize: size * 0.4 }}>
      {letter}
    </div>
  );
}

function LevelBadge({ level, displayMode }: { level: string; displayMode?: "plain" | "cefr" | "both" }) {
  if (!level) return null;
  return <span className="br-level-badge">{formatLevelLabel(level, displayMode)}</span>;
}

function MetaRow({ deck }: { deck: PublicDeck }) {
  return (
    <div className="br-feat-meta">
      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Users size={11} /> {deck.saves.toLocaleString()}
      </span>
      <span>·</span>
      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <BookOpen size={11} /> {deck.cards.length} cards
      </span>
      <span>·</span>
      <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Clock size={11} /> {estMinutes(deck.cards.length)} min
      </span>
    </div>
  );
}

export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const { refreshDecks } = useContext(DeckContext);
  const { user } = useContext(UserContext);

  const [decks, setDecks] = useState<PublicDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("All");
  const [activeLevelBand, setActiveLevelBand] = useState<LevelBand | "">("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    axios.get<PublicDeck[]>("/browse").then(r => {
      setDecks(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (deck: PublicDeck, e: React.MouseEvent) => {
    e.stopPropagation();
    if (saved.has(deck._id) || saving) return;
    setSaving(deck._id);
    try {
      const res = await axios.post(`/browse/${deck._id}/save`);
      setSaved(s => new Set([...s, deck._id]));
      setDecks(prev => prev.map(d => d._id === deck._id ? { ...d, saves: d.saves + 1 } : d));
      refreshDecks();
      showToast(`"${res.data.deckName}" added to your library`);
    } catch {
      showToast("Couldn't save deck");
    } finally {
      setSaving(null);
    }
  };

  const openDeck = (deck: PublicDeck) => {
    navigate(`/browse/${deck._id}`);
  };

  // Categories derived from tags
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    decks.forEach(d => {
      const cat = d.category || d.deckTags[0] || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [decks]);

  const filtered = useMemo(() => {
    let result = decks;
    if (activeCat !== "All") {
      result = result.filter(d => (d.category || d.deckTags[0] || "Other") === activeCat);
    }
    if (activeLevelBand) {
      result = result.filter(d => d.level?.toUpperCase().startsWith(activeLevelBand));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(d =>
        (d.publicDeckName || d.deckName).toLowerCase().includes(q) ||
        (d.publicDescription || d.description)?.toLowerCase().includes(q) ||
        d.deckTags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (sort === "alpha") result = [...result].sort((a, b) => a.deckName.localeCompare(b.deckName));
    else if (sort === "largest") result = [...result].sort((a, b) => b.cards.length - a.cards.length);
    return result;
  }, [decks, activeCat, activeLevelBand, query, sort]);

  const featured = useMemo(() => decks.filter(d => d.featured).slice(0, 3), [decks]);
  const nonFeatured = filtered.filter(d => !d.featured || activeCat !== "All" || activeLevelBand || query);

  return (
    <div className="tk-page br-page">
      {/* Header */}
      <div className="br-header">
        <div>
          <div className="text-eyebrow" style={{ marginBottom: 4 }}>Library · Public Collection</div>
          <h1 className="br-title">The reading room.</h1>
          <p className="br-subtitle">
            Decks curated for Finnish learners. Browse the shelves, preview a card, take five minutes with one. Save what's useful.
          </p>
        </div>
        <div className="br-search-wrap">
          <Search size={13} className="br-search-icon" />
          <input
            className="br-search-input"
            placeholder="Search decks…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="br-cats">
        <button
          className={`br-cat ${activeCat === "All" ? "is-on" : ""}`}
          onClick={() => setActiveCat("All")}
        >
          All <span className="br-cat-count">{decks.length}</span>
        </button>
        {categories.map(([cat, count]) => (
          <button
            key={cat}
            className={`br-cat ${activeCat === cat ? "is-on" : ""}`}
            onClick={() => setActiveCat(activeCat === cat ? "All" : cat)}
          >
            {cat} <span className="br-cat-count">{count}</span>
          </button>
        ))}
      </div>

      {/* Featured strip */}
      {featured.length > 0 && activeCat === "All" && !activeLevelBand && !query && (
        <>
          <div className="br-featured-label">On the front table</div>
          <div className="br-featured-grid">
            {featured.map(deck => (
              <button key={deck._id} className="br-feat-card" onClick={() => openDeck(deck)}>
                <div className="br-feat-top">
                  <LevelBadge level={deck.level} displayMode={user?.difficultyLabel} />
                  <span className="br-cat-badge">{deck.category || deck.deckTags[0]}</span>
                </div>
                <div>
                  <div className="br-feat-title">{deck.publicDeckName || deck.deckName}</div>
                  {(deck.publicDescription || deck.description) && <div className="br-feat-desc" style={{ marginTop: 6 }}>{deck.publicDescription || deck.description}</div>}
                </div>
                {deck.cards.length > 0 && (
                  <div className="br-feat-words">
                    {featuredWords(deck).map(c => (
                      <div key={c._id} className="br-feat-word-row">
                        <span className="br-feat-word">{c.userLangCard}</span>
                        <span className="br-feat-trans">{c.engCard}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="br-feat-footer">
                  <MetaRow deck={deck} />
                  <span className="br-feat-open" onClick={e => { e.stopPropagation(); openDeck(deck); }}>
                    Open <ArrowRight size={12} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Level + sort bar */}
      <div className="br-bar">
        <div className="br-bar-left">
              {(["A", "B", "C"] as const).map((band) => (
            <button
                  key={band}
                  className={`br-level-btn ${activeLevelBand === band ? "is-on" : ""}`}
                  onClick={() => setActiveLevelBand(activeLevelBand === band ? "" : band)}
            >
                  {formatLevelBandLabel(band, user?.difficultyLabel)}
            </button>
          ))}
          <div className="br-sort-group" style={{ marginLeft: 8 }}>
            {([["newest", "Newest"], ["alpha", "A → Z"], ["largest", "Largest"]] as [SortKey, string][]).map(([k, l]) => (
              <button key={k} className={`br-sort-btn ${sort === k ? "is-on" : ""}`} onClick={() => setSort(k)}>{l}</button>
            ))}
          </div>
        </div>
        <span className="br-count">{filtered.length} deck{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="br-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} style={{ height: 160, background: "var(--tk-paper-edge)", borderRadius: 12, animation: "tk-fade 1s ease infinite alternate" }} />
          ))}
        </div>
      ) : (
        <div className="br-grid">
          {nonFeatured.length === 0 && (
            <div className="br-empty">
              {decks.length === 0
                ? "No public decks yet. Be the first to publish one from your library."
                : "No decks match your filters."}
            </div>
          )}
          {nonFeatured.map(deck => (
            <button key={deck._id} className="br-card" onClick={() => openDeck(deck)}>
              <div className="br-card-top">
                <DeckAvatar name={deck.publicDeckName || deck.deckName} emoji={deck.deckEmoji} />
                <LevelBadge level={deck.level} displayMode={user?.difficultyLabel} />
              </div>
              <div>
                <div className="br-card-title">{deck.publicDeckName || deck.deckName}</div>
                {(deck.publicDescription || deck.description) && <div className="br-card-desc">{deck.publicDescription || deck.description}</div>}
              </div>
              {deck.cards.length > 0 && (
                <div className="br-card-words">
                  {featuredWords(deck).map((c, i) => (
                    <span key={c._id}>
                      {i > 0 && <span style={{ color: "var(--tk-ink-4)" }}>, </span>}
                      <em>{c.userLangCard}</em>
                      <span style={{ color: "var(--tk-ink-4)" }}> · </span>
                      {c.engCard}
                    </span>
                  ))}
                </div>
              )}
              <DeckTags deck={deck} />
              <div className="br-card-footer">
                <MetaRow deck={deck} />
                <div style={{ marginLeft: "auto" }}>
                  {saved.has(deck._id) ? (
                    <span className="br-saved-badge">✓ Saved</span>
                  ) : (
                    <button
                      className="tk-btn tk-btn-sm tk-btn-accent"
                      style={{ fontSize: 11, padding: "3px 10px" }}
                      onClick={e => handleSave(deck, e)}
                      disabled={saving === deck._id}
                    >
                      {saving === deck._id ? "…" : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="tx-toast" style={{ left: "50%", right: "auto", transform: "translateX(-50%)" }}>
          <span style={{ fontSize: 13 }}>{toast}</span>
        </div>
      )}
    </div>
  );
};
