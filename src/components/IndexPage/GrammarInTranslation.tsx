import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { GRAMMAR_BY_ID } from '@/data/grammar/index';
import { topicStyle } from '@/data/grammar/topic-colors';

// Display label for the suffix chip per topic ID
const TOPIC_SUFFIX_LABEL: Record<string, string> = {
  'genitive':         '-n',
  'partitive':        '-a / -ä',
  'accusative':       '-t',
  'inessive':         '-ssa / -ssä',
  'elative':          '-sta / -stä',
  'illative':         '-Vn',
  'adessive':         '-lla / -llä',
  'ablative':         '-lta / -ltä',
  'allative':         '-lle',
  'essive':           '-na / -nä',
  'translative':      '-ksi',
  'nominative':       '—',
  'time-expressions': '-lla / -na',
  'verb-tenses':      '-sin',
  'consonant-gradation': 'k/p/t',
};

interface Props {
  words: any[];
}

export const GrammarInTranslation = ({ words }: Props) => {
  const navigate = useNavigate();

  // Count occurrences per highlight topic
  const byTopic = new Map<string, number>();
  words.forEach(w => {
    if (!w.highlight) return;
    byTopic.set(w.highlight, (byTopic.get(w.highlight) || 0) + 1);
  });

  if (byTopic.size === 0) return null;

  const patterns = Array.from(byTopic.entries()).map(([topicId, count]) => ({
    topicId,
    count,
    topic: GRAMMAR_BY_ID[topicId] ?? null,
  }));

  return (
    <div className="tx-grammar-panel">
      <div className="tx-grammar-panel-head">
        <div className="tk-eyebrow" style={{ color: 'var(--tk-accent-deep)' }}>
          Grammar in this translation
        </div>
        <div style={{ fontSize: 12, color: 'var(--tk-ink-3)', marginTop: 2 }}>
          {patterns.length} pattern{patterns.length !== 1 ? 's' : ''} spotted · tap a chip to explore
        </div>
      </div>

      <div className="tx-grammar-panel-list">
        {patterns.map(({ topicId, count, topic }) => {
          const isPublished = topic && !topic.isStub;
          const suffixLabel = TOPIC_SUFFIX_LABEL[topicId] || '';
          return (
            <div key={topicId} className="tx-grammar-row" style={topicStyle(topicId)}>
              <div className="tx-grammar-aa">Aa</div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: 15,
                  color: 'var(--tk-ink)', lineHeight: 1.2,
                }}>
                  {topic?.title || topicId}
                </div>
                {!isPublished && (
                  <div style={{
                    fontSize: 11, color: 'var(--tk-ink-3)', marginTop: 2,
                    fontStyle: 'italic', fontFamily: 'var(--font-display)',
                  }}>
                    Coming soon
                  </div>
                )}
                {suffixLabel && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                    <span className="tx-grammar-chip">
                      {suffixLabel}
                      <span className="tx-grammar-chip-count"> ·{count}</span>
                    </span>
                  </div>
                )}
              </div>

              <button
                className="tk-btn tk-btn-sm tk-btn-ghost"
                disabled={!isPublished}
                onClick={() => isPublished && navigate(`/grammar/${topicId}`)}
                style={{ flexShrink: 0 }}
              >
                {isPublished
                  ? <><span>Open</span> <ArrowRight size={11} /></>
                  : 'Soon'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
