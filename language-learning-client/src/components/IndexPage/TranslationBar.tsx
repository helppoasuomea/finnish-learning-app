import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import React from 'react';

export const TranslationBar: React.FC<{
    fromLanguage: string;
    setFromLanguage: (language: string) => void;
}> = ({ fromLanguage, setFromLanguage }) => {
    const languages = ['Finnish', 'Korean', 'Chinese', 'Vietnamese', 'Greek'];
    const handleLanguageChange = (language: string) => {
        setFromLanguage(language);
    }
    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                    {/* Source Language */}
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm font-medium text-slate-600 mb-2">From</label>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="w-full py-3 px-4 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200">
                                    <div className="text-lg font-semibold">{fromLanguage}</div>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full max-w-xs">
                                <DropdownMenuRadioGroup>
                                    {languages.map(language => (
                                        language !== fromLanguage && (
                                            <DropdownMenuRadioItem onClick={() => handleLanguageChange(language)} key={language} value={language}>
                                                <div className="text-base font-medium">{language}</div>
                                            </DropdownMenuRadioItem>
                                        )
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    {/* Arrow */}
                    <div className="flex items-center justify-center py-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </div>
                    </div>
                    
                    {/* Target Language */}
                    <div className="flex-1 max-w-xs">
                        <label className="block text-sm font-medium text-slate-600 mb-2">To</label>
                        <button type="button" className="w-full py-3 px-4 inline-flex items-center justify-center text-lg font-semibold rounded-lg border border-slate-300 bg-slate-50 text-slate-700 cursor-default">
                            English
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
