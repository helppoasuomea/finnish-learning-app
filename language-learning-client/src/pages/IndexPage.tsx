import { TranslationBar } from "../components/IndexPage/TranslationBar";
import { InputBar } from "../components/IndexPage/InputBar";
import { Translation } from "../components/IndexPage/Translation";
import { WordDetails } from "../components/IndexPage/Details";
import { User } from "../components/IndexPage/User";
import { DeckInfo } from "../components/IndexPage/DeckInfo";
import { CoachMarkForIndexPage } from "../components/IndexPage/CoachMarkForIndexPage";
import useTranslation from "../state/hooks/useTranslation";
import { useState, useEffect, useContext } from "react";
import { Word, Deck } from "@/types";
import { DeckContext } from "@/contexts/DeckContext";
import { UserContext } from "@/contexts/UserContext";

export const IndexPage = () => {
    const { fromLanguage, setFromLanguage, inputText, setInputText, ready, response, handleTranslation } = useTranslation()
    const { user } = useContext(UserContext);
    const { decks } = useContext(DeckContext);
    const [showOnboarding, setShowOnboarding] = useState(false);

    // Mock data for when there's no translation or user is not logged in
    const mockWords: Word[] = [
        { id: "1", fi: "käydä", en: "to go/visit", type: "verb", original_word: "käydä", pronunciation: "käy-dä", comment: "Basic verb for visiting or going somewhere" },
        { id: "2", fi: "mennä", en: "to go", type: "verb", original_word: "mennä", pronunciation: "men-nä", comment: "Basic verb for going somewhere" },
        { id: "3", fi: "tulla", en: "to come", type: "verb", original_word: "tulla", pronunciation: "tul-la", comment: "Basic verb for coming" },
        { id: "4", fi: "koti", en: "home", type: "noun", original_word: "koti", pronunciation: "ko-ti", comment: "Place where you live" },
        { id: "5", fi: "koulu", en: "school", type: "noun", original_word: "koulu", pronunciation: "kou-lu", comment: "Educational institution" },
        { id: "6", fi: "työ", en: "work", type: "noun", original_word: "työ", pronunciation: "työ", comment: "Job or work" },
        { id: "7", fi: "kaunis", en: "beautiful", type: "adjective", original_word: "kaunis", pronunciation: "kau-nis", comment: "Something that looks beautiful" },
        { id: "8", fi: "hyvä", en: "good", type: "adjective", original_word: "hyvä", pronunciation: "hy-vä", comment: "Something that is good" },
        { id: "9", fi: "iso", en: "big", type: "adjective", original_word: "iso", pronunciation: "i-so", comment: "Something that is large" },
        { id: "10", fi: "ja", en: "and", type: "conjunction", original_word: "ja", pronunciation: "ja", comment: "Connects words or phrases" },
        { id: "11", fi: "tai", en: "or", type: "conjunction", original_word: "tai", pronunciation: "tai", comment: "Indicates choice between options" },
        { id: "12", fi: "mutta", en: "but", type: "conjunction", original_word: "mutta", pronunciation: "mut-ta", comment: "Indicates contrast" }
    ];

    const mockTranslation = "I would like to go to the beautiful school and do good work there.";

    // Mock deck data for demo purposes (using DeckContext interface structure)
    const mockDecks = [
        {
            _id: "demo-deck-1",
            deckName: "Finnish Basics",
            deckPercentage: "73",
            deckTags: ["finnish"],
            cards: [
                { _id: "card-1", engCard: "Hello", userLangCard: "Hei", cardScore: 3 },
                { _id: "card-2", engCard: "Thank you", userLangCard: "Kiitos", cardScore: 2 },
                { _id: "card-3", engCard: "Goodbye", userLangCard: "Näkemiin", cardScore: 1 },
                { _id: "card-4", engCard: "Please", userLangCard: "Kiitos", cardScore: 0 },
                { _id: "card-5", engCard: "Yes", userLangCard: "Kyllä", cardScore: 4 },
                { _id: "card-6", engCard: "No", userLangCard: "Ei", cardScore: 2 },
            ]
        },
        {
            _id: "demo-deck-2",
            deckName: "Korean Essentials",
            deckPercentage: "45",
            deckTags: ["korean"],
            cards: [
                { _id: "card-7", engCard: "Hello", userLangCard: "안녕하세요", cardScore: 2 },
                { _id: "card-8", engCard: "Thank you", userLangCard: "감사합니다", cardScore: 3 },
                { _id: "card-9", engCard: "Excuse me", userLangCard: "실례합니다", cardScore: 1 },
                { _id: "card-10", engCard: "I'm sorry", userLangCard: "죄송합니다", cardScore: 0 },
            ]
        }
    ];

    // Check if user has seen the onboarding before
    useEffect(() => {
        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
            setShowOnboarding(true);
        }
    }, []);

    // Listen for tour start events from Header
    useEffect(() => {
        const handleStartTour = () => {
            setShowOnboarding(true);
        };

        window.addEventListener('startTour', handleStartTour);
        return () => window.removeEventListener('startTour', handleStartTour);
    }, []);



    const finishOnboarding = () => {
        setShowOnboarding(false);
        localStorage.setItem('hasSeenOnboarding', 'true');
    };

    // For demo purposes, show mock data when no response or when onboarding is active
    const shouldShowMockData = !response?.sentence || showOnboarding;
    
    // Use mock decks when no user is logged in or no decks available, or during onboarding
    const shouldUseMockDecks = !user || decks.length === 0 || showOnboarding;

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col xl:flex-row gap-12 max-w-7xl mx-auto">
                    {/* Main Translation Area */}
                    <div className="flex-1 max-w-4xl mx-auto xl:mx-0">
                        <div className="space-y-6">
                            <div id="translation-bar" className="w-full">
                                <TranslationBar fromLanguage={fromLanguage} setFromLanguage={setFromLanguage} />
                            </div>
                            
                            <div id="input-bar" className="w-full">
                                <InputBar inputText={inputText} setInputText={setInputText} handleTranslation={handleTranslation} ready={ready} />
                            </div>
                            
                            {/* Show translation - either real response or mock for demo */}
                            {(response?.sentence || shouldShowMockData) && (
                                <div id="translation" className="w-full">
                                    <Translation text={response?.sentence || mockTranslation} />    
                                </div>
                            )}
                            
                            {/* Show word details - either real response or mock for demo */}
                            {(response?.words || shouldShowMockData) && (
                                <div id="word-details" className="w-full">
                                    <WordDetails words={response?.words || mockWords} />    
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Sidebar */}
                    <div className="xl:w-80 xl:flex-shrink-0">
                        <div className="space-y-6">
                            <div className="xl:hidden">
                                <div id="user-section">
                                    <User />
                                </div>
                            </div>
                            <div id="deck-info">
                                {shouldUseMockDecks ? (
                                    <DeckContext.Provider value={{ 
                                        decks: mockDecks, 
                                        setDecks: () => {}, 
                                        refreshDecks: () => {} 
                                    }}>
                                        <DeckInfo />
                                    </DeckContext.Provider>
                                ) : (
                                    <DeckInfo />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coach Mark Onboarding */}
            <CoachMarkForIndexPage 
                showOnboarding={showOnboarding} 
                onFinish={finishOnboarding} 
            />
        </div>
    )
}
