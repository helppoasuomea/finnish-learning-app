import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { Card } from "@/types";

// ── Per-cardKind copy ────────────────────────────────────────────────────────
// Each kind gets its own labels, placeholders, and (where it makes sense)
// help-text under each field. Keeping this in one table makes the modal a
// thin renderer over a config object.
type CardKind = "word" | "sentence" | "cloze" | "grammar";

interface KindConfig {
  eyebrow: string;
  titlePrefix: string;
  frontLabel: string;
  frontPlaceholder: string;
  frontHelp?: string;
  backLabel: string;
  backPlaceholder: string;
  backHelp?: string;
  showPos: boolean;
  showPronunciation: boolean;
  noteHelp?: string;
}

const KIND_CONFIG: Record<CardKind, KindConfig> = {
  word: {
    eyebrow: "Editing card · Vocab",
    titlePrefix: "Edit",
    frontLabel: "Target word",
    frontPlaceholder: "e.g. en voi",
    backLabel: "English meaning",
    backPlaceholder: "e.g. I can't",
    showPos: true,
    showPronunciation: true,
    noteHelp: "A mnemonic, etymology, or where you saw it…",
  },
  sentence: {
    eyebrow: "Editing card · Sentence",
    titlePrefix: "Edit sentence",
    frontLabel: "Sentence",
    frontPlaceholder: "Olen kuullut paljon hänestä.",
    backLabel: "Translation",
    backPlaceholder: "I have heard a lot about him.",
    showPos: false,
    showPronunciation: false,
    noteHelp: "Context, source, or grammar to remember…",
  },
  cloze: {
    eyebrow: "Editing card · Cloze",
    titlePrefix: "Edit cloze",
    // These two only used when reconstruction fails (no answer recorded).
    frontLabel: "Sentence",
    frontPlaceholder: "Type the sentence, then tap a word to mark it as a blank",
    backLabel: "Answer",
    backPlaceholder: "kuullut",
    showPos: false,
    showPronunciation: false,
    noteHelp: "Why this answer? Grammar rule, sense, etc.",
  },
  grammar: {
    // Grammar uses a fully bespoke layout (topic chips + prompt + answer +
    // short note + rule). These generic fields are unused but kept for the
    // KindConfig contract.
    eyebrow: "Editing card · Grammar",
    titlePrefix: "Edit grammar",
    frontLabel: "Prompt",
    frontPlaceholder: "Pluralize: kirja",
    backLabel: "Answer",
    backPlaceholder: "kirjat",
    showPos: false,
    showPronunciation: false,
  },
};

const POS_OPTIONS = [
  "noun", "verb", "adjective", "adverb", "pronoun",
  "numeral", "postposition", "conjunction", "particle",
  "interjection", "proper_noun",
];

// Mirrors AddCardDrawer.tsx so add-and-edit show the same chip set.
const GRAMMAR_TOPICS = [
  "partitive", "plurals", "consonant gradation", "conjugation",
  "cases", "possession", "negatives", "other",
];

const BLANK_TOKEN_RE = /_{2,}/; // matches "__", "___", "____" — anything with 2+ underscores

interface CardPatch {
  userLangCard: string;
  engCard: string;
  type: string;
  pronunciation: string;
  note: string;
  comment?: string; // cloze answer lives here; backend ignores when undefined
}

interface Props {
  card: Card;
  onClose: () => void;
  onSave: (patch: CardPatch) => Promise<void> | void;
}

// ── Cloze reconstruction ─────────────────────────────────────────────────────
// Stored shape (from AddCardDrawer):
//   userLangCard = "___ matcha latte, kiitti."   (sentence with blanks)
//   comment      = "Yksi"                        (comma-separated answers)
//
// To re-edit we walk the words: every "___" token consumes the next answer
// from `comment`, restoring the original full sentence; the index of every
// such token becomes a member of the initial blanked set. If `comment` is
// shorter than the number of blanks (e.g. card was authored before this
// feature existed), the leftover blanks stay as literal "___" — the user can
// still re-tap them.
function reconstructCloze(userLangCard: string, comment: string): {
  fullSentence: string;
  blankedIdxs: Set<number>;
} {
  const tokens = (userLangCard ?? "").trim().split(/\s+/).filter(Boolean);
  const answers = (comment ?? "").split(",").map(a => a.trim()).filter(Boolean);
  const blanked = new Set<number>();
  let answerCursor = 0;
  const restored = tokens.map((tok, i) => {
    if (BLANK_TOKEN_RE.test(tok)) {
      blanked.add(i);
      const nextAnswer = answers[answerCursor++];
      // Preserve trailing punctuation that hugged the blank ("___,", "___.")
      const trailing = tok.match(/[^_]+$/)?.[0] ?? "";
      return nextAnswer ? nextAnswer + trailing : tok;
    }
    return tok;
  });
  return { fullSentence: restored.join(" "), blankedIdxs: blanked };
}

export const EditCardModal: React.FC<Props> = ({ card, onClose, onSave }) => {
  const kind: CardKind = (card.cardKind ?? "word") as CardKind;
  const cfg = KIND_CONFIG[kind] ?? KIND_CONFIG.word;

  // ── Generic fields (used by word / sentence / grammar) ─────────────────────
  // For grammar these map to:
  //   userLangCard  → Prompt           (e.g. "Pluralize: kirja")
  //   engCard       → Answer           (e.g. "kirjat")
  //   type          → Topic chip       (one of GRAMMAR_TOPICS)
  //   pronunciation → Short note       (italic label on card front)
  //   comment       → Rule/explanation (blockquote on reveal)
  //   note          → Personal note    (private mnemonic)
  const [userLangCard, setUserLangCard] = useState(card.userLangCard ?? "");
  const [engCard,      setEngCard]      = useState(card.engCard ?? "");
  const [type,         setType]         = useState(card.type ?? "");
  const [pronunciation, setPronunciation] = useState(card.pronunciation ?? "");
  const [comment,      setComment]      = useState(card.comment ?? "");
  const [note,         setNote]         = useState(card.note ?? "");

  // ── Cloze-specific state ───────────────────────────────────────────────────
  // We work in "full sentence + blanked indices" space (same as AddCardDrawer)
  // and only collapse back to "sentence with ___" on save.
  const initialCloze = useMemo(
    () => reconstructCloze(card.userLangCard ?? "", card.comment ?? ""),
    [card.userLangCard, card.comment],
  );
  const [clozeSentence, setClozeSentence] = useState(initialCloze.fullSentence);
  const [blankedIdxs,   setBlankedIdxs]   = useState<Set<number>>(initialCloze.blankedIdxs);
  const [clozeAnswerEdit, setClozeAnswerEdit] = useState(card.comment ?? "");

  const clozeWords = useMemo(
    () => clozeSentence.trim().split(/\s+/).filter(Boolean),
    [clozeSentence],
  );
  const clozeUserLangCard = useMemo(
    () => clozeWords.map((w, i) => blankedIdxs.has(i) ? "___" : w).join(" "),
    [clozeWords, blankedIdxs],
  );
  const clozeAutoAnswer = useMemo(
    () => clozeWords.filter((_, i) => blankedIdxs.has(i)).join(", "),
    [clozeWords, blankedIdxs],
  );
  // Auto-fill answer whenever the user re-taps blanks. Once they manually edit
  // the answer field, we leave it alone.
  const [answerDirty, setAnswerDirty] = useState(false);
  useEffect(() => {
    if (!answerDirty) setClozeAnswerEdit(clozeAutoAnswer);
  }, [clozeAutoAnswer, answerDirty]);

  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);

  const dirty = useMemo(() => {
    if (kind === "cloze") {
      return clozeUserLangCard !== (card.userLangCard ?? "") ||
             engCard           !== (card.engCard ?? "")      ||
             clozeAnswerEdit   !== (card.comment ?? "")      ||
             note              !== (card.note ?? "");
    }
    if (kind === "grammar") {
      return userLangCard !== (card.userLangCard ?? "") ||
             engCard      !== (card.engCard ?? "")      ||
             type         !== (card.type ?? "")         ||
             pronunciation !== (card.pronunciation ?? "") ||
             comment      !== (card.comment ?? "")      ||
             note         !== (card.note ?? "");
    }
    return userLangCard !== (card.userLangCard ?? "") ||
           engCard      !== (card.engCard ?? "")      ||
           type         !== (card.type ?? "")         ||
           pronunciation !== (card.pronunciation ?? "") ||
           note         !== (card.note ?? "");
  }, [kind, clozeUserLangCard, clozeAnswerEdit, userLangCard, engCard, type, pronunciation, comment, note, card]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const titleSnippet =
    kind === "cloze"   ? clozeUserLangCard :
    kind === "grammar" ? userLangCard :
    card.userLangCard;
  const titleSafe = titleSnippet || "card";
  const trimmed = titleSafe.trim();
  const truncatedTitle = trimmed.length > 36 ? trimmed.slice(0, 35) + "…" : trimmed;

  const toggleBlank = (idx: number) => {
    setBlankedIdxs(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
    // Re-engage auto-fill so the answer reflects the new blank set.
    setAnswerDirty(false);
  };

  async function handleSave() {
    if (!dirty || saving) return;
    setSaving(true);
    try {
      let patch: CardPatch;
      if (kind === "cloze") {
        patch = {
          userLangCard: clozeUserLangCard,
          engCard,
          type: card.type ?? "",
          pronunciation: card.pronunciation ?? "",
          note,
          comment: clozeAnswerEdit,
        };
      } else if (kind === "grammar") {
        patch = { userLangCard, engCard, type, pronunciation, note, comment };
      } else {
        patch = { userLangCard, engCard, type, pronunciation, note };
      }
      await onSave(patch);
      setSaved(true);
      setTimeout(onClose, 500);
    } catch {
      setSaving(false);
    }
  }

  const showBoth = cfg.showPos && cfg.showPronunciation;

  return (
    <div className="tk-modal-scrim" onClick={onClose}>
      <div
        className="tk-modal w-[min(560px,calc(100vw-40px))]"
        onClick={e => e.stopPropagation()}
      >
        <div className="tk-modal-head">
          <div>
            <div className="tk-eyebrow">{cfg.eyebrow}</div>
            <div className="mt-0.5 text-[22px] font-medium">
              {cfg.titlePrefix} "{truncatedTitle}"
            </div>
          </div>
          <button className="tk-icon-btn" onClick={onClose} aria-label="Close"><X size={15} /></button>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5">
          {kind === "cloze" ? (
            <>
              <div className="tk-field">
                <div className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-[var(--tk-ink-3)] mb-2.5">
                  Tap words in your sentence to mark them as blanks
                </div>
                <input
                  className="tk-textfield"
                  value={clozeSentence}
                  onChange={e => { setClozeSentence(e.target.value); setBlankedIdxs(new Set()); setAnswerDirty(false); }}
                  placeholder={cfg.frontPlaceholder}
                  autoFocus
                />
              </div>

              {clozeWords.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {clozeWords.map((word, i) => {
                    const isBlank = blankedIdxs.has(i);
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => toggleBlank(i)}
                        className={`px-3 py-[5px] rounded-md border text-sm cursor-pointer transition-colors ${
                          isBlank
                            ? "border-[var(--tk-tag-plum)] bg-[color-mix(in_oklab,var(--tk-tag-plum)_12%,var(--tk-card))] text-[var(--tk-tag-plum)] font-mono"
                            : "border-[var(--tk-rule)] bg-[var(--tk-card)] text-[var(--tk-ink-2)]"
                        }`}
                      >
                        {isBlank ? "___" : word}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="tk-field">
                <div className="tk-field-label flex items-baseline justify-between">
                  <span>Answer</span>
                  <span className="font-normal italic text-[11.5px] text-[var(--tk-ink-4)] normal-case tracking-normal">
                    auto-filled when you tap; editable
                  </span>
                </div>
                <input
                  className="tk-textfield"
                  value={clozeAnswerEdit}
                  onChange={e => { setClozeAnswerEdit(e.target.value); setAnswerDirty(true); }}
                  placeholder={cfg.backPlaceholder}
                />
              </div>

              <div className="tk-field">
                <div className="tk-field-label flex items-baseline justify-between">
                  <span>English translation</span>
                  <span className="font-normal italic text-[11.5px] text-[var(--tk-ink-4)] normal-case tracking-normal">
                    optional · shown after reveal
                  </span>
                </div>
                <input
                  className="tk-textfield"
                  value={engCard}
                  onChange={e => setEngCard(e.target.value)}
                  placeholder="One matcha latte, please."
                />
              </div>

              <div className="tk-field">
                <div className="tk-field-label">
                  Note <span className="font-normal text-[var(--tk-ink-4)]">· optional</span>
                </div>
                <textarea
                  className="tk-textfield"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                  placeholder="Why this answer? Grammar rule, sense, etc."
                />
              </div>
            </>
          ) : kind === "grammar" ? (
            <>
              <div className="tk-field">
                <div className="tk-field-label">Topic</div>
                <div className="tk-chips">
                  {GRAMMAR_TOPICS.map(t => (
                    <button
                      key={t}
                      type="button"
                      data-active={type === t}
                      onClick={() => setType(t)}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="tk-field">
                <div className="tk-field-label">Prompt</div>
                <input
                  className="tk-textfield"
                  value={userLangCard}
                  onChange={e => setUserLangCard(e.target.value)}
                  placeholder="Pluralize: kirja"
                  autoFocus
                />
              </div>

              <div className="tk-field">
                <div className="tk-field-label">Answer</div>
                <input
                  className="tk-textfield"
                  value={engCard}
                  onChange={e => setEngCard(e.target.value)}
                  placeholder="kirjat"
                />
              </div>

              <div className="tk-field">
                <div className="tk-field-label flex items-baseline justify-between">
                  <span>Short note</span>
                  <span className="font-normal italic text-[11.5px] text-[var(--tk-ink-4)] normal-case tracking-normal">
                    optional · italic label on card
                  </span>
                </div>
                <input
                  className="tk-textfield"
                  value={pronunciation}
                  onChange={e => setPronunciation(e.target.value)}
                  placeholder="Plural nominative."
                />
              </div>

              <div className="tk-field">
                <div className="tk-field-label flex items-baseline justify-between">
                  <span>Rule / explanation</span>
                  <span className="font-normal italic text-[11.5px] text-[var(--tk-ink-4)] normal-case tracking-normal">
                    optional · blockquote on reveal
                  </span>
                </div>
                <textarea
                  className="tk-textfield"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={3}
                  placeholder="Plural nominative: add -t to the stem."
                />
              </div>

              <div className="tk-field">
                <div className="tk-field-label">
                  Personal note <span className="font-normal text-[var(--tk-ink-4)]">· optional · private</span>
                </div>
                <textarea
                  className="tk-textfield"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={2}
                  placeholder="Examples, exceptions, where it tripped you up…"
                />
              </div>
            </>
          ) : (
            <>
              <div className="tk-field">
                <div className="tk-field-label">{cfg.frontLabel}</div>
                <input
                  className="tk-textfield"
                  value={userLangCard}
                  onChange={e => setUserLangCard(e.target.value)}
                  placeholder={cfg.frontPlaceholder}
                  autoFocus
                />
                {cfg.frontHelp && (
                  <div className="mt-1 text-[11.5px] text-[var(--tk-ink-3)]">{cfg.frontHelp}</div>
                )}
              </div>

              <div className="tk-field">
                <div className="tk-field-label">{cfg.backLabel}</div>
                <input
                  className="tk-textfield"
                  value={engCard}
                  onChange={e => setEngCard(e.target.value)}
                  placeholder={cfg.backPlaceholder}
                />
                {cfg.backHelp && (
                  <div className="mt-1 text-[11.5px] text-[var(--tk-ink-3)]">{cfg.backHelp}</div>
                )}
              </div>

              {(cfg.showPos || cfg.showPronunciation) && (
                <div className={`grid gap-3.5 ${showBoth ? "grid-cols-2" : "grid-cols-1"}`}>
                  {cfg.showPos && (
                    <div className="tk-field">
                      <div className="tk-field-label">Part of speech</div>
                      <select
                        className="tk-textfield"
                        value={type}
                        onChange={e => setType(e.target.value)}
                      >
                        <option value="">—</option>
                        {POS_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  )}
                  {cfg.showPronunciation && (
                    <div className="tk-field">
                      <div className="tk-field-label">Pronunciation (IPA)</div>
                      <input
                        className="tk-textfield"
                        value={pronunciation}
                        onChange={e => setPronunciation(e.target.value)}
                        placeholder="/ˈkɑhʋi/"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="tk-field">
                <div className="tk-field-label">
                  Note <span className="font-normal text-[var(--tk-ink-4)]">· optional</span>
                </div>
                <textarea
                  className="tk-textfield"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  rows={3}
                  placeholder={cfg.noteHelp}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-[var(--tk-rule)] px-6 py-3.5">
          <span className="text-xs text-[var(--tk-ink-3)]">
            {saved ? "Saved ✓" : dirty ? "Unsaved changes" : "No changes yet"}
          </span>
          <div className="flex gap-2.5">
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose}>Cancel</button>
            <button
              className="tk-btn tk-btn-accent tk-btn-sm"
              onClick={handleSave}
              disabled={!dirty || saving || saved}
            >
              {saved ? "Saved ✓" : saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
