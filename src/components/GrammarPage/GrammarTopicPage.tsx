import { useState, useEffect, useContext } from 'react';
import { ArrowLeft, ArrowRight, ChevronDown, BookOpen, Eye, Bookmark } from 'lucide-react';
import { useNavigate, useParams, Navigate } from 'react-router-dom';
import type { GrammarTopic, Section } from '@/data/grammar/types';
import { grammarProgress, getTopic } from '@/data/grammar/index';
import { UserContext } from '@/contexts/UserContext';
import { formatLevelLabel } from '@/utils/levelDisplay';
import {
  MorphologyBlock, ExampleList, RelativeExamples,
  GrammarIndexLegend, SourcesBlock,
} from './GrammarMorphology';
import { GrammarDrill } from './GrammarDrill';

// ── Section block — shared by Textbook + Reference ──
function SectionBlock({ section }: { section: Section }) {
  return (
    <section className="gr-section" id={`gr-sec-${section.id}`}>
      <div className="gr-section-head">
        <div>
          <div className="gr-section-title">{section.title}</div>
          {section.question && (
            <div className="gr-section-q">
              {section.question}
              {section.questionEn && <em>· {section.questionEn}</em>}
            </div>
          )}
        </div>
        {section.caseMarker && <span className="gr-case-pill">{section.caseMarker}</span>}
      </div>
      {section.grammarPattern && <div className="gr-pattern">{section.grammarPattern}</div>}
      {section.formula && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-2)', background: 'var(--paper-deep)', padding: '8px 12px', borderRadius: 6, display: 'inline-block', margin: '4px 0 12px' }}>
          {section.formula}
        </div>
      )}
      <MorphologyBlock morphology={section.morphology} />
      <ExampleList examples={section.examples} />
      {section.relativeExamples && section.relativeExamples.length > 0 && (
        <RelativeExamples examples={section.relativeExamples} label="Relative time (last / this / next)" />
      )}
      {section.datePattern && (
        <div className="gr-special">
          <div className="gr-relative-label">{section.datePattern.label ?? 'Date'}</div>
          <div className="gr-ex-row">
            <div className="gr-ex-fi">{section.datePattern.fi}</div>
            <div className="gr-ex-en">{section.datePattern.en}</div>
          </div>
          {section.datePattern.note && <div style={{ marginTop: 4, fontSize: 12, color: 'var(--ink-3)' }}>{section.datePattern.note}</div>}
        </div>
      )}
      {section.specialNote && (
        <div className="gr-special">
          <div className="gr-relative-label">Note</div>
          <div className="gr-ex-fi">{section.specialNote.fi}</div>
          <div className="gr-ex-en">{section.specialNote.en}</div>
        </div>
      )}
      {section.verbNote && (
        <div className="gr-special">
          <div className="gr-relative-label">Verbs</div>
          <div className="gr-ex-fi">{section.verbNote.fi}</div>
          <div className="gr-ex-en">{section.verbNote.en}</div>
        </div>
      )}
      {section.commonPitfalls && section.commonPitfalls.length > 0 && (
        <div className="gr-pitfall">
          <div className="gr-pitfall-label">Common pitfall{section.commonPitfalls.length > 1 ? 's' : ''}</div>
          <ul>{section.commonPitfalls.map((p, i) => <li key={i}>{p}</li>)}</ul>
        </div>
      )}
    </section>
  );
}

// ── Textbook variation ──
function TopicTextbook({ topic, onDrill, onDrillSection }: {
  topic: GrammarTopic;
  onDrill: () => void;
  onDrillSection: (sectionId: string) => void;
}) {
  return (
    <div className="gr-topic">
      <div className="gr-topic-main">
        <div className="gr-topic-theme">{topic.overview?.theme}</div>
        {topic.overview?.grammarFocus?.length > 0 && (
          <div className="gr-focus">
            <div className="gr-focus-label">What you'll learn</div>
            <ul>{topic.overview.grammarFocus.map((f, i) => <li key={i}>{f}</li>)}</ul>
          </div>
        )}
        {topic.overview?.whyItMatters && <div className="gr-why">{topic.overview.whyItMatters}</div>}
        {topic.sections.map(s => (
          <div key={s.id}>
            <SectionBlock section={s} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -12 }}>
              <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => onDrillSection(s.id)}>
                Drill this section <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}
        <SourcesBlock sources={topic.sources} />
      </div>
      <aside className="gr-aside">
        <div className="gr-aside-card">
          <div className="text-eyebrow">In this topic</div>
          {topic.sections.map(s => (
            <a key={s.id} className="gr-toc-link" href={`#gr-sec-${s.id}`}>
              <span>{s.title}</span>
              {s.caseMarker && <span className="gr-toc-q">{s.caseMarker}</span>}
            </a>
          ))}
        </div>
        <div className="gr-aside-cta">
          <button className="tk-btn tk-btn-accent" onClick={onDrill}>
            Start drill <ArrowRight size={13} />
          </button>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', textAlign: 'center', lineHeight: 1.4 }}>
            ~{topic.estimatedMin} min · {topic.drills?.length} exercises
          </div>
        </div>
        <GrammarIndexLegend grammarIndex={topic.grammarIndex} />
      </aside>
    </div>
  );
}

// ── Discovery variation ──
function TopicDiscovery({ topic, onDrill }: { topic: GrammarTopic; onDrill: () => void }) {
  const sections = topic.sections;
  const [i, setI] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const s = sections[i];
  const atEnd = i === sections.length - 1;
  const next = () => { if (!atEnd) { setI(i + 1); setRevealed(false); } else onDrill(); };
  const prev = () => { if (i > 0) { setI(i - 1); setRevealed(true); } };

  if (!s) return null;
  return (
    <div className="gr-disc">
      <div className="gr-disc-dots">
        {sections.map((_, idx) => (
          <div key={idx} className={`gr-disc-dot ${idx < i ? 'is-done' : idx === i ? 'is-current' : ''}`} />
        ))}
      </div>
      <div className="gr-disc-card" key={s.id}>
        <div className="text-eyebrow" style={{ marginBottom: 8 }}>
          Section {i + 1} of {sections.length} · {topic.title}
        </div>
        <div className="gr-disc-prompt">{s.question || s.title}</div>
        {s.questionEn && <div className="gr-disc-prompt-en">{s.questionEn}</div>}
        <div className="gr-disc-examples">
          <div className="gr-relative-label" style={{ marginBottom: 10 }}>Notice the pattern</div>
          <ExampleList examples={s.examples.slice(0, Math.min(5, s.examples.length))} />
        </div>
        {!revealed ? (
          <div style={{ padding: '14px 0' }}>
            <div className="gr-disc-hidden">
              <div className="gr-pattern">{s.grammarPattern}</div>
            </div>
            <button className="tk-btn tk-btn-primary" onClick={() => setRevealed(true)} style={{ marginTop: 16 }}>
              Reveal the rule
            </button>
          </div>
        ) : (
          <div className="gr-disc-reveal">
            <div className="gr-relative-label">The rule</div>
            <div className="gr-pattern" style={{ marginBottom: 12 }}>{s.grammarPattern}</div>
            {s.caseMarker && <div style={{ marginBottom: 10 }}><span className="gr-case-pill">{s.caseMarker}</span></div>}
            <MorphologyBlock morphology={s.morphology} />
            {s.commonPitfalls && s.commonPitfalls.length > 0 && (
              <div className="gr-pitfall" style={{ marginTop: 8 }}>
                <div className="gr-pitfall-label">Watch out</div>
                <ul>{s.commonPitfalls.map((p, idx) => <li key={idx}>{p}</li>)}</ul>
              </div>
            )}
          </div>
        )}
        <div className="gr-disc-actions">
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={prev} disabled={i === 0}>
            <ArrowLeft size={12} /> Previous
          </button>
          <div style={{ fontSize: 11.5, color: 'var(--ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
            {revealed ? 'Next section →' : 'Tap reveal when ready'}
          </div>
          <button className="tk-btn tk-btn-accent" onClick={next} disabled={!revealed}>
            {atEnd ? 'Begin drill' : 'Next'} <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Reference variation ──
function TopicReference({ topic, onDrill, onDrillSection }: {
  topic: GrammarTopic;
  onDrill: () => void;
  onDrillSection: (sectionId: string) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpen(o => ({ ...o, [id]: !o[id] }));
  return (
    <div className="gr-ref">
      <GrammarIndexLegend grammarIndex={topic.grammarIndex} />
      <div style={{ height: 24 }} />
      <div className="gr-ref-accordion">
        {topic.sections.map(s => {
          const isOpen = !!open[s.id];
          return (
            <div key={s.id} className="gr-ref-item">
              <button className="gr-ref-btn" onClick={() => toggle(s.id)}>
                <ChevronDown size={14} style={{ transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 160ms', color: 'var(--ink-3)' }} />
                <span className="gr-ref-btn-title">{s.title}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.03em' }}>{s.question}</span>
                <span className="gr-ref-btn-pattern">
                  {s.caseMarker && <span className="gr-case-pill">{s.caseMarker}</span>}
                </span>
              </button>
              {isOpen && (
                <div className="gr-ref-body">
                  <SectionBlock section={s} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => onDrillSection(s.id)}>Drill this section →</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <SourcesBlock sources={topic.sources} />
    </div>
  );
}

// ── Stub topic page ──
function GrammarTopicStub({ topic }: { topic: GrammarTopic }) {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  return (
    <div className="gr-topic">
      <div className="gr-topic-main">
        <div className="gr-topic-theme" style={{ fontStyle: 'italic' }}>{topic.overview?.theme ?? topic.subtitle}</div>
        <div className="gr-why" style={{ marginTop: 16 }}>
          This topic is on the curriculum and will appear on the grammar map, but the full lesson — sections, examples, drills — is still being written.
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
          <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => navigate('/grammar')}>
            <ArrowLeft size={12} /> Back to grammar
          </button>
        </div>
      </div>
      <aside className="gr-aside">
        <div className="gr-aside-card">
          <div className="text-eyebrow">Status</div>
          <div style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.5, marginTop: 6 }}>
            <div><strong>Level:</strong> {formatLevelLabel(topic.level, user?.difficultyLabel)}</div>
            <div><strong>Category:</strong> {topic.category}</div>
            <div style={{ marginTop: 8, color: 'var(--ink-3)' }}>Lesson in production.</div>
          </div>
        </div>
      </aside>
    </div>
  );
}

// ── Topic page shell ──
type TopicView = 'textbook' | 'discovery' | 'reference';
interface DrillConfig { scope: string; sectionId?: string; length: number | 'keep'; mix: string; }

export function GrammarTopicPage() {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = getTopic(topicId ?? '');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  if (!topic) return <Navigate to="/grammar" replace />;
  const [view, setView] = useState<TopicView>(() => (localStorage.getItem('toko:grammarTopicView') as TopicView) ?? 'textbook');
  const [drill, setDrill] = useState<DrillConfig | 'setup' | null>(null);
  const [, forceUpdate] = useState(0);

  useEffect(() => { localStorage.setItem('toko:grammarTopicView', view); }, [view]);

  const progress = grammarProgress.forTopic(topic.id);
  const isStub = !!topic.isStub;
  const startDrill = () => setDrill('setup');
  const startDrillSection = (sectionId: string) => setDrill({ scope: 'section', sectionId, length: 10, mix: 'all' });
  const exitDrill = () => { setDrill(null); forceUpdate(x => x + 1); };

  const viewButtons: { key: TopicView; icon: React.ReactNode; label: string }[] = [
    { key: 'textbook', icon: <BookOpen size={12} />, label: 'Textbook' },
    { key: 'discovery', icon: <Eye size={12} />, label: 'Discovery' },
    { key: 'reference', icon: <Bookmark size={12} />, label: 'Reference' },
  ];

  return (
    <>
      <div className="gr-page">
        <div className="gr-topic-kicker">
          <a onClick={e => { e.preventDefault(); navigate('/grammar'); }} href="#">← Grammar</a>
          <span style={{ color: 'var(--ink-4)' }}>/</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {formatLevelLabel(topic.level, user?.difficultyLabel)} · {topic.tags?.join(' · ')}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 className="gr-topic-title">{topic.title}</h1>
            {topic.subtitle && <div className="gr-topic-sub">{topic.subtitle}</div>}
          </div>
          {!isStub ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <div className="gr-seg">
                {viewButtons.map(b => (
                  <button key={b.key} className={view === b.key ? 'is-active' : ''} onClick={() => setView(b.key)}>
                    {b.icon} {b.label}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 100 }}>
                  <div className="gr-bar"><span style={{ width: `${progress.masteryPct}%` }} /></div>
                  <div className="gr-bar-label" style={{ marginTop: 4 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, letterSpacing: '0.04em', color: 'var(--ink-3)' }}>Mastery</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--ink-2)' }}>{progress.masteryPct}%</span>
                  </div>
                </div>
                <button className="tk-btn tk-btn-accent tk-btn-sm" onClick={startDrill}>
                  Drill <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-3)', padding: '6px 10px', border: '1px dashed var(--rule)', borderRadius: 6 }}>
              Lesson coming soon
            </div>
          )}
        </div>

        <hr className="tk-hairline" style={{ margin: '4px 0 32px' }} />

        {isStub ? (
          <GrammarTopicStub topic={topic} />
        ) : (
          <>
            {view === 'textbook'  && <TopicTextbook  topic={topic} onDrill={startDrill} onDrillSection={startDrillSection} />}
            {view === 'discovery' && <TopicDiscovery topic={topic} onDrill={startDrill} />}
            {view === 'reference' && <TopicReference topic={topic} onDrill={startDrill} onDrillSection={startDrillSection} />}
          </>
        )}
      </div>

      {drill && !isStub && (
        <GrammarDrill
          topic={topic}
          initialConfig={drill === 'setup' ? null : drill as any}
          onExit={exitDrill}
        />
      )}
    </>
  );
}
