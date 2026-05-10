# Finnish Grammar Curriculum Audit

**Auditor:** AI assistant (linguistic review of `src/data/grammar/`)
**Scope:** All 52 topics across `topics-cases.ts`, `topics-verbs.ts`, `topics-syntax.ts`, `topics-morphology.ts`, `topics.ts` (~9.7K lines)
**Trigger:** User reported the rule for `sukupolvi → sukupolvet` (plural nominative of an i-stem) is nowhere to be found in the *Plurals* lesson.

> **TL;DR** — The user is right, and the gap goes deeper than they noticed. The Plurals lesson covers only the easy 60% of nominative plurals (vowel-stem 2-syllable nouns) and **silently omits** every productive harder pattern (i-stems, e-stems, -nen, -us, -uus, -is, -e and consonant-stem nouns). Worse, *both* the Plurals lesson and the Nominative lesson teach the **opposite of the truth** about consonant gradation in nominative plural. Below: a triage of every issue found, with severity, evidence, and a concrete fix.

---

## Summary by severity

| Severity | Count | Description |
|---|---|---|
| 🔴 **Critical** | 3 | Factually wrong claims that will actively mislead learners |
| 🟠 **Major gaps** | 6 | Whole rules / stem-types missing from topics that claim to cover them |
| 🟡 **Minor** | 7 | Redundancy, ordering, terminology, internal inconsistency |
| ⚪ **Acknowledged stubs** | 10 | Topics in `catalog.ts` with `published: false` (not surfaced to users yet) |

---

## 🔴 Critical issues (fix first — these teach the wrong thing)

### C-1. The "strong grade in nominative plural" claim is wrong

**Where:** `topics-cases.ts:92`, `topics-morphology.ts:259`, `topics-morphology.ts:1162`, `topics-morphology.ts:1179`, `topics-morphology.ts:1199`

**What the lessons say (multiple places):**
> *"The strong grade appears in the nominative plural."*
> *"The nominative plural is formed by adding -t to the strong-grade stem. This is the only plural form that uses the strong grade."*
> *"The plural nominative (-t) is strong grade: kaupat, tytöt."*

**What's actually true:**
The same lessons elsewhere correctly state the trigger rule: *"weak grade appears in closed syllables; strong grade in open syllables."* In the plural nominative, the `-t` ending **closes** the final syllable, so the form is **weak grade** — and indeed the examples the lessons give prove this:

| Form taught | Strong/weak grade actually shown |
|---|---|
| `kauppa → kaupat` | `pp → p` is **weak** (would be `kauppat` if strong) |
| `tyttö → tytöt` | `tt → t` is **weak** |
| `pankki → pankit` | `kk → k` is **weak** |
| `hattu → hatut` | `tt → t` is **weak** |

So the lesson **labels the example wrong**: the prose says "strong" but the form is in weak grade. Internally contradictory, and the wrong half is the rule the learner takes away.

**Why it matters:** The whole gradation system in Finnish becomes incoherent if learners memorise this. They'll wrongly predict `kauppat`, `tyttöt` when they see new plural forms.

**Fix:**
1. Change the explanatory prose in all three places to:
   > *"Like the genitive singular, the nominative plural -t closes the syllable, so the **weak grade** appears: kauppa → kaupat, tyttö → tytöt, hattu → hatut."*
2. Add a side-note: *"This means the plural and genitive often look very similar — `kaupan` (gen.sg) vs `kaupat` (nom.pl) differ only in the final consonant."* (This is a high-value observation the lessons currently never state.)
3. Note the historical exception: certain monosyllabic nouns and a small set of words *do* keep strong grade in nom.pl (e.g. `työt`, `yöt`) — but these are rare enough they belong as a footnote, not the rule.

---

### C-2. The example `kampa → kammat` is mis-categorised

**Where:** `topics-cases.ts:109` in `nom-gradation` section.

**What the lesson says:**
> `kampa → kammat — comb → combs (mp → mm — reverse gradation)`

**What's actually true:**
There is no such thing as "reverse gradation" in standard Finnish grammar. The `mp/mm` alternation **is** standard consonant gradation: `mp` is the strong grade, `mm` is the weak grade (just like `nt/nn`, `lt/ll`, `rt/rr`). The form `kammat` follows the same rule as `kaupat`: nom.pl closes the syllable → weak grade → `mp → mm`. There is nothing reverse about it.

**Why it matters:** Introducing fictional terminology ("reverse gradation") confuses the very rule the section is trying to teach. The student now thinks Finnish has *two kinds* of gradation when there's only one.

**Fix:** Drop the "(reverse gradation)" parenthetical. Replace with:
> `kampa → kammat — comb → combs (mp → mm: the regular weak grade for nasal+stop clusters)`

And while you're there, add the parallel examples that should exist in the same section: `kynttilä → kynttilät`? **No** — that's actually `kynttilä → kynttilät` with no gradation. Better candidates: `ranta → rannat` (nt→nn), `silta → sillat` (lt→ll), `parta → parrat` (rt→rr). Currently the lesson has zero examples of nasal+stop or liquid+stop gradation.

---

### C-3. The genitive lesson contradicts itself (and C-1) in one line

**Where:** `topics-cases.ts:279` in `gen-formation`'s pitfalls.

**What the lesson says:**
> *"The weak grade is used in the genitive singular — opposite of the strong grade used in the nominative plural."*

This is the same wrong claim as C-1, but stated as the *contrast* between two cases the learner is told to keep straight. So the learner walks away with two false beliefs reinforcing each other.

**Fix:** Replace with the truthful, more useful contrast:
> *"Genitive singular and nominative plural both use the **weak grade** because both endings (-n and -t) close the final syllable. The difference is the final consonant: `kaupan` ('of the shop') vs `kaupat` ('the shops')."*

---

## 🟠 Major gaps (the user's actual complaint, plus others like it)

### M-1. Plural nominative omits every non-trivial stem type

**Where:** `topics-morphology.ts:1172-1202` (`plu-nominative`) and `topics-cases.ts:58-85` (`nom-plural`).

**What's covered:** Only **2-syllable A-stem and O-stem nouns** with regular nom.pl: `talo, kirja, koira, kauppa, tyttö, pöytä`.

**What's missing (the user's word `sukupolvi → sukupolvet` falls in the *first* category below):**

| Stem type | Example | Why it differs | Currently taught? |
|---|---|---|---|
| **i-stems with hidden -e- stem** | `sukupolvi → sukupolvet`, `kieli → kielet`, `ovi → ovet`, `vesi → vedet` | Final -i drops, real stem is `-e-`; pl. is `stem + -t` not `surface + -t` | ❌ Nowhere |
| **Old i-stems (final -i is real)** | `meri → meret`, `pieni → pienet`, `tunti → tunnit` | -i is preserved before -t; gradation matters | ❌ Nowhere |
| **-nen → -set** | `nainen → naiset`, `hevonen → hevoset`, `suomalainen → suomalaiset` | Whole `-nen` morpheme replaced by `-set` | ⚠️ Mentioned only in pitfall (gen) |
| **-us / -ys → -ukset / -ykset** | `vastaus → vastaukset`, `kysymys → kysymykset`, `tutkimus → tutkimukset` | Stem extension `-kse-`, then `-t` | ❌ Nowhere |
| **-uus / -yys → -uudet / -yydet** | `vapaus → vapaudet`, `mahdollisuus → mahdollisuudet` | -us/-ys → -ude-/-yde- | ❌ Nowhere |
| **-is → -iit / -iikset** | `kallis → kalliit`, `kaunis → kauniit` | Adjective; `-is` → long vowel | ❌ Nowhere |
| **-e → -eet** | `huone → huoneet`, `perhe → perheet` | Final -e doubles to -ee- before -t | ❌ Nowhere |
| **Consonant stems (-as/-äs/-is)** | `kuningas → kuninkaat`, `vieras → vieraat` | Consonant stem with characteristic alternation | ❌ Nowhere |
| **-tar → -ttaret** | `kuningatar → kuningattaret` | Rare but illustrative | ❌ Nowhere (probably ok to skip) |
| **-os/-ös → -okset/-ökset** | `tulos → tulokset`, `ehdotus → ehdotukset` | Same -kse- pattern as -us | ❌ Nowhere |

**Why it matters:** This is the user's exact frustration. Voikko is now correctly catching `sukupolvet` (we wired this up last session), but the lesson behind the "Open topic" link doesn't teach the rule. The user clicks to learn *why* and finds only `kirja → kirjat`.

**Fix (concrete):**

Add a new section to `plural-forms` topic — `plu-nominative-by-stem-type` — with at least one example per stem type. Suggested structure:

```ts
{
  id: 'plu-nominative-stem-types',
  title: 'Nominative plural by stem type',
  question: 'Miksi sukupolvi → sukupolvet, ei *sukupolvit?',
  questionEn: 'Why is the plural sukupolvet, not sukupolvit?',
  grammarPattern:
    "The nominative plural -t attaches to the noun's INFLECTIONAL STEM, not its dictionary form. " +
    "Many Finnish nouns hide a stem that differs from the citation form — most often an -e- " +
    "instead of -i, or a fuller form like -kse-, -ude-, -ise-. The plural -t reveals these stems.",
  formula: 'inflectional stem + -t (NOT dictionary form + -t)',
  examples: [
    { fi: 'sukupolvi → sukupolvet', en: 'generation → generations (i-stem with hidden -e-: stem sukupolve-)' },
    { fi: 'kieli → kielet',        en: 'language → languages (same pattern: stem kiele-)' },
    { fi: 'ovi → ovet',            en: 'door → doors (stem ove-)' },
    { fi: 'vesi → vedet',          en: 'water → waters (stem vede-, with t→d weak grade)' },
    { fi: 'meri → meret',          en: 'sea → seas (old i-stem: -i is part of the stem)' },
    { fi: 'nainen → naiset',       en: 'woman → women (-nen → -set)' },
    { fi: 'vastaus → vastaukset',  en: 'answer → answers (-us → -ukse-)' },
    { fi: 'tutkimus → tutkimukset', en: 'research → researches (same)' },
    { fi: 'vapaus → vapaudet',     en: 'freedom → freedoms (-uus → -ude-)' },
    { fi: 'huone → huoneet',       en: 'room → rooms (-e doubles)' },
    { fi: 'kaunis → kauniit',      en: 'beautiful → beautifuls (-is → -ii-)' },
    { fi: 'kuningas → kuninkaat',  en: 'king → kings (consonant stem)' },
  ],
  commonPitfalls: [
    'Always learn a noun together with its genitive singular — the genitive reveals the inflectional stem.',
    '-i in the dictionary is often misleading: most i-stems are really e-stems (sukupolvi → sukupolve-).',
    '-us and -uus look similar but inflect differently: vastaus → vastauksen, vapaus → vapauden.',
  ],
}
```

This single section, paired with the C-1 fix, would make the Plurals topic genuinely useful.

---

### M-2. The Genitive lesson has the same stem-type gap

**Where:** `topics-cases.ts:230-340`. Only covers `talo, kauppa, tyttö, pankki, kirja, koira` types.

The genitive singular is the **single most useful inflectional form to know** because it reveals the inflectional stem (relevant to ALL other cases). Yet there's no treatment of:

- `nainen → naisen`
- `vastaus → vastauksen`, `kysymys → kysymyksen`
- `vapaus → vapauden`, `mahdollisuus → mahdollisuuden`
- `kieli → kielen`, `ovi → oven`, `vesi → veden`
- `meri → meren`
- `kaunis → kauniin`, `kallis → kalliin`
- `huone → huoneen`
- `kuningas → kuninkaan`
- Disyllabic vs polysyllabic stress effects

**Fix:** Add a `gen-by-stem-type` section. The same example list as M-1, but in genitive singular. Bonus: cross-link the two from each other ("To form the plural of `vastaus`, first find the genitive singular: `vastauksen`. Drop -n, add -t → `vastaukset`.").

---

### M-3. The Partitive lesson (in `topics.ts`) shadows the cases topic

**Where:** Both `topics-cases.ts:13` and `topics.ts` define a `partitive` topic. The catalog (`catalog.ts:13-15`) only references one.

The cases version is shorter and modern; the `topics.ts` version is older (the file is comment-tagged "ALREADY DONE — will be merged into the new structure in Phase 5"). Need to confirm which one the runtime serves to users via `getTopic('partitive')`. If the older one wins, it may have additional/conflicting content.

**Fix:** Decide which one is canonical and delete the other. Make sure `index.ts` resolves to the chosen one. (I haven't read `index.ts` end-to-end here — investigating this is a quick separate task.)

---

### M-4. `nom-plural` (in nominative topic) and `plu-nominative` (in plural-forms) duplicate each other badly

**Where:** `topics-cases.ts:58-85` vs `topics-morphology.ts:1172-1202`.

Both teach "add -t to the stem" with similar examples but **diverge subtly** on the strong/weak grade claim (both wrong, but inconsistently wrong). They also have different example sets, so a learner reading both gets a fragmented picture.

**Fix:** One of these has to be the canonical primary. I'd suggest:
- `nom-plural` in the Nominative topic stays as a **brief overview** ("Plural nominative is `stem + -t` — for the full rules see Plural Forms").
- `plu-nominative` in Plurals becomes the **deep treatment** (with the M-1 stem-type breakdown).
- Cross-link with `sectionRef` so the topic page can deep-link.

---

### M-5. No coverage of consonant stems anywhere

**Where:** Should be in `consonant-gradation`, `nominative`, or have its own section.

Words like `kuningas, vieras, taivas, kysymys, vastaus, mies, lapsi` are everywhere in real Finnish. The lesson on `consonant-gradation` (`topics-morphology.ts:214+`) talks about kpt alternation but never addresses the fact that some nouns have **stem extensions** (consonant clusters like `-kse-`, `-de-`, `-tee-`) that appear only in inflected forms. This is why `lapsi → lapsen → lapset` works but the learner has no way to predict it.

**Fix:** Either add a "Consonant stems and stem extensions" section to `consonant-gradation`, or — cleaner — create a new morphology topic `noun-stems` (A2) that explicitly enumerates the inflectional stem patterns: vowel stems vs. consonant stems vs. e-stems-disguised-as-i.

---

### M-6. Possessive suffixes lesson glosses over the most common surface alternations

**Where:** `topics-syntax.ts` `possessive-suffixes` topic.

The lesson teaches the abstract rule (`-ni`, `-si`, `-(V)nsa`, `-mme`, `-nne`) but the **examples don't show what learners actually see in the wild**:

- `tutkimuksensa` (the user's exact example from last session) — `tutkimukse-` (stem) + `-nsa` (3rd person possessive) — should be a flagship example, since this is what readers encounter.
- After the third-person `-Vn` illative ending: `kotiinsa` (kotiin + -nsa, with `-nsa` reduced to a doubled vowel) — shown but only one example.
- `-ssa`/`-lla` + 3sg becoming `-ssaan`/`-llaan`: `kodissaan`, `pöydällään`, `huoneessaan` — currently shown but not explained well.
- The colloquial drop of suffixes after pronouns: `mun kirja` vs `kirjani` — never addressed, and this is the dominant form in spoken Finnish.

**Fix:** Add an "in real text" examples section. Particularly: `tutkimuksensa, kotiinsa, pöydällään, huoneessaan, omistaan` — pulled from authentic high-frequency usage.

---

## 🟡 Minor issues

### Y-1. `mistä` in `rel-mika` example uses elative on a noun phrase head, which is unusual

**Where:** `topics-syntax.ts` `rel-mika`, example: `Hän teki sen, mistä olin varoittanut.`

This is grammatical but stylistically non-standard. More natural: `Hän teki sen, mitä vastaan olin varoittanut`. The example as-is teaches a borderline pattern as canonical. Low priority — flag and consider replacing.

### Y-2. Typo: "glitistää" should be "kiiltää" (or "loistaa")

**Where:** `topics-syntax.ts` `rel-mika`, example: `Kaikki, mikä glitistää, ei ole kultaa.`

There is no Finnish word `glitistää`. The proverb "All that glitters is not gold" in Finnish is `Kaikki, mikä kiiltää, ei ole kultaa` (or `loistaa`). Looks like a typo or auto-correct from "glistens". **Fix immediately.**

### Y-3. `comp-superlative` formula is misleading

**Where:** `topics-syntax.ts` `comp-superlative`.

Says: `comparative stem + -(i)n`. That works for `iso → isoin`, but the actual rule is more complex (the stem alternation `nopea → nopein` involves more than just adding `-(i)n`). Either expand the formula or footnote the irregularities.

### Y-4. `pron-cases` mis-orders `minua` (partitive) and `minulle` (allative) without explaining why pronouns inflect differently

**Where:** `topics-syntax.ts` `pron-cases`.

Personal pronouns have **suppletive** stems (`minu-` from `minä`, `häne-` from `hän`) — this is a noteworthy fact that the lesson doesn't mention. Worth one sentence.

### Y-5. `qst-yesno` example: `Luetko sinä kirjaa?`

**Where:** `topics-syntax.ts` `qst-yesno`.

`Luetko sinä` reads as if `sinä` is required, but the lesson elsewhere (correctly) says it's usually dropped. Better example: `Luetko kirjaa?` with a side-note "the pronoun can be added for emphasis: `Luetko sinä kirjaa?`".

### Y-6. `referative` `-NEN/NEen` notation in grammarIndex is opaque

**Where:** `topics-syntax.ts` `participle-clauses` grammarIndex row "[Genitive] + V-NEN/NEEN".

`-NEN/NEEN` is being used as a placeholder for "the participle ending whatever it is" — but it looks like a literal Finnish ending. Use a clearer notation like `V-pres.part.gen` / `V-past.part.gen`, or write it out.

### Y-7. The Verb Types lesson doesn't list `nähdä, tehdä, juoda, syödä` together as the canonical Type 2 set

**Where:** `topics-verbs.ts:74-79`.

The lesson covers `syödä, juoda, tehdä` but doesn't surface the irregular gem `nähdä → näke-` which is the most important Type 2 verb learners encounter early. Cheap addition.

---

## ⚪ Acknowledged stubs (`published: false`)

These are listed in `catalog.ts` but not yet authored. Surfacing here so the prioritisation is visible:

| ID | Category | Level | Why it should be next |
|---|---|---|---|
| `passive-past` | verbs | B2 | `tehtiin / on tehty / oli tehty` — extremely high frequency in news |
| `passive-conditional` | verbs | B2 | Less critical |
| `conditional-perfect` | verbs | B2 | "Olisin tehnyt" — common in regret/counterfactual speech |
| `infinitive-4` | verbs | B2 | `tekeminen` etc. — required to read formal/written Finnish |
| `infinitive-5` | verbs | B2 | Rare — can stay last |
| `derivation-verbs` | morphology | B2 | High value — `-ttaa, -utua, -skella` are productive |
| `compound-words` | morphology | B2 | High value — Finnish is full of compounds |
| `indirect-speech` | syntax | B2 | Mostly subsumed by `referative-construction` |
| `concessive-clauses` | syntax | B2 | High frequency — `vaikka, jos, ellei, mikäli` |
| `register-formal-colloquial` | syntax | B2 | **Very high** — without this, learners can't decode spoken Finnish |

**Suggested authoring order:** `register-formal-colloquial` → `passive-past` → `compound-words` → `concessive-clauses` → `infinitive-4` → `derivation-verbs` → others.

---

## Cross-cutting recommendations

### R-1. Add a "noun stems" topic at A2

This is the single highest-leverage addition. Currently the curriculum teaches **case endings** (excellent) but never explicitly teaches **what to attach them to**. A dedicated `noun-stems` topic that enumerates the ~10 productive inflectional stem patterns (vowel-stem, e-stem-as-i, -nen, -us, -uus, -is, -e, consonant-stem-with-extension, -tar, -t/-d alternation) would be the missing scaffold that makes every case lesson land properly.

### R-2. Establish a strong-grade / weak-grade truth table

Make a single canonical reference (probably as a section in `consonant-gradation`) that shows, for each high-frequency case ending, whether it triggers strong or weak grade. The lessons currently mention this in passing but never present it as a table. Suggested:

| Form | Strong/Weak | Example |
|---|---|---|
| Nom. sg | strong | `kauppa, hattu, kissa` |
| Part. sg | strong | `kauppaa, hattua, kissaa` |
| 1st infinitive | strong | `lukea, ottaa, syödä` |
| Gen. sg | weak | `kaupan, hatun, kissan` |
| All locative cases sg | weak | `kaupassa, hatussa, kissalla` |
| **Nom. pl** | **weak** *(C-1 fix)* | **`kaupat, hatut, kissat`** |
| Partitive plural | weak | `kauppoja, hattuja, kissoja` |
| Oblique plural | weak | `kaupoissa, hatuissa, kissoilla` |
| Personal endings (verb) | weak | `luen, otan, syön` |

### R-3. Tie examples to the morphology pipeline

Now that Voikko is wired up, every example in every section could *also* be machine-validated. A test that round-trips each `examples[].fi` through `applyMorphology` and confirms (a) it parses, (b) the resulting `lemma` matches what the section's surface-and-stem analysis claims, would catch errors like C-2 automatically.

### R-4. Add citation lines

Most sources cite "Uusi kielemme" (a great popular reference) but a few claims (especially controversial ones like C-1) would benefit from VISK (Iso suomen kielioppi) section references — VISK is the authoritative academic grammar and the strong/weak gradation rules are spelled out there. Where the lesson disagrees with both Uusi kielemme and VISK (as in C-1), that's a smell.

---

## Suggested implementation order

If you want a single PR that maximally improves the curriculum **per line of code touched**, do these three things in this order:

1. **Fix C-1, C-2, C-3 (1 hour)** — straight prose edits, no new sections. Stops actively misleading users.
2. **Add the `plu-nominative-stem-types` section per M-1 (1–2 hours)** — directly resolves the user's reported issue and most of the i-stem / -nen / -us pain.
3. **Add the parallel `gen-by-stem-type` section per M-2 (1 hour)** — once stem types are in plurals, learners need to see them in genitive too, since gen.sg reveals the stem.

After that, the higher-effort recommendations (R-1 noun-stems topic, R-3 Voikko round-trip tests) would be the next big wins.

---

## Appendix: how the user's word `sukupolvet` should be treatable

When the user clicks "Open topic" on `sukupolvet`, the morphology pipeline (Voikko) currently identifies it correctly as plural nominative of `sukupolvi` and routes to `plural-forms`. After implementing **M-1**, the topic page would show:

> **From your reading**: `sukupolvet` (generations) — see *§ Nominative plural by stem type*, where `sukupolvi → sukupolvet` is taught alongside `kieli → kielet` and `vesi → vedet` as i-stems with hidden -e-.

Combined with the "encounter as example" feature we discussed in the previous turn, the loop closes: encounter → click → land on the topic with their exact word as a featured example → learn the rule → recognise it next time.
