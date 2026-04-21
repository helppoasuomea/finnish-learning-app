import { useContext, useState } from "react";
import { Download, Upload, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";

// ─── Device / browser detection ───
function getSessionLabel(): string {
  const ua = navigator.userAgent;
  let browser = "Browser";
  if (ua.includes("Edg"))                                   browser = "Edge";
  else if (ua.includes("Chrome") && !ua.includes("Safari")) browser = "Chrome";
  else if (ua.includes("Firefox"))                          browser = "Firefox";
  else if (ua.includes("Safari"))                           browser = "Safari";

  let platform = "device";
  if      (ua.includes("iPhone"))  platform = "iPhone";
  else if (ua.includes("iPad"))    platform = "iPad";
  else if (ua.includes("Android")) platform = "Android";
  else if (ua.includes("Mac"))     platform = "Mac";
  else if (ua.includes("Windows")) platform = "Windows";
  else if (ua.includes("Linux"))   platform = "Linux";

  return `${platform} · ${browser}`;
}

// ─── Library & Data ───
export const LibraryDataCard = () => {
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await axios.get("/export", { responseType: "blob" });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `toko-export-${new Date().toISOString().slice(0, 10)}.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast({ title: "Export not available yet", description: "This feature is coming soon.", variant: "destructive" });
    } finally {
      setExporting(false);
    }
  };

  const handleImport = () => {
    toast({ title: "Anki import coming soon", description: "We'll support .apkg files shortly." });
  };

  return (
    <div className="st-section">
      <div className="st-section-title">Library &amp; Data</div>
      <div className="st-section-sub">Everything you've saved belongs to you.</div>
      <div className="acct-section">
        <div className="acct-row">
          <div className="acct-row-label">Export your data</div>
          <div className="acct-row-value">
            All decks, saved sentences, and review history.
            <span className="acct-row-sub">Delivered as a ZIP of CSV + JSON. Usually arrives within a minute.</span>
          </div>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={handleExport} disabled={exporting}>
            <Download size={12} /> {exporting ? "Preparing…" : "Export"}
          </button>
        </div>
        <div className="acct-row">
          <div className="acct-row-label">Import from Anki</div>
          <div className="acct-row-value">
            Bring in an existing <code className="acct-code">.apkg</code> deck.
            <span className="acct-row-sub">Front/back mapping is configurable per import.</span>
          </div>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={handleImport}>
            <Upload size={12} /> Import
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── This Session ───
export const ThisSessionCard = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { toast } = useToast();
  const sessionLabel = getSessionLabel();

  const handleSignOut = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
      navigate("/");
    } catch {
      toast({ title: "Sign out failed", variant: "destructive" });
    }
  };

  return (
    <div className="st-section">
      <div className="acct-section">
        <div className="acct-row" style={{ borderBottom: 0 }}>
          <div className="acct-row-label">This session</div>
          <div className="acct-row-value mono">
            {sessionLabel}
            <span className="acct-row-sub">last active just now</span>
          </div>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={handleSignOut}>
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Leave quietly ───
export const LeaveQuietlyCard = () => {
  const { toast } = useToast();
  const [pauseConfirm, setPauseConfirm]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const handlePause = async () => {
    if (!pauseConfirm) { setPauseConfirm(true); return; }
    try {
      await axios.post("/pause-account");
      toast({ title: "Account paused", description: "Nudges and review cards are paused. Come back anytime." });
    } catch {
      toast({ title: "Pause not available yet", description: "This feature is coming soon.", variant: "destructive" });
    } finally {
      setPauseConfirm(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    try {
      await axios.delete("/delete-account");
      toast({ title: "Deletion scheduled", description: "Your data will be removed after a 30-day grace period." });
    } catch {
      toast({ title: "Delete not available yet", description: "This feature is coming soon.", variant: "destructive" });
    } finally {
      setDeleteConfirm(false);
    }
  };

  return (
    <div className="st-section st-section--danger">
      <div className="st-section-title st-section-title--danger">Leave quietly</div>
      <div className="st-section-sub">Two irreversible actions, both handled gently.</div>
      <div className="acct-section">
        <div className="acct-row">
          <div className="acct-row-label">Pause account</div>
          <div className="acct-row-value">
            Keep your data, but stop all nudges and schedule cards.
            <span className="acct-row-sub">Come back anytime — everything resumes where it left off.</span>
          </div>
          <button
            className={`tk-btn tk-btn-sm${pauseConfirm ? " tk-btn-danger-confirm" : " tk-btn-ghost"}`}
            onClick={handlePause}
            onBlur={() => setPauseConfirm(false)}
          >
            {pauseConfirm ? "Tap again to pause" : "Pause"}
          </button>
        </div>
        <div className="acct-row">
          <div className="acct-row-label">Delete account</div>
          <div className="acct-row-value">
            Remove your account and every word you've saved.
            <span className="acct-row-sub">A final export is offered before anything is deleted. 30-day grace period.</span>
          </div>
          <button
            className={`tk-btn tk-btn-sm${deleteConfirm ? " tk-btn-danger-confirm" : " tk-btn-danger"}`}
            onClick={handleDelete}
            onBlur={() => setDeleteConfirm(false)}
          >
            <Trash2 size={12} /> {deleteConfirm ? "Tap again to delete" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};
