import type { GrammarTopic } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// 1. VOWEL HARMONY
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_VOWEL_HARMONY: GrammarTopic = {
  id: 'vowel-harmony',
  version: '1.0.0',
  title: 'Vowel harmony',
  subtitle: 'Front, back, and neutral — endings mirror the word.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: [],
  tags: ['morphology'],

  overview: {
    theme: 'Finnish vowels are divided into back vowels (a, o, u), front vowels (ä, ö, y), and neutral vowels (e, i). Grammatical endings come in pairs — one back, one front — and must match the vowels of the word they attach to.',
    grammarFocus: [
      'Back vowels: a, o, u → endings use -a, -o, -u forms',
      'Front vowels: ä, ö, y → endings use -ä, -ö, -y forms',
      'Neutral vowels: e, i → do not determine harmony; words with only e/i follow back-vowel pattern',
      'Ending pairs: -lla/-llä, -ssa/-ssä, -lla/-llä, -nna/-nnä, -ta/-tä, -a/-ä',
      'Compound words: the last component determines harmony for the whole word',
    ],
    whyItMatters:
      'Vowel harmony governs virtually every suffix in Finnish. Get it wrong and native speakers will notice immediately. Internalise the three vowel classes and choosing the right suffix ending becomes automatic.',
  },

  sections: [
    {
      id: 'vh-three-classes',
      title: 'The three vowel classes',
      question: 'Mihin luokkaan ääntiöt kuuluvat?',
      questionEn: 'Which class do the vowels belong to?',
      grammarPattern:
        'Finnish vowels fall into three classes. Back vowels (a, o, u) stay at the back of the mouth; front vowels (ä, ö, y) are produced at the front. Neutral vowels (e, i) are phonetically front but do not count as "front" for harmony purposes.',
      formula: 'Back: a o u | Front: ä ö y | Neutral: e i',
      examples: [
        { fi: 'talo [a, o] → back-vowel word → talossa, talolla', en: 'house — contains back vowels → use back-vowel endings' },
        { fi: 'pöytä [ö, ä] → front-vowel word → pöydässä, pöydällä', en: 'table — contains front vowels → use front-vowel endings' },
        { fi: 'piste [i, e] → only neutral vowels → pisteessä, pisteellä', en: 'point/dot — only neutral vowels → follows back-vowel pattern (back endings)' },
        { fi: 'silmä [i, ä] → front wins → silmässä, silmällä', en: 'eye — i is neutral but ä is front → use front endings' },
      ],
      commonPitfalls: [
        'A word like "piste" has only neutral vowels (e, i) and takes back-vowel endings: pisteessä, not *pisteessä̈.',
        'If a word has BOTH back and front vowels it is almost certainly a loanword or compound — Finnish roots obey harmony strictly.',
      ],
    },
    {
      id: 'vh-ending-pairs',
      title: 'Ending pairs',
      question: 'Mitkä päätteet tulevat pareittain?',
      questionEn: 'Which endings come in front/back pairs?',
      grammarPattern:
        'Most case endings and verb suffixes have a back-vowel variant and a front-vowel variant. The choice depends entirely on the vowel class of the root word.',
      formula: '-ssa / -ssä, -lla / -llä, -ta / -tä, -na / -nä, -a / -ä',
      examples: [
        { fi: 'kaupassa — kaupungissa — kaupungilla', en: 'in the shop — in the city — at the city (all back)' },
        { fi: 'kylässä — kylällä — kylästä', en: 'in the village — at the village — from the village (all back)' },
        { fi: 'metsässä — metsällä — metsästä', en: 'in the forest — at the forest — from the forest (all back)' },
        { fi: 'äidissä — äidillä — äidistä', en: 'in the mother — at the mother — from the mother (all front)' },
        { fi: 'pöydässä — pöydällä — pöydästä', en: 'in the table — on the table — from the table (all front)' },
      ],
      commonPitfalls: [
        'All endings in a single word form must agree: you cannot mix -ssa and -llä within the same inflected form.',
        'Memorise pairs together: -ssa/-ssä, -lla/-llä, -lta/-ltä, -sta/-stä, -lle/-lle (allative has no front/back distinction — always -lle).',
      ],
    },
    {
      id: 'vh-neutral-only',
      title: 'Words with only neutral vowels',
      question: 'Mitä tapahtuu, kun sanassa on vain e ja i?',
      questionEn: 'What happens when a word contains only e and i?',
      grammarPattern:
        'When a word contains only the neutral vowels e and i (no a/o/u/ä/ö/y), it behaves like a back-vowel word and takes back-vowel suffixes.',
      examples: [
        { fi: 'piste → pisteessä, pisteellä, pisteestä', en: 'dot/point → in, at, from (back endings despite no a/o/u)' },
        { fi: 'tilsi → tiksessä (tiksissä)', en: 'example neutral-only stem — back endings' },
        { fi: 'perhe → perheessä, perheellä', en: 'family → in the family, at the family (back endings)' },
        { fi: 'viime → viimeinen', en: 'last → latest/last (back-vowel derivation suffix)' },
      ],
      commonPitfalls: [
        'Do not be tempted by i (which sounds "front") — in vowel harmony terms it is neutral and does not force front endings.',
        'Loanwords ending in -i (like taksi, banaani) also follow back harmony: taksissa, banaanissa.',
      ],
    },
    {
      id: 'vh-compounds',
      title: 'Compound words',
      question: 'Mikä osa yhdyssanasta määrää vokaalisoinnun?',
      questionEn: 'Which part of a compound word determines vowel harmony?',
      grammarPattern:
        'In compound words, the LAST component (the head noun) determines vowel harmony for any suffix attached to the whole compound.',
      examples: [
        { fi: 'sähköposti [ä…o] → sähköpostissa', en: 'email → in the email (last component "posti" has back vowel o → back suffix)' },
        { fi: 'ruokakauppa [u…a] → ruokakaupassa', en: 'grocery store → in the grocery store (back throughout)' },
        { fi: 'kävelykenkä [ä…ä] → kävelykengässä', en: 'walking shoe → in the walking shoe (front throughout)' },
        { fi: 'äidinkieli [ä…i/e] → äidinkielessä', en: 'mother tongue → in the mother tongue (last part "kieli" has only neutral vowels — follow back → kielessä)' },
      ],
      commonPitfalls: [
        'sähköposti looks like a front word (ä, ö) but "posti" ends in back vowel o → the suffix is -ssa, not *-ssä.',
        'When unsure, look at the last component only and determine its vowel class.',
      ],
    },
    {
      id: 'vh-verb-suffixes',
      title: 'Vowel harmony in verb forms',
      question: 'Miten vokaalisointu vaikuttaa verbipäätteisiin?',
      questionEn: 'How does vowel harmony affect verb endings?',
      grammarPattern:
        'Verb suffixes follow the same harmony rule: the infinitive marker, conditional, passive, and negation particle all have front/back variants.',
      formula: 'Verb infinitive: -a / -ä | Passive: -taan / -tään | Conditional: -isi- (invariant) | Negative: ei + verb stem',
      examples: [
        { fi: 'sanoa (back) → sanotaan, sanottiin', en: 'to say → (it) is said, (it) was said' },
        { fi: 'puhua (back) → puhutaan, puhuttiin', en: 'to speak → (it) is spoken, (it) was spoken' },
        { fi: 'syödä (front) → syödään, syötiin', en: 'to eat → (it) is eaten, (it) was eaten' },
        { fi: 'tehdä (front) → tehdään, tehtiin', en: 'to do → (it) is done, (it) was done' },
        { fi: 'pelata (back) → pelataan', en: 'to play → (it) is played' },
      ],
      commonPitfalls: [
        'The conditional marker -isi- is invariant — it does not change for front/back. But the endings added after it do obey harmony.',
        'Some very common verbs like tehdä and nähdä are front-vowel even though their roots feel short and colloquial.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'a / o / u in word', use: 'Use back-vowel endings (-ssa, -lla, -ta, -a)', examples: ['talossa', 'koiralla', 'kirjaa'], sectionRef: 'vh-three-classes' },
    { pattern: 'ä / ö / y in word', use: 'Use front-vowel endings (-ssä, -llä, -tä, -ä)', examples: ['pöydässä', 'kädellä', 'tyttöä'], sectionRef: 'vh-three-classes' },
    { pattern: 'only e / i in word', use: 'Use back-vowel endings (neutral = back by default)', examples: ['pisteessä', 'perheellä'], sectionRef: 'vh-neutral-only' },
    { pattern: 'compound word', use: 'Last component determines harmony', examples: ['sähköpostissa', 'kävelykengässä'], sectionRef: 'vh-compounds' },
  ],

  drills: [
    {
      id: 'vh-d1', kind: 'mc', sectionId: 'vh-ending-pairs',
      data: {
        prompt: "Which inessive form is correct for 'pöytä' (table)?",
        options: ['pöydässä', 'pöydassa', 'pöytässä', 'pöytassa'],
        correctIndex: 0,
        explanation: 'pöytä contains ö and ä (front vowels), so the inessive ending is -ssä: pöydässä.',
      },
    },
    {
      id: 'vh-d2', kind: 'mc', sectionId: 'vh-neutral-only',
      data: {
        prompt: "Which adessive form is correct for 'perhe' (family)?",
        options: ['perheellä', 'perheella', 'perheellae', 'perhellä'],
        correctIndex: 1,
        explanation: '"perhe" contains only neutral vowels (e, e). Neutral-only words follow the back-vowel pattern, so the adessive ending is -lla (back), not -llä (front). The correct form is perheella.',
      },
    },
    {
      id: 'vh-d3', kind: 'fill', sectionId: 'vh-ending-pairs',
      data: {
        sentence: 'Kirja on pöydä_____. (on the table — adessive)',
        answer: 'pöydällä',
        hint: 'pöytä has front vowels ö, ä → use -llä',
        baseForm: 'pöytä',
      },
    },
    {
      id: 'vh-d4', kind: 'fill', sectionId: 'vh-ending-pairs',
      data: {
        sentence: 'Käyn töi_____. (at work — adessive of työ)',
        answer: 'töissä',
        hint: 'työ has front vowel ö → inessive/adessive endings are front: töissä',
        baseForm: 'työ',
      },
    },
    {
      id: 'vh-d5', kind: 'transform', sectionId: 'vh-ending-pairs',
      data: { base: 'kauppa', instruction: '→ inessive (in the shop)', answer: 'kaupassa' },
    },
    {
      id: 'vh-d6', kind: 'transform', sectionId: 'vh-ending-pairs',
      data: { base: 'kylä', instruction: '→ inessive (in the village)', answer: 'kylässä' },
    },
    {
      id: 'vh-d7', kind: 'spot-error', sectionId: 'vh-ending-pairs',
      data: {
        sentence: 'Olen töissä kauppassa ja syön lounaalla ravintolassa.',
        errorWord: null,
        correctForm: null,
        explanation: 'This sentence is correct — töissä (front, työ), kauppassa (back, kauppa), ravintolassa (back, ravintola) all follow vowel harmony.',
      },
    },
    {
      id: 'vh-d8', kind: 'table', sectionId: 'vh-ending-pairs',
      data: {
        headers: ['Word', 'Vowel class', 'Inessive (-ssa/-ssä)'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'back', blank: false }, { value: 'talossa', blank: true }] },
          { label: 'pöytä', cells: [{ value: 'pöytä', blank: false }, { value: 'front', blank: false }, { value: 'pöydässä', blank: true }] },
          { label: 'perhe', cells: [{ value: 'perhe', blank: false }, { value: 'neutral → back', blank: false }, { value: 'perheessä', blank: true }] },
          { label: 'metsä', cells: [{ value: 'metsä', blank: false }, { value: 'front', blank: false }, { value: 'metsässä', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Vowel Harmony', url: 'https://uusikielemme.fi/finnish-grammar/phonology/vowel-harmony' },
    { label: 'VISK § 14 — Vokaaliharmonia', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=14' },
    { label: 'Wiktionary — Finnish phonology', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_phonology' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSONANT GRADATION
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_CONSONANT_GRADATION: GrammarTopic = {
  id: 'consonant-gradation',
  version: '1.0.0',
  title: 'Consonant gradation',
  subtitle: 'KPT alternations that shape every inflected form.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 20,
  prerequisites: [],
  tags: ['morphology'],

  overview: {
    theme: 'Consonant gradation (astevaihtelu) is the alternation between "strong" and "weak" grades of the stops k, p, and t. The grade of the consonant depends on the syllable structure — specifically, whether the following syllable is open or closed.',
    grammarFocus: [
      'Strong grade (kk, pp, tt, k, p, t) vs weak grade (k, p, t, ∅, v, d)',
      'Weak grade appears in closed syllables: before -ssa, -lla, -n (genitive), -lle, -lta, etc.',
      'Strong grade appears in open syllables: nominative, partitive singular, infinitive',
      'Single stops: k → ∅, p → v, t → d',
      'Geminate stops: kk → k, pp → p, tt → t',
      'Nasal/liquid clusters: nk → ng, mp → mm, nt → nn, lt → ll, rt → rr',
      'Only stops (k, p, t) undergo gradation — s, l, r, n, m never do',
    ],
    whyItMatters:
      'Consonant gradation affects the majority of Finnish nouns and verbs. Without understanding it, inflected forms look completely unpredictable. Once you grasp the strong/weak pattern, forms like "luku → luvun" and "kauppa → kaupan" become logical.',
  },

  sections: [
    {
      id: 'cg-trigger',
      title: 'What triggers the weak grade?',
      question: 'Milloin heikko aste ilmestyy?',
      questionEn: 'When does the weak grade appear?',
      grammarPattern:
        'The weak grade appears when the syllable containing the stop is CLOSED — i.e., followed by a syllable that begins with a consonant or is the final syllable ending in a consonant. In practice: genitive singular (-n), inessive (-ssa/-ssä), adessive (-lla/-llä), elative (-sta/-stä), ablative (-lta/-ltä), allative (-lle), illative, and many verb forms use the weak grade.',
      formula: 'Closed syllable (consonant follows) → weak grade; Open syllable → strong grade',
      examples: [
        { fi: 'kauppa (nom., open syllable) → kaupan (gen., closed)', en: 'shop — strong in nominative, weak in genitive' },
        { fi: 'tyttö (nom.) → tytön (gen.) → tytöllä (adessive)', en: 'girl — tt → t in all weak-grade forms' },
        { fi: 'lukea (infinitive, strong) → luen (1sg, weak)', en: 'to read — strong in infinitive, weak in present 1sg' },
        { fi: 'takki (nom.) → takin (gen.) → takissa (iness.)', en: 'coat — kk → k wherever the syllable closes' },
      ],
      commonPitfalls: [
        'The nominative singular is always strong grade.',
        'The partitive singular is also strong grade (taloa, kauppaa, tyttöä).',
        'The plural nominative (-t) is strong grade: kaupat, tytöt.',
      ],
    },
    {
      id: 'cg-single-stops',
      title: 'Single stops: k → ∅, p → v, t → d',
      question: 'Miten yksittäiset klusiilit muuttuvat?',
      questionEn: 'How do single stops change in the weak grade?',
      grammarPattern:
        'Single stops between vowels weaken as follows: k disappears (→ ∅), p becomes v, t becomes d. These are the most dramatic alternations and the source of many surprising-looking forms.',
      formula: 'k → ∅ | p → v | t → d',
      morphology: {
        stem: 'luku',
        ending: '-n',
        gradation: 'k → ∅',
        surface: 'luvun',
        breakdown: [
          { token: 'lu', role: 'stem', note: 'first syllable of luku' },
          { token: 'v', role: 'gradation', note: 'k weakens to ∅, but compensatory v appears (luku → lu_un → luvun)' },
          { token: 'u', role: 'stem', note: 'second syllable vowel' },
          { token: 'n', role: 'ending', note: 'genitive singular ending' },
        ],
      },
      examples: [
        { fi: 'luku → luvun, luvussa, luvulla', en: 'number/chapter → genitive, inessive, adessive (k → ∅, but v inserts between vowels)' },
        { fi: 'kauppa → kaupan, kaupassa, kaupalla', en: 'shop → genitive, inessive, adessive (pp → p)' },
        { fi: 'katu → kadulla, kadusta, kadulle', en: 'street → adessive, elative, allative (t → d)' },
        { fi: 'puku → puvun, puvussa', en: 'suit/costume → genitive, inessive (k → ∅)' },
        { fi: 'apu → avun, avussa', en: 'help → genitive, inessive (p → v)' },
      ],
      commonPitfalls: [
        'k → ∅ between vowels produces a hiatus: luku → lu-u-n, but Finnish then inserts a v: luvun. This v is not in the dictionary form.',
        'p → v only happens to single p between vowels. Geminate pp simply becomes p (kauppa → kaupan, not *kauvaa).',
        'Do not confuse t → d with English "d" — Finnish d in gradation is a soft dental approximant in many dialects.',
      ],
    },
    {
      id: 'cg-geminates',
      title: 'Geminate stops: kk → k, pp → p, tt → t',
      question: 'Miten geminaataklusiilit muuttuvat?',
      questionEn: 'How do geminate stops change?',
      grammarPattern:
        'Geminate (double) stops simply lose one of the two consonants in the weak grade: kk becomes k, pp becomes p, tt becomes t.',
      formula: 'kk → k | pp → p | tt → t',
      morphology: {
        stem: 'takki',
        ending: '-n',
        gradation: 'kk → k',
        surface: 'takin',
        breakdown: [
          { token: 'ta', role: 'stem', note: 'first syllable' },
          { token: 'k', role: 'gradation', note: 'kk weakens to single k' },
          { token: 'i', role: 'stem', note: 'second syllable vowel' },
          { token: 'n', role: 'ending', note: 'genitive singular' },
        ],
      },
      examples: [
        { fi: 'takki → takin, takissa, takilla', en: 'coat → genitive, inessive, adessive' },
        { fi: 'kauppa → kaupan, kaupassa, kaupalla', en: 'shop → genitive, inessive, adessive (pp → p)' },
        { fi: 'hattu → hatun, hatussa, hatulla', en: 'hat → genitive, inessive, adessive (tt → t)' },
        { fi: 'tyttö → tytön, tytössä, tytöllä', en: 'girl → genitive, inessive, adessive (tt → t)' },
        { fi: 'kukko → kukon, kukossa', en: 'rooster → genitive, inessive (kk → k)' },
      ],
      commonPitfalls: [
        'Do not confuse the nominative (strong) with the genitive (weak): takki (nom) vs takin (gen).',
        'The plural nominative uses the strong grade: takit (coats), not *takit — wait, takit IS strong kk → k; the plural -t forces the strong grade stem.',
      ],
    },
    {
      id: 'cg-clusters',
      title: 'Nasal and liquid clusters: nk, mp, nt, lt, rt',
      question: 'Miten konsonanttiryhmät muuttuvat?',
      questionEn: 'How do consonant clusters with nasals and liquids change?',
      grammarPattern:
        'Clusters of a nasal or liquid + stop also undergo gradation, but the change is assimilation rather than deletion: the stop assimilates to the preceding consonant, or the nasal feature spreads.',
      formula: 'nk → ng (written nk but pronounced [ŋg] / [ŋ]) | mp → mm | nt → nn | lt → ll | rt → rr',
      morphology: {
        stem: 'pankki',
        ending: '-ssa',
        gradation: 'nk → ng (written ng in some analyses; the stop k weakens)',
        surface: 'pankissa',
        breakdown: [
          { token: 'pan', role: 'stem', note: 'first syllable + nasal' },
          { token: 'k', role: 'gradation', note: 'k from nk cluster weakens; written as pank- but the k is single now' },
          { token: 'i', role: 'stem', note: 'second syllable vowel' },
          { token: 'ssa', role: 'ending', note: 'inessive ending (back vowel harmony)' },
        ],
      },
      examples: [
        { fi: 'pankki → pankissa, pankin', en: 'bank → inessive, genitive (nk: the k weakens — pankissa not *pankkissa)' },
        { fi: 'kampa → kamman, kammassa', en: 'comb → genitive, inessive (mp → mm)' },
        { fi: 'ranta → rannan, rannassa', en: 'beach/shore → genitive, inessive (nt → nn)' },
        { fi: 'silta → sillan, sillassa', en: 'bridge → genitive, inessive (lt → ll)' },
        { fi: 'parta → parran, parrassa', en: 'beard → genitive, inessive (rt → rr)' },
      ],
      commonPitfalls: [
        'nk does not become nn — it is special: the k disappears but n remains (pankissa, not *pannissa).',
        'mp → mm is a full assimilation: both consonants become m (kampa → kamman).',
        'These cluster changes only affect the stop (k, p, t) of the cluster — the nasal/liquid remains.',
      ],
    },
    {
      id: 'cg-no-gradation',
      title: 'Consonants that never undergo gradation',
      question: 'Mitkä konsonantit eivät muutu?',
      questionEn: 'Which consonants are unaffected by gradation?',
      grammarPattern:
        'Only the stops k, p, and t undergo gradation. The consonants s, l, r, n, m, h, j, and v never change through gradation. This is a hard rule with no exceptions in native Finnish vocabulary.',
      examples: [
        { fi: 'koira → koiran, koirassa, koiralla', en: 'dog → genitive, inessive, adessive (no gradation — r stays r)' },
        { fi: 'mies → miehen, miehessä', en: 'man → genitive, inessive (no gradation — s stays, but note stem change mies → miehe-)' },
        { fi: 'laulu → laulun, laulussa', en: 'song → genitive, inessive (no gradation — l stays l)' },
        { fi: 'nainen → naisen, naisessa', en: 'woman → genitive, inessive (no gradation on n or s)' },
      ],
      commonPitfalls: [
        'Some nouns have irregular stem changes that look like gradation but are not: mies → miehe- is a vowel stem change, not KPT gradation.',
        'The verb ostaa (to buy) → ostan, ostaa — the st here does not undergo gradation; s is not a stop.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'kk → k', use: 'Geminate k weakens to single k in closed syllable', examples: ['takki → takin', 'kukko → kukon'], sectionRef: 'cg-geminates' },
    { pattern: 'pp → p', use: 'Geminate p weakens to single p in closed syllable', examples: ['kauppa → kaupan', 'loppu → lopun'], sectionRef: 'cg-geminates' },
    { pattern: 'tt → t', use: 'Geminate t weakens to single t in closed syllable', examples: ['hattu → hatun', 'tyttö → tytön'], sectionRef: 'cg-geminates' },
    { pattern: 'k → ∅', use: 'Single k disappears (with compensatory v between vowels)', examples: ['luku → luvun', 'puku → puvun'], sectionRef: 'cg-single-stops' },
    { pattern: 'p → v', use: 'Single p becomes v in closed syllable', examples: ['kauppa (already pp)', 'apu → avun'], sectionRef: 'cg-single-stops' },
    { pattern: 't → d', use: 'Single t becomes d in closed syllable', examples: ['katu → kadulla', 'tyttö — but tt so kk-rule applies'], sectionRef: 'cg-single-stops' },
    { pattern: 'nk → ng/nk (weakened)', use: 'k in nk cluster weakens', examples: ['pankki → pankissa'], sectionRef: 'cg-clusters' },
    { pattern: 'mp → mm', use: 'p in mp cluster assimilates', examples: ['kampa → kamman'], sectionRef: 'cg-clusters' },
    { pattern: 'nt → nn', use: 'Cluster assimilation', examples: ['ranta → rannan'], sectionRef: 'cg-clusters' },
    { pattern: 'lt → ll', use: 'Cluster assimilation', examples: ['silta → sillan'], sectionRef: 'cg-clusters' },
    { pattern: 'rt → rr', use: 'Cluster assimilation', examples: ['parta → parran'], sectionRef: 'cg-clusters' },
  ],

  drills: [
    {
      id: 'cg-d1', kind: 'transform', sectionId: 'cg-geminates',
      data: { base: 'takki', instruction: '→ genitive singular', answer: 'takin' },
    },
    {
      id: 'cg-d2', kind: 'transform', sectionId: 'cg-single-stops',
      data: { base: 'katu', instruction: '→ adessive (on the street)', answer: 'kadulla' },
    },
    {
      id: 'cg-d3', kind: 'transform', sectionId: 'cg-clusters',
      data: { base: 'ranta', instruction: '→ inessive (on the beach)', answer: 'rannassa' },
    },
    {
      id: 'cg-d4', kind: 'mc', sectionId: 'cg-single-stops',
      data: {
        prompt: "The genitive of 'luku' (number) is…",
        options: ['lukun', 'lugun', 'luvun', 'lukuun'],
        correctIndex: 2,
        explanation: 'Single k between vowels weakens to ∅, but a v is inserted to avoid a vowel hiatus: luku → luvun.',
      },
    },
    {
      id: 'cg-d5', kind: 'mc', sectionId: 'cg-clusters',
      data: {
        prompt: "The inessive of 'kampa' (comb) is…",
        options: ['kampassa', 'kammassa', 'kampissa', 'kampessa'],
        correctIndex: 1,
        explanation: 'mp → mm in the weak grade: kampa → kammassa.',
      },
    },
    {
      id: 'cg-d6', kind: 'spot-error', sectionId: 'cg-geminates',
      data: {
        sentence: 'Ostsin uuden takkin kaupasta.',
        errorWord: 'takkin',
        correctForm: 'takin',
        explanation: '"takki" has geminate kk which weakens to k in the genitive: takin, not takkin. The genitive is needed after "uuden" as a total object.',
      },
    },
    {
      id: 'cg-d7', kind: 'table', sectionId: 'cg-geminates',
      data: {
        headers: ['Nominative', 'Gradation type', 'Genitive'],
        rows: [
          { label: 'takki', cells: [{ value: 'takki', blank: false }, { value: 'kk → k', blank: false }, { value: 'takin', blank: true }] },
          { label: 'hattu', cells: [{ value: 'hattu', blank: false }, { value: 'tt → t', blank: false }, { value: 'hatun', blank: true }] },
          { label: 'kauppa', cells: [{ value: 'kauppa', blank: false }, { value: 'pp → p', blank: false }, { value: 'kaupan', blank: true }] },
          { label: 'tyttö', cells: [{ value: 'tyttö', blank: false }, { value: 'tt → t', blank: false }, { value: 'tytön', blank: true }] },
        ],
      },
    },
    {
      id: 'cg-d8', kind: 'fill', sectionId: 'cg-clusters',
      data: {
        sentence: 'Silta → _____lla (adessive)',
        answer: 'sillalla',
        hint: 'lt → ll in the weak grade',
        baseForm: 'silta',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Consonant Gradation', url: 'https://uusikielemme.fi/finnish-grammar/phonology/consonant-gradation-in-finnish' },
    { label: 'VISK § 41 — Astevaihtelu', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=41' },
    { label: 'Finnish: An Essential Grammar (Leney & Karlsson)', citation: 'Leney, J. & Karlsson, F. (2008). Finnish: An Essential Grammar. Routledge.', license: 'commercial' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. NUMBERS AND COUNTING
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_NUMBERS_COUNTING: GrammarTopic = {
  id: 'numbers-counting',
  version: '1.0.0',
  title: 'Numbers and counting',
  subtitle: 'Cardinals, ordinals, and the partitive rule.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 15,
  prerequisites: ['partitive'],
  tags: ['morphology', 'numbers'],

  overview: {
    theme: 'Finnish numbers are regular once you know the cardinals up to a thousand. The key grammatical rule is that numbers 2 and above require the partitive singular of the counted noun. Ordinals are formed with predictable suffixes.',
    grammarFocus: [
      'Cardinal numbers 1–10, tens, hundreds, thousands',
      'Numbers + partitive singular: viisi kirjaa (five books)',
      'Number 1 takes nominative; numbers 2+ take partitive singular',
      'Ordinals: ensimmäinen, toinen, kolmas, neljäs… + declension',
      'Phone numbers: read digit by digit',
      'Dates: cardinal for day (partitive), ordinal forms also used',
    ],
    whyItMatters:
      'Numbers appear in prices, times, dates, addresses, and quantities. The partitive rule with numbers is one of the first grammar points where learners make persistent mistakes — internalising it early pays dividends throughout your Finnish studies.',
  },

  sections: [
    {
      id: 'num-cardinals',
      title: 'Cardinal numbers 1–1000',
      question: 'Miten suomalaiset luvut muodostetaan?',
      questionEn: 'How are Finnish cardinal numbers formed?',
      grammarPattern:
        'The basic cardinals are: yksi (1), kaksi (2), kolme (3), neljä (4), viisi (5), kuusi (6), seitsemän (7), kahdeksan (8), yhdeksän (9), kymmenen (10). Teens: 11 = yksitoista … 19 = yhdeksäntoista. Tens: 20 = kaksikymmentä, 30 = kolmekymmentä. Hundreds: 100 = sata, 200 = kaksisataa. 1000 = tuhat.',
      formula: 'teens: [1–9] + toista | tens: [2–9] + kymmentä | hundreds: [2–9] + sataa',
      examples: [
        { fi: 'yksi, kaksi, kolme, neljä, viisi', en: 'one, two, three, four, five' },
        { fi: 'kuusi, seitsemän, kahdeksan, yhdeksän, kymmenen', en: 'six, seven, eight, nine, ten' },
        { fi: 'yksitoista (11), kaksitoista (12), kolmetoista (13)', en: 'eleven, twelve, thirteen' },
        { fi: 'kaksikymmentä (20), kolmekymmentä (30), neljäkymmentä (40)', en: 'twenty, thirty, forty' },
        { fi: 'sata (100), kaksisataa (200), tuhat (1000)', en: 'hundred, two hundred, one thousand' },
      ],
      commonPitfalls: [
        '"kymmenen" is the dictionary form; "kymmentä" is the partitive used in compound numbers (kaksikymmentä).',
        '"sata" (100) is used alone; "sataa" (partitive) appears in compounds: kaksisataa (200).',
        'Do not confuse "kuusi" (six) with "kuusi" (spruce tree) — same spelling, different words.',
      ],
    },
    {
      id: 'num-partitive-rule',
      title: 'Numbers + partitive singular',
      question: 'Mitä sijakäyttöä numerot vaativat?',
      questionEn: 'What case do numbers require?',
      grammarPattern:
        'When a numeral (2 or higher) precedes a noun, the noun takes the PARTITIVE SINGULAR. The numeral itself is in the nominative when it is the subject or object. The number 1 (yksi) takes nominative.',
      formula: '1 + nominative sg | 2+ + partitive sg',
      morphology: {
        surface: 'viisi kirjaa',
        stem: 'kirja',
        ending: '-a',
        breakdown: [
          { token: 'kirj', role: 'stem', note: 'stem of kirja (book)' },
          { token: 'a', role: 'ending', note: 'partitive singular ending — required after numerals 2+' },
        ],
      },
      examples: [
        { fi: 'yksi kirja (one book)', en: 'nominative — yksi (1) takes nominative' },
        { fi: 'kaksi kirjaa (two books)', en: 'partitive singular — kaksi (2) requires partitive' },
        { fi: 'viisi kirjaa (five books)', en: 'partitive singular — same rule for all 2+' },
        { fi: 'kymmenen opiskelijan (ten students — genitive context)', en: 'when the numeral itself is in genitive, noun follows: kymmenen opiskelijan' },
        { fi: 'Meillä on kolme lasta.', en: 'We have three children. (lasta = partitive of lapsi)' },
      ],
      commonPitfalls: [
        'The noun stays in partitive SINGULAR even for large numbers: sata kirjaa (a hundred books) — not plural.',
        'When the number phrase is in a case other than nominative, all elements inflect: kolmessa kirjassa (in three books).',
        'yksi takes nominative: yksi kirja, but "yksi" can itself inflect: yhden kirjan (gen.).',
      ],
    },
    {
      id: 'num-ordinals',
      title: 'Ordinal numbers',
      question: 'Miten järjestysluvut muodostetaan?',
      questionEn: 'How are ordinal numbers formed?',
      grammarPattern:
        'The first two ordinals are irregular: ensimmäinen (1st), toinen (2nd). From 3rd onwards, add -s or -nnes/-nnes to the cardinal stem: kolmas (3rd), neljäs (4th), viides (5th), kuudes (6th), seitsemäs (7th), kahdeksas (8th), yhdeksäs (9th), kymmenes (10th). Ordinals are adjectives and decline like -nen adjectives.',
      formula: 'ensimmäinen (1st), toinen (2nd), kolmas (3rd), neljäs (4th), viides (5th)',
      examples: [
        { fi: 'ensimmäinen (1.), toinen (2.), kolmas (3.)', en: 'first, second, third' },
        { fi: 'neljäs (4.), viides (5.), kuudes (6.)', en: 'fourth, fifth, sixth' },
        { fi: 'seitsemäs (7.), kahdeksas (8.), yhdeksäs (9.), kymmenes (10.)', en: 'seventh, eighth, ninth, tenth' },
        { fi: 'ensimmäinen kerros (the first floor)', en: 'ordinal agrees with noun: ensimmäinen (nom.sg.)' },
        { fi: 'toisella kerroksella (on the second floor)', en: 'ordinal in adessive: toisella' },
      ],
      commonPitfalls: [
        'Ordinals decline fully like adjectives — they must agree in case with the noun they modify.',
        '"toinen" also means "other/another" — context usually disambiguates.',
        'In formal writing, ordinals can be written with numerals + period: 1. (ensimmäinen), 3. (kolmas).',
      ],
    },
    {
      id: 'num-dates-phones',
      title: 'Dates and phone numbers',
      question: 'Miten päivämäärät ja puhelinnumerot luetaan?',
      questionEn: 'How are dates and phone numbers read?',
      grammarPattern:
        'Dates: the day is a cardinal in the partitive (or ordinal in genitive), the month is the genitive of the month name. Phone numbers are read digit by digit, or in pairs.',
      formula: 'Day (partitive) + month (genitive): kahdeksatta tammikuuta | Day ordinal: kahdeksas tammikuuta',
      examples: [
        { fi: '8.1.2025 → kahdeksas tammikuuta kaksituhattakaksikymmentäviisi', en: '8 January 2025 — ordinal for day, genitive for month' },
        { fi: 'Tänään on kolmas maaliskuuta.', en: 'Today is the 3rd of March.' },
        { fi: '+358 40 123 4567 → kolme viisi kahdeksan, neljäkymmentä, yksi kaksi kolme, neljä viisi kuusi seitsemän', en: 'Phone: area code then pairs' },
        { fi: 'syntymäpäivä 15.6. → viidestoista kesäkuuta', en: 'birthday 15 June → 15th of June' },
      ],
      commonPitfalls: [
        'Month names are in the genitive: tammikuun (of January), helmikuun (of February) — not nominative.',
        'In informal speech the day is often just a cardinal: "kahdeksan tammikuuta" — both forms are used.',
      ],
    },
    {
      id: 'num-compounds',
      title: 'Numerals in compound forms',
      question: 'Miten luvut taipuvat yhdyssanoissa?',
      questionEn: 'How do numerals behave in compound forms?',
      grammarPattern:
        'When a number is part of a compound noun or used attributively in a declined form, the whole number phrase inflects. Only the final element of a multi-word number inflects; the rest stay as citation forms.',
      examples: [
        { fi: 'kaksi lasta → kahden lapsen (gen.) → kahdelle lapselle (allat.)', en: 'two children → of two children → to two children' },
        { fi: 'kaksikymmentäkaksi → kahdenkymmenenkahden (gen.)', en: 'twenty-two → genitive of twenty-two (rare in speech)' },
        { fi: 'viidessä kirjassa (in five books)', en: 'number + noun both inflect in inessive' },
        { fi: 'kolmen euron lippu (a three-euro ticket)', en: 'number in genitive modifying noun' },
      ],
      commonPitfalls: [
        'In everyday speech, large compound numbers are usually left undeclined except for the final component.',
        '"kahden" is the genitive of "kaksi" — the stem changes: kaksi → kahde-.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: '1 + noun (nominative sg)', use: 'yksi takes nominative', examples: ['yksi kirja', 'yksi auto'], sectionRef: 'num-partitive-rule' },
    { pattern: '2–∞ + noun (partitive sg)', use: 'All higher numbers take partitive singular', examples: ['kaksi kirjaa', 'sata kirjaa'], sectionRef: 'num-partitive-rule' },
    { pattern: 'ensimmäinen / toinen', use: 'Irregular ordinals for 1st and 2nd', examples: ['ensimmäinen kerros', 'toinen kerta'], sectionRef: 'num-ordinals' },
    { pattern: 'cardinal + -s', use: 'Regular ordinal formation (3rd+)', examples: ['kolmas', 'viides', 'kymmenes'], sectionRef: 'num-ordinals' },
  ],

  drills: [
    {
      id: 'num-d1', kind: 'mc', sectionId: 'num-partitive-rule',
      data: {
        prompt: 'Choose the correct form: "I have three cats."',
        options: ['Minulla on kolme kissa.', 'Minulla on kolme kissaa.', 'Minulla on kolme kissat.', 'Minulla on kolmet kissaa.'],
        correctIndex: 1,
        explanation: 'Numbers 2+ require partitive singular: kolme kissaa (three cats). The noun "kissa" takes partitive -a.',
      },
    },
    {
      id: 'num-d2', kind: 'transform', sectionId: 'num-cardinals',
      data: { base: '7', instruction: '→ Finnish cardinal word', answer: 'seitsemän' },
    },
    {
      id: 'num-d3', kind: 'transform', sectionId: 'num-cardinals',
      data: { base: '15', instruction: '→ Finnish cardinal word', answer: 'viisitoista' },
    },
    {
      id: 'num-d4', kind: 'fill', sectionId: 'num-partitive-rule',
      data: {
        sentence: 'Meillä on viisi _____. (lapsi)',
        answer: 'lasta',
        hint: 'Numbers 2+ take partitive singular: lapsi → lasta',
        baseForm: 'lapsi',
      },
    },
    {
      id: 'num-d5', kind: 'mc', sectionId: 'num-ordinals',
      data: {
        prompt: "What is the Finnish for '3rd'?",
        options: ['kolminen', 'kolmeas', 'kolmas', 'kolmesti'],
        correctIndex: 2,
        explanation: 'Ordinal 3rd = kolmas. The suffix -s attaches to the cardinal stem.',
      },
    },
    {
      id: 'num-d6', kind: 'translate', sectionId: 'num-partitive-rule',
      data: { prompt: 'Two cups of coffee', target: 'kaksi kahvia', acceptAlso: ['Kaksi kahvia'] },
    },
    {
      id: 'num-d7', kind: 'table', sectionId: 'num-cardinals',
      data: {
        headers: ['Digit', 'Finnish word'],
        rows: [
          { label: '6', cells: [{ value: '6', blank: false }, { value: 'kuusi', blank: true }] },
          { label: '8', cells: [{ value: '8', blank: false }, { value: 'kahdeksan', blank: true }] },
          { label: '9', cells: [{ value: '9', blank: false }, { value: 'yhdeksän', blank: true }] },
          { label: '10', cells: [{ value: '10', blank: false }, { value: 'kymmenen', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Numbers', url: 'https://uusikielemme.fi/finnish-grammar/vocabulary/numbers-in-finnish' },
    { label: 'Wiktionary — Finnish numerals', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_numbers' },
    { label: 'VISK § 770 — Numeraalit', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=770' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. CLITICS
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_CLITICS: GrammarTopic = {
  id: 'clitics',
  version: '1.0.0',
  title: 'Clitics',
  subtitle: '-kin, -kaan, -hAn, -pA — particles that attach to words.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 18,
  prerequisites: ['question-particle'],
  tags: ['morphology', 'syntax'],

  overview: {
    theme: 'Finnish clitics are small particles that attach to the end of a word and add nuances of meaning — "also", "either (in negation)", "obviously", "emphasis". They follow vowel harmony and attach to the final word of the element they modify.',
    grammarFocus: [
      '-kin: also/too (positive context)',
      '-kaan/-kään: either (negative context)',
      '-hAn/-hän: obviousness, softening, rhetorical',
      '-pA/-pä: narrative emphasis, mild surprise',
      '-ko/-kö: yes/no question marker (cross-reference from question-particle)',
      'Clitics follow vowel harmony and stack with case endings',
    ],
    whyItMatters:
      'Clitics appear constantly in spoken and written Finnish. Understanding them unlocks a whole layer of pragmatic meaning — whether a speaker is surprised, inviting agreement, or making something sound obvious. Without them, Finnish sounds blunt and robotic.',
  },

  sections: [
    {
      id: 'clit-kin',
      title: '-kin: also, too',
      question: 'Milloin käytetään -kin-liitepartikkelia?',
      questionEn: 'When is the clitic -kin used?',
      grammarPattern:
        '-kin attaches to any word and means "also" or "too" in a positive (non-negated) context. It attaches after case endings and emphasises the word it is attached to.',
      formula: 'word (+ case ending) + -kin',
      morphology: {
        surface: 'Minäkin tulen.',
        stem: 'Minä',
        ending: '-kin',
        breakdown: [
          { token: 'Minä', role: 'stem', note: 'first person pronoun (I)' },
          { token: 'kin', role: 'ending', note: 'additive clitic: "also/too"' },
        ],
      },
      examples: [
        { fi: 'Minäkin tulen.', en: "I'm coming too." },
        { fi: 'Hänkin on opettaja.', en: 'He/she is also a teacher.' },
        { fi: 'Talokin on kaunis.', en: 'The house is beautiful too.' },
        { fi: 'Olenkin väsynyt.', en: 'I am indeed tired. (kin on verb adds "indeed/after all")' },
        { fi: 'Sielläkin on kauppa.', en: 'There is a shop there too. (attaches to adverb)' },
      ],
      commonPitfalls: [
        '-kin cannot be used in negative sentences — use -kaan/-kään instead.',
        'The word that carries -kin is the focused/emphasised element: Minäkin ≠ Tulenkin (different emphasis).',
        'When attached to a verb, -kin often means "after all" or "indeed": Tulinkin kotiin. (I did come home after all.)',
      ],
    },
    {
      id: 'clit-kaan',
      title: '-kaan/-kään: either (in negative context)',
      question: 'Milloin käytetään -kaan/-kään-liitepartikkelia?',
      questionEn: 'When is the clitic -kaan/-kään used?',
      grammarPattern:
        '-kaan (back vowels) / -kään (front vowels) is the negative counterpart of -kin. It appears in sentences containing negation (ei, en, et, emme, ette, eivät) and means "either" or "not … either". It follows vowel harmony.',
      formula: 'negative sentence + word + -kaan/-kään',
      morphology: {
        surface: 'En minäkään tule.',
        stem: 'minä',
        ending: '-kään',
        breakdown: [
          { token: 'minä', role: 'stem', note: 'first person pronoun' },
          { token: 'kään', role: 'ending', note: 'negative additive clitic (front vowel: ä in minä)' },
        ],
      },
      examples: [
        { fi: 'En minäkään tule.', en: "I'm not coming either." },
        { fi: 'Hänkään ei tiedä.', en: 'He/she does not know either.' },
        { fi: 'Meillä ei ole aikakaan.', en: 'We do not have time either.' },
        { fi: 'En osaa suomeakaan.', en: "I can't speak Finnish either. (suomi → suomea partitive + kaan)" },
      ],
      commonPitfalls: [
        '-kaan requires a negation elsewhere in the sentence — it is not itself the negator.',
        'Vowel harmony: back vowels → -kaan; front vowels → -kään (same rule as -kin vs -kin — but kin has no vowel alternation, kaan/kään does).',
        'Do not confuse with -ko/-kö (question particle): tuletko? (are you coming?) vs. tuletkin (you are coming too).',
      ],
    },
    {
      id: 'clit-han',
      title: '-hAn/-hän: obviousness and softening',
      question: 'Mitä -han/-hän lisää lauseeseen?',
      questionEn: 'What does -han/-hän add to a sentence?',
      grammarPattern:
        '-han (back) / -hän (front) is a modal clitic that marks a statement as obvious, expected, or already known. It also softens commands and invitations, making them more polite. In questions it makes the question more rhetorical or invites agreement.',
      formula: 'word + -han/-hän',
      morphology: {
        surface: 'Onhan se selvää.',
        stem: 'On',
        ending: '-han',
        breakdown: [
          { token: 'On', role: 'stem', note: '3sg of olla (is)' },
          { token: 'han', role: 'ending', note: 'obviousness clitic (back vowel: on)' },
        ],
      },
      examples: [
        { fi: 'Onhan se selvää.', en: "It is obvious, isn't it. / Of course it's clear." },
        { fi: 'Tulethan huomenna?', en: 'You are coming tomorrow, right? / Do come tomorrow.' },
        { fi: 'Minähan sanoin sen jo.', en: 'But I already said that. (mild protest, claiming obviousness)' },
        { fi: 'Otetaanhan kahvia.', en: "Let's do have some coffee. (softened invitation)" },
        { fi: 'Eihän se haittaa.', en: "It doesn't matter, does it. (reassurance)" },
      ],
      commonPitfalls: [
        '-han/-hän does not make the sentence a grammatical question — it makes it rhetorical or invites confirmation.',
        'In imperatives, -han/-hän makes the command softer and more like a friendly reminder: Tulethan! (Do come!).',
        'Vowel harmony strictly applies: onhan (back, o), tulethan (back, u), menenhan → menetkö+han → menemme+hän etc.',
      ],
    },
    {
      id: 'clit-pa',
      title: '-pA/-pä: emphasis and narrative',
      question: 'Mitä -pa/-pä lisää lauseeseen?',
      questionEn: 'What does -pa/-pä add?',
      grammarPattern:
        '-pa (back) / -pä (front) adds emphasis, mild surprise, or a narrative/exclamatory tone. It often appears in the first sentence of a sequence or story, or to highlight a pleasing/unexpected result.',
      formula: 'word + -pa/-pä',
      morphology: {
        surface: 'Tulipa hyvä sää.',
        stem: 'Tuli',
        ending: '-pa',
        breakdown: [
          { token: 'Tuli', role: 'stem', note: '3sg past of tulla (came/arrived)' },
          { token: 'pa', role: 'ending', note: 'emphatic/narrative clitic (back vowel: u)' },
        ],
      },
      examples: [
        { fi: 'Tulipa hyvä sää!', en: 'What fine weather (it came to be)! / The weather turned out great!' },
        { fi: 'Onpa siistii!', en: 'That is really neat/cool! (mild exclamation)' },
        { fi: 'Lähtipä hän kotiin.', en: 'And then he left for home. (narrative)' },
        { fi: 'Olinpa väsynyt.', en: 'I was quite tired. (emphasis on degree)' },
        { fi: 'Hyväpä tietää!', en: "Good to know! (= it's good, that)'" },
      ],
      commonPitfalls: [
        '-pa/-pä is primarily a spoken and literary particle — less common in formal writing.',
        'It can attach to almost any word class (verb, adjective, adverb) but the most natural attachment is to the verb.',
        'Do not confuse with the ablative ending -lta/-ltä — completely different.',
      ],
    },
    {
      id: 'clit-ko-crossref',
      title: '-ko/-kö: question particle (cross-reference)',
      question: 'Miten -ko/-kö eroaa muista liitepartikkeleista?',
      questionEn: 'How does -ko/-kö differ from other clitics?',
      grammarPattern:
        '-ko (back) / -kö (front) forms yes/no questions. It attaches to the word being questioned (usually the verb or the focussed element moved to the front). This clitic is covered in detail in the "Question particle" topic; here it is noted for completeness.',
      formula: 'verb / focused word + -ko/-kö → yes/no question',
      examples: [
        { fi: 'Tuletko huomenna?', en: 'Are you coming tomorrow?' },
        { fi: 'Onko hän kotona?', en: 'Is he/she at home?' },
        { fi: 'Kahviako haluat?', en: 'Is it coffee you want? (coffee moved to front for focus + -ko)' },
        { fi: 'Eikö se ole selvää?', en: "Isn't it obvious? (negative question: ei + -kö)" },
      ],
      commonPitfalls: [
        '-ko/-kö always produces a yes/no question — for WH-questions Finnish uses question words (kuka, mitä, missä…) without this clitic.',
        'Clitics can stack: Tuletkohan? (-ko + -han) = "I wonder if you are coming?" (question + rhetorical softener).',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'word + -kin', use: 'Additive "also/too" in affirmative context', examples: ['Minäkin', 'hänkin', 'talokin'], sectionRef: 'clit-kin' },
    { pattern: 'word + -kaan/-kään', use: 'Additive "either" in negative context', examples: ['minäkään', 'hänkään', 'ei … kaan'], sectionRef: 'clit-kaan' },
    { pattern: 'word + -han/-hän', use: 'Obviousness, shared knowledge, rhetorical softening', examples: ['onhan', 'tulethan'], sectionRef: 'clit-han' },
    { pattern: 'word + -pa/-pä', use: 'Emphasis, mild surprise, narrative framing', examples: ['tulipa', 'onpa'], sectionRef: 'clit-pa' },
    { pattern: 'word + -ko/-kö', use: 'Yes/no question formation', examples: ['tuletko', 'onko'], sectionRef: 'clit-ko-crossref' },
  ],

  drills: [
    {
      id: 'clit-d1', kind: 'mc', sectionId: 'clit-kin',
      data: {
        prompt: 'How do you say "She is coming too"?',
        options: ['Hän tulee.', 'Hänkin tulee.', 'Hän tulee kaan.', 'Hänkään tulee.'],
        correctIndex: 1,
        explanation: '-kin attaches directly to the focused word (hän) in affirmative sentences: Hänkin tulee.',
      },
    },
    {
      id: 'clit-d2', kind: 'mc', sectionId: 'clit-kaan',
      data: {
        prompt: 'Which sentence correctly means "I am not coming either"?',
        options: ['Minäkin en tule.', 'En minäkään tule.', 'Minäkaan en tule.', 'En minäkin tule.'],
        correctIndex: 1,
        explanation: 'Negative context requires -kään (front vowel: minä has ä). En minäkään tule.',
      },
    },
    {
      id: 'clit-d3', kind: 'fill', sectionId: 'clit-han',
      data: {
        sentence: 'Onhan se selv_____. (Of course it is clear.)',
        answer: 'selvää',
        hint: 'The sentence structure: Onhan se selvää. The blank is part of the base sentence (onhan = on + han), fill in the predicate adjective.',
        baseForm: 'selvä',
      },
    },
    {
      id: 'clit-d4', kind: 'spot-error', sectionId: 'clit-kaan',
      data: {
        sentence: 'Hänkin ei tule tänään.',
        errorWord: 'Hänkin',
        correctForm: 'Hänkään',
        explanation: 'Negative sentences require -kaan/-kään, not -kin. Since "hän" has neutral vowels → back vowel rule → -kaan. But ä in hän is front → -kään. Correct: Hänkään ei tule tänään.',
      },
    },
    {
      id: 'clit-d5', kind: 'translate', sectionId: 'clit-pa',
      data: { prompt: 'What fine weather!', target: 'Tulipa hyvä sää', acceptAlso: ['Tulipa hyvä sää!', 'Onpa hyvä sää', 'Onpa hyvä sää!'] },
    },
    {
      id: 'clit-d6', kind: 'mc', sectionId: 'clit-han',
      data: {
        prompt: 'What nuance does -han/-hän add?',
        options: ['Forms a yes/no question', 'Adds "also/too"', 'Signals obviousness or softens a statement', 'Expresses surprise only'],
        correctIndex: 2,
        explanation: '-han/-hän marks a statement as obvious, expected, or softens a command/question to be more polite.',
      },
    },
    {
      id: 'clit-d7', kind: 'builder', sectionId: 'clit-kin',
      data: {
        tiles: ['Minäkin', 'tulen', 'huomenna'],
        correctOrder: [0, 1, 2],
        translation: "I'm coming tomorrow too.",
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Clitics', url: 'https://uusikielemme.fi/finnish-grammar/clitics' },
    { label: 'VISK § 126 — Liitepartikkelit', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=126' },
    { label: 'Karlsson, F. — Finnish: A Comprehensive Grammar', citation: 'Karlsson, F. (1999). Finnish: A Comprehensive Grammar. Routledge.', license: 'commercial' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. DERIVATION: NOUNS FROM VERBS
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_DERIVATION_NOUNS: GrammarTopic = {
  id: 'derivation-nouns',
  version: '1.0.0',
  title: 'Noun derivation',
  subtitle: 'Building nouns from verbs with -minen, -ja, -us, and more.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 20,
  prerequisites: ['infinitive-1', 'nominative'],
  tags: ['morphology'],

  overview: {
    theme: 'Finnish has productive derivational suffixes that convert verbs into nouns. Knowing these suffixes lets you build — and recognise — thousands of words without memorising them individually.',
    grammarFocus: [
      '-minen: action noun from any verb (process/act of doing)',
      '-ja/-jä: agent noun (the person/thing that does)',
      '-us/-ys/-os/-ös: abstract result noun (the outcome of an action)',
      '-(i)n / -uri: instrument noun (the tool used to do)',
    ],
    whyItMatters:
      'A large share of Finnish vocabulary is built through derivation. Recognising these suffixes lets you decode words like "opiskeleminen" (studying), "opettaja" (teacher), "harjoitus" (exercise), and "avain" (key) as predictable rather than arbitrary.',
  },

  sections: [
    {
      id: 'der-minen',
      title: '-minen: the action noun',
      question: 'Miten -minen-johdos muodostetaan?',
      questionEn: 'How is the -minen action noun formed?',
      grammarPattern:
        'Take the verb stem (infinitive minus final -a/-ä), add -minen. The result is a noun meaning "the act/process of [verb]-ing". It is highly productive and can be formed from virtually any Finnish verb.',
      formula: 'verb infinitive stem + -minen',
      morphology: {
        surface: 'opiskeleminen',
        stem: 'opiskele',
        ending: '-minen',
        breakdown: [
          { token: 'opiskele', role: 'stem', note: 'present stem of opiskella (to study)' },
          { token: 'minen', role: 'ending', note: 'action noun suffix' },
        ],
      },
      examples: [
        { fi: 'tehdä → tekeminen', en: 'to do → doing/the doing' },
        { fi: 'opiskella → opiskeleminen', en: 'to study → studying' },
        { fi: 'lukea → lukeminen', en: 'to read → reading' },
        { fi: 'puhua → puhuminen', en: 'to speak → speaking' },
        { fi: 'Opiskeleminen on hauskaa.', en: 'Studying is fun. (subject of sentence)' },
        { fi: 'Pidän lukemisesta.', en: 'I like reading. (elative after pitää)' },
      ],
      commonPitfalls: [
        '-minen nouns decline like -nen adjectives: opiskelemi-nen → opiskelemi-sen (gen.), opiskelemi-sta (part.), opiskelemi-sessa (iness.).',
        'The verb stem used is always the present/infinitive stem — do not use the past participle stem.',
        'When used with a possessive suffix: lukemiseni (my reading), lukemisesi (your reading).',
      ],
    },
    {
      id: 'der-ja',
      title: '-ja/-jä: the agent noun',
      question: 'Miten tekijännimet muodostetaan?',
      questionEn: 'How are agent nouns formed?',
      grammarPattern:
        'Add -ja (back vowels) or -jä (front vowels) to the present-tense stem. The result means "the one who [verb]s" — a person, profession, or device.',
      formula: 'verb present stem + -ja/-jä',
      morphology: {
        surface: 'opettaja',
        stem: 'opetta',
        ending: '-ja',
        breakdown: [
          { token: 'opetta', role: 'stem', note: 'present stem of opettaa (to teach)' },
          { token: 'ja', role: 'ending', note: 'agent noun suffix (back vowel: a)' },
        ],
      },
      examples: [
        { fi: 'opettaa → opettaja', en: 'to teach → teacher' },
        { fi: 'kirjoittaa → kirjoittaja', en: 'to write → writer' },
        { fi: 'lukea → lukija', en: 'to read → reader' },
        { fi: 'ajaa → ajaja', en: 'to drive → driver' },
        { fi: 'myydä → myyjä', en: 'to sell → seller/vendor' },
        { fi: 'soittaa → soittaja', en: 'to play (instrument) → player/musician' },
      ],
      commonPitfalls: [
        'Agent nouns decline as Type 1 nouns (opettaja, opettajan, opettajaa, opettajassa…).',
        'Some agent nouns have shifted meaning: "ajaja" can mean driver but "kuljettaja" is more common for professional driver.',
        'Vowel harmony: opettaja (back, -ja); myyjä (front ö/y → -jä).',
      ],
    },
    {
      id: 'der-us',
      title: '-us/-ys/-os/-ös: result noun',
      question: 'Miten tulos- ja abstraktisanat muodostetaan -us-päätteellä?',
      questionEn: 'How are result/abstract nouns formed with -us/-ys?',
      grammarPattern:
        'Add -us/-ys (front) or -os/-ös (rarer) to the verb stem. These nouns denote the result, product, or abstract concept of the action. Many common Finnish nouns are of this type.',
      formula: 'verb stem + -us/-ys (back/front) → result noun',
      morphology: {
        surface: 'harjoitus',
        stem: 'harjoitta',
        ending: '-us',
        breakdown: [
          { token: 'harjoitta', role: 'stem', note: 'stem of harjoitella/harjoittaa (to practise/exercise)' },
          { token: 'us', role: 'ending', note: 'result noun suffix (back vowel)' },
        ],
      },
      examples: [
        { fi: 'ratkoa → ratkaisu', en: 'to solve → solution (note: ratkoa → ratkais-u, irregular stem)' },
        { fi: 'harjoitella → harjoitus', en: 'to practise → exercise/practice' },
        { fi: 'käyttää → käyttö', en: 'to use → use/usage (variant: -ö)' },
        { fi: 'vastata → vastaus', en: 'to answer → answer/response' },
        { fi: 'kysyä → kysymys', en: 'to ask → question (note: -mys variant from -minen-stem)' },
        { fi: 'muistaa → muisto', en: 'to remember → memory/remembrance' },
      ],
      commonPitfalls: [
        'The exact stem used before -us can involve minor changes — always check a dictionary for irregular forms like ratkaisu.',
        '-us/-ys nouns follow the common pattern: harjoitus → harjoituksen (gen.), harjoitusta (part.), harjoituksessa (iness.).',
        '"Kysymys" looks like -mys but derives from kysyä — the derivation path can be opaque in some words.',
      ],
    },
    {
      id: 'der-in',
      title: '-(i)n and -uri: instrument nouns',
      question: 'Miten välinenimet muodostetaan?',
      questionEn: 'How are instrument nouns formed?',
      grammarPattern:
        'The suffix -(i)n creates instrument nouns meaning "the thing used to [verb]". The stem undergoes consonant gradation. A related suffix -uri/-yri also forms instrument nouns (often for mechanical or electronic devices).',
      formula: 'verb stem + -(i)n → tool noun | verb stem + -uri/-yri → (modern/technical) tool noun',
      morphology: {
        surface: 'avain',
        stem: 'avaa',
        ending: '-in',
        breakdown: [
          { token: 'ava', role: 'stem', note: 'stem of avata (to open)' },
          { token: 'in', role: 'ending', note: 'instrument suffix (vowel changes: avaa+in → avain)' },
        ],
      },
      examples: [
        { fi: 'avata → avain', en: 'to open → key (instrument for opening)' },
        { fi: 'leikata → leikkuri', en: 'to cut → cutter/scissors (instrument for cutting)' },
        { fi: 'piirtää → piirrin', en: 'to draw → drawing tool/plotter' },
        { fi: 'soittaa → soitin', en: 'to play (music) → musical instrument' },
        { fi: 'kirjoittaa → kirjoitin', en: 'to write → writing device/printer (archaic)' },
        { fi: 'tulostaa → tulostin', en: 'to print (modern) → printer' },
      ],
      commonPitfalls: [
        '"avain" is irregular in declension: avain → avaimen (gen.), avaimia (part.pl.) — the stem is avai-men-.',
        'The -uri suffix is particularly common in modern Finnish for technology: tulostin (printer), tietokone (computer — from tieto + kone).',
        'Not every -in word is an instrument noun — some are other derivations entirely.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'verb stem + -minen', use: 'Action noun: the act/process of doing', examples: ['tekeminen', 'opiskeleminen', 'lukeminen'], sectionRef: 'der-minen' },
    { pattern: 'verb stem + -ja/-jä', use: 'Agent noun: the one who does', examples: ['opettaja', 'kirjoittaja', 'lukija'], sectionRef: 'der-ja' },
    { pattern: 'verb stem + -us/-ys', use: 'Result/abstract noun', examples: ['harjoitus', 'vastaus', 'ratkaisu'], sectionRef: 'der-us' },
    { pattern: 'verb stem + -(i)n', use: 'Instrument noun: the tool for doing', examples: ['avain', 'soitin', 'tulostin'], sectionRef: 'der-in' },
  ],

  drills: [
    {
      id: 'der-d1', kind: 'transform', sectionId: 'der-minen',
      data: { base: 'puhua', instruction: '→ action noun (-minen)', answer: 'puhuminen' },
    },
    {
      id: 'der-d2', kind: 'transform', sectionId: 'der-minen',
      data: { base: 'lukea', instruction: '→ action noun (-minen)', answer: 'lukeminen' },
    },
    {
      id: 'der-d3', kind: 'transform', sectionId: 'der-ja',
      data: { base: 'kirjoittaa', instruction: '→ agent noun (-ja/-jä)', answer: 'kirjoittaja' },
    },
    {
      id: 'der-d4', kind: 'mc', sectionId: 'der-ja',
      data: {
        prompt: "What is the agent noun from 'myydä' (to sell)?",
        options: ['myyjä', 'myyjä', 'myyminen', 'myynti'],
        correctIndex: 0,
        explanation: 'myydä → present stem myy- + -jä (front vowel: y) → myyjä (seller).',
      },
    },
    {
      id: 'der-d5', kind: 'mc', sectionId: 'der-us',
      data: {
        prompt: "Which noun is derived from 'vastata' (to answer)?",
        options: ['vastaaja', 'vastaaminen', 'vastaus', 'vastainen'],
        correctIndex: 2,
        explanation: 'vastata → vastaus (answer/response). This is a -us result noun.',
      },
    },
    {
      id: 'der-d6', kind: 'fill', sectionId: 'der-minen',
      data: {
        sentence: '_____ on hauskaa. (opiskella)',
        answer: 'Opiskeleminen',
        hint: 'opiskella → present stem opiskele- + -minen',
        baseForm: 'opiskella',
      },
    },
    {
      id: 'der-d7', kind: 'translate', sectionId: 'der-minen',
      data: { prompt: 'I like reading.', target: 'Pidän lukemisesta', acceptAlso: ['Pidän lukemisesta.'] },
    },
    {
      id: 'der-d8', kind: 'table', sectionId: 'der-ja',
      data: {
        headers: ['Verb', 'Agent noun (-ja/-jä)'],
        rows: [
          { label: 'opettaa', cells: [{ value: 'opettaa (to teach)', blank: false }, { value: 'opettaja', blank: true }] },
          { label: 'soittaa', cells: [{ value: 'soittaa (to play)', blank: false }, { value: 'soittaja', blank: true }] },
          { label: 'ajaa', cells: [{ value: 'ajaa (to drive)', blank: false }, { value: 'ajaja', blank: true }] },
          { label: 'myydä', cells: [{ value: 'myydä (to sell)', blank: false }, { value: 'myyjä', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'VISK § 155 — Verbikantaiset johdokset', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=155' },
    { label: 'Uusi kielemme — Word derivation', url: 'https://uusikielemme.fi/finnish-grammar/word-formation' },
    { label: 'Wiktionary — Finnish derivational suffixes', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_derivational_suffixes' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLURAL FORMS
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_PLURAL_FORMS: GrammarTopic = {
  id: 'plural-forms',
  version: '1.0.0',
  title: 'Plural forms',
  subtitle: 'Nominative -t, oblique -i-, and partitive plural patterns.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 22,
  prerequisites: ['partitive', 'genitive', 'consonant-gradation'],
  tags: ['morphology'],

  overview: {
    theme: 'Finnish plurals are formed differently depending on the case. The nominative plural uses -t; all other (oblique) cases insert -i- into the stem; the partitive plural has its own set of endings. Vowel changes occur before -i- and must be memorised.',
    grammarFocus: [
      'Nominative plural: strong-grade stem + -t',
      'Oblique plural stem: weak-grade stem + -i- (inserted vowel)',
      'Vowel changes before -i-: a → o (or drop), ä → ö (or drop), final -e stays',
      'Partitive plural endings: -ja/-jä, -ia/-iä, -oita/-öitä, -eja/-ejä',
      'Contrast: talot (nom.pl) vs. taloissa (iness.pl) vs. taloja (part.pl)',
    ],
    whyItMatters:
      'Every case has both singular and plural forms. Understanding how the plural stem is built — and how the vowel changes work — unlocks all 15 plural case forms from a single rule set.',
  },

  sections: [
    {
      id: 'plu-nominative',
      title: 'Nominative plural: strong grade + -t',
      question: 'Miten nominatiivin monikko muodostetaan?',
      questionEn: 'How is the nominative plural formed?',
      grammarPattern:
        'The nominative plural is formed by adding -t to the strong-grade stem. This is the only plural form that uses the strong grade — all other plural cases use the weak-grade oblique stem.',
      caseMarker: '-t',
      morphology: {
        stem: 'talo',
        ending: '-t',
        surface: 'talot',
        breakdown: [
          { token: 'talo', role: 'stem', note: 'strong-grade stem of talo (house)' },
          { token: 't', role: 'ending', note: 'nominative plural marker' },
        ],
      },
      examples: [
        { fi: 'talo → talot', en: 'house → houses' },
        { fi: 'kirja → kirjat', en: 'book → books' },
        { fi: 'koira → koirat', en: 'dog → dogs' },
        { fi: 'kauppa → kaupat', en: 'shop → shops (pp → p: strong grade nom.pl)' },
        { fi: 'tyttö → tytöt', en: 'girl → girls (tt → t: strong grade)' },
        { fi: 'pöytä → pöydät', en: 'table → tables (strong grade pöytä; t stays since nom.pl is strong)' },
      ],
      commonPitfalls: [
        'The nominative plural uses the STRONG grade — unlike the genitive singular which uses the weak grade.',
        'Do not confuse talot (nom.pl) with talon (gen.sg): -t marks plural nominative, -n marks genitive singular.',
      ],
    },
    {
      id: 'plu-oblique-stem',
      title: 'The oblique plural stem: weak grade + -i-',
      question: 'Miten muiden sijojen monikkovartalo muodostetaan?',
      questionEn: 'How is the oblique plural stem formed?',
      grammarPattern:
        'For all cases other than the nominative plural, insert -i- into the weak-grade stem before the case ending. This -i- is the plural marker in oblique cases. The weak grade is the same as the genitive singular stem (stem minus -n).',
      formula: 'weak-grade stem + -i- + case ending',
      morphology: {
        stem: 'talo',
        ending: '-issa',
        gradation: '(no gradation needed here)',
        surface: 'taloissa',
        breakdown: [
          { token: 'talo', role: 'stem', note: 'weak-grade stem (same as nominative for talo)' },
          { token: 'i', role: 'gradation', note: 'oblique plural marker inserted' },
          { token: 'ssa', role: 'ending', note: 'inessive case ending' },
        ],
      },
      examples: [
        { fi: 'taloissa (in the houses)', en: 'inessive plural: talo + i + ssa' },
        { fi: 'taloilla (on the houses)', en: 'adessive plural: talo + i + lla' },
        { fi: 'taloista (from the houses)', en: 'elative plural: talo + i + sta' },
        { fi: 'kirjoissa (in the books)', en: 'inessive plural: kirja → kirjo- + i + ssa (a → o before -i-)' },
        { fi: 'kirjoilla (on the books)', en: 'adessive plural: kirja → kirjo + i + lla' },
        { fi: 'kaupassa → kaupoissa (in the shops)', en: 'inessive plural: kauppa → weak kaupa- → kaupoi + ssa' },
      ],
      commonPitfalls: [
        'The oblique plural -i- causes vowel changes: a → o, ä → ö, final -a/-ä often drops entirely before -i-.',
        'Always use the WEAK grade for oblique plural stems, not the strong grade.',
      ],
    },
    {
      id: 'plu-vowel-changes',
      title: 'Vowel changes before -i-',
      question: 'Miten vokaali muuttuu ennen -i-vartaloa?',
      questionEn: 'How do vowels change before the plural -i-?',
      grammarPattern:
        'When the plural -i- is added, the final vowel of the stem often changes or disappears. The main rules are: a → o (taloa → taloi-), ä → ö (pöytää → pöydöi-), final -a/-ä after a consonant often drops (kirja → kirjoi-, tyttö → tytöi-). Final -e is usually kept or simplified.',
      formula: 'stem final -a → -o + i | stem final -ä → -ö + i | consonant + a/ä: drop the vowel + i',
      examples: [
        { fi: 'talo (back, a→o): taloi- → taloissa, taloilla', en: 'house: a changes to o before plural -i-' },
        { fi: 'kirja (back, a drops after consonant): kirjoi- → kirjoissa, kirjoilla', en: 'book: final -a drops, -o- inserted' },
        { fi: 'pöytä (front, ä→ö): pöydöi- → pöydöissä, pöydöillä', en: 'table: ä → ö before plural -i-' },
        { fi: 'kieli (e→e, i drops): kiel- → kielissä (stem kiele-; final e stays)', en: 'language: final -e of stem simplifies' },
        { fi: 'nainen (nen → s): naisissa (nom.sg nainen → stem naise-)', en: 'woman: -nen words use -s- stem' },
      ],
      commonPitfalls: [
        'The vowel change before -i- is not always predictable — learning the genitive singular (which gives the stem) for each noun is essential.',
        '"kieli" has a complex stem (kiele-/kiel-) — the plural oblique is kielissä, kielillä (not *kielöissä).',
        '-nen nouns: nainen → naisen → stem naise- → oblique plural naisissa, naisilla.',
      ],
    },
    {
      id: 'plu-partitive',
      title: 'Partitive plural',
      question: 'Miten partitiivin monikko muodostetaan?',
      questionEn: 'How is the partitive plural formed?',
      grammarPattern:
        'The partitive plural has several endings depending on the noun type. The most common endings are: -ja/-jä (most nouns), -ia/-iä (i-stem nouns), -oita/-öitä (vowel-change nouns), and -eja/-ejä (e-stem nouns). There is no single rule — you must learn which type applies.',
      formula: '-ja/-jä | -ia/-iä | -oita/-öitä | -eja/-ejä',
      examples: [
        { fi: 'talo → taloja', en: 'house → houses (partitive plural: -ja)' },
        { fi: 'koira → koiria', en: 'dog → dogs (partitive plural: -ia, stem koira → koiri-)' },
        { fi: 'omena → omenoita', en: 'apple → apples (partitive plural: -oita)' },
        { fi: 'kieli → kieliä', en: 'language → languages (partitive plural: -ä, front)' },
        { fi: 'tyttö → tyttöjä', en: 'girl → girls (partitive plural: -jä, front)' },
        { fi: 'piste → pisteitä', en: 'point → points (partitive plural: -itä, front; e-stem)' },
      ],
      commonPitfalls: [
        'The partitive plural is separate from the oblique plural stem — do not add -i- + partitive; the partitive plural has its own forms.',
        '"taloja" is partitive plural but "taloissa" is inessive plural — the two are built differently.',
        'For the -oita/-öitä type: omena → omenoita. The -oi- comes from vowel change a→o, then -ta/-tä partitive plural marker.',
      ],
    },
    {
      id: 'plu-contrast',
      title: 'Contrasting the three main plural forms',
      question: 'Mitä eroa on talot / taloissa / taloja -muotojen välillä?',
      questionEn: 'What is the difference between talot / taloissa / taloja?',
      grammarPattern:
        'Three distinct plural forms of "talo" illustrate the three-way split: nominative plural (talot), oblique plural (taloissa etc.), and partitive plural (taloja). Each has a different use and a different way of being formed.',
      formula: 'nom.pl = stem + -t | oblique = weak stem + -i- + ending | part.pl = stem + -ja/-jä (etc.)',
      examples: [
        { fi: 'Talot ovat isoja. (nom.pl)', en: 'The houses are big. (subject — nominative plural)' },
        { fi: 'Asun taloissa. (iness.pl)', en: 'I live in the houses. (location — oblique plural)' },
        { fi: 'Näen taloja. (part.pl)', en: 'I see (some) houses. (partial object — partitive plural)' },
        { fi: 'Kirjat ovat pöydällä. vs Kirjoissa on virheitä. vs Luen kirjoja.', en: 'books (nom.pl) / in books (iness.pl) / I read books (part.pl)' },
      ],
      commonPitfalls: [
        'Nominative plural -t is ONLY for nominative. In every other case the plural is signalled by -i- in the stem.',
        '"taloja" (part.pl) vs "taloa" (part.sg): the plural has -j- inserted before -a.',
        'When a number phrase is used, the noun is always PARTITIVE SINGULAR — not any kind of plural.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'strong-grade stem + -t', use: 'Nominative plural', examples: ['talot', 'kirjat', 'kaupat', 'tytöt'], sectionRef: 'plu-nominative' },
    { pattern: 'weak-grade stem + -i- + case', use: 'Oblique plural (all non-nominative cases)', examples: ['taloissa', 'kirjoilla', 'kaupat → kaupoissa'], sectionRef: 'plu-oblique-stem' },
    { pattern: 'stem + -ja/-jä', use: 'Partitive plural (most nouns)', examples: ['taloja', 'tyttöjä', 'kirjoja'], sectionRef: 'plu-partitive' },
    { pattern: 'stem + -ia/-iä', use: 'Partitive plural (i-stem and some others)', examples: ['koiria', 'kieliä'], sectionRef: 'plu-partitive' },
    { pattern: 'stem + -oita/-öitä', use: 'Partitive plural (vowel-change nouns)', examples: ['omenoita', 'pisteitä'], sectionRef: 'plu-partitive' },
    { pattern: 'a → o before -i-', use: 'Vowel change in oblique plural stem', examples: ['talo(a) → taloi-', 'kirja → kirjoi-'], sectionRef: 'plu-vowel-changes' },
    { pattern: 'ä → ö before -i-', use: 'Front-vowel equivalent change', examples: ['pöytä → pöydöi-', 'tyttö → tytöi-'], sectionRef: 'plu-vowel-changes' },
  ],

  drills: [
    {
      id: 'plu-d1', kind: 'transform', sectionId: 'plu-nominative',
      data: { base: 'kirja', instruction: '→ nominative plural', answer: 'kirjat' },
    },
    {
      id: 'plu-d2', kind: 'transform', sectionId: 'plu-oblique-stem',
      data: { base: 'talo', instruction: '→ inessive plural (in the houses)', answer: 'taloissa' },
    },
    {
      id: 'plu-d3', kind: 'transform', sectionId: 'plu-partitive',
      data: { base: 'talo', instruction: '→ partitive plural', answer: 'taloja' },
    },
    {
      id: 'plu-d4', kind: 'mc', sectionId: 'plu-contrast',
      data: {
        prompt: "Which form means 'in the books' (inessive plural)?",
        options: ['kirjat', 'kirjoja', 'kirjoissa', 'kirjojen'],
        correctIndex: 2,
        explanation: 'Inessive plural: weak stem kirja → kirjo + i + ssa = kirjoissa.',
      },
    },
    {
      id: 'plu-d5', kind: 'mc', sectionId: 'plu-partitive',
      data: {
        prompt: "What is the partitive plural of 'koira' (dog)?",
        options: ['koirat', 'koiroja', 'koiria', 'koirissa'],
        correctIndex: 2,
        explanation: 'koira → partitive plural koiria (-ia ending for this noun type).',
      },
    },
    {
      id: 'plu-d6', kind: 'spot-error', sectionId: 'plu-contrast',
      data: {
        sentence: 'Näen talojen kadulla.',
        errorWord: 'talojen',
        correctForm: 'taloja',
        explanation: '"Näen" (I see) takes a partitive object. Partitive plural of talo = taloja. "talojen" is the genitive plural, not partitive plural.',
      },
    },
    {
      id: 'plu-d7', kind: 'table', sectionId: 'plu-contrast',
      data: {
        headers: ['Form', 'Finnish', 'Case / Use'],
        rows: [
          { label: 'talot', cells: [{ value: 'talot', blank: false }, { value: 'nominative plural', blank: false }, { value: 'subject: talot ovat isoja', blank: false }] },
          { label: 'taloissa', cells: [{ value: 'taloissa', blank: true }, { value: 'inessive plural', blank: false }, { value: 'location: in the houses', blank: false }] },
          { label: 'taloja', cells: [{ value: 'taloja', blank: true }, { value: 'partitive plural', blank: false }, { value: 'partial object: näen taloja', blank: false }] },
          { label: 'taloilla', cells: [{ value: 'taloilla', blank: true }, { value: 'adessive plural', blank: false }, { value: 'location: on the houses', blank: false }] },
        ],
      },
    },
    {
      id: 'plu-d8', kind: 'fill', sectionId: 'plu-oblique-stem',
      data: {
        sentence: 'Käyn usein kirjo_____. (kirja, adessive plural — on/at the books)',
        answer: 'kirjoilla',
        hint: 'kirja → weak oblique plural stem kirjoi- + -lla (adessive)',
        baseForm: 'kirja',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Plural forms', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/plural-forms-in-finnish' },
    { label: 'VISK § 95 — Monikon tunnus', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=95' },
    { label: 'Leney & Karlsson — Finnish: An Essential Grammar (ch. 4)', citation: 'Leney, J. & Karlsson, F. (2008). Finnish: An Essential Grammar. Routledge.', license: 'commercial' },
    { label: 'Wiktionary — Finnish nominal declension', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_nominal_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const MORPHOLOGY_TOPICS: GrammarTopic[] = [
  TOPIC_VOWEL_HARMONY,
  TOPIC_CONSONANT_GRADATION,
  TOPIC_NUMBERS_COUNTING,
  TOPIC_CLITICS,
  TOPIC_DERIVATION_NOUNS,
  TOPIC_PLURAL_FORMS,
];
