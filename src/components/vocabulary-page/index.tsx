import { DeckContext } from "@/contexts/DeckContext"
import { useContext, useEffect, useMemo, useState } from "react"
import { Deck, ChangeEvent } from "@/types"
import { useDebounce } from "@uidotdev/usehooks"
import { Search } from "lucide-react"

function ScoreDots({ score }: { score: number }) {
    return (
        <div className="vc-dots">
            {Array.from({ length: 5 }, (_, i) => (
                <span key={i} className={`vc-dot${i < score ? " is-filled" : ""}`} />
            ))}
        </div>
    )
}

function highlight(text: string, term: string) {
    if (!term) return <>{text}</>
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'))
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === term.toLowerCase()
                    ? <mark key={i} className="vc-highlight">{part}</mark>
                    : part
            )}
        </>
    )
}

export const VocabularyPage = () => {
    const { decks } = useContext(DeckContext)
    const [searchTerm, setSearchTerm] = useState('')
    const debouncedSearch = useDebounce(searchTerm, 300)

    const totalCards = useMemo(
        () => decks.reduce((s: number, d: Deck) => s + d.cards.length, 0),
        [decks]
    )

    const allWords = useMemo(() => {
        const words: { word: string; translation: string; deckName: string; score: number }[] = []
        for (const deck of decks) {
            for (const card of deck.cards) {
                words.push({
                    word: card.userLangCard,
                    translation: card.engCard,
                    deckName: deck.deckName,
                    score: card.cardScore ?? 0,
                })
            }
        }
        return words.sort((a, b) => a.word.localeCompare(b.word))
    }, [decks])

    const filtered = useMemo(() => {
        if (!debouncedSearch) return allWords
        const q = debouncedSearch.toLowerCase()
        return allWords.filter(
            w => w.word.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q)
        )
    }, [allWords, debouncedSearch])

    return (
        <div className="tk-page">
            {/* Header */}
            <div style={{ marginBottom: 28 }}>
                <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Vocabulary</div>
                <h1 className="tk-page-title">Every word, everywhere.</h1>
                <p style={{ color: "var(--tk-ink-3)", fontSize: 14, marginTop: 6 }}>
                    {totalCards} cards across {decks.length} {decks.length === 1 ? "shelf" : "shelves"}.
                </p>
            </div>

            {/* Search */}
            <div className="vc-search-wrap">
                <Search size={15} className="vc-search-icon" />
                <input
                    className="vc-search"
                    type="text"
                    placeholder="Search across all words..."
                    value={searchTerm}
                    onChange={(e: ChangeEvent) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Word list */}
            <div className="vc-list">
                {filtered.length === 0 ? (
                    <div className="vc-empty">
                        {debouncedSearch ? `No words matching "${debouncedSearch}"` : "No words yet — add cards to a deck to see them here."}
                    </div>
                ) : (
                    filtered.map((w, i) => (
                        <div key={i} className="vc-row">
                            <span className="vc-word">{highlight(w.word, debouncedSearch)}</span>
                            <span className="vc-translation">{highlight(w.translation, debouncedSearch)}</span>
                            <span className="vc-deck-tag">{w.deckName}</span>
                            <ScoreDots score={w.score} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
