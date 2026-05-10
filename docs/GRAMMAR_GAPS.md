# Finnish Grammar Curriculum — Missing Topics

**Companion to:** `GRAMMAR_AUDIT.md` (which covered errors and gaps *within* existing topics).
**This document covers:** Topics and topic-areas that are **entirely absent** from `catalog.ts` — things a complete A1→B2 Finnish curriculum *should* teach but currently has no entry for at all.

---

## How I built this list

I cross-referenced the 56 entries in `catalog.ts` against:

1. The standard A1→B2 Finnish curriculum (Common European Framework, YKI exam descriptors)
2. The pain-point map for English-speaking learners (where we actually live)
3. What our **own morphology pipeline (Voikko)** can identify but currently has no topic to route to (these are the most painful, because the user clicks "Open topic" and lands on something half-relevant)
4. ISK (Iso suomen kielioppi) and Karlsson's *Finnish: An Essential Grammar* tables of contents

I deliberately **excluded**:

- The 10 stub topics from the audit (already known to be missing — those are written-but-not-published)
- Issues *within* existing topics (covered in `GRAMMAR_AUDIT.md`)

---

## Summary

| Severity | Count | Description |
|---|---|---|
| 🔴 **Foundational missing** | 5 | A1/A2 topics every Finnish course teaches; we don't |
| 🟠 **High-leverage missing** | 6 | B1-level topics learners hit constantly, currently nowhere |
| 🟡 **Reference/scaffolding** | 4 | Cheat-sheet topics that pull existing material together |
| ⚪ **Phonology/orthography** | 3 | Pronunciation-level topics, useful for absolute beginners |
| 🔵 **Voikko dead-ends** | 4 | Voikko can identify these morphologies but has no topic to route to |

---

## 🔴 Foundational missing — A1/A2 topics with NO entry in the catalog

### F-1. **Adjective inflection and agreement** (A1) ← *the single biggest gap*

**Status:** Completely absent from catalog. Adjectives are mentioned in passing in `nominative` (predicative complement) and `comparative` (degree formation), but the **core rule that adjectives agree with their head noun in case AND number** is taught nowhere.

**Why it matters:** This is the single most-encountered grammatical phenomenon in Finnish. Every noun phrase with a modifier requires it. When Voikko parses `kauniissa talossa` it identifies both words but the user has no topic to learn:
- Why both end in `-ssa`
- That adjectives precede nouns in agreement
- How adjective stems alternate (kaunis → kaunii- → kauniissa)
- That predicative vs attributive position matters (`Talo on kaunis` vs `kaunis talo`)

**Suggested topic:**
- **id:** `adjective-agreement`
- **category:** syntax (or could go under cases as cross-cutting)
- **level:** A1
- **prerequisites:** `nominative`, `genitive`, `partitive`
- **Sections:**
  1. Predicative vs attributive position (`Talo on kaunis` vs `kaunis talo`)
  2. Singular agreement: case match with the noun
  3. Plural agreement: number match in addition to case
  4. Adjective stem types (kaunis-class, hyvä-class, vanha-class, uusi-class)
  5. Common A1 adjectives in all 6 locative cases (table)

**Real-world frequency:** Every paragraph of Finnish prose uses this pattern multiple times.

---

### F-2. **Verbal rection (verbirektio)** (A2–B1) ← *the second biggest gap*

**Status:** Completely absent. Each verb topic mentions which case its complements take in passing, but there's no centralised treatment of the system.

**Why it matters:** Finnish is a **case-marking language**, and which case a verb requires for its object/complement is **lexically determined** — not predictable from meaning. This is the #1 long-term frustration for advanced learners.

Examples that have no shared home today:
- `pitää + elatiivi` → `pidän kahvista` (I like coffee)
- `rakastua + illatiivi` → `rakastun kissoihin` (I fall in love with cats)
- `väsyä + illatiivi` → `väsyin työhön` (I got tired of work)
- `keskustella + adessiivi` → `keskustelen kollegan kanssa` (I talk with a colleague)
- `auttaa + partitiivi` → `autan ystävää` (I help a friend)
- `odottaa + partitiivi` → `odotan junaa` (I wait for the train)
- `tutustua + illatiivi` → `tutustun ihmisiin` (I get to know people)
- `vastata + illatiivi/allatiivi` → `vastaan kysymykseen / kollegalle`
- `lähteä + illatiivi/allatiivi/elatiivi` → three different meanings!

**Suggested topic:**
- **id:** `verbal-rection`
- **category:** verbs
- **level:** A2 (basic) → B1 (depth)
- **prerequisites:** all 6 locative cases, partitive
- **Sections:**
  1. The principle: verb dictates case
  2. Verbs taking partitive (auttaa, odottaa, rakastaa, kuunnella…)
  3. Verbs taking elative (pitää, puhua, kertoa…)
  4. Verbs taking illative (rakastua, väsyä, tutustua, uskoa…)
  5. Verbs taking adessive (puhua + kanssa, keskustella…)
  6. Verbs taking allative (sanoa, antaa, vastata…)
  7. Verbs that change meaning with case (lähteä, käydä, kääntyä)
  8. **Reference table** — top 50 high-frequency verbs and their rections

**Real-world frequency:** This is the #1 reason intermediate learners sound non-native. They use the right verb but wrong case. Without this topic, learners are essentially memorising rections one-by-one in a cloud.

---

### F-3. **Existential & possessive sentences** (A1)

**Status:** Brief 4-example mention inside `word-order` (`wo-existential` section), and the "minulla on" pattern surfaces inside `pronouns` and indirectly in `adessive`. No standalone topic.

**Why it matters:** These are TWO of the first three sentence patterns a learner builds. They have a structurally distinctive grammar (3sg verb, partitive subject, location-fronted) that contradicts the rules taught in basic-clause topics.

**Suggested topic:**
- **id:** `existential-possessive-sentences`
- **category:** syntax
- **level:** A1
- **prerequisites:** `inessive`, `adessive`, `partitive`
- **Sections:**
  1. Existential: `Pöydällä on kirja` (location + on + nom/part subject)
  2. Possessive: `Minulla on koira` (adessive owner + on + subject)
  3. Verb stays singular even with plural subject (`Pöydällä on kirjoja`)
  4. Negative form: `Pöydällä ei ole kirjaa` (subject → partitive)
  5. With plural subjects: `Minulla on kissoja` (partitive plural under "indefinite")
  6. The unique "ownership" verbs: `omistaa, kuulua` and how they differ from `olla`

**Real-world frequency:** Used in basically every dialogue from week 1 of Finnish study.

---

### F-4. **Adverb formation and inflection** (A2)

**Status:** Adverbs appear in examples throughout the curriculum (`hyvin, paljon, nopeasti`) but their formation rules (`-sti` from adjectives), comparison (`nopeammin, nopeimmin`), and the cases that function as adverbs (`maanantaina = essive of Monday = "on Monday"`) are never explicitly addressed.

**Why it matters:** Voikko correctly identifies adverbs and routes the popover, but there's no topic. Also: many "advanced-looking" Finnish constructions are actually just adverbs derived from adjectives — once a learner sees the `-sti` rule, dozens of forms become transparent.

**Suggested topic:**
- **id:** `adverbs`
- **category:** morphology
- **level:** A2
- **prerequisites:** `comparative`, `essive`, `instructive`
- **Sections:**
  1. Forming adverbs from adjectives with `-sti` (kaunis → kauniisti, nopea → nopeasti)
  2. Comparative and superlative of adverbs (`nopeammin`, `nopeimmin`)
  3. Case-form adverbs (essive: maanantaina, kotona; ablative: aamulla, illalla)
  4. Instructive adverbs (jalan, kaksin, käsin, omin silmin)
  5. Manner vs degree vs time vs place adverbs
  6. Common irregular adverbs (`hyvä → hyvin`, `paha → pahasti`)

**Real-world frequency:** Most "high-frequency vocabulary" lists for Finnish learners are 30%+ adverbs.

---

### F-5. **Numerals fully treated** (A1–A2)

**Status:** `numbers-counting` topic exists but only treats cardinals + the basic "number + partitive singular" rule. The genuinely tricky stuff is uncovered:

- **Declension of cardinals** — `yksi → yhden → yhdessä`, `kaksi → kahden → kahdessa`, `kolme → kolmen → kolmessa`. Numerals inflect like nouns.
- **Compound numerals** — `kaksikymmentäkolme → kahdenkymmenenkolmen` (ALL parts inflect)
- **Agreement after numerals 2+** — partitive *singular* of the noun (kolme kissaa) but the numeral itself takes a different case in non-nominative contexts (`kolmessa talossa`)
- **Ordinals** — `ensimmäinen, toinen, kolmas, neljäs…` — declension of `-s` ordinals is non-trivial
- **Reading numbers in dates, times, money** — beyond the basics in `time-expressions`

**Suggested:** Either expand `numbers-counting` significantly, or split off `numeral-inflection` as an A2 follow-up.

---

## 🟠 High-leverage missing — B1 topics learners encounter constantly

### H-1. **Indefinite pronouns** (A2-B1)

`joku, jokin, kaikki, joka, mikään, kukaan, eräs, sama, toinen, muutama, harva, useampi, kumpi, kumpikin`. None of these are in the catalog. They appear in real text on every page. The `pronouns` topic only covers personal + demonstrative + interrogative.

**Suggested:** New topic `indefinite-pronouns` (A2, prereq: pronouns). Critical to read newspapers.

### H-2. **Object case selection — the unified picture** (B1)

Currently, the rules for choosing **partitive vs accusative vs genitive** for objects are fragmented across `partitive`, `accusative`, `genitive`, and `negation`. There's no single topic that presents the decision tree:

- Negative? → partitive
- Telic action with whole result? → accusative/genitive
- Atelic, ongoing, partial? → partitive
- Always-partitive verbs? → partitive (rakastaa, odottaa, etc.)
- Numeral phrase? → partitive singular
- After modal verbs? → check the embedded verb

**Suggested:** New topic `object-case-selection` (B1). Pulls together the rules that currently force learners to read 4 different topic pages.

### H-3. **Reflexive `itse` and reciprocal `toisensa`** (B1)

`itse` is a remarkable word: it serves as reflexive ("itseni rakastan itseäni"), emphatic ("itse kuningas tuli"), and a noun meaning "self." None of this is in the catalog. Similarly `toisensa, toisiamme` (each other) is a distinctive Finnish pattern absent from any topic.

**Suggested:** New topic `reflexive-and-reciprocal` (B1).

### H-4. **Postpositions catalog with case-government** (A2)

The genitive topic mentions postpositions and gives 5 examples. But there are ~50 high-frequency postpositions (takana, edessä, vieressä, alla, päällä, ympärillä, sisällä, lähellä, kanssa, varten, takia, vuoksi, ilman, ennen, jälkeen…) and they govern different cases (mostly genitive, but `kanssa, ilman, varten` take other cases). A reference topic would be huge.

**Suggested:** New topic `postpositions` (A2). Heavy on tables, lighter on prose.

### H-5. **Conjunction catalog — coordinating & correlative** (A2)

`ja, mutta, tai, vaan, eli, sekä-että, joko-tai, ei-eikä, sitä-mitä, niin-kuin`. The subordinate conjunctions (`että, koska, kun, jos, vaikka`) are well-covered. The coordinating ones aren't anywhere except in passing.

**Suggested:** New topic `conjunctions` (A2). Pairs naturally with `subordinate-clauses`.

### H-6. **Auxiliary `olla` constructions** (A2)

`olla` does extraordinary work in Finnish:
- Existence (`Pöydällä on kirja`)
- Possession (`Minulla on koira`)
- Predicative (`Hän on opettaja`)
- Perfect tenses (`Olen tehnyt`)
- Pluperfect (`Olin tehnyt`)
- "It is" patterns (`On hauskaa`, `On lämmin`)
- Modal-like (`On pakko mennä`)
- Necessive (`On tehtävä`)

These are spread across many topics. A unifying `olla-constructions` reference would clarify a lot.

**Suggested:** New topic `olla-constructions` (A2). Could also live as a section inside `verb-types`.

---

## 🟡 Reference / scaffolding gaps (pedagogical, not linguistic)

### S-1. **Case ending overview chart** (A1)

A single topic that shows all 15 cases at a glance: ending, gloss, English approximation, key example. Currently learners must visit 14 separate topic pages to assemble this view.

**Suggested:** New topic `case-overview` (A1, no real prereqs). Mostly a single big table; minimal prose.

### S-2. **Verb conjugation overview by tense × person** (A1)

Same idea but for verbs. A reference page showing all 6 persons across present, imperfect, perfect, conditional, imperative for one verb of each type. Learners constantly want this and have to compile it themselves from the existing topics.

**Suggested:** New topic `verb-conjugation-overview` (A1).

### S-3. **First Finnish sentences — minimum viable communication** (A1, week 1)

A topic that uses only 30 words and 3 grammar rules to teach how to introduce yourself, ask for things, count to 10. Currently, an absolute beginner clicking through the curriculum has to read 5+ topics before they can say "I am [name] from [country]."

**Suggested:** New topic `first-sentences` (A1, no prereqs). Pedagogical onramp.

### S-4. **False friends and common confusions** (A2)

A reference page of pairs that learners regularly mix up:
- `mennä` (to go away) vs `käydä` (to go and come back)
- `tietää` (know fact) vs `osata` (know how) vs `tuntea` (know person/thing)
- `nähdä` (see passively) vs `katsoa` (look at)
- `kuulla` (hear) vs `kuunnella` (listen)
- `puhua` (speak) vs `sanoa` (say) vs `kertoa` (tell)
- `tämä` vs `tuo` vs `se` (already partially covered, deserves dedicated treatment)

**Suggested:** New topic `false-friends` (A2). High-engagement, easy to surface from popovers.

---

## ⚪ Phonology / orthography gaps

### P-1. **Long vs short vowels and consonants** (A1, before everything)

Finnish distinguishes meaning by length: `tuli/tuuli/tulli`, `kuka/kukka`, `tapaan/tapan`. Doubling a letter changes the word. This isn't taught anywhere as a topic. Without this, learners can't even read the existing example sentences accurately.

**Suggested:** New topic `vowel-and-consonant-length` (A1). The earliest possible topic. Should probably be **prerequisite to every other topic**.

### P-2. **Final consonant gemination (rajageminaatio / loppukahdennus)** (B1 awareness; A2 in spoken Finnish)

`tule tänne` is pronounced `tulet-tänne`. `mene pois` is `menep-pois`. Many verb forms and conjunctions trigger this at word boundaries. It's essentially invisible in writing but ever-present in speech. Without a topic, learners can't decode spoken Finnish.

**Suggested:** New topic `final-gemination` (B1). Connects to `register-formal-colloquial` (currently a stub).

### P-3. **Diphthongs and triphthongs** (A1)

Finnish has 18 diphthongs (`ai, au, ei, eu, ie, oi, ui, yi, ay, ie, uo, yö…`) — and they're written transparently but pronounced as single units. A short topic explaining vowel sequences would help intermediate readers.

**Suggested:** Section inside `vowel-harmony` or new topic `vowel-sequences` (A1).

---

## 🔵 Voikko routing dead-ends

Voikko's morphological analysis can identify these phenomena, but there's no catalog topic for them today. So the user clicks "Open topic" and either lands somewhere half-relevant or the popover doesn't surface a "Open topic" link at all.

| Voikko output | Currently routes to | Should route to | Status |
|---|---|---|---|
| `karsiifinaali` (cardinal numeral) | `numbers-counting` | A `numeral-inflection` topic | needs deepening (F-5) |
| Adjective in agreement (e.g. `kauniissa`) | (no route) | `adjective-agreement` (F-1) | **missing** |
| Adverb (`-sti`) | (no route) | `adverbs` (F-4) | **missing** |
| Indefinite pronoun (`joku, kaikki`) | (no route) | `indefinite-pronouns` (H-1) | **missing** |
| Reflexive `itse` | (no route) | `reflexive-and-reciprocal` (H-3) | **missing** |
| Postposition + genitive | `genitive` | `postpositions` (H-4) | partial |

**Implication:** Implementing F-1, F-4, H-1, H-3, H-4 would close all currently-unroutable Voikko outputs. **This is the single highest-leverage cluster of work** because each new topic immediately becomes reachable from the popover for thousands of word forms.

---

## 🟣 Coverage cliffs (topics that exist but cover much less than their title implies)

These overlap with `GRAMMAR_AUDIT.md` but I list them here because the gap is large enough to be genuinely "missing":

### Cl-1. `infinitive-3` only covers 2 of the 6 forms

The third infinitive has six case-form derivatives:

| Form | Use | Currently in topic? |
|---|---|---|
| `-massa / -mässä` (inessive) | "in the act of" | ✅ |
| `-masta / -mästä` (elative) | "from doing" | ✅ |
| `-maan / -mään` (illative) | "to do" — after motion verbs | ❌ |
| `-malla / -mällä` (adessive) | "by doing" — manner | ❌ |
| `-matta / -mättä` (abessive) | "without doing" | partial (in `abessive`) |
| `-man / -män` (instructive, rare) | "to do" — fossilised | ❌ |

The illative `-maan/-mään` is **extremely high frequency** (`menen syömään, lähdin uimaan`) and not covered.

### Cl-2. `clitics` doesn't include `-pa/-pä` properly

Catalog title says `(-kin, -kAAn, -hAn, -pA, -kO)` but content focuses on `-kin` and `-han`. The hortative/persuasive `-pa/-pä` (`tulepa, mennäänpä`) and the tag `-kAAn` deserve their own sections.

### Cl-3. `passive` doesn't cover the spoken-Finnish "we-form" use

In colloquial Finnish, the passive `mennään, syödään, juodaan` IS the 1st person plural verb in nearly all spoken contexts. This is mentioned in the `passive` topic's overview but never expanded. This is one of the single most important learning insights for understanding spoken Finnish.

---

## Suggested authoring queue (best ROI per hour)

If you want a roadmap, here's my prioritisation. Each row notes the **payoff**: how many existing learner pain-points the topic resolves.

| Rank | Topic | Effort | Payoff | Notes |
|---|---|---|---|---|
| 1 | **`adjective-agreement` (F-1)** | 6h | Massive | Unblocks every NP modifier in Finnish; closes a Voikko routing dead-end |
| 2 | **`verbal-rection` (F-2)** | 8h | Massive | The #1 source of intermediate-level errors; benefits every verb topic |
| 3 | **`existential-possessive-sentences` (F-3)** | 4h | High | A1 essential currently scattered across 4 topics |
| 4 | **`object-case-selection` (H-2)** | 5h | High | Pulls together rules from 4 topics into one decision tree |
| 5 | **`indefinite-pronouns` (H-1)** | 4h | High | Voikko dead-end; required for any reading practice |
| 6 | **`postpositions` (H-4)** | 3h (mostly tables) | High | Quick win, very practical |
| 7 | **`adverbs` (F-4)** | 4h | Medium | Voikko dead-end; ~30% of high-frequency words |
| 8 | **Expand `numbers-counting` (F-5)** | 4h | Medium | Pure expansion of existing topic, no new entry needed |
| 9 | **`vowel-and-consonant-length` (P-1)** | 3h | Medium | Prerequisite to literally everything else |
| 10 | **`case-overview` (S-1)** | 2h | Medium-low | Cheap reference; mostly tables |
| 11 | **`auxiliary-olla` (H-6)** | 3h | Medium | Synthesises existing material; could be a section, not a topic |
| 12 | **`conjunctions` (H-5)** | 2h | Medium | Quick |
| 13 | **`reflexive-and-reciprocal` (H-3)** | 3h | Low-medium | Voikko dead-end |
| 14 | **`first-sentences` (S-3)** | 4h | Pedagogical | Onramp for absolute beginners |
| 15 | **`final-gemination` (P-2)** | 3h | Low (advanced) | Pairs with `register-formal-colloquial` stub |
| 16 | **`false-friends` (S-4)** | 3h | Engagement | Easy wins |
| 17 | Cl-1 expand `infinitive-3` | 2h | Medium | Inside an existing topic |

**Total to close all the gaps:** ~63 hours of writing. The first 6 (~30h) would make the curriculum genuinely complete for daily-life Finnish.

---

## How this connects to the work we just did

- The **morphology pipeline** (Voikko + finnishMorphology.js) we built last session is now identifying many word forms that **have no destination topic**. Implementing F-1, F-4, H-1, H-3, H-4 closes those routing dead-ends.
- The **encounter feature** we just discussed (saving "you saw this in your reading") will only feel magical if the topic page has the *right* topic to land on. F-1 (adjective-agreement) alone would meaningfully improve the encounter UX.
- The **edit card modal** we built lets users author grammar cards. Once these new topics exist, they can be the seed cards for users learning each topic.

A coherent next-quarter roadmap could be: **"Close the Voikko routing dead-ends"** — F-1, F-4, H-1, H-3, H-4 as a focused 5-topic batch (~24h of writing). Combined with the encounter feature, this would dramatically tighten the read→learn loop.
