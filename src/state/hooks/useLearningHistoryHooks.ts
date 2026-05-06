import { useState } from "react";
import axios from "axios";
import { Card } from "@/types";

export interface HistoryItem {
    id: string;
    correctAnswers?: number;
    date: string;
    cardsStudied: number;
    quizType: 'learn' | 'review';
    randomName: string;
    deckId?: string;
}

interface QuizHistory {
    _id: string;
    cards: Card[]
}

export const useFetchHistory = (userId: string | null, deckId: any) => {
    const [history, setHistory] = useState<HistoryItem[]>([])
    const [error, setError] = useState<string | null>(null)

    const fetchHistory = async () => {
        try {
            if (userId && deckId) {
                const response = await axios.get(`/learning-history/${userId}/${deckId}`)
                setHistory(response.data.history || [])
            }
        } catch (error) {
            console.error('Error fetching learning history: ', error)
            setError('Error fetching learning history')
        }
    }
    return { history, error, fetchHistory }
}

export const useFetchAllHistory = (userId: string | null) => {
    const [history, setHistory] = useState<HistoryItem[]>([])

    const fetchHistory = async () => {
        try {
            if (userId) {
                const response = await axios.get(`/learning-history/${userId}`)
                setHistory(response.data.history || [])
            }
        } catch (error) {
            console.error('Error fetching all learning history: ', error)
        }
    }
    return { history, fetchHistory }
}

export const useFetchNextQuizDate = (userId: string | null, deckId: any) => {
    const [nextQuizDate, setNextQuizDate] = useState<Date | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const fetchNextQuizDate = async () => {
        setLoading(true)
        try {
            if (userId && deckId) {
                const response = await axios.get(`/learning-history/next-quiz-date/${userId}/${deckId}`)
                if (response.data.nextQuizDate) {
                    setNextQuizDate(new Date(response.data.nextQuizDate))
                } else {
                    setNextQuizDate(null)
                }
            }
        } catch (error) {
            console.error('Error fetching next quiz date', error)
            setError('Error fetching next quiz date')
        } finally {
            setLoading(false)
        }
    }
    return { nextQuizDate, loading, error, fetchNextQuizDate }
}

export interface HistoryPageCard {
    question: string;
    correctAnswer: string;
    correct: boolean;
}

export interface HistoryPageSession {
    id: string;
    date: string;
    deckId: string | null;
    deckName: string;
    quizType: 'learn' | 'review';
    cardsStudied: number;
    correctAnswers: number;
    randomName: string;
    cards: HistoryPageCard[];
}

export interface HistoryPageData {
    total: number;
    matching: number;
    totalCards: number;
    heatmap: Record<string, number>;
    sessions: HistoryPageSession[];
}

export const useFetchHistoryPage = (userId: string | null) => {
    const [data, setData] = useState<HistoryPageData | null>(null);
    const [loading, setLoading] = useState(false);

    const fetch = async (range: string, type: string) => {
        if (!userId) return;
        setLoading(true);
        try {
            const params = new URLSearchParams({ range });
            if (type !== 'any') params.set('type', type);
            const response = await axios.get(`/learning-history/history-page/${userId}?${params}`);
            setData(response.data);
        } catch (error) {
            console.error('Error fetching history page data:', error);
        } finally {
            setLoading(false);
        }
    };
    return { data, loading, fetch };
};

export const useFetchQuizHistory = (historyId: string) => {
    const [quizHistory, setQuizHistory] = useState<QuizHistory | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    const fetchQuizHistory = async () => {
        setLoading(true)
        try {
            const response = await axios.get(`/learning-history/${historyId}`)
            setQuizHistory(response.data)
        } catch (error) {
            console.error('Error fetching quiz history: ', error)
            setError('Error fetching quiz history')
        } finally {
            setLoading(false)
        }
    }

    return { quizHistory, error, loading, fetchQuizHistory }
}