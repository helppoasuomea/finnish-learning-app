import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

const LANGUAGES = ["Finnish", "Japanese", "Spanish", "French", "German", "Italian"];

interface Props {
  deckName: string;
  description: string;
  deckTags: string[];
  onClose: () => void;
  onSave: (patch: { deckName: string; description: string; deckTags: string[] }) => void;
  onDelete?: () => void;
}

export const EditDetailsModal: React.FC<Props> = ({ deckName, description, deckTags, onClose, onSave, onDelete }) => {
  const [name, setName] = useState(deckName);
  const [desc, setDesc] = useState(description || "");
  const [tags, setTags] = useState([...deckTags]);
  const [tagInput, setTagInput] = useState("");
  const [lang, setLang] = useState(deckTags[0] || "Finnish");

  const addTag = () => {
    const t = tagInput.trim();
    if (!t || tags.includes(t)) return;
    setTags([...tags, t]);
    setTagInput("");
  };

  return (
    <div className="tk-modal-scrim" onClick={onClose}>
      <div className="tk-modal" style={{ width: "min(520px, calc(100vw - 40px))" }} onClick={e => e.stopPropagation()}>
        <div className="tk-modal-head">
          <div>
            <div className="tk-eyebrow">Edit deck</div>
            <div style={{ fontSize: 22, fontWeight: 500, marginTop: 2 }}>Deck details</div>
          </div>
          <button className="tk-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="tk-field">
            <div className="tk-field-label">Name</div>
            <input className="tk-textfield" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="tk-field">
            <div className="tk-field-label">Description</div>
            <textarea className="tk-textfield" value={desc} onChange={e => setDesc(e.target.value)} rows={3} />
          </div>
          <div className="tk-field">
            <div className="tk-field-label">Language</div>
            <div className="tk-chips">
              {LANGUAGES.map(l => (
                <button key={l} data-active={lang === l} onClick={() => setLang(l)}>{l}</button>
              ))}
            </div>
          </div>
          <div className="tk-field" style={{ marginBottom: 0 }}>
            <div className="tk-field-label">Tags</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
              {tags.map(t => (
                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 8px 4px 10px", background: "var(--tk-paper-deep)", borderRadius: 999, fontSize: 12, color: "var(--tk-ink-2)" }}>
                  {t}
                  <button onClick={() => setTags(tags.filter(x => x !== t))} style={{ color: "var(--tk-ink-4)", background: "none", border: "none", cursor: "pointer", display: "flex" }}>
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <input className="tk-textfield" data-small value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                placeholder="Add a tag… (Enter)" style={{ flex: 1 }} />
              <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={addTag}><Plus size={12} /></button>
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 24px", borderTop: "1px solid var(--tk-rule)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {onDelete ? (
            <button className="tk-btn tk-btn-ghost tk-btn-sm" style={{ color: "var(--tk-persimmon)" }} onClick={onDelete}>
              <Trash2 size={13} /> Delete deck
            </button>
          ) : <div />}
          <div style={{ display: "flex", gap: 8 }}>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-accent tk-btn-sm" onClick={() => {
              onSave({ deckName: name, description: desc, deckTags: [lang, ...tags.filter(t => t !== lang)] });
              onClose();
            }}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
