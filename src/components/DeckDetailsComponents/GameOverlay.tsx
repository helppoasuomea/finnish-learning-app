import { useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  title: string;
  deckName: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  progress?: number;
}

export const GameOverlay: React.FC<Props> = ({ title, deckName, onClose, children, footer, progress }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="go-overlay">
      <div className="go-top">
        <button className="go-close" onClick={onClose} title="Exit (Esc)"><X size={16} /></button>
        <div className="go-top-mid">
          <span style={{ fontSize: 15, color: "var(--tk-ink)", fontWeight: 500 }}>{title}</span>
          <span style={{ fontSize: 11, color: "var(--tk-ink-3)", fontFamily: "'IBM Plex Mono', Menlo, monospace", letterSpacing: "0.04em" }}>{deckName}</span>
        </div>
        <div className="go-top-right">
          {progress != null && (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 120, height: 3, background: "var(--tk-paper-edge)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "var(--tk-accent)", width: `${progress}%`, transition: "width 320ms" }} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="go-body">{children}</div>
      {footer && <div className="go-footer">{footer}</div>}
    </div>
  );
};
