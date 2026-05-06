import type { User } from "@/contexts/UserContext";

export type DifficultyLabelMode = NonNullable<User["difficultyLabel"]>;

const CEFR_TO_PLAIN: Record<string, string> = {
  A1: "Beginner",
  A2: "Beginner",
  B1: "Intermediate",
  B2: "Intermediate",
  C1: "Advanced",
  C2: "Advanced",
};

export function formatLevelLabel(level: string, mode: User["difficultyLabel"]): string {
  if (!level) return level;
  const normalized = level.toUpperCase();
  const plain = CEFR_TO_PLAIN[normalized] ?? level;
  const effectiveMode: DifficultyLabelMode = mode ?? "plain";

  if (effectiveMode === "cefr") return normalized;
  if (effectiveMode === "both") return `${plain} · ${normalized}`;
  return plain;
}
