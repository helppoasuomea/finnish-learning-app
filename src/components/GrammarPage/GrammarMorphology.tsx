import type { Morphology, GrammarIndexRow, Example, Source } from '@/data/grammar/types';

// ── Morpheme token chip with role label ──
const roleColor: Record<string, string> = {
  stem: 'var(--gr-stem)',
  gradation: 'var(--gr-gradation)',
  ending: 'var(--gr-ending)',
  other: 'var(--ink-2)',
};
const roleBg: Record<string, string> = {
  stem: 'transparent',
  gradation: 'var(--gr-gradation-bg)',
  ending: 'var(--gr-ending-bg)',
  other: 'transparent',
};

export function MorphToken({ token, role = 'stem', note, showLabel = true }: {
  token: string; role?: string; note?: string; showLabel?: boolean;
}) {
  const roleLabels: Record<string, string> = { stem: 'stem', gradation: 'grad.', ending: 'end.', other: '' };
  return (
    <span className={`gr-tok gr-tok-${role}`} title={note ?? ''}>
      <span className="gr-tok-surface">{token}</span>
      {showLabel && roleLabels[role] && <span className="gr-tok-role">{roleLabels[role]}</span>}
    </span>
  );
}

export function MorphSpan({ token, role = 'stem' }: { token: string; role?: string }) {
  return (
    <span className="tok" style={{
      color: roleColor[role] ?? roleColor.stem,
      background: roleBg[role] ?? 'transparent',
      padding: '0 3px', borderRadius: 3,
    }}>{token}</span>
  );
}

export function MorphologyBlock({ morphology }: { morphology?: Morphology }) {
  if (!morphology) return null;
  const { surface, breakdown = [], gradation } = morphology;
  return (
    <div className="gr-morph">
      <span className="gr-morph-label">Morphology</span>
      <div className="gr-morph-surface">
        {breakdown.map((b, i) => <MorphSpan key={i} token={b.token} role={b.role} />)}
      </div>
      <div className="gr-morph-equation">
        {breakdown.map((b, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            {i > 0 && <span className="op">+</span>}
            <MorphToken token={b.token} role={b.role} note={b.note} />
          </span>
        ))}
        <span className="op">=</span>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
          {surface}
        </span>
      </div>
      {(gradation || breakdown.some(b => b.note)) && (
        <dl className="gr-morph-notes">
          {gradation && <><dt>Gradation</dt><dd>{gradation}</dd></>}
          {breakdown.filter(b => b.note).map((b, i) => (
            <span key={i}><dt>{b.token} · {b.role}</dt><dd>{b.note}</dd></span>
          ))}
        </dl>
      )}
    </div>
  );
}

export function GrammarIndexLegend({ grammarIndex = [] }: { grammarIndex?: GrammarIndexRow[] }) {
  return (
    <div className="gr-index-legend">
      <h4>Pattern legend</h4>
      {grammarIndex.map((row, i) => (
        <div className="gr-index-row" key={i}>
          <span className="gr-index-pattern">{row.pattern}</span>
          <div>
            <div className="gr-index-use">{row.use}</div>
            {row.examples && row.examples.length > 0 && (
              <div className="gr-index-examples">{row.examples.slice(0, 3).join(' · ')}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ExampleList({ examples = [] }: { examples?: Example[] }) {
  return (
    <div className="gr-examples">
      {examples.map((e, i) => (
        <div className="gr-ex-row" key={i}>
          <div className="gr-ex-fi">{e.fi}</div>
          <div className="gr-ex-en">{e.en}</div>
        </div>
      ))}
    </div>
  );
}

export function RelativeExamples({ examples = [], label = 'Relative time' }: { examples?: Example[]; label?: string }) {
  if (!examples.length) return null;
  return (
    <div className="gr-relative">
      <div className="gr-relative-label">{label}</div>
      <div className="gr-examples">
        {examples.map((e, i) => (
          <div className="gr-ex-row" key={i}>
            <div className="gr-ex-fi">{e.fi}</div>
            <div className="gr-ex-en">{e.en}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SourcesBlock({ sources = [] }: { sources?: Source[] }) {
  return (
    <div className="gr-sources">
      <h4>Sources</h4>
      <ul>
        {sources.map((s, i) => (
          <li key={i}>
            {s.url ? <a href={s.url} target="_blank" rel="noreferrer">{s.label}</a> : s.label}
            {s.citation && <> — <code>{s.citation}</code></>}
            {s.license && <> · <code>{s.license}</code></>}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--ink-4)' }}>
        Grammar content is hand-authored and cited. AI is used only for error-specific "why?" explanations.
      </div>
    </div>
  );
}

// Diacritic-strict answer grading per spec §9.4
function strip(s: string) {
  return (s ?? '').normalize('NFKC').trim().toLowerCase();
}
export function isCorrect(userAns: string, expected: string, acceptAlso: string[] = []): boolean {
  const u = strip(userAns);
  if (!u) return false;
  if (u === strip(expected)) return true;
  return acceptAlso.some(a => strip(a) === u);
}
