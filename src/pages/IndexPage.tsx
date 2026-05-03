import { InputBar } from "../components/IndexPage/InputBar";
import useTranslation from "../state/hooks/useTranslation";
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useTranslationHover } from "@/contexts/TranslationHoverContext";
import { useLocation, useNavigate } from "react-router-dom";
import { TranslationHoverProvider } from "@/contexts/TranslationHoverContext";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { useDeckContext } from "@/contexts/DeckContext";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, BookOpen, Plus, Check, X, ExternalLink } from "lucide-react";
import { GRAMMAR_BY_ID } from "@/data/grammar/index";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";

const ConfidenceRing = ({ value }: { value: number }) => {
    const r = 11;
    const circ = 2 * Math.PI * r;
    const fill = (value / 100) * circ;
    return (
        <svg width="26" height="26" viewBox="0 0 26 26" style={{ flexShrink: 0 }}>
            <circle cx="13" cy="13" r={r} fill="none" stroke="var(--tk-accent)" strokeOpacity="0.2" strokeWidth="2.5" />
            <circle cx="13" cy="13" r={r} fill="none" stroke="var(--tk-accent)" strokeWidth="2.5"
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round"
                transform="rotate(-90 13 13)" />
        </svg>
    );
};

const DeckProgressRing = ({ value }: { value: number | string }) => {
    const pct = Math.min(parseFloat(String(value)) || 0, 100);
    const r = 16, circ = 2 * Math.PI * r, fill = (pct / 100) * circ;
    return (
        <svg width="40" height="40" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
            <circle cx="20" cy="20" r={r} fill="none" stroke="var(--tk-rule)" strokeWidth="2.5" />
            <circle cx="20" cy="20" r={r} fill="none" stroke="var(--tk-accent)" strokeWidth="2.5"
                strokeDasharray={`${fill} ${circ}`} strokeLinecap="round" transform="rotate(-90 20 20)" />
            <text x="20" y="20" dominantBaseline="middle" textAnchor="middle"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 600, fill: 'var(--tk-ink-2)' }}>
                {Math.round(pct)}
            </text>
        </svg>
    );
};

const relativeTime = (date?: string | Date) => {
    if (!date) return '';
    const diff = Date.now() - new Date(date).getTime();
    const m = Math.floor(diff / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24), w = Math.floor(d / 7);
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    if (d === 1) return 'yesterday';
    if (d < 7) return `${d}d ago`;
    return `${w}w ago`;
};

const timeOfDay = () => {
    const h = new Date().getHours();
    return h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening';
};

const IndexPageContent = () => {
    const { fromLanguage, setFromLanguage, inputText, setInputText, ready, isStreaming, validationError, response, handleTranslationStream, refreshResponseFromStorage } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { decks } = useDeckContext();
    const { user } = useContext(UserContext);
    const { toast } = useToast();
    const { hoveredFlashcardFi } = useTranslationHover();
    const [createFlashcardsOpen, setCreateFlashcardsOpen] = useState(false);
    const [selectedDeckId, setSelectedDeckId] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [wordsToSave, setWordsToSave] = useState<any[] | null>(null);
    const [localSavedIds, setLocalSavedIds] = useState<Set<string>>(new Set());
    const [hideCommon, setHideCommon] = useState(true);
    const lastAutoSavedSentenceRef = useRef<string | null>(null);
    const wordDetailsRef = useRef<HTMLDivElement>(null);


    useEffect(() => {
        const state = location.state as any;
        if (state?.fromSavedSentence && state.originalText) {
            if (state.fromLanguage) setFromLanguage(state.fromLanguage);
            setInputText(state.originalText);
            refreshResponseFromStorage();
            navigate(location.pathname, { replace: true, state: {} });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const original = (response as any)?.originalText;
        if (original && typeof original === 'string' && inputText.trim() === '') {
            setInputText(original);
        }
    }, [response, inputText, setInputText]);

    const handleSave = async () => {
        if (!selectedDeckId) return;
        const sourceWords = wordsToSave ?? response?.words;
        if (!sourceWords || sourceWords.length === 0) return;

        setSaving(true);
        try {
            const defaultSaveAs = (user?.flashcardWordForm as 'original' | 'base') === 'base' ? 'base' : 'original';
            const toSave = sourceWords
                .map((word: any) => {
                    const isBase = defaultSaveAs === 'base';
                    return { engCard: isBase ? (word.en_base || word.en) : word.en, userLangCard: isBase ? word.original_word : word.fi };
                })
                .filter((w: any) => w.engCard?.trim() && w.userLangCard?.trim());

            const result = await axios.post(`/decks/${selectedDeckId}/save-all`, { words: toSave });
            toast({ title: "Saved!", description: `${result.data.added} flashcard${result.data.added !== 1 ? 's' : ''} added to your deck.` });

            // Mark saved IDs locally
            sourceWords.forEach((w: any) => { if (w.id) setLocalSavedIds(s => new Set([...s, w.id])); });

            setCreateFlashcardsOpen(false);
            setSelectedDeckId("");
            setWordsToSave(null);

            if (!wordsToSave) {
                setInputText("");
                window.location.reload();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to save words. Please try again.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const openSaveWord = (word: any) => {
        setWordsToSave([word]);
        setCreateFlashcardsOpen(true);
    };

    const openSaveAll = () => {
        setWordsToSave(null);
        setCreateFlashcardsOpen(true);
    };

    const filteredDecks = decks.filter(deck =>
        deck.deckTags && deck.deckTags.length > 0 &&
        deck.deckTags[0].toLowerCase() === fromLanguage.toLowerCase()
    );

    const savedWordDecks = useMemo(() => {
        const map: Record<string, string[]> = {};
        filteredDecks.forEach((deck: any) => {
            (deck.cards || []).forEach((card: any) => {
                if (!card.userLangCard) return;
                const key = String(card.userLangCard).toLowerCase().trim();
                if (!map[key]) map[key] = [];
                if (!map[key].includes(deck.deckName)) map[key].push(deck.deckName);
            });
        });
        return map;
    }, [filteredDecks]);

    const savedWordKeys = useMemo(() => new Set<string>(Object.keys(savedWordDecks)), [savedWordDecks]);

    const isWordSaved = (word: any) => {
        if (localSavedIds.has(word.id)) return true;
        const fi = word.fi?.toLowerCase().trim();
        const orig = word.original_word?.toLowerCase().trim();
        return (fi && savedWordKeys.has(fi)) || (orig && savedWordKeys.has(orig));
    };

    // Auto-save translated sentence
    useEffect(() => {
        const autoSave = async () => {
            if (!user || !response?.sentence) return;
            if (lastAutoSavedSentenceRef.current === response.sentence) return;
            const originalText = (response as any)?.originalText?.trim?.() || inputText.trim();
            if (!originalText) return;
            lastAutoSavedSentenceRef.current = response.sentence;

            let wordsSavedCount = 0;
            if (Array.isArray(response.words) && savedWordKeys.size > 0) {
                for (const word of response.words as any[]) {
                    const forms = [word.fi?.toLowerCase?.().trim(), word.original_word?.toLowerCase?.().trim()].filter(Boolean) as string[];
                    if (forms.some(f => savedWordKeys.has(f))) wordsSavedCount++;
                }
            }
            try {
                await axios.post('/saved-sentences', {
                    originalText, translatedText: response.sentence, fromLanguage, toLanguage: 'English', wordsSavedCount, responsePayload: response
                });
            } catch {
                if (lastAutoSavedSentenceRef.current === response.sentence) lastAutoSavedSentenceRef.current = null;
            }
        };
        autoSave();
    }, [user, response, inputText, fromLanguage, savedWordKeys]);

    useEffect(() => {
        if (hoveredFlashcardFi && wordDetailsRef.current) {
            wordDetailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [hoveredFlashcardFi]);

    const activeWords = response?.words || [];
    const activeSentence = response?.sentence;
    const showOutput = !!(activeSentence);
    const greeting = timeOfDay();
    const userName = user?.name || user?.username || '';
    const firstName = userName.split(' ')[0];

    const wordsForDisplay = hideCommon
        ? activeWords.filter((w: any) => !w.common)
        : activeWords;

    const commonCount = activeWords.filter((w: any) => w.common).length;
    const savedCount = activeWords.filter((w: any) => isWordSaved(w)).length;

    return (
        <div className="min-h-screen bg-tk-paper">
            <div className="max-w-screen-xl mx-auto px-6 py-8 md:py-12">

                {/* Page header */}
                <div className="tk-page-header mb-8">
                    <div>
                        <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Translate · Shelf 01</div>
                        <h1 className="tk-page-title">
                            Good {greeting}{firstName ? `, ${firstName}` : ''}.
                        </h1>
                        <p style={{ color: 'var(--tk-ink-3)', fontSize: 16, marginTop: 6, fontFamily: 'var(--font-display)', fontStyle: 'italic' }}>
                            A sentence in, flashcards out. Study what you're already reading.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button
                            className="tk-btn tk-btn-ghost"
                            onClick={() => navigate('/saved-sentences')}
                            style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                        >
                            <BookOpen size={14} />
                            Saved sentences
                        </button>
                    </div>
                </div>

                {/* Two-column stage */}
                <div className="tx-stage">
                    {/* Left column */}
                    <div>
                        <InputBar
                            inputText={inputText}
                            setInputText={setInputText}
                            handleTranslation={handleTranslationStream}
                            ready={ready}
                            highlighted={false}
                            isStreaming={isStreaming}
                            currentWords={response?.words}
                            currentWordIndex={-1}
                            confidence={response?.confidence}
                            confidenceDetails={response?.confidenceDetails}
                            onRerun={handleTranslationStream}
                            onClear={() => {
                                localStorage.removeItem('response');
                                setInputText('');
                                setLocalSavedIds(new Set());
                                refreshResponseFromStorage();
                            }}
                            fromLanguage={fromLanguage}
                            setFromLanguage={setFromLanguage}
                        />

                        {/* Validation error */}
                        {validationError && (
                            <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--tk-paper-deep)', border: '1px solid var(--tk-rule)', borderRadius: 'var(--r-md)', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <span style={{ color: '#C85C3C', fontFamily: 'var(--font-mono)', fontSize: 12, marginTop: 1 }}>!</span>
                                <p style={{ fontSize: 13, color: 'var(--tk-ink-2)', margin: 0 }}>{validationError}</p>
                            </div>
                        )}

                        {/* Streaming loader */}
                        {isStreaming && !response?.sentence && (
                            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--tk-accent)', animation: 'pulse 1s infinite' }} />
                                <span style={{ fontSize: 13, color: 'var(--tk-ink-3)', fontFamily: 'var(--font-mono)' }}>Translating…</span>
                            </div>
                        )}

                        {/* Output card */}
                        {showOutput && (
                            <div className="tx-output-card tk-fade-up" ref={wordDetailsRef} style={{ marginTop: 16 }}>

                                {/* Sentence + confidence */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 12 }}>
                                    <div style={{ flex: 1 }}>
                                        <div className="tx-sentence-label">
                                            Your sentence · {activeWords.length} word{activeWords.length !== 1 ? 's' : ''}
                                        </div>
                                        <div className="tx-output-text" style={{ fontSize: activeWords.length > 15 ? 22 : 26 }}>
                                            {activeSentence}
                                        </div>
                                    </div>
                                    {response?.confidence != null && (
                                        <div className="tx-confidence-pill">
                                            <ConfidenceRing value={response.confidence} />
                                            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{response.confidence}</span>
                                            <span style={{ opacity: 0.6 }}>confident</span>
                                        </div>
                                    )}
                                </div>

                                {/* Summary strip */}
                                {activeWords.length > 8 && (
                                    <div className="tx-summary-strip">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--tk-ink-3)' }}>
                                            <span className="tx-summary-stat">{wordsForDisplay.length}</span> notable
                                            <span style={{ opacity: 0.4, margin: '0 4px' }}>·</span>
                                            <span className="tx-summary-stat">{commonCount}</span> common
                                            <span style={{ opacity: 0.4, margin: '0 4px' }}>·</span>
                                            <span className="tx-summary-stat">{savedCount}</span> saved
                                        </div>
                                        <div style={{ flex: 1 }} />
                                        <button
                                            className={`tx-summary-btn${hideCommon ? ' is-active' : ''}`}
                                            onClick={() => setHideCommon(h => !h)}
                                        >
                                            {hideCommon ? 'Show common' : 'Hide common'}
                                        </button>
                                    </div>
                                )}

                                {/* Interlinear display */}
                                {(isStreaming && response?.sentence && !response?.words?.length) ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 0' }}>
                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tk-accent)', animation: 'pulse 1s infinite' }} />
                                        <span style={{ fontSize: 12.5, color: 'var(--tk-ink-3)', fontFamily: 'var(--font-mono)' }}>Analysing words…</span>
                                    </div>
                                ) : (
                                    <div className="tx-interlinear">
                                        {activeWords.map((w: any, i: number) => {
                                            const hide = hideCommon && w.common;
                                            const saved = isWordSaved(w);
                                            return (
                                                <Popover key={w.id || i}>
                                                    <PopoverTrigger asChild>
                                                        <span
                                                            className="tx-il-word"
                                                            data-common={w.common ? 'true' : 'false'}
                                                            data-saved={saved ? 'true' : 'false'}
                                                            data-highlight={w.highlight ? 'true' : 'false'}
                                                        >
                                                            {w.fi}
                                                            {!hide && <span className="tx-il-gloss">{(w.gloss || w.en).replace(/\s*\([^)]*\)/g, '').trim()}</span>}
                                                        </span>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="p-0"
                                                        style={{ width: 272, background: 'var(--tk-card)', border: '1px solid var(--tk-rule)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
                                                        align="start"
                                                        sideOffset={8}
                                                    >
                                                        <div style={{ padding: 14 }}>
                                                            <div className="tx-peek-head">
                                                                <div className="tx-peek-seal">{w.fi?.[0]?.toUpperCase()}</div>
                                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                                    <div className="tx-peek-fi">{w.fi}</div>
                                                                    <div className="tx-peek-en">{w.en}</div>
                                                                </div>
                                                            </div>
                                                            {w.comment && <div className="tx-peek-note">{w.comment}</div>}
                                                            {/* Morphology badge — Tier 2/4 output */}
                                                            {(w.lemma || (w.features && w.features.length > 0)) && (
                                                                <div className="tx-morph-badge">
                                                                    {w.lemma && <span className="tx-morph-lemma">{w.lemma}</span>}
                                                                    {w.features && w.features.length > 0 && (
                                                                        <span className="tx-morph-features">{w.features.join(' · ')}</span>
                                                                    )}
                                                                </div>
                                                            )}
                                                            {/* Lesson link — Tier 3/4 highlight */}
                                                            {w.highlight && GRAMMAR_BY_ID[w.highlight] && (
                                                                <button
                                                                    className="tx-lesson-link"
                                                                    onClick={() => navigate(`/grammar/${w.highlight}`)}
                                                                >
                                                                    <ExternalLink size={11} />
                                                                    {GRAMMAR_BY_ID[w.highlight].title}
                                                                </button>
                                                            )}
                                                            <div className="tx-peek-meta">
                                                                <span>{w.type}</span>
                                                                {w.original_word && w.original_word !== w.fi && (
                                                                    <><span style={{ opacity: 0.4 }}>·</span><span>base: {w.original_word}</span></>
                                                                )}
                                                                {w.pronunciation && (
                                                                    <><span style={{ opacity: 0.4 }}>·</span><span>{w.pronunciation}</span></>
                                                                )}
                                                            </div>
                                                            <div className="tx-peek-actions">
                                                                <PopoverClose asChild>
                                                                    <button
                                                                        className={`tk-btn tk-btn-sm ${saved ? 'tk-btn-ghost' : 'tk-btn-accent'}`}
                                                                        style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'center' }}
                                                                        onClick={() => !saved && openSaveWord(w)}
                                                                        disabled={saved}
                                                                    >
                                                                        {saved ? <><Check size={12} /> Saved</> : <><Plus size={12} /> Save to deck…</>}
                                                                    </button>
                                                                </PopoverClose>
                                                            </div>
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                            );
                                        })}
                                        <span className="tx-il-punct">.</span>
                                    </div>
                                )}

                                {/* Word grid header */}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 10 }}>
                                    <div className="tk-eyebrow">
                                        Words in this sentence · {wordsForDisplay.length}
                                    </div>
                                    {wordsForDisplay.length > 0 && (
                                        <button
                                            className="tk-btn tk-btn-sm tk-btn-accent"
                                            onClick={openSaveAll}
                                            style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                                        >
                                            <Plus size={12} />
                                            Save {wordsForDisplay.length} to deck
                                        </button>
                                    )}
                                </div>

                                {/* Word cards grid */}
                                <div className="tx-word-grid">
                                    {wordsForDisplay.map((w: any, i: number) => {
                                        const saved = isWordSaved(w);
                                        return (
                                            <div
                                                key={w.id || i}
                                                className="tx-word-card"
                                                data-saved={saved ? 'true' : 'false'}
                                            >
                                                <div className="tx-word-seal">
                                                    {w.fi?.[0]?.toUpperCase() || '?'}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div className="tx-word-fi">{w.fi}</div>
                                                    <div className="tx-word-en">{w.en}</div>
                                                    <div className="tx-word-type">{w.type}{w.pronunciation ? ` · ${w.pronunciation}` : ''}</div>
                                                </div>
                                                <button
                                                    className={`tx-word-add${saved ? ' is-saved' : ''}`}
                                                    onClick={() => !saved && openSaveWord(w)}
                                                    title={saved ? 'Already saved' : 'Save to deck'}
                                                >
                                                    {saved ? <Check size={12} /> : <Plus size={12} />}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Hidden common words note */}
                                {hideCommon && commonCount > 0 && (
                                    <div style={{ marginTop: 16, padding: '10px 14px', background: 'var(--tk-paper-deep)', borderRadius: 'var(--r-md)', fontSize: 12.5, color: 'var(--tk-ink-4)', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                                        + {commonCount} common word{commonCount !== 1 ? 's' : ''} hidden. {' '}
                                        <button
                                            onClick={() => setHideCommon(false)}
                                            style={{ color: 'var(--tk-accent)', background: 'transparent', fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontSize: 12 }}
                                        >
                                            Show
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Right aside — shown when there's a response */}
                    {showOutput && response && (
                        <div className="tx-aside">
                            {/* Confidence breakdown */}
                            {response.confidenceDetails && (
                                <div className="tx-aside-card">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                        <h3>Translation confidence</h3>
                                        {response.confidence != null && (
                                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, color: 'var(--tk-accent)', fontWeight: 500 }}>
                                                {response.confidence}
                                            </span>
                                        )}
                                    </div>
                                    {Object.entries(response.confidenceDetails)
                                        .filter(([k]) => k !== 'concerns')
                                        .map(([k, v]) => (
                                            <div key={k} className="tx-confidence-bar">
                                                <div className="tx-confidence-bar-label">{k}</div>
                                                <div className="tx-confidence-bar-track">
                                                    <div className="tx-confidence-bar-fill" style={{ width: `${v}%` }} />
                                                </div>
                                                <div className="tx-confidence-bar-val">{v as number}</div>
                                            </div>
                                        ))}
                                    {(response.confidenceDetails as any).concerns?.length > 0 && (
                                        <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--tk-rule-soft)' }}>
                                            <div className="tk-eyebrow" style={{ marginBottom: 6 }}>Notes</div>
                                            {(response.confidenceDetails as any).concerns.map((c: string, i: number) => (
                                                <p key={i} style={{ fontSize: 12.5, color: 'var(--tk-ink-2)', lineHeight: 1.5, margin: '0 0 6px', fontStyle: 'italic', fontFamily: 'var(--font-display)' }}>
                                                    {c}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* How to read */}
                            <div className="tx-aside-card">
                                <h3>How to read this</h3>
                                <p style={{ fontSize: 13, color: 'var(--tk-ink-2)', lineHeight: 1.55, margin: 0 }}>
                                    Hover over words in the input to highlight them. Click <em style={{ fontFamily: 'var(--font-display)' }}>+</em> on any card to save it as a flashcard, or use <em style={{ fontFamily: 'var(--font-display)' }}>Save all</em> for the whole sentence.
                                </p>
                            </div>

                            {/* Shortcuts */}
                            <div className="tx-aside-card" style={{ background: 'var(--tk-paper-deep)' }}>
                                <div className="tk-eyebrow" style={{ marginBottom: 8 }}>Shortcut</div>
                                <div style={{ fontSize: 13, color: 'var(--tk-ink-2)', lineHeight: 1.5 }}>
                                    Press{' '}
                                    <kbd style={{ padding: '2px 6px', background: 'var(--tk-card)', border: '1px solid var(--tk-rule)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
                                        ⌘ Enter
                                    </kbd>
                                    {' '}to translate instantly.
                                </div>
                            </div>

                            {/* Save all shortcut */}
                            {wordsForDisplay.length > 0 && (
                                <button
                                    className="tk-btn tk-btn-accent"
                                    onClick={openSaveAll}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                                >
                                    <Plus size={14} />
                                    Save {wordsForDisplay.length} words to deck
                                    <ArrowRight size={13} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Save dialog */}
            <Dialog open={createFlashcardsOpen} onOpenChange={(open) => { setCreateFlashcardsOpen(open); if (!open) { setWordsToSave(null); setSelectedDeckId(''); } }}>
                <DialogContent className="p-0 gap-0 overflow-hidden" style={{ maxWidth: 520, borderRadius: 16, border: '1px solid var(--tk-rule)' }}>
                    <DialogTitle className="sr-only">Save to a deck</DialogTitle>

                    {/* Header */}
                    <div className="sv-modal-head">
                        <div>
                            <div className="sv-modal-eyebrow">Save to a deck</div>
                            <div className="sv-modal-title">Pick a shelf</div>
                        </div>
                        <button
                            className="tx-icon-btn"
                            onClick={() => { setCreateFlashcardsOpen(false); setWordsToSave(null); setSelectedDeckId(''); }}
                            aria-label="Close"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Step indicator */}
                    <div className="sv-stepper">
                        <div className="sv-step" data-active="true">
                            <span className="sv-step-num">1</span>
                            <span>Deck</span>
                        </div>
                        <ArrowRight size={12} className="sv-step-arrow" />
                        <div className="sv-step">
                            <span className="sv-step-num">2</span>
                            <span>Review</span>
                        </div>
                        <ArrowRight size={12} className="sv-step-arrow" />
                        <div className="sv-step">
                            <span className="sv-step-num">3</span>
                            <span>Save</span>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="sv-body" style={{ maxHeight: 360, overflowY: 'auto' }}>
                        {filteredDecks.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '24px 0' }}>
                                <p style={{ color: 'var(--tk-ink-3)', marginBottom: 12, fontSize: 14 }}>
                                    No {fromLanguage} decks yet.
                                </p>
                                <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => { setCreateFlashcardsOpen(false); navigate('/view-all-decks'); }}>
                                    Create a new deck
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="sv-section-label">Recent</div>
                                {filteredDecks.map((deck: any) => (
                                    <button
                                        key={deck._id}
                                        className="sv-deck-row"
                                        data-selected={selectedDeckId === deck._id ? 'true' : 'false'}
                                        onClick={() => setSelectedDeckId(deck._id)}
                                    >
                                        <DeckProgressRing value={deck.deckPercentage ?? 0} />
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div className="sv-deck-name">{deck.deckName}</div>
                                            <div className="sv-deck-meta">
                                                {deck.cards?.length || 0} cards
                                                {deck.updatedAt ? ` · ${relativeTime(deck.updatedAt)}` : ''}
                                            </div>
                                        </div>
                                        {selectedDeckId === deck._id && <Check size={16} style={{ color: 'var(--tk-accent)', flexShrink: 0 }} />}
                                    </button>
                                ))}
                                <div className="sv-section-label" style={{ marginTop: 16 }}>Or create</div>
                                <button
                                    className="sv-deck-row"
                                    style={{ borderStyle: 'dashed', background: 'transparent' }}
                                    onClick={() => { setCreateFlashcardsOpen(false); navigate('/view-all-decks'); }}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px dashed var(--tk-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tk-ink-4)', flexShrink: 0 }}>
                                        <Plus size={14} />
                                    </div>
                                    <div>
                                        <div className="sv-deck-name" style={{ color: 'var(--tk-ink-2)' }}>New deck…</div>
                                        <div className="sv-deck-meta">
                                            Start a fresh shelf for {(wordsToSave ?? response?.words ?? []).length} word{(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </button>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="sv-footer">
                        <span className="sv-footer-hint">
                            {selectedDeckId
                                ? `→ save ${(wordsToSave ?? response?.words ?? []).length} word${(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''}`
                                : `${(wordsToSave ?? response?.words ?? []).length} word${(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''} ready`}
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => { setCreateFlashcardsOpen(false); setWordsToSave(null); setSelectedDeckId(''); }}>
                                Cancel
                            </button>
                            <button
                                className="tk-btn tk-btn-primary tk-btn-sm"
                                onClick={handleSave}
                                disabled={!selectedDeckId || saving}
                                style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                            >
                                {saving ? 'Saving…' : <>Save <ArrowRight size={13} /></>}
                            </button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>


        </div>
    );
};

export const IndexPage = () => (
    <TranslationHoverProvider>
        <IndexPageContent />
    </TranslationHoverProvider>
);
