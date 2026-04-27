import { useState, useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import type { GrammarTopic, Drill, Section } from '@/data/grammar/types';
import { grammarProgress } from '@/data/grammar/index';
import { GrammarDrillKind } from './GrammarDrillKinds';
import type { DrillVerdict } from './GrammarDrillKinds';

// ── Drill config ──
interface DrillConfig {
  scope: 'topic' | 'section' | 'missed';
  sectionId?: string;
  length: number | 'keep';
  mix: 'all' | 'mc' | 'type' | 'hard';
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQueue(topic: GrammarTopic, cfg: DrillConfig): Drill[] {
  let drills = topic.drills ?? [];
  if (cfg.scope === 'section') drills = drills.filter(d => d.sectionId === cfg.sectionId);
  const typeKinds = ['fill', 'transform', 'translate'];
  const hardKinds = ['builder', 'transform', 'spot-error'];
  if (cfg.mix === 'mc')   drills = drills.filter(d => d.kind === 'mc' || d.kind === 'listen');
  if (cfg.mix === 'type') drills = drills.filter(d => typeKinds.includes(d.kind));
  if (cfg.mix === 'hard') drills = drills.filter(d => hardKinds.includes(d.kind));
  drills = shuffle(drills);
  const target = typeof cfg.length === 'number' ? cfg.length : drills.length;
  return drills.slice(0, Math.min(target, drills.length));
}

function sectionFor(topic: GrammarTopic, drill: Drill): Section | undefined {
  return topic.sections.find(s => s.id === drill.sectionId);
}

// ── Setup screen ──
function GrammarDrillSetup({ topic, onStart, onExit }: {
  topic: GrammarTopic;
  onStart: (cfg: DrillConfig) => void;
  onExit: () => void;
}) {
  const [scope, setScope] = useState<DrillConfig['scope']>('topic');
  const [sectionId, setSectionId] = useState(topic.sections[0]?.id ?? '');
  const [length, setLength] = useState<number | 'keep'>(10);
  const [mix, setMix] = useState<DrillConfig['mix']>('all');

  return (
    <div className="gr-drill-root">
      <div className="gr-drill-bar">
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onExit}><X size={14} /> Exit</button>
        <div style={{ flex: 1, textAlign: 'center' }} className="text-eyebrow">Drill · {topic.title}</div>
        <div style={{ width: 80 }} />
      </div>
      <div className="gr-setup">
        <div className="text-eyebrow" style={{ marginBottom: 10 }}>Session</div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 36, letterSpacing: '-0.02em', marginBottom: 8 }}>Ready to drill?</h2>
        <p style={{ color: 'var(--ink-3)', marginBottom: 36, maxWidth: '44ch' }}>
          Grammar drills loop until you can produce the form. Wrong answers come back a few items later.
        </p>
        <div className="gr-setup-field">
          <label className="gr-setup-label">Scope</label>
          <div className="gr-setup-cluster">
            {(['topic', 'section', 'missed'] as const).map(s => (
              <button key={s} className={`gr-setup-btn ${scope === s ? 'is-active' : ''}`} onClick={() => setScope(s)}>
                {s === 'topic' ? 'Whole topic' : s === 'section' ? 'One section' : 'My weakest 10'}
              </button>
            ))}
          </div>
          {scope === 'section' && (
            <div className="gr-setup-cluster" style={{ marginTop: 10 }}>
              {topic.sections.map(s => (
                <button key={s.id}
                  className={`gr-setup-btn ${sectionId === s.id ? 'is-active' : ''}`}
                  onClick={() => setSectionId(s.id)}
                  style={{ fontSize: 12.5, padding: '7px 11px' }}>{s.title}</button>
              ))}
            </div>
          )}
        </div>
        <div className="gr-setup-field">
          <label className="gr-setup-label">Length</label>
          <div className="gr-setup-cluster">
            {([5, 10, 20] as const).map(n => (
              <button key={n} className={`gr-setup-btn ${length === n ? 'is-active' : ''}`} onClick={() => setLength(n)}>{n} items</button>
            ))}
            <button className={`gr-setup-btn ${length === 'keep' ? 'is-active' : ''}`} onClick={() => setLength('keep')}>Keep going</button>
          </div>
        </div>
        <div className="gr-setup-field">
          <label className="gr-setup-label">Exercise mix</label>
          <div className="gr-setup-cluster">
            {([['all', 'All'], ['mc', 'Just multiple-choice'], ['type', 'Type only'], ['hard', 'The hard ones']] as const).map(([v, l]) => (
              <button key={v} className={`gr-setup-btn ${mix === v ? 'is-active' : ''}`} onClick={() => setMix(v)}>{l}</button>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 36 }}>
          <button className="tk-btn tk-btn-accent tk-btn-lg" onClick={() => onStart({ scope, sectionId, length, mix })}>
            Begin →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Feedback ──
function DrillFeedback({ feedback, section, onNext }: {
  feedback: DrillVerdict & { drill: Drill };
  section?: Section;
  onNext: () => void;
}) {
  const [whyExpanded, setWhyExpanded] = useState(false);
  const [relatedExample, setRelatedExample] = useState<{ fi: string; en: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onNext(); }
      if (e.key === '?' || e.key === '/') { e.preventDefault(); setWhyExpanded(w => !w); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onNext]);

  const showRelated = () => {
    if (!section?.examples?.length) return;
    const e = section.examples[Math.floor(Math.random() * section.examples.length)];
    setRelatedExample(e);
  };

  return (
    <div className={`gr-feedback ${feedback.correct ? 'is-correct' : 'is-wrong'}`}>
      <div className="gr-feedback-line">
        {feedback.correct ? 'Correct' : 'Not quite'}
        {!feedback.correct && feedback.userAnswer && (
          <span style={{ marginLeft: 12, color: 'var(--ink-4)' }}>
            you wrote: <span className="mono" style={{ color: 'var(--ink-3)' }}>{feedback.userAnswer}</span>
          </span>
        )}
      </div>
      <div className="gr-feedback-answer">{feedback.expected}</div>
      {section?.grammarPattern && (
        <div className="gr-feedback-rule">
          <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>{section.title}</strong> — {section.grammarPattern}
        </div>
      )}
      {feedback.explanation && (
        <div style={{ marginTop: 8, fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5 }}>{feedback.explanation}</div>
      )}
      {whyExpanded && section && (
        <div style={{ marginTop: 12, padding: 12, background: 'var(--paper-deep)', borderRadius: 6, fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 }}>
          <div className="text-eyebrow" style={{ marginBottom: 6 }}>Explanation</div>
          {section.commonPitfalls?.[0] ?? `The form "${feedback.expected}" follows: ${section.grammarPattern}`}
        </div>
      )}
      {relatedExample && (
        <div style={{ marginTop: 12, padding: '8px 12px', background: 'var(--card)', border: '1px dashed var(--rule)', borderRadius: 6, fontSize: 13 }}>
          <span className="mono" style={{ color: 'var(--ink)' }}>{relatedExample.fi}</span>
          <span style={{ color: 'var(--ink-3)', marginLeft: 10, fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>{relatedExample.en}</span>
        </div>
      )}
      <div className="gr-feedback-actions">
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setWhyExpanded(w => !w)}>
          {whyExpanded ? 'Hide' : 'Why?'} <span className="mono" style={{ opacity: 0.5, fontSize: 10, marginLeft: 4 }}>?</span>
        </button>
        {section?.examples?.length > 0 && (
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={showRelated}>Related example</button>
        )}
        <div style={{ flex: 1 }} />
        <button className="tk-btn tk-btn-primary" onClick={onNext}>
          Got it <span className="mono" style={{ opacity: 0.5, fontSize: 10 }}>↵</span>
        </button>
      </div>
    </div>
  );
}

// ── Session ──
function GrammarDrillSession({ topic, config, onExit, onComplete }: {
  topic: GrammarTopic;
  config: DrillConfig;
  onExit: () => void;
  onComplete: (s: { topicId: string; items: number; correct: number; ms: number }) => void;
}) {
  const initialQueue = useMemo(() => buildQueue(topic, config), [topic.id, JSON.stringify(config)]);
  const [queue, setQueue] = useState(initialQueue);
  const [idx, setIdx] = useState(0);
  const [history, setHistory] = useState<(DrillVerdict & { drill: Drill })[]>([]);
  const [feedback, setFeedback] = useState<(DrillVerdict & { drill: Drill }) | null>(null);
  const [startedAt] = useState(Date.now());
  const [seenCount, setSeenCount] = useState(0);

  const current = queue[idx];
  const totalTarget = config.length === 'keep' ? Math.max(queue.length, 15) : config.length || queue.length;
  const progressPct = Math.min(100, (seenCount / totalTarget) * 100);

  useEffect(() => {
    if (!current && seenCount > 0) {
      onComplete({ topicId: topic.id, items: history.length, correct: history.filter(h => h.correct).length, ms: Date.now() - startedAt });
    }
  }, [current, seenCount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onExit(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onExit]);

  const handleSubmit = (verdict: DrillVerdict) => {
    const entry = { ...verdict, drill: current };
    setHistory(h => [...h, entry]);
    setFeedback(entry);
    try { grammarProgress.logAttempt(topic.id, current.sectionId ?? 'root', verdict.correct); } catch {}
    setSeenCount(c => c + 1);
  };

  const goNext = () => {
    const wasCorrect = feedback!.correct;
    setFeedback(null);
    if (!wasCorrect) {
      const requeued = [...queue];
      const insertAt = Math.min(idx + 4, requeued.length);
      requeued.splice(insertAt, 0, { ...current, id: current.id + '-r' });
      setQueue(requeued);
    }
    setIdx(i => i + 1);
  };

  if (!current) return null;
  const section = sectionFor(topic, current);

  return (
    <div className="gr-drill-root">
      <div className="gr-drill-bar">
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onExit}><X size={13} /> Exit</button>
        <div className="gr-drill-bar-progress"><span style={{ width: `${progressPct}%` }} /></div>
        <div className="gr-drill-bar-count">
          <span style={{ color: 'var(--ink)' }}>{seenCount}</span> / {totalTarget}
          <span style={{ marginLeft: 12, color: 'var(--ink-4)' }}>{history.filter(h => h.correct).length}✓</span>
        </div>
      </div>
      <div className="gr-drill-stage">
        <div className="gr-drill-card" key={current.id + '-' + idx}>
          {!feedback ? (
            <>
              {section && (
                <div style={{ marginBottom: 14, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  {section.title} {section.caseMarker && <span className="gr-case-pill" style={{ marginLeft: 4 }}>{section.caseMarker}</span>}
                </div>
              )}
              <GrammarDrillKind drill={current} onSubmit={handleSubmit} />
            </>
          ) : (
            <DrillFeedback feedback={feedback} section={section} onNext={goNext} />
          )}
        </div>
      </div>
    </div>
  );
}

// ── Done screen ──
function GrammarDrillDone({ summary, topic, onRunAgain, onExit }: {
  summary: { topicId: string; items: number; correct: number; ms: number };
  topic: GrammarTopic;
  onRunAgain: () => void;
  onExit: () => void;
}) {
  const accuracy = summary.items > 0 ? Math.round(100 * summary.correct / summary.items) : 0;
  const timeSec = Math.round(summary.ms / 1000);
  const mins = Math.floor(timeSec / 60);
  const secs = timeSec % 60;
  return (
    <div className="gr-drill-root">
      <div className="gr-drill-bar">
        <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={onExit}><X size={13} /> Close</button>
        <div style={{ flex: 1, textAlign: 'center' }} className="text-eyebrow">Session complete</div>
        <div style={{ width: 80 }} />
      </div>
      <div className="gr-done">
        <div className="text-eyebrow" style={{ marginBottom: 8 }}>{topic.title}</div>
        <div className="gr-done-number">{accuracy}%</div>
        <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-3)', marginTop: 8 }}>
          {accuracy >= 90 ? 'Steady as she goes.' : accuracy >= 70 ? 'Good session — a few to revisit.' : accuracy >= 50 ? 'The pattern is forming.' : 'New territory. That\'s the point.'}
        </div>
        <div className="gr-done-stats">
          <div><div className="gr-done-stat-v">{summary.items}</div><div className="gr-done-stat-l">items</div></div>
          <div><div className="gr-done-stat-v">{summary.correct}</div><div className="gr-done-stat-l">correct</div></div>
          <div><div className="gr-done-stat-v">{mins}:{String(secs).padStart(2, '0')}</div><div className="gr-done-stat-l">time</div></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 20 }}>
          <button className="tk-btn tk-btn-ghost" onClick={onExit}>Done</button>
          <button className="tk-btn tk-btn-accent" onClick={onRunAgain}>Drill again</button>
        </div>
      </div>
    </div>
  );
}

// ── Root: setup → session → done ──
export function GrammarDrill({ topic, onExit, initialConfig }: {
  topic: GrammarTopic;
  onExit: () => void;
  initialConfig?: DrillConfig | null;
}) {
  const [stage, setStage] = useState<'setup' | 'session' | 'done'>(initialConfig ? 'session' : 'setup');
  const [config, setConfig] = useState<DrillConfig | null>(initialConfig ?? null);
  const [summary, setSummary] = useState<{ topicId: string; items: number; correct: number; ms: number } | null>(null);

  return (
    <>
      {stage === 'setup' && (
        <GrammarDrillSetup topic={topic} onExit={onExit}
          onStart={cfg => { setConfig(cfg); setStage('session'); }} />
      )}
      {stage === 'session' && config && (
        <GrammarDrillSession topic={topic} config={config}
          onExit={onExit}
          onComplete={s => { setSummary(s); setStage('done'); }} />
      )}
      {stage === 'done' && summary && (
        <GrammarDrillDone summary={summary} topic={topic}
          onRunAgain={() => setStage('setup')} onExit={onExit} />
      )}
    </>
  );
}
