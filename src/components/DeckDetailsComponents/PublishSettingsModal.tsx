import { useState, useEffect, useRef, useContext } from "react";
import { X, Globe, Lock, ExternalLink } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import { formatLevelLabel } from "@/utils/levelDisplay";
import { EmojiPicker } from "@/components/EmojiPicker";

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

const CATEGORIES = [
  "Food & Drink", "Travel", "Body & Health", "Nature", "Weather",
  "Home", "Work", "Social", "School", "Numbers & Time",
  "Grammar", "Verbs", "Feelings", "Money", "Clothing", "Sports", "Arts", "Other",
];

interface PublishState {
  isPublic: boolean;
  level: string;
  category: string;
  publicDeckName: string;
  publicDescription: string;
  showPublicDescription: boolean;
  publisherName: string;
  showPublisherName: boolean;
  publicTags: string[];
  showPublicTags: boolean;
}

interface Props {
  deckId: string;
  deckName: string;
  deckTags?: string[];
  deckDescription?: string;
  deckEmoji?: string;
  initialState?: Partial<PublishState>;
  onClose: () => void;
  onSaved?: (updated: Partial<PublishState> & { deckEmoji?: string }) => void;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      aria-checked={on}
      role="switch"
      style={{
        width: 36, height: 22, borderRadius: 999, flexShrink: 0,
        background: on ? "var(--tk-accent)" : "var(--tk-ink-4)",
        position: "relative", border: "none", cursor: "pointer",
        transition: "background 180ms",
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 15 : 3,
        width: 16, height: 16, borderRadius: "50%", background: "var(--tk-paper)",
        transition: "left 180ms",
      }} />
    </button>
  );
}

function FieldRow({ label, hint, on, onChange, children }: {
  label: string;
  hint?: string;
  on: boolean;
  onChange: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: on && children ? 10 : 0 }}>
        <div>
          <span className="tk-field-label" style={{ marginBottom: 0 }}>{label}</span>
          {hint && <span style={{ fontSize: 11, color: "var(--tk-ink-4)", marginLeft: 6 }}>{hint}</span>}
        </div>
        <Toggle on={on} onChange={onChange} />
      </div>
      {on && children}
    </div>
  );
}

export const PublishSettingsModal: React.FC<Props> = ({
  deckId, deckName, deckTags = [], deckDescription = "", deckEmoji: initialEmoji = "", initialState, onClose, onSaved,
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(initialState?.isPublic ?? false);
  const [emoji, setEmoji] = useState(initialEmoji);
  const [level, setLevel] = useState(initialState?.level ?? "");
  const [category, setCategory] = useState(initialState?.category ?? "");
  const [publicDeckName, setPublicDeckName] = useState(initialState?.publicDeckName || "");
  const [publicDescription, setPublicDescription] = useState(
    initialState?.publicDescription || deckDescription
  );
  const [showPublicDescription, setShowPublicDescription] = useState(
    initialState?.showPublicDescription ?? true
  );
  const [publisherName, setPublisherName] = useState(initialState?.publisherName ?? "");
  const [showPublisherName, setShowPublisherName] = useState(initialState?.showPublisherName ?? false);
  const [publicTags, setPublicTags] = useState<string[]>(
    initialState?.publicTags?.length ? initialState.publicTags : deckTags
  );
  const [showPublicTags, setShowPublicTags] = useState(initialState?.showPublicTags ?? true);
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const tagRef = useRef<HTMLInputElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !publicTags.includes(t)) setPublicTags(prev => [...prev, t]);
    setTagInput("");
    tagRef.current?.focus();
  };

  const removeTag = (t: string) => setPublicTags(prev => prev.filter(x => x !== t));

  const handleTogglePublic = (val: boolean) => {
    if (!val && isPublic) {
      const confirmed = window.confirm(
        `Remove "${publicDeckName || deckName}" from the public library?\n\nLearners who already saved it keep their copy — this only hides it from Browse.`
      );
      if (!confirmed) return;
    }
    setIsPublic(val);
  };

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Partial<PublishState> = {
        isPublic, level, category,
        publicDeckName, publicDescription, showPublicDescription,
        publisherName, showPublisherName,
        publicTags, showPublicTags,
      };
      await axios.put(`/browse/${deckId}/publish`, { ...payload, deckEmoji: emoji });
      setSaved(true);
      onSaved?.({ ...payload, deckEmoji: emoji });
      if (!isPublic) {
        // Deck was unpublished — the public page no longer exists, go to their deck
        setTimeout(() => navigate(`/view-decks/${deckId}`), 800);
      } else {
        setTimeout(() => {
          setSaved(false);
          onClose();
        }, 1200);
      }
    } finally {
      setSaving(false);
    }
  }

  const displayName = publicDeckName || deckName;

  return (
    <div className="tk-modal-scrim" onClick={onClose}>
      <div
        className="tk-modal"
        style={{ width: "min(560px, calc(100vw - 40px))", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tk-modal-head">
          <div>
            <div className="tk-eyebrow">Publish settings</div>
            <div style={{ fontSize: 22, fontWeight: 500, marginTop: 4, color: "var(--tk-ink)", letterSpacing: "-0.02em" }}>
              Public library
            </div>
          </div>
          <button className="tk-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        {/* Body — scrollable */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20, overflowY: "auto" }}>

          {/* Visibility toggle */}
          <div className="ps-visibility-row">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isPublic
                ? <Globe size={15} style={{ color: "var(--tk-accent)", flexShrink: 0 }} />
                : <Lock size={15} style={{ color: "var(--tk-ink-3)", flexShrink: 0 }} />}
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tk-ink)" }}>
                  {isPublic ? "Visible in Browse" : "Private"}
                </div>
                <div style={{ fontSize: 12, color: "var(--tk-ink-3)", marginTop: 2 }}>
                  {isPublic
                    ? `Anyone can find and clone "${displayName}".`
                    : "Only you can see this deck right now."}
                </div>
              </div>
            </div>
            <Toggle on={isPublic} onChange={handleTogglePublic} />
          </div>

          {isPublic && (
            <>
              <div style={{ borderTop: "1px solid var(--tk-rule-soft)" }} />

              {/* Deck emoji */}
              <div className="tk-field">
                <div className="tk-field-label">Deck emoji</div>
                <EmojiPicker value={emoji} onChange={setEmoji} />
              </div>

              {/* Public name */}
              <div className="tk-field">
                <div className="tk-field-label">Public name</div>
                <input
                  className="tk-textfield"
                  value={publicDeckName}
                  onChange={e => setPublicDeckName(e.target.value)}
                  placeholder={deckName}
                  maxLength={80}
                />
                <div style={{ fontSize: 11, color: "var(--tk-ink-4)", marginTop: 3 }}>
                  Leave blank to use "{deckName}"
                </div>
              </div>

              {/* Level */}
              <div className="tk-field">
                <div className="tk-field-label">Level</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {(["", ...LEVELS] as string[]).map(l => (
                    <button
                      key={l || "none"}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`tk-btn tk-btn-sm ${level === l ? "tk-btn-accent" : "tk-btn-ghost"}`}
                    >
                      {l ? formatLevelLabel(l, user?.difficultyLabel) : "—"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div className="tk-field">
                <div className="tk-field-label">Category</div>
                <select
                  className="tk-textfield"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  style={{ cursor: "pointer" }}
                >
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ borderTop: "1px solid var(--tk-rule-soft)" }} />

              {/* Description */}
              <FieldRow
                label="Description"
                hint="shown to learners"
                on={showPublicDescription}
                onChange={setShowPublicDescription}
              >
                <textarea
                  className="tk-textfield"
                  value={publicDescription}
                  onChange={e => setPublicDescription(e.target.value)}
                  placeholder="What will learners find in this deck?"
                  maxLength={160}
                  rows={2}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
                  <span style={{ fontSize: 11, color: "var(--tk-ink-4)" }}>Won't change your private deck notes.</span>
                  <span style={{ fontSize: 11, color: "var(--tk-ink-4)" }}>{publicDescription.length}/160</span>
                </div>
              </FieldRow>

              {/* Tags */}
              <FieldRow label="Tags" on={showPublicTags} onChange={setShowPublicTags}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                  {publicTags.map(t => (
                    <span key={t} style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "3px 10px 3px 10px", borderRadius: 999,
                      background: "var(--tk-paper-deep)", border: "1px solid var(--tk-rule)",
                      fontSize: 12, color: "var(--tk-ink-2)",
                    }}>
                      #{t}
                      <button
                        type="button"
                        onClick={() => removeTag(t)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", color: "var(--tk-ink-4)", lineHeight: 1 }}
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <input
                    ref={tagRef}
                    className="tk-textfield"
                    data-small
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                    placeholder="Add tag… (Enter)"
                    style={{ flex: 1 }}
                  />
                  <button type="button" className="tk-btn tk-btn-ghost tk-btn-sm" onClick={addTag}>+</button>
                </div>
              </FieldRow>

              {/* Published by */}
              <FieldRow label="Published by" on={showPublisherName} onChange={setShowPublisherName}>
                <input
                  className="tk-textfield"
                  value={publisherName}
                  onChange={e => setPublisherName(e.target.value)}
                  placeholder="Your name or team…"
                  maxLength={60}
                />
              </FieldRow>
            </>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid var(--tk-rule)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexShrink: 0,
        }}>
          {/* View public page link when published */}
          {isPublic && !saved ? (
            <a
              href={`/browse/${deckId}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 5,
                fontSize: 12.5, color: "var(--tk-ink-3)",
                textDecoration: "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--tk-accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--tk-ink-3)")}
            >
              <ExternalLink size={12} /> View public page
            </a>
          ) : <div />}

          <div style={{ display: "flex", gap: 8 }}>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button
              className="tk-btn tk-btn-accent tk-btn-sm"
              onClick={handleSave}
              disabled={saving || saved}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
