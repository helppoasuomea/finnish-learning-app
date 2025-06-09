import { Word } from "@/types"
import { Modal } from "./WordModal"
import React from "react";

interface WordCategoryProps {
    title: string;
    words: Word[]
}

const WordCategory: React.FC<WordCategoryProps> = ({ title, words }) => (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-4">
            <h3 className="text-lg font-bold text-white">{title}</h3>
        </div>
        <div className="p-4">
            <div className="flex flex-wrap gap-2">
                {words.map((word, index) => (
                    <Modal key={index} word={word} />
                ))}
            </div>
        </div>
    </div>
)

export const WordDetails: React.FC<{words: Word[]}> = ({ words }) => {
    const categories = [
        { title: 'Verbs', words: words.filter(word => word.type === 'verb' )},
        { title: 'Nouns', words: words.filter(word => word.type === 'noun' )},
        { title: 'Adjectives', words: words.filter(word => word.type === 'adjective') },
        { title: 'Others', words: words.filter(word => !["verb", "noun", "adjective"].includes(word.type))}
    ]
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {categories.map((category, index) => (
                    <WordCategory key={index} title={category.title} words={category.words} />
                ))}
            </div>
        </div>
    )
}