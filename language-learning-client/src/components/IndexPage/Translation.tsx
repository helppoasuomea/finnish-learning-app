export const Translation: React.FC<{text: string}> = ({ text }) => {
    return (
        <div className="w-full">
            <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                            </svg>
                        </div>
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Translation</h3>
                        <blockquote className="relative">
                            <div className="relative">
                                <p className="text-slate-800 leading-relaxed">
                                    <span className="text-xl md:text-2xl font-light italic" data-testid="translation-result">
                                        "{text}"
                                    </span>
                                </p>
                            </div>
                        </blockquote>
                    </div>
                </div>
            </div>
        </div>
    )
}