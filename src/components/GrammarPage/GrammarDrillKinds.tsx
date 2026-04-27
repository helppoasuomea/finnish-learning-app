import { useState, useEffect, useRef } from 'react';
import type { Drill } from '@/data/grammar/types';
import { isCorrect } from './GrammarMorphology';

export interface DrillVerdict {
  userAnswer: string;
  correct: boolean;
  expected: string;
  explanation?: string;
}

function DrillKindLabel({ label }: { label: string }) {
  return <div className="gr-drill-kind">{label}</div>;
}

// ── 1. Fill-in-the-blank ──
function FillDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { sentence, answer, acceptAlso, hint, baseForm } = drill.data;
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, [drill.id]);

  const submit = () => {
    if (!value.trim()) return;
    onSubmit({ userAnswer: value, correct: isCorrect(value, answer, acceptAlso), expected: answer });
  };
  const parts: string[] = (sentence as string).split(/_+/);
  return (
    <div>
      <DrillKindLabel label="Fill the blank" />
      {baseForm && <div className="gr-base">Base: <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{baseForm as string}</span></div>}
      {hint && <div className="gr-drill-instruction">{hint as string}</div>}
      <div className="gr-drill-sentence">
        {parts[0]}
        <input
          ref={inputRef}
          className="gr-blank-input"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          placeholder="…"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
        {parts[1]}
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="tk-btn tk-btn-primary" onClick={submit}>
          Submit <span className="mono" style={{ opacity: 0.5, fontSize: 11 }}>↵</span>
        </button>
      </div>
    </div>
  );
}

// ── 2. Multiple choice ──
function McDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { prompt, options, correctIndex, explanation } = drill.data as {
    prompt: string; options: string[]; correctIndex: number; explanation?: string;
  };
  const [picked, setPicked] = useState<number | null>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (picked !== null) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= options.length) pick(n - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [drill.id, picked]);

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    setTimeout(() => {
      onSubmit({ userAnswer: options[idx], correct: idx === correctIndex, expected: options[correctIndex], explanation });
    }, 500);
  };
  return (
    <div>
      <DrillKindLabel label="Multiple choice" />
      <div className="gr-drill-prompt">{prompt}</div>
      <div className="gr-mc-grid">
        {options.map((o, i) => {
          let cls = 'gr-mc-opt';
          if (picked !== null) {
            if (i === correctIndex) cls += ' is-correct';
            else if (i === picked) cls += ' is-wrong';
          }
          return (
            <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>
              {o}<span className="kbd">{i + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── 3. Transform ──
function TransformDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { base, instruction, answer, acceptAlso } = drill.data as {
    base: string; instruction: string; answer: string; acceptAlso?: string[];
  };
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, [drill.id]);

  const submit = () => {
    if (!value.trim()) return;
    onSubmit({ userAnswer: value, correct: isCorrect(value, answer, acceptAlso), expected: answer });
  };
  return (
    <div>
      <DrillKindLabel label="Transform" />
      <div className="gr-base" style={{ fontSize: 22, padding: '10px 20px' }}>
        <span style={{ color: 'var(--ink-3)', fontSize: 14, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>base</span>
        <span style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)', fontSize: 26, letterSpacing: '-0.01em' }}>{base}</span>
      </div>
      <div className="gr-drill-instruction">{instruction}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 18 }}>
        <input
          ref={inputRef}
          className="gr-blank-input"
          style={{ minWidth: 260 }}
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') submit(); }}
          placeholder="your answer"
          autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
        />
      </div>
      <div style={{ marginTop: 28, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="tk-btn tk-btn-primary" onClick={submit}>Submit ↵</button>
      </div>
    </div>
  );
}

// ── 4. Builder ──
function BuilderDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { tiles, correctOrder, translation } = drill.data as {
    tiles: string[]; correctOrder: number[]; translation: string;
  };
  const [picked, setPicked] = useState<number[]>([]);
  const used = new Set(picked);

  const commit = (finalPicked: number[]) => {
    const correct = finalPicked.length === correctOrder.length && finalPicked.every((idx, i) => idx === correctOrder[i]);
    const userAnswer = finalPicked.map(i => tiles[i]).join(' ');
    const expected = correctOrder.map(i => tiles[i]).join(' ');
    onSubmit({ userAnswer, correct, expected });
  };
  const pickTile = (i: number) => {
    if (used.has(i)) return;
    const next = [...picked, i];
    setPicked(next);
    if (next.length === tiles.length) setTimeout(() => commit(next), 250);
  };
  const popTile = (pos: number) => setPicked(picked.filter((_, i) => i !== pos));

  return (
    <div>
      <DrillKindLabel label="Sentence builder" />
      <div className="gr-drill-instruction">Translate: <em>"{translation}"</em></div>
      <div className="gr-builder-drop">
        {picked.map((ti, pos) => (
          <button key={pos} className="gr-tile" onClick={() => popTile(pos)}>{tiles[ti]}</button>
        ))}
      </div>
      <div className="gr-builder-pool">
        {tiles.map((t, i) => (
          <button key={i} className={`gr-tile ${used.has(i) ? 'is-used' : ''}`} onClick={() => pickTile(i)}>{t}</button>
        ))}
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setPicked([])} disabled={picked.length === 0}>Reset</button>
        <button className="tk-btn tk-btn-primary" onClick={() => commit(picked)} disabled={picked.length === 0}>Check</button>
      </div>
    </div>
  );
}

// ── 5. Spot the error ──
function SpotErrorDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { sentence, errorWord, correctForm, explanation } = drill.data as {
    sentence: string; errorWord: string; correctForm: string; explanation?: string;
  };
  const words = sentence.replace(/([.,!?])/g, ' $1').split(/\s+/).filter(Boolean);
  const [picked, setPicked] = useState<{ i: number; correct: boolean } | null>(null);

  const pickWord = (word: string, i: number) => {
    if (picked !== null) return;
    const match = word.replace(/[.,!?]/g, '') === errorWord.replace(/[.,!?]/g, '');
    setPicked({ i, correct: match });
    setTimeout(() => onSubmit({ userAnswer: word, correct: match, expected: correctForm, explanation }), 550);
  };
  return (
    <div>
      <DrillKindLabel label="Spot the error" />
      <div className="gr-drill-instruction">Which word is in the wrong form?</div>
      <div className="gr-se-sentence">
        {words.map((w, i) => {
          let cls = 'gr-se-word';
          if (picked) {
            if (picked.i === i && !picked.correct) cls += ' is-wrong-pick';
            if (w.replace(/[.,!?]/g, '') === errorWord.replace(/[.,!?]/g, '')) cls += ' is-error-word is-revealed';
          }
          if (/^[.,!?]$/.test(w)) return <span key={i} style={{ color: 'var(--ink-3)' }}>{w}</span>;
          return <span key={i} className={cls} onClick={() => pickWord(w, i)}>{w}</span>;
        })}
      </div>
    </div>
  );
}

// ── 6. Translate ──
function TranslateDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { prompt, target, acceptAlso, gradingFocus } = drill.data as {
    prompt: string; target: string; acceptAlso?: string[]; gradingFocus?: string;
  };
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, [drill.id]);

  const submit = () => {
    if (!value.trim()) return;
    onSubmit({ userAnswer: value, correct: isCorrect(value, target, acceptAlso), expected: target });
  };
  return (
    <div>
      <DrillKindLabel label="Translate" />
      {gradingFocus && <div className="gr-drill-instruction">Grading focus: <em>{gradingFocus}</em></div>}
      <div className="gr-drill-prompt" style={{ fontStyle: 'italic' }}>"{prompt}"</div>
      <input
        ref={inputRef}
        className="tk-input"
        style={{ height: 52, fontSize: 18, fontFamily: 'var(--font-mono)' }}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') submit(); }}
        placeholder="Translate to Finnish…"
        autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
      />
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button className="tk-btn tk-btn-primary" onClick={submit}>Submit ↵</button>
      </div>
    </div>
  );
}

// ── 7. Listen (placeholder) ──
function ListenDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { transcript, question, options, correctIndex } = drill.data as {
    transcript: string; question: string; options: string[]; correctIndex: number;
  };
  const [playing, setPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);

  const pick = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    setTimeout(() => onSubmit({ userAnswer: options[idx], correct: idx === correctIndex, expected: options[correctIndex] }), 500);
  };
  const bars = Array.from({ length: 22 });
  return (
    <div>
      <DrillKindLabel label="Listen" />
      <div className="gr-listen-wave">
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setPlaying(p => !p)}
          style={{ width: 40, height: 40, padding: 0, borderRadius: '50%' }}>
          {playing ? '⏸' : '▶'}
        </button>
        <div className="gr-listen-bars">
          {bars.map((_, i) => (
            <span key={i} style={{
              height: `${20 + (Math.sin(i * 0.7) + 1) * 35}%`,
              animationDelay: `${i * 50}ms`,
              animationPlayState: playing ? 'running' : 'paused',
            }} />
          ))}
        </div>
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setShowTranscript(s => !s)}>
          {showTranscript ? 'Hide' : 'Show'} transcript
        </button>
      </div>
      {showTranscript && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 14, color: 'var(--ink-2)', background: 'var(--paper-deep)', padding: '10px 14px', borderRadius: 'var(--r-sm)', marginBottom: 20 }}>
          {transcript}
        </div>
      )}
      <div className="gr-drill-prompt" style={{ fontSize: 22 }}>{question}</div>
      <div className="gr-mc-grid">
        {options.map((o, i) => {
          let cls = 'gr-mc-opt';
          if (picked !== null) {
            if (i === correctIndex) cls += ' is-correct';
            else if (i === picked) cls += ' is-wrong';
          }
          return <button key={i} className={cls} onClick={() => pick(i)} disabled={picked !== null}>{o}<span className="kbd">{i + 1}</span></button>;
        })}
      </div>
    </div>
  );
}

// ── 8. Table drill ──
function TableDrill({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const { headers, rows } = drill.data as {
    headers: string[];
    rows: Array<{ cells: Array<{ value: string; blank?: boolean }> }>;
  };
  const initial: Record<string, string> = {};
  rows.forEach((r, ri) => r.cells.forEach((c, ci) => { if (c.blank) initial[`${ri}:${ci}`] = ''; }));
  const [answers, setAnswers] = useState(initial);
  const [checked, setChecked] = useState<Record<string, { ok: boolean; user: string; expected: string }> | null>(null);

  const set = (k: string, v: string) => setAnswers(a => ({ ...a, [k]: v }));
  const submit = () => {
    let allCorrect = true;
    const result: Record<string, { ok: boolean; user: string; expected: string }> = {};
    rows.forEach((r, ri) => r.cells.forEach((c, ci) => {
      if (c.blank) {
        const key = `${ri}:${ci}`;
        const ok = isCorrect(answers[key], c.value);
        result[key] = { ok, user: answers[key], expected: c.value };
        if (!ok) allCorrect = false;
      }
    }));
    setChecked(result);
    setTimeout(() => onSubmit({ userAnswer: JSON.stringify(answers), correct: allCorrect, expected: 'all cells correct' }), 1400);
  };
  return (
    <div>
      <DrillKindLabel label="Fill the table" />
      <div className="gr-drill-instruction">Fill every blank. The grid is submitted as a whole.</div>
      <table className="gr-table">
        <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {r.cells.map((c, ci) => {
                const key = `${ri}:${ci}`;
                if (!c.blank) return <td key={ci} className="label">{c.value}</td>;
                let tdCls = '';
                if (checked?.[key]) tdCls = checked[key].ok ? 'is-correct' : 'is-wrong';
                return (
                  <td key={ci} className={tdCls}>
                    {checked ? (
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 14 }}>
                        {checked[key].ok ? answers[key] : <><s>{answers[key] || '—'}</s> → {c.value}</>}
                      </span>
                    ) : (
                      <input value={answers[key]} onChange={e => set(key, e.target.value)}
                        placeholder="…" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {!checked && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="tk-btn tk-btn-primary" onClick={submit}>Check table</button>
        </div>
      )}
    </div>
  );
}

// ── Router ──
export function GrammarDrillKind({ drill, onSubmit }: { drill: Drill; onSubmit: (v: DrillVerdict) => void }) {
  const map: Record<string, React.ComponentType<{ drill: Drill; onSubmit: (v: DrillVerdict) => void }>> = {
    fill: FillDrill,
    mc: McDrill,
    transform: TransformDrill,
    builder: BuilderDrill,
    'spot-error': SpotErrorDrill,
    translate: TranslateDrill,
    listen: ListenDrill,
    table: TableDrill,
  };
  const Comp = map[drill.kind];
  if (!Comp) return <div style={{ color: 'var(--ink-3)', fontFamily: 'var(--font-mono)' }}>Unknown drill kind: {drill.kind}</div>;
  return <Comp drill={drill} onSubmit={onSubmit} />;
}
