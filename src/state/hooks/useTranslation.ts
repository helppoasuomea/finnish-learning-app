import { useState, useEffect } from "react";
import { chatCompletionStream, chatCompletion } from "@/chatcompletion/ChatCompletion";
import { v4 as uuidv4 } from 'uuid'
import jsonData from '../../../words.json'

export type StreamPhase = 'idle' | 'reading' | 'words' | 'enriching' | 'done';

const useTranslation = () => {
    const [fromLanguage, setFromLanguage] = useState('Finnish')
    const [inputText, setInputText] = useState('')
    const [ready, setReady] = useState(true)
    const [isStreaming, setIsStreaming] = useState(false)
    const [streamPhase, setStreamPhase] = useState<StreamPhase>('idle')
    const [validationError, setValidationError] = useState<string | null>(null)
    const [response, setResponse] = useState(() => {
        const storedResponse = localStorage.getItem('response')
        return storedResponse ? JSON.parse(storedResponse) : null
    })

    const handleTranslationStream = async () => {
        localStorage.removeItem('response');
        setValidationError(null);
        setReady(false)
        setIsStreaming(true)
        setStreamPhase('reading')
        setResponse(null)

        if (inputText.trim().toLowerCase() === 'test') {
            const parsedResponse: any = jsonData;
            const { sentence, words, confidence, confidenceDetails } = parsedResponse;
            const testResponse: any = {
                originalText: inputText,
                sentence,
                words: words?.map((word: any) => ({ ...word, id: uuidv4() })),
                confidence,
                confidenceDetails,
            };
            setResponse(testResponse);
            localStorage.setItem("response", JSON.stringify(testResponse));
            localStorage.setItem("fromLanguage", fromLanguage);
            setReady(true);
            setIsStreaming(false);
            setStreamPhase('done');
            return;
        }

        // Track word ids emitted so far for deduplication on enriched batch
        const wordIdMap = new Map<number, string>(); // index → id

        try {
            const stream = chatCompletionStream({ language: fromLanguage, text: inputText });

            for await (const event of stream) {
                switch (event.type) {
                    case 'status':
                        setStreamPhase('reading');
                        break;

                    case 'sentence':
                        setResponse((prev: any) => ({ ...prev, sentence: event.sentence, originalText: inputText }));
                        setStreamPhase('words');
                        break;

                    case 'word': {
                        const word = { ...event.word, id: event.word.id || uuidv4() };
                        wordIdMap.set(event.index, word.id);
                        setResponse((prev: any) => {
                            const existing: any[] = prev?.words || [];
                            // Don't duplicate
                            if (existing.some((w: any) => w.id === word.id)) return prev;
                            return { ...prev, words: [...existing, word] };
                        });
                        break;
                    }

                    case 'enriched': {
                        setStreamPhase('enriching');
                        const enrichedWords = event.words.map((w: any, i: number) => ({
                            ...w,
                            id: wordIdMap.get(i) || w.id || uuidv4(),
                        }));
                        const finalResponse: any = {
                            originalText: inputText,
                            sentence: event.sentence,
                            words: enrichedWords,
                        };
                        if (event.confidence != null) finalResponse.confidence = event.confidence;
                        if (event.confidenceDetails) finalResponse.confidenceDetails = event.confidenceDetails;
                        setResponse(finalResponse);
                        localStorage.setItem('response', JSON.stringify(finalResponse));
                        localStorage.setItem('fromLanguage', fromLanguage);
                        break;
                    }

                    case 'done':
                        setStreamPhase('done');
                        break;
                }
            }

            setReady(true);
            setIsStreaming(false);
            setStreamPhase('idle');
        } catch (error) {
            console.error('Streaming translation error:', error);
            setReady(true);
            setIsStreaming(false);
            setStreamPhase('idle');

            if (error instanceof Error) {
                setValidationError(error.message);
                return;
            }

            // Fallback to non-streaming
            try {
                const response_json = await chatCompletion({ language: fromLanguage, text: inputText });
                if (response_json !== null) {
                    const parsedResponse = JSON.parse(response_json);
                    const { sentence, words, confidence, confidenceDetails } = parsedResponse;
                    const finalResponse: any = {
                        originalText: inputText,
                        sentence,
                        words: words?.map((word: any) => ({ ...word, id: uuidv4() })) || []
                    };
                    if (confidence != null) finalResponse.confidence = confidence;
                    if (confidenceDetails) finalResponse.confidenceDetails = confidenceDetails;
                    setResponse(finalResponse);
                    localStorage.setItem('response', JSON.stringify(finalResponse));
                    localStorage.setItem('fromLanguage', fromLanguage);
                }
            } catch (fallbackError) {
                console.error('Fallback translation error:', fallbackError);
            }
        }
    }

    useEffect(() => {
        const storedFromLanguage = localStorage.getItem('fromLanguage')
        if (storedFromLanguage) setFromLanguage(storedFromLanguage)
    }, [])

    const refreshResponseFromStorage = () => {
        const storedResponse = localStorage.getItem('response');
        setResponse(storedResponse ? JSON.parse(storedResponse) : null);
    };

    return {
        fromLanguage,
        setFromLanguage,
        inputText,
        setInputText,
        ready,
        isStreaming,
        streamPhase,
        validationError,
        response,
        handleTranslation: handleTranslationStream, // backward-compat alias
        handleTranslationStream,
        refreshResponseFromStorage,
    }
}

export default useTranslation
