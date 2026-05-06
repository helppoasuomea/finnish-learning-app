import { useMemo } from 'react';
import { Card, Deck } from '@/types';

export interface DuplicateInfo {
  deckName: string;
  deckId: string;
  isDuplicateTerm: boolean;
  definition: string;
  cardId: string;
  cardScore: number;
  reps: number;
}

export const useFindDuplicates = (cards: Card[], decks: Deck[], deckId: string, deckName: string) => {
  const duplicates = useMemo(() => {
    const result: { [key: string]: DuplicateInfo[] } = {};
    for (const card of cards) {
      const found: DuplicateInfo[] = [];
      for (const deck of decks) {
        for (const c of deck.cards) {
          if (c.userLangCard.toLowerCase() === card.userLangCard.toLowerCase() && c._id !== card._id) {
            found.push({
              deckName: deck._id === deckId ? 'This deck' : deck.deckName,
              deckId: deck._id,
              isDuplicateTerm: true,
              definition: c.engCard,
              cardId: c._id,
              cardScore: c.cardScore ?? 0,
              reps: (c as any).reps ?? 0,
            });
          }
        }
      }
      if (found.length > 0) result[card._id] = found;
    }
    return result;
  }, [cards, decks, deckId]);

  return { duplicates };
};
