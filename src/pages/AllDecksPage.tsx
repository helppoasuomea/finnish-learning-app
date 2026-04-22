import { DockCardLarge } from "../components/AllDeckPagesComponents/DockCardLarge"
import { useContext, useState } from "react";
import { DeckContext } from "../contexts/DeckContext";
import { sortAndFilterDecks } from "../utils/sortAndFilterDecks";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

const SORT_OPTS = [
    { key: "recent", label: "Recent" },
    { key: "cards",  label: "Size" },
    { key: "progress", label: "Progress" },
];

export const AllDecks = () => {
    const { decks, refreshDecks } = useContext(DeckContext)

    const [sortBy, setSortBy] = useState('recent')
    const { displayedDecks } = sortAndFilterDecks(decks, sortBy, false)

    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState('');
    const [language, setLanguage] = useState<string>('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const { toast } = useToast();

    const handleTagInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(event.target.value);
    };
    const handleTagInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (["Enter", ",", " "].includes(event.key) && tagInput.trim()) {
            event.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        } else if (event.key === "Backspace" && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };
    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag));
    };

    const resetForm = () => {
        setName(''); setTags([]); setTagInput('');
        setLanguage(''); setDescription(''); setVisibility('public');
    };

    const handleAddDeck = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post('/decks', {
                deckName: name,
                deckTags: [language, ...tags].filter(Boolean),
                description,
                visibility
            });
            refreshDecks();
            setOpen(false);
            toast({ title: `${name} added!`, description: `Now you can add flashcards into it.` });
            resetForm();
        } catch {
            toast({ title: 'Error', description: "Couldn't create your deck.", variant: 'destructive' });
        }
    };

    const previewDeck = {
        _id: 'preview',
        deckName: name || 'Deck Name',
        deckTags: [language, ...tags].filter(Boolean),
        cards: [],
        deckPercentage: '0',
        description,
    };

    const totalCards = decks.reduce((s: number, d: any) => s + (d.cards?.length || 0), 0);

    const newDeckDialog = (
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
            <DialogContent className="w-full max-w-lg sm:max-w-2xl p-3 sm:p-6 overflow-y-auto max-h-[95vh]">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-2xl">Create a New Deck</DialogTitle>
                    <DialogDescription className="text-xs sm:text-base">Fill in the details below to create a new deck.</DialogDescription>
                </DialogHeader>
                <form className="grid gap-3 sm:gap-4 py-2 sm:py-4" onSubmit={handleAddDeck}>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="deck-name">Name *</Label>
                        <Input id="deck-name" value={name} onChange={e => setName(e.target.value)} required placeholder="Name of the new deck" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="deck-language">Language (optional)</Label>
                        <Select value={language} onValueChange={setLanguage}>
                            <SelectTrigger id="deck-language"><SelectValue placeholder="Select language" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Finnish">🇫🇮 Finnish</SelectItem>
                                <SelectItem value="Vietnamese">🇻🇳 Vietnamese</SelectItem>
                                <SelectItem value="Korean">🇰🇷 Korean</SelectItem>
                                <SelectItem value="Chinese">🇨🇳 Chinese</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="deck-tags">Tags</Label>
                        <Input
                            id="deck-tags" value={tagInput}
                            onChange={handleTagInputChange} onKeyDown={handleTagInputKeyDown}
                            placeholder="Type a tag and press Enter" autoComplete="off"
                        />
                        <div className="flex flex-wrap gap-1 mt-1">
                            {tags.map(tag => (
                                <Badge key={tag} className="flex items-center gap-1 px-2 py-1 text-xs">
                                    {tag}
                                    <button type="button" className="ml-1" onClick={() => handleRemoveTag(tag)}>
                                        <X className="w-3 h-3" />
                                    </button>
                                </Badge>
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">Press Enter, comma, or space to add a tag.</span>
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="deck-description">Description (optional)</Label>
                        <Textarea id="deck-description" value={description} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} placeholder="Describe this deck..." />
                    </div>
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="deck-visibility">Visibility</Label>
                        <Select value={visibility} onValueChange={v => setVisibility(v as 'public' | 'private')}>
                            <SelectTrigger id="deck-visibility"><SelectValue placeholder="Select visibility" /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="public">Public</SelectItem>
                                <SelectItem value="private">Private</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Create Deck</Button>
                    </DialogFooter>
                </form>
                <div className="mt-4 border-t pt-4">
                    <div className="text-xs text-muted-foreground mb-2">Preview</div>
                    <DockCardLarge deck={previewDeck} />
                </div>
            </DialogContent>
        </Dialog>
    );

    return (
        <div className="min-h-screen" style={{ background: "var(--tk-paper)" }}>
            <div className="tk-page">
                {/* Header */}
                <div className="tk-page-header">
                    <div>
                        <div className="tk-eyebrow mb-2">Library</div>
                        <h1 className="tk-page-title">Your shelves</h1>
                        <p style={{ color: "var(--tk-ink-3)", fontSize: 14, marginTop: 6 }}>
                            {decks.length} {decks.length === 1 ? "deck" : "decks"} · {totalCards} cards in rotation
                        </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div className="dk-sort-bar">
                            {SORT_OPTS.map(opt => (
                                <button
                                    key={opt.key}
                                    className={`dk-sort-btn${sortBy === opt.key ? " is-active" : ""}`}
                                    onClick={() => setSortBy(opt.key)}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                        <button className="tk-btn tk-btn-primary" style={{ whiteSpace: "nowrap" }} onClick={() => setOpen(true)}>
                            + New Deck
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="dk-grid">
                    {displayedDecks.map((deck: any) => (
                        <DockCardLarge key={deck._id} deck={deck} />
                    ))}
                    <button className="dk-new-card" onClick={() => setOpen(true)}>
                        <Plus size={20} />
                        <span style={{ fontSize: 13, fontWeight: 500 }}>Start a new deck</span>
                    </button>
                </div>
            </div>

            {newDeckDialog}
        </div>
    )
}
