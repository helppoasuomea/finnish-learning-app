import { DockCardLarge } from "../components/AllDeckPagesComponents/DockCardLarge"
import { useContext, useState } from "react";
import { DeckContext } from "../contexts/DeckContext";
import { sortAndFilterDecks } from "../utils/sortAndFilterDecks";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Plus, X } from "lucide-react";

const SORT_OPTS = [
    { key: "recent", label: "Recent" },
    { key: "cards",  label: "Size" },
    { key: "progress", label: "Progress" },
];

const LEVELS = ["A1", "A2", "B1", "B2"] as const;
type Level = typeof LEVELS[number];

const RETENTION_GOALS = [
    { tier: "seedling", label: "Seedling", sub: "A few days · just curious" },
    { tier: "sapling",  label: "Sapling",  sub: "A few weeks · phrasebook" },
    { tier: "tree",     label: "Tree",      sub: "Months · everyday vocabulary" },
    { tier: "heartwood",label: "Heartwood", sub: "Years · core fluency" },
] as const;
type Tier = typeof RETENTION_GOALS[number]["tier"];

const QUICK_TAGS = ["travel", "food", "work", "grammar"];

export const AllDecks = () => {
    const { decks, refreshDecks } = useContext(DeckContext);
    const [sortBy, setSortBy] = useState("recent");
    const { displayedDecks } = sortAndFilterDecks(decks, sortBy, false);
    const { toast } = useToast();

    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [level, setLevel] = useState<Level>("A1");
    const [tier, setTier] = useState<Tier>("sapling");

    const resetForm = () => {
        setName(""); setDescription(""); setTags([]);
        setTagInput(""); setLevel("A1"); setTier("sapling");
    };

    const addTag = (t: string) => {
        const clean = t.trim().toLowerCase();
        if (clean && tags.length < 4 && !tags.includes(clean)) setTags([...tags, clean]);
    };
    const removeTag = (t: string) => setTags(tags.filter(x => x !== t));

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (["Enter", ",", " "].includes(e.key) && tagInput.trim()) {
            e.preventDefault();
            addTag(tagInput);
            setTagInput("");
        } else if (e.key === "Backspace" && !tagInput && tags.length > 0) {
            setTags(tags.slice(0, -1));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        try {
            await axios.post("/decks", {
                deckName: name.trim(),
                deckTags: tags,
                description: description.trim(),
                level,
                memoryGoal: { tier },
            });
            refreshDecks();
            setOpen(false);
            resetForm();
            toast({ title: `"${name}" shelf created!` });
        } catch {
            toast({ title: "Error", description: "Couldn't create the shelf.", variant: "destructive" });
        }
    };

    const previewDeck = {
        _id: "preview",
        deckName: name || "Shelf name",
        deckTags: tags,
        cards: [],
        deckPercentage: "0",
        description,
        level,
        memoryGoal: { tier },
    };

    const totalCards = decks.reduce((s: number, d: any) => s + (d.cards?.length || 0), 0);

    return (
        <div className="min-h-screen" style={{ background: "var(--tk-paper)" }}>
            <div className="tk-page">
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
                            + New deck
                        </button>
                    </div>
                </div>

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

            {/* ── New shelf dialog ── */}
            {open && (
                <div
                    style={{
                        position: "fixed", inset: 0, zIndex: 50,
                        background: "rgba(0,0,0,0.45)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        padding: 16,
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); resetForm(); } }}
                >
                    <div
                        style={{
                            background: "#fff",
                            borderRadius: 16,
                            width: "100%",
                            maxWidth: 860,
                            maxHeight: "90vh",
                            overflowY: "auto",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: "28px 32px 0", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div style={{ fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--tk-ink-3)", fontFamily: "var(--tk-mono)", marginBottom: 6 }}>
                                    Create
                                </div>
                                <h2 style={{ fontSize: 26, fontWeight: 600, color: "var(--tk-ink)", margin: 0, lineHeight: 1.1 }}>
                                    A new shelf
                                </h2>
                            </div>
                            <button
                                onClick={() => { setOpen(false); resetForm(); }}
                                style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--tk-ink-3)", marginTop: 4 }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body */}
                        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
                            <div style={{ padding: "24px 32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                                {/* Left column */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    {/* Name */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                            <label style={labelStyle}>Name</label>
                                            <span style={hintStyle}>What would you call this shelf?</span>
                                        </div>
                                        <input
                                            autoFocus
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            placeholder="Weekend phrases"
                                            required
                                            style={inputStyle}
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                            <label style={labelStyle}>Description</label>
                                            <span style={hintStyle}>Optional · for your future self</span>
                                        </div>
                                        <textarea
                                            value={description}
                                            onChange={e => setDescription(e.target.value)}
                                            placeholder="What's this shelf for?"
                                            rows={3}
                                            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
                                        />
                                    </div>

                                    {/* Tags */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                                            <label style={labelStyle}>Tags</label>
                                            <span style={hintStyle}>Up to 4 · helps you find it later</span>
                                        </div>
                                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "8px 10px", border: "1px solid var(--tk-rule)", borderRadius: 8, minHeight: 40, alignItems: "center" }}>
                                            {tags.map(t => (
                                                <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "var(--tk-accent-wash)", color: "var(--tk-accent-deep)", borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 500 }}>
                                                    {t}
                                                    <button type="button" onClick={() => removeTag(t)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 1, color: "var(--tk-accent-deep)" }}>
                                                        <X size={11} />
                                                    </button>
                                                </span>
                                            ))}
                                            {tags.length < 4 && (
                                                <input
                                                    value={tagInput}
                                                    onChange={e => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagKeyDown}
                                                    placeholder={tags.length === 0 ? "+ tag (e.g. travel)" : ""}
                                                    style={{ border: "none", outline: "none", fontSize: 13, flex: 1, minWidth: 80, background: "transparent", color: "var(--tk-ink)" }}
                                                />
                                            )}
                                        </div>
                                        {tags.length < 4 && (
                                            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
                                                {QUICK_TAGS.filter(t => !tags.includes(t)).map(t => (
                                                    <button
                                                        key={t} type="button"
                                                        onClick={() => addTag(t)}
                                                        style={{ fontSize: 12, color: "var(--tk-ink-3)", background: "none", border: "1px solid var(--tk-rule)", borderRadius: 99, padding: "2px 10px", cursor: "pointer" }}
                                                    >
                                                        + {t}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right column */}
                                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                    {/* Level */}
                                    <div>
                                        <label style={{ ...labelStyle, marginBottom: 10, display: "block" }}>Level</label>
                                        <div style={{ display: "flex", gap: 8 }}>
                                            {LEVELS.map(l => (
                                                <button
                                                    key={l} type="button"
                                                    onClick={() => setLevel(l)}
                                                    style={{
                                                        padding: "6px 16px", borderRadius: 99, fontSize: 13, fontWeight: 500,
                                                        border: "1.5px solid",
                                                        borderColor: level === l ? "var(--tk-ink)" : "var(--tk-rule)",
                                                        background: level === l ? "var(--tk-ink)" : "transparent",
                                                        color: level === l ? "#fff" : "var(--tk-ink-2)",
                                                        cursor: "pointer",
                                                        transition: "all 150ms",
                                                    }}
                                                >
                                                    {l}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Retention goal */}
                                    <div>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                                            <label style={labelStyle}>Retention goal</label>
                                            <span style={hintStyle}>How long should these stick?</span>
                                        </div>
                                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                            {RETENTION_GOALS.map(g => (
                                                <button
                                                    key={g.tier} type="button"
                                                    onClick={() => setTier(g.tier)}
                                                    style={{
                                                        display: "flex", alignItems: "center", gap: 12,
                                                        padding: "10px 14px", borderRadius: 10,
                                                        border: "1.5px solid",
                                                        borderColor: tier === g.tier ? "var(--tk-accent)" : "var(--tk-rule)",
                                                        background: tier === g.tier ? "var(--tk-accent-wash)" : "transparent",
                                                        cursor: "pointer", textAlign: "left", width: "100%",
                                                        transition: "all 150ms",
                                                    }}
                                                >
                                                    <span style={{
                                                        width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                                                        border: `2px solid ${tier === g.tier ? "var(--tk-accent)" : "var(--tk-ink-4)"}`,
                                                        background: tier === g.tier ? "var(--tk-accent)" : "transparent",
                                                        display: "flex", alignItems: "center", justifyContent: "center",
                                                    }} />
                                                    <div>
                                                        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--tk-ink)", lineHeight: 1.2 }}>{g.label}</div>
                                                        <div style={{ fontSize: 11.5, color: "var(--tk-ink-3)", marginTop: 1 }}>{g.sub}</div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Preview */}
                                    <div>
                                        <label style={{ ...labelStyle, marginBottom: 8, display: "block" }}>Preview</label>
                                        <DockCardLarge deck={previewDeck} />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div style={{
                                padding: "16px 32px 24px",
                                display: "flex", alignItems: "center", justifyContent: "space-between",
                                borderTop: "1px solid var(--tk-rule)",
                            }}>
                                <span style={{ fontSize: 12, fontFamily: "var(--tk-mono)", color: "var(--tk-ink-3)" }}>
                                    → empty shelf · add cards from Translate or Vocab
                                </span>
                                <div style={{ display: "flex", gap: 10 }}>
                                    <button
                                        type="button"
                                        onClick={() => { setOpen(false); resetForm(); }}
                                        style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid var(--tk-rule)", background: "transparent", cursor: "pointer", fontSize: 14, color: "var(--tk-ink-2)" }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!name.trim()}
                                        style={{
                                            padding: "8px 20px", borderRadius: 8, border: "none",
                                            background: name.trim() ? "#2d4438" : "var(--tk-ink-5)",
                                            color: "#fff", cursor: name.trim() ? "pointer" : "not-allowed",
                                            fontSize: 14, fontWeight: 500,
                                            transition: "background 150ms",
                                        }}
                                    >
                                        Create shelf →
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const labelStyle: React.CSSProperties = {
    fontSize: 10.5,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    fontFamily: "var(--tk-mono)",
    color: "var(--tk-ink-3)",
    fontWeight: 500,
};

const hintStyle: React.CSSProperties = {
    fontSize: 11.5,
    color: "var(--tk-ink-4)",
    fontStyle: "italic",
};

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid var(--tk-rule)",
    borderRadius: 8,
    fontSize: 14,
    color: "var(--tk-ink)",
    background: "var(--tk-paper)",
    outline: "none",
    boxSizing: "border-box",
};
