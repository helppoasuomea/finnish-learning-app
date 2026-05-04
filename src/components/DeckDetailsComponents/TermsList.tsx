import { useState, useMemo, useEffect } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Search, Plus, Clipboard, Star, Volume2, MoreHorizontal, AlertTriangle, Pencil, ArrowRightLeft, FolderOpen, Trash2, GitMerge, Check, X } from "lucide-react";
import { Card } from "@/types";
import type { DuplicateInfo } from "@/state/hooks/useFindDuplicates";

interface Props {
  cards: Card[];
  stillLearning: Card[];
  notStudied: Card[];
  completed: Card[];
  onAddCard: () => void;
  onPasteImport: () => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (card: Card) => void;
  crossDeckDupes?: { [cardId: string]: DuplicateInfo[] };
  onMergeDupes?: (card: Card) => void;
  onRemoveDupes?: (card: Card) => void;
}

const ScoreDots: React.FC<{ score: number }> = ({ score }) => (
  <div className="tl-score">
    {[1,2,3,4,5].map(i => <div key={i} className={`tl-score-dot ${score >= i ? "is-on" : ""}`} />)}
  </div>
);

interface RowMenuProps { onEdit: () => void; onDelete: () => void; }
const RowMenu: React.FC<RowMenuProps> = ({ onEdit, onDelete }) => (
  <div className="tl-menu">
    <button onClick={onEdit}><Pencil size={13} />Edit card</button>
    <button><ArrowRightLeft size={13} />Swap front/back</button>
    <button><FolderOpen size={13} />Move to another deck…</button>
    <div className="tl-menu-sep" />
    <button data-danger="true" onClick={onDelete}><Trash2 size={13} />Delete</button>
  </div>
);

interface DupePopoverProps {
  word: string; count: number; dupeDecks: string[];
  onClose: () => void; onMerge: () => void; onRemove: () => void; onKeep: () => void;
}
const DupePopover: React.FC<DupePopoverProps> = ({ word, count, dupeDecks, onClose, onMerge, onRemove, onKeep }) => (
  <div className="tl-dupe-pop">
    <div className="tl-dupe-pop-head">Duplicate: <em>{word}</em></div>
    <div className="tl-dupe-pop-sub">
      {count} copies across your library
      {dupeDecks.length > 0 && <> — in {dupeDecks.map((n, i) => <em key={i}>{i > 0 ? ', ' : ''}{n}</em>)}</>}.
      Pick one:
    </div>
    <button className="tl-dupe-pop-row" onClick={onMerge}>
      <span className="tl-dupe-pop-ic"><GitMerge size={12} /></span>
      <div><strong>Merge into one</strong><span>Keep highest progress. Other translations become notes.</span></div>
    </button>
    <button className="tl-dupe-pop-row" onClick={onRemove}>
      <span className="tl-dupe-pop-ic" style={{ color: "var(--tk-persimmon)" }}><Trash2 size={12} /></span>
      <div><strong>Remove duplicates</strong><span>Keeps the oldest. Deletes the rest.</span></div>
    </button>
    <button className="tl-dupe-pop-row" onClick={onKeep}>
      <span className="tl-dupe-pop-ic"><Check size={12} /></span>
      <div><strong>Keep both</strong><span>Different meanings — that's fine.</span></div>
    </button>
  </div>
);

const TagPill: React.FC<{ tone: string; children: React.ReactNode }> = ({ tone, children }) => {
  const colors: Record<string, { bg: string; color: string; border: string }> = {
    clay:   { bg: "color-mix(in oklab, var(--tk-persimmon) 12%, var(--tk-card))", color: "var(--tk-persimmon)", border: "color-mix(in oklab, var(--tk-persimmon) 25%, var(--tk-rule))" },
    moss:   { bg: "var(--tk-accent-wash)", color: "var(--tk-accent-deep)", border: "var(--tk-accent-soft)" },
    ink:    { bg: "var(--tk-paper-deep)", color: "var(--tk-ink-2)", border: "var(--tk-rule)" },
  };
  const s = colors[tone] || colors.ink;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", padding: "3px 10px", borderRadius: 999, fontSize: 11.5, fontWeight: 600, letterSpacing: "0.03em", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
      {children}
    </span>
  );
};

export const TermsList: React.FC<Props> = ({ cards, stillLearning, notStudied, completed, onAddCard, onPasteImport, onDeleteCard, onEditCard, crossDeckDupes = {}, onMergeDupes, onRemoveDupes }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuForId, setMenuForId] = useState<string | null>(null);
  const [dupeBannerDismissed, setDupeBannerDismissed] = useState(false);
  // Tracks which card's dupe popover is open + the viewport position of the badge
  const [dupeAnchor, setDupeAnchor] = useState<{
    cardId: string;
    top: number;
    left: number;
  } | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 250);

  const dupeCardIds = useMemo(() => Object.keys(crossDeckDupes), [crossDeckDupes]);
  const dupeCount = dupeCardIds.length;

  // Close popover when clicking outside (the overlay handles it) or on Escape
  useEffect(() => {
    if (!dupeAnchor) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDupeAnchor(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dupeAnchor]);

  // Reset banner dismissed state when dupes change (e.g. after merge/remove)
  useEffect(() => {
    if (dupeCount === 0) setDupeBannerDismissed(false);
  }, [dupeCount]);

  const searchResults = useMemo(() => {
    if (!debouncedSearch) return null;
    const q = debouncedSearch.toLowerCase();
    return cards.filter(c => c.userLangCard.toLowerCase().includes(q) || c.engCard.toLowerCase().includes(q));
  }, [debouncedSearch, cards]);

  const sections: [string, Card[], string][] = [
    ["Still learning", stillLearning, "clay"],
    ["Not studied",    notStudied,    "ink"],
    ["Completed",      completed,     "moss"],
  ];

  const renderRow = (c: Card) => {
    const isDupe = !!crossDeckDupes[c._id]?.length;
    return (
      <div key={c._id} className="tl-row">
        <div className="tl-fi">
          {c.userLangCard}
          {isDupe && (
            <button
              className="tl-dupe"
              onClick={e => {
                e.stopPropagation();
                if (dupeAnchor?.cardId === c._id) {
                  setDupeAnchor(null);
                } else {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setDupeAnchor({ cardId: c._id, top: rect.bottom + 6, left: rect.left });
                }
              }}
            >
              <AlertTriangle size={9} />×{(crossDeckDupes[c._id]?.length ?? 0) + 1}
            </button>
          )}
        </div>
        <div className="tl-en">{c.engCard}</div>
        <ScoreDots score={c.cardScore} />
        <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
          <button className="tk-icon-btn" style={{ width: 28, height: 28 }}>
            <Star size={13} style={{ color: c.favorite ? "var(--tk-persimmon)" : "var(--tk-ink-4)" }} />
          </button>
          <button className="tk-icon-btn" style={{ width: 28, height: 28 }}><Volume2 size={13} /></button>
          <div className="tl-kebab" style={{ position: "relative" }}>
            <button
              className="tk-icon-btn"
              style={{ width: 28, height: 28 }}
              onClick={e => { e.stopPropagation(); setMenuForId(menuForId === c._id ? null : c._id); }}
            >
              <MoreHorizontal size={13} />
            </button>
            {menuForId === c._id && (
              <RowMenu
                onEdit={() => { setMenuForId(null); onEditCard(c); }}
                onDelete={() => { setMenuForId(null); onDeleteCard(c._id); }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  // Card currently anchored for dupe popover
  const anchoredCard = dupeAnchor ? cards.find(c => c._id === dupeAnchor.cardId) : null;
  const anchoredDupes = anchoredCard ? (crossDeckDupes[anchoredCard._id] ?? []) : [];

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <h2 className="tk-display-sm">Terms in this shelf</h2>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <Search size={14} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--tk-ink-4)" }} />
            <input className="tk-textfield" placeholder="Find a word…" style={{ paddingLeft: 34, width: 200 }}
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onPasteImport}>
            <Clipboard size={13} />Paste import
          </button>
          <button className="tk-btn tk-btn-accent tk-btn-sm" onClick={onAddCard}>
            <Plus size={13} />Add card
          </button>
        </div>
      </div>

      {/* Duplicate summary banner */}
      {dupeCount > 0 && !dupeBannerDismissed && (
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          marginBottom: 16, padding: "9px 14px",
          background: "color-mix(in oklab, var(--tk-persimmon) 8%, var(--tk-card))",
          border: "1px solid color-mix(in oklab, var(--tk-persimmon) 20%, var(--tk-rule))",
          borderRadius: 8, fontSize: 12.5,
        }}>
          <AlertTriangle size={13} style={{ color: "var(--tk-persimmon)", flexShrink: 0 }} />
          <span style={{ flex: 1, color: "var(--tk-ink-2)" }}>
            <strong style={{ color: "var(--tk-ink)", fontWeight: 600 }}>{dupeCount} word{dupeCount !== 1 ? "s" : ""}</strong> found in other decks.
            Click the <strong style={{ fontWeight: 600 }}>△</strong> badge on a card to merge or remove.
          </span>
          <button
            onClick={() => setDupeBannerDismissed(true)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tk-ink-3)", padding: 2, display: "flex" }}
          >
            <X size={13} />
          </button>
        </div>
      )}

      {searchResults ? (
        <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 12, padding: 6 }}>
          {searchResults.length === 0 ? (
            <div style={{ padding: "20px 12px", textAlign: "center", color: "var(--tk-ink-3)", fontSize: 14 }}>No results</div>
          ) : searchResults.map(renderRow)}
        </div>
      ) : (
        sections.map(([title, list, tone]) => list.length > 0 && (
          <div key={title} style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <TagPill tone={tone}>{title}</TagPill>
              <span className="tk-mono" style={{ fontSize: 12, color: "var(--tk-ink-3)" }}>{list.length}</span>
            </div>
            <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 12, padding: 6 }}>
              {list.map(renderRow)}
            </div>
          </div>
        ))
      )}

      {/* Dupe popover — rendered at root level with position:fixed to escape stacking contexts */}
      {dupeAnchor && anchoredCard && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 999 }}
            onClick={() => setDupeAnchor(null)}
          />
          <div style={{
            position: "fixed",
            top: dupeAnchor.top,
            left: dupeAnchor.left,
            zIndex: 1000,
          }}>
            <DupePopover
              word={anchoredCard.userLangCard}
              count={anchoredDupes.length + 1}
              dupeDecks={[...new Set(anchoredDupes.map(d => d.deckName))]}
              onClose={() => setDupeAnchor(null)}
              onMerge={() => { setDupeAnchor(null); onMergeDupes?.(anchoredCard); }}
              onRemove={() => { setDupeAnchor(null); onRemoveDupes?.(anchoredCard); }}
              onKeep={() => setDupeAnchor(null)}
            />
          </div>
        </>
      )}
    </div>
  );
};
