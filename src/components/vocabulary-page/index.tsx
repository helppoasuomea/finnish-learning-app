import { DeckContext } from "@/contexts/DeckContext"
import { useContext, useMemo, useState } from "react"
import { Deck, ChangeEvent } from "@/types"
import { useDebounce } from "@uidotdev/usehooks"
import { Search } from "lucide-react"
import { MEMORY_SHELVES } from "@/utils/srs"

// ── Stage badge ───────────────────────────────────────────────────────────────

const PHASE_STYLE: Record<string, { color: string; bg: string; border: string }> = {
    seed:    { color: "var(--tk-ink-3)",              bg: "var(--tk-paper-deep)",                          border: "var(--tk-rule)" },
    sprout:  { color: "oklch(48% 0.13 128)",          bg: "oklch(96% 0.04 128)",                           border: "oklch(88% 0.07 128)" },
    sapling: { color: "oklch(42% 0.14 150)",          bg: "oklch(96% 0.04 150)",                           border: "oklch(87% 0.07 150)" },
    tree:    { color: "oklch(36% 0.13 168)",          bg: "oklch(95% 0.04 168)",                           border: "oklch(86% 0.07 168)" },
}

function StageLabel({ reps, stability }: { reps: number; stability: number }) {
    const shelf = MEMORY_SHELVES.find(s => s.filter({ reps, stability })) ?? MEMORY_SHELVES[0]
    const style = PHASE_STYLE[shelf.phase]
    return (
        <span className="vc-stage" style={{ color: style.color, background: style.bg, borderColor: style.border }}>
            {shelf.label}
        </span>
    )
}

// ── Cloze word display ────────────────────────────────────────────────────────

function formatWord(word: string, cardKind?: string, comment?: string): string {
    if (cardKind !== "cloze" || !word.includes("___")) return word
    const answers = (comment ?? "").split(",").map(a => a.trim()).filter(Boolean)
    let idx = 0
    return word.replace(/___/g, () => {
        const ans = answers[idx++]
        return ans ? `(${ans})` : "( )"
    })
}

// ── Search highlight ──────────────────────────────────────────────────────────

function highlight(text: string, term: string) {
    if (!term) return <>{text}</>
    const parts = text.split(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"))
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

// ── Page ──────────────────────────────────────────────────────────────────────

export const VocabularyPage = () => {
    const { decks } = useContext(DeckContext)
    const [searchTerm, setSearchTerm] = useState("")
    const debouncedSearch = useDebounce(searchTerm, 300)

    const totalCards = useMemo(
        () => decks.reduce((s: number, d: Deck) => s + d.cards.length, 0),
        [decks]
    )

    const allWords = useMemo(() => {
        const words: {
            word: string
            displayWord: string
            translation: string
            deckName: string
            reps: number
            stability: number
        }[] = []
        for (const deck of decks) {
            for (const card of deck.cards) {
                const word = card.userLangCard
                const displayWord = formatWord(word, card.cardKind, card.comment)
                words.push({
                    word,
                    displayWord,
                    translation: card.engCard,
                    deckName: deck.deckName,
                    reps: card.reps ?? 0,
                    stability: card.stability ?? 0,
                })
            }
        }
        return words.sort((a, b) => a.word.localeCompare(b.word))
    }, [decks])

    const filtered = useMemo(() => {
        if (!debouncedSearch) return allWords
        const q = debouncedSearch.toLowerCase()
        return allWords.filter(
            w => w.displayWord.toLowerCase().includes(q) || w.translation.toLowerCase().includes(q)
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
                            <span className="vc-word">{highlight(w.displayWord, debouncedSearch)}</span>
                            <span className="vc-translation">{highlight(w.translation, debouncedSearch)}</span>
                            <span className="vc-deck-tag">{w.deckName}</span>
                            <StageLabel reps={w.reps} stability={w.stability} />
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
