import { useState, useEffect, useRef } from "react";
import { Check, X, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";

export type AcctEditField = "name" | "username" | "email" | "password" | "pin";

interface AcctEditSheetProps {
  open: { field: AcctEditField } | null;
  onClose: () => void;
  onSave: (result: { field: AcctEditField; value: any }) => void;
  user?: { name?: string; username?: string; email?: string };
}

// ─── Password strength ───
const pwScore = (pw: string): number => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return Math.min(s, 4);
};
const PW_LABELS = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

const FIELD_FRAMES: Record<AcctEditField, { eyebrow: string; title: string; help: string }> = {
  name:     { eyebrow: "Display name",     title: "What should we call you?",       help: "Shown on your profile and the hanko seal on your avatar." },
  username: { eyebrow: "Username",         title: "Pick a new handle.",              help: "3–20 characters. Letters, numbers, and underscores." },
  email:    { eyebrow: "Email address",    title: "Where should recovery mail go?",  help: "Changing email sends a verification link to your new address." },
  password: { eyebrow: "Password",         title: "Change your password.",           help: "Minimum 8 characters. Mix letters, numbers, and symbols." },
  pin:      { eyebrow: "Quick-access PIN", title: "Set a 4-digit PIN.",              help: "Lets you open Lukeā on this device without your full password." },
};

const SAVE_LABELS: Record<AcctEditField, [string, string]> = {
  name:     ["Save name",        "Saved."],
  username: ["Save username",    "Username updated."],
  email:    ["Send verification","Verification sent."],
  password: ["Update password",  "Password updated."],
  pin:      ["Set PIN",          "PIN set."],
};

// ─── Field bodies ───

const NameBody = ({ current, onChange }: { current?: string; onChange: (d: { value: string; valid: boolean }) => void }) => {
  const [v, setV] = useState(current ?? "");
  useEffect(() => { onChange({ value: v, valid: v.trim().length >= 1 }); }, [v]);
  return (
    <div className="ae-field">
      <label className="ae-label">Name</label>
      <input className="ae-input" autoFocus value={v} onChange={e => setV(e.target.value)} placeholder="Your name" />
      <div className="ae-hint">Usually your first name, or whatever you like being called.</div>
    </div>
  );
};

const UsernameBody = ({ current, onChange }: { current?: string; onChange: (d: { value: string; valid: boolean }) => void }) => {
  const [v, setV] = useState(current ?? "");
  const clean = v.trim().toLowerCase();
  const ok = /^[a-z0-9_]{3,20}$/.test(clean);
  const changed = clean !== (current ?? "").toLowerCase();
  const taken = ["admin", "support", "lukea"].includes(clean);
  const status = !v ? null : !ok ? "invalid" : !changed ? "same" : taken ? "taken" : "available";
  useEffect(() => { onChange({ value: clean, valid: status === "available" }); }, [v]);
  return (
    <div className="ae-field">
      <label className="ae-label">New username</label>
      <div className="ae-input-wrap">
        <span className="ae-prefix">@</span>
        <input className="ae-input ae-input--prefix" autoFocus value={v}
          onChange={e => setV(e.target.value.replace(/\s/g, ""))} placeholder="your_handle" />
        {status === "available" && (
          <span className="ae-input-status"><Check size={12} /></span>
        )}
      </div>
      <div className={`ae-hint ae-hint--${status ?? "neutral"}`}>
        {status === null && "3–20 characters. Letters, numbers, and underscores."}
        {status === "invalid" && "Only letters, numbers, and underscores. 3–20 characters."}
        {status === "same" && "That's your current username."}
        {status === "taken" && `@${clean} is taken. Try another.`}
        {status === "available" && `@${clean} is available.`}
      </div>
    </div>
  );
};

const EmailBody = ({ current, onChange }: { current?: string; onChange: (d: { value: string; valid: boolean }) => void }) => {
  const [v, setV] = useState(current ?? "");
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const changed = v.trim().toLowerCase() !== (current ?? "").toLowerCase();
  useEffect(() => { onChange({ value: v.trim(), valid: ok && changed }); }, [v]);
  return (
    <div className="ae-field">
      <label className="ae-label">New email</label>
      <input className="ae-input" type="email" autoFocus value={v}
        onChange={e => setV(e.target.value)} placeholder="you@domain.com" />
      <div className="ae-hint">Your old email keeps working until you verify the new one.</div>
    </div>
  );
};

const PasswordBody = ({ onChange }: { onChange: (d: { value: any; valid: boolean }) => void }) => {
  const [cur, setCur] = useState("");
  const [nv, setNv] = useState("");
  const [cf, setCf] = useState("");
  const [showNew, setShowNew] = useState(false);
  const score = pwScore(nv);
  const match = cf.length > 0 && nv === cf;
  const valid = cur.length >= 1 && score >= 2 && match;
  useEffect(() => { onChange({ value: { current: cur, next: nv }, valid }); }, [cur, nv, cf]);
  return (
    <>
      <div className="ae-field">
        <label className="ae-label">Current password</label>
        <input className="ae-input" type="password" autoFocus value={cur}
          onChange={e => setCur(e.target.value)} placeholder="Current password" />
      </div>
      <div className="ae-field">
        <label className="ae-label">New password</label>
        <div className="ae-input-wrap">
          <input className="ae-input" type={showNew ? "text" : "password"} value={nv}
            onChange={e => setNv(e.target.value)} placeholder="At least 8 characters" />
          <button type="button" className="ae-eye" onClick={() => setShowNew(s => !s)}>
            {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
        {nv && (
          <div className="ae-strength">
            <div className="ae-strength-bars">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className={`ae-strength-bar${i < score ? " is-on ae-tone-" + Math.min(score, 4) : ""}`} />
              ))}
            </div>
            <div className="ae-strength-label">{PW_LABELS[score]}</div>
          </div>
        )}
      </div>
      <div className="ae-field">
        <label className="ae-label">Confirm new password</label>
        <input className="ae-input" type="password" value={cf}
          onChange={e => setCf(e.target.value)} placeholder="Type it again" />
        {cf && (
          <div className={`ae-hint ${match ? "ae-hint--available" : "ae-hint--invalid"}`}>
            {match ? "Passwords match." : "Doesn't match yet."}
          </div>
        )}
      </div>
    </>
  );
};

const PinBody = ({ onChange }: { onChange: (d: { value: string; valid: boolean }) => void }) => {
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"enter" | "confirm">("enter");
  const [cf, setCf] = useState("");
  const shown = step === "enter" ? pin : cf;
  const full = shown.length === 4;
  const valid = step === "confirm" && cf === pin && full;
  const mismatch = step === "confirm" && full && cf !== pin;
  useEffect(() => { onChange({ value: pin, valid }); }, [pin, cf, step]);

  const press = (d: string) => {
    if (step === "enter") {
      if (pin.length < 4) {
        const next = pin + d;
        setPin(next);
        if (next.length === 4) setTimeout(() => setStep("confirm"), 180);
      }
    } else {
      if (cf.length < 4) setCf(cf + d);
    }
  };
  const back = () => { step === "enter" ? setPin(p => p.slice(0, -1)) : setCf(c => c.slice(0, -1)); };
  const reset = () => { setStep("enter"); setPin(""); setCf(""); };

  return (
    <div className="ae-pin">
      <div className="ae-pin-prompt">
        {step === "enter" ? "Enter a 4-digit PIN" : mismatch ? "PINs don't match. Try again." : "Confirm your PIN"}
      </div>
      <div className={`ae-pin-dots${mismatch ? " is-error" : ""}`}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} className={`ae-pin-dot${shown.length > i ? " is-filled" : ""}${shown.length === i ? " is-active" : ""}`} />
        ))}
      </div>
      <div className="ae-pin-pad">
        {["1","2","3","4","5","6","7","8","9"].map(n => (
          <button key={n} className="ae-pin-key" onClick={() => press(n)}>{n}</button>
        ))}
        <button className="ae-pin-key ae-pin-key--alt" onClick={mismatch ? reset : undefined} disabled={!mismatch}>
          {mismatch ? "Reset" : ""}
        </button>
        <button className="ae-pin-key" onClick={() => press("0")}>0</button>
        <button className="ae-pin-key ae-pin-key--alt" onClick={back} disabled={!shown.length}>
          <ArrowLeft size={14} />
        </button>
      </div>
    </div>
  );
};

// ─── Main sheet ───

export const AcctEditSheet = ({ open, onClose, onSave, user = {} }: AcctEditSheetProps) => {
  const [draft, setDraft] = useState<{ value: any; valid: boolean }>({ value: null, valid: false });
  const [phase, setPhase] = useState<"edit" | "saving" | "done">("edit");
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setDraft({ value: null, valid: false });
      setPhase("edit");
    }
  }, [open?.field, !!open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", k);
    return () => document.removeEventListener("keydown", k);
  }, [open, onClose]);

  if (!open) return null;

  const field = open.field;
  const frame = FIELD_FRAMES[field];
  const saveLabels = SAVE_LABELS[field];

  const handleSave = () => {
    if (!draft.valid) return;
    setPhase("saving");
    onSave({ field, value: draft.value });
    setTimeout(() => {
      setPhase("done");
      setTimeout(() => onClose(), 900);
    }, 400);
  };

  return (
    <div className="ae-scrim" onClick={onClose} role="dialog" aria-label={frame.title}>
      <div className="ae-sheet" ref={sheetRef} onClick={e => e.stopPropagation()}>
        <button className="ae-close" onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>

        <header className="ae-header">
          <div className="tk-eyebrow ae-eyebrow">{frame.eyebrow}</div>
          <h2 className="ae-title">{frame.title}</h2>
          <p className="ae-help">{frame.help}</p>
        </header>

        <div className="ae-body">
          {phase === "done" ? (
            <div className="ae-done">
              <div className="ae-done-seal"><Check size={26} /></div>
              <div className="ae-done-label">{saveLabels[1]}</div>
            </div>
          ) : (
            <>
              {field === "name"     && <NameBody     current={user.name}     onChange={setDraft} />}
              {field === "username" && <UsernameBody current={user.username} onChange={setDraft} />}
              {field === "email"    && <EmailBody    current={user.email}    onChange={setDraft} />}
              {field === "password" && <PasswordBody                          onChange={setDraft} />}
              {field === "pin"      && <PinBody                               onChange={setDraft} />}
            </>
          )}
        </div>

        {phase !== "done" && (
          <footer className="ae-footer">
            <button className="tk-btn tk-btn-ghost" onClick={onClose} disabled={phase === "saving"}>
              Cancel
            </button>
            <button
              className="tk-btn tk-btn-primary"
              onClick={handleSave}
              disabled={!draft.valid || phase === "saving"}
            >
              {phase === "saving" ? (
                <><span className="ae-spin" /> Saving…</>
              ) : (
                <>{saveLabels[0]} <ArrowRight size={13} /></>
              )}
            </button>
          </footer>
        )}
      </div>
    </div>
  );
};
