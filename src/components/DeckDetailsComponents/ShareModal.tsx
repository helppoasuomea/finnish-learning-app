import { useState, useEffect, useCallback, useRef } from "react";
import { X, Copy, Check, Share2 } from "lucide-react";
import axios from "axios";

interface Props {
  deckId: string;
  deckName: string;
  deckEmoji?: string;
  cardCount: number;
  onClose: () => void;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      aria-pressed={on}
      style={{
        width: 34, height: 20, borderRadius: 999, flexShrink: 0, padding: 0,
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

export const ShareModal: React.FC<Props> = ({ deckId, deckName, deckEmoji, cardCount, onClose }) => {
  const [slug, setSlug] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [allowSave, setAllowSave] = useState(true);
  const [shareProgress, setShareProgress] = useState(false);
  const [requireAuth, setRequireAuth] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  // Create or fetch share link on mount
  useEffect(() => {
    setLoading(true);
    axios.post("/share", { deckId })
      .then(r => {
        setSlug(r.data.slug);
        setMessage(r.data.message ?? "");
        setAllowSave(r.data.allowSave ?? true);
        setShareProgress(r.data.shareProgress ?? false);
        setRequireAuth(r.data.requireAuth ?? false);
      })
      .catch((e) => setLinkError(e.response?.data?.error ?? e.message ?? "Unknown error"))
      .finally(() => setLoading(false));
  }, [deckId]);

  const save = useCallback(async (patch: {
    message?: string;
    allowSave?: boolean;
    shareProgress?: boolean;
    requireAuth?: boolean;
  }) => {
    if (!slug) return;
    setSaving(true);
    try {
      await axios.put(`/share/${slug}`, patch);
    } finally {
      setSaving(false);
    }
  }, [slug]);

  const handleToggle = (field: string, value: boolean) => {
    if (field === "allowSave")     { setAllowSave(value);     save({ allowSave: value }); }
    if (field === "shareProgress") { setShareProgress(value); save({ shareProgress: value }); }
    if (field === "requireAuth")   { setRequireAuth(value);   save({ requireAuth: value }); }
  };

  // Debounce message save
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleMessage = (v: string) => {
    setMessage(v);
    if (msgTimer.current) clearTimeout(msgTimer.current);
    msgTimer.current = setTimeout(() => save({ message: v }), 600);
  };

  const shareUrl = slug ? `${window.location.origin}/s/${slug}` : "";

  const handleCopy = async () => {
    if (!shareUrl) return;
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="tk-modal-scrim" onClick={onClose}>
      <div className="tk-modal sm-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="tk-modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Share2 size={16} style={{ color: "var(--tk-accent)" }} />
            <div>
              <div className="tk-eyebrow">Share</div>
              <div style={{ fontSize: 20, fontWeight: 500, marginTop: 1 }}>Send a copy</div>
            </div>
          </div>
          <button className="tk-icon-btn" onClick={onClose}><X size={15} /></button>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Deck preview */}
          <div className="sm-deck-preview">
            <div className="sm-deck-emoji">{deckEmoji || "📚"}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--tk-ink)" }}>{deckName}</div>
              <div style={{ fontSize: 12, color: "var(--tk-ink-3)", marginTop: 2 }}>{cardCount} cards</div>
            </div>
          </div>

          {/* Message */}
          <div>
            <div className="sm-field-label">Add a note <span style={{ color: "var(--tk-ink-4)", fontWeight: 400 }}>— optional</span></div>
            <textarea
              ref={msgRef}
              className="tk-textfield"
              rows={3}
              placeholder="Hey, thought you'd like these cards…"
              value={message}
              onChange={e => handleMessage(e.target.value)}
              maxLength={280}
              style={{ resize: "none", fontSize: 13 }}
            />
          </div>

          {/* URL field */}
          <div>
            <div className="sm-field-label">Share link</div>
            {loading ? (
              <div className="sm-url-wrap" style={{ opacity: 0.5 }}>
                <div className="sm-url-text">Generating link…</div>
              </div>
            ) : linkError ? (
              <div style={{ fontSize: 12.5, color: "var(--tk-persimmon, #c4604e)", padding: "8px 0" }}>
                {linkError}
              </div>
            ) : (
              <div className="sm-url-wrap">
                <div className="sm-url-text">{shareUrl}</div>
                <button className="sm-copy-btn" onClick={handleCopy} title="Copy link">
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, borderTop: "1px solid var(--tk-rule-soft)", paddingTop: 18 }}>
            {([
              {
                field: "allowSave",
                value: allowSave,
                label: "Let recipients save their own copy",
                desc: "They'll get a personal copy in their library.",
              },
              {
                field: "shareProgress",
                value: shareProgress,
                label: "Share your progress",
                desc: "Recipients can see which cards you've mastered.",
              },
              {
                field: "requireAuth",
                value: requireAuth,
                label: "Require sign-in to view",
                desc: "Only signed-in users can open the link.",
              },
            ] as const).map(opt => (
              <div key={opt.field} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--tk-ink)" }}>{opt.label}</div>
                  <div style={{ fontSize: 11.5, color: "var(--tk-ink-3)", marginTop: 2 }}>{opt.desc}</div>
                </div>
                <Toggle
                  on={opt.value}
                  onChange={v => handleToggle(opt.field, v)}
                />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            {saving && <div style={{ fontSize: 12, color: "var(--tk-ink-4)", alignSelf: "center" }}>Saving…</div>}
            <button className="tk-btn tk-btn-accent" onClick={onClose}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
};
