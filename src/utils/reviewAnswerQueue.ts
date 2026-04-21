const QUEUE_KEY = 'toko:review-queue';

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

let flushing = false;

export async function flushQueue(): Promise<void> {
  if (flushing || !navigator.onLine) return;
  const pending = load();
  if (!pending.length) return;
  flushing = true;
  const remaining: QueuedAnswer[] = [];
  for (const item of pending) {
    try {
      const res = await fetch('/api/review/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: item.cardId, deckId: item.deckId, grade: item.grade }),
        credentials: 'include',
      });
      if (!res.ok) remaining.push(item);
    } catch {
      remaining.push(item);
    }
  }
  persist(remaining);
  flushing = false;
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
