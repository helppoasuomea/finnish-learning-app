import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Check } from "lucide-react";
import axios, { AxiosError } from "axios";

// ─── Password strength ───
function pwStrength(pw: string): number {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 4) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) && pw.length >= 6) s++;
  return Math.max(1, s);
}

const STRENGTH_LABELS = ["", "weak", "fair", "good", "strong"];
const STRENGTH_COLORS = [
  "var(--tk-ink-5)", "var(--tk-persimmon)", "#d89f4a", "#8aa86b", "var(--tk-accent)"
];

// ─── Google mark ───
const GoogleMark = () => (
  <svg width="16" height="16" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 0 1 3.68 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 0 0 0 9c0 1.45.35 2.82.96 4.05l3.01-2.33z"/>
    <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
  </svg>
);

// ─── Art panel ───
const AuthArtPanel = ({ mode }: { mode: "signin" | "register" }) => (
  <div className="au-art">
    <div className="au-art-wordmark">Lukeā</div>
    <div className="au-art-quote">
      <div className="au-art-kicker">A reading room for words.</div>
      <div className="au-art-headline">
        {mode === "signin" ? (
          <>The words you read<br />become the words<br />you know.</>
        ) : (
          <>Read a little.<br />Know a little more.<br />Every day.</>
        )}
      </div>
      <div className="au-art-body">
        {mode === "signin"
          ? "Paste a sentence. We translate it, explain each word, and quietly build it into your flashcards."
          : "A calm, spaced-repetition space for learners who read — not click — their way to fluency."}
      </div>
    </div>
    <div className="au-art-seeds">
      <div className="au-art-lang-row">
        <span>Finnish</span><span>·</span>
        <span>Vietnamese</span><span>·</span>
        <span>Korean</span><span>·</span>
        <span>Japanese</span><span>·</span>
        <span>Estonian</span>
      </div>
      <div className="au-art-lang-row" data-dim="true">
        <span>Spanish</span><span>·</span>
        <span>Italian</span><span>·</span>
        <span>Portuguese</span><span>·</span>
        <span>Dutch</span><span>·</span>
        <span>Swedish</span>
      </div>
    </div>
  </div>
);

// ─── Sign in form ───
const SignInForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const googleButtonRef = useRef<HTMLDivElement | null>(null);
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleCredential = useCallback(async (credential: string) => {
    setIsGoogleLoading(true);
    setError("");
    try {
      await axios.post("/auth/google/token", { idToken: credential });
      window.location.href = '/';
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = (err as AxiosError<{ error?: string } | string>).response?.data;
        setError(typeof data === "string" ? data : data?.error || "Google login failed.");
      } else {
        setError("Google login failed. Please try again.");
      }
    } finally {
      setIsGoogleLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) return;
    const init = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (response: { credential?: string }) => {
          if (response?.credential) handleGoogleCredential(response.credential);
          else setError("Google login failed. No credential was returned.");
        },
      });
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline", size: "large", text: "signin_with",
        shape: "rectangular", width: 240,
      });
    };
    if (window.google?.accounts?.id) { init(); return; }
    const existing = document.querySelector<HTMLScriptElement>('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) { existing.addEventListener("load", init, { once: true }); return; }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true; script.defer = true;
    script.onload = init;
    document.head.appendChild(script);
    return () => { script.onload = null; };
  }, [googleClientId, handleGoogleCredential]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) { setError("Please enter your username and password."); return; }
    setBusy(true); setError("");
    try {
      await axios.post("/login", { username, pin: password });
      setTimeout(onSuccess, 700);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = (err as AxiosError<string>).response?.data;
        setError(typeof data === "string" ? data : "Login failed. Check your credentials.");
      } else {
        setError("Login failed. Please try again.");
      }
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="au-form" autoComplete="on">
      {/* Google */}
      <div className="au-social-row" style={{ gridTemplateColumns: "1fr" }}>
        <div ref={googleButtonRef} style={{ display: "flex", justifyContent: "center" }} />
        {!googleClientId && (
          <button type="button" className="au-social" style={{ width: "100%", justifyContent: "center" }}>
            <GoogleMark /> <span>Sign in with Google</span>
          </button>
        )}
        {isGoogleLoading && (
          <div style={{ textAlign: "center", fontSize: 12, color: "var(--tk-ink-3)" }}>
            Signing in with Google…
          </div>
        )}
      </div>
      <div className="au-divider">
        <span className="au-divider-line" />
        <span className="au-divider-label">or with username</span>
        <span className="au-divider-line" />
      </div>

      <div className="au-field">
        <label className="au-label" htmlFor="au-user">Username</label>
        <input
          id="au-user" className="au-input" type="text"
          value={username} onChange={e => setUsername(e.target.value)}
          autoComplete="username" required
        />
      </div>

      <div className="au-field">
        <div className="au-label-row">
          <label className="au-label" htmlFor="au-pw">Password / PIN</label>
        </div>
        <div className="au-input-wrap">
          <input
            id="au-pw" className="au-input"
            type={showPw ? "text" : "password"}
            value={password} onChange={e => setPassword(e.target.value)}
            autoComplete="current-password" required
          />
          <button type="button" className="au-eye" onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ fontSize: 13, color: "var(--tk-persimmon)", padding: "6px 0" }}>{error}</div>
      )}

      <button type="submit" className="au-submit" disabled={busy} style={{ width: "100%" }}>
        {busy ? (
          <><span className="au-spin" /> Signing in…</>
        ) : (
          <>Sign in <ArrowRight size={14} /></>
        )}
      </button>
    </form>
  );
};

// ─── Register form ───
const RegisterForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [learning, setLearning] = useState("fi");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const strength = pwStrength(pw);
  const strengthLabel = STRENGTH_LABELS[strength];
  const strengthColor = STRENGTH_COLORS[strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !pw) { setError("All fields are required."); return; }
    setBusy(true); setError("");
    try {
      await axios.post("/register", { name, username, pin: pw });
      setTimeout(onSuccess, 700);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const data = (err as AxiosError<string>).response?.data;
        setError(typeof data === "string" ? data : "Registration failed. Please try again.");
      } else {
        setError("Registration failed. Please try again.");
      }
      setBusy(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="au-form" autoComplete="on">
      <div className="au-field-row">
        <div className="au-field">
          <label className="au-label" htmlFor="au-name">Name</label>
          <input id="au-name" className="au-input" placeholder="e.g. Pada"
            value={name} onChange={e => setName(e.target.value)}
            autoComplete="given-name" required />
        </div>
        <div className="au-field">
          <label className="au-label" htmlFor="au-username">Username</label>
          <div className="au-input-wrap au-input-prefix">
            <span className="au-prefix" style={{ fontFamily: "var(--tk-mono)" }}>@</span>
            <input id="au-username" className="au-input" placeholder="padwhen"
              value={username} onChange={e => setUsername(e.target.value)}
              autoComplete="username" required />
          </div>
        </div>
      </div>

      <div className="au-field">
        <label className="au-label" htmlFor="au-pw-new">Password / PIN</label>
        <div className="au-input-wrap">
          <input
            id="au-pw-new" className="au-input"
            type={showPw ? "text" : "password"}
            placeholder="At least 4 characters"
            value={pw} onChange={e => setPw(e.target.value)}
            autoComplete="new-password" required
          />
          <button type="button" className="au-eye" onClick={() => setShowPw(v => !v)}>
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
        {pw && (
          <div className="au-strength">
            <div className="au-strength-bars">
              {[1, 2, 3, 4].map(n => (
                <span key={n} className="au-strength-bar"
                  style={{ background: n <= strength ? strengthColor : "var(--tk-rule)" }} />
              ))}
            </div>
            <div className="au-strength-label" style={{ color: strengthColor }}>{strengthLabel}</div>
          </div>
        )}
      </div>

      <div className="au-field">
        <label className="au-label">I'm learning</label>
        <div className="au-lang-picker">
          {[
            { v: "fi", flag: "🇫🇮", label: "Finnish" },
            { v: "vi", flag: "🇻🇳", label: "Vietnamese" },
            { v: "ko", flag: "🇰🇷", label: "Korean" },
            { v: "ja", flag: "🇯🇵", label: "Japanese" },
            { v: "et", flag: "🇪🇪", label: "Estonian" },
            { v: "other", flag: "+", label: "Other" },
          ].map(l => (
            <button key={l.v} type="button" className="au-lang-chip"
              data-active={learning === l.v}
              onClick={() => setLearning(l.v)}>
              <span style={{ fontSize: 14 }}>{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="au-field">
        <label className="au-check">
          <input type="checkbox" required />
          <span className="au-check-box"><Check size={11} /></span>
          <span>I agree to the Terms and Privacy Policy.</span>
        </label>
      </div>

      {error && (
        <div style={{ fontSize: 13, color: "var(--tk-persimmon)", padding: "6px 0" }}>{error}</div>
      )}

      <button type="submit" className="au-submit" disabled={busy || !pw} style={{ width: "100%" }}>
        {busy ? (
          <><span className="au-spin" /> Creating account…</>
        ) : (
          <>Create account <ArrowRight size={14} /></>
        )}
      </button>
    </form>
  );
};

// ─── Page ───
export const AuthPage = ({ initialMode = "signin" }: { initialMode?: "signin" | "register" }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "register">(initialMode);

  const handleSuccess = () => {
    window.location.href = '/';
  };

  const switchMode = (m: "signin" | "register") => {
    setMode(m);
    navigate(m === "signin" ? "/login" : "/register", { replace: true });
  };

  return (
    <div className="au-root">
      <AuthArtPanel mode={mode} />

      <div className="au-form-side">
        <div className="au-form-inner">
          <button className="au-back-link" onClick={() => navigate("/")}>
            <ArrowLeft size={13} /> Back to translate
          </button>

          <div className="au-tabs-wrap">
            <div className="au-brand-mark">
              <span className="au-brand-wordmark">Lukeā</span>
              <span className="au-brand-sub">reading room</span>
            </div>
            <div className="au-tabs">
              <button className="au-tab" data-active={mode === "signin"}
                onClick={() => switchMode("signin")}>Sign in</button>
              <button className="au-tab" data-active={mode === "register"}
                onClick={() => switchMode("register")}>Create account</button>
              <div className="au-tabs-ind" data-mode={mode} />
            </div>
          </div>

          <div className="au-form-body">
            {mode === "signin"
              ? <SignInForm onSuccess={handleSuccess} />
              : <RegisterForm onSuccess={handleSuccess} />
            }
          </div>

          <div className="au-form-footer">
            {mode === "signin" ? (
              <span>New to Lukeā?{" "}
                <button className="au-link" onClick={() => switchMode("register")}>
                  Create an account
                </button>
              </span>
            ) : (
              <span>Already reading with us?{" "}
                <button className="au-link" onClick={() => switchMode("signin")}>
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
