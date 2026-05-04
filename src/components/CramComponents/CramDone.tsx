import { Deck } from "@/types";
import { CramConfig, CramSummary } from "./CramTypes";

function fmtTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

interface Props {
  deck: Deck;
  config: CramConfig;
  summary: CramSummary;
  onClose: () => void;
  onRunAgain: () => void;
  onBackToDeck: () => void;
}

export const CramDone: React.FC<Props> = ({ deck, config, summary, onClose, onRunAgain, onBackToDeck }) => {
  const { cleared, accuracy, reshown, durationSec, missedCards, countAsReview } = summary;
  const mood = config.mood;

  const headline =
    accuracy >= 90 ? "Locked in."
    : accuracy >= 70 ? "Got through it."
    : "Another pass would help.";

  return (
    <div className="cr-done" data-mood={mood}>
      <div className="cr-done-inner">
        <div className="cr-done-check">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.25" />
            <path d="M14 24 L22 32 L34 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div
          className="text-eyebrow"
          style={{ color: mood === "focus" ? "var(--tk-persimmon)" : "var(--tk-accent-deep)", marginBottom: 10 }}
        >
          Cram complete
        </div>

        <div className="cr-done-title">{headline}</div>

        <div className="cr-done-stats">
          <div>
            <div className="cr-done-num">{cleared}</div>
            <div className="text-eyebrow">Cleared</div>
          </div>
          <div>
            <div className="cr-done-num">{fmtTime(durationSec)}</div>
            <div className="text-eyebrow">Time</div>
          </div>
          <div>
            <div className="cr-done-num">{accuracy}%</div>
            <div className="text-eyebrow">Accuracy</div>
          </div>
          <div>
            <div className="cr-done-num">{reshown}</div>
            <div className="text-eyebrow">Re-shown</div>
          </div>
        </div>

        <div className="cr-done-note">
          {countAsReview
            ? <>{cleared} reviews applied — <em>{deck.deckName}</em> scheduler updated.</>
            : <>Crammed {cleared} words from <em>{deck.deckName}</em>.<br />They'll still come up in Review on their schedule.</>
          }
        </div>

        <div className="cr-done-actions">
          <button className="tk-btn tk-btn-ghost" onClick={onBackToDeck}>Back to deck</button>
          {missedCards.length > 0 ? (
            <button
              className={`tk-btn ${mood === "focus" ? "cr-btn-focus" : "tk-btn-accent"}`}
              onClick={onRunAgain}
            >
              Run the {missedCards.length} miss{missedCards.length === 1 ? "" : "es"}
            </button>
          ) : (
            <button
              className={`tk-btn ${mood === "focus" ? "cr-btn-focus" : "tk-btn-accent"}`}
              onClick={onClose}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
