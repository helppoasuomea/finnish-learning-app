import OpenAI from "openai"
import axios from "axios"

const API_KEY = import.meta.env.VITE_GPT_KEY

// SSE streaming types
export type StreamEvent =
    | { type: 'status'; phase: string }
    | { type: 'sentence'; sentence: string }
    | { type: 'word'; word: any; index: number }
    | { type: 'enriched'; sentence: string; words: any[]; confidence?: number; confidenceDetails?: any }
    | { type: 'done' }
    | { type: 'error'; error: string };

// Real SSE streaming translation — yields StreamEvent objects as they arrive
export const chatCompletionStream = async function* (
    data: { language: string, text: string }
): AsyncGenerator<StreamEvent> {
    const { language, text } = data;

    // axios.defaults.baseURL = 'http://localhost:2323/api/' — fetch doesn't inherit it
    const base = (axios.defaults.baseURL as string ?? '').replace(/\/$/, '');
    let response: Response;
    try {
        response = await fetch(`${base}/translate/stream`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, text }),
        });
    } catch (err: any) {
        throw new Error(err.message || 'Network error');
    }

    if (!response.ok) {
        const body = await response.text().catch(() => '');
        try {
            const parsed = JSON.parse(body);
            throw new Error(parsed.error || `HTTP ${response.status}`);
        } catch {
            throw new Error(`HTTP ${response.status}`);
        }
    }

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() ?? '';
        for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            try {
                const event: StreamEvent = JSON.parse(line.slice(6));
                if (event.type === 'error') throw new Error((event as any).error);
                yield event;
            } catch (parseErr: any) {
                if (parseErr.message !== 'Translation failed') throw parseErr;
            }
        }
    }
};

// Original non-streaming function for backward compatibility
// Now calls backend API
export const chatCompletion = async (data: { language: string, text: string}) => {
    const {language, text} = data

    try {
        const response = await axios.post('/translate/simple', {
            language,
            text
        });
        return JSON.stringify(response.data);
    } catch (error: any) {
        console.error('Translation API error:', error);
        // Return a minimal valid JSON instead of throwing
        return JSON.stringify({
            sentence: "Translation failed",
            words: []
        });
    }
}


export const vocabulariesTailor = async (cards: string) => {
    try {
        const response = await axios.post('/vocabularies-tailor', {
            cards
        });
        return JSON.stringify(response.data);
    } catch (error: any) {
        console.error('Vocabularies tailor API error:', error);
        throw new Error(error.response?.data?.error || error.message || 'Vocabularies tailoring failed');
    }
}

export const test = async (word: string) => {
    try {
        const response = await axios.post('/api/test', {
            word
        });
        return JSON.stringify(response.data);
    } catch (error: any) {
        console.error('Test API error:', error);
        throw new Error(error.response?.data?.error || error.message || 'Test failed');
    }
}

export const createTest = async (data: any) => {
    try {
        const response = await axios.post('/create-test', {
            data
        });
        return JSON.stringify(response.data);
    } catch (error: any) {
        console.error('Create test API error:', error);
        throw new Error(error.response?.data?.error || error.message || 'Create test failed');
    }
}

export const textToSpeech = async (text: string) => {
    const openai = new OpenAI({apiKey: API_KEY, dangerouslyAllowBrowser: true})
    const mp3 = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'nova',
        input: text
    })
    const arrayBuffer = await mp3.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(blob);

    return audioUrl;
}