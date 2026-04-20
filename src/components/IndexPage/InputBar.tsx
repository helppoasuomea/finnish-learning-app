import { textToSpeech } from "@/chatcompletion/ChatCompletion";
import { useState, useEffect, useRef } from "react";
import { Volume2, Loader2, X, ArrowRight } from "lucide-react";
import { useTranslationHover } from "@/contexts/TranslationHoverContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const LANGUAGES = [
    { name: 'Finnish', flag: '🇫🇮' },
    { name: 'Korean', flag: '🇰🇷' },
    { name: 'Chinese', flag: '🇨🇳' },
    { name: 'Vietnamese', flag: '🇻🇳' },
    { name: 'Greek', flag: '🇬🇷' },
];

const langFlag = (name: string) => LANGUAGES.find(l => l.name === name)?.flag ?? '🌐';

interface WordTiming {
    word: string;
    start: number;
    end: number;
}

interface InputBarProps {
    inputText: string;
    setInputText: (text: string) => void;
    handleTranslation: () => void;
    ready: boolean;
    highlighted?: boolean;
    isStreaming?: boolean;
    currentWords?: any[];
    currentWordIndex?: number;
    confidence?: number | null;
    confidenceDetails?: {
        accuracy?: number;
        completeness?: number;
        naturalness?: number;
        grammar?: number;
        concerns?: string[];
    } | null;
    onRerun?: () => void;
    onClear?: () => void;
    fromLanguage: string;
    setFromLanguage: (lang: string) => void;
}

const cleanWord = (word: string) => {
    return word.toLowerCase().replace(/[.,!?;:"'()]/g, '')
}

const highlightCurrentWord = (text: string, words: any[], currentIndex: number) => {
    if (!words || words.length === 0 || currentIndex < 0) return <span>{text}</span>;
    const currentWord = words[currentIndex];
    if (!currentWord?.en) return <span>{text}</span>;

    const segments = text.split(/(\s+|[.,!?;:"'()])/);
    const elements: JSX.Element[] = [];
    segments.forEach((segment, index) => {
        if (segment.trim() && !/^[.,!?;:"'()]+$/.test(segment)) {
            const cleanSeg = cleanWord(segment);
            const cleanCur = cleanWord(currentWord.en);
            const isCurrent = cleanSeg === cleanCur || cleanSeg.includes(cleanCur) || cleanCur.includes(cleanSeg);
            if (isCurrent) {
                elements.push(<span key={index} style={{ background: 'var(--tk-accent-wash)', color: 'var(--tk-accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{segment}</span>);
            } else {
                const wasAnalyzed = words.slice(0, currentIndex).some(w => {
                    const ca = w.en.toLowerCase().replace(/[.,!?;:"'()]/g, '');
                    return cleanSeg === ca || cleanSeg.includes(ca) || ca.includes(cleanSeg);
                });
                if (wasAnalyzed) {
                    elements.push(<span key={index} style={{ color: 'var(--tk-ink-3)' }}>{segment}</span>);
                } else {
                    elements.push(<span key={index}>{segment}</span>);
                }
            }
        } else {
            elements.push(<span key={index}>{segment}</span>);
        }
    });
    return <>{elements}</>;
};

const highlightTextForSpeech = (text: string, currentWordIndex: number) => {
    if (currentWordIndex < 0) return <span>{text}</span>;
    const words = text.split(/(\s+)/);
    const elements: JSX.Element[] = [];
    let wordCount = 0;
    words.forEach((segment, index) => {
        if (segment.trim()) {
            if (wordCount === currentWordIndex) {
                elements.push(<span key={index} style={{ background: 'var(--tk-accent-wash)', color: 'var(--tk-accent)', padding: '2px 6px', borderRadius: 4, fontWeight: 600 }}>{segment}</span>);
            } else if (wordCount < currentWordIndex) {
                elements.push(<span key={index} style={{ color: 'var(--tk-ink-3)' }}>{segment}</span>);
            } else {
                elements.push(<span key={index}>{segment}</span>);
            }
            wordCount++;
        } else {
            elements.push(<span key={index}>{segment}</span>);
        }
    });
    return <>{elements}</>;
};

const highlightHoveredOriginalText = (text: string, hoveredText: string | null) => {
    if (!hoveredText || !text) return <span className="whitespace-pre-wrap">{text}</span>;
    const normalized = hoveredText.trim();
    if (!normalized) return <span className="whitespace-pre-wrap">{text}</span>;
    const escaped = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const isSingleWord = !normalized.includes(' ');
    const pattern = isSingleWord ? `\\b${escaped}\\b` : escaped.replace(/\s+/g, '\\s+');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    return (
        <span className="whitespace-pre-wrap">
            {parts.map((part, index) => {
                if (isSingleWord) {
                    if (new RegExp(`\\b${escaped}\\b`, 'i').test(part)) {
                        return <span key={index} style={{ background: 'rgba(63,93,76,0.15)', color: 'var(--tk-accent)', borderRadius: 3 }}>{part}</span>;
                    }
                } else {
                    if (part.trim().toLowerCase() === normalized.toLowerCase()) {
                        return <span key={index} style={{ background: 'rgba(63,93,76,0.15)', color: 'var(--tk-accent)', borderRadius: 3 }}>{part}</span>;
                    }
                }
                return <span key={index}>{part}</span>;
            })}
        </span>
    );
};

export const InputBar: React.FC<InputBarProps> = ({
    inputText,
    setInputText,
    handleTranslation,
    ready,
    highlighted,
    isStreaming = false,
    currentWords = [],
    currentWordIndex = -1,
    onClear,
    fromLanguage,
    setFromLanguage,
}) => {
    const { hoveredOriginalText, setHoveredFlashcardFi } = useTranslationHover();
    const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [countdown, setCountdown] = useState(60);
    const [_audioUrl, setAudioUrl] = useState<string | null>(null);
    const [loadingTTS, setLoadingTTS] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSpeechWordIndex, setCurrentSpeechWordIndex] = useState(-1);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!ready) {
            timer = setInterval(() => setCountdown(c => c - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [ready]);

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value);

    const handleSpeak = async () => {
        if (!inputText) return;
        setLoadingTTS(true);
        try {
            const url = await textToSpeech(inputText);
            setAudioUrl(url);
            const wordTimings = await getWordTimingsFromAudio(url, inputText);
            if (wordTimings && wordTimings.length > 0) {
                const audio = new Audio(url);
                audio.onloadeddata = () => {
                    setIsPlaying(true);
                    setCurrentSpeechWordIndex(0);
                    wordTimings.forEach((timing: WordTiming, index: number) => {
                        setTimeout(() => setCurrentSpeechWordIndex(index), timing.start * 1000);
                    });
                    setTimeout(() => { setIsPlaying(false); setCurrentSpeechWordIndex(-1); }, audio.duration * 1000);
                };
                audio.onended = () => { setIsPlaying(false); setCurrentSpeechWordIndex(-1); };
                audio.play();
            } else {
                await playWithEstimatedTiming(url);
            }
        } catch (error) {
            console.error('Error generating speech:', error);
            setIsPlaying(false);
            setCurrentSpeechWordIndex(-1);
        } finally {
            setLoadingTTS(false);
        }
    };

    const playWithEstimatedTiming = async (url: string) => {
        const audio = new Audio(url);
        audio.onloadeddata = () => {
            setIsPlaying(true);
            setCurrentSpeechWordIndex(0);
            const words = inputText.trim().split(/\s+/);
            const timePerWord = audio.duration / words.length;
            words.forEach((_, index) => setTimeout(() => setCurrentSpeechWordIndex(index), index * timePerWord * 1000));
            setTimeout(() => { setIsPlaying(false); setCurrentSpeechWordIndex(-1); }, audio.duration * 1000);
        };
        audio.play();
    };

    const getWordTimingsFromAudio = async (audioUrl: string, _originalText: string): Promise<WordTiming[] | null> => {
        try {
            const response = await fetch(audioUrl);
            const audioBlob = await response.blob();
            const audioFile = new File([audioBlob], 'speech.mp3', { type: 'audio/mp3' });
            const formData = new FormData();
            formData.append('file', audioFile);
            formData.append('model', 'whisper-1');
            formData.append('response_format', 'verbose_json');
            formData.append('timestamp_granularities[]', 'word');
            const whisperResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${import.meta.env.VITE_GPT_KEY}` },
                body: formData
            });
            if (!whisperResponse.ok) throw new Error('Whisper API failed');
            const result = await whisperResponse.json();
            return result.words;
        } catch {
            return null;
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && ready) {
            e.preventDefault();
            handleTranslation();
        }
    };

    const wordCount = inputText.trim().split(/\s+/).filter(Boolean).length;

    return (
        <div className={`tx-input-card ${highlighted ? 'ring-2 ring-offset-2' : ''}`} style={highlighted ? { '--tw-ring-color': 'var(--tk-accent)' } as React.CSSProperties : {}}>
            {/* Language header */}
            <div className="tx-input-head">
                <div className="tx-lang-swap">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="tx-lang-pill">
                                <span>{langFlag(fromLanguage)}</span>
                                {fromLanguage}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuRadioGroup>
                                {LANGUAGES.filter(l => l.name !== fromLanguage).map(l => (
                                    <DropdownMenuRadioItem key={l.name} value={l.name} onClick={() => setFromLanguage(l.name)}>
                                        <span style={{ marginRight: 6 }}>{l.flag}</span>{l.name}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ArrowRight size={13} className="tx-lang-arrow" />
                    <span className="tx-lang-pill" style={{ cursor: 'default' }}>
                        <span>🇬🇧</span>English
                    </span>
                </div>
            </div>

            {/* Textarea */}
            <div className="relative" style={{ opacity: !ready ? 0.75 : 1 }}>
                {hoveredOriginalText && inputText && !isStreaming && !isPlaying && (
                    <div className="absolute inset-0 px-4 py-4 whitespace-pre-wrap break-words z-10 pointer-events-none"
                        style={{ fontSize: 15, lineHeight: 1.65, color: 'var(--tk-ink)', fontFamily: 'var(--font-sans)' }}>
                        {highlightHoveredOriginalText(inputText, hoveredOriginalText)}
                    </div>
                )}
                <textarea
                    className={`tx-textarea${hoveredOriginalText && inputText && !isStreaming && !isPlaying ? ' text-transparent' : ''}`}
                    rows={4}
                    value={inputText}
                    onChange={handleInputChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    onKeyDown={handleKeyDown}
                    onMouseMove={(e) => {
                        if (isFocused || !currentWords || currentWords.length === 0 || isStreaming || isPlaying) return;
                        const textarea = e.currentTarget;
                        const rect = textarea.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const y = e.clientY - rect.top;
                        const style = window.getComputedStyle(textarea);
                        const lineHeight = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.5;
                        const paddingLeft = parseFloat(style.paddingLeft);
                        const paddingTop = parseFloat(style.paddingTop);
                        const fontSize = parseFloat(style.fontSize);
                        const line = Math.floor((y - paddingTop) / lineHeight);
                        const charInLine = Math.floor((x - paddingLeft) / (fontSize * 0.6));
                        const lines = inputText.split('\n');
                        let charIndex = 0;
                        for (let i = 0; i < Math.min(line, lines.length); i++) charIndex += lines[i].length + 1;
                        charIndex += Math.min(charInLine, lines[line]?.length || 0);
                        const words = inputText.split(/(\s+|[.,!?;:"'()])/);
                        let currentPos = 0;
                        for (const word of words) {
                            if (currentPos <= charIndex && currentPos + word.length >= charIndex) {
                                const cw = word.toLowerCase().replace(/[.,!?;:"'()]/g, '').trim();
                                if (cw) {
                                    for (const fw of currentWords) {
                                        const ffi = fw.fi?.toLowerCase().trim();
                                        const forig = fw.original_word?.toLowerCase().trim();
                                        if (ffi === cw || forig === cw || cw.includes(ffi) || ffi?.includes(cw)) {
                                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                            hoverTimeoutRef.current = setTimeout(() => setHoveredFlashcardFi(fw.fi || fw.original_word), 100);
                                            return;
                                        }
                                    }
                                }
                                break;
                            }
                            currentPos += word.length;
                        }
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                        hoverTimeoutRef.current = setTimeout(() => setHoveredFlashcardFi(null), 200);
                    }}
                    onMouseLeave={() => {
                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                        setHoveredFlashcardFi(null);
                    }}
                    placeholder={ready ? `Paste a ${fromLanguage} sentence — anything from a sign, a book, or a conversation.` : 'Preparing translation service…'}
                    disabled={!ready}
                    data-testid="input-bar"
                    style={{ caretColor: hoveredOriginalText && inputText && !isStreaming && !isPlaying ? 'var(--tk-ink)' : undefined }}
                />
            </div>

            {/* Streaming analysis overlay */}
            {isStreaming && inputText && (
                <div style={{ padding: '10px 16px', background: 'var(--tk-accent-wash)', borderTop: '1px solid var(--tk-rule-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tk-accent)', animation: 'pulse 1s infinite' }} />
                        <span style={{ fontSize: 11.5, color: 'var(--tk-accent)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Analysing</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--tk-ink)' }}>
                        {highlightCurrentWord(inputText, currentWords, currentWordIndex)}
                    </div>
                </div>
            )}

            {/* TTS playback overlay */}
            {isPlaying && inputText && (
                <div style={{ padding: '10px 16px', background: 'var(--tk-paper-deep)', borderTop: '1px solid var(--tk-rule-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--tk-accent)' }} />
                        <span style={{ fontSize: 11.5, color: 'var(--tk-ink-3)', fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Speaking</span>
                    </div>
                    <div style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--tk-ink)' }}>
                        {highlightTextForSpeech(inputText, currentSpeechWordIndex)}
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="tx-input-foot">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button
                        className="tx-icon-btn"
                        title="Listen"
                        onClick={handleSpeak}
                        disabled={loadingTTS || !inputText || isPlaying || !ready}
                    >
                        {loadingTTS ? <Loader2 size={15} className="animate-spin" /> :
                            isPlaying ? <div style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--tk-accent)', animation: 'pulse 1s infinite' }} /> :
                                <Volume2 size={15} />}
                    </button>
                    <button
                        className="tx-icon-btn"
                        title="Clear"
                        onClick={onClear}
                        disabled={!onClear || (!inputText && !localStorage.getItem('response')) || isStreaming || isPlaying}
                    >
                        <X size={14} />
                    </button>
                    <div style={{ borderLeft: '1px solid var(--tk-rule)', margin: '0 4px', height: 16 }} />
                    <span style={{ fontSize: 11, color: 'var(--tk-ink-4)', fontFamily: 'var(--font-mono)' }}>
                        {inputText.length} / 500 · {wordCount}w
                    </span>
                </div>
                {ready ? (
                    <button
                        className="tk-btn tk-btn-primary"
                        onClick={handleTranslation}
                        disabled={isStreaming || !inputText.trim()}
                        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                        {isStreaming ? 'Translating…' : 'Translate'}
                        {!isStreaming && <ArrowRight size={13} />}
                    </button>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--tk-ink-3)' }}>
                        <Loader2 size={13} className="animate-spin" />
                        <span style={{ fontFamily: 'var(--font-mono)' }}>~{countdown}s</span>
                    </div>
                )}
            </div>
        </div>
    );
};
