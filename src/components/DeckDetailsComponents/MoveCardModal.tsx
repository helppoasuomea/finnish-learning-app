import { useState } from "react";
import { X, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Card, Deck } from "@/types";
import axios from "axios";

interface Props {
  card: Card | null;
  sourceDeckId: string;
  sourceDeckName: string;
  decks: Deck[];
  onClose: () => void;
  onMoved: (deckName: string) => void;
}

export const MoveCardModal: React.FC<Props> = ({ card, sourceDeckId, sourceDeckName, decks, onClose, onMoved }) => {
  const [tab, setTab] = useState<"existing" | "new">("existing");
  const [selectedDeckId, setSelectedDeckId] = useState("");
  const [newDeckName, setNewDeckName] = useState("");
  const [removeFromSource, setRemoveFromSource] = useState(true);
  const [saving, setSaving] = useState(false);

  const otherDecks = decks.filter(d => d._id !== sourceDeckId);

  const canMove = tab === "existing" ? !!selectedDeckId : newDeckName.trim().length > 0;

  const handleMove = async () => {
    if (!card || !canMove) return;
    setSaving(true);
    try {
      const res = await axios.post("/decks/move-card", {
        sourceCardId: card._id,
        sourceDeckId,
        targetDeckId: tab === "existing" ? selectedDeckId : undefined,
        newDeckName: tab === "new" ? newDeckName.trim() : undefined,
        removeFromSource,
      });
      onMoved(res.data.deckName);
      onClose();
    } catch {
      // silent — parent can handle refresh
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!card} onOpenChange={open => { if (!open) onClose(); }}>
      <DialogContent
        className="p-0 gap-0 overflow-hidden"
        style={{ maxWidth: 560, borderRadius: 16, border: "1px solid var(--tk-rule)" }}
      >
        <DialogTitle className="sr-only">Move card</DialogTitle>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--tk-rule-soft)" }}>
          <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", color: "var(--tk-ink-3)", textTransform: "uppercase", marginBottom: 6 }}>
            Move cards
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontSize: 22, fontWeight: 600, color: "var(--tk-ink)", margin: 0 }}>Where should they go?</h2>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--tk-ink-3)", padding: 4, display: "flex" }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Card preview */}
        <div style={{ margin: "16px 24px", padding: "12px 16px", background: "var(--tk-paper-deep)", borderRadius: 10, border: "1px solid var(--tk-rule-soft)" }}>
          <div style={{ fontSize: 12.5, color: "var(--tk-ink-3)", marginBottom: 8 }}>
            <strong style={{ color: "var(--tk-ink)", fontWeight: 600 }}>1 card</strong> from <em style={{ fontFamily: "var(--font-display)" }}>{sourceDeckName}</em>
          </div>
          {card && (
            <span style={{
              display: "inline-block", padding: "3px 10px", background: "var(--tk-card)", border: "1px solid var(--tk-rule)",
              borderRadius: 6, fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--tk-ink-2)"
            }}>
              {card.userLangCard}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, padding: "0 24px", marginBottom: 12 }}>
          {(["existing", "new"] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "6px 16px", borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: "pointer",
                border: "1px solid var(--tk-rule)",
                background: tab === t ? "var(--tk-ink)" : "var(--tk-card)",
                color: tab === t ? "var(--tk-paper)" : "var(--tk-ink-2)",
                transition: "background 150ms, color 150ms",
              }}
            >
              {t === "existing" ? "Existing deck" : "New deck"}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: "0 24px", maxHeight: 320, overflowY: "auto" }}>
          {tab === "existing" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingBottom: 12 }}>
              {otherDecks.length === 0 ? (
                <p style={{ color: "var(--tk-ink-3)", fontSize: 14, padding: "12px 0" }}>No other decks available.</p>
              ) : otherDecks.map(d => (
                <button
                  key={d._id}
                  onClick={() => setSelectedDeckId(d._id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                    background: selectedDeckId === d._id ? "color-mix(in oklab, var(--tk-accent) 8%, var(--tk-card))" : "var(--tk-card)",
                    border: `1px solid ${selectedDeckId === d._id ? "color-mix(in oklab, var(--tk-accent) 30%, var(--tk-rule))" : "var(--tk-rule)"}`,
                    borderRadius: 10, cursor: "pointer", textAlign: "left", transition: "border-color 150ms, background 150ms",
                  }}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: "50%", background: "var(--tk-paper-deep)",
                    border: "1px solid var(--tk-rule)", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: "var(--tk-ink-2)", flexShrink: 0,
                  }}>
                    {d.deckName[0]?.toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--tk-ink)", marginBottom: 2 }}>{d.deckName}</div>
                    <div style={{ fontSize: 12, color: "var(--tk-ink-3)" }}>
                      {d.cards?.length ?? 0} cards · {d.deckTags?.[0] ?? ""}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div style={{ paddingBottom: 12 }}>
              <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.08em", color: "var(--tk-ink-3)", textTransform: "uppercase", marginBottom: 8 }}>
                New deck name
              </div>
              <input
                className="tk-textfield"
                placeholder={`e.g. ${sourceDeckName} · Topic`}
                value={newDeckName}
                onChange={e => setNewDeckName(e.target.value)}
                style={{ width: "100%", fontSize: 15 }}
                autoFocus
              />
              <p style={{ fontSize: 12.5, color: "var(--tk-ink-3)", marginTop: 8, fontStyle: "italic", fontFamily: "var(--font-display)" }}>
                Inherits tags from <em>{sourceDeckName}</em>. You can edit details after it's created.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 24px",
          borderTop: "1px solid var(--tk-rule-soft)", background: "var(--tk-paper-deep)"
        }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--tk-ink-2)", cursor: "pointer", flex: 1 }}>
            <input
              type="checkbox"
              checked={removeFromSource}
              onChange={e => setRemoveFromSource(e.target.checked)}
              style={{ accentColor: "var(--tk-accent)", width: 14, height: 14 }}
            />
            Remove from <em style={{ fontFamily: "var(--font-display)", marginLeft: 3 }}>{sourceDeckName}</em>
          </label>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose}>Cancel</button>
          <button
            className="tk-btn tk-btn-primary tk-btn-sm"
            onClick={handleMove}
            disabled={!canMove || saving}
            style={{ display: "flex", alignItems: "center", gap: 5 }}
          >
            {saving ? "Moving…" : <>{`Move 1 card`} <ArrowRight size={13} /></>}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
