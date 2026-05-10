import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X, ArrowRight, Volume2, Copy, Trash2, Bookmark, RotateCcw } from "lucide-react";
import axios from "axios";

interface SavedSentence {
  _id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  wordsSavedCount: number;
  responsePayload?: { words?: unknown[]; sentence?: string; originalText?: string } | null;
  createdAt: string;
}

// ─── Helpers ───

const LANG_FLAGS: Record<string, string> = {
  Finnish: "🇫🇮", English: "🇬🇧", Swedish: "🇸🇪", German: "🇩🇪",
  French: "🇫🇷", Spanish: "🇪🇸", Italian: "🇮🇹", Japanese: "🇯🇵",
  Korean: "🇰🇷", Chinese: "🇨🇳", Russian: "🇷🇺", Portuguese: "🇵🇹",
};

function dayLabel(iso: string): string {
  const d = new Date(iso);
  const todayMs = new Date(new Date().toDateString()).getTime();
  const dMs     = new Date(d.toDateString()).getTime();
  const diff    = Math.round((todayMs - dMs) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase();
}

function timeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit", minute: "2-digit", hour12: false,
  });
}

// Whitespace word-count — only used as a fallback for languages without a
// parsed word breakdown (responsePayload.words).
function wc(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function wordCount(s: SavedSentence): number {
  const n = s.responsePayload?.words?.length;
  if (typeof n === 'number' && n > 0) return n;
  return wc(s.originalText);
}

function timestampLabel(iso: string): string {
  const d     = new Date(iso);
  const today = new Date(new Date().toDateString()).getTime();
  const dDay  = new Date(d.toDateString()).getTime();
  const diff  = Math.round((today - dDay) / 86400000);
  const time  = timeLabel(iso);
  if (diff === 0) return `Today · ${time}`;
  if (diff === 1) return `Yesterday · ${time}`;
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} · ${time}`;
}

// ─── Detail pane ───

const SentenceDetail = ({
  s,
  onDelete,
}: {
  s: SavedSentence;
  onDelete: (id: string) => void;
}) => {
  const navigate  = useNavigate();
  const words     = wordCount(s);
  const kept      = s.wordsSavedCount;
  const pct       = words > 0 ? Math.round((kept / words) * 100) : 0;
  const srcFlag   = LANG_FLAGS[s.fromLanguage] ?? "🌐";
  const tgtFlag   = LANG_FLAGS[s.toLanguage]   ?? "🌐";

  const handleReopen = () => {
    if (s.responsePayload) {
      try { localStorage.setItem("response", JSON.stringify(s.responsePayload)); } catch {}
    }
    localStorage.setItem("fromLanguage", s.fromLanguage);
    navigate("/", { state: { fromSavedSentence: true, originalText: s.originalText, fromLanguage: s.fromLanguage } });
  };

  const handleListen = () => {
    const utt = new SpeechSynthesisUtterance(s.originalText);
    const voices = speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith("fi") || v.name.toLowerCase().includes("finnish"));
    if (match) utt.voice = match;
    speechSynthesis.cancel();
    speechSynthesis.speak(utt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(s.originalText).catch(() => {});
  };

  const handleRemove = () => {
    if (confirm("Remove this sentence from history?")) onDelete(s._id);
  };

  return (
    <div className="ss-detail" key={s._id}>
      {/* Top strip */}
      <div className="ss-detail-top">
        <div className="ss-detail-top-left">
          <span className="ss-lang-pill">{srcFlag} {s.fromLanguage}</span>
          <ArrowRight size={12} style={{ color: "var(--tk-ink-4)" }} />
          <span className="ss-lang-pill">{tgtFlag} {s.toLanguage}</span>
        </div>
        <span className="ss-detail-time">{timestampLabel(s.createdAt)}</span>
      </div>

      {/* Source */}
      <div className="ss-detail-source">
        <div className="ss-detail-label">Source</div>
        <p className="ss-detail-source-text">{s.originalText}</p>
      </div>

      {/* Translation */}
      <div className="ss-detail-target">
        <div className="ss-detail-label">Translation</div>
        <p className="ss-detail-target-text">{s.translatedText}</p>
      </div>

      {/* Stats */}
      <div className="ss-detail-stats">
        <div className="ss-stat">
          <div className="ss-stat-value">{words}</div>
          <div className="ss-stat-label">Words</div>
        </div>
        <div className="ss-stat">
          <div className="ss-stat-value" style={{ color: kept > 0 ? "var(--tk-accent)" : undefined }}>{kept}</div>
          <div className="ss-stat-label">Kept</div>
        </div>
        <div className="ss-stat">
          <div className="ss-stat-value">{pct}<span style={{ fontSize: 12, marginLeft: 2 }}>%</span></div>
          <div className="ss-stat-label">Saved</div>
        </div>
      </div>

      {/* Actions */}
      <div className="ss-detail-actions">
        <button className="tk-btn tk-btn-primary tk-btn-sm" onClick={handleReopen}>
          <RotateCcw size={13} /> Re-open in Translate
        </button>
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={handleListen}>
          <Volume2 size={13} /> Listen
        </button>
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={handleCopy}>
          <Copy size={13} /> Copy
        </button>
        <div style={{ flex: 1 }} />
        <button className="tk-btn tk-btn-ghost tk-btn-sm ss-btn-danger" onClick={handleRemove}>
          <Trash2 size={13} /> Remove
        </button>
      </div>

      {/* Footer note */}
      <div className="ss-detail-footer">
        <Bookmark size={11} />
        <span>
          {kept === 0
            ? "You read through this one but didn't keep any words. That's fine — not every sentence needs to become a card."
            : kept === 1
            ? "One word kept from this sentence is now part of your study schedule."
            : `${kept} words from this sentence are now part of your study schedule.`}
        </span>
      </div>
    </div>
  );
};

// ─── Page ───

export const SavedSentencesPage = () => {
  const [all,      setAll]      = useState<SavedSentence[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [query,    setQuery]    = useState("");
  const [filter,   setFilter]   = useState<"all" | "saved" | "unsaved">("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get<SavedSentence[]>("/saved-sentences")
      .then(r => {
        setAll(r.data);
        setActiveId(r.data[0]?._id ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter(s => {
      if (filter === "saved"   && s.wordsSavedCount === 0) return false;
      if (filter === "unsaved" && s.wordsSavedCount  > 0)  return false;
      if (!q) return true;
      return s.originalText.toLowerCase().includes(q) || s.translatedText.toLowerCase().includes(q);
    });
  }, [all, query, filter]);

  const grouped = useMemo(() => {
    const map = new Map<string, SavedSentence[]>();
    filtered.forEach(s => {
      const label = dayLabel(s.createdAt);
      if (!map.has(label)) map.set(label, []);
      map.get(label)!.push(s);
    });
    return Array.from(map.entries()).map(([label, items]) => ({ label, items }));
  }, [filtered]);

  const active = all.find(s => s._id === activeId) ?? filtered[0] ?? null;

  const totalWords = all.reduce((a, s) => a + wordCount(s), 0);
  const totalKept  = all.reduce((a, s) => a + s.wordsSavedCount, 0);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/saved-sentences/${id}`);
      setAll(prev => prev.filter(s => s._id !== id));
      if (activeId === id) setActiveId(null);
    } catch {}
  };

  // ─── Empty state ───
  if (!loading && all.length === 0) {
    return (
      <div className="ss-page tk-page">
        <div className="tk-page-header" style={{ marginBottom: 32 }}>
          <div>
            <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Library</div>
            <h1 className="tk-page-title">Saved sentences</h1>
          </div>
        </div>
        <div className="ss-empty">
          <div className="ss-empty-glyph">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <path d="M40 62 C40 48, 28 40, 18 36 C22 52, 30 62, 40 62 Z" fill="var(--tk-accent-wash)" stroke="var(--tk-accent)" strokeWidth="1"/>
              <path d="M40 62 C40 48, 52 40, 62 36 C58 52, 50 62, 40 62 Z" fill="var(--tk-paper-edge)" stroke="var(--tk-accent)" strokeWidth="1"/>
              <line x1="40" y1="62" x2="40" y2="22" stroke="var(--tk-accent)" strokeWidth="1.5"/>
              <circle cx="40" cy="20" r="2.5" fill="var(--tk-accent)"/>
            </svg>
          </div>
          <div className="ss-empty-title">Nothing saved yet.</div>
          <div className="ss-empty-body">
            Every sentence you translate lands here — with the words you kept.
            Paste something on the Translate page to start.
          </div>
          <button className="tk-btn tk-btn-primary" onClick={() => navigate("/")}>
            Start translating
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ss-page tk-page">
      {/* Header */}
      <div className="tk-page-header" style={{ marginBottom: 24 }}>
        <div>
          <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Library</div>
          <h1 className="tk-page-title">Saved sentences</h1>
          {!loading && (
            <div className="ss-header-meta">
              <span><span className="ss-mono">{all.length}</span> translations</span>
              <span className="ss-dot">·</span>
              <span><span className="ss-mono">{totalWords}</span> words seen</span>
              <span className="ss-dot">·</span>
              <span><span className="ss-mono">{totalKept}</span> kept to decks</span>
            </div>
          )}
        </div>
        <button className="tk-btn tk-btn-primary" onClick={() => navigate("/")}>
          + New translation
        </button>
      </div>

      {loading ? (
        <div style={{ padding: "60px 0", textAlign: "center", color: "var(--tk-ink-3)", fontSize: 13 }}>
          Loading…
        </div>
      ) : (
        <div className="ss-shell">
          {/* ─── Left: list pane ─── */}
          <div className="ss-list-pane">
            <div className="ss-list-chrome">
              <div className="ss-search">
                <Search size={14} style={{ color: "var(--tk-ink-4)", flexShrink: 0 }} />
                <input
                  className="ss-search-input"
                  placeholder="Search translations…"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                />
                {query && (
                  <button className="ss-search-clear" onClick={() => setQuery("")}>
                    <X size={11} />
                  </button>
                )}
              </div>
              <div className="ss-filter">
                {([
                  { v: "all",     label: "All",          n: all.length },
                  { v: "saved",   label: "With saves",   n: all.filter(s => s.wordsSavedCount > 0).length },
                  { v: "unsaved", label: "No saves yet", n: all.filter(s => s.wordsSavedCount === 0).length },
                ] as const).map(f => (
                  <button
                    key={f.v}
                    className="ss-filter-chip"
                    data-active={filter === f.v}
                    onClick={() => setFilter(f.v)}
                  >
                    {f.label} <span className="ss-mono">{f.n}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="ss-list">
              {grouped.length === 0 ? (
                <div className="ss-list-empty">
                  <div style={{ fontSize: 13, color: "var(--tk-ink-3)" }}>No sentences match that.</div>
                  <button
                    className="tk-btn tk-btn-ghost tk-btn-sm"
                    style={{ marginTop: 10 }}
                    onClick={() => { setQuery(""); setFilter("all"); }}
                  >
                    Clear
                  </button>
                </div>
              ) : (
                grouped.map(({ label, items }) => (
                  <div key={label} className="ss-group">
                    <div className="ss-group-label">{label}</div>
                    {items.map(s => (
                      <button
                        key={s._id}
                        className="ss-row"
                        data-active={active?._id === s._id}
                        onClick={() => setActiveId(s._id)}
                      >
                        <div className="ss-row-main">
                          <div className="ss-row-source">{s.originalText}</div>
                          <div className="ss-row-target">{s.translatedText}</div>
                        </div>
                        <div className="ss-row-meta">
                          <span className="ss-row-time">{timeLabel(s.createdAt)}</span>
                          {s.wordsSavedCount > 0 ? (
                            <span className="ss-row-saved">
                              <span className="ss-mono">{s.wordsSavedCount}</span>/<span className="ss-mono">{wordCount(s)}</span>
                            </span>
                          ) : (
                            <span className="ss-row-unsaved">
                              <span className="ss-mono">{wordCount(s)}</span> w
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ─── Right: detail pane ─── */}
          <div className="ss-detail-pane">
            {active ? (
              <SentenceDetail s={active} onDelete={handleDelete} />
            ) : (
              <div className="ss-detail-empty">
                <div style={{ fontSize: 13, color: "var(--tk-ink-3)" }}>Pick a sentence to see it.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
