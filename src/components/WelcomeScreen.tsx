import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onDismiss: () => void;
}

const MODES = [
  {
    v: "review",
    name: "REVIEW",
    tag: "the memory path",
    body: "Cards return on a spaced schedule built around how well you recall them. Your streak lives here. Start from the home page or any deck's Review button.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 17 V11 M10 11 C10 8, 12 6, 15 6 M10 11 C10 8, 8 6, 5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <circle cx="10" cy="11" r="1.2" fill="currentColor"/>
      </svg>
    ),
  },
  {
    v: "cram",
    name: "CRAM",
    tag: "short-term drill",
    body: "Drill a slice of a deck right before a class or trip. Loops until every card sticks. Doesn't touch your schedule — you can cram the same deck twice a day without messing up the spacing.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="11" r="6" stroke="currentColor" strokeWidth="1.4"/>
        <path d="M10 11 V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M10 11 L12.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M8 4 H12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    v: "practice",
    name: "PRACTICE",
    tag: "warm-ups & drills",
    body: "Flashcards, Match, Type-it, Grammar drills — quick rounds when you have a gap. Nothing is saved to your schedule. Use these to rehearse in passing, not as your main work.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="8" cy="10" r="1" fill="currentColor"/>
        <circle cx="12" cy="10" r="1" fill="currentColor"/>
      </svg>
    ),
  },
] as const;

export const WelcomeScreen = ({ onDismiss }: WelcomeScreenProps) => {
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") onDismiss(); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onDismiss]);

  return (
    <div className="wc-scrim" onClick={onDismiss}>
      <div className="wc-card" onClick={e => e.stopPropagation()} role="dialog" aria-label="How Tokō studies with you">

        <div className="wc-seal">
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M10 2 L12.5 8 L18 10 L12.5 12 L10 18 L7.5 12 L2 10 L7.5 8 Z" fill="currentColor"/>
          </svg>
        </div>

        <h1 className="wc-title">How Tokō studies with you</h1>

        <p className="wc-lead">
          <strong>One path advances memory. Everything else is practice.</strong>
          <br />
          Three study modes, one simple rule. Here's how they differ.
        </p>

        <div className="wc-modes">
          {MODES.map(m => (
            <div key={m.v} className="wc-mode" data-v={m.v}>
              <div className="wc-mode-icon">{m.icon}</div>
              <div>
                <div className="wc-mode-head">
                  <div className="wc-mode-name">● {m.name}</div>
                  <div className="wc-mode-tag">{m.tag}</div>
                </div>
                <div className="wc-mode-body">{m.body}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="wc-aside">
          You'll see a small badge at the top-left of every session — so you always know which mode you're in.
        </div>

        <div className="wc-actions">
          <button className="tk-btn tk-btn-ghost" onClick={onDismiss}>
            Close
          </button>
          <button className="tk-btn tk-btn-accent" onClick={onDismiss}>
            Got it — let's go <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
