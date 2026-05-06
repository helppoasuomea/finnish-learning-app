import { useState, useMemo, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Shuffle } from 'lucide-react';
import { GRAMMAR_TOPICS, grammarProgress } from '@/data/grammar/index';
import { useGrammarSync } from '@/data/grammar/useGrammarSync';
import type { GrammarTopic } from '@/data/grammar/types';
import { UserContext } from '@/contexts/UserContext';
import { formatLevelLabel } from '@/utils/levelDisplay';

// ── Library index ─────────────────────────────────────────────────────────────

type SortKey = 'default' | 'alpha' | 'level' | 'mastery';

function GrammarLibrary() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const allProgress = grammarProgress.read();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortKey>('default');

  const rows = useMemo(() => {
    let list = [...GRAMMAR_TOPICS] as GrammarTopic[];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.overview?.theme || '').toLowerCase().includes(q) ||
        (t.tags || []).some(x => x.toLowerCase().includes(q))
      );
    }
    const mastOf = (t: GrammarTopic) => allProgress[t.id]?.masteryPct ?? 0;
    if (sort === 'alpha') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'level') list.sort((a, b) => a.level.localeCompare(b.level));
    else if (sort === 'mastery') list.sort((a, b) => mastOf(a) - mastOf(b));
    return list;
  }, [search, sort, allProgress]);

  return (
    <div>
      <div className="gr-lib-filters">
        <input
          className="tk-input"
          placeholder="Search topics, tags, themes…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ maxWidth: 340 }}
        />
        <div className="gr-seg">
          {([['default', 'Default'], ['alpha', 'A–Z'], ['level', 'Level'], ['mastery', 'Weakest first']] as const).map(([v, l]) => (
            <button key={v} className={sort === v ? 'is-active' : ''} onClick={() => setSort(v)}>{l}</button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
          {rows.length} / {GRAMMAR_TOPICS.length} topics
        </div>
      </div>
      <div className="gr-lib">
        {rows.map(t => {
          const p = allProgress[t.id];
          const masteryPct = p?.masteryPct ?? 0;
          const isMastered = p?.status === 'mastered';
          const statusText = isMastered ? 'Mastered' : masteryPct > 0 ? 'In progress' : 'Not started';
          return (
            <button
              key={t.id}
              className={`gr-lib-row${t.isStub ? ' is-locked' : ''}${isMastered ? ' is-mastered' : ''}`}
              onClick={() => !t.isStub && navigate(`/grammar/${t.id}`)}
            >
              <span className="gr-lib-level">{formatLevelLabel(t.level, user?.difficultyLabel)}</span>
              <div>
                <div className="gr-lib-title">{t.title}</div>
                <div className="gr-lib-sub">{t.subtitle}</div>
              </div>
              <div>
                <div className="gr-lib-theme">{t.overview?.theme}</div>
                <div className="gr-lib-tags">
                  {(t.tags || []).map((x, i) => (
                    <span className="gr-lib-tag" key={i}>{x}</span>
                  ))}
                </div>
              </div>
              <div className="gr-lib-mastery">
                <div className="gr-bar"><span style={{ width: `${masteryPct}%` }} /></div>
                <div className="gr-bar-label">
                  <span>{statusText}</span>
                  <span>{masteryPct}%</span>
                </div>
              </div>
              <div className="gr-lib-time">
                ~{t.estimatedMin} min
                <div style={{ color: 'var(--ink-4)', fontSize: 10.5, marginTop: 2 }}>
                  {t.sections?.length} sections · {t.drills?.length} drills
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Grammar map ───────────────────────────────────────────────────────────────

interface Rail {
  id: string;
  label: string;
  sub: string;
  match: (t: GrammarTopic) => boolean;
}

const RAILS: Rail[] = [
  { id: 'cases', label: 'Noun cases',  sub: 'declension',                    match: t => !!(t.tags?.includes('cases') && !t.tags?.includes('time')) },
  { id: 'time',  label: 'Time',        sub: 'when · duration · relative',    match: t => !!t.tags?.includes('time') },
  { id: 'verbs', label: 'Verbs',       sub: 'conjugation · tense',           match: t => !!t.tags?.includes('verbs') },
  { id: 'syntax',label: 'Syntax',      sub: 'word order · questions',        match: t => !!t.tags?.includes('syntax') },
];

function GrammarMap() {
  const navigate = useNavigate();
  const allProgress = grammarProgress.read();

  const { grouped, other } = useMemo(() => {
    const assigned = new Set<string>();
    const grp = RAILS.map(r => {
      const list = (GRAMMAR_TOPICS as GrammarTopic[]).filter(t => !assigned.has(t.id) && r.match(t));
      list.forEach(t => assigned.add(t.id));
      return { ...r, topics: list };
    }).filter(r => r.topics.length > 0);
    const rest = (GRAMMAR_TOPICS as GrammarTopic[]).filter(t => !assigned.has(t.id));
    return { grouped: grp, other: rest };
  }, []);

  const allRails = other.length
    ? [...grouped, { id: 'other', label: 'Other', sub: '', topics: other }]
    : grouped;

  return (
    <div className="gr-map">
      <div className="gr-map-caption">
        A shape of Finnish grammar. Each row is a family — click a node to open the topic.
        Faded nodes are not started; filled rings show your mastery.
      </div>
      {allRails.map(rail => (
        <div className="gr-map-rail" key={rail.id}>
          <div>
            <div className="gr-map-rail-label">{rail.label}</div>
            {rail.sub && <div className="gr-map-rail-sub">{rail.sub}</div>}
          </div>
          <div className="gr-map-nodes">
            {rail.topics.map(t => {
              const p = allProgress[t.id];
              const masteryPct = p?.masteryPct ?? 0;
              const isMastered = p?.status === 'mastered';
              return (
                <button
                  key={t.id}
                  className={`gr-map-node${isMastered ? ' is-mastered' : ''}${t.isStub ? ' is-locked' : ''}`}
                  onClick={() => !t.isStub && navigate(`/grammar/${t.id}`)}
                >
                  <div className="gr-map-node-title">{t.title}</div>
                  <div className="gr-map-node-sub">{t.subtitle}</div>
                  <div className="gr-map-node-foot">
                    <span className="gr-lib-level">{formatLevelLabel(t.level, user?.difficultyLabel)}</span>
                    <div className="gr-map-node-ring" style={{ '--pct': masteryPct } as React.CSSProperties}>
                      <span>{masteryPct}</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Grammar Index page ────────────────────────────────────────────────────────

type ViewMode = 'library' | 'map';

export function GrammarIndex() {
  useGrammarSync();
  const allProgress = grammarProgress.read();
  const [view, setView] = useState<ViewMode>(() =>
    (localStorage.getItem('toko:grammarView') as ViewMode) ?? 'library'
  );

  const topics = GRAMMAR_TOPICS as GrammarTopic[];
  const masteredCount = topics.filter(t => allProgress[t.id]?.status === 'mastered').length;
  const inProgCount = topics.filter(t => allProgress[t.id]?.status === 'in-progress').length;

  const setViewAndSave = (v: ViewMode) => {
    setView(v);
    localStorage.setItem('toko:grammarView', v);
  };

  return (
    <div className="gr-page">
      <div className="gr-page-head">
        <div>
          <div className="text-eyebrow">Grammar · Finnish</div>
          <h1 className="gr-page-title">Patterns of Finnish.</h1>
          <p className="gr-page-sub">
            Cases, verbs, time, syntax. Each topic is a short read followed by drills.
            Content is hand-authored and cited — no invented rules.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
          <div className="gr-seg">
            <button className={view === 'library' ? 'is-active' : ''} onClick={() => setViewAndSave('library')}>
              <BookOpen size={13} /> Library
            </button>
            <button className={view === 'map' ? 'is-active' : ''} onClick={() => setViewAndSave('map')}>
              <Shuffle size={13} /> Map
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.06em' }}>
            {masteredCount} mastered · {inProgCount} in progress · {topics.length - masteredCount - inProgCount} unstarted
          </div>
        </div>
      </div>

      {view === 'library' ? <GrammarLibrary /> : <GrammarMap />}
    </div>
  );
}
