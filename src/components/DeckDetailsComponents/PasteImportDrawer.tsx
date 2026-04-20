import { useState, useMemo } from "react";
import { X, ArrowRight, Plus, AlertTriangle } from "lucide-react";

interface ParsedRow {
  id: number;
  fi: string;
  en: string;
  status: "new" | "dupe" | "error";
}

interface Props {
  deckName: string;
  existingFi: Set<string>;
  onClose: () => void;
  onImport: (items: { fi: string; en: string }[]) => void;
}

const Drawer: React.FC<{ title: string; subtitle: string; width?: number; onClose: () => void; children: React.ReactNode; footer: React.ReactNode }> = ({ title, subtitle, width, onClose, children, footer }) => (
  <>
    <div className="tk-drawer-scrim" onClick={onClose} />
    <div className="tk-drawer" style={width ? { width: `min(${width}px, 100vw)` } : undefined}>
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

export const PasteImportDrawer: React.FC<Props> = ({ deckName, existingFi, onClose, onImport }) => {
  const [text, setText] = useState("kirjakauppa — bookstore\nkahvila — café\nrakastaa — to love\nkiitos — thank you");
  const [sep, setSep] = useState<"dash" | "tab">("dash");

  const parsed = useMemo<ParsedRow[]>(() => {
    const divider = sep === "dash" ? /\s[—–\-]\s/ : /\t/;
    return text.split("\n").map((line, i) => {
      if (!line.trim()) return null;
      const parts = line.split(divider);
      if (parts.length < 2 || !parts[0].trim() || !parts[1].trim()) {
        return { id: i, fi: line.trim(), en: "", status: "error" as const };
      }
      const fi = parts[0].trim();
      const en = parts[1].trim();
      return { id: i, fi, en, status: existingFi.has(fi.toLowerCase()) ? "dupe" as const : "new" as const };
    }).filter(Boolean) as ParsedRow[];
  }, [text, sep, existingFi]);

  const stats = useMemo(() => ({
    total:  parsed.length,
    new:    parsed.filter(p => p.status === "new").length,
    dupes:  parsed.filter(p => p.status === "dupe").length,
    errors: parsed.filter(p => p.status === "error").length,
  }), [parsed]);

  return (
    <Drawer
      title="Paste import"
      subtitle={`Bulk-add to ${deckName}`}
      width={640}
      onClose={onClose}
      footer={
        <>
          <div style={{ fontSize: 12, color: "var(--tk-ink-3)", fontFamily: "'IBM Plex Mono', Menlo, monospace" }}>
            {stats.new} new · {stats.dupes} duplicates · {stats.errors} skipped
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose}>Cancel</button>
            <button className="tk-btn tk-btn-accent tk-btn-sm" disabled={stats.new === 0}
              onClick={() => { onImport(parsed.filter(p => p.status !== "error")); onClose(); }}>
              Import {stats.new + stats.dupes} words <ArrowRight size={13} />
            </button>
          </div>
        </>
      }
    >
      <div className="tk-field">
        <div className="tk-field-label">
          Paste your list
          <small>One per line. Separator:
            <button onClick={() => setSep("dash")} style={{ marginLeft: 6, color: sep === "dash" ? "var(--tk-accent)" : "var(--tk-ink-3)", fontFamily: "'IBM Plex Mono', Menlo, monospace" }}>— dash</button>
            <span style={{ color: "var(--tk-ink-5)" }}> · </span>
            <button onClick={() => setSep("tab")} style={{ color: sep === "tab" ? "var(--tk-accent)" : "var(--tk-ink-3)", fontFamily: "'IBM Plex Mono', Menlo, monospace" }}>↹ tab</button>
          </small>
        </div>
        <textarea className="tk-textfield" value={text} onChange={e => setText(e.target.value)} rows={8} />
      </div>
      <div className="tk-eyebrow" style={{ marginTop: 20, marginBottom: 8 }}>Preview · {parsed.length} lines</div>
      <div style={{ background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 8, overflow: "hidden" }}>
        {parsed.slice(0, 12).map(p => (
          <div key={p.id} className="paste-preview-row" data-status={p.status}>
            <div className="pp-fi">{p.fi}</div>
            <div className="pp-en">{p.en || <em style={{ color: "var(--tk-persimmon)" }}>no translation</em>}</div>
            <div className="pp-status" style={{ color: p.status === "new" ? "var(--tk-accent)" : p.status === "dupe" ? "var(--tk-persimmon)" : "var(--tk-ink-4)" }}>
              {p.status}
            </div>
            {p.status === "new"   && <Plus size={12} style={{ color: "var(--tk-accent)" }} />}
            {p.status === "dupe"  && <AlertTriangle size={12} style={{ color: "var(--tk-persimmon)" }} />}
            {p.status === "error" && <X size={12} style={{ color: "var(--tk-ink-4)" }} />}
          </div>
        ))}
        {parsed.length > 12 && (
          <div style={{ padding: "10px 12px", fontSize: 12, color: "var(--tk-ink-4)", fontStyle: "italic", textAlign: "center" }}>
            …{parsed.length - 12} more lines
          </div>
        )}
      </div>
    </Drawer>
  );
};
