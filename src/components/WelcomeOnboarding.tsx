import { useEffect, useState } from "react";

const LANGS = [
  { code: "fi", name: "Finnish",    flag: "🇫🇮" },
  { code: "ja", name: "Japanese",   flag: "🇯🇵" },
  { code: "es", name: "Spanish",    flag: "🇪🇸" },
  { code: "de", name: "German",     flag: "🇩🇪" },
  { code: "fr", name: "French",     flag: "🇫🇷" },
  { code: "ko", name: "Korean",     flag: "🇰🇷" },
  { code: "zh", name: "Chinese",    flag: "🇨🇳" },
  { code: "el", name: "Greek",      flag: "🇬🇷" },
];

const LEVELS = [
  { id: "beginner",     label: "Beginner",     cefr: "A1–A2", note: "I'm just starting." },
  { id: "intermediate", label: "Intermediate", cefr: "B1–B2", note: "I can hold a basic conversation." },
  { id: "advanced",     label: "Advanced",     cefr: "C1–C2", note: "I want to read native content." },
];

export interface OnboardingResult {
  lang: string;
  langName: string;
  level: string;
}

interface Props {
  onComplete: (result: OnboardingResult) => void;
}

const DemoLoop = ({ onSkip }: { onSkip: () => void }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    let t = 0;
    const timers = [1500, 2500, 3000].map((delay) => {
      t += delay;
      const n = t;
      return setTimeout(() => setPhase(p => p + 1), n);
    });
    return () => timers.forEach(clearTimeout);
  }, []);

  const headline = ["Translate.", "Save.", "Review.", "That's it."][Math.min(phase, 3)];

  return (
    <div style={{ maxWidth: 560, width: "100%" }}>
      <div className="text-eyebrow" style={{ marginBottom: 10, textAlign: "center" }}>Step 3 of 3 · How it works</div>
      <h1 style={{ fontFamily: "var(--tk-display)", fontSize: 32, margin: 0, textAlign: "center" }}>{headline}</h1>

      <div style={{ marginTop: 32, padding: 28, background: "var(--tk-card)", border: "1px solid var(--tk-rule)", borderRadius: 14, minHeight: 200 }}>
        <div style={{ opacity: phase >= 0 ? 1 : 0, transition: "opacity 400ms" }}>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {["Minä", "juon", "kahvia"].map((w, i) => (
              <div key={i} style={{
                textAlign: "center", padding: "8px 14px",
                background: phase >= 1 && i === 2 ? "color-mix(in oklab, var(--tk-accent) 14%, transparent)" : "transparent",
                borderRadius: 6, transition: "background 400ms",
                border: phase >= 1 && i === 2 ? "1px solid var(--tk-accent-soft)" : "1px solid transparent",
              }}>
                <div style={{ fontFamily: "var(--tk-display)", fontSize: 22 }}>{w}</div>
                <div style={{ fontSize: 11, color: "var(--tk-ink-3)", marginTop: 4 }}>{["I", "drink", "coffee"][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {phase >= 1 && (
          <div style={{ textAlign: "center", marginTop: 20, opacity: phase === 1 ? 1 : 0.5, transition: "opacity 400ms" }}>
            <div style={{ fontSize: 13, color: "var(--tk-accent-deep)", fontFamily: "var(--tk-display)" }}>
              ✓ Saved <em>kahvia</em> to your words
            </div>
          </div>
        )}

        {phase >= 2 && (
          <div style={{
            marginTop: 18, padding: 14, background: "var(--tk-paper-deep)", borderRadius: 8, border: "1px solid var(--tk-rule)",
            opacity: 1, transform: "translateY(0)", transition: "opacity 400ms, transform 400ms",
          }}>
            <div style={{ fontSize: 11, color: "var(--tk-ink-3)", letterSpacing: ".06em", textTransform: "uppercase" }}>Tomorrow's review</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
              <span style={{ fontFamily: "var(--tk-display)", fontSize: 18 }}>kahvia</span>
              <span style={{ fontSize: 12, color: "var(--tk-ink-3)" }}>due in 1 day</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 24 }}>
        <button className="tk-btn tk-btn-accent" onClick={onSkip}>Get started →</button>
      </div>
    </div>
  );
};

export const WelcomeOnboarding: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);

  const pickLang = (code: string) => {
    setLang(code);
    setTimeout(() => setStep(1), 220);
  };

  const pickLevel = (id: string) => {
    setLevel(id);
    setTimeout(() => setStep(2), 220);
  };

  const finish = (overrideLang?: string, overrideLevel?: string) => {
    const chosenLang = overrideLang ?? lang ?? "fi";
    const chosenLevel = overrideLevel ?? level ?? "beginner";
    const langEntry = LANGS.find(l => l.code === chosenLang) ?? LANGS[0];
    onComplete({ lang: chosenLang, langName: langEntry.name, level: chosenLevel });
  };

  const skip = () => finish();

  // Auto-finish from demo step after 7s
  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => finish(), 7000);
    return () => clearTimeout(t);
  }, [step]);

  return (
    <div className="wo-root">
      {/* Header */}
      <div className="wo-header">
        <div className="wo-steps">
          {[0, 1, 2].map(i => (
            <div key={i} className={`wo-step-pip ${i <= step ? "is-on" : ""}`} />
          ))}
        </div>
        <button className="wo-skip" onClick={skip}>Skip</button>
      </div>

      {/* Body */}
      <div className="wo-body">
        {step === 0 && (
          <div className="wo-panel">
            <div className="text-eyebrow" style={{ marginBottom: 10, textAlign: "center" }}>Step 1 of 3</div>
            <h1 className="wo-heading">What are you learning?</h1>
            <p className="wo-sub">Pick one. You can add more later.</p>
            <div className="wo-lang-grid">
              {LANGS.map(l => (
                <button
                  key={l.code}
                  className={`wo-lang-card ${lang === l.code ? "is-selected" : ""}`}
                  onClick={() => pickLang(l.code)}
                >
                  <div className="wo-lang-flag">{l.flag}</div>
                  <div className="wo-lang-name">{l.name}</div>
                </button>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 16 }}>
              <button className="wo-other" onClick={() => pickLang("other")}>Other language…</button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="wo-panel">
            <div className="text-eyebrow" style={{ marginBottom: 10, textAlign: "center" }}>Step 2 of 3</div>
            <h1 className="wo-heading">Where are you starting?</h1>
            <p className="wo-sub">This shapes your experience.</p>
            <div className="wo-level-grid">
              {LEVELS.map(l => (
                <button
                  key={l.id}
                  className={`wo-level-card ${level === l.id ? "is-selected" : ""}`}
                  onClick={() => pickLevel(l.id)}
                >
                  <div className="wo-level-label">{l.label}</div>
                  <div className="wo-level-cefr">{l.cefr}</div>
                  <div className="wo-level-note">{l.note}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && <DemoLoop onSkip={() => finish()} />}
      </div>
    </div>
  );
};
