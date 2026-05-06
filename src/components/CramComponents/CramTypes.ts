import { Card } from "@/types";

export type CramMood = "calm" | "focus";
export type CramDirection = "fi-en" | "en-fi" | "mixed";
export type CramStyle = "flip" | "mc" | "type" | "mixed";

export interface CramConfig {
  cards: Card[];
  direction: CramDirection;
  style: CramStyle;
  countAsReview: boolean;
  loop: boolean;
  threshold: 1 | 2 | 3;
  mood: CramMood;
}

export interface CramQueueEntry {
  card: Card;
  streak: number;
  seenCount: number;
  firstTry: "got" | "miss" | null;
}

export type CramGrade = "got" | "miss";

export interface CramHistoryRow {
  cardId: string;
  card: Card;
  grade: CramGrade;
  firstTry: "got" | "miss" | null;
  dir: "fi-en" | "en-fi";
  style: "flip" | "mc" | "type";
  ts: number;
}

export interface CramSummary {
  cleared: number;
  accuracy: number;
  reshown: number;
  durationMs: number;
  durationSec: number;
  missedCards: Card[];
  countAsReview: boolean;
  history: CramHistoryRow[];
}
