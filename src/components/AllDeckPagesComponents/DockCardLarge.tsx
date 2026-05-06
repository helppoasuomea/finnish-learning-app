import React, { useState } from "react";
import { calculateCompletePercentage } from "@/utils/calculatePercentage";
import { MoreVertical, Eye, Trash2, ArrowRight, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { DeckContext } from "@/contexts/DeckContext";
import { useContext } from "react";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { getTimeStamp } from "@/utils/getTimestamp";

const TONE: Record<string, string> = {
    Finnish: "var(--tk-tag-moss)",
    Vietnamese: "var(--tk-tag-clay)",
    Korean: "var(--tk-tag-plum)",
    Chinese: "var(--tk-tag-sky)",
    A1: "var(--tk-tag-moss)", A2: "var(--tk-tag-moss)",
    B1: "var(--tk-tag-sky)", B2: "var(--tk-tag-sky)",
    food: "var(--tk-tag-clay)", nature: "var(--tk-tag-sky)",
    social: "var(--tk-tag-plum)", grammar: "var(--tk-tag-plum)",
    travel: "var(--tk-tag-wheat)", work: "var(--tk-tag-plum)",
};

function relativeTime(id: string): string {
    const d = getTimeStamp(id);
    const sec = Math.floor((Date.now() - d.getTime()) / 1000);
    if (sec < 60) return "just now";
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
    if (sec < 86400 * 30) return `${Math.floor(sec / 86400)}d ago`;
    if (sec < 86400 * 365) return `${Math.floor(sec / (86400 * 30))}mo ago`;
    return `${Math.floor(sec / (86400 * 365))}yr ago`;
}

export const DockCardLarge: React.FC<{
    deck: {
        _id: string;
        deckName: string;
        deckPercentage?: string;
        deckTags: string[];
        cards: any[];
        description?: string;
    };
    mergeProps?: { isSelected: boolean; onSelect: () => void };
}> = ({ deck, mergeProps }) => {
    const { deckName, deckTags, cards, _id, description } = deck;
    const { toast } = useToast();
    const { refreshDecks } = useContext(DeckContext);
    const navigate = useNavigate();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);

    const percentage = calculateCompletePercentage(cards);
    const numTerms = cards.length;
    const toneColor = TONE[deckTags[0]] ?? "var(--tk-ink-5)";
    const isMerge = !!mergeProps;
    const isSelected = mergeProps?.isSelected ?? false;

    const handleDeleteDeck = async () => {
        setDeleting(true);
        try {
            await axios.delete(`/decks/${_id}`);
            toast({ title: "Deck deleted", description: `"${deckName}" has been deleted.` });
            setDeleteDialogOpen(false);
            setDeleteConfirm("");
            refreshDecks();
        } catch {
            toast({ title: "Error", description: "Failed to delete deck", variant: "destructive" });
        } finally {
            setDeleting(false);
        }
    };

    const cardBody = (
        <>
            <div className="dk-card-spine" style={{ background: toneColor }} />

            {/* Tags + progress ring */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {deckTags.map((tag, i) => (
                        <span key={i} className="dk-tag-pill">
                            <span className="dk-tag-dot" style={{ background: i === 0 ? toneColor : "var(--tk-ink-5)" }} />
                            {tag}
                        </span>
                    ))}
                </div>
                <div style={{ position: "relative" }}>
                    <ProgressRing value={percentage} size={38} stroke={2.5} />
                    {isSelected && (
                        <span style={{
                            position: "absolute", top: -4, right: -4,
                            width: 16, height: 16, borderRadius: "50%",
                            background: "#2d4438", color: "#fff",
                            fontSize: 9, fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                            1
                        </span>
                    )}
                </div>
            </div>

            <div className="dk-card-title">{deckName}</div>
            {description && <div className="dk-card-desc">{description}</div>}

            <div className="dk-card-foot">
                <div className="dk-card-foot-meta">
                    <span>{numTerms} {numTerms === 1 ? "card" : "cards"}</span>
                    {_id !== "preview" && (
                        <>
                            <span style={{ color: "var(--tk-ink-5)" }}>·</span>
                            <span>{relativeTime(_id)}</span>
                        </>
                    )}
                </div>

                {isSelected ? (
                    <Check size={16} style={{ color: "#2d4438" }} />
                ) : isMerge ? null : (
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate(`/view-decks/${_id}`); }}
                            className="tk-btn"
                            style={{ padding: "4px 10px", fontSize: 12, gap: 4, display: "inline-flex", alignItems: "center" }}
                            aria-label="Study"
                        >
                            Study <ArrowRight size={11} />
                        </button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                                    style={{ padding: 4, color: "var(--tk-ink-4)", borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}
                                    aria-label="More options"
                                >
                                    <MoreVertical size={14} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44">
                                <DropdownMenuItem asChild>
                                    <Link to={`/view-decks/${_id}`} className="flex items-center gap-2 cursor-pointer" onClick={e => e.stopPropagation()}>
                                        <Eye size={14} /> View Details
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={e => { e.preventDefault(); e.stopPropagation(); setDeleteDialogOpen(true); }}
                                    className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                                >
                                    <Trash2 size={14} className="mr-2" /> Delete Deck
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}
            </div>
        </>
    );

    return (
        <>
            {isMerge ? (
                <div
                    data-testid="deck-card-container"
                    className="dk-card"
                    onClick={isSelected ? undefined : mergeProps?.onSelect}
                    style={{
                        cursor: isSelected ? "default" : "pointer",
                        outline: isSelected ? "2px solid #2d4438" : undefined,
                        outlineOffset: isSelected ? "2px" : undefined,
                    }}
                >
                    {cardBody}
                </div>
            ) : (
                <Link to={`/view-decks/${_id}`} data-testid="deck-card-container" className="dk-card">
                    {cardBody}
                </Link>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent onClick={e => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Deck</AlertDialogTitle>
                        <AlertDialogDescription>
                            {cards?.length > 0 ? (
                                <>
                                    Delete "{deckName}"? This permanently removes {numTerms} {numTerms === 1 ? "card" : "cards"}.
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Type "DELETE" to confirm:</p>
                                        <input
                                            type="text" value={deleteConfirm}
                                            onChange={e => setDeleteConfirm(e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                            placeholder="DELETE" onClick={e => e.stopPropagation()}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>This deck has no cards. It will be deleted permanently.</>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={e => e.stopPropagation()}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={e => { e.stopPropagation(); handleDeleteDeck(); }}
                            disabled={deleting || (cards?.length > 0 && deleteConfirm !== "DELETE")}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {deleting ? "Deleting..." : "Delete Deck"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
