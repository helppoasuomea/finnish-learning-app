const QUEUE_KEY = 'lukea:review-queue';

export interface QueuedAnswer {
  id: string;
  cardId: string;
  deckId: string;
  grade: string;
  clientTimeIso: string;
}

export interface PrevSnapshot {
  stability: number | null;
  ease: number | null;
  lapses: number | null;
  reps: number | null;
  lastSeenAt: string | null;
  dueAt: string | null;
}

function load(): QueuedAnswer[] {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function persist(q: QueuedAnswer[]) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(q));
}

// Shared promise — all callers await the same flush, not independent ones.
let activeFlush: Promise<void> | null = null;

async function _doFlush(): Promise<void> {
  if (!navigator.onLine) return;
  try {
    while (true) {
      const pending = load();
      if (!pending.length) break;
      const succeeded = new Set<string>();
      for (const item of pending) {
        try {
          const res = await fetch('/api/review/answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cardId: item.cardId, deckId: item.deckId, grade: item.grade }),
            credentials: 'include',
          });
          // 4xx = permanent failure (card/deck not found) — remove, don't retry
          if (res.ok || (res.status >= 400 && res.status < 500)) succeeded.add(item.id);
        } catch {
          // network error — leave in queue for retry
        }
      }
      // Re-read localStorage in case enqueue() added new items during the await
      persist(load().filter(i => !succeeded.has(i.id)));
      if (succeeded.size === 0) break;
    }
  } finally {
    activeFlush = null;
  }
}

/** Flush the queue. Returns a promise that resolves when the queue is empty or a network error stops progress. */
export function flushQueue(): Promise<void> {
  if (!activeFlush) {
    activeFlush = _doFlush();
  }
  return activeFlush;
}

/** Adds a grade to the queue (deduplicating by cardId) and immediately attempts flush. */
export function enqueue(answer: Omit<QueuedAnswer, 'id'>): void {
  const q = load().filter(e => e.cardId !== answer.cardId);
  q.push({ ...answer, id: crypto.randomUUID() });
  persist(q);
  flushQueue();
}

/** Removes a pending entry for cardId (used when undoing before flush). */
export function dequeue(cardId: string): boolean {
  const q = load();
  const filtered = q.filter(e => e.cardId !== cardId);
  if (filtered.length === q.length) return false;
  persist(filtered);
  return true;
}

export function getPendingCount(): number {
  return load().length;
}

if (typeof window !== 'undefined') {
  window.addEventListener('online', () => flushQueue());
}
