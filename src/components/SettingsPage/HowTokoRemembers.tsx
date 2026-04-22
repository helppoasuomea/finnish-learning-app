import { useState } from "react";
import { Play } from "lucide-react";
import { WelcomeScreen } from "../WelcomeScreen";

const PHASES = [
  { key: "seed",    label: "Seed",    color: "var(--ph-seed)",    desc: "Just saved. Never practiced." },
  { key: "sprout",  label: "Sprout",  color: "var(--ph-sprout)",  desc: "Fragile. Shown often." },
  { key: "sapling", label: "Sapling", color: "var(--ph-sapling)", desc: "Settling. Shown every few days." },
  { key: "tree",    label: "Tree",    color: "var(--ph-tree)",    desc: "Known. Rarely visits." },
];

export const HowTokoRemembers = () => {
  const [showStory, setShowStory] = useState(false);

  return (
    <>
      <div className="st-section">
        <div className="st-section-title">How Lukeā remembers</div>
        <div className="st-section-sub">
          Words don't appear randomly. Each one has a stage, and each stage has its own rhythm.
        </div>

        <div className="htm-phases">
          {PHASES.map(p => (
            <div key={p.key} className="htm-phase" style={{ borderLeftColor: p.color }}>
              <div className="htm-phase-name">{p.label}</div>
              <div className="htm-phase-desc">{p.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 20 }}>
          <button
            className="tk-btn tk-btn-ghost tk-btn-sm"
            onClick={() => setShowStory(true)}
          >
            <Play size={11} /> See the story again
          </button>
        </div>
      </div>

      {showStory && <WelcomeScreen onDismiss={() => setShowStory(false)} />}
    </>
  );
};
