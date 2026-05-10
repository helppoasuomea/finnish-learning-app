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
    const byScore = (a: Card, b: Card) => a.cardScore - b.cardScore;
    stillLearning.sort(byScore);
    notStudied.sort(byScore);
    completed.sort(byScore);
    
    return { stillLearning, notStudied, completed }
}