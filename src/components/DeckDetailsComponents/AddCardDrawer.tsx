import { useState, useMemo, useRef } from "react";
import { X, Plus, Check, AlertTriangle } from "lucide-react";

const TYPE_OPTIONS = ["noun", "verb", "adjective", "adverb", "phrase", "other"];

interface Props {
  deckName: string;
  existingFi: Set<string>;
  onClose: () => void;
  onAdd: (card: { userLangCard: string; engCard: string; type: string; pronunciation: string }) => void;
}

const Drawer: React.FC<{ title: string; subtitle: string; onClose: () => void; children: React.ReactNode; footer: React.ReactNode }> = ({ title, subtitle, onClose, children, footer }) => (
  <>
    <div className="tk-drawer-scrim" onClick={onClose} />
    <div className="tk-drawer">
      <div className="tk-drawer-head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tk-eyebrow">Deck action</div>
          <div className="tk-drawer-title">{title}</div>
          <div className="tk-drawer-sub">{subtitle}</div>
        </div>
        <button className="tk-icon-btn" onClick={onClose}><X size={15} /></button>
      </div>
      <div className="tk-drawer-body">{children}</div>
      <div className="tk-drawer-foot">{footer}</div>
    </div>
  </>
);

export const AddCardDrawer: React.FC<Props> = ({ deckName, existingFi, onClose, onAdd }) => {
  const [fi, setFi] = useState("");
  const [en, setEn] = useState("");
  const [type, setType] = useState("noun");
  const [pron, setPron] = useState("");
  const [addedCount, setAddedCount] = useState(0);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const fiRef = useRef<HTMLInputElement>(null);

  const dupe = useMemo(() => !!fi.trim() && existingFi.has(fi.trim().toLowerCase()), [fi, existingFi]);
  const valid = fi.trim() && en.trim();

  const submit = (continueAdding: boolean) => {
    if (!valid) return;
    onAdd({ userLangCard: fi.trim(), engCard: en.trim(), type, pronunciation: pron.trim() });
    setJustAdded(fi.trim());
    setAddedCount(c => c + 1);
    setFi(""); setEn(""); setPron("");
    if (continueAdding) { setTimeout(() => fiRef.current?.focus(), 40); }
    else { setTimeout(onClose, 350); }
  };

  return (
    <Drawer
      title="Add a card"
      subtitle={`Into ${deckName}`}
      onClose={onClose}
      footer={
        <>
          <div style={{ fontSize: 12, color: "var(--tk-ink-3)", fontFamily: "'Geist Mono', monospace" }}>
            {addedCount > 0 ? `${addedCount} added this session` : "Two fields required"}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose}>Done</button>
            <button className="tk-btn tk-btn-sm" disabled={!valid} onClick={() => submit(true)}
              style={{ background: "var(--tk-ink)", color: "var(--tk-paper)" }}>
              Add another <Plus size={13} />
            </button>
            <button className="tk-btn tk-btn-accent tk-btn-sm" disabled={!valid} onClick={() => submit(false)}>
              Add & close <Check size={13} />
            </button>
          </div>
        </>
      }
    >
      {justAdded && (
        <div style={{ padding: "10px 12px", background: "color-mix(in oklab, var(--tk-accent) 10%, var(--tk-card))", border: "1px solid color-mix(in oklab, var(--tk-accent) 25%, var(--tk-rule))", borderRadius: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
          <Check size={14} style={{ color: "var(--tk-accent)" }} />
          <span><em style={{ fontStyle: "italic" }}>{justAdded}</em> added</span>
        </div>
      )}
      <div className="tk-field">
        <div className="tk-field-label">Finnish <small>required</small></div>
        <input ref={fiRef} autoFocus className="tk-textfield" value={fi} onChange={e => setFi(e.target.value)} placeholder="kirjakauppa" />
        {dupe && (
          <div style={{ marginTop: 6, fontSize: 12, color: "var(--tk-persimmon)", display: "flex", alignItems: "center", gap: 6 }}>
            <AlertTriangle size={12} />
            Already exists in this deck. You can still add — we'll flag it as a duplicate.
          </div>
        )}
      </div>
      <div className="tk-field">
        <div className="tk-field-label">English <small>required</small></div>
        <input className="tk-textfield" value={en} onChange={e => setEn(e.target.value)} placeholder="bookstore" />
      </div>
      <div className="tk-field">
        <div className="tk-field-label">Type</div>
        <div className="tk-chips">
          {TYPE_OPTIONS.map(t => (
            <button key={t} data-active={type === t} onClick={() => setType(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="tk-field">
        <div className="tk-field-label">Pronunciation <small>optional</small></div>
        <input className="tk-textfield" data-small value={pron} onChange={e => setPron(e.target.value)} placeholder="/ˈkirjakauppa/" />
      </div>
    </Drawer>
  );
};
