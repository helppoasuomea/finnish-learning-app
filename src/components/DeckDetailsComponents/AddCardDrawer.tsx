import { useState, useMemo, useRef, useEffect } from "react";
import { X, Plus, Check, AlertTriangle } from "lucide-react";

type CardKind = "word" | "sentence" | "cloze" | "grammar";

const WORD_TYPES = ["noun", "verb", "adjective", "adverb", "phrase", "other"];
const GRAMMAR_TOPICS = ["partitive", "plurals", "consonant gradation", "conjugation", "cases", "possession", "negatives", "other"];

const KIND_META: Record<CardKind, { dot: string; subtitle: string }> = {
  word:     { dot: "var(--tk-accent)",      subtitle: "Single Finnish word + translation" },
  sentence: { dot: "var(--tk-tag-sky)",     subtitle: "A whole phrase to learn together" },
  cloze:    { dot: "var(--tk-tag-plum)",    subtitle: "Fill in the blank — one or more words" },
  grammar:  { dot: "var(--tk-tag-clay)",    subtitle: "Form drill — case, tense, plural" },
};

interface AddCardPayload {
  userLangCard: string;
  engCard: string;
  cardKind: string;
  type: string;
  pronunciation: string;
  comment: string;
}

interface Props {
  deckName: string;
  existingFi: Set<string>;
  onClose: () => void;
  onAdd: (card: AddCardPayload) => void;
}

const Drawer: React.FC<{ title: string; subtitle: string; onClose: () => void; children: React.ReactNode; footer: React.ReactNode }> = ({ title, subtitle, onClose, children, footer }) => (
  <>
    <div className="tk-drawer-scrim" onClick={onClose} />
    <div className="tk-drawer">
      <div className="tk-drawer-head">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="tk-eyebrow">Deck action</div>
          <div className="tk-drawer-title">{title}</div>
          <div className="tk-drawer-sub">{subtitle}</div>
        </div>
        <button className="tk-icon-btn" onClick={onClose}><X size={15} /></button>
      </div>
      <div className="tk-drawer-body">{children}</div>
      <div className="tk-drawer-foot">{footer}</div>
    </div>
  </>
);

const FieldRow: React.FC<{ label: string; hint?: string; children: React.ReactNode }> = ({ label, hint, children }) => (
  <div className="tk-field">
    <div className="tk-field-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tk-ink-3)" }}>{label}</span>
      {hint && <span style={{ fontSize: 11.5, color: "var(--tk-ink-4)", fontStyle: "italic", textTransform: "none", letterSpacing: 0, fontFamily: "inherit" }}>{hint}</span>}
    </div>
    {children}
  </div>
);

export const AddCardDrawer: React.FC<Props> = ({ deckName, existingFi, onClose, onAdd }) => {
  const [kind, setKind] = useState<CardKind>("word");

  // Word
  const [fi, setFi] = useState("");
  const [en, setEn] = useState("");
  const [wordType, setWordType] = useState("noun");
  const [pron, setPron] = useState("");

  // Sentence
  const [sentFi, setSentFi] = useState("");
  const [sentEn, setSentEn] = useState("");

  // Cloze
  const [clozeSentence, setClozeSentence] = useState("");
  const [blankedIdxs, setBlankedIdxs] = useState<Set<number>>(new Set());
  const [clozeAnswerEdit, setClozeAnswerEdit] = useState("");
  const [clozeEn, setClozeEn] = useState("");

  // Grammar
  const [grammarTopic, setGrammarTopic] = useState("partitive");
  const [grammarPrompt, setGrammarPrompt] = useState("");
  const [grammarAnswer, setGrammarAnswer] = useState("");
  const [grammarNote, setGrammarNote] = useState("");
  const [grammarRule, setGrammarRule] = useState("");

  const [addedCount, setAddedCount] = useState(0);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const firstFieldRef = useRef<HTMLElement>(null);

  const clozeWords = useMemo(() => clozeSentence.trim().split(/\s+/).filter(Boolean), [clozeSentence]);
  const clozeUserLangCard = useMemo(
    () => clozeWords.map((w, i) => blankedIdxs.has(i) ? "___" : w).join(" "),
    [clozeWords, blankedIdxs]
  );
  const clozeAutoAnswer = useMemo(
    () => clozeWords.filter((_, i) => blankedIdxs.has(i)).join(", "),
    [clozeWords, blankedIdxs]
  );
  useEffect(() => { setClozeAnswerEdit(clozeAutoAnswer); }, [clozeAutoAnswer]);

  const valid = useMemo(() => {
    switch (kind) {
      case "word":     return !!fi.trim() && !!en.trim();
      case "sentence": return !!sentFi.trim() && !!sentEn.trim();
      case "cloze":    return clozeWords.length > 0 && blankedIdxs.size > 0;
      case "grammar":  return !!grammarPrompt.trim() && !!grammarAnswer.trim();
    }
  }, [kind, fi, en, sentFi, sentEn, clozeWords, blankedIdxs, grammarPrompt, grammarAnswer]);

  const primaryTerm = kind === "word" ? fi : kind === "sentence" ? sentFi : kind === "cloze" ? clozeSentence : grammarPrompt;
  const dupe = useMemo(() => !!primaryTerm.trim() && existingFi.has(primaryTerm.trim().toLowerCase()), [primaryTerm, existingFi]);

  const reset = () => {
    setFi(""); setEn(""); setPron("");
    setSentFi(""); setSentEn("");
    setClozeSentence(""); setBlankedIdxs(new Set()); setClozeAnswerEdit(""); setClozeEn("");
    setGrammarPrompt(""); setGrammarAnswer(""); setGrammarNote(""); setGrammarRule("");
  };

  const switchKind = (k: CardKind) => { setKind(k); reset(); setJustAdded(null); };

  const toggleBlank = (idx: number) => {
    setBlankedIdxs(prev => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const submit = (continueAdding: boolean) => {
    if (!valid) return;
    let card: AddCardPayload;
    let label = "";
    switch (kind) {
      case "word":
        card = { userLangCard: fi.trim(), engCard: en.trim(), cardKind: "word", type: wordType, pronunciation: pron.trim(), comment: "" };
        label = fi.trim();
        break;
      case "sentence":
        card = { userLangCard: sentFi.trim(), engCard: sentEn.trim(), cardKind: "sentence", type: "", pronunciation: "", comment: "" };
        label = sentFi.trim().slice(0, 35);
        break;
      case "cloze":
        card = { userLangCard: clozeUserLangCard, engCard: clozeEn.trim(), cardKind: "cloze", type: "", pronunciation: "", comment: clozeAnswerEdit.trim() };
        label = clozeUserLangCard.slice(0, 35);
        break;
      case "grammar":
        card = { userLangCard: grammarPrompt.trim(), engCard: grammarAnswer.trim(), cardKind: "grammar", type: grammarTopic, pronunciation: grammarNote.trim(), comment: grammarRule.trim() };
        label = grammarPrompt.trim().slice(0, 35);
        break;
    }
    onAdd(card);
    setJustAdded(label);
    setAddedCount(c => c + 1);
    reset();
    if (continueAdding) { setTimeout(() => (firstFieldRef.current as HTMLElement | null)?.focus(), 40); }
    else { setTimeout(onClose, 350); }
  };

  // ⌘↵ / Ctrl↵ shortcut
  const handleGlobalKey = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") { e.preventDefault(); submit(true); }
  };

  const kindLabel = kind.charAt(0).toUpperCase() + kind.slice(1);

  return (
    <Drawer
      title="Add a card"
      subtitle={`Into ${deckName}`}
      onClose={onClose}
      footer={
        <>
          <div style={{ fontSize: 12, color: "var(--tk-ink-4)", fontFamily: "var(--font-mono)" }}>
            {addedCount > 0 ? `${addedCount} added` : `${kindLabel} card`}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onClose}>Done</button>
            <button
              className="tk-btn tk-btn-sm"
              disabled={!valid}
              onClick={() => submit(true)}
              style={{ background: "var(--tk-ink)", color: "var(--tk-paper)" }}
            >
              Add another <Plus size={13} />
            </button>
            <button className="tk-btn tk-btn-accent tk-btn-sm" disabled={!valid} onClick={() => submit(false)}>
              Add & close <Check size={13} />
            </button>
          </div>
        </>
      }
    >
      <div onKeyDown={handleGlobalKey}>
        {justAdded && (
          <div style={{ padding: "10px 12px", background: "color-mix(in oklab, var(--tk-accent) 10%, var(--tk-card))", border: "1px solid color-mix(in oklab, var(--tk-accent) 25%, var(--tk-rule))", borderRadius: 8, display: "flex", alignItems: "center", gap: 10, fontSize: 13, marginBottom: 16 }}>
            <Check size={14} style={{ color: "var(--tk-accent)" }} />
            <span><em style={{ fontStyle: "italic" }}>{justAdded}</em> added</span>
          </div>
        )}

        {/* Kind selector */}
        <div className="tk-field">
          <div className="tk-field-label">Kind of card</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {(["word", "sentence", "cloze", "grammar"] as CardKind[]).map(k => {
              const meta = KIND_META[k];
              const active = kind === k;
              return (
                <button
                  key={k}
                  onClick={() => switchKind(k)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: "1.5px solid",
                    borderColor: active ? "var(--tk-accent)" : "var(--tk-rule)",
                    background: active ? "color-mix(in oklab, var(--tk-accent) 8%, var(--tk-card))" : "var(--tk-card)",
                    textAlign: "left",
                    cursor: "pointer",
                    transition: "all 120ms",
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: meta.dot, marginBottom: 8, opacity: active ? 1 : 0.5 }} />
                  <div style={{ fontSize: 15, fontWeight: 600, color: active ? "var(--tk-ink)" : "var(--tk-ink-2)", letterSpacing: "-0.01em", marginBottom: 3 }}>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--tk-ink-4)", lineHeight: 1.4 }}>{meta.subtitle}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Word ── */}
        {kind === "word" && (
          <>
            <div className="tk-field">
              <div className="tk-field-label">Finnish <small>*</small></div>
              <input ref={firstFieldRef as React.RefObject<HTMLInputElement>} autoFocus className="tk-textfield" value={fi} onChange={e => setFi(e.target.value)} placeholder="kirjakauppa" />
              {dupe && (
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--tk-persimmon)", display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={12} /> Already exists in this deck.
                </div>
              )}
            </div>
            <div className="tk-field">
              <div className="tk-field-label">English <small>*</small></div>
              <input className="tk-textfield" value={en} onChange={e => setEn(e.target.value)} placeholder="bookstore" />
            </div>
            <div className="tk-field">
              <div className="tk-field-label">Type</div>
              <div className="tk-chips">
                {WORD_TYPES.map(t => (
                  <button key={t} data-active={wordType === t} onClick={() => setWordType(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="tk-field">
              <div className="tk-field-label">Pronunciation <small>optional</small></div>
              <input className="tk-textfield" data-small value={pron} onChange={e => setPron(e.target.value)} placeholder="/ˈkirjakauppa/" />
            </div>
          </>
        )}

        {/* ── Sentence ── */}
        {kind === "sentence" && (
          <>
            <div className="tk-field">
              <div className="tk-field-label">Finnish sentence <small>*</small></div>
              <textarea ref={firstFieldRef as React.RefObject<HTMLTextAreaElement>} autoFocus className="tk-textfield" rows={3} value={sentFi} onChange={e => setSentFi(e.target.value)} placeholder="Minä rakastan kahvia joka aamu." />
              {dupe && (
                <div style={{ marginTop: 6, fontSize: 12, color: "var(--tk-persimmon)", display: "flex", alignItems: "center", gap: 6 }}>
                  <AlertTriangle size={12} /> Already exists in this deck.
                </div>
              )}
            </div>
            <div className="tk-field">
              <div className="tk-field-label">English translation <small>*</small></div>
              <textarea className="tk-textfield" rows={3} value={sentEn} onChange={e => setSentEn(e.target.value)} placeholder="I love coffee every morning." />
            </div>
          </>
        )}

        {/* ── Cloze ── */}
        {kind === "cloze" && (
          <>
            <div className="tk-field">
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--tk-ink-3)", marginBottom: 10 }}>
                Tap words in your sentence to mark them as blanks
              </div>
              <input
                ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                autoFocus
                className="tk-textfield"
                value={clozeSentence}
                onChange={e => { setClozeSentence(e.target.value); setBlankedIdxs(new Set()); }}
                placeholder="Type the sentence, then tap a word to mark it as a blank"
              />
            </div>

            {clozeWords.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6, padding: "0 0 12px" }}>
                {clozeWords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => toggleBlank(i)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: 6,
                      border: "1px solid",
                      borderColor: blankedIdxs.has(i) ? "var(--tk-tag-plum)" : "var(--tk-rule)",
                      background: blankedIdxs.has(i) ? "color-mix(in oklab, var(--tk-tag-plum) 12%, var(--tk-card))" : "var(--tk-card)",
                      color: blankedIdxs.has(i) ? "var(--tk-tag-plum)" : "var(--tk-ink-2)",
                      fontSize: 14,
                      cursor: "pointer",
                      fontFamily: blankedIdxs.has(i) ? "var(--font-mono)" : undefined,
                    }}
                  >
                    {blankedIdxs.has(i) ? "___" : word}
                  </button>
                ))}
              </div>
            )}

            <FieldRow label="Answer" hint="auto-filled when you tap; editable">
              <input
                className="tk-textfield"
                value={clozeAnswerEdit}
                onChange={e => setClozeAnswerEdit(e.target.value)}
                placeholder="kotoisin"
              />
            </FieldRow>

            <FieldRow label="English Translation" hint="optional · shown after reveal">
              <input
                className="tk-textfield"
                value={clozeEn}
                onChange={e => setClozeEn(e.target.value)}
                placeholder="I'm from Finland."
              />
            </FieldRow>

            <div style={{ marginTop: 8, padding: "12px 14px", background: "var(--tk-paper-deep)", borderRadius: 8, fontSize: 12.5, color: "var(--tk-ink-3)", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--tk-ink-4)" }}>TIP</span>
              <span style={{ color: "var(--tk-ink-5)" }}>·</span>
              <span>Press <kbd style={{ display: "inline-flex", alignItems: "center", padding: "1px 5px", border: "1px solid var(--tk-rule)", borderRadius: 4, fontFamily: "var(--font-mono)", fontSize: 11, background: "var(--tk-card)", color: "var(--tk-ink-2)" }}>⌘↵</kbd> to add and keep going.</span>
            </div>
          </>
        )}

        {/* ── Grammar ── */}
        {kind === "grammar" && (
          <>
            <div className="tk-field">
              <div className="tk-field-label">Topic</div>
              <div className="tk-chips">
                {GRAMMAR_TOPICS.map(t => (
                  <button key={t} data-active={grammarTopic === t} onClick={() => setGrammarTopic(t)}>{t}</button>
                ))}
              </div>
            </div>
            <div className="tk-field">
              <div className="tk-field-label">Prompt <small>*</small></div>
              <input
                ref={firstFieldRef as React.RefObject<HTMLInputElement>}
                className="tk-textfield"
                value={grammarPrompt}
                onChange={e => setGrammarPrompt(e.target.value)}
                placeholder="Pluralize: kirja"
              />
            </div>
            <div className="tk-field">
              <div className="tk-field-label">Answer <small>*</small></div>
              <input className="tk-textfield" value={grammarAnswer} onChange={e => setGrammarAnswer(e.target.value)} placeholder="kirjat" />
            </div>
            <FieldRow label="Short note" hint="optional · italic label on card">
              <input className="tk-textfield" value={grammarNote} onChange={e => setGrammarNote(e.target.value)} placeholder="Plural nominative." />
            </FieldRow>
            <FieldRow label="Rule / explanation" hint="optional · blockquote on reveal">
              <textarea className="tk-textfield" rows={3} value={grammarRule} onChange={e => setGrammarRule(e.target.value)} placeholder="Plural nominative: add -t to the stem." />
            </FieldRow>
          </>
        )}
      </div>
    </Drawer>
  );
};
