import { useState } from "react";
import { Deck } from "@/types";
import { CramConfig, CramSummary } from "./CramTypes";
import { CramSetup } from "./CramSetup";
import { CramSession } from "./CramSession";
import { CramDone } from "./CramDone";

type Stage = "setup" | "session" | "done";

interface Props {
  deck: Deck;
  onClose: () => void;
}

export const CramLauncher: React.FC<Props> = ({ deck, onClose }) => {
  const [stage, setStage] = useState<Stage>("setup");
  const [config, setConfig] = useState<CramConfig | null>(null);
  const [summary, setSummary] = useState<CramSummary | null>(null);

  const start = (cfg: CramConfig) => {
    setConfig(cfg);
    setStage("session");
  };

  const finish = (s: CramSummary) => {
    setSummary(s);
    setStage("done");
  };

  const runAgainOnMisses = () => {
    if (!summary?.missedCards?.length || !config) return;
    setConfig({ ...config, cards: summary.missedCards });
    setSummary(null);
    setStage("session");
  };

  if (stage === "setup") {
    return <CramSetup deck={deck} onClose={onClose} onStart={start} />;
  }

  if (stage === "session" && config) {
    return (
      <CramSession
        deck={deck}
        config={config}
        onExit={onClose}
        onComplete={finish}
      />
    );
  }

  if (stage === "done" && config && summary) {
    return (
      <CramDone
        deck={deck}
        config={config}
        summary={summary}
        onClose={onClose}
        onRunAgain={runAgainOnMisses}
        onBackToDeck={onClose}
      />
    );
  }

  return null;
};
