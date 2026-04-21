import { Card } from "@/types";

interface OrganizedCard {
    stillLearning: Card[]
    notStudied: Card[]
    completed: Card[]
}

export const organizeCardsByScore = (cards: Card[]): OrganizedCard => {
    const stillLearning: Card[] = [];
    const notStudied: Card[] = []
    const completed: Card[] = []

    cards.forEach((card) => {
        const reps = (card as any).reps ?? card.cardScore;
        const stability = (card as any).stability ?? card.reviewInterval ?? 1;
        if (reps === 0) {
            notStudied.push(card);
        } else if (stability >= 90) {
            completed.push(card);
        } else {
            stillLearning.push(card);
        }
    })
    const sortWithFavoritesAtTop = (a: Card, b: Card) => {
        if (a.favorite === b.favorite) {
            return a.cardScore - b.cardScore
        }
        return a.favorite ? -1 : 1
    }
    stillLearning.sort(sortWithFavoritesAtTop)
    notStudied.sort(sortWithFavoritesAtTop)
    completed.sort(sortWithFavoritesAtTop)
    
    return { stillLearning, notStudied, completed }
}