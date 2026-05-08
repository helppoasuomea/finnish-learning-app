import axios from "axios";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { UserContext } from "./UserContext";

interface Deck {
    _id: string;
    deckName: string;
    deckPercentage: string;
    deckTags: string[];
    cards: any[];
    memoryGoal?: { tier: string };
    isPublic?: boolean;
    level?: string;
    category?: string;
    description?: string;
    publicDescription?: string;
    publisherName?: string;
    saves?: number;
    updatedAt?: string;
}

// Languages recognised from deck tags
export const KNOWN_LANGUAGES: Record<string, string> = {
    Finnish:    'FI',
    Swedish:    'SV',
    Norwegian:  'NO',
    Danish:     'DA',
    Estonian:   'ET',
    Japanese:   'JA',
    Korean:     'KO',
    Chinese:    'ZH',
    Vietnamese: 'VI',
    Thai:       'TH',
    Arabic:     'AR',
    Spanish:    'ES',
    French:     'FR',
    German:     'DE',
    Italian:    'IT',
    Portuguese: 'PT',
    Russian:    'RU',
    Turkish:    'TR',
    Dutch:      'NL',
    Polish:     'PL',
}

interface DeckContextType {
    decks: Deck[]
    setDecks: React.Dispatch<React.SetStateAction<Deck[]>>;
    refreshDecks: () => void;
    languages: string[];           // unique language names found in deck tags
    selectedLanguage: string | null;
    setSelectedLanguage: (lang: string | null) => void;
}

export const DeckContext = createContext<DeckContextType>({
    decks: [],
    setDecks: () => {},
    refreshDecks: () => {},
    languages: [],
    selectedLanguage: null,
    setSelectedLanguage: () => {},
})

export const DeckContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [decks, setDecks] = useState<Deck[]>([])
    const { isAuthenticated } = useContext(UserContext);
    const [refreshKey, setRefreshKey] = useState<number>(0)
    const [selectedLanguage, setSelectedLanguageState] = useState<string | null>(() =>
        localStorage.getItem('lukea:lang') || null
    )

    useEffect(() => {
        const fetchDecks = async () => {
            try {
                const response = await axios.get<Deck[]>('/decks')
                setDecks(response.data)
            } catch (error) {
                console.error('Error fetching decks: ', error)
            }
        }
        if (isAuthenticated) {
            fetchDecks()
        }
    }, [isAuthenticated, refreshKey])

    const refreshDecks = () => {
        setRefreshKey(prevKey => prevKey + 1)
    }

    // Derive unique languages from the first tag of each deck
    const languages = useMemo(() => {
        const seen = new Set<string>()
        for (const deck of decks) {
            const firstTag = deck.deckTags?.[0]
            if (firstTag && KNOWN_LANGUAGES[firstTag]) seen.add(firstTag)
        }
        return Array.from(seen)
    }, [decks])

    // Auto-select if only one language; clear selection if language disappears
    useEffect(() => {
        if (languages.length === 1) {
            setSelectedLanguageState(languages[0])
        } else if (selectedLanguage && !languages.includes(selectedLanguage)) {
            setSelectedLanguageState(null)
        }
    }, [languages])

    const setSelectedLanguage = (lang: string | null) => {
        setSelectedLanguageState(lang)
        if (lang) localStorage.setItem('lukea:lang', lang)
        else localStorage.removeItem('lukea:lang')
    }

    return (
        <DeckContext.Provider value={{ decks, setDecks, refreshDecks, languages, selectedLanguage, setSelectedLanguage }}>
            {children}
        </DeckContext.Provider>
    )
}

export const useDeckContext = () => useContext(DeckContext)