import { useDeckContext } from "@/contexts/DeckContext";
import { calculateCompletePercentage } from "@/utils/calculatePercentage";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useState } from "react";
import { getTimeStamp } from "@/utils/getTimestamp";
import { formatDistance } from "date-fns";
import { sortAndFilterDecks } from "@/utils/sortAndFilterDecks";
import { Deck } from "@/types";
import { SortableSelect } from "../AllDeckPagesComponents/SortableSelect";

export const DeckInfo = () => {
    const { decks } = useDeckContext();
    const [sortBy, setSortBy] = useState("Most cards");

    const { allLanguages, displayedDecks } = sortAndFilterDecks(decks, sortBy, true)

    if (!decks || decks.length === 0) {
        return null;
    }
    return (
        <div className="w-full space-y-6">
            {/* Header with Sort */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-800">Your Decks</h2>
                    <div className="min-w-0">
                        <SortableSelect sortBy={sortBy} setSortBy={setSortBy} allLanguages={allLanguages} />
                    </div>
                </div>
            </div>

            {/* Deck Cards */}
            <div className="space-y-4">
                {displayedDecks.map((deck: Deck) => (
                    <div key={deck._id} className="bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                        {/* Header with deck name and language indicator */}
                        <div className="bg-blue-600 p-4">
                            <h3 className="text-lg font-bold text-white truncate">
                                {deck.deckName}
                            </h3>
                        </div>
                        
                        {/* Content */}
                        <div className="p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Language</span>
                                        <span className="text-slate-800 font-semibold">
                                            {deck.deckTags[0].charAt(0).toUpperCase() + deck.deckTags[0].slice(1)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Set</span>
                                        <span className="text-slate-800 font-semibold">{deck.cards.length} cards</span>    
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Progress</span>
                                        <span className="text-slate-800 font-semibold">
                                            {calculateCompletePercentage(deck.cards)}%
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 font-medium">Created</span>
                                        <span className="text-slate-800 font-semibold text-xs">
                                            {formatDistance(getTimeStamp(deck._id), new Date(), { addSuffix: true })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="space-y-1">
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${calculateCompletePercentage(deck.cards)}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="pt-2">
                                <Link 
                                    to={`/view-decks/${deck._id}`} 
                                    data-testid={`view-details-link-${deck._id}`}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* View All Button */}
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-4">
                <Link 
                    to={'/view-all-decks'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center"
                >
                    📚 View All Your Decks
                </Link>
            </div>
        </div>
    );
};
