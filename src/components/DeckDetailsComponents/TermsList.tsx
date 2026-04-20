import { useState, useMemo } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { Search, Plus, Clipboard, Star, Volume2, MoreHorizontal, AlertTriangle, Pencil, ArrowRightLeft, FolderOpen, Trash2, GitMerge, X, Check } from "lucide-react";
import { Card } from "@/types";

interface Props {
  cards: Card[];
  stillLearning: Card[];
  notStudied: Card[];
  completed: Card[];
  onAddCard: () => void;
  onPasteImport: () => void;
  onDeleteCard: (cardId: string) => void;
  onEditCard: (card: Card) => void;
}

const ScoreDots: React.FC<{ score: number }> = ({ score }) => (
  <div className="tl-score">
    {[1,2,3,4,5].map(i => <div key={i} className={`tl-score-dot ${score >= i ? "is-on" : ""}`} />)}
  </div>
);

interface RowMenuProps { onClose: () => void; onEdit: () => void; onDelete: () => void; }
const RowMenu: React.FC<RowMenuProps> = ({ onClose, onEdit, onDelete }) => (
  <div className="tl-menu">
    <button onClick={onEdit}><Pencil size={13} />Edit card</button>
    <button><ArrowRightLeft size={13} />Swap front/back</button>
    <button><FolderOpen size={13} />Move to another deck…</button>
    <div className="tl-menu-sep" />
    <button data-danger="true" onClick={onDelete}><Trash2 size={13} />Delete</button>
  </div>
);

interface DupePopoverProps { word: string; count: number; onClose: () => void; onMerge: () => void; onRemove: () => void; onKeep: () => void; }
const DupePopover: React.FC<DupePopoverProps> = ({ word, count, onClose, onMerge, onRemove, onKeep }) => (
  <div className="tl-dupe-pop" style={{ left: 0, top: "calc(100% + 4px)" }}>
    <div className="tl-dupe-pop-head">Duplicate: <em>{word}</em></div>
    <div className="tl-dupe-pop-sub">{count} copies of this word in this deck.</div>
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

export const TermsList: React.FC<Props> = ({ cards, stillLearning, notStudied, completed, onAddCard, onPasteImport, onDeleteCard, onEditCard }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [menuForId, setMenuForId] = useState<string | null>(null);
  const [dupePopForWord, setDupePopForWord] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 250);

  const dupeIndex = useMemo(() => {
    const map = new Map<string, number>();
    cards.forEach(c => { const k = c.userLangCard.toLowerCase(); map.set(k, (map.get(k) || 0) + 1); });
    return map;
  }, [cards]);

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
    const dupeCount = dupeIndex.get(c.userLangCard.toLowerCase()) || 0;
    const isDupe = dupeCount > 1;
    return (
      <div key={c._id} className="tl-row">
        <div className="tl-fi">
          {c.userLangCard}
          {isDupe && (
            <button className="tl-dupe"
              onClick={e => { e.stopPropagation(); setDupePopForWord(dupePopForWord === c.userLangCard ? null : c.userLangCard); }}>
              <AlertTriangle size={9} />×{dupeCount}
            </button>
          )}
          {dupePopForWord === c.userLangCard && (
            <DupePopover
              word={c.userLangCard} count={dupeCount}
              onClose={() => setDupePopForWord(null)}
              onMerge={() => setDupePopForWord(null)}
              onRemove={() => setDupePopForWord(null)}
              onKeep={() => setDupePopForWord(null)}
            />
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
                onClose={() => setMenuForId(null)}
                onEdit={() => { setMenuForId(null); onEditCard(c); }}
                onDelete={() => { setMenuForId(null); onDeleteCard(c._id); }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

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
    </div>
  );
};
