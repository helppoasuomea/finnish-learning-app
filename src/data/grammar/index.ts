import type { GrammarTopic, TopicProgress, CatalogEntry } from './types';
import { TOPIC_TIME, TOPIC_PARTITIVE } from './topics';
import { CASE_TOPICS } from './topics-cases';
import { VERB_TOPICS } from './topics-verbs';
import { SYNTAX_TOPICS } from './topics-syntax';
import { MORPHOLOGY_TOPICS } from './topics-morphology';
import { GRAMMAR_CATALOG } from './catalog';
import axios from 'axios';

const authored: Record<string, GrammarTopic> = Object.fromEntries(
  [TOPIC_TIME, TOPIC_PARTITIVE, ...CASE_TOPICS, ...VERB_TOPICS, ...SYNTAX_TOPICS, ...MORPHOLOGY_TOPICS]
    .map(t => [t.id, t])
);

export const GRAMMAR_TOPICS: GrammarTopic[] = GRAMMAR_CATALOG.map((entry: CatalogEntry) => {
  const full = authored[entry.id];
  if (full && entry.published) return { ...entry, ...full };
  return {
    ...entry,
    id: entry.id,
    version: '0.0.0',
    language: 'fi',
    targetLanguage: 'en',
    estimatedMin: 0,
    tags: [entry.category],
    overview: {
      theme: entry.subtitle,
      grammarFocus: [],
      whyItMatters: 'Lesson coming soon.',
    },
    sections: [],
    grammarIndex: [],
    drills: [],
    sources: [],
    isStub: true,
  } as GrammarTopic;
});

export const GRAMMAR_BY_ID = Object.fromEntries(GRAMMAR_TOPICS.map(t => [t.id, t]));

export function getTopic(id: string): GrammarTopic | null {
  return GRAMMAR_BY_ID[id] || null;
}

// localStorage-backed progress store with backend sync
export const grammarProgress = {
  read(): Record<string, TopicProgress> {
    try { return JSON.parse(localStorage.getItem('toko:grammarProgress') || '{}'); }
    catch { return {}; }
  },
  write(data: Record<string, TopicProgress>): void {
    try { localStorage.setItem('toko:grammarProgress', JSON.stringify(data)); } catch {}
  },
  forTopic(topicId: string): TopicProgress {
    const all = this.read();
    return all[topicId] || {
      topicId, masteryPct: 0, attemptsTotal: 0, attemptsCorrect: 0,
      bySection: {}, status: 'available', lastStudiedAt: null,
    };
  },
  logAttempt(topicId: string, sectionId: string, correct: boolean): TopicProgress {
    const all = this.read();
    const t: TopicProgress = all[topicId] || {
      topicId, masteryPct: 0, attemptsTotal: 0, attemptsCorrect: 0,
      bySection: {}, status: 'available', lastStudiedAt: null,
    };
    t.attemptsTotal += 1;
    if (correct) t.attemptsCorrect += 1;
    const s = t.bySection[sectionId] || { seen: 0, correct: 0, masteryPct: 0 };
    s.seen += 1;
    if (correct) s.correct += 1;
    s.masteryPct = Math.round(100 * s.correct / Math.max(1, s.seen));
    t.bySection[sectionId] = s;
    t.masteryPct = Math.round(100 * t.attemptsCorrect / Math.max(1, t.attemptsTotal));
    t.lastStudiedAt = new Date().toISOString();
    t.status = t.attemptsTotal >= 10 && t.masteryPct >= 90 ? 'mastered'
             : t.attemptsTotal > 0 ? 'in-progress' : 'available';
    all[topicId] = t;
    this.write(all);
    // fire-and-forget — don't block the UI
    axios.put(`/grammar-progress/${topicId}`, t).catch(() => {});
    return t;
  },
  async syncFromServer(): Promise<void> {
    try {
      const { data } = await axios.get<Record<string, TopicProgress>>('/grammar-progress');
      // Merge: server wins on any topic it has data for
      const local = this.read();
      this.write({ ...local, ...data });
    } catch {
      // offline or unauthenticated — keep local data as-is
    }
  },
};

export type { GrammarTopic, TopicProgress, CatalogEntry };
export { TOPIC_TIME, TOPIC_PARTITIVE, GRAMMAR_CATALOG };
