import { useState, useCallback, useMemo, useContext, useEffect, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ChevronRight, Pencil } from "lucide-react";
import { organizeCardsByScore } from "../composables/SortCard";
import useFetchDeck from "../state/hooks/useFetchDeck";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { calculateCompletePercentage } from "@/utils/calculatePercentage";
import { DeckOverview } from "../components/DeckDetailsComponents/DeckOverview";
import { TermsList } from "../components/DeckDetailsComponents/TermsList";
import { AddCardDrawer } from "../components/DeckDetailsComponents/AddCardDrawer";
import { PasteImportDrawer } from "../components/DeckDetailsComponents/PasteImportDrawer";
import { EditDetailsModal } from "../components/DeckDetailsComponents/EditDetailsModal";
import { DeckDetailsSidebar } from "../components/DeckDetailsComponents/DeckDetailsSidebar";
import { MoveCardModal } from "../components/DeckDetailsComponents/MoveCardModal";
import { CramLauncher } from "../components/CramComponents/CramLauncher";
import { DeckContext } from "@/contexts/DeckContext";
import { useFindDuplicates } from "@/state/hooks/useFindDuplicates";
import { useUpdateFavorite } from "@/state/hooks/useUpdateFavorite";
import { Card } from "@/types";

type Tab = "overview" | "terms";

export const DeckDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const { deck, cards, deckName, deckTags, setDeck, setCards } = useFetchDeck(id);
  const { decks, refreshDecks } = useContext(DeckContext);

  const [tab, setTab] = useState<Tab>("overview");
  const [addCardOpen, setAddCardOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [moveCard, setMoveCard] = useState<Card | null>(null);
  const [cramOpen, setCramOpen] = useState(false);

  // On first load, sort the card array once with favorites at top.
  // After that, toggling favorite only changes the star color — position never changes until refresh.
  const initialSortDone = useRef(false);
  useEffect(() => {
    if (!initialSortDone.current && cards.length > 0) {
      initialSortDone.current = true;
      setCards(prev => [...prev].sort((a, b) => {
        if (a.favorite === b.favorite) return 0;
        return a.favorite ? -1 : 1;
      }));
    }
  }, [cards.length]);

  const { stillLearning, notStudied, completed } = organizeCardsByScore(cards);
  const percentage = calculateCompletePercentage(cards);

  useEffect(() => { refreshDecks(); }, []);

  const { duplicates } = useFindDuplicates(cards, decks, id ?? '', deckName);
  const { updateFavorite } = useUpdateFavorite();

  const handleToggleFavorite = useCallback(async (cardId: string, current: boolean) => {
    if (!id) return;
    const newFav = !current;
    setCards(prev => prev.map(c => c._id === cardId ? { ...c, favorite: newFav } : c));
    try {
      await updateFavorite(id, cardId, newFav);
    } catch {
      setCards(prev => prev.map(c => c._id === cardId ? { ...c, favorite: current } : c));
      showToast("Couldn't update favorite");
    }
  }, [id, updateFavorite, setCards]);

  const existingFi = useMemo(
    () => new Set(cards.map(c => c.userLangCard.toLowerCase())),
    [cards]
  );

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleAddCard = useCallback(async (newCard: { userLangCard: string; engCard: string; cardKind: string; type: string; pronunciation: string; comment: string }) => {
    if (!id) return;
    try {
      const res = await axios.put(`/decks/${id}/add-card`, newCard);
      setDeck(res.data);
      setCards(res.data.cards);
      showToast(`Added "${newCard.userLangCard}"`);
    } catch {
      showToast("Failed to add card");
    }
  }, [id, setDeck, setCards]);

  const handleImport = useCallback(async (items: { fi: string; en: string }[]) => {
    if (!id) return;
    const newCards = items.map(it => ({ userLangCard: it.fi, engCard: it.en, type: "other", pronunciation: "", cardScore: 0, favorite: false }));
    try {
      const res = await axios.put(`/decks/${id}`, { cards: newCards });
      setDeck(res.data);
      setCards(res.data.cards);
      showToast(`Imported ${items.length} words`);
    } catch {
      showToast("Failed to import");
    }
  }, [id, setDeck, setCards]);

  const handleSaveDeck = useCallback(async (patch: { deckName: string; description: string; deckTags: string[] }) => {
    if (!id || !deck) return;
    try {
      const res = await axios.put(`/decks/update/${id}`, {
        deckName: patch.deckName,
        deckTags: patch.deckTags,
        description: patch.description,
        deckPercentage: percentage,
        cards,
      });
      setDeck(res.data);
      setCards(res.data.cards);
      showToast("Deck details updated");
    } catch {
      showToast("Failed to save");
    }
  }, [id, deck, cards, percentage, setDeck, setCards]);

  const handleDeleteCard = useCallback(async (cardId: string) => {
    if (!id) return;
    try {
      const res = await axios.delete(`/decks/${id}/cards/${cardId}`);
      setDeck(res.data);
      setCards(res.data.cards);
      showToast("Card deleted");
    } catch {
      showToast("Failed to delete card");
    }
  }, [id, setDeck, setCards]);

  const handleEditCard = useCallback((card: Card) => {
    showToast(`Edit for "${card.userLangCard}" coming soon`);
  }, []);

  const handleMergeDupes = useCallback(async (card: Card) => {
    const dupes = duplicates[card._id];
    if (!dupes?.length) return;
    // Pick keeper deck by highest progress; fall back to current deck
    const allCandidates = [
      { deckId: id!, cardScore: card.cardScore ?? 0, reps: card.reps ?? 0, definition: card.engCard },
      ...dupes.map(d => ({ deckId: d.deckId, cardScore: d.cardScore, reps: d.reps, definition: d.definition })),
    ];
    allCandidates.sort((a, b) => (b.reps - a.reps) || (b.cardScore - a.cardScore));
    const keeper = allCandidates[0];
    // Deduplicate remove decks (exclude keeper)
    const removeDeckIds = [...new Set(allCandidates.slice(1).map(c => c.deckId).filter(d => d !== keeper.deckId))];
    const definitions = [...new Set(allCandidates.map(c => c.definition).filter(Boolean))];
    const mergedEngCard = definitions.join(' / ');
    try {
      await axios.post('/decks/merge-card', { keepDeckId: keeper.deckId, userLangCard: card.userLangCard, removeDeckIds, mergedEngCard });
      refreshDecks();
      const res = await axios.get(`/decks/${id}`);
      setDeck(res.data);
      setCards(res.data.cards);
      showToast(`Merged "${card.userLangCard}" into one card`);
    } catch {
      showToast('Failed to merge');
    }
  }, [id, duplicates, cards, setDeck, setCards, refreshDecks]);

  const handleAcknowledgeDupe = useCallback(async (cardId: string) => {
    try {
      await axios.post(`/decks/${id}/acknowledge-duplicate`, { cardId });
    } catch {
      // silent — local state already updated
    }
  }, [id]);

  const handleRemoveDupes = useCallback(async (card: Card) => {
    const dupes = duplicates[card._id];
    if (!dupes?.length) return;
    // Keep oldest by _id (MongoDB ObjectId is chronological); current card is the reference
    const allCandidates = [{ cardId: card._id, deckId: id! }, ...dupes.map(d => ({ cardId: d.cardId, deckId: d.deckId }))];
    allCandidates.sort((a, b) => a.cardId < b.cardId ? -1 : 1);
    const removePairs = allCandidates.slice(1);
    try {
      await Promise.all(removePairs.map(p => axios.delete(`/decks/${p.deckId}/cards/${p.cardId}`)));
      refreshDecks();
      const res = await axios.get(`/decks/${id}`);
      setDeck(res.data);
      setCards(res.data.cards);
      showToast(`Removed duplicates of "${card.userLangCard}"`);
    } catch {
      showToast('Failed to remove duplicates');
    }
  }, [id, duplicates, setDeck, setCards, refreshDecks]);

  if (!deck) {
    return (
      <div className="tk-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
        <div style={{ color: "var(--tk-ink-3)", fontSize: 14 }}>Loading deck…</div>
      </div>
    );
  }

  const lastStudied = (() => {
    try {
      const timestamps = cards
        .map(c => (c as any).lastSeenAt ?? c.lastReviewDate)
        .filter(Boolean)
        .map(d => new Date(d).getTime())
        .filter(t => !isNaN(t));
      if (!timestamps.length) return "—";
      const latest = Math.max(...timestamps);
      const diffMs = Date.now() - latest;
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1)  return "just now";
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffH = Math.floor(diffMin / 60);
      if (diffH < 24)   return `${diffH}h ago`;
      const diffD = Math.floor(diffH / 24);
      if (diffD === 1)  return "yesterday";
      if (diffD < 30)   return `${diffD}d ago`;
      return new Date(latest).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch { return "—"; }
  })();

  return (
    <div className="tk-page" style={{ maxWidth: 1200 }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--tk-ink-3)" }}>
        <Link to="/view-all-decks" style={{ color: "var(--tk-ink-3)", textDecoration: "none" }}>Library</Link>
        <ChevronRight size={12} />
        <span style={{ color: "var(--tk-ink)" }}>{deckName}</span>
      </div>

      <div className="dd-layout">
        <div>
          {/* Hero */}
          <div className="dd-hero">
            <button className="dd-hero-edit" onClick={() => setEditOpen(true)} title="Edit deck details">
              <Pencil size={14} />
            </button>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 20, paddingRight: 40 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
                  {deckTags.map(t => (
                    <span key={t} className="tk-chip" style={{ background: "var(--tk-accent-wash)", borderColor: "var(--tk-accent-soft)", color: "var(--tk-accent-deep)" }}>{t}</span>
                  ))}
                </div>
                <h1 className="dd-hero-title">{deckName}</h1>
                <p style={{ color: "var(--tk-ink-3)", fontSize: 14, maxWidth: 480, lineHeight: 1.55 }}>
                  {deck.description || ""}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <ProgressRing value={percentage} size={64} stroke={3} />
                <div style={{ fontSize: 11, color: "var(--tk-ink-3)", marginTop: 6, textAlign: "center" }}>complete</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 22, paddingTop: 22, borderTop: "1px solid var(--tk-rule-soft)", flexWrap: "wrap" }}>
              {[
                { label: "Total",         value: cards.length, isText: false },
                { label: "Still learning", value: stillLearning.length, tone: "clay" as const },
                { label: "Completed",     value: completed.length, tone: "accent" as const },
                { label: "Last studied",  value: lastStudied, isText: true },
              ].map(s => (
                <div key={s.label}>
                  <div className="tk-eyebrow" style={{ marginBottom: 4 }}>{s.label}</div>
                  <div style={{
                    fontSize: s.isText ? 14 : 22, lineHeight: 1, fontWeight: s.isText ? 500 : 500,
                    letterSpacing: s.isText ? 0 : "-0.025em",
                    color: s.tone === "accent" ? "var(--tk-accent)" : s.tone === "clay" ? "var(--tk-persimmon)" : "var(--tk-ink)",
                  }}>{String(s.value)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab bar */}
          <div className="dd-tabs">
            {(["overview", "terms"] as Tab[]).map(t => (
              <button key={t} className={`dd-tab ${tab === t ? "is-active" : ""}`} onClick={() => setTab(t)}>
                {t === "overview" ? "Overview" : "Terms"}
              </button>
            ))}
          </div>

          {/* Tab content */}
          {tab === "overview" && (
            <DeckOverview
              deckId={id!}
              deckName={deckName}
              cards={cards}
              stillLearning={stillLearning}
              notStudied={notStudied}
              completed={completed}
              onEditDeck={() => setEditOpen(true)}
              onCram={() => setCramOpen(true)}
            />
          )}
          {tab === "terms" && (
            <TermsList
              cards={cards}
              stillLearning={stillLearning}
              notStudied={notStudied}
              completed={completed}
              onAddCard={() => setAddCardOpen(true)}
              onPasteImport={() => setPasteOpen(true)}
              onDeleteCard={handleDeleteCard}
              onEditCard={handleEditCard}
              onToggleFavorite={handleToggleFavorite}
              crossDeckDupes={duplicates}
              onMergeDupes={handleMergeDupes}
              onRemoveDupes={handleRemoveDupes}
              onAcknowledgeDupe={handleAcknowledgeDupe}
              initialAcknowledged={(deck as any).acknowledgedDuplicates ?? []}
              onMoveCard={setMoveCard}
            />
          )}
        </div>

        {/* Aside */}
        <aside>
          <DeckDetailsSidebar deckId={id!} deckName={deckName} openPublish={searchParams.get("publish") === "1"} />
        </aside>
      </div>

      {cramOpen && deck && (
        <CramLauncher deck={deck} onClose={() => setCramOpen(false)} />
      )}

      <MoveCardModal
        card={moveCard}
        sourceDeckId={id!}
        sourceDeckName={deckName}
        decks={decks}
        onClose={() => setMoveCard(null)}
        onMoved={(destDeckName) => {
          refreshDecks();
          axios.get(`/decks/${id}`).then(r => { setDeck(r.data); setCards(r.data.cards); });
          showToast(`Moved to ${destDeckName} · 1 card`);
        }}
      />

      {/* Drawers / modals */}
      {addCardOpen && (
        <AddCardDrawer
          deckName={deckName}
          existingFi={existingFi}
          onClose={() => setAddCardOpen(false)}
          onAdd={handleAddCard}
        />
      )}
      {pasteOpen && (
        <PasteImportDrawer
          deckName={deckName}
          existingFi={existingFi}
          onClose={() => setPasteOpen(false)}
          onImport={handleImport}
        />
      )}
      {editOpen && deck && (
        <EditDetailsModal
          deckName={deckName}
          description={deck.description || ""}
          deckTags={deckTags}
          onClose={() => setEditOpen(false)}
          onSave={handleSaveDeck}
        />
      )}

      {/* Toast */}
      {toastMsg && (
        <div className="tx-toast" style={{ left: "50%", right: "auto", transform: "translateX(-50%)" }}>
          <div style={{ flex: 1, minWidth: 0, fontSize: 13 }}>{toastMsg}</div>
        </div>
      )}
    </div>
  );
};
