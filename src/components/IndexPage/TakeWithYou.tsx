import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Check, ArrowRight } from 'lucide-react';
import { GRAMMAR_BY_ID } from '@/data/grammar/index';
import { topicStyle } from '@/data/grammar/topic-colors';

/**
 * Splits a surface form from its base form by finding the longest common prefix.
 *
 * A split is shown only when the surface form starts with a recognizable stem
 * of the lemma — defined as: the common prefix covers at least (lemma.length - 2)
 * characters. Finnish stem alternation drops at most 1–2 trailing vowels, so
 * anything shorter means the stem has transformed beyond recognition.
 *
 * sisätila  → sisätiloissa  : common=7, lemma=8, 7≥6  ✅ stem+oissa
 * vaara     → vaaran        : common=5, lemma=5, 5≥3  ✅ vaara+n
 * kehottaa  → kehotti       : common=6, lemma=8, 6≥6  ✅ kehott+i
 * Uusimaa   → Uudellamaalla : common=2, lemma=7, 2<5  ❌ show plain
 */
function splitFromBase(fi: string, base?: string): { stem: string; suffix: string } {
  if (!fi || !base || fi === base) return { stem: fi, suffix: '' };
  const fl = fi.toLowerCase();
  const bl = base.toLowerCase();
  let i = 0;
  while (i < fl.length && i < bl.length && fl[i] === bl[i]) i++;
  if (i < bl.length - 2 || i >= fi.length) return { stem: fi, suffix: '' };
  return { stem: fi.slice(0, i), suffix: fi.slice(i) };
}

function formatType(type: string | undefined): string {
  if (!type) return '';
  return type.replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase());
}

function formatDue(dueAt: string | Date | null): { label: string; tier: 'today' | 'soon' | 'later' } {
  if (!dueAt) return { label: 'start today', tier: 'today' };
  const diff = new Date(dueAt).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { label: 'due today', tier: 'today' };
  if (days === 1) return { label: 'due tomorrow', tier: 'soon' };
  if (days <= 3) return { label: `due in ${days} days`, tier: 'soon' };
  return { label: `due in ${days} days`, tier: 'later' };
}

interface Props {
  words: any[];
  savedWordDecks: Record<string, string[]>;
  langDecks: any[];
  localSavedIds: Set<string>;
  onSaveWord: (word: any) => void;
  onSaveNew: (words: any[]) => void;
}

export const TakeWithYou = ({
  words,
  savedWordDecks,
  langDecks,
  localSavedIds,
  onSaveWord,
  onSaveNew,
}: Props) => {
  const navigate = useNavigate();

  const savedWordDetails = useMemo(() => {
    const map: Record<string, { deckName: string; dueAt: string | null }> = {};
    langDecks.forEach((deck: any) => {
      (deck.cards || []).forEach((card: any) => {
        if (!card.userLangCard) return;
        const key = card.userLangCard.toLowerCase().trim();
        if (!map[key]) map[key] = { deckName: deck.deckName, dueAt: card.dueAt ?? null };
      });
    });
    return map;
  }, [langDecks]);

  const { newWords, dueWords, knownWords } = useMemo(() => {
    const newW: any[] = [], dueW: any[] = [], knownW: any[] = [];
    words.forEach(w => {
      if (w.common) { knownW.push(w); return; }
      const forms = [w.fi?.toLowerCase().trim(), w.original_word?.toLowerCase().trim()].filter(Boolean) as string[];
      const isSaved = localSavedIds.has(w.id) || forms.some(f => !!savedWordDecks[f]);
      (isSaved ? dueW : newW).push(w);
    });
    return { newWords: newW, dueWords: dueW, knownWords: knownW };
  }, [words, savedWordDecks, localSavedIds]);

  if (newWords.length + dueWords.length + knownWords.length === 0) return null;

  return (
    <div className="twy">
      {/* Header */}
      <div className="twy-head">
        <div>
          <div className="tk-eyebrow">Take with you</div>
          <div className="twy-lede">
            {newWords.length > 0
              ? <><strong className="twy-mono">{newWords.length}</strong> new for you</>
              : 'Nothing new today'}
            {dueWords.length > 0 && (
              <> <span className="twy-dot">·</span>{' '}
                <strong className="twy-mono">{dueWords.length}</strong>{' '}
                reinforce{dueWords.length === 1 ? 's' : ''} what you're learning
              </>
            )}
          </div>
        </div>
        {newWords.length > 0 && (
          <button
            className="tk-btn tk-btn-sm tk-btn-accent"
            onClick={() => onSaveNew(newWords)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, flexShrink: 0 }}
          >
            <Plus size={13} /> Save {newWords.length} new
          </button>
        )}
      </div>

      {/* NEW FOR YOU */}
      {newWords.length > 0 && (
        <div className="twy-section">
          <div className="twy-section-label">
            <span className="twy-pip twy-pip-new" />
            New for you
            <span className="twy-section-count">{newWords.length}</span>
          </div>
          <div className="twy-new-grid">
            {newWords.map(w => {
              const { stem, suffix } = splitFromBase(w.fi, w.original_word);
              const hasSplit = !!suffix;
              const topic = w.highlight ? (GRAMMAR_BY_ID[w.highlight] ?? null) : null;
              const canNavigate = topic && !topic.isStub;
              const isSaved = localSavedIds.has(w.id);
              const tStyle = topicStyle(w.highlight);

              return (
                <div key={w.id} className="twy-new-card" data-saved={isSaved ? 'true' : 'false'} style={tStyle}>
                  {hasSplit ? (
                    /* Nominal/verbal case: stem+suffix, context gloss, then dict entry */
                    <>
                      <div className="twy-morph">
                        <span className="twy-morph-stem">{stem}</span>
                        <span className="twy-morph-suffix">+{suffix}</span>
                      </div>
                      <div className="twy-gloss">{w.en}</div>
                      <div className="twy-dict">
                        {w.original_word && <span className="twy-dict-base">{w.original_word}</span>}
                        {w.type && <span className="twy-dict-type">{formatType(w.type)}</span>}
                        {(w.en_base || w.en) && (
                          <span className="twy-dict-meaning">— {w.en_base || w.en}</span>
                        )}
                      </div>
                    </>
                  ) : (
                    /* No clean split — surface form as headline, base in dict line */
                    <>
                      <div className="twy-lemma">{w.fi}</div>
                      <div className="twy-gloss">{w.en}</div>
                      <div className="twy-dict">
                        {w.original_word && w.original_word !== w.fi && (
                          <span className="twy-dict-base">{w.original_word}</span>
                        )}
                        {w.type && <span className="twy-dict-type">{formatType(w.type)}</span>}
                        {(w.en_base || w.en) && (
                          <span className="twy-dict-meaning">— {w.en_base || w.en}</span>
                        )}
                      </div>
                    </>
                  )}

                  {/* Grammar tag — shown for any word Voikko tagged */}
                  <div className="twy-tag-row">
                    {topic ? (
                      <button
                        className="twy-case-tag"
                        disabled={!canNavigate}
                        onClick={() => canNavigate && navigate(`/grammar/${w.highlight}`)}
                        title={topic.subtitle ?? ''}
                      >
                        <span className="twy-case-suffix">
                          {hasSplit ? `+${suffix}` : topic.title.split(' ')[0]}
                        </span>
                        <span className="twy-case-label">{topic.title}</span>
                      </button>
                    ) : (
                      <span className="twy-type">{formatType(w.type)}</span>
                    )}
                  </div>

                  <button
                    className={`twy-save${isSaved ? ' is-saved' : ''}`}
                    onClick={() => !isSaved && onSaveWord(w)}
                    aria-label={isSaved ? 'Saved' : 'Save this word'}
                  >
                    {isSaved
                      ? <><Check size={11} /> Saved</>
                      : <><Plus size={11} /> Save</>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALREADY LEARNING */}
      {dueWords.length > 0 && (
        <div className="twy-section">
          <div className="twy-section-label">
            <span className="twy-pip twy-pip-due" />
            Already learning
            <span className="twy-section-count">{dueWords.length}</span>
            <span className="twy-section-aside">this sentence reinforces them</span>
          </div>
          <div className="twy-due-list">
            {dueWords.map(w => {
              const key = (w.fi || w.original_word || '').toLowerCase().trim();
              const origKey = (w.original_word || '').toLowerCase().trim();
              const details = savedWordDetails[key] ?? (origKey && origKey !== key ? savedWordDetails[origKey] : null);
              const deckName = details?.deckName ?? savedWordDecks[key]?.[0] ?? (origKey ? savedWordDecks[origKey]?.[0] : null) ?? null;
              const due = formatDue(details?.dueAt ?? null);
              return (
                <div key={w.id} className="twy-due-row" data-tier={due.tier} style={topicStyle(w.highlight)}>
                  <span className="twy-due-fi">{w.fi}</span>
                  <span className="twy-due-en">{w.en}</span>
                  {deckName && <span className="twy-due-deck">in <em>{deckName}</em></span>}
                  <span className="twy-due-when" data-tier={due.tier}>
                    <span className="twy-due-dot" />
                    {due.label}
                  </span>
                  <button className="twy-due-action" onClick={() => navigate('/review')}>
                    Review <ArrowRight size={10} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALREADY KNOWN */}
      {knownWords.length > 0 && (
        <div className="twy-known">
          <span className="twy-pip twy-pip-known" />
          <span className="twy-known-text">
            <strong>{knownWords.length}</strong> already known —{' '}
            {knownWords.slice(0, 6).map((w: any, i: number) => (
              <span key={w.id || i}>
                <em>{w.fi}</em>{i < Math.min(knownWords.length, 6) - 1 ? ', ' : ''}
              </span>
            ))}
            {knownWords.length > 6 && <>, +{knownWords.length - 6} more</>}
          </span>
        </div>
      )}
    </div>
  );
};
