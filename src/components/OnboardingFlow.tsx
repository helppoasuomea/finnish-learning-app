import { useState, useEffect, useRef } from "react";
import { X, ArrowRight, Languages, BookOpen, RefreshCw } from "lucide-react";

/* ── Plant glyphs (from design spec) ──────────────────────────────── */

const SeedGlyph = ({ size = 80 }: { size?: number }) => (
  <svg width={size * 2} height={size * 1.5} viewBox="0 0 160 120" fill="none">
    <path d="M 10 90 Q 80 82 150 90 L 150 110 L 10 110 Z" fill="#D4C4A8" opacity="0.7" />
    <path d="M 20 92 L 35 92 M 60 94 L 80 94 M 100 92 L 120 92 M 130 95 L 145 95"
      stroke="#A88B5E" strokeWidth="0.8" opacity="0.5" />
    <ellipse cx="80" cy="86" rx="8" ry="10" fill="var(--ph-seed)" />
    <ellipse cx="80" cy="84" rx="4" ry="5" fill="#A77442" opacity="0.4" />
    <path d="M 80 96 L 80 104" stroke="var(--ph-seed)" strokeWidth="1" strokeDasharray="1 2" opacity="0.6" />
  </svg>
);

const SproutGlyph = ({ size = 80 }: { size?: number }) => (
  <svg width={size * 2} height={size * 1.5} viewBox="0 0 160 120" fill="none">
    <path d="M 10 90 Q 80 82 150 90 L 150 110 L 10 110 Z" fill="#D4C4A8" opacity="0.7" />
    <path d="M 80 92 L 80 65" stroke="#6B8A4D" strokeWidth="2" strokeLinecap="round" />
    <path d="M 80 75 Q 72 72 68 66 Q 72 70 80 70" fill="var(--ph-sprout)" stroke="#6B8A4D" strokeWidth="0.8" />
    <path d="M 80 70 Q 88 66 92 58 Q 88 64 80 65" fill="var(--ph-sprout)" stroke="#6B8A4D" strokeWidth="0.8" />
    <circle cx="80" cy="63" r="1.5" fill="#6B8A4D" />
  </svg>
);

const SaplingGlyph = ({ size = 80 }: { size?: number }) => (
  <svg width={size * 2} height={size * 1.5} viewBox="0 0 160 120" fill="none">
    <path d="M 10 90 Q 80 82 150 90 L 150 110 L 10 110 Z" fill="#D4C4A8" opacity="0.7" />
    <path d="M 80 92 L 80 55" stroke="#8A6D4A" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M 80 72 L 70 66 M 80 65 L 90 58" stroke="#8A6D4A" strokeWidth="1.5" strokeLinecap="round" />
    <ellipse cx="80" cy="45" rx="18" ry="14" fill="var(--ph-sapling)" opacity="0.85" />
    <ellipse cx="68" cy="52" rx="9" ry="7" fill="var(--ph-sapling)" opacity="0.7" />
    <ellipse cx="92" cy="50" rx="9" ry="7" fill="var(--ph-sapling)" opacity="0.7" />
  </svg>
);

const TreeGlyph = ({ size = 80 }: { size?: number }) => (
  <svg width={size * 2} height={size * 1.5} viewBox="0 0 160 120" fill="none">
    <path d="M 10 90 Q 80 82 150 90 L 150 110 L 10 110 Z" fill="#D4C4A8" opacity="0.7" />
    <path d="M 80 92 L 80 40" stroke="#6A5238" strokeWidth="4" strokeLinecap="round" />
    <path d="M 80 65 L 64 48 M 80 55 L 96 42 M 80 75 L 68 72" stroke="#6A5238" strokeWidth="2" strokeLinecap="round" />
    <ellipse cx="80" cy="30" rx="30" ry="22" fill="var(--ph-tree)" opacity="0.9" />
    <ellipse cx="58" cy="42" rx="14" ry="11" fill="var(--ph-tree)" opacity="0.8" />
    <ellipse cx="102" cy="40" rx="14" ry="11" fill="var(--ph-tree)" opacity="0.8" />
    <ellipse cx="80" cy="48" rx="16" ry="10" fill="var(--ph-tree)" opacity="0.7" />
    <ellipse cx="72" cy="25" rx="8" ry="6" fill="#A9C0A2" opacity="0.5" />
  </svg>
);

/* ── Forgetting curve ─────────────────────────────────────────────── */

const ForgettingCurve = () => (
  <svg viewBox="0 0 400 220" fill="none" className="ob-curve">
    <line x1="40" y1="180" x2="380" y2="180" stroke="var(--tk-rule)" strokeWidth="1" />
    <line x1="40" y1="20" x2="40" y2="180" stroke="var(--tk-rule)" strokeWidth="1" />
    {[80, 140, 200, 260, 320].map((x, i) => (
      <line key={i} x1={x} y1="178" x2={x} y2="184" stroke="var(--tk-rule)" strokeWidth="1" />
    ))}
    <text x="80"  y="200" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace" textAnchor="middle">1h</text>
    <text x="140" y="200" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace" textAnchor="middle">1d</text>
    <text x="200" y="200" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace" textAnchor="middle">3d</text>
    <text x="260" y="200" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace" textAnchor="middle">1w</text>
    <text x="320" y="200" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace" textAnchor="middle">1mo</text>
    <path d="M 40 30 Q 100 130 200 160 T 380 175"
      stroke="var(--tk-persimmon)" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
    <path d="M 40 30 Q 70 80 90 60 Q 110 30 140 95 Q 180 40 200 50 Q 230 30 270 70 Q 320 40 380 60"
      stroke="var(--tk-accent)" strokeWidth="2.25" fill="none" />
    {([{ x: 90, y: 60 }, { x: 140, y: 95 }, { x: 200, y: 50 }, { x: 270, y: 70 }, { x: 380, y: 60 }] as { x: number; y: number }[]).map((p, i) => (
      <circle key={i} cx={p.x} cy={p.y} r="3.5" fill="var(--tk-accent)" />
    ))}
    <g transform="translate(48, 28)">
      <line x1="0" y1="0" x2="16" y2="0" stroke="var(--tk-persimmon)" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
      <text x="22" y="3" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace">without review</text>
      <line x1="0" y1="14" x2="16" y2="14" stroke="var(--tk-accent)" strokeWidth="2" />
      <text x="22" y="17" fontSize="10" fill="var(--tk-ink-3)" fontFamily="monospace">with Lukea</text>
    </g>
    <text x="20" y="16" fontSize="9" fill="var(--tk-ink-4)" fontFamily="monospace" letterSpacing="0.5">MEMORY</text>
    <text x="390" y="195" fontSize="9" fill="var(--tk-ink-4)" fontFamily="monospace" textAnchor="end" letterSpacing="0.5">TIME →</text>
  </svg>
);

/* ── Main component ───────────────────────────────────────────────── */

interface Props {
  word: string;
  onClose: () => void;
  onGoToReview: () => void;
}

export const OnboardingFlow: React.FC<Props> = ({ word, onClose, onGoToReview }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollTop / window.innerHeight));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const scrollTo = (i: number) => {
    scrollerRef.current?.scrollTo({ top: i * window.innerHeight, behavior: "smooth" });
  };

  const tones = ["paper", "paper", "sprout", "sapling", "tree"];

  const threeVerbs = [
    { icon: <Languages size={16} />, verb: "Capture", place: "Translate", desc: "Sentences you meet become Seeds." },
    { icon: <BookOpen size={16} />, verb: "Curate", place: "Notebooks", desc: "Group them by theme, annotate, re-read." },
    { icon: <RefreshCw size={16} />, verb: "Practice", place: "Review", desc: "The daily ritual. 10 minutes, quiet." },
  ];

  const panels = [
    /* 01 — You just saved a word */
    <div className="ob-panel-inner">
      <div className="ob-eyebrow"><span className="ob-count">01 / 05</span> You just saved a word</div>
      <div className="ob-hero-word">{word}</div>
      <h1 className="ob-title"><em>One word,</em> saved in quiet.</h1>
      <p className="ob-subtitle">
        That's how Lukea begins — not with a lesson, but with a sentence you met in the world.
        Everything that follows starts here.
      </p>
      <div className="ob-scroll-hint">
        Scroll
        <svg width="12" height="16" viewBox="0 0 12 16" fill="none">
          <path d="M 6 2 L 6 12 M 2 8 L 6 14 L 10 8" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>,

    /* 02 — The problem with memory */
    <div className="ob-panel-inner">
      <div className="ob-eyebrow"><span className="ob-count">02 / 05</span> The problem with memory</div>
      <div className="ob-curve-wrap"><ForgettingCurve /></div>
      <h1 className="ob-title">We forget, <em>fast.</em></h1>
      <p className="ob-subtitle">
        Most of what you learn today is gone within a week — unless you see it again
        at the right moment, just as it's about to slip away.
      </p>
    </div>,

    /* 03 — Four phases */
    <div className="ob-panel-inner">
      <div className="ob-eyebrow"><span className="ob-count">03 / 05</span> How we keep it</div>
      <div className="ob-phases">
        {([
          { Glyph: SeedGlyph, name: "Seed", desc: "just saved" },
          { Glyph: SproutGlyph, name: "Sprout", desc: "learning, fragile" },
          { Glyph: SaplingGlyph, name: "Sapling", desc: "settling in" },
          { Glyph: TreeGlyph, name: "Tree", desc: "yours for good" },
        ] as { Glyph: React.FC<{ size?: number }>; name: string; desc: string }[]).map(({ Glyph, name, desc }) => (
          <div key={name} className="ob-phase-card">
            <Glyph size={48} />
            <div className="ob-phase-name">{name}</div>
            <div className="ob-phase-desc">{desc}</div>
          </div>
        ))}
      </div>
      <h1 className="ob-title">Every word <em>grows.</em></h1>
      <p className="ob-subtitle">
        A Seed comes back tomorrow. A Sprout in 3 days. A Sapling in a month.
        A Tree barely notices the drought. You don't have to remember the schedule — we do.
      </p>
    </div>,

    /* 04 — Three verbs */
    <div className="ob-panel-inner">
      <div className="ob-eyebrow"><span className="ob-count">04 / 05</span> Three places, one rhythm</div>
      <div className="ob-verbs">
        {threeVerbs.map(({ icon, verb, place, desc }) => (
          <div key={verb} className="ob-phase-card ob-verb-card">
            <div className="ob-verb-icon">{icon}</div>
            <div className="ob-phase-name">{verb}</div>
            <div className="ob-verb-place">in {place}</div>
            <div className="ob-verb-desc">{desc}</div>
          </div>
        ))}
      </div>
      <h1 className="ob-title">Each place has <em>one job.</em></h1>
      <p className="ob-subtitle">
        You capture in Translate. You curate in Notebooks. You practice in Review.
        Three verbs, one loop — forever.
      </p>
    </div>,

    /* 05 — Your turn */
    <div className="ob-panel-inner">
      <div className="ob-eyebrow"><span className="ob-count">05 / 05</span> Your turn</div>
      <div className="ob-timeline">
        {([
          { Glyph: SeedGlyph, time: "TODAY" },
          { Glyph: SproutGlyph, time: "3 DAYS" },
          { Glyph: SaplingGlyph, time: "1 MONTH" },
          { Glyph: TreeGlyph, time: "FOREVER" },
        ] as { Glyph: React.FC<{ size?: number }>; time: string }[]).map(({ Glyph, time }) => (
          <div key={time} className="ob-timeline-item">
            <Glyph size={36} />
            <span className="ob-timeline-label">{time}</span>
          </div>
        ))}
      </div>
      <h1 className="ob-title ob-final-title"><em>{word}</em><br />is a Seed.</h1>
      <p className="ob-subtitle">
        We'll bring it back tomorrow for 10 seconds of your attention.
        That's the whole deal. Welcome to Lukea.
      </p>
      <button className="ob-cta" onClick={() => { onClose(); onGoToReview(); }}>
        Begin my first review <ArrowRight size={14} />
      </button>
      <button className="ob-cta-secondary" onClick={onClose}>Maybe later · keep exploring</button>
    </div>,
  ];

  return (
    <div className="ob-overlay">
      {/* Chrome layer */}
      <div className="ob-chrome">
        <button className="ob-close" onClick={onClose} aria-label="Close"><X size={15} /></button>
        <div className="ob-dots">
          {panels.map((_, i) => (
            <button key={i} className="ob-dot" data-active={i === active} onClick={() => scrollTo(i)} aria-label={`Slide ${i + 1}`} />
          ))}
        </div>
      </div>

      {/* Scroller */}
      <div className="ob-scroller" ref={scrollerRef}>
        {panels.map((panel, i) => (
          <section key={i} className="ob-panel" data-tone={tones[i]}>
            {panel}
          </section>
        ))}
      </div>
    </div>
  );
};
