import { textToSpeech } from "@/chatcompletion/ChatCompletion";
import { useState, useEffect } from "react";

interface InputBarProps {
    inputText: string;
    setInputText: (text: string) => void;
    handleTranslation: () => void;
    ready: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ inputText, setInputText, handleTranslation, ready }) => {
    const [countdown, setCountdown] = useState(60);
    const [audioUrl, setAudioUrl] = useState<string | null>(null)
    const [loadingTTS, setLoadingTTS] = useState(false)

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!ready) {
            timer = setInterval(() => {
                setCountdown(prevCountdown => prevCountdown - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [!ready]);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputText(event.target.value);
    }

    const handleSpeak = async () => {
        if (!inputText) return
        setLoadingTTS(true)
        try {
            const url = await textToSpeech(inputText)
            setAudioUrl(url)
        } catch (error) {
            console.error('Error generating speech:', error)
        } finally {
            setLoadingTTS(false)
        }
    }

    useEffect(() => {
        if (audioUrl) {
            const audio = new Audio(audioUrl)
            audio.play()
        }
    }, [audioUrl])

    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-3">Enter your text</label>
                        <textarea   
                            rows={6}
                            className="placeholder:italic appearance-none block w-full text-base sm:text-lg text-slate-700 border border-slate-300 rounded-lg py-4 px-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                            value={inputText}
                            onChange={handleInputChange}
                            placeholder={ready ? "Type in your sentence here. Complete sentences work better for context-aware translations!" :  "Please wait while we prepare the translation service..."}
                            disabled={!ready}
                            data-testid="input-bar"
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
                        {ready ? (
                            <>
                                <button 
                                    onClick={handleTranslation} 
                                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                                    type="submit"
                                >
                                    🔤 Translate
                                </button>      
                                <button 
                                    onClick={handleSpeak} 
                                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="button" 
                                    disabled={loadingTTS}
                                >
                                    {loadingTTS ? "🎙️ Speaking..." : "🔊 Speak"}
                                </button>              
                            </>
                        ) : (
                            <div className="flex flex-col sm:flex-row justify-between w-full items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-slate-600 font-medium">
                                        Preparing translation service... ({countdown}s)
                                    </span>
                                </div>
                                <button 
                                    type="button" 
                                    className="w-full sm:w-auto bg-slate-400 text-white font-semibold py-3 px-8 rounded-lg cursor-not-allowed opacity-50"
                                    disabled
                                >
                                    Loading...
                                </button>                    
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
