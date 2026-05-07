import { useState, useEffect, useRef, useContext } from "react";
import { Globe, Lock, X, ExternalLink } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import { formatLevelLabel } from "@/utils/levelDisplay";

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
  initialState?: Partial<PublishState>;
  forceOpen?: boolean;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      style={{
        width: 34, height: 20, borderRadius: 999, flexShrink: 0,
        background: on ? "var(--tk-accent)" : "var(--tk-ink-4)",
        position: "relative", border: "none", cursor: "pointer", transition: "background 180ms",
      }}
    >
      <div style={{
        position: "absolute", top: 2, left: on ? 14 : 2,
        width: 16, height: 16, borderRadius: "50%", background: "var(--tk-paper)",
        transition: "left 180ms",
      }} />
    </button>
  );
}

function FieldRow({ label, on, onChange, children }: {
  label: string; on: boolean; onChange: (v: boolean) => void; children?: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: on && children ? 8 : 0 }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tk-ink-3)" }}>
          {label}
        </div>
        <Toggle on={on} onChange={onChange} />
      </div>
      {on && children}
    </div>
  );
}

export const PublishPanel: React.FC<Props> = ({
  deckId, deckName, deckTags = [], deckDescription = "", initialState, forceOpen,
}) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [isPublic, setIsPublic] = useState(initialState?.isPublic ?? false);
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
  const [expanded, setExpanded] = useState(!!forceOpen);
  const [highlighted, setHighlighted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLInputElement>(null);

  // When navigated here via ?publish=1 — open, scroll into view, flash a highlight ring
  useEffect(() => {
    if (!forceOpen) return;
    setExpanded(true);
    const t = setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 1400);
    }, 120); // slight delay lets the sidebar finish rendering
    return () => clearTimeout(t);
  }, [forceOpen]);

  useEffect(() => {
    if (!initialState) return;
    setIsPublic(initialState.isPublic ?? false);
    setLevel(initialState.level ?? "");
    setCategory(initialState.category ?? "");
    setPublicDeckName(initialState.publicDeckName || "");
    setPublicDescription(initialState.publicDescription || deckDescription);
    setShowPublicDescription(initialState.showPublicDescription ?? true);
    setPublisherName(initialState.publisherName ?? "");
    setShowPublisherName(initialState.showPublisherName ?? false);
    setPublicTags(initialState.publicTags?.length ? initialState.publicTags : deckTags);
    setShowPublicTags(initialState.showPublicTags ?? true);
  }, [
    initialState?.isPublic, initialState?.level, initialState?.category,
    initialState?.publicDeckName, initialState?.publicDescription,
    initialState?.showPublicDescription, initialState?.publisherName,
    initialState?.showPublisherName, initialState?.showPublicTags,
  ]);

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !publicTags.includes(t)) setPublicTags(prev => [...prev, t]);
    setTagInput("");
    tagRef.current?.focus();
  };

  const removeTag = (t: string) => setPublicTags(prev => prev.filter(x => x !== t));

  async function handleSave() {
    // Warn before removing a deck from the public library
    if (!isPublic && initialState?.isPublic) {
      const confirmed = window.confirm(
        `Remove "${publicDeckName || deckName}" from the public library?\n\nLearners who already saved it keep their copy — this only hides it from Browse.`
      );
      if (!confirmed) return;
    }
    setSaving(true);
    try {
      await axios.put(`/browse/${deckId}/publish`, {
        isPublic, level, category,
        publicDeckName, publicDescription, showPublicDescription,
        publisherName, showPublisherName,
        publicTags, showPublicTags,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="tx-aside-card" style={{ padding: 0, overflow: "hidden" }}>
      <button
        onClick={() => setExpanded(e => !e)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {isPublic
            ? <Globe size={14} style={{ color: "var(--tk-accent)" }} />
            : <Lock size={14} style={{ color: "var(--tk-ink-3)" }} />}
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--tk-ink)" }}>
            {isPublic ? "Published to library" : "Private"}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {isPublic && (
            <span style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase",
              color: "var(--tk-accent)", background: "var(--tk-accent-wash)", borderRadius: 3, padding: "1px 5px",
            }}>PUBLIC</span>
          )}
          <span style={{ fontSize: 11, color: "var(--tk-ink-4)" }}>{expanded ? "▲" : "▼"}</span>
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: "1px solid var(--tk-rule-soft)", padding: "14px 20px 16px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Visibility toggle */}
          <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
            <div style={{ position: "relative", marginTop: 2, flexShrink: 0 }}>
              <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} style={{ display: "none" }} />
              <div style={{
                width: 34, height: 20, borderRadius: 999, background: isPublic ? "var(--tk-accent)" : "var(--tk-ink-4)",
                position: "relative", transition: "background 180ms",
              }}>
                <div style={{
                  position: "absolute", top: 2, left: isPublic ? 14 : 2,
                  width: 16, height: 16, borderRadius: "50%", background: "var(--tk-paper)",
                  transition: "left 180ms",
                }} />
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--tk-ink)" }}>
                {isPublic ? "Visible in Browse" : "Add to public library"}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--tk-ink-3)", marginTop: 2 }}>
                {isPublic ? `Anyone can find and save "${deckName}".` : "Only you can see this deck right now."}
              </div>
            </div>
          </label>

          {isPublic && (
            <>
              {/* Level + Category */}
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tk-ink-3)", marginBottom: 6 }}>Level</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {(["", ...LEVELS] as string[]).map(l => (
                    <button key={l || "none"} onClick={() => setLevel(l)} style={{
                      padding: "4px 10px", borderRadius: 4, fontSize: 11.5, fontWeight: 500, cursor: "pointer",
                      background: level === l ? "var(--tk-ink)" : "var(--tk-card)",
                      color: level === l ? "var(--tk-paper)" : "var(--tk-ink-2)",
                      border: `1px solid ${level === l ? "var(--tk-ink)" : "var(--tk-rule)"}`,
                      transition: "all 130ms",
                    }}>
                      {l ? formatLevelLabel(l, user?.difficultyLabel) : "—"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tk-ink-3)", marginBottom: 6 }}>Category</div>
                <select value={category} onChange={e => setCategory(e.target.value)} style={{
                  width: "100%", height: 32, padding: "0 8px",
                  background: "var(--tk-card)", border: "1px solid var(--tk-rule)",
                  borderRadius: 6, fontSize: 12.5, color: "var(--tk-ink)", cursor: "pointer", outline: "none",
                }}>
                  <option value="">Select a category…</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div style={{ borderTop: "1px solid var(--tk-rule-soft)", paddingTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Public deck name */}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--tk-ink-3)", marginBottom: 6 }}>
                    Public name
                  </div>
                  <input
                    type="text"
                    value={publicDeckName}
                    onChange={e => setPublicDeckName(e.target.value)}
                    placeholder={deckName}
                    maxLength={80}
                    style={{
                      width: "100%", height: 32, padding: "0 10px",
                      background: "var(--tk-card)", border: "1px solid var(--tk-rule)",
                      borderRadius: 6, fontSize: 12.5, color: "var(--tk-ink)",
                      fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                    }}
                  />
                  <div style={{ fontSize: 11, color: "var(--tk-ink-4)", marginTop: 3 }}>
                    Leave blank to use "{deckName}"
                  </div>
                </div>

                {/* Description toggle + field */}
                <FieldRow label="Description" on={showPublicDescription} onChange={setShowPublicDescription}>
                  <textarea
                    value={publicDescription}
                    onChange={e => setPublicDescription(e.target.value)}
                    placeholder="What will learners find in this deck?"
                    maxLength={160}
                    rows={2}
                    style={{
                      width: "100%", padding: "8px 10px", resize: "none",
                      background: "var(--tk-card)", border: "1px solid var(--tk-rule)",
                      borderRadius: 6, fontSize: 12.5, color: "var(--tk-ink)",
                      fontFamily: "inherit", outline: "none", lineHeight: 1.5, boxSizing: "border-box",
                    }}
                  />
                  <div style={{ fontSize: 11, color: "var(--tk-ink-4)", marginTop: 3 }}>
                    Won't change your private deck notes.
                  </div>
                </FieldRow>

                {/* Tags toggle + editor */}
                <FieldRow label="Tags" on={showPublicTags} onChange={setShowPublicTags}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                    {publicTags.map(t => (
                      <span key={t} style={{
                        display: "inline-flex", alignItems: "center", gap: 4,
                        padding: "2px 8px", borderRadius: "99px",
                        background: "var(--tk-paper-deep)", border: "1px solid var(--tk-rule)",
                        fontSize: 11.5, color: "var(--tk-ink-2)",
                      }}>
                        #{t}
                        <button onClick={() => removeTag(t)} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex", color: "var(--tk-ink-4)" }}>
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      ref={tagRef}
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(); } }}
                      placeholder="Add tag…"
                      style={{
                        flex: 1, height: 28, padding: "0 8px",
                        background: "var(--tk-card)", border: "1px solid var(--tk-rule)",
                        borderRadius: 6, fontSize: 12, color: "var(--tk-ink)",
                        fontFamily: "inherit", outline: "none",
                      }}
                    />
                    <button
                      onClick={addTag}
                      style={{
                        height: 28, padding: "0 10px", borderRadius: 6, fontSize: 12,
                        background: "var(--tk-paper-deep)", border: "1px solid var(--tk-rule)",
                        color: "var(--tk-ink-2)", cursor: "pointer",
                      }}
                    >+</button>
                  </div>
                </FieldRow>

                {/* Publisher name toggle + field */}
                <FieldRow label="Published by" on={showPublisherName} onChange={setShowPublisherName}>
                  <input
                    type="text"
                    value={publisherName}
                    onChange={e => setPublisherName(e.target.value)}
                    placeholder="Your name or team…"
                    maxLength={60}
                    style={{
                      width: "100%", height: 32, padding: "0 10px",
                      background: "var(--tk-card)", border: "1px solid var(--tk-rule)",
                      borderRadius: 6, fontSize: 12.5, color: "var(--tk-ink)",
                      fontFamily: "inherit", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </FieldRow>
              </div>
            </>
          )}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              className="tk-btn tk-btn-accent"
              style={{ fontSize: 12, padding: "5px 14px", opacity: saved ? 1 : 0.9 }}
              onClick={handleSave}
              disabled={saving}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

