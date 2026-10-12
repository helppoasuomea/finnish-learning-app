import { InputBar } from "../components/IndexPage/InputBar";
import useTranslation from "../state/hooks/useTranslation";
import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import { useTranslationHover } from "@/contexts/TranslationHoverContext";
import { useLocation, useNavigate } from "react-router-dom";
import { TranslationHoverProvider } from "@/contexts/TranslationHoverContext";
import { Dialog, DialogContent, DialogTitle } from "../components/ui/dialog";
import { useDeckContext } from "@/contexts/DeckContext";
import { UserContext } from "@/contexts/UserContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, BookOpen, Plus, Check, X, Play } from "lucide-react";
import { GRAMMAR_BY_ID } from "@/data/grammar/index";
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@/components/ui/popover";
import { OnboardingFlow } from "@/components/OnboardingFlow";
import { GrammarInTranslation } from "@/components/IndexPage/GrammarInTranslation";
import { TakeWithYou } from "@/components/IndexPage/TakeWithYou";
import { topicStyle } from "@/data/grammar/topic-colors";

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
    const { fromLanguage, setFromLanguage, inputText, setInputText, ready, isStreaming, streamPhase, validationError, response, handleTranslationStream, refreshResponseFromStorage } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { decks } = useDeckContext();
    const { user } = useContext(UserContext);
    const { toast } = useToast();
    const { hoveredFlashcardFi } = useTranslationHover();
    const [createFlashcardsOpen, setCreateFlashcardsOpen] = useState(false);
    const [dialogStep, setDialogStep] = useState<0 | 'create'>(0);
    const [selectedDeckId, setSelectedDeckId] = useState<string>("");
    const [saving, setSaving] = useState(false);
    const [wordsToSave, setWordsToSave] = useState<any[] | null>(null);
    const [localSavedIds, setLocalSavedIds] = useState<Set<string>>(new Set());
    const [hideCommon, setHideCommon] = useState(true);
    const [authGateOpen, setAuthGateOpen] = useState(false);
    const [authGateWord, setAuthGateWord] = useState<string | null>(null);
    const [authGateWordObj, setAuthGateWordObj] = useState<any>(null);
    const [onboardingOpen, setOnboardingOpen] = useState(false);
    const [onboardingWord, setOnboardingWord] = useState("");
    const [saveDone, setSaveDone] = useState<{ count: number; deckName: string } | null>(null);
    const [newDeckDraft, setNewDeckDraft] = useState({ name: '', description: '', level: '' as string, goal: 'sapling', tags: [] as string[], tagInput: '' });
    const needsReloadRef = useRef(false);
    const pendingOnboardingRef = useRef(false);
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

    // Put the sentence back in the box on a reload, so the input matches the
    // translation that is still on screen.
    //
    // Restored once per response, tracked by a ref. The previous version had
    // `inputText` in the dependency array, which meant the effect also ran the
    // moment the user emptied the field - saw an empty input and a stored
    // response, and wrote the sentence straight back. Select-all and delete
    // looked like it did nothing, because the text returned in the same tick.
    // The clear button escaped it only by accident: it also drops `response`
    // from localStorage, so there was nothing left to restore.
    const restoredFor = useRef<string | null>(null);
    useEffect(() => {
        const original = (response as any)?.originalText;
        if (!original || typeof original !== 'string') return;
        if (restoredFor.current === original) return;
        restoredFor.current = original;
        // Only fill an empty box: never overwrite what someone is typing.
        if (inputText.trim() === '') setInputText(original);
    // inputText is deliberately not a dependency - reacting to it is the bug.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [response, setInputText]);

    const resetDialog = () => {
        setDialogStep(0);
        setSelectedDeckId('');
        setSaveDone(null);
        setNewDeckDraft({ name: '', description: '', level: '', goal: 'sapling', tags: [], tagInput: '' });
    };

    const closeSaveDialog = () => {
        const reload = needsReloadRef.current;
        const onboard = pendingOnboardingRef.current;
        needsReloadRef.current = false;
        pendingOnboardingRef.current = false;
        resetDialog();
        setCreateFlashcardsOpen(false);
        setWordsToSave(null);
        if (onboard) setOnboardingOpen(true);
        if (reload && !onboard) { setInputText(""); window.location.reload(); }
    };

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

            if (result.data.showOnboarding && toSave[0]?.userLangCard) {
                setOnboardingWord(toSave[0].userLangCard);
                pendingOnboardingRef.current = true;
            }

            sourceWords.forEach((w: any) => { if (w.id) setLocalSavedIds(s => new Set([...s, w.id])); });

            if (!wordsToSave) needsReloadRef.current = true;

            const savedDeck = filteredDecks.find((d: any) => d._id === selectedDeckId);
            setSaveDone({ count: result.data.added, deckName: savedDeck?.deckName || 'your deck' });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save words. Please try again.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const handleCreateAndSave = async () => {
        if (!newDeckDraft.name.trim()) return;
        const sourceWords = wordsToSave ?? response?.words;
        setSaving(true);
        try {
            const deckTags = [fromLanguage, ...newDeckDraft.tags].filter(Boolean);
            const deckRes = await axios.post('/decks', {
                deckName: newDeckDraft.name.trim(),
                deckTags,
                description: newDeckDraft.description.trim(),
                level: newDeckDraft.level || undefined,
                memoryGoal: { tier: newDeckDraft.goal },
            });
            const newDeckId = deckRes.data._id || deckRes.data.deck?._id;
            if (newDeckId && sourceWords?.length) {
                const defaultSaveAs = (user?.flashcardWordForm as 'original' | 'base') === 'base' ? 'base' : 'original';
                const toSave = sourceWords
                    .map((word: any) => {
                        const isBase = defaultSaveAs === 'base';
                        return { engCard: isBase ? (word.en_base || word.en) : word.en, userLangCard: isBase ? word.original_word : word.fi };
                    })
                    .filter((w: any) => w.engCard?.trim() && w.userLangCard?.trim());
                const result = await axios.post(`/decks/${newDeckId}/save-all`, { words: toSave });
                if (result.data.showOnboarding && toSave[0]?.userLangCard) {
                    setOnboardingWord(toSave[0].userLangCard);
                    pendingOnboardingRef.current = true;
                }
                sourceWords.forEach((w: any) => { if (w.id) setLocalSavedIds(s => new Set([...s, w.id])); });
                setSaveDone({ count: result.data.added, deckName: newDeckDraft.name.trim() });
            } else {
                setSaveDone({ count: 0, deckName: newDeckDraft.name.trim() });
            }
            needsReloadRef.current = true;
        } catch {
            toast({ title: "Error", description: "Couldn't create the shelf. Please try again.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const openSaveWord = (word: any) => {
        if (!user) {
            setAuthGateWord(word.fi || word.original_word || null);
            setAuthGateWordObj(word);
            setAuthGateOpen(true);
            return;
        }
        setWordsToSave([word]);
        setCreateFlashcardsOpen(true);
    };

    const openSaveAll = () => {
        if (!user) { setAuthGateWord(null); setAuthGateOpen(true); return; }
        setWordsToSave(null);
        setCreateFlashcardsOpen(true);
    };

    const openSaveWords = (words: any[]) => {
        if (!user) { setAuthGateWord(null); setAuthGateOpen(true); return; }
        setWordsToSave(words);
        setCreateFlashcardsOpen(true);
    };

    // Decks matching the current language — used to count already-saved words
    const langDecks = useMemo(() => decks.filter(deck =>
        deck.deckTags && deck.deckTags.length > 0 &&
        deck.deckTags[0].toLowerCase() === fromLanguage.toLowerCase()
    ), [decks, fromLanguage]);

    // All decks available for saving (language-matched ones first, rest below)
    const filteredDecks = useMemo(() => {
        const matched = langDecks;
        const rest = decks.filter(d => !matched.some((m: any) => m._id === d._id));
        return [...matched, ...rest];
    }, [langDecks, decks]);

    const savedWordDecks = useMemo(() => {
        const map: Record<string, string[]> = {};
        langDecks.forEach((deck: any) => {
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

    // Auto-save translated sentence — only fires once the stream is fully done
    // so that response.words is fully populated from the enriched event.
    useEffect(() => {
        const autoSave = async () => {
            if (!user || !response?.sentence) return;
            if (isStreaming) return; // wait for enriched event to land first
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
    }, [user, response, inputText, savedWordKeys, isStreaming]); // fromLanguage intentionally excluded

    // After login/register, auto-open save dialog for the card the user was trying to save
    useEffect(() => {
        if (!user) return;
        const raw = localStorage.getItem('lukea:pendingCard');
        if (!raw) return;
        try {
            const word = JSON.parse(raw);
            localStorage.removeItem('lukea:pendingCard');
            setWordsToSave([word]);
            setCreateFlashcardsOpen(true);
        } catch {
            localStorage.removeItem('lukea:pendingCard');
        }
    }, [user]);

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

    type WordSegment =
        | { type: 'single'; word: any; index: number }
        | { type: 'group'; key: string; words: any[]; startIndex: number };

    const wordSegments: WordSegment[] = (() => {
        const segs: WordSegment[] = [];
        let i = 0;
        while (i < activeWords.length) {
            const w = activeWords[i];
            if (w.group) {
                const groupKey = w.group;
                const groupWords = [w];
                let j = i + 1;
                while (j < activeWords.length && activeWords[j].group === groupKey) {
                    groupWords.push(activeWords[j]);
                    j++;
                }
                segs.push({ type: 'group', key: groupKey, words: groupWords, startIndex: i });
                i = j;
            } else {
                segs.push({ type: 'single', word: w, index: i });
                i++;
            }
        }
        return segs;
    })();

    const renderWordToken = (w: any, i: number) => {
        const saved = isWordSaved(w);
        const isLastStreaming = isStreaming && i === activeWords.length - 1;
        return (
            <Popover key={w.id || i}>
                <PopoverTrigger asChild>
                    <span
                        className="tx-il-word"
                        data-common={w.common && !w.highlight ? 'true' : 'false'}
                        data-saved={saved ? 'true' : 'false'}
                        data-topic={w.highlight || ''}
                        data-stream-cursor={isLastStreaming ? 'true' : 'false'}
                        style={topicStyle(w.highlight)}
                    >
                        {w.fi}
                        {(w.gloss || w.en)
                            ? <span className="tx-il-gloss">{(w.gloss || w.en).replace(/\s*\([^)]*\)/g, '').trim()}</span>
                            : <span className="tx-il-gloss-pending"><span className="tx-il-gloss-shimmer"/></span>
                        }
                    </span>
                </PopoverTrigger>
                <PopoverContent
                    className="p-0"
                    style={{ width: 320, background: 'var(--tk-card)', border: '1px solid var(--tk-rule)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
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
                        {(w.lemma || (w.features && w.features.length > 0)) && (
                            <div className="tx-morph-badge">
                                {w.lemma && <span className="tx-morph-lemma">{w.lemma}</span>}
                                {w.features && w.features.length > 0 && (
                                    <span className="tx-morph-features">{w.features.join(' · ')}</span>
                                )}
                            </div>
                        )}
                        {w.highlight && GRAMMAR_BY_ID[w.highlight] && (
                            <div className="tx-grammar-card">
                                <div className="tx-grammar-card-title">{GRAMMAR_BY_ID[w.highlight].title}</div>
                                {(GRAMMAR_BY_ID[w.highlight].overview?.theme || GRAMMAR_BY_ID[w.highlight].subtitle) && (
                                    <div className="tx-grammar-card-desc">{GRAMMAR_BY_ID[w.highlight].overview?.theme || GRAMMAR_BY_ID[w.highlight].subtitle}</div>
                                )}
                                <div className="tx-grammar-card-actions">
                                    <PopoverClose asChild>
                                        <button className="tx-grammar-btn" onClick={() => { navigate(`/grammar/${w.highlight}`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                            <BookOpen size={12} /> Open topic
                                        </button>
                                    </PopoverClose>
                                    <PopoverClose asChild>
                                        <button className="tx-grammar-btn" onClick={() => { navigate(`/grammar/${w.highlight}?drill=1`); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                                            <Play size={12} /> Drill this
                                        </button>
                                    </PopoverClose>
                                </div>
                            </div>
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
                        {w.en_base && w.en_base !== w.en && (
                            <div className="tx-peek-meta" style={{ marginTop: 2 }}>
                                <span style={{ letterSpacing: '0.06em' }}>BASE (EN):</span>
                                <span style={{ color: 'var(--tk-ink-2)', textTransform: 'none', letterSpacing: 0 }}>{w.en_base}</span>
                            </div>
                        )}
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
    };

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
                        <p style={{ color: 'var(--tk-ink-3)', fontSize: 16, marginTop: 6, fontFamily: 'var(--font-body)', fontStyle: 'italic' }}>
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

                        {/* Streaming status bar */}
                        {isStreaming && (
                            <div className="tx-stream-status">
                                <span className="tx-stream-dot" />
                                <span className="tx-stream-label">
                                    {streamPhase === 'reading' && 'Reading sentence…'}
                                    {streamPhase === 'words'   && 'Tagging grammar · drafting translation…'}
                                    {streamPhase === 'enriching' && 'Applying morphology…'}
                                    {(streamPhase === 'idle' || streamPhase === 'done') && 'Translating…'}
                                </span>
                                <div className="tx-stream-tiers">
                                    <span data-on={streamPhase !== 'reading' ? 'true' : 'false'}>tokens</span>
                                    <span data-on={streamPhase === 'words' || streamPhase === 'enriching' || streamPhase === 'done' ? 'true' : 'false'}>words</span>
                                    <span data-on={streamPhase === 'enriching' || streamPhase === 'done' ? 'true' : 'false'}>morph</span>
                                </div>
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
                                    <div className="tx-stream-placeholder" style={{ padding: '12px 0' }}>
                                        <span className="tx-stream-bar" style={{ width: '72%' }} />
                                        <span className="tx-stream-bar" style={{ width: '55%' }} />
                                        <span className="tx-stream-bar" style={{ width: '40%' }} />
                                    </div>
                                ) : (
                                    <div className="tx-interlinear" data-streaming={isStreaming ? 'true' : 'false'}>
                                        {wordSegments.map((seg) =>
                                            seg.type === 'single'
                                                ? renderWordToken(seg.word, seg.index)
                                                : (
                                                    <div key={seg.key} className="tx-il-group">
                                                        {seg.words.map((w, gi) => renderWordToken(w, seg.startIndex + gi))}
                                                        {seg.words[0]?.group_en && (
                                                            <span className="tx-il-group-en">{seg.words[0].group_en}</span>
                                                        )}
                                                    </div>
                                                )
                                        )}
                                        <span className="tx-il-punct">.</span>
                                    </div>
                                )}

                                <GrammarInTranslation words={activeWords} />

                                <TakeWithYou
                                    words={activeWords}
                                    savedWordDecks={savedWordDecks}
                                    langDecks={langDecks}
                                    localSavedIds={localSavedIds}
                                    onSaveWord={openSaveWord}
                                    onSaveNew={openSaveWords}
                                />
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

            {/* Auth gate modal */}
            <Dialog open={authGateOpen} onOpenChange={setAuthGateOpen}>
                <DialogContent className="p-0 gap-0 overflow-hidden" style={{ maxWidth: 740, borderRadius: 16, border: 'none', boxShadow: '0 24px 80px rgba(0,0,0,0.18)' }}>
                    <DialogTitle className="sr-only">Sign in to save</DialogTitle>
                    <div className="ag-layout">
                        {/* Left — brand */}
                        <div className="ag-left">
                            <div className="ag-brand">
                                <span className="ag-brand-name">Lukea</span>
                                <span className="ag-brand-tag">READING ROOM</span>
                            </div>
                            <div className="ag-hero">
                                <p className="ag-hero-sub">The words you read</p>
                                <p className="ag-hero-title">become the words you know.</p>
                                <p className="ag-hero-body">Paste a sentence. We translate it, explain each word, and quietly build it into your flashcards.</p>
                            </div>
                            <div className="ag-langs">FINNISH · VIETNAMESE · KOREAN · JAPANESE</div>
                        </div>

                        {/* Right — CTA */}
                        <div className="ag-right">
                            <button className="ag-close" onClick={() => setAuthGateOpen(false)} aria-label="Close">
                                <X size={15} />
                            </button>
                            <div className="tk-eyebrow" style={{ marginBottom: 10 }}>Sign in to save</div>
                            <h2 className="ag-heading">Keep this word on your shelf.</h2>
                            <p className="ag-desc">Saved words become flashcards — reviewed at the right moment, not randomly.</p>

                            {authGateWord && (
                                <div className="ag-saving-chip">
                                    <span className="ag-saving-dot" />
                                    <span className="ag-saving-label">SAVING</span>
                                    <span className="ag-saving-word">{authGateWord}</span>
                                </div>
                            )}

                            <div className="ag-actions">
                                <button
                                    className="ag-btn-primary"
                                    onClick={() => {
                                        if (authGateWordObj) localStorage.setItem('lukea:pendingCard', JSON.stringify(authGateWordObj));
                                        setAuthGateOpen(false);
                                        navigate('/login');
                                    }}
                                >
                                    Sign in <ArrowRight size={15} />
                                </button>
                                <button
                                    className="ag-btn-secondary"
                                    onClick={() => {
                                        if (authGateWordObj) localStorage.setItem('lukea:pendingCard', JSON.stringify(authGateWordObj));
                                        setAuthGateOpen(false);
                                        navigate('/register');
                                    }}
                                >
                                    Create an account
                                </button>
                                <button className="ag-btn-ghost" onClick={() => setAuthGateOpen(false)}>
                                    Keep translating as a guest
                                </button>
                            </div>

                            <p className="ag-fine">No credit card. Free forever for personal use.</p>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Save dialog */}
            <Dialog open={createFlashcardsOpen} onOpenChange={(open) => { if (!open) closeSaveDialog(); }}>
                <DialogContent className="p-0 gap-0 overflow-hidden !max-w-none" style={{ width: dialogStep === 'create' ? 'min(720px, 96vw)' : 'min(520px, 96vw)', borderRadius: 16, border: '1px solid var(--tk-rule)', transition: 'width 0.2s ease' }}>
                    <DialogTitle className="sr-only">Save to a deck</DialogTitle>

                    {/* Header */}
                    <div className="sv-modal-head">
                        <div>
                            <div className="sv-modal-eyebrow">Save to a deck</div>
                            <div className="sv-modal-title">
                                {saveDone ? 'Done' : dialogStep === 'create' ? 'New shelf' : 'Pick a shelf'}
                            </div>
                        </div>
                        <button className="tx-icon-btn" onClick={closeSaveDialog} aria-label="Close">
                            <X size={15} />
                        </button>
                    </div>

                    {/* Done confirmation panel */}
                    {saveDone && (
                        <div className="sv-done">
                            <div className="sv-done-check"><Check size={22} strokeWidth={2.5} /></div>
                            <div className="sv-done-count">{saveDone.count} {saveDone.count === 1 ? "word" : "words"} saved</div>
                            <div className="sv-done-desc">Into <em>{saveDone.deckName}</em>. Ready to study tonight.</div>
                            <div className="sv-done-actions">
                                <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={closeSaveDialog}>Back to sentence</button>
                                <button className="tk-btn tk-btn-sm" style={{ background: '#2d4438', color: '#fff', display: 'flex', alignItems: 'center', gap: 6 }}
                                    onClick={() => { closeSaveDialog(); navigate('/review'); }}>
                                    Study now <ArrowRight size={13} />
                                </button>
                            </div>
                        </div>
                    )}

                    {!saveDone && <>
                    {/* Step indicator */}
                    <div className="sv-stepper">
                        <div className="sv-step" data-active="true">
                            <span className="sv-step-num">1</span>
                            <span>{dialogStep === 'create' ? 'New deck' : 'Deck'}</span>
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

                    {/* Step 0: Deck picker */}
                    {dialogStep === 0 && (
                        <div className="sv-body" style={{ maxHeight: 360, overflowY: 'auto' }}>
                            {langDecks.length > 0 && <div className="sv-section-label">{fromLanguage} decks</div>}
                            {filteredDecks.length === 0 && (
                                <p style={{ color: 'var(--tk-ink-3)', fontSize: 14, padding: '8px 0 16px' }}>No decks yet.</p>
                            )}
                            {filteredDecks.map((deck: any, i: number) => (
                                <React.Fragment key={deck._id}>
                                    {i === langDecks.length && langDecks.length > 0 && filteredDecks.length > langDecks.length && (
                                        <div className="sv-section-label" style={{ marginTop: 12 }}>Other decks</div>
                                    )}
                                    <button
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
                                </React.Fragment>
                            ))}
                            <div className="sv-section-label" style={{ marginTop: 16 }}>Or create</div>
                            <button
                                className="sv-deck-row"
                                style={{ borderStyle: 'dashed', background: 'transparent' }}
                                onClick={() => { setDialogStep('create'); setSelectedDeckId(''); }}
                            >
                                <div style={{ width: 40, height: 40, borderRadius: '50%', border: '1px dashed var(--tk-rule)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--tk-ink-4)', flexShrink: 0 }}>
                                    <Plus size={14} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div className="sv-deck-name" style={{ color: 'var(--tk-ink-2)' }}>New deck…</div>
                                    <div className="sv-deck-meta">
                                        Start a fresh shelf for {(wordsToSave ?? response?.words ?? []).length} word{(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                                <ArrowRight size={14} style={{ color: 'var(--tk-ink-4)', flexShrink: 0 }} />
                            </button>
                        </div>
                    )}

                    {/* Step "create": new deck form */}
                    {dialogStep === 'create' && (() => {
                        const wordCount = (wordsToSave ?? response?.words ?? []).length;
                        const suggestName = wordCount === 1
                            ? `${((wordsToSave ?? response?.words ?? [])[0]?.fi || 'word')[0].toUpperCase()}${((wordsToSave ?? response?.words ?? [])[0]?.fi || 'word').slice(1)} & friends`
                            : 'Untitled shelf';
                        const d = newDeckDraft;
                        const setD = (patch: Partial<typeof newDeckDraft>) => setNewDeckDraft(prev => ({ ...prev, ...patch }));
                        const addTag = (raw?: string) => {
                            const t = (raw ?? d.tagInput).trim().toLowerCase().replace(/^#/, '');
                            if (!t || d.tags.includes(t) || d.tags.length >= 4) return;
                            setD({ tags: [...d.tags, t], tagInput: '' });
                        };
                        const removeTag = (t: string) => setD({ tags: d.tags.filter(x => x !== t) });
                        return (
                            <div className="sv-body sv-create-body">
                                <div className="sv-create-grid">
                                    {/* Left column */}
                                    <div className="sv-create-main">
                                        <div className="tk-field">
                                            <div className="tk-field-label">
                                                <span>Name</span>
                                                <small>What would you call this shelf?</small>
                                            </div>
                                            <input
                                                className="tk-textfield"
                                                placeholder={suggestName}
                                                value={d.name}
                                                autoFocus
                                                onChange={e => setD({ name: e.target.value })}
                                            />
                                        </div>
                                        <div className="tk-field">
                                            <div className="tk-field-label">
                                                <span>Description</span>
                                                <small>Optional · for your future self</small>
                                            </div>
                                            <textarea
                                                className="tk-textfield"
                                                rows={3}
                                                style={{ minHeight: 76, fontSize: 14 }}
                                                placeholder={`A few words from "${((wordsToSave ?? response?.words ?? [])[0]?.fi || 'today').slice(0, 30)}…"`}
                                                value={d.description}
                                                onChange={e => setD({ description: e.target.value })}
                                            />
                                        </div>
                                        <div className="tk-field">
                                            <div className="tk-field-label">
                                                <span>Tags</span>
                                                <small>Up to 4 · helps you find it later</small>
                                            </div>
                                            <div className="sv-tag-row">
                                                {d.tags.map(t => (
                                                    <span key={t} className="sv-tag">
                                                        #{t}
                                                        <button onClick={() => removeTag(t)} aria-label={`Remove ${t}`}><X size={10} /></button>
                                                    </span>
                                                ))}
                                                {d.tags.length < 4 && (
                                                    <input
                                                        className="sv-tag-input"
                                                        placeholder={d.tags.length ? '+ tag' : '+ tag (e.g. travel)'}
                                                        value={d.tagInput}
                                                        onChange={e => setD({ tagInput: e.target.value })}
                                                        onKeyDown={e => {
                                                            if ((e.key === 'Enter' || e.key === ',') && d.tagInput.trim()) { e.preventDefault(); addTag(); }
                                                            if (e.key === 'Backspace' && !d.tagInput && d.tags.length) removeTag(d.tags[d.tags.length - 1]);
                                                        }}
                                                        onBlur={() => d.tagInput && addTag()}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right column */}
                                    <div className="sv-create-side">
                                        <div className="tk-field">
                                            <div className="tk-field-label"><span>Level</span><small>Optional</small></div>
                                            <div className="tk-chips" style={{ flexWrap: 'wrap' }}>
                                                {(['A1','A2','B1','B2','C1','C2'] as string[]).map(l => (
                                                    <button key={l} className="tk-chip" data-active={d.level === l}
                                                        onClick={() => setD({ level: d.level === l ? '' : l })}>
                                                        {l}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="tk-field">
                                            <div className="tk-field-label">
                                                <span>Retention goal</span>
                                                <small>How long should these stick?</small>
                                            </div>
                                            <div className="sv-goal-list">
                                                {([
                                                    { id: 'seedling',  label: 'Seedling',  sub: 'A few days · just curious' },
                                                    { id: 'sapling',   label: 'Sapling',   sub: 'A few weeks · phrasebook' },
                                                    { id: 'tree',      label: 'Tree',      sub: 'Months · everyday vocabulary' },
                                                    { id: 'heartwood', label: 'Heartwood', sub: 'Years · core fluency' },
                                                ] as const).map(g => (
                                                    <button key={g.id} className="sv-goal-row" data-selected={d.goal === g.id}
                                                        onClick={() => setD({ goal: g.id })}>
                                                        <span className="sv-goal-dot" data-goal={g.id} />
                                                        <span className="sv-goal-text">
                                                            <span className="sv-goal-label">{g.label}</span>
                                                            <span className="sv-goal-sub">{g.sub}</span>
                                                        </span>
                                                        {d.goal === g.id && <Check size={13} style={{ color: 'var(--tk-accent)', flexShrink: 0 }} />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="sv-create-preview">
                                            <div className="sv-section-label" style={{ marginBottom: 6 }}>Preview</div>
                                            <div className="sv-preview-card">
                                                <DeckProgressRing value={0} />
                                                <div style={{ minWidth: 0, flex: 1 }}>
                                                    <div className="sv-preview-name">{d.name.trim() || suggestName}</div>
                                                    <div className="sv-preview-meta">
                                                        {wordCount} card{wordCount !== 1 ? 's' : ''}{d.level ? ` · ${d.level}` : ''} · {d.goal}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })()}

                    {/* Footer */}
                    <div className="sv-footer">
                        <span className="sv-footer-hint">
                            {dialogStep === 'create'
                                ? `→ new shelf · ${(wordsToSave ?? response?.words ?? []).length} card${(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''}`
                                : selectedDeckId
                                    ? `→ save ${(wordsToSave ?? response?.words ?? []).length} word${(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''}`
                                    : `${(wordsToSave ?? response?.words ?? []).length} word${(wordsToSave ?? response?.words ?? []).length !== 1 ? 's' : ''} ready`}
                        </span>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {dialogStep === 'create' ? (
                                <>
                                    <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => setDialogStep(0)}>Back</button>
                                    <button
                                        className="tk-btn tk-btn-primary tk-btn-sm"
                                        onClick={handleCreateAndSave}
                                        disabled={!newDeckDraft.name.trim() || saving}
                                        style={{ display: 'flex', alignItems: 'center', gap: 5 }}
                                    >
                                        {saving ? 'Creating…' : <>Create &amp; save <ArrowRight size={13} /></>}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className="tk-btn tk-btn-ghost tk-btn-sm" onClick={() => { setCreateFlashcardsOpen(false); setWordsToSave(null); resetDialog(); }}>
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
                                </>
                            )}
                        </div>
                    </div>
                    </>}
                </DialogContent>
            </Dialog>

            {onboardingOpen && (
                <OnboardingFlow
                    word={onboardingWord}
                    onClose={() => setOnboardingOpen(false)}
                    onGoToReview={() => navigate('/review')}
                />
            )}

        </div>
    );
};

export const IndexPage = () => (
    <TranslationHoverProvider>
        <IndexPageContent />
    </TranslationHoverProvider>
);
