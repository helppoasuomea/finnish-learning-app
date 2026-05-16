import type { GrammarTopic } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// 1. NOMINATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_NOMINATIVE: GrammarTopic = {
  id: 'nominative',
  version: '1.0.0',
  title: 'Nominative case',
  subtitle: 'The dictionary form. Subjects and complements.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: [],
  tags: ['cases'],

  overview: {
    theme: 'The nominative is the base form of a noun — the form you find in the dictionary. It is used for the subject of a sentence and for predicative complements.',
    grammarFocus: [
      'Singular nominative: the bare dictionary form, no ending added',
      'Plural nominative: singular stem + -t',
      'Consonant gradation affects the plural stem',
      'Predicative complement: the noun after "is / are" agrees in case',
    ],
    whyItMatters:
      'Every noun you ever look up in a dictionary is in the nominative. Understanding which words are subjects — and how plurals are formed — is the starting point for all Finnish grammar.',
  },

  sections: [
    {
      id: 'nom-singular',
      title: 'Singular nominative',
      question: 'Mikä tämä on?',
      questionEn: 'What is this? (singular)',
      grammarPattern:
        'The singular nominative is the citation form. No ending is added. This is the form you find in dictionaries.',
      caseMarker: '(no ending)',
      morphology: {
        stem: 'talo',
        ending: '',
        surface: 'talo',
        breakdown: [
          { token: 'talo', role: 'stem', note: 'house — stem and nominative are identical' },
        ],
      },
      examples: [
        { fi: 'Talo on iso.', en: 'The house is big.' },
        { fi: 'Koira juoksee.', en: 'The dog is running.' },
        { fi: 'Auto seisoo kadulla.', en: 'The car is standing on the street.' },
        { fi: 'Pekka on opiskelija.', en: 'Pekka is a student.' },
      ],
      commonPitfalls: [
        'Do not confuse the singular nominative with the genitive: "talo" (nominative) vs "talon" (genitive).',
        'Mass nouns and abstract nouns used as subjects are also in the nominative: "Kahvi on hyvää."',
      ],
    },
    {
      id: 'nom-plural',
      title: 'Plural nominative',
      question: 'Mitkä nämä ovat?',
      questionEn: 'What are these? (plural)',
      grammarPattern:
        'The plural nominative is formed by adding -t to the stem. The stem is often the same as the genitive singular minus the -n, and consonant gradation may apply.',
      caseMarker: '-t',
      morphology: {
        stem: 'talo',
        ending: '-t',
        surface: 'talot',
        breakdown: [
          { token: 'talo', role: 'stem', note: 'house' },
          { token: 't', role: 'ending', note: 'plural nominative marker' },
        ],
      },
      examples: [
        { fi: 'Talot ovat isoja.', en: 'The houses are big.' },
        { fi: 'Koirat juoksevat.', en: 'The dogs are running.' },
        { fi: 'Opiskelijat opiskelevat.', en: 'The students are studying.' },
        { fi: 'Kirjat ovat pöydällä.', en: 'The books are on the table.' },
      ],
      commonPitfalls: [
        'The plural -t is only for the nominative. In other cases the plural marker is -i- inserted into the stem.',
        'Do not add -t to the genitive stem: "kirja" → "kirjat", not "kirjant".',
      ],
    },
    {
      id: 'nom-gradation',
      title: 'Consonant gradation in the plural',
      question: 'Miksi "kauppa" → "kaupat"?',
      questionEn: 'Why does the stem change in the plural?',
      grammarPattern:
        'Consonant gradation (KPT alternation) affects the stem used before the plural -t. Like the genitive singular, the -t ending closes the final syllable, so the weak grade appears in the nominative plural. Compare: kauppa (nom.sg, strong) → kaupan (gen.sg, weak) → kaupat (nom.pl, weak).',
      formula: 'Weak-grade stem + -t',
      morphology: {
        stem: 'kauppa',
        gradation: 'pp → p (weak grade — -t closes the syllable)',
        ending: '-t',
        surface: 'kaupat',
        breakdown: [
          { token: 'kaupa', role: 'stem', note: 'weak-grade stem of kauppa (pp → p because -t closes the syllable)' },
          { token: 't', role: 'ending', note: 'plural nominative -t' },
        ],
      },
      examples: [
        { fi: 'kauppa → kaupat', en: 'shop → shops (pp → p: weak grade)' },
        { fi: 'pankki → pankit', en: 'bank → banks (kk → k: weak grade)' },
        { fi: 'tyttö → tytöt', en: 'girl → girls (tt → t: weak grade)' },
        { fi: 'hattu → hatut', en: 'hat → hats (tt → t: weak grade)' },
        { fi: 'kampa → kammat', en: 'comb → combs (mp → mm: regular weak grade for nasal+stop clusters)' },
        { fi: 'ranta → rannat', en: 'shore → shores (nt → nn: weak grade)' },
        { fi: 'silta → sillat', en: 'bridge → bridges (lt → ll: weak grade)' },
      ],
      commonPitfalls: [
        'Both genitive singular AND nominative plural use the weak grade — because both -n and -t close the final syllable. The difference is only the final consonant: kaupan (gen.sg) vs kaupat (nom.pl).',
        'Not all words have gradation. Words like "koira" simply become "koirat".',
      ],
    },
    {
      id: 'nom-predicative',
      title: 'Predicative complement',
      question: 'Mitä hän on ammatiltaan?',
      questionEn: 'What is he/she by profession?',
      grammarPattern:
        'A noun complement after "olla" (to be) is in the nominative when it fully identifies the subject. This is called the predicative.',
      caseMarker: 'nominative (predicative)',
      examples: [
        { fi: 'Hän on lääkäri.', en: 'He/she is a doctor.' },
        { fi: 'Tämä on kirja.', en: 'This is a book.' },
        { fi: 'He ovat opiskelijoita.', en: 'They are students. (partitive plural — indefinite)' },
        { fi: 'Nuo ovat koirat.', en: 'Those are the dogs. (definite — nominative plural)' },
      ],
      commonPitfalls: [
        'When identifying a specific, definite set ("those are THE dogs"), use the nominative plural.',
        'When the predicate is indefinite or partial ("they are students" — some among many), Finnish prefers the partitive plural: "opiskelijoita".',
      ],
    },
  ],

  grammarIndex: [
    { pattern: '(bare stem)', use: 'Singular nominative — subject, dictionary form', examples: ['talo', 'koira', 'kirja'], sectionRef: 'nom-singular' },
    { pattern: 'stem + -t', use: 'Plural nominative — plural subject', examples: ['talot', 'koirat', 'kirjat'], sectionRef: 'nom-plural' },
    { pattern: 'weak grade + -t', use: 'Plural nominative with consonant gradation (weak grade, like genitive)', examples: ['kaupat', 'pankit', 'tytöt'], sectionRef: 'nom-gradation' },
  ],

  drills: [
    {
      id: 'nom-d1', kind: 'transform', sectionId: 'nom-plural',
      data: { base: 'talo', instruction: '→ plural nominative', answer: 'talot' },
    },
    {
      id: 'nom-d2', kind: 'transform', sectionId: 'nom-gradation',
      data: { base: 'kauppa', instruction: '→ plural nominative', answer: 'kaupat' },
    },
    {
      id: 'nom-d3', kind: 'transform', sectionId: 'nom-gradation',
      data: { base: 'pankki', instruction: '→ plural nominative', answer: 'pankit' },
    },
    {
      id: 'nom-d4', kind: 'mc', sectionId: 'nom-plural',
      data: {
        prompt: "The plural nominative of 'kirja' (book) is…",
        options: ['kirjan', 'kirjat', 'kirjaa', 'kirjoja'],
        correctIndex: 1,
        explanation: 'Plural nominative = stem + -t: kirja → kirjat.',
      },
    },
    {
      id: 'nom-d5', kind: 'fill', sectionId: 'nom-singular',
      data: {
        sentence: '_____ on iso. (talo)',
        answer: 'Talo',
        hint: 'Subject → nominative (bare stem)',
        baseForm: 'talo',
      },
    },
    {
      id: 'nom-d6', kind: 'translate', sectionId: 'nom-predicative',
      data: { prompt: 'She is a doctor.', target: 'Hän on lääkäri', acceptAlso: ['Hän on lääkäri.'] },
    },
    {
      id: 'nom-d7', kind: 'spot-error', sectionId: 'nom-plural',
      data: {
        sentence: 'Koiran juoksevat puistossa.',
        errorWord: 'Koiran',
        correctForm: 'Koirat',
        explanation: 'Subject "dogs" is plural nominative: koirat, not koiran (which is genitive singular).',
      },
    },
    {
      id: 'nom-d8', kind: 'table', sectionId: 'nom-plural',
      data: {
        headers: ['Base form', 'Plural nominative'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'talot', blank: true }] },
          { label: 'koira', cells: [{ value: 'koira', blank: false }, { value: 'koirat', blank: true }] },
          { label: 'kauppa', cells: [{ value: 'kauppa', blank: false }, { value: 'kaupat', blank: true }] },
          { label: 'tyttö', cells: [{ value: 'tyttö', blank: false }, { value: 'tytöt', blank: true }] },
        ],
      },
    },
    {
      id: 'nom-d9', kind: 'builder', sectionId: 'nom-singular',
      data: {
        tiles: ['iso', 'on', 'Talo'],
        correctOrder: [2, 1, 0],
        translation: 'The house is big.',
      },
    },
    {
      id: 'nom-d10', kind: 'mc', sectionId: 'nom-gradation',
      data: {
        prompt: "Which is the correct plural nominative of 'hattu' (hat)?",
        options: ['hatun', 'hattut', 'hatut', 'hattuja'],
        correctIndex: 2,
        explanation: 'hattu → stem hattu-, gradation tt → t → hatut.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Nominative', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-nominative-case-nominatiivi' },
    { label: 'Wiktionary — Finnish noun declension', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. GENITIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_GENITIVE: GrammarTopic = {
  id: 'genitive',
  version: '1.0.0',
  title: 'Genitive case',
  subtitle: 'Possession, the -n ending, and total objects.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: ['nominative'],
  tags: ['cases'],

  overview: {
    theme: 'The genitive marks possession ("of"), acts as a total object after certain verbs, and is required before many postpositions.',
    grammarFocus: [
      'Singular genitive: stem + -n',
      'Consonant gradation: weak grade appears in the genitive',
      'Possession: "Pekan kirja" = Pekka\'s book',
      'Total object: "Join kahvin" = I drank the coffee (all of it)',
      'Before postpositions: "talon takana" = behind the house',
    ],
    whyItMatters:
      'The genitive is one of the most frequent cases in Finnish. Possession, compound nouns, postpositions, and some of the trickiest object rules all depend on it.',
  },

  sections: [
    {
      id: 'gen-formation',
      title: 'Forming the genitive',
      question: 'Miten genetiivi muodostetaan?',
      questionEn: 'How is the genitive formed?',
      grammarPattern:
        'Singular genitive = weak-grade stem + -n. The weak grade of consonant gradation is used: kk→k, pp→p, tt→t, k→∅, p→v, t→d.',
      caseMarker: '-n',
      morphology: {
        stem: 'talo',
        ending: '-n',
        surface: 'talon',
        breakdown: [
          { token: 'talo', role: 'stem', note: 'house — no gradation here' },
          { token: 'n', role: 'ending', note: 'genitive -n' },
        ],
      },
      examples: [
        { fi: 'talo → talon', en: 'house → of the house' },
        { fi: 'koira → koiran', en: 'dog → of the dog' },
        { fi: 'kauppa → kaupan', en: 'shop → of the shop (pp → p)' },
        { fi: 'kirja → kirjan', en: 'book → of the book' },
        { fi: 'pankki → pankin', en: 'bank → of the bank (kk → k)' },
        { fi: 'tyttö → tytön', en: 'girl → of the girl (tt → t)' },
      ],
      commonPitfalls: [
        'Genitive singular and nominative plural both use the weak grade — both endings (-n and -t) close the final syllable. The difference is only the final consonant: kaupan ("of the shop") vs kaupat ("the shops").',
        'Long words ending in -nen lose the -nen and add -sen: nainen → naisen.',
      ],
    },
    {
      id: 'gen-by-stem-type',
      title: 'Genitive by stem type',
      question: 'Miten genetiivi muodostetaan eri vartalotyypeistä?',
      questionEn: 'How is the genitive formed for different stem types?',
      grammarPattern:
        "The genitive -n attaches to the noun's inflectional stem, which often differs from the dictionary form. The genitive is the single most useful form to learn for any noun because it reveals the inflectional stem used in ALL other cases (and the nominative plural). Once you know the genitive, drop the -n to get the stem, then add any other case ending.",
      formula: 'inflectional stem + -n',
      examples: [
        { fi: 'talo → talon', en: 'house → of the house (vowel stem — no change)' },
        { fi: 'kauppa → kaupan', en: 'shop → of the shop (pp → p: weak grade)' },
        { fi: 'sukupolvi → sukupolven', en: 'generation → of a generation (i → e: hidden e-stem)' },
        { fi: 'kieli → kielen', en: 'language → of the language (i → e: stem kiele-)' },
        { fi: 'ovi → oven', en: 'door → of the door (stem ove-)' },
        { fi: 'vesi → veden', en: 'water → of the water (stem vede-, t → d)' },
        { fi: 'meri → meren', en: 'sea → of the sea (old i-stem: stem mere-)' },
        { fi: 'nainen → naisen', en: 'woman → of the woman (-nen → -sen)' },
        { fi: 'suomalainen → suomalaisen', en: 'Finnish (person) → (genitive) (same -nen → -sen)' },
        { fi: 'vastaus → vastauksen', en: 'answer → of the answer (-us: stem extends to -ukse-)' },
        { fi: 'kysymys → kysymyksen', en: 'question → of the question (same -ys → -ykse-)' },
        { fi: 'vapaus → vapauden', en: 'freedom → of freedom (-uus: stem extends to -uude-)' },
        { fi: 'mahdollisuus → mahdollisuuden', en: 'possibility → of the possibility (same -uus → -uude-)' },
        { fi: 'huone → huoneen', en: 'room → of the room (-e doubles to -ee-)' },
        { fi: 'perhe → perheen', en: 'family → of the family (same -e → -ee-)' },
        { fi: 'kaunis → kauniin', en: 'beautiful → (genitive) (-is adjective: -i lengthens to -ii-)' },
        { fi: 'kuningas → kuninkaan', en: 'king → of the king (consonant stem: dictionary -as, stem kuninka-)' },
      ],
      commonPitfalls: [
        'The genitive reveals the inflectional stem. To form any other case: drop the -n from genitive, then add the case ending. Example: vastauksen → stem vastaukse- → vastaukset (nom.pl), vastauksessa (inessive), etc.',
        '-us (vastaus) and -uus (vapaus) look alike but have completely different stems: vastaukse- vs uude-.',
        'i-stem nouns ending in -vi, -li, -si are almost always really e-stems: sukupolvi → sukupolven (not *sukupolvin).',
      ],
    },
    {
      id: 'gen-possession',
      title: 'Possession',
      question: 'Kenen kirja tämä on?',
      questionEn: 'Whose book is this?',
      grammarPattern:
        'A possessor noun precedes the possessed noun in the genitive. Unlike English, the possessor comes first: "Pekan kirja" = Pekka\'s book.',
      caseMarker: 'genitive + noun',
      examples: [
        { fi: "Pekan kirja on pöydällä.", en: "Pekka's book is on the table." },
        { fi: "Äidin auto on uusi.", en: "Mother's car is new." },
        { fi: "Suomen kieli on kaunis.", en: 'The Finnish language is beautiful. ("of Finland")' },
        { fi: "Talon ovi on auki.", en: "The house's door is open." },
      ],
      commonPitfalls: [
        'The possessed noun can take any case depending on its role; only the possessor takes the genitive.',
        '"Suomen kieli" vs "suomi": when used as a modifier, the country name is in the genitive.',
      ],
    },
    {
      id: 'gen-object',
      title: 'Total object (accusative function)',
      question: 'Milloin objekti on genetiivissä?',
      questionEn: 'When is the direct object in the genitive?',
      grammarPattern:
        'A completed, whole-object action takes the genitive (functioning as an accusative) in affirmative sentences with most verbs. This is called the total object.',
      caseMarker: '-n (total object)',
      examples: [
        { fi: 'Join kahvin.', en: 'I drank the coffee. (all of it — completed)' },
        { fi: 'Luin kirjan.', en: 'I read the book. (whole book — finished)' },
        { fi: 'Ostin auton.', en: 'I bought a/the car. (complete transaction)' },
        { fi: 'Suljin oven.', en: 'I closed the door.' },
      ],
      commonPitfalls: [
        'If the action is ongoing or partial, use the partitive instead: "Luen kirjaa" (I\'m reading a book — not finished).',
        'After negation, always use the partitive regardless: "En lukenut kirjaa".',
      ],
    },
    {
      id: 'gen-postpositions',
      title: 'Genitive + postposition',
      question: 'Missä koulu on?',
      questionEn: 'Where is the school? (using postpositions)',
      grammarPattern:
        'Finnish postpositions (takana, edessä, vieressä, alla, päällä, etc.) require the preceding noun in the genitive.',
      formula: 'genitive noun + postposition',
      examples: [
        { fi: 'talon takana', en: 'behind the house' },
        { fi: 'koulun edessä', en: 'in front of the school' },
        { fi: 'pöydän alla', en: 'under the table' },
        { fi: 'kaupan vieressä', en: 'next to the shop' },
        { fi: 'auton päällä', en: 'on top of the car' },
      ],
      commonPitfalls: [
        'The postposition itself may also inflect (e.g., talon takaa = from behind the house).',
        'Do not use nominative before postpositions: "talo takana" is incorrect.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'stem + -n', use: 'Genitive singular — possession, total object', examples: ['talon', 'koiran', 'kirjan'], sectionRef: 'gen-formation' },
    { pattern: 'weak grade + -n', use: 'Genitive with consonant gradation', examples: ['kaupan', 'pankin', 'tytön'], sectionRef: 'gen-formation' },
    { pattern: 'inflectional stem + -n', use: 'Genitive for non-trivial stem types (-i/-e, -nen, -us, -uus, -e)', examples: ['sukupolven', 'naisen', 'vastauksen', 'vapauden', 'huoneen'], sectionRef: 'gen-by-stem-type' },
    { pattern: 'gen + postposition', use: 'Location/direction with postpositions', examples: ['talon takana', 'pöydän alla'], sectionRef: 'gen-postpositions' },
  ],

  drills: [
    {
      id: 'gen-d1', kind: 'transform', sectionId: 'gen-formation',
      data: { base: 'talo', instruction: '→ genitive singular', answer: 'talon' },
    },
    {
      id: 'gen-d2', kind: 'transform', sectionId: 'gen-formation',
      data: { base: 'kauppa', instruction: '→ genitive singular (note gradation)', answer: 'kaupan' },
    },
    {
      id: 'gen-d3', kind: 'transform', sectionId: 'gen-formation',
      data: { base: 'pankki', instruction: '→ genitive singular', answer: 'pankin' },
    },
    {
      id: 'gen-d4', kind: 'fill', sectionId: 'gen-possession',
      data: {
        sentence: '_____ kirja on pöydällä. (Pekka)',
        answer: 'Pekan',
        hint: 'Possessor in genitive: Pekka → Pekan',
        baseForm: 'Pekka',
      },
    },
    {
      id: 'gen-d5', kind: 'fill', sectionId: 'gen-object',
      data: {
        sentence: 'Join _____ (kahvi).',
        answer: 'kahvin',
        hint: 'Completed action → total object → genitive',
        baseForm: 'kahvi',
      },
    },
    {
      id: 'gen-d6', kind: 'mc', sectionId: 'gen-object',
      data: {
        prompt: "'I read the book (finished)' — which form of kirja?",
        options: ['kirja', 'kirjaa', 'kirjan', 'kirjassa'],
        correctIndex: 2,
        explanation: 'Complete action, whole object → genitive (total object): kirjan.',
      },
    },
    {
      id: 'gen-d7', kind: 'fill', sectionId: 'gen-postpositions',
      data: {
        sentence: '_____ takana on puisto. (talo)',
        answer: 'talon',
        hint: 'Postpositions require the preceding noun in the genitive',
        baseForm: 'talo',
      },
    },
    {
      id: 'gen-d8', kind: 'spot-error', sectionId: 'gen-possession',
      data: {
        sentence: 'Äiti auto on uusi.',
        errorWord: 'Äiti',
        correctForm: 'Äidin',
        explanation: 'Possessor must be in the genitive: äiti → äidin.',
      },
    },
    {
      id: 'gen-d9', kind: 'translate', sectionId: 'gen-possession',
      data: { prompt: "Pekka's book is on the table.", target: "Pekan kirja on pöydällä", acceptAlso: ["Pekan kirja on pöydällä."] },
    },
    {
      id: 'gen-d10', kind: 'table', sectionId: 'gen-formation',
      data: {
        headers: ['Nominative', 'Genitive'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'talon', blank: true }] },
          { label: 'koira', cells: [{ value: 'koira', blank: false }, { value: 'koiran', blank: true }] },
          { label: 'kauppa', cells: [{ value: 'kauppa', blank: false }, { value: 'kaupan', blank: true }] },
          { label: 'kirja', cells: [{ value: 'kirja', blank: false }, { value: 'kirjan', blank: true }] },
          { label: 'pankki', cells: [{ value: 'pankki', blank: false }, { value: 'pankin', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Genitive', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-genitive-case-genetiivi' },
    { label: 'Wiktionary — Finnish noun declension', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. ACCUSATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ACCUSATIVE: GrammarTopic = {
  id: 'accusative',
  version: '1.0.0',
  title: 'Accusative & total object',
  subtitle: 'When the whole object is affected.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 14,
  prerequisites: ['genitive', 'partitive'],
  tags: ['cases'],

  overview: {
    theme: 'Finnish does not have a separate accusative case for nouns — the total object uses the genitive form (-n). However, personal pronouns have distinct accusative forms. The key question is always: partitive (partial/ongoing) or total object (complete/whole)?',
    grammarFocus: [
      'Total object (accusative) = genitive -n for nouns in affirmative sentences',
      'Pronoun accusatives: minut, sinut, hänet, meidät, teidät, heidät',
      'After negation: always partitive',
      'After modals (täytyy, pitää, voida): total object possible',
      'Imperative sentences use nominative for the total object',
    ],
    whyItMatters:
      'Choosing between the total object (-n / pronoun accusative) and the partitive is one of the hardest decisions in Finnish. Get this right and your Finnish sounds natural.',
  },

  sections: [
    {
      id: 'acc-vs-partitive',
      title: 'Total object vs partitive object',
      question: 'Luin kirjan vai kirjaa?',
      questionEn: 'Did I read the book (finished) or was I reading it (ongoing)?',
      grammarPattern:
        'Use the total object (genitive -n) when: the action is complete, the whole object is affected, and the sentence is affirmative. Use partitive when: the action is ongoing, partial, negated, or the object is uncountable.',
      formula: 'Complete + affirmative → total object (-n) | Ongoing / partial / negated → partitive (-a/-ä)',
      examples: [
        { fi: 'Luin kirjan.', en: 'I read the book. (finished — total)' },
        { fi: 'Luin kirjaa.', en: 'I was reading a book. (ongoing — partitive)' },
        { fi: 'Söin pizzan.', en: 'I ate the pizza. (whole pizza — total)' },
        { fi: 'Söin pizzaa.', en: 'I ate some pizza. (some of it — partitive)' },
        { fi: 'En syönyt pizzaa.', en: "I didn't eat the pizza. (negated → always partitive)" },
      ],
      commonPitfalls: [
        'Negation always forces the partitive: "En ostanut autoa", never "En ostanut auton".',
        'The question "Do you understand?" is "Ymmärrätkö?" but "Did you understand it?" is "Ymmärsitkö sen?" — the completed understanding of something specific triggers the total object.',
      ],
    },
    {
      id: 'acc-pronouns',
      title: 'Pronoun accusatives',
      question: 'Miten minä muuttuu objektiksi?',
      questionEn: 'What form do personal pronouns take as objects?',
      grammarPattern:
        'Personal pronouns have distinct accusative forms that differ from both the nominative and genitive. These are: minut, sinut, hänet, meidät, teidät, heidät.',
      caseMarker: '-t (pronoun accusative)',
      morphology: {
        stem: 'minu',
        ending: '-t',
        surface: 'minut',
        breakdown: [
          { token: 'minu', role: 'stem', note: 'oblique stem of minä (I)' },
          { token: 't', role: 'ending', note: 'accusative ending -t on pronouns' },
        ],
      },
      examples: [
        { fi: 'Hän näkee minut.', en: 'He/she sees me.' },
        { fi: 'Rakastan sinut.', en: 'I love you.' },
        { fi: 'Tunnen hänet.', en: 'I know him/her.' },
        { fi: 'He kutsuvat meidät.', en: 'They invite us.' },
        { fi: 'Näen teidät huomenna.', en: 'I will see you (pl.) tomorrow.' },
        { fi: 'Odotan heidät.', en: 'I am waiting for them.' },
      ],
      commonPitfalls: [
        'After negation, pronouns also shift to partitive: "En näe sinua" (not "sinut").',
        'The pronoun "se" (it) has accusative "sen", and "ne" (they/those) has "ne" — same as nominative for ne.',
      ],
    },
    {
      id: 'acc-completed',
      title: 'Completed actions',
      question: 'Miten tiedän, onko teko valmis?',
      questionEn: 'How do I know if the action is completed?',
      grammarPattern:
        'An action is "completed" when: (1) the whole object has been consumed/processed, (2) the action reached a natural endpoint, or (3) the verb is inherently telic (has a built-in endpoint). The perfect tense often signals completion.',
      examples: [
        { fi: 'Olen lukenut kirjan.', en: 'I have read the book. (completed — perfect tense)' },
        { fi: 'Suljin oven.', en: 'I closed the door. (reaching a natural endpoint)' },
        { fi: 'Rakensimme talon.', en: 'We built a house. (completed project)' },
        { fi: 'Kirjoitin kirjeen.', en: 'I wrote a letter. (finished product)' },
      ],
      commonPitfalls: [
        'Verbs like "rakentaa" (to build) have a natural endpoint — the completed building. Once done, the object is in the genitive.',
        'Stative verbs (rakastaa, pitää, tuntea) with ongoing states always take partitive.',
      ],
    },
    {
      id: 'acc-imperative',
      title: 'Imperative total object',
      question: 'Sulje ikkuna vai ikkunan?',
      questionEn: 'Close the window — which form?',
      grammarPattern:
        'In imperative sentences, the total object takes the nominative form (not the genitive -n). This is the one situation where the nominative acts as a direct object.',
      caseMarker: 'nominative (in imperative)',
      examples: [
        { fi: 'Sulje ikkuna!', en: 'Close the window!' },
        { fi: 'Osta leipä!', en: 'Buy (the) bread!' },
        { fi: 'Lue kirja!', en: 'Read the book!' },
        { fi: 'Avaa ovi!', en: 'Open the door!' },
      ],
      commonPitfalls: [
        'Only in the imperative. In a regular declarative sentence: "Suljin ikkunan" (I closed the window) — genitive.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-n (noun)', use: 'Total object in affirmative declarative sentences', examples: ['kirjan', 'kahvin', 'auton'], sectionRef: 'acc-vs-partitive' },
    { pattern: 'minut/sinut/hänet/meidät/teidät/heidät', use: 'Pronoun accusative forms', examples: ['näen sinut', 'tunnen hänet'], sectionRef: 'acc-pronouns' },
    { pattern: 'nominative (imperative)', use: 'Total object in imperative sentences', examples: ['sulje ikkuna', 'osta kirja'], sectionRef: 'acc-imperative' },
    { pattern: 'partitive after negation', use: 'All objects after ei/en/et/emme/ette/eivät', examples: ['en näe sinua', 'en ostanut autoa'], sectionRef: 'acc-vs-partitive' },
  ],

  drills: [
    {
      id: 'acc-d1', kind: 'mc', sectionId: 'acc-vs-partitive',
      data: {
        prompt: "'I read the book (finished)' — which form?",
        options: ['kirja', 'kirjaa', 'kirjan', 'kirjassa'],
        correctIndex: 2,
        explanation: 'Completed, whole object, affirmative → total object = genitive -n: kirjan.',
      },
    },
    {
      id: 'acc-d2', kind: 'mc', sectionId: 'acc-vs-partitive',
      data: {
        prompt: "'I was reading a book' (ongoing) — which form?",
        options: ['kirja', 'kirjaa', 'kirjan', 'kirjalle'],
        correctIndex: 1,
        explanation: 'Ongoing action → partitive: kirjaa.',
      },
    },
    {
      id: 'acc-d3', kind: 'fill', sectionId: 'acc-pronouns',
      data: {
        sentence: 'Hän näkee _____ (minä).',
        answer: 'minut',
        hint: 'Pronoun object → accusative form',
        baseForm: 'minä',
      },
    },
    {
      id: 'acc-d4', kind: 'fill', sectionId: 'acc-pronouns',
      data: {
        sentence: 'Rakastan _____ (sinä).',
        answer: 'sinut',
        hint: 'Object of rakastaa → pronoun accusative',
        baseForm: 'sinä',
      },
    },
    {
      id: 'acc-d5', kind: 'transform', sectionId: 'acc-vs-partitive',
      data: { base: 'Luen kirjaa.', instruction: "→ completed version ('I read the book')", answer: 'Luin kirjan.' },
    },
    {
      id: 'acc-d6', kind: 'spot-error', sectionId: 'acc-vs-partitive',
      data: {
        sentence: 'En ostanut auton.',
        errorWord: 'auton',
        correctForm: 'autoa',
        explanation: 'After negation, the object is always in the partitive: "En ostanut autoa".',
      },
    },
    {
      id: 'acc-d7', kind: 'fill', sectionId: 'acc-imperative',
      data: {
        sentence: 'Sulje _____ (ikkuna)!',
        answer: 'ikkuna',
        hint: 'Imperative total object → nominative form',
        baseForm: 'ikkuna',
      },
    },
    {
      id: 'acc-d8', kind: 'translate', sectionId: 'acc-pronouns',
      data: { prompt: 'I know him.', target: 'Tunnen hänet', acceptAlso: ['Tunnen hänet.', 'Minä tunnen hänet', 'Minä tunnen hänet.'] },
    },
    {
      id: 'acc-d9', kind: 'mc', sectionId: 'acc-pronouns',
      data: {
        prompt: "'They invite us' — which form of 'me'?",
        options: ['me', 'meille', 'meidän', 'meidät'],
        correctIndex: 3,
        explanation: 'Object pronoun 1st person plural → accusative: meidät.',
      },
    },
    {
      id: 'acc-d10', kind: 'builder', sectionId: 'acc-vs-partitive',
      data: {
        tiles: ['kirjan', 'Luin', 'eilen'],
        correctOrder: [1, 0, 2],
        translation: 'I read the book yesterday.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Object cases', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-accusative-case' },
    { label: 'Wiktionary — Finnish accusative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. INESSIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_INESSIVE: GrammarTopic = {
  id: 'inessive',
  version: '1.0.0',
  title: 'Inessive (-ssa/-ssä)',
  subtitle: "'In' — being inside something.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: ['nominative'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "The inessive expresses static location inside something — 'in the house', 'in Finland', 'at school'. It answers the question Missä? (Where?).",
    grammarFocus: [
      'Formation: vowel-harmonic stem + -ssa (back) or -ssä (front)',
      'No consonant gradation in the inessive',
      'Used for: enclosed spaces, countries, cities, buildings',
      'Time expressions: months take the inessive',
    ],
    whyItMatters:
      "Inessive is the first locative case most learners encounter and one of the most frequent. 'Missä olet?' (Where are you?) demands this case.",
  },

  sections: [
    {
      id: 'ines-formation',
      title: 'Formation',
      question: 'Miten inessiivi muodostetaan?',
      questionEn: 'How is the inessive formed?',
      grammarPattern:
        'Take the noun stem (same as plural nominative minus the -t) and add -ssa (back vowels: a, o, u) or -ssä (front vowels: ä, ö, y). There is no consonant gradation.',
      caseMarker: '-ssa / -ssä',
      morphology: {
        stem: 'talo',
        ending: '-ssa',
        surface: 'talossa',
        breakdown: [
          { token: 'talo', role: 'stem', note: "'house' — back vowel stem" },
          { token: 'ssa', role: 'ending', note: "inessive -ssa (back-vowel harmony)" },
        ],
      },
      examples: [
        { fi: 'talo → talossa', en: 'house → in the house' },
        { fi: 'koulu → koulussa', en: 'school → at school / in the school' },
        { fi: 'kaupunki → kaupungissa', en: 'city → in the city (k→ng before -ssa)' },
        { fi: 'kylä → kylässä', en: 'village → in the village (front vowel → -ssä)' },
        { fi: 'metsä → metsässä', en: 'forest → in the forest' },
      ],
      commonPitfalls: [
        "Vowel harmony is strict: 'talossa' not 'talossä', 'kylässä' not 'kylässa'.",
        'kaupunki is irregular: kaupungissa (not kaupunkissa) — the k disappears and ng appears.',
      ],
    },
    {
      id: 'ines-location',
      title: 'Location inside — countries & buildings',
      question: 'Missä?',
      questionEn: 'Where (inside/enclosed)?',
      grammarPattern:
        'The inessive is used for locations that are thought of as enclosed or bounded: countries, buildings, rooms, vehicles.',
      caseMarker: '-ssa/-ssä (location)',
      examples: [
        { fi: 'Asun Suomessa.', en: 'I live in Finland.' },
        { fi: 'Hän on koulussa.', en: 'He/she is at school.' },
        { fi: 'Kirja on laukussa.', en: 'The book is in the bag.' },
        { fi: 'Istumme autossa.', en: 'We are sitting in the car.' },
        { fi: 'Bussissa on paljon ihmisiä.', en: 'There are many people in the bus.' },
      ],
      commonPitfalls: [
        'Countries and cities use inessive for static location: Suomessa, Helsingissä, Tampereella (exception: Tampere uses adessive!).',
        "Some Finnish cities use external cases: 'Tampereella' (adessive), not 'Tampereessa'.",
      ],
    },
    {
      id: 'ines-common',
      title: 'High-frequency inessive words',
      question: 'Mitkä sanat esiintyvät usein inessiivissä?',
      questionEn: 'Which words often appear in the inessive?',
      grammarPattern:
        'Several words are almost always encountered in the inessive because their primary use is locative.',
      examples: [
        { fi: 'kotona', en: 'at home (special form, not regular inessive)' },
        { fi: 'töissä', en: 'at work (inessive of "työ")' },
        { fi: 'kaupassa', en: 'in the shop / shopping' },
        { fi: 'sairaalassa', en: 'in the hospital' },
        { fi: 'ravintolassa', en: 'in the restaurant' },
        { fi: 'tammikuussa', en: 'in January (months → inessive)' },
      ],
      specialNote: {
        fi: 'kotona on erityismuoto, ei säännöllinen inessiivi.',
        en: "'kotona' (at home) is an irregular fossilised form, historically from an older essive.",
      },
    },
  ],

  grammarIndex: [
    { pattern: '-ssa', use: 'Inessive — back vowel words (a, o, u)', examples: ['talossa', 'koulussa', 'kaupassa'], sectionRef: 'ines-formation' },
    { pattern: '-ssä', use: 'Inessive — front vowel words (ä, ö, y)', examples: ['kylässä', 'metsässä', 'töissä'], sectionRef: 'ines-formation' },
    { pattern: 'country/city + -ssa/-ssä', use: 'Static location in a country or city', examples: ['Suomessa', 'Helsingissä'], sectionRef: 'ines-location' },
  ],

  drills: [
    {
      id: 'ines-d1', kind: 'transform', sectionId: 'ines-formation',
      data: { base: 'talo', instruction: '→ inessive (in the house)', answer: 'talossa' },
    },
    {
      id: 'ines-d2', kind: 'transform', sectionId: 'ines-formation',
      data: { base: 'metsä', instruction: '→ inessive (in the forest)', answer: 'metsässä' },
    },
    {
      id: 'ines-d3', kind: 'transform', sectionId: 'ines-location',
      data: { base: 'Suomi', instruction: "→ 'in Finland'", answer: 'Suomessa' },
    },
    {
      id: 'ines-d4', kind: 'fill', sectionId: 'ines-location',
      data: {
        sentence: 'Asun _____ (Suomi).',
        answer: 'Suomessa',
        hint: 'Country → inessive for static location',
        baseForm: 'Suomi',
      },
    },
    {
      id: 'ines-d5', kind: 'mc', sectionId: 'ines-formation',
      data: {
        prompt: "'In the school' is…",
        options: ['koululle', 'koulusta', 'kouluun', 'koulussa'],
        correctIndex: 3,
        explanation: 'Static location inside → inessive -ssa: koulussa.',
      },
    },
    {
      id: 'ines-d6', kind: 'translate', sectionId: 'ines-location',
      data: { prompt: 'The book is in the bag.', target: 'Kirja on laukussa', acceptAlso: ['Kirja on laukussa.'] },
    },
    {
      id: 'ines-d7', kind: 'spot-error', sectionId: 'ines-location',
      data: {
        sentence: 'Hän on koulu tänään.',
        errorWord: 'koulu',
        correctForm: 'koulussa',
        explanation: "'At school' = koulussa. The inessive -ssa is needed for the locative meaning.",
      },
    },
    {
      id: 'ines-d8', kind: 'table', sectionId: 'ines-formation',
      data: {
        headers: ['Nominative', 'Inessive (-ssa/-ssä)'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'talossa', blank: true }] },
          { label: 'koulu', cells: [{ value: 'koulu', blank: false }, { value: 'koulussa', blank: true }] },
          { label: 'kylä', cells: [{ value: 'kylä', blank: false }, { value: 'kylässä', blank: true }] },
          { label: 'metsä', cells: [{ value: 'metsä', blank: false }, { value: 'metsässä', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Inessive', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-inessive-case-inessiivi' },
    { label: 'Wiktionary — Finnish inessive', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. ELATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ELATIVE: GrammarTopic = {
  id: 'elative',
  version: '1.0.0',
  title: 'Elative (-sta/-stä)',
  subtitle: "'From inside' — origin, topics, materials.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: ['inessive'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "The elative is the 'exit' case of the internal set. It answers Mistä? (From where? / What about?) and covers movement out of something, discussing topics, and materials things are made of.",
    grammarFocus: [
      'Formation: stem + -sta (back) or -stä (front)',
      'Motion out of an enclosed space',
      'Talking about a topic: "Puhutaan suomesta" (Let\'s talk about Finnish)',
      'Material: "tehty puusta" (made of wood)',
      'Perception: nähdä, kuulla, pitää + elative',
    ],
    whyItMatters:
      "'Minä olen Suomesta' (I am from Finland) — one of the first sentences every Finnish learner needs. The elative is also how you say what you like, what you talk about, and what things are made of.",
  },

  sections: [
    {
      id: 'elat-formation',
      title: 'Formation',
      question: 'Miten elatiivi muodostetaan?',
      questionEn: 'How is the elative formed?',
      grammarPattern:
        'The elative is formed from the same stem as the inessive, replacing -ssa/-ssä with -sta/-stä. No consonant gradation occurs.',
      caseMarker: '-sta / -stä',
      morphology: {
        stem: 'talo',
        ending: '-sta',
        surface: 'talosta',
        breakdown: [
          { token: 'talo', role: 'stem', note: "'house'" },
          { token: 'sta', role: 'ending', note: 'elative -sta (back vowel)' },
        ],
      },
      examples: [
        { fi: 'talo → talosta', en: 'house → from/out of the house' },
        { fi: 'koulu → koulusta', en: 'school → from school' },
        { fi: 'Suomi → Suomesta', en: 'Finland → from Finland' },
        { fi: 'metsä → metsästä', en: 'forest → from the forest (front vowel → -stä)' },
        { fi: 'kaupunki → kaupungista', en: 'city → from the city' },
      ],
      commonPitfalls: [
        'Same stem as inessive — if inessive is "talossa", elative is "talosta" (swap ss for st).',
        'Vowel harmony applies: back vowels → -sta, front vowels → -stä.',
      ],
    },
    {
      id: 'elat-motion',
      title: 'Motion from inside',
      question: 'Mistä tulet?',
      questionEn: 'Where do you come from?',
      grammarPattern:
        "The elative marks the starting point of movement when departing from an enclosed or interior space. Verbs: tulla (come), lähteä (leave), poistua (exit).",
      caseMarker: '-sta/-stä (source of motion)',
      examples: [
        { fi: 'Tulen Suomesta.', en: 'I come from Finland.' },
        { fi: 'Hän lähti talosta.', en: 'He/she left the house.' },
        { fi: 'Lapset tulivat koulusta.', en: 'The children came from school.' },
        { fi: 'Otan kirjan laukusta.', en: 'I take the book out of the bag.' },
      ],
    },
    {
      id: 'elat-topic',
      title: 'Talking about a topic',
      question: 'Mistä puhutaan?',
      questionEn: 'What are we talking about?',
      grammarPattern:
        "Verbs like 'puhua' (to talk), 'kirjoittaa' (to write), 'pitää' (to like/hold), 'tietää' (to know about), and 'kuulla' (to hear about) all govern the elative when expressing the topic.",
      formula: 'verb + elative noun',
      examples: [
        { fi: 'Puhutaan suomesta.', en: "Let's talk about Finnish." },
        { fi: 'Kirjoitan kirjeestä.', en: 'I am writing about the letter / I write about letters.' },
        { fi: 'Hän pitää musiikista.', en: 'He/she likes music. (lit. holds from music)' },
        { fi: 'Kuulin uutisista.', en: 'I heard about the news.' },
        { fi: 'Mitä tiedät Helsingistä?', en: 'What do you know about Helsinki?' },
      ],
      commonPitfalls: [
        '"Pidän" takes the elative: "Pidän kahvista" (I like coffee), not "Pidän kahvia".',
      ],
    },
    {
      id: 'elat-material',
      title: 'Made of — material',
      question: 'Mistä tämä on tehty?',
      questionEn: 'What is this made of?',
      grammarPattern:
        'The elative marks the material something is made of, used with the participle "tehty" (made) or the verb "valmistettu" (manufactured).',
      formula: 'tehty + elative',
      examples: [
        { fi: 'Pöytä on tehty puusta.', en: 'The table is made of wood.' },
        { fi: 'Rengas on kumista.', en: 'The tyre is (made) of rubber.' },
        { fi: 'Lasi on lasista.', en: 'The glass is made of glass.' },
        { fi: 'Talo on tiilestä.', en: 'The house is (built) of brick.' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-sta', use: 'Elative — back-vowel words', examples: ['talosta', 'koulusta', 'Suomesta'], sectionRef: 'elat-formation' },
    { pattern: '-stä', use: 'Elative — front-vowel words', examples: ['metsästä', 'kylästä', 'kaupungista'], sectionRef: 'elat-formation' },
    { pattern: 'tulla/lähteä + elative', use: 'Departure from inside a place', examples: ['Tulen Suomesta', 'lähti talosta'], sectionRef: 'elat-motion' },
    { pattern: 'pitää + elative', use: 'Liking something', examples: ['Pidän musiikista', 'Pidän kahvista'], sectionRef: 'elat-topic' },
    { pattern: 'tehty + elative', use: 'Material composition', examples: ['tehty puusta', 'tehty tiilestä'], sectionRef: 'elat-material' },
  ],

  drills: [
    {
      id: 'elat-d1', kind: 'transform', sectionId: 'elat-formation',
      data: { base: 'talo', instruction: '→ elative (from the house)', answer: 'talosta' },
    },
    {
      id: 'elat-d2', kind: 'transform', sectionId: 'elat-formation',
      data: { base: 'metsä', instruction: '→ elative (from the forest)', answer: 'metsästä' },
    },
    {
      id: 'elat-d3', kind: 'fill', sectionId: 'elat-motion',
      data: {
        sentence: 'Tulen _____ (Suomi).',
        answer: 'Suomesta',
        hint: 'Origin → elative -sta',
        baseForm: 'Suomi',
      },
    },
    {
      id: 'elat-d4', kind: 'mc', sectionId: 'elat-topic',
      data: {
        prompt: "'I like coffee' — pick the correct form.",
        options: ['Pidän kahvia', 'Pidän kahvista', 'Pidän kahville', 'Pidän kahviin'],
        correctIndex: 1,
        explanation: "'Pitää' (to like) governs the elative: Pidän kahvista.",
      },
    },
    {
      id: 'elat-d5', kind: 'translate', sectionId: 'elat-motion',
      data: { prompt: 'The children came from school.', target: 'Lapset tulivat koulusta', acceptAlso: ['Lapset tulivat koulusta.'] },
    },
    {
      id: 'elat-d6', kind: 'fill', sectionId: 'elat-material',
      data: {
        sentence: 'Pöytä on tehty _____ (puu).',
        answer: 'puusta',
        hint: 'Material → elative: puu → puusta',
        baseForm: 'puu',
      },
    },
    {
      id: 'elat-d7', kind: 'spot-error', sectionId: 'elat-topic',
      data: {
        sentence: 'Pidän musiikki.',
        errorWord: 'musiikki',
        correctForm: 'musiikista',
        explanation: '"Pitää" (to like) requires the elative: Pidän musiikista.',
      },
    },
    {
      id: 'elat-d8', kind: 'table', sectionId: 'elat-formation',
      data: {
        headers: ['Nominative', 'Inessive', 'Elative'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'talossa', blank: false }, { value: 'talosta', blank: true }] },
          { label: 'koulu', cells: [{ value: 'koulu', blank: false }, { value: 'koulussa', blank: false }, { value: 'koulusta', blank: true }] },
          { label: 'metsä', cells: [{ value: 'metsä', blank: false }, { value: 'metsässä', blank: false }, { value: 'metsästä', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Elative', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-elative-case-elatiivi' },
    { label: 'Wiktionary — Finnish elative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. ILLATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ILLATIVE: GrammarTopic = {
  id: 'illative',
  version: '1.0.0',
  title: 'Illative (-Vn/-hVn/-seen)',
  subtitle: "'Into' — directional movement inwards.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: ['inessive'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "The illative is the 'entry' case — motion into an enclosed space. It answers Mihin? (Where to? / Into what?). It is the most irregular of the locative cases, with three formation rules.",
    grammarFocus: [
      'Rule 1: final vowel doubled + -n (most common)',
      'Rule 2: -seen (after certain long vowels and diphthongs)',
      'Rule 3: -hVn (short word + h + repeated vowel + n)',
      'Used for destinations: countries, buildings, rooms',
      'Also used with verbs of fitting, placing, belonging',
    ],
    whyItMatters:
      "'Menen kouluun' (I'm going to school) — the illative is essential for talking about going places. Its irregular formation is the main challenge.",
  },

  sections: [
    {
      id: 'illat-rule1',
      title: 'Rule 1: Double vowel + -n',
      question: 'Miten illatiivin yleisin muoto muodostetaan?',
      questionEn: 'How is the most common illative form made?',
      grammarPattern:
        "For most nouns: take the stem, double the final vowel, and add -n. This is the 'Vowel + Vowel + n' pattern.",
      caseMarker: '-VVn',
      morphology: {
        stem: 'talo',
        ending: '-on',
        surface: 'taloon',
        breakdown: [
          { token: 'talo', role: 'stem', note: "'house'" },
          { token: 'o', role: 'ending', note: "doubled final vowel" },
          { token: 'n', role: 'ending', note: 'illative -n' },
        ],
      },
      examples: [
        { fi: 'talo → taloon', en: 'house → into the house' },
        { fi: 'koulu → kouluun', en: 'school → to school' },
        { fi: 'kaupunki → kaupunkiin', en: 'city → to the city' },
        { fi: 'auto → autoon', en: 'car → into the car' },
        { fi: 'Suomi → Suomeen', en: 'Finland → to Finland (e doubled)' },
      ],
      commonPitfalls: [
        "If the word ends in a long vowel, do not add a third vowel — use -seen instead (see Rule 2).",
        "'kaupunki' → 'kaupunkiin': the -i doubles to -ii before -n.",
      ],
    },
    {
      id: 'illat-rule2',
      title: 'Rule 2: -seen',
      question: 'Milloin käytetään -seen?',
      questionEn: 'When is -seen used?',
      grammarPattern:
        "Words whose stem ends in a long vowel (two identical vowels) or in -e use the illative ending -seen.",
      caseMarker: '-seen',
      morphology: {
        stem: 'huonee',
        ending: '-seen',
        surface: 'huoneeseen',
        breakdown: [
          { token: 'huonee', role: 'stem', note: "oblique stem of 'huone' (room)" },
          { token: 'seen', role: 'ending', note: 'illative -seen after long vowel stem' },
        ],
      },
      examples: [
        { fi: 'huone → huoneeseen', en: 'room → into the room' },
        { fi: 'perhe → perheeseen', en: 'family → into the family' },
        { fi: 'Porvoo → Porvooseen', en: 'Porvoo → to Porvoo' },
        { fi: 'idea → ideaan', en: 'idea → into the idea (short -ea → double a → ideaan)' },
      ],
      commonPitfalls: [
        "'huone' (room) has illative 'huoneeseen' — three syllables. This trips up many learners.",
        "Check: if the genitive ends in -een (kaateen → kaate), the illative is -seen.",
      ],
    },
    {
      id: 'illat-rule3',
      title: 'Rule 3: -hVn (short words)',
      question: 'Miksi "maa" → "maahan"?',
      questionEn: 'Why do short words insert -h-?',
      grammarPattern:
        "Short monosyllabic nouns ending in a long vowel use the pattern: stem + h + repeated final vowel + n.",
      caseMarker: '-hVn',
      morphology: {
        stem: 'maa',
        ending: '-han',
        surface: 'maahan',
        breakdown: [
          { token: 'maa', role: 'stem', note: "'land/country'" },
          { token: 'h', role: 'other', note: 'inserted h (hiatus prevention)' },
          { token: 'a', role: 'ending', note: 'repeated final vowel' },
          { token: 'n', role: 'ending', note: 'illative -n' },
        ],
      },
      examples: [
        { fi: 'maa → maahan', en: 'land → into the land / to the country' },
        { fi: 'puu → puuhun', en: 'tree → into/up the tree' },
        { fi: 'tie → tielle', en: "road → onto the road (NB: tie uses external 'tielle', not illative!)" },
        { fi: 'yö → yöhön', en: 'night → into the night' },
      ],
      specialNote: {
        fi: "'tie' (tie = road) käyttää allatiivista muotoa 'tielle', ei illatiivia.",
        en: "'tie' (road) is an exception: it uses allative 'tielle', not illative.",
      },
      commonPitfalls: [
        "The -h- is inserted between the stem and the repeated vowel. Without it you'd get three identical vowels in a row, which Finnish avoids.",
      ],
    },
    {
      id: 'illat-uses',
      title: 'Uses of the illative',
      question: 'Milloin käytetään illatiivia?',
      questionEn: 'When is the illative used?',
      grammarPattern:
        "The illative is used after verbs of motion (mennä, tulla, ajaa, päästä), for destinations, and with certain verbs that take an object or argument in the illative (uskoa, luottaa, rakastua, kuulua).",
      examples: [
        { fi: 'Menen kouluun.', en: "I'm going to school." },
        { fi: 'Tulen taloon.', en: "I'm coming into the house." },
        { fi: 'Kuulun ryhmään.', en: 'I belong to the group.' },
        { fi: 'Hän rakastui Liisaan.', en: 'He fell in love with Liisa.' },
        { fi: 'Luotan sinuun.', en: 'I trust you.' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-VVn (double vowel + n)', use: 'Illative — most words', examples: ['taloon', 'kouluun', 'Suomeen'], sectionRef: 'illat-rule1' },
    { pattern: '-seen', use: 'Illative — words with -e stem or long vowel stem', examples: ['huoneeseen', 'perheeseen'], sectionRef: 'illat-rule2' },
    { pattern: '-hVn', use: 'Illative — short monosyllables', examples: ['maahan', 'puuhun', 'yöhön'], sectionRef: 'illat-rule3' },
  ],

  drills: [
    {
      id: 'illat-d1', kind: 'transform', sectionId: 'illat-rule1',
      data: { base: 'talo', instruction: '→ illative (into the house)', answer: 'taloon' },
    },
    {
      id: 'illat-d2', kind: 'transform', sectionId: 'illat-rule1',
      data: { base: 'Suomi', instruction: "→ illative ('to Finland')", answer: 'Suomeen' },
    },
    {
      id: 'illat-d3', kind: 'transform', sectionId: 'illat-rule2',
      data: { base: 'huone', instruction: '→ illative (into the room)', answer: 'huoneeseen' },
    },
    {
      id: 'illat-d4', kind: 'transform', sectionId: 'illat-rule3',
      data: { base: 'maa', instruction: '→ illative (into the land)', answer: 'maahan' },
    },
    {
      id: 'illat-d5', kind: 'mc', sectionId: 'illat-rule1',
      data: {
        prompt: "'I'm going to school' — pick the form of koulu.",
        options: ['koulussa', 'koulusta', 'koululle', 'kouluun'],
        correctIndex: 3,
        explanation: 'Motion toward inside → illative: kouluun.',
      },
    },
    {
      id: 'illat-d6', kind: 'fill', sectionId: 'illat-uses',
      data: {
        sentence: 'Menen _____ (kaupunki).',
        answer: 'kaupunkiin',
        hint: 'Destination → illative: kaupunki → kaupunkiin',
        baseForm: 'kaupunki',
      },
    },
    {
      id: 'illat-d7', kind: 'spot-error', sectionId: 'illat-rule1',
      data: {
        sentence: 'Menen Suomessa kesällä.',
        errorWord: 'Suomessa',
        correctForm: 'Suomeen',
        explanation: "'Menen' (I go) needs the destination in the illative: Suomeen, not inessive Suomessa.",
      },
    },
    {
      id: 'illat-d8', kind: 'table', sectionId: 'illat-rule1',
      data: {
        headers: ['Nominative', 'Inessive (in)', 'Elative (from)', 'Illative (into)'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'talossa', blank: false }, { value: 'talosta', blank: false }, { value: 'taloon', blank: true }] },
          { label: 'koulu', cells: [{ value: 'koulu', blank: false }, { value: 'koulussa', blank: false }, { value: 'koulusta', blank: false }, { value: 'kouluun', blank: true }] },
          { label: 'kaupunki', cells: [{ value: 'kaupunki', blank: false }, { value: 'kaupungissa', blank: false }, { value: 'kaupungista', blank: false }, { value: 'kaupunkiin', blank: true }] },
        ],
      },
    },
    {
      id: 'illat-d9', kind: 'mc', sectionId: 'illat-rule3',
      data: {
        prompt: "Which is the illative of 'puu' (tree)?",
        options: ['puussa', 'puusta', 'puulle', 'puuhun'],
        correctIndex: 3,
        explanation: 'Short monosyllable → -hVn rule: puu → puuhun.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Illative', url: 'https://uusikielemmi.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-illative-case-illatiivi' },
    { label: 'Wiktionary — Finnish illative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. ADESSIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ADESSIVE: GrammarTopic = {
  id: 'adessive',
  version: '1.0.0',
  title: 'Adessive (-lla/-llä)',
  subtitle: "'On/at/by means of' — surfaces and instruments.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: ['nominative'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "The adessive is the external 'static location' case. It covers: things resting on a surface, being at open/outdoor places, possession ('I have'), and means of transport.",
    grammarFocus: [
      "Formation: stem + -lla (back) or -llä (front)",
      "Surface location: 'on the table', 'on the floor'",
      "Open locations: 'at the market', 'on the street'",
      "Possession: 'minulla on' = 'I have'",
      "Means of transport: 'junalla' = by train",
      "Times of day and seasons also use adessive",
    ],
    whyItMatters:
      "'Minulla on' is how Finnish says 'I have' — there is no verb 'to have'. The adessive is at the heart of possession, location, and instrument expressions.",
  },

  sections: [
    {
      id: 'ades-formation',
      title: 'Formation',
      question: 'Miten adessiivi muodostetaan?',
      questionEn: 'How is the adessive formed?',
      grammarPattern:
        'Adessive = stem + -lla (back vowels) or -llä (front vowels). The stem is the same as used in the inessive, but the ending is -lla/-llä instead of -ssa/-ssä.',
      caseMarker: '-lla / -llä',
      morphology: {
        stem: 'pöytä',
        gradation: 't → d',
        ending: '-llä',
        surface: 'pöydällä',
        breakdown: [
          { token: 'pöydä', role: 'stem', note: "stem of pöytä (table) — t→d gradation" },
          { token: 'llä', role: 'ending', note: 'adessive -llä (front vowel)' },
        ],
      },
      examples: [
        { fi: 'pöytä → pöydällä', en: 'table → on the table (t→d gradation)' },
        { fi: 'lattia → lattialla', en: 'floor → on the floor' },
        { fi: 'katu → kadulla', en: 'street → on the street (t→d)' },
        { fi: 'tori → torilla', en: 'market square → at the market' },
        { fi: 'ranta → rannalla', en: 'shore → at the shore (nt→nn)' },
      ],
      commonPitfalls: [
        'Consonant gradation occurs in the adessive: pöytä → pöydällä, katu → kadulla.',
        'The doubling of -ll- is part of the ending itself, not a gradation effect.',
      ],
    },
    {
      id: 'ades-surface',
      title: 'Surface and open-area location',
      question: 'Missä (pinta tai ulkotila)?',
      questionEn: 'Where (on a surface or at an open place)?',
      grammarPattern:
        'Use adessive for things resting on a surface, or at locations thought of as open/outdoor (rather than enclosed). Contrast with inessive for enclosed spaces.',
      examples: [
        { fi: 'Kirja on pöydällä.', en: 'The book is on the table.' },
        { fi: 'Lapset leikkivät pihalla.', en: 'The children are playing in the yard.' },
        { fi: 'Hän seisoo kadulla.', en: 'He/she is standing on the street.' },
        { fi: 'Olemme torilla.', en: 'We are at the market square.' },
      ],
      commonPitfalls: [
        "'talossa' (inside the house) vs 'talolla' (at the house, outside) — the choice of case signals inside vs outside.",
      ],
    },
    {
      id: 'ades-possession',
      title: 'Possession — minulla on',
      question: 'Kuinka sanotaan "minulla on"?',
      questionEn: 'How do you say "I have"?',
      grammarPattern:
        "Finnish has no verb for 'to have'. Instead: possessor in adessive + on/olla + the possessed thing in nominative.",
      formula: 'possessor-adessive + on + nominative',
      morphology: {
        stem: 'minu',
        ending: '-lla',
        surface: 'minulla',
        breakdown: [
          { token: 'minu', role: 'stem', note: 'oblique stem of minä' },
          { token: 'lla', role: 'ending', note: 'adessive -lla' },
        ],
      },
      examples: [
        { fi: 'Minulla on koira.', en: 'I have a dog. (lit. "on me is a dog")' },
        { fi: 'Sinulla on kirja.', en: 'You have a book.' },
        { fi: 'Hänellä on auto.', en: 'He/she has a car.' },
        { fi: 'Meillä on iso talo.', en: 'We have a big house.' },
        { fi: 'Minulla ei ole autoa.', en: "I don't have a car. (negation → partitive 'autoa')" },
      ],
      commonPitfalls: [
        "Negation: 'Minulla ei ole autoa' — the possessed noun shifts to partitive.",
        "The possessor pronoun takes the adessive of its oblique stem: minä → minulla, sinä → sinulla, hän → hänellä.",
      ],
    },
    {
      id: 'ades-transport',
      title: 'Means of transport',
      question: 'Millä kuljet?',
      questionEn: 'How do you travel? (by what means)',
      grammarPattern:
        "The adessive expresses the instrument or means used for an action. 'Junalla' = 'by train', 'autolla' = 'by car', 'jalkaisin' = 'on foot' (special adverb).",
      caseMarker: '-lla/-llä (instrument)',
      examples: [
        { fi: 'Matkustan junalla.', en: 'I travel by train.' },
        { fi: 'Ajaa autolla.', en: 'To drive by car.' },
        { fi: 'Tulin bussilla.', en: 'I came by bus.' },
        { fi: 'Lentää lentokoneella.', en: 'To fly by plane.' },
        { fi: 'Soitan pianolla.', en: 'I play the piano. (instrument means)' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-lla', use: 'Adessive — back-vowel words (surface, at, possession, means)', examples: ['pöydällä', 'kadulla', 'junalla'], sectionRef: 'ades-formation' },
    { pattern: '-llä', use: 'Adessive — front-vowel words', examples: ['pöydällä', 'torilla', 'pyörällä'], sectionRef: 'ades-formation' },
    { pattern: 'pronoun-lla + on', use: 'Possession: I/you/he have', examples: ['minulla on', 'sinulla on', 'hänellä on'], sectionRef: 'ades-possession' },
  ],

  drills: [
    {
      id: 'ades-d1', kind: 'transform', sectionId: 'ades-formation',
      data: { base: 'pöytä', instruction: '→ adessive (on the table)', answer: 'pöydällä' },
    },
    {
      id: 'ades-d2', kind: 'transform', sectionId: 'ades-formation',
      data: { base: 'katu', instruction: '→ adessive (on the street)', answer: 'kadulla' },
    },
    {
      id: 'ades-d3', kind: 'fill', sectionId: 'ades-possession',
      data: {
        sentence: '_____ on koira. (minä)',
        answer: 'Minulla',
        hint: 'Possession: possessor → adessive → minä → minulla',
        baseForm: 'minä',
      },
    },
    {
      id: 'ades-d4', kind: 'fill', sectionId: 'ades-transport',
      data: {
        sentence: 'Matkustan _____ (juna).',
        answer: 'junalla',
        hint: 'Means of transport → adessive: juna → junalla',
        baseForm: 'juna',
      },
    },
    {
      id: 'ades-d5', kind: 'mc', sectionId: 'ades-possession',
      data: {
        prompt: "'She has a car' — how do you say it in Finnish?",
        options: ['Hän on auto', 'Hänellä on auto', 'Hänelle on auto', 'Hänestä on auto'],
        correctIndex: 1,
        explanation: "Possession uses adessive: hänellä on auto.",
      },
    },
    {
      id: 'ades-d6', kind: 'translate', sectionId: 'ades-possession',
      data: { prompt: 'I have a dog.', target: 'Minulla on koira', acceptAlso: ['Minulla on koira.'] },
    },
    {
      id: 'ades-d7', kind: 'spot-error', sectionId: 'ades-surface',
      data: {
        sentence: 'Kirja on pöytä.',
        errorWord: 'pöytä',
        correctForm: 'pöydällä',
        explanation: "'On the table' needs the adessive: pöytä → pöydällä.",
      },
    },
    {
      id: 'ades-d8', kind: 'table', sectionId: 'ades-possession',
      data: {
        headers: ['Pronoun', 'Adessive form', 'Meaning'],
        rows: [
          { label: 'minä', cells: [{ value: 'minä', blank: false }, { value: 'minulla', blank: true }, { value: 'I have', blank: false }] },
          { label: 'sinä', cells: [{ value: 'sinä', blank: false }, { value: 'sinulla', blank: true }, { value: 'you have', blank: false }] },
          { label: 'hän', cells: [{ value: 'hän', blank: false }, { value: 'hänellä', blank: true }, { value: 'he/she has', blank: false }] },
          { label: 'me', cells: [{ value: 'me', blank: false }, { value: 'meillä', blank: true }, { value: 'we have', blank: false }] },
        ],
      },
    },
    {
      id: 'ades-d9', kind: 'builder', sectionId: 'ades-transport',
      data: {
        tiles: ['junalla', 'Matkustan', 'Helsinkiin'],
        correctOrder: [1, 2, 0],
        translation: 'I travel to Helsinki by train.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Adessive', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-adessive-case-adessiivi' },
    { label: 'Wiktionary — Finnish adessive', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. ABLATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ABLATIVE: GrammarTopic = {
  id: 'ablative',
  version: '1.0.0',
  title: 'Ablative (-lta/-ltä)',
  subtitle: "'From' — off a surface or from a person.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: ['adessive'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "The ablative is the 'departure' case in the external set. It answers Miltä? (From what surface? / From whom?) and covers motion away from a surface, receiving from a person, and perception/feeling verbs.",
    grammarFocus: [
      'Formation: same stem as adessive + -lta/-ltä instead of -lla/-llä',
      'Motion off a surface: tule pöydältä = come off the table',
      'From a person: sain opettajalta = I got (it) from the teacher',
      'Perception verbs: kuulostaa, näyttää, tuntua + ablative',
      'Clock time: kello neljältä = at four o\'clock',
    ],
    whyItMatters:
      "'Saatko minulta apua?' (Can you get help from me?) — the ablative is essential for exchanges between people and for expressing how things feel or sound.",
  },

  sections: [
    {
      id: 'ablat-formation',
      title: 'Formation',
      question: 'Miten ablatiivi muodostetaan?',
      questionEn: 'How is the ablative formed?',
      grammarPattern:
        'Replace the adessive ending -lla/-llä with -lta/-ltä on the same stem. The stem and any consonant gradation are identical to the adessive.',
      caseMarker: '-lta / -ltä',
      morphology: {
        stem: 'pöydä',
        ending: '-ltä',
        surface: 'pöydältä',
        breakdown: [
          { token: 'pöydä', role: 'stem', note: "weak-grade stem of pöytä (t→d)" },
          { token: 'ltä', role: 'ending', note: 'ablative -ltä (front vowel)' },
        ],
      },
      examples: [
        { fi: 'pöytä → pöydältä', en: 'table → off the table' },
        { fi: 'lattia → lattialta', en: 'floor → off the floor' },
        { fi: 'katu → kadulta', en: 'street → from the street' },
        { fi: 'tori → torilta', en: 'market → from the market' },
      ],
      commonPitfalls: [
        "The ablative is always the external 'from' — use elative (-sta/-stä) for coming from inside something.",
        'Same consonant gradation as adessive: pöytä → pöydältä (not pöytältä).',
      ],
    },
    {
      id: 'ablat-surface',
      title: 'Motion from a surface',
      question: 'Miltä?',
      questionEn: 'From where (surface)?',
      grammarPattern:
        "The ablative marks the source of motion when departing from a surface, outdoor area, or open space (contrast with elative for enclosed spaces).",
      examples: [
        { fi: 'Otan kirjan pöydältä.', en: 'I take the book off the table.' },
        { fi: 'Tule lattialta!', en: 'Get up off the floor!' },
        { fi: 'Tulin torilta.', en: 'I came from the market.' },
        { fi: 'Hyppäsin laudalta.', en: 'I jumped off the board.' },
      ],
    },
    {
      id: 'ablat-person',
      title: 'From a person',
      question: 'Keneltä sait sen?',
      questionEn: 'From whom did you get it?',
      grammarPattern:
        "When something is received, obtained, or heard from a person, the person is in the ablative. Verbs: saada (get), ostaa (buy), lainata (borrow), kuulla (hear).",
      formula: 'verb + person-ablative',
      examples: [
        { fi: 'Sain kirjan opettajalta.', en: 'I got the book from the teacher.' },
        { fi: 'Ostin sen Pekalta.', en: 'I bought it from Pekka.' },
        { fi: 'Lainasin pyörän naapuriltani.', en: 'I borrowed a bike from my neighbour.' },
        { fi: 'Kuulin sen sinulta.', en: 'I heard it from you.' },
      ],
    },
    {
      id: 'ablat-perception',
      title: 'Perception verbs',
      question: 'Miltä se kuulostaa?',
      questionEn: 'What does it sound like?',
      grammarPattern:
        "The verbs 'kuulostaa' (sound like), 'näyttää' (look like), and 'tuntua' (feel like) all govern the ablative when expressing what something resembles.",
      formula: 'subject + kuulostaa/näyttää/tuntuu + ablative',
      examples: [
        { fi: 'Se kuulostaa hyvältä.', en: 'It sounds good.' },
        { fi: 'Tämä näyttää helpolta.', en: 'This looks easy.' },
        { fi: 'Tuntuu kylmältä.', en: "It feels cold. (lit. 'feels from cold')" },
        { fi: 'Hän näyttää väsyneeltä.', en: 'He/she looks tired.' },
      ],
      commonPitfalls: [
        "'Se on hyvä' (it is good) vs 'Se kuulostaa hyvältä' (it sounds good) — the ablative is required after kuulostaa.",
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-lta', use: 'Ablative — back-vowel words, from a surface', examples: ['pöydältä', 'kadulta', 'torilta'], sectionRef: 'ablat-formation' },
    { pattern: '-ltä', use: 'Ablative — front-vowel words', examples: ['pöydältä', 'toriltä', 'opettajalta'], sectionRef: 'ablat-formation' },
    { pattern: 'person + -lta/-ltä', use: 'Receiving from a person', examples: ['opettajalta', 'Pekalta', 'sinulta'], sectionRef: 'ablat-person' },
    { pattern: 'kuulostaa/näyttää/tuntuu + -lta/-ltä', use: 'Perception: looks/sounds/feels like', examples: ['hyvältä', 'kylmältä', 'helpolta'], sectionRef: 'ablat-perception' },
  ],

  drills: [
    {
      id: 'ablat-d1', kind: 'transform', sectionId: 'ablat-formation',
      data: { base: 'pöytä', instruction: '→ ablative (off the table)', answer: 'pöydältä' },
    },
    {
      id: 'ablat-d2', kind: 'transform', sectionId: 'ablat-formation',
      data: { base: 'katu', instruction: '→ ablative (from the street)', answer: 'kadulta' },
    },
    {
      id: 'ablat-d3', kind: 'fill', sectionId: 'ablat-person',
      data: {
        sentence: 'Sain kirjan _____ (opettaja).',
        answer: 'opettajalta',
        hint: 'From a person → ablative: opettaja → opettajalta',
        baseForm: 'opettaja',
      },
    },
    {
      id: 'ablat-d4', kind: 'mc', sectionId: 'ablat-perception',
      data: {
        prompt: "'It sounds good' — pick the correct sentence.",
        options: ['Se kuulostaa hyvää', 'Se kuulostaa hyvä', 'Se kuulostaa hyvältä', 'Se kuulostaa hyvässä'],
        correctIndex: 2,
        explanation: 'kuulostaa (sounds like) governs the ablative: hyvältä.',
      },
    },
    {
      id: 'ablat-d5', kind: 'translate', sectionId: 'ablat-person',
      data: { prompt: 'I got it from Pekka.', target: 'Sain sen Pekalta', acceptAlso: ['Sain sen Pekalta.'] },
    },
    {
      id: 'ablat-d6', kind: 'fill', sectionId: 'ablat-perception',
      data: {
        sentence: 'Tämä näyttää _____ (helppo).',
        answer: 'helpolta',
        hint: 'näyttää + ablative: helppo → helpolta',
        baseForm: 'helppo',
      },
    },
    {
      id: 'ablat-d7', kind: 'spot-error', sectionId: 'ablat-surface',
      data: {
        sentence: 'Otan kirjan pöydässä.',
        errorWord: 'pöydässä',
        correctForm: 'pöydältä',
        explanation: "'Otan' (I take) implies motion away from surface → ablative: pöydältä.",
      },
    },
    {
      id: 'ablat-d8', kind: 'table', sectionId: 'ablat-formation',
      data: {
        headers: ['Base', 'Adessive (on)', 'Ablative (from)'],
        rows: [
          { label: 'pöytä', cells: [{ value: 'pöytä', blank: false }, { value: 'pöydällä', blank: false }, { value: 'pöydältä', blank: true }] },
          { label: 'katu', cells: [{ value: 'katu', blank: false }, { value: 'kadulla', blank: false }, { value: 'kadulta', blank: true }] },
          { label: 'tori', cells: [{ value: 'tori', blank: false }, { value: 'torilla', blank: false }, { value: 'torilta', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Ablative', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-ablative-case-ablatiivi' },
    { label: 'Wiktionary — Finnish ablative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. ALLATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ALLATIVE: GrammarTopic = {
  id: 'allative',
  version: '1.0.0',
  title: 'Allative (-lle)',
  subtitle: "'To/onto' — directional to a surface or recipient.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: ['adessive'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "The allative is the 'arrival' case of the external set. It answers Mille? (Onto what? / To whom?) and covers motion onto a surface, giving or saying something to a person, and beneficiary expressions.",
    grammarFocus: [
      'Formation: stem + -lle (invariable — no vowel harmony variation)',
      'Onto a surface: pöydälle = onto the table',
      'To a person: opettajalle = to the teacher',
      'Indirect object (recipient): annan sinulle = I give to you',
      'Beneficiary: tee minulle = do it for me',
    ],
    whyItMatters:
      "'Annan sinulle kirjan' (I give you the book) — the allative is how Finnish marks indirect objects and recipients. It is used constantly in everyday speech.",
  },

  sections: [
    {
      id: 'allat-formation',
      title: 'Formation',
      question: 'Miten allatiivi muodostetaan?',
      questionEn: 'How is the allative formed?',
      grammarPattern:
        'Allative = weak-grade stem + -lle. Unlike most endings, -lle does not change for vowel harmony — it is always -lle.',
      caseMarker: '-lle',
      morphology: {
        stem: 'pöydä',
        ending: '-lle',
        surface: 'pöydälle',
        breakdown: [
          { token: 'pöydä', role: 'stem', note: "weak-grade stem of pöytä (t→d)" },
          { token: 'lle', role: 'ending', note: 'allative -lle (invariable)' },
        ],
      },
      examples: [
        { fi: 'pöytä → pöydälle', en: 'table → onto the table' },
        { fi: 'lattia → lattialle', en: 'floor → onto the floor' },
        { fi: 'katu → kadulle', en: 'street → onto the street' },
        { fi: 'opettaja → opettajalle', en: 'teacher → to the teacher' },
      ],
      commonPitfalls: [
        "'-lle' is always '-lle' — no -llä variant. This is one of the few case endings with no vowel harmony variation.",
        "Same consonant gradation as adessive/ablative applies: pöytä → pöydälle (not pöytälle).",
      ],
    },
    {
      id: 'allat-surface',
      title: 'Onto a surface',
      question: 'Mille (liike)?',
      questionEn: 'To what surface (motion)?',
      grammarPattern:
        "Use allative when motion is toward an external surface or open area — the directional counterpart of the adessive (static) and ablative (away).",
      examples: [
        { fi: 'Laita kirja pöydälle.', en: 'Put the book on(to) the table.' },
        { fi: 'Mene kadulle.', en: 'Go onto the street.' },
        { fi: 'Hyppää laudalle.', en: 'Jump onto the board.' },
        { fi: 'Hän meni torille.', en: 'He/she went to the market square.' },
      ],
    },
    {
      id: 'allat-person',
      title: 'To a person — indirect object',
      question: 'Kenelle annat sen?',
      questionEn: 'To whom do you give it?',
      grammarPattern:
        "The allative marks the recipient (indirect object) with verbs of giving, saying, showing, sending, and returning. The person receives something.",
      formula: 'verb + direct object + person-allative',
      examples: [
        { fi: 'Annan sinulle kirjan.', en: 'I give you the book.' },
        { fi: 'Sanoin hänelle totuuden.', en: 'I told him/her the truth.' },
        { fi: 'Lähetän opettajalle sähköpostin.', en: "I'm sending an email to the teacher." },
        { fi: 'Palautin kirjan kirjastolle.', en: 'I returned the book to the library.' },
      ],
      commonPitfalls: [
        "'Annan sinulle' vs 'Otan sinulta': to give → allative; to take/receive from → ablative.",
      ],
    },
    {
      id: 'allat-beneficiary',
      title: 'Beneficiary — for someone',
      question: 'Kenelle teet sen?',
      questionEn: 'For whom do you do it?',
      grammarPattern:
        "The allative can also mark the beneficiary — the person for whose benefit an action is done. It overlaps with the indirect object use.",
      examples: [
        { fi: 'Tein sinulle ruokaa.', en: 'I made food for you.' },
        { fi: 'Hän osti lapselle lelun.', en: 'He/she bought the child a toy.' },
        { fi: 'Voinko tehdä jotain sinulle?', en: 'Can I do something for you?' },
        { fi: 'Hyödyllistä opiskelijoille.', en: 'Useful for students.' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-lle (invariable)', use: 'Allative — onto a surface, to a person, for someone', examples: ['pöydälle', 'opettajalle', 'sinulle'], sectionRef: 'allat-formation' },
    { pattern: 'antaa/sanoa + person-lle', use: 'Indirect object (recipient)', examples: ['annan sinulle', 'sanoin hänelle'], sectionRef: 'allat-person' },
  ],

  drills: [
    {
      id: 'allat-d1', kind: 'transform', sectionId: 'allat-formation',
      data: { base: 'pöytä', instruction: '→ allative (onto the table)', answer: 'pöydälle' },
    },
    {
      id: 'allat-d2', kind: 'transform', sectionId: 'allat-formation',
      data: { base: 'katu', instruction: '→ allative (onto the street)', answer: 'kadulle' },
    },
    {
      id: 'allat-d3', kind: 'fill', sectionId: 'allat-person',
      data: {
        sentence: 'Annan kirjan _____ (opettaja).',
        answer: 'opettajalle',
        hint: 'Recipient → allative: opettaja → opettajalle',
        baseForm: 'opettaja',
      },
    },
    {
      id: 'allat-d4', kind: 'mc', sectionId: 'allat-person',
      data: {
        prompt: "'I give you the book' — which form of sinä?",
        options: ['sinusta', 'sinulla', 'sinulta', 'sinulle'],
        correctIndex: 3,
        explanation: 'Recipient (indirect object) → allative: sinulle.',
      },
    },
    {
      id: 'allat-d5', kind: 'translate', sectionId: 'allat-person',
      data: { prompt: 'I give you the book.', target: 'Annan sinulle kirjan', acceptAlso: ['Annan sinulle kirjan.'] },
    },
    {
      id: 'allat-d6', kind: 'spot-error', sectionId: 'allat-surface',
      data: {
        sentence: 'Laita kirja pöydällä.',
        errorWord: 'pöydällä',
        correctForm: 'pöydälle',
        explanation: "'Laita' (put) implies motion onto surface → allative: pöydälle. Adessive 'pöydällä' is for static location.",
      },
    },
    {
      id: 'allat-d7', kind: 'table', sectionId: 'allat-formation',
      data: {
        headers: ['Base', 'Adessive (on)', 'Ablative (from)', 'Allative (onto/to)'],
        rows: [
          { label: 'pöytä', cells: [{ value: 'pöytä', blank: false }, { value: 'pöydällä', blank: false }, { value: 'pöydältä', blank: false }, { value: 'pöydälle', blank: true }] },
          { label: 'katu', cells: [{ value: 'katu', blank: false }, { value: 'kadulla', blank: false }, { value: 'kadulta', blank: false }, { value: 'kadulle', blank: true }] },
          { label: 'tori', cells: [{ value: 'tori', blank: false }, { value: 'torilla', blank: false }, { value: 'torilta', blank: false }, { value: 'torille', blank: true }] },
        ],
      },
    },
    {
      id: 'allat-d8', kind: 'builder', sectionId: 'allat-person',
      data: {
        tiles: ['hänelle', 'Annoin', 'kirjan'],
        correctOrder: [1, 2, 0],
        translation: 'I gave the book to him/her.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Allative', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-allative-case-allatiivi' },
    { label: 'Wiktionary — Finnish allative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. ESSIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ESSIVE: GrammarTopic = {
  id: 'essive',
  version: '1.0.0',
  title: 'Essive (-na/-nä)',
  subtitle: "'As' — temporary state, days of the week, occupations.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 10,
  prerequisites: ['nominative'],
  tags: ['cases'],

  overview: {
    theme: "The essive expresses a temporary state or role — 'as a doctor', 'as a child', 'on Monday', 'in 1968'. The key idea is that the subject exists in a particular capacity for a time, without permanently becoming something.",
    grammarFocus: [
      'Formation: strong-grade stem + -na (back) or -nä (front)',
      'Days of the week: maanantaina = on Monday',
      'Years: vuonna 1968',
      'Temporary role: lapsena = as a child / when a child',
      'Occupation as a role: opettajana = as a teacher',
      '"Tänä" expressions with essive',
    ],
    whyItMatters:
      "'Minä työskentelee opettajana' — the essive is how Finnish expresses roles and temporary identities. Days of the week always use it.",
  },

  sections: [
    {
      id: 'ess-formation',
      title: 'Formation',
      question: 'Miten essiivi muodostetaan?',
      questionEn: 'How is the essive formed?',
      grammarPattern:
        'Essive = strong-grade stem + -na (back vowels) or -nä (front vowels). The strong grade is used — same as nominative plural stem.',
      caseMarker: '-na / -nä',
      morphology: {
        stem: 'opettaja',
        ending: '-na',
        surface: 'opettajana',
        breakdown: [
          { token: 'opettaja', role: 'stem', note: "'teacher'" },
          { token: 'na', role: 'ending', note: 'essive -na (back vowel)' },
        ],
      },
      examples: [
        { fi: 'opettaja → opettajana', en: 'teacher → as a teacher' },
        { fi: 'lapsi → lapsena', en: 'child → as a child' },
        { fi: 'maanantai → maanantaina', en: 'Monday → on Monday' },
        { fi: 'lääkäri → lääkärinä', en: 'doctor → as a doctor (front vowel → -nä)' },
      ],
      commonPitfalls: [
        'Strong grade in essive: hattu → hattuna (not hattna). The geminate tt is the strong grade.',
        "The essive of 'vuosi' (year) is 'vuonna' — irregular gemination.",
      ],
    },
    {
      id: 'ess-days',
      title: 'Days of the week',
      question: 'Minä päivänä?',
      questionEn: 'On which day?',
      grammarPattern:
        'All days of the week take the essive to express "on [day]". This is one of the most frequent uses of the essive.',
      caseMarker: '-na / -nä (days)',
      examples: [
        { fi: 'maanantaina', en: 'on Monday' },
        { fi: 'tiistaina', en: 'on Tuesday' },
        { fi: 'keskiviikkona', en: 'on Wednesday' },
        { fi: 'torstaina', en: 'on Thursday' },
        { fi: 'perjantaina', en: 'on Friday' },
        { fi: 'lauantaina', en: 'on Saturday' },
        { fi: 'sunnuntaina', en: 'on Sunday' },
      ],
      relativeExamples: [
        { fi: 'viime maanantaina', en: 'last Monday' },
        { fi: 'ensi perjantaina', en: 'next Friday' },
        { fi: 'tänä lauantaina', en: 'this Saturday' },
      ],
    },
    {
      id: 'ess-temporary',
      title: 'Temporary state or role',
      question: 'Millaisena henkilönä toimii?',
      questionEn: 'In what capacity does one act?',
      grammarPattern:
        'The essive marks a temporary state, role, or capacity. The subject acts as something without permanently becoming it.',
      examples: [
        { fi: 'Lapsena pidin suklaasta.', en: 'As a child, I liked chocolate.' },
        { fi: 'Hän toimi tulkkina kokouksessa.', en: 'He/she acted as an interpreter at the meeting.' },
        { fi: 'Vapaaehtoisena olen oppinut paljon.', en: 'As a volunteer, I have learned a lot.' },
        { fi: 'Turistina Helsingissä on helppo eksyä.', en: 'As a tourist in Helsinki, it is easy to get lost.' },
      ],
      commonPitfalls: [
        'Compare with translative: essive = currently in a role (opettajana); translative = becoming/changing into (opettajaksi).',
      ],
    },
    {
      id: 'ess-occupation',
      title: 'Occupation — "works as"',
      question: 'Minä työskentelee?',
      questionEn: 'What does he/she work as?',
      grammarPattern:
        "'Työskennellä' (to work), 'toimia' (to act/serve), and 'olla' (to be, in a professional capacity) combine with the essive to express occupational roles.",
      formula: 'verb + essive occupation',
      examples: [
        { fi: 'Hän työskentelee lääkärinä.', en: 'He/she works as a doctor.' },
        { fi: 'Opiskelen suomea opettajana.', en: 'I study Finnish as a teacher. (i.e. while working as a teacher)' },
        { fi: 'Hän on vapaaehtoisena.', en: 'He/she is (working) as a volunteer.' },
        { fi: 'Toimin johtajana viisi vuotta.', en: 'I served as a manager for five years.' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-na', use: 'Essive — back-vowel words: days, roles, years', examples: ['maanantaina', 'opettajana', 'vuonna'], sectionRef: 'ess-formation' },
    { pattern: '-nä', use: 'Essive — front-vowel words', examples: ['lääkärinä', 'lapsena', 'opiskelijana'], sectionRef: 'ess-formation' },
    { pattern: 'day + -na/-nä', use: 'On a day of the week', examples: ['maanantaina', 'perjantaina', 'sunnuntaina'], sectionRef: 'ess-days' },
    { pattern: 'vuonna + year', use: 'In a year', examples: ['vuonna 1968', 'vuonna 2026'], sectionRef: 'ess-days' },
  ],

  drills: [
    {
      id: 'ess-d1', kind: 'transform', sectionId: 'ess-days',
      data: { base: 'maanantai', instruction: "→ essive ('on Monday')", answer: 'maanantaina' },
    },
    {
      id: 'ess-d2', kind: 'transform', sectionId: 'ess-days',
      data: { base: 'perjantai', instruction: "→ essive ('on Friday')", answer: 'perjantaina' },
    },
    {
      id: 'ess-d3', kind: 'fill', sectionId: 'ess-occupation',
      data: {
        sentence: 'Hän työskentelee _____ (lääkäri).',
        answer: 'lääkärinä',
        hint: 'Works as a doctor → essive: lääkäri → lääkärinä',
        baseForm: 'lääkäri',
      },
    },
    {
      id: 'ess-d4', kind: 'translate', sectionId: 'ess-days',
      data: { prompt: 'on Monday', target: 'maanantaina', acceptAlso: ['Maanantaina'] },
    },
    {
      id: 'ess-d5', kind: 'mc', sectionId: 'ess-temporary',
      data: {
        prompt: "'As a child I liked chocolate' — which form of 'lapsi'?",
        options: ['lapselle', 'lapsessa', 'lapsi', 'lapsena'],
        correctIndex: 3,
        explanation: 'Temporary past role → essive: lapsena.',
      },
    },
    {
      id: 'ess-d6', kind: 'fill', sectionId: 'ess-temporary',
      data: {
        sentence: '_____ pidin suklaasta. (lapsi)',
        answer: 'Lapsena',
        hint: 'As a child (temporary past state) → essive: lapsi → lapsena',
        baseForm: 'lapsi',
      },
    },
    {
      id: 'ess-d7', kind: 'spot-error', sectionId: 'ess-occupation',
      data: {
        sentence: 'Hän työskentelee lääkäri.',
        errorWord: 'lääkäri',
        correctForm: 'lääkärinä',
        explanation: "'Works as a doctor' → essive needed: lääkärinä.",
      },
    },
    {
      id: 'ess-d8', kind: 'table', sectionId: 'ess-days',
      data: {
        headers: ['Day', 'Essive (on …day)'],
        rows: [
          { label: 'maanantai', cells: [{ value: 'maanantai', blank: false }, { value: 'maanantaina', blank: true }] },
          { label: 'tiistai', cells: [{ value: 'tiistai', blank: false }, { value: 'tiistaina', blank: true }] },
          { label: 'perjantai', cells: [{ value: 'perjantai', blank: false }, { value: 'perjantaina', blank: true }] },
          { label: 'lauantai', cells: [{ value: 'lauantai', blank: false }, { value: 'lauantaina', blank: true }] },
          { label: 'sunnuntai', cells: [{ value: 'sunnuntai', blank: false }, { value: 'sunnuntaina', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Essive', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-essive-case-essiivi' },
    { label: 'Wiktionary — Finnish essive', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. TRANSLATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_TRANSLATIVE: GrammarTopic = {
  id: 'translative',
  version: '1.0.0',
  title: 'Translative (-ksi)',
  subtitle: "'Becoming' — change of state, planned duration, languages.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 12,
  prerequisites: ['nominative'],
  tags: ['cases'],

  overview: {
    theme: "The translative expresses transformation or transition — becoming something, changing into a state, studying in a language, or a planned duration. The key idea is change or goal.",
    grammarFocus: [
      'Formation: weak-grade stem + -ksi',
      'Becoming/change of state: hän tuli kuuluisaksi = he became famous',
      'Language of study: opiskelen suomeksi = I study in Finnish',
      'Planned duration with movement verbs: lähden viikoksi = I leave for a week',
      'Goal/purpose: tähän tarkoitukseksi = for this purpose',
    ],
    whyItMatters:
      "'Opiskelen suomea suomeksi' — the translative is essential for language-learning contexts and for describing change over time. It pairs naturally with the essive (current state vs. becoming).",
  },

  sections: [
    {
      id: 'trans-formation',
      title: 'Formation',
      question: 'Miten translatiivi muodostetaan?',
      questionEn: 'How is the translative formed?',
      grammarPattern:
        'Translative = weak-grade stem + -ksi. Consonant gradation applies (weak grade, same as genitive).',
      caseMarker: '-ksi',
      morphology: {
        stem: 'opettaja',
        ending: '-ksi',
        surface: 'opettajaksi',
        breakdown: [
          { token: 'opettaja', role: 'stem', note: "'teacher'" },
          { token: 'ksi', role: 'ending', note: 'translative -ksi' },
        ],
      },
      examples: [
        { fi: 'opettaja → opettajaksi', en: 'teacher → (to become) a teacher' },
        { fi: 'lääkäri → lääkäriksi', en: 'doctor → (to become) a doctor' },
        { fi: 'kuuluisa → kuuluisaksi', en: 'famous → (become) famous' },
        { fi: 'viikko → viikoksi', en: 'week → for a week (kk→k gradation)' },
      ],
      commonPitfalls: [
        'Weak grade in translative — same as genitive: kauppa → kaupaksi (pp→p).',
        'Do not confuse -ksi with the genitive -n: they serve very different purposes.',
      ],
    },
    {
      id: 'trans-change',
      title: 'Change of state — becoming',
      question: 'Miksi hänestä tuli?',
      questionEn: 'What did he/she become?',
      grammarPattern:
        "The translative marks the result of a transformation. Common verbs: 'tulla' (become), 'muuttua' (change into), 'tehdä' (make into).",
      formula: 'subject + verb of change + translative',
      examples: [
        { fi: 'Hän tuli opettajaksi.', en: 'He/she became a teacher.' },
        { fi: 'Vesi jäätyi jääksi.', en: 'The water froze into ice.' },
        { fi: 'He valitsivat hänet johtajaksi.', en: 'They elected him/her (as) a leader.' },
        { fi: 'Sää muuttui kylmäksi.', en: 'The weather turned cold.' },
      ],
      commonPitfalls: [
        "Compare with essive: 'hän on opettajana' (he IS a teacher, current role) vs 'hänestä tuli opettajaksi' (he BECAME a teacher).",
      ],
    },
    {
      id: 'trans-language',
      title: 'Language of study',
      question: 'Millä kielellä opiskelet?',
      questionEn: 'In what language do you study?',
      grammarPattern:
        "When studying or communicating in a language, Finnish uses the translative. 'Opiskelen suomeksi' = I study in Finnish (lit. 'I study into/as Finnish').",
      examples: [
        { fi: 'Opiskelen suomeksi.', en: 'I study (in) Finnish.' },
        { fi: 'Sanokaa se suomeksi!', en: 'Say it in Finnish!' },
        { fi: 'Kirjoitan englanniksi.', en: 'I write in English.' },
        { fi: 'Puhutaan suomea suomeksi.', en: "Let's speak Finnish in Finnish." },
      ],
      specialNote: {
        fi: "'Opiskelen suomea' (I study Finnish — partitive object) vs 'Opiskelen suomeksi' (I study in Finnish — medium).",
        en: "The direct object 'suomea' (partitive) says what you study; the translative 'suomeksi' says the medium/language of instruction.",
      },
    },
    {
      id: 'trans-duration',
      title: 'Planned duration',
      question: 'Kuinka pitkäksi ajaksi lähdet?',
      questionEn: 'For how long are you leaving?',
      grammarPattern:
        "With movement verbs (lähteä, mennä, tulla), the translative expresses planned or intended duration — how long you will be away.",
      formula: 'movement verb + duration-translative',
      examples: [
        { fi: 'Lähden matkalle kahdeksi viikoksi.', en: "I'm leaving on a trip for two weeks." },
        { fi: 'Menin ulos tunniksi.', en: 'I went outside for an hour.' },
        { fi: 'Tuletko lomalle viikoksi?', en: 'Are you coming on holiday for a week?' },
        { fi: 'Jäin sairaalaan kolmeksi päiväksi.', en: 'I stayed in hospital for three days.' },
      ],
      commonPitfalls: [
        "This construction is specifically for planned/intended duration with motion verbs. For duration in general, use the partitive: 'Olin sairaana kolme päivää' (I was sick for three days).",
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-ksi', use: 'Translative — becoming, language medium, planned duration', examples: ['opettajaksi', 'suomeksi', 'viikoksi'], sectionRef: 'trans-formation' },
    { pattern: 'tulla + -ksi', use: 'Becoming something', examples: ['tuli opettajaksi', 'muuttui kylmäksi'], sectionRef: 'trans-change' },
    { pattern: 'language + -ksi', use: 'In/into a language', examples: ['suomeksi', 'englanniksi', 'ruotsiksi'], sectionRef: 'trans-language' },
    { pattern: 'lähteä + duration-ksi', use: 'Leaving for a planned period', examples: ['viikoksi', 'kahdeksi päiväksi'], sectionRef: 'trans-duration' },
  ],

  drills: [
    {
      id: 'trans-d1', kind: 'transform', sectionId: 'trans-formation',
      data: { base: 'opettaja', instruction: '→ translative (becoming a teacher)', answer: 'opettajaksi' },
    },
    {
      id: 'trans-d2', kind: 'transform', sectionId: 'trans-duration',
      data: { base: 'viikko', instruction: '→ translative (for a week)', answer: 'viikoksi' },
    },
    {
      id: 'trans-d3', kind: 'fill', sectionId: 'trans-change',
      data: {
        sentence: 'Hän tuli _____ (opettaja).',
        answer: 'opettajaksi',
        hint: 'Became a teacher → translative: opettaja → opettajaksi',
        baseForm: 'opettaja',
      },
    },
    {
      id: 'trans-d4', kind: 'fill', sectionId: 'trans-language',
      data: {
        sentence: 'Sano se _____ (suomi).',
        answer: 'suomeksi',
        hint: 'In Finnish (language medium) → translative: suomi → suomeksi',
        baseForm: 'suomi',
      },
    },
    {
      id: 'trans-d5', kind: 'mc', sectionId: 'trans-change',
      data: {
        prompt: "'The weather turned cold' — which form of kylmä?",
        options: ['kylmässä', 'kylmänä', 'kylmäksi', 'kylmästä'],
        correctIndex: 2,
        explanation: 'Change of state (muuttua) → translative: kylmäksi.',
      },
    },
    {
      id: 'trans-d6', kind: 'translate', sectionId: 'trans-language',
      data: { prompt: 'Say it in Finnish!', target: 'Sano se suomeksi', acceptAlso: ['Sano se suomeksi!', 'Sanokaa se suomeksi', 'Sanokaa se suomeksi!'] },
    },
    {
      id: 'trans-d7', kind: 'spot-error', sectionId: 'trans-change',
      data: {
        sentence: 'Hän tuli opettajana.',
        errorWord: 'opettajana',
        correctForm: 'opettajaksi',
        explanation: "'Tulla' meaning 'become' takes the translative: opettajaksi. Essive 'opettajana' means 'working as a teacher (currently)'.",
      },
    },
    {
      id: 'trans-d8', kind: 'fill', sectionId: 'trans-duration',
      data: {
        sentence: 'Lähden matkalle _____ (kaksi viikko).',
        answer: 'kahdeksi viikoksi',
        hint: 'Planned departure duration → translative on both numeral and noun',
        baseForm: 'kaksi viikko',
      },
    },
    {
      id: 'trans-d9', kind: 'mc', sectionId: 'trans-language',
      data: {
        prompt: "'I write in English' — which form?",
        options: ['englannissa', 'englantia', 'englanniksi', 'englannille'],
        correctIndex: 2,
        explanation: 'Language medium → translative: englanniksi.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Translative', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-translative-case-translatiivi' },
    { label: 'Wiktionary — Finnish translative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. LOCATIVE OVERVIEW
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_LOCATIVE_OVERVIEW: GrammarTopic = {
  id: 'locative-overview',
  version: '1.0.0',
  title: 'Locative cases — overview',
  subtitle: 'The six where/when cases: in/from/into and on/off/onto.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 15,
  prerequisites: ['inessive', 'elative', 'illative', 'adessive', 'ablative', 'allative'],
  tags: ['cases', 'locative'],

  overview: {
    theme: "Finnish has two parallel sets of three locative cases: the internal set (inside/from inside/into) and the external set (on/off/onto). Each set covers static location, movement away, and movement toward.",
    grammarFocus: [
      'Internal set: -ssa/-ssä (in), -sta/-stä (from inside), -Vn/-seen (into)',
      'External set: -lla/-llä (on/at), -lta/-ltä (off/from), -lle (onto/to)',
      'Internal cases: enclosed spaces, buildings, countries, containers',
      'External cases: surfaces, open areas, people',
      'Possession uses adessive: minulla on',
    ],
    whyItMatters:
      'Understanding the two sets as parallel systems — static / away / toward — makes all six cases predictable. Mixing internal and external cases is the most common locative error.',
  },

  sections: [
    {
      id: 'loc-internal',
      title: 'Internal set: -ssa / -sta / -Vn',
      question: 'Missä? Mistä? Mihin? (sisällä)',
      questionEn: 'Where? From where? To where? (inside)',
      grammarPattern:
        'Three cases for enclosed/interior spaces:\n• -ssa/-ssä = static location inside (Missä?)\n• -sta/-stä = motion out of (Mistä?)\n• -Vn/-seen = motion into (Mihin?)',
      formula: 'ssa (in) ↔ sta (from) ↔ -Vn (into)',
      examples: [
        { fi: 'Kirja on laukussa.', en: 'The book is in the bag. (ssa — static)' },
        { fi: 'Otan kirjan laukusta.', en: 'I take the book out of the bag. (sta — from)' },
        { fi: 'Laitan kirjan laukkuun.', en: 'I put the book into the bag. (un — into)' },
        { fi: 'Asun Suomessa.', en: 'I live in Finland.' },
        { fi: 'Olen kotoisin Suomesta.', en: 'I am originally from Finland.' },
        { fi: 'Muutan Suomeen.', en: "I'm moving to Finland." },
      ],
    },
    {
      id: 'loc-external',
      title: 'External set: -lla / -lta / -lle',
      question: 'Missä? Miltä? Mille? (pinnalla)',
      questionEn: 'Where? From where? To where? (surface)',
      grammarPattern:
        'Three cases for surfaces and open/external spaces:\n• -lla/-llä = static location on/at (Missä?)\n• -lta/-ltä = motion off/from (Miltä?)\n• -lle = motion onto/to (Mille?)',
      formula: 'lla (on) ↔ lta (off) ↔ lle (onto)',
      examples: [
        { fi: 'Kirja on pöydällä.', en: 'The book is on the table. (lla — static)' },
        { fi: 'Otan kirjan pöydältä.', en: 'I take the book off the table. (lta — from)' },
        { fi: 'Laitan kirjan pöydälle.', en: 'I put the book onto the table. (lle — onto)' },
        { fi: 'Hän on torilla.', en: 'He/she is at the market. (open area)' },
        { fi: 'Tulin torilta.', en: 'I came from the market.' },
        { fi: 'Menen torille.', en: "I'm going to the market." },
      ],
    },
    {
      id: 'loc-choosing',
      title: 'Choosing internal vs external',
      question: 'Talossa vai talolla? Koulussa vai koululla?',
      questionEn: 'How do I choose between the two sets?',
      grammarPattern:
        "The choice between internal (-ssa/-sta/-Vn) and external (-lla/-lta/-lle) depends on whether the location is conceptually 'inside' or 'on the surface of'. Most buildings and enclosed spaces use internal; open areas and surfaces use external. Some words are fixed by convention.",
      examples: [
        { fi: 'talossa / talosta / taloon', en: 'in the house (enclosed building)' },
        { fi: 'pihalla / pihalita / pihalle', en: 'in the yard (open area)' },
        { fi: 'koulussa / koulusta / kouluun', en: 'at school (institution, enclosed)' },
        { fi: 'Helsingissä / Helsingistä / Helsinkiin', en: 'in Helsinki (city → internal)' },
        { fi: 'Tampereella / Tampereelta / Tampereelle', en: 'in Tampere (exception — external)' },
      ],
      commonPitfalls: [
        'Finnish cities: most use internal cases, but Tampere, Porvoo, and a few others use external (adessive/ablative/allative). Memorise the exceptions.',
        "Person as location always uses external: 'Olin opettajalla' (I was at the teacher's [place]).",
      ],
    },
    {
      id: 'loc-possession',
      title: 'Possession with adessive',
      question: 'Kuinka sanotaan "I have" kaikilla persoonapronomineilla?',
      questionEn: "How do you say 'I/you/we have' with all pronouns?",
      grammarPattern:
        "Finnish expresses 'having' with the adessive of the owner + on/olla + the possessed noun in the nominative. No verb 'to have' exists.",
      formula: 'owner-adessive + on + nominative',
      examples: [
        { fi: 'Minulla on kirja.', en: 'I have a book.' },
        { fi: 'Sinulla on auto.', en: 'You have a car.' },
        { fi: 'Hänellä on kissa.', en: 'He/she has a cat.' },
        { fi: 'Meillä on koira.', en: 'We have a dog.' },
        { fi: 'Teillä on iso talo.', en: 'You (pl.) have a big house.' },
        { fi: 'Heillä on lapsia.', en: 'They have children. (partitive — plural/indefinite)' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-ssa/-ssä', use: 'In (static, internal)', examples: ['talossa', 'Suomessa', 'koulussa'], sectionRef: 'loc-internal' },
    { pattern: '-sta/-stä', use: 'From inside (internal)', examples: ['talosta', 'Suomesta', 'koulusta'], sectionRef: 'loc-internal' },
    { pattern: '-Vn/-seen', use: 'Into (internal)', examples: ['taloon', 'Suomeen', 'kouluun'], sectionRef: 'loc-internal' },
    { pattern: '-lla/-llä', use: 'On/at (static, external)', examples: ['pöydällä', 'torilla', 'kadulla'], sectionRef: 'loc-external' },
    { pattern: '-lta/-ltä', use: 'From/off (external)', examples: ['pöydältä', 'torilta', 'kadulta'], sectionRef: 'loc-external' },
    { pattern: '-lle', use: 'Onto/to (external)', examples: ['pöydälle', 'torille', 'kadulle'], sectionRef: 'loc-external' },
  ],

  drills: [
    {
      id: 'loc-d1', kind: 'mc', sectionId: 'loc-internal',
      data: {
        prompt: "'I live in Finland' — which form?",
        options: ['Suomella', 'Suomesta', 'Suomeen', 'Suomessa'],
        correctIndex: 3,
        explanation: 'Static location in a country → internal inessive: Suomessa.',
      },
    },
    {
      id: 'loc-d2', kind: 'mc', sectionId: 'loc-internal',
      data: {
        prompt: "'I am moving to Finland' — which form?",
        options: ['Suomessa', 'Suomesta', 'Suomeen', 'Suomelle'],
        correctIndex: 2,
        explanation: 'Motion into (enclosed) → illative: Suomeen.',
      },
    },
    {
      id: 'loc-d3', kind: 'mc', sectionId: 'loc-external',
      data: {
        prompt: "'The book is on the table' — which form of pöytä?",
        options: ['pöydässä', 'pöydälle', 'pöydällä', 'pöydältä'],
        correctIndex: 2,
        explanation: 'Static on a surface → external adessive: pöydällä.',
      },
    },
    {
      id: 'loc-d4', kind: 'fill', sectionId: 'loc-external',
      data: {
        sentence: 'Laitan kirjan _____ (pöytä).',
        answer: 'pöydälle',
        hint: 'Motion onto a surface → allative: pöytä → pöydälle',
        baseForm: 'pöytä',
      },
    },
    {
      id: 'loc-d5', kind: 'translate', sectionId: 'loc-possession',
      data: { prompt: 'We have a dog.', target: 'Meillä on koira', acceptAlso: ['Meillä on koira.'] },
    },
    {
      id: 'loc-d6', kind: 'spot-error', sectionId: 'loc-internal',
      data: {
        sentence: 'Menen koulusta aamulla.',
        errorWord: 'koulusta',
        correctForm: 'kouluun',
        explanation: "'Menen' (I go to) needs motion-toward → illative: kouluun, not elative koulusta.",
      },
    },
    {
      id: 'loc-d7', kind: 'table', sectionId: 'loc-internal',
      data: {
        headers: ['Base', 'In (-ssa/-ssä)', 'From (-sta/-stä)', 'Into (-Vn/-seen)'],
        rows: [
          { label: 'talo', cells: [{ value: 'talo', blank: false }, { value: 'talossa', blank: true }, { value: 'talosta', blank: true }, { value: 'taloon', blank: true }] },
          { label: 'koulu', cells: [{ value: 'koulu', blank: false }, { value: 'koulussa', blank: true }, { value: 'koulusta', blank: true }, { value: 'kouluun', blank: true }] },
          { label: 'kaupunki', cells: [{ value: 'kaupunki', blank: false }, { value: 'kaupungissa', blank: true }, { value: 'kaupungista', blank: true }, { value: 'kaupunkiin', blank: true }] },
        ],
      },
    },
    {
      id: 'loc-d8', kind: 'table', sectionId: 'loc-external',
      data: {
        headers: ['Base', 'On (-lla/-llä)', 'Off (-lta/-ltä)', 'Onto (-lle)'],
        rows: [
          { label: 'pöytä', cells: [{ value: 'pöytä', blank: false }, { value: 'pöydällä', blank: true }, { value: 'pöydältä', blank: true }, { value: 'pöydälle', blank: true }] },
          { label: 'tori', cells: [{ value: 'tori', blank: false }, { value: 'torilla', blank: true }, { value: 'torilta', blank: true }, { value: 'torille', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Locative cases', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases' },
    { label: 'Wiktionary — Finnish declension', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. COMITATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_COMITATIVE: GrammarTopic = {
  id: 'comitative',
  version: '1.0.0',
  title: 'Comitative (-ine-)',
  subtitle: "'Together with' — always plural, always with possessive suffix.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 10,
  prerequisites: ['genitive'],
  tags: ['cases'],

  overview: {
    theme: "The comitative expresses accompaniment — 'together with his children', 'with her friends'. It is rare, always plural, and always carries a possessive suffix (mine, neen, etc.). In everyday speech, 'kanssa' + genitive is far more common.",
    grammarFocus: [
      'Formation: noun stem + -ine- + possessive suffix',
      'Always plural (even for a single companion, the form is plural)',
      'The possessive suffix is obligatory: -ni, -si, -nsa/-nsä, -mme, -nne',
      'Contrast with kanssa: lapsensa kanssa ≈ lapsineen',
      'Mainly written/formal register',
    ],
    whyItMatters:
      "You will encounter 'lapsineen' and 'perheensä kanssa' in news texts and literature. Recognising the comitative is a B2 reading skill; producing it is rare even for native speakers in speech.",
  },

  sections: [
    {
      id: 'com-formation',
      title: 'Formation',
      question: 'Miten komitatiivi muodostetaan?',
      questionEn: 'How is the comitative formed?',
      grammarPattern:
        'Comitative = noun stem + -ine- + possessive suffix. The stem is the same as the plural stem (replace plural -i- vowel alternation). The possessive suffix agrees with the subject.',
      caseMarker: '-ine- + possessive suffix',
      morphology: {
        stem: 'lapsi',
        ending: '-ineen',
        surface: 'lapsineen',
        breakdown: [
          { token: 'lapsi', role: 'stem', note: "'child' — plural stem: lapse-" },
          { token: 'ine', role: 'ending', note: 'comitative marker -ine-' },
          { token: 'en', role: 'ending', note: "3rd person possessive suffix -en (his/her/their)" },
        ],
      },
      examples: [
        { fi: 'lapsineen', en: 'with his/her/their children (lapsi + -ine- + -en)' },
        { fi: 'perheensä → perheineen', en: 'with his/her family' },
        { fi: 'kirjoineni', en: 'with my books (kirja + -ine- + -ni)' },
        { fi: 'ystävinesi', en: 'with your friends (ystävä + -ine- + -si)' },
      ],
      commonPitfalls: [
        'The comitative is always plural in form, even if only one item accompanies.',
        'The possessive suffix is not optional — bare "-ine-" without a suffix is not standard Finnish.',
        "In everyday speech, use 'kanssa' + genitive instead: 'lapsiensa kanssa' = 'lapsineen'.",
      ],
    },
    {
      id: 'com-use',
      title: 'Use and register',
      question: 'Milloin komitatiivi esiintyy?',
      questionEn: 'When does the comitative appear?',
      grammarPattern:
        "The comitative is mainly found in written Finnish, formal prose, and set expressions. It can replace 'kanssa' but is rarely used in speech.",
      examples: [
        { fi: 'Hän saapui lapsineen.', en: 'He/she arrived with his/her children.' },
        { fi: 'Perhe muutti tavaroينeen uuteen kaupunkiin.', en: 'The family moved with their belongings to a new city.' },
        { fi: 'Presidentti vieraili puolisonsa kanssa / puolisoineen.', en: 'The president visited with his/her spouse.' },
      ],
      specialNote: {
        fi: "'Lapsineen' (komitatiivi) = 'lastensa kanssa' (genetiivi + kanssa). Merkitys on sama.",
        en: "'Lapsineen' (comitative) = 'lastensa kanssa' (genitive + kanssa). Same meaning.",
      },
    },
    {
      id: 'com-possessive-suffixes',
      title: 'Possessive suffixes in the comitative',
      question: 'Minkä persoonan pääte liittyy?',
      questionEn: 'Which possessive suffix attaches?',
      grammarPattern:
        'The possessive suffix agrees with the subject/possessor: -ni (my), -si (your), -(n)sa/-nsä or -en (his/her/their), -mme (our), -nne (your pl.).',
      formula: 'stem + -ine- + {-ni / -si / -nsa/-nsä / -mme / -nne}',
      examples: [
        { fi: 'kirjoineni', en: 'with my books' },
        { fi: 'kirjoinesi', en: 'with your books' },
        { fi: 'kirjoineen / kirjoinensa', en: 'with his/her/their books' },
        { fi: 'kirjoinemme', en: 'with our books' },
        { fi: 'kirjoinenne', en: 'with your (pl.) books' },
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'stem + -ine- + poss.suffix', use: 'Comitative — together with (written/formal)', examples: ['lapsineen', 'kirjoineni', 'ystävinesi'], sectionRef: 'com-formation' },
    { pattern: '≈ gen + kanssa', use: 'Spoken equivalent of comitative', examples: ['lastensa kanssa', 'kirjojeni kanssa'], sectionRef: 'com-use' },
  ],

  drills: [
    {
      id: 'com-d1', kind: 'mc', sectionId: 'com-formation',
      data: {
        prompt: "'She arrived with her children' — which is the comitative form?",
        options: ['lapsensa kanssa', 'lapsineen', 'lapsilleen', 'lapsistaan'],
        correctIndex: 1,
        explanation: 'Comitative: lapsi + -ine- + -en → lapsineen.',
      },
    },
    {
      id: 'com-d2', kind: 'translate', sectionId: 'com-use',
      data: { prompt: 'He arrived with his family.', target: 'Hän saapui perheineen', acceptAlso: ['Hän saapui perheineen.', 'Hän saapui perheensä kanssa', 'Hän saapui perheensä kanssa.'] },
    },
    {
      id: 'com-d3', kind: 'mc', sectionId: 'com-possessive-suffixes',
      data: {
        prompt: "'With my books' — which form?",
        options: ['kirjoineni', 'kirjoinesi', 'kirjoineen', 'kirjoinemme'],
        correctIndex: 0,
        explanation: 'First person possessive suffix -ni: kirja + -ine- + -ni = kirjoineni.',
      },
    },
    {
      id: 'com-d4', kind: 'spot-error', sectionId: 'com-formation',
      data: {
        sentence: 'Hän saapui lapsiaan.',
        errorWord: 'lapsiaan',
        correctForm: 'lapsineen',
        explanation: "'Lapsiaan' is the partitive plural with possessive suffix. 'Together with children' requires the comitative: lapsineen.",
      },
    },
    {
      id: 'com-d5', kind: 'fill', sectionId: 'com-possessive-suffixes',
      data: {
        sentence: 'Presidentti saapui puoliso___. (his/her spouse)',
        answer: 'puolisoineen',
        hint: 'Comitative 3rd person: puoliso + -ine- + -en → puolisoineen',
        baseForm: 'puoliso',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Comitative', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-comitative-case-komitatiivi' },
    { label: 'Wiktionary — Finnish comitative', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. INSTRUCTIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_INSTRUCTIVE: GrammarTopic = {
  id: 'instructive',
  version: '1.0.0',
  title: 'Instructive (-in)',
  subtitle: "'By means of' — fossilised forms: jalan, käsin, kaksin.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 8,
  prerequisites: ['genitive'],
  tags: ['cases'],

  overview: {
    theme: "The instructive is a marginal case in modern Finnish, surviving mainly in fixed adverbial expressions. Its ending is -n added to the plural stem (nominative plural minus -t). It expresses manner, means, or instrument — particularly body-part idioms.",
    grammarFocus: [
      'Formation: plural stem + -n (= plural nominative minus -t, then add -n)',
      'Fossilised forms: jalan (on foot), käsin (by hand), kaksin (as a pair), omin silmin (with one\'s own eyes)',
      'Productive use: some adverbs of manner',
      'Mainly written/formal; in speech usually replaced by other constructions',
    ],
    whyItMatters:
      "You will encounter 'jalan', 'käsin', and 'kaksin' constantly. Knowing they are instructive forms helps you understand the system rather than memorise isolated words.",
  },

  sections: [
    {
      id: 'inst-fixed',
      title: 'Fixed (fossilised) instructive forms',
      question: 'Mitkä ovat yleisimmät instruktiivimuodot?',
      questionEn: 'What are the most common instructive forms?',
      grammarPattern:
        'These fixed expressions are the everyday face of the instructive. Learn them as vocabulary — but recognise the -n pattern.',
      examples: [
        { fi: 'jalan', en: 'on foot (jalka → jalan)' },
        { fi: 'käsin', en: 'by hand (käsi → käsin)' },
        { fi: 'kaksin', en: 'as a pair / just the two of us (kaksi → kaksin)' },
        { fi: 'kolmisin', en: 'as a group of three' },
        { fi: 'omin silmin', en: "with one's own eyes (silmä → silmin)" },
        { fi: 'omin käsin', en: "with one's own hands" },
        { fi: 'päinvastoin', en: 'on the contrary (fossilised)' },
        { fi: 'ensin', en: 'first of all (fossilised, from ensi)' },
      ],
      specialNote: {
        fi: "'Jalan' on instruktiivimuoto, ei genetiivi. Vertaa: 'jalan' (instruktiivi, keino) vs 'jalan' (genetiivi yhdyssanoissa, esim. jalkapallo).",
        en: "'Jalan' as instructive ('on foot') is coincidentally identical to some genitive forms, but the instructive meaning is adverbial.",
      },
    },
    {
      id: 'inst-formation',
      title: 'Formation rule',
      question: 'Miten instruktiivi muodostetaan systemaattisesti?',
      questionEn: 'How is the instructive systematically formed?',
      grammarPattern:
        'Instructive = plural nominative stem + -n (i.e., replace the -t of the plural nominative with -n). The plural stem with its vowel alternations applies.',
      caseMarker: 'plural stem + -n',
      morphology: {
        stem: 'käsi',
        ending: '-n (plural stem)',
        surface: 'käsin',
        breakdown: [
          { token: 'käsi', role: 'stem', note: "'hand' — plural nominative 'kädet'" },
          { token: 'n', role: 'ending', note: "instructive -n (replace -t of 'kädet' → 'käden' → plural stem 'käsi-' → käsin)" },
        ],
      },
      examples: [
        { fi: 'jalat (pl.nom) → jalan (instruct.)', en: "feet → 'jalan' (on foot)" },
        { fi: 'kädet (pl.nom) → käsin (instruct.)', en: "hands → 'käsin' (by hand)" },
        { fi: 'silmät (pl.nom) → silmin (instruct.)', en: "eyes → 'silmin' (with (one's) eyes)" },
        { fi: 'omin voimin', en: "by one's own strength/efforts" },
      ],
      commonPitfalls: [
        'The instructive is not productive for most nouns in modern Finnish. Do not attempt to form it from random nouns in speech.',
        "For new 'by means of' expressions, use the adessive instead: 'koneella' (by machine), 'autolla' (by car).",
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'plural stem + -n', use: 'Instructive — manner/means (mainly fixed forms)', examples: ['jalan', 'käsin', 'kaksin', 'silmin'], sectionRef: 'inst-formation' },
  ],

  drills: [
    {
      id: 'inst-d1', kind: 'mc', sectionId: 'inst-fixed',
      data: {
        prompt: "'On foot' is…",
        options: ['jalalla', 'jalasta', 'jalan', 'jalalle'],
        correctIndex: 2,
        explanation: "'Jalan' is the instructive of jalka — the fixed expression for on foot.",
      },
    },
    {
      id: 'inst-d2', kind: 'mc', sectionId: 'inst-fixed',
      data: {
        prompt: "'By hand' is…",
        options: ['käsin', 'käsillä', 'käsissä', 'käsistä'],
        correctIndex: 0,
        explanation: "'Käsin' is the instructive of käsi — the fixed expression for by hand.",
      },
    },
    {
      id: 'inst-d3', kind: 'translate', sectionId: 'inst-fixed',
      data: { prompt: 'We went on foot.', target: 'Menimme jalan', acceptAlso: ['Menimme jalan.', 'Me menimme jalan', 'Me menimme jalan.'] },
    },
    {
      id: 'inst-d4', kind: 'fill', sectionId: 'inst-fixed',
      data: {
        sentence: 'Näin sen omin _____. (silmä)',
        answer: 'silmin',
        hint: "Instructive of silmä (plural stem + -n): silmät → silmin",
        baseForm: 'silmä',
      },
    },
    {
      id: 'inst-d5', kind: 'mc', sectionId: 'inst-fixed',
      data: {
        prompt: "'Just the two of us / as a pair' is expressed as…",
        options: ['kahdella', 'kahden', 'kaksin', 'kahdessa'],
        correctIndex: 2,
        explanation: "'Kaksin' is the instructive form expressing a pair doing something together.",
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Instructive', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-instructive-case-instruktiivi' },
    { label: 'Wiktionary — Finnish instructive', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 15. ABESSIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ABESSIVE: GrammarTopic = {
  id: 'abessive',
  version: '1.0.0',
  title: 'Abessive (-tta/-ttä)',
  subtitle: "'Without' — rare in nouns, alive in MA-infinitives.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 8,
  prerequisites: ['genitive'],
  tags: ['cases'],

  overview: {
    theme: "The abessive expresses absence or lack — 'without'. On nouns it is rare and formal; in speech 'ilman + partitive' is preferred. However, the abessive is very much alive in the third infinitive (MA-infinitive) construction, where 'tekemättä' means 'without doing'.",
    grammarFocus: [
      'Formation: stem + -tta (back) or -ttä (front)',
      'Noun abessive: rahatta = without money (formal/rare)',
      'Spoken equivalent: ilman rahaa (ilman + partitive)',
      'MA-infinitive abessive: tekemättä = without doing',
      'Negated obligation: jättää tekemättä = to leave undone',
    ],
    whyItMatters:
      "'Jätin sen tekemättä' (I left it undone) — the abessive with the MA-infinitive is common in both written and spoken Finnish, especially in formal contexts.",
  },

  sections: [
    {
      id: 'abes-formation',
      title: 'Formation',
      question: 'Miten abessiivi muodostetaan?',
      questionEn: 'How is the abessive formed?',
      grammarPattern:
        'Abessive = stem + -tta (back vowels) or -ttä (front vowels). The stem is the genitive stem. Consonant gradation produces the weak grade.',
      caseMarker: '-tta / -ttä',
      morphology: {
        stem: 'raha',
        ending: '-tta',
        surface: 'rahatta',
        breakdown: [
          { token: 'raha', role: 'stem', note: "'money'" },
          { token: 'tta', role: 'ending', note: 'abessive -tta (back vowel, "without")' },
        ],
      },
      examples: [
        { fi: 'raha → rahatta', en: 'money → without money' },
        { fi: 'lupa → luvatta', en: 'permission → without permission (p→v gradation)' },
        { fi: 'hattu → hatutta', en: 'hat → without a hat' },
        { fi: 'työ → työttä', en: 'work → without work (front vowel → -ttä)' },
      ],
      commonPitfalls: [
        'The abessive ending -tta/-ttä looks like the partitive of -e words (perhettä, huonetta) — do not confuse them.',
        'In spoken Finnish, noun abessive is replaced by ilman + partitive: "ilman rahaa" instead of "rahatta".',
      ],
    },
    {
      id: 'abes-noun',
      title: "Noun abessive — 'without'",
      question: 'Ilman mitä?',
      questionEn: 'Without what?',
      grammarPattern:
        "The noun abessive is used in formal writing and set expressions to mean 'without [noun]'. In everyday speech, use 'ilman' + partitive.",
      examples: [
        { fi: 'Lähdin rahatta kotiin.', en: 'I went home without money. (formal)' },
        { fi: 'Hän meni luvatta ulos.', en: 'He/she went out without permission.' },
        { fi: 'Syön hatutta.', en: 'I eat without a hat. (contrived — usually ilman hattua in speech)' },
        { fi: 'ilman rahaa', en: 'without money (colloquial/neutral alternative)' },
      ],
      specialNote: {
        fi: "'Rahatta' (abessiivi) = 'ilman rahaa' (ilman + partitiivi). Puhekielessä käytetään jälkimmäistä.",
        en: "'Rahatta' (abessive) = 'ilman rahaa' (ilman + partitive). In speech, the latter is standard.",
      },
    },
    {
      id: 'abes-infinitive',
      title: 'MA-infinitive abessive — without doing',
      question: 'Miten sanotaan "tekemättä"?',
      questionEn: 'How to say "without doing (something)"?',
      grammarPattern:
        'The third infinitive (MA-infinitive) in the abessive expresses doing without an action, or leaving something undone. Form: verb MA-stem + -tta/-ttä.',
      formula: 'MA-stem + -tta/-ttä',
      morphology: {
        stem: 'tekemä',
        ending: '-ttä',
        surface: 'tekemättä',
        breakdown: [
          { token: 'tekemä', role: 'stem', note: "MA-stem of tehdä (to do)" },
          { token: 'ttä', role: 'ending', note: 'abessive -ttä (front vowel)' },
        ],
      },
      examples: [
        { fi: 'Jätin sen tekemättä.', en: 'I left it undone. (without doing it)' },
        { fi: 'Hän lähti sanomatta mitään.', en: 'He/she left without saying anything.' },
        { fi: 'Älä mene nukkumatta!', en: "Don't go to bed without sleeping! (i.e., don't stay up — colloquial)" },
        { fi: 'Tehtävä jäi tekemättä.', en: 'The task was left undone.' },
        { fi: 'En voinut olla nauramatta.', en: 'I could not help laughing. (without laughing = unable to not laugh)' },
      ],
      commonPitfalls: [
        "'Olla + MA-infinitive abessive' in 'en voinut olla nauramatta' is a fixed construction meaning 'could not help doing X'.",
        'The MA-stem is the same as the MA-infinitive inessive minus the -ssa: "tekemässä" → MA-stem "tekemä-".',
      ],
    },
  ],

  grammarIndex: [
    { pattern: '-tta / -ttä (noun)', use: "Without [noun] — formal, rare in speech", examples: ['rahatta', 'luvatta', 'hatutta'], sectionRef: 'abes-noun' },
    { pattern: 'MA-stem + -tta/-ttä', use: 'Without doing — MA-infinitive abessive', examples: ['tekemättä', 'sanomatta', 'syömättä'], sectionRef: 'abes-infinitive' },
    { pattern: 'ilman + partitive', use: 'Spoken/neutral equivalent: without', examples: ['ilman rahaa', 'ilman lupaa'], sectionRef: 'abes-noun' },
  ],

  drills: [
    {
      id: 'abes-d1', kind: 'transform', sectionId: 'abes-formation',
      data: { base: 'raha', instruction: "→ abessive ('without money')", answer: 'rahatta' },
    },
    {
      id: 'abes-d2', kind: 'transform', sectionId: 'abes-infinitive',
      data: { base: 'tehdä (MA: tekemä-)', instruction: "→ MA-infinitive abessive ('without doing')", answer: 'tekemättä' },
    },
    {
      id: 'abes-d3', kind: 'mc', sectionId: 'abes-infinitive',
      data: {
        prompt: "'He left without saying anything' — which form of sanoa?",
        options: ['sanomatta', 'sanomassa', 'sanomasta', 'sanomalle'],
        correctIndex: 0,
        explanation: 'MA-infinitive abessive: sanoa → MA-stem sanoma- + -tta → sanomatta.',
      },
    },
    {
      id: 'abes-d4', kind: 'fill', sectionId: 'abes-infinitive',
      data: {
        sentence: 'Jätin sen _____ (tehdä → MA-stem tekemä-).',
        answer: 'tekemättä',
        hint: 'Left it undone → MA-infinitive abessive: tekemättä',
        baseForm: 'tehdä',
      },
    },
    {
      id: 'abes-d5', kind: 'mc', sectionId: 'abes-noun',
      data: {
        prompt: "The colloquial equivalent of 'rahatta' (without money) is…",
        options: ['rahan kanssa', 'ilman rahaa', 'rahalle', 'rahasta'],
        correctIndex: 1,
        explanation: "'Ilman rahaa' (ilman + partitive) is the everyday spoken equivalent.",
      },
    },
    {
      id: 'abes-d6', kind: 'translate', sectionId: 'abes-infinitive',
      data: { prompt: 'I could not help laughing.', target: 'En voinut olla nauramatta', acceptAlso: ['En voinut olla nauramatta.'] },
    },
    {
      id: 'abes-d7', kind: 'table', sectionId: 'abes-infinitive',
      data: {
        headers: ['Verb', 'MA-stem', 'Abessive (without doing)'],
        rows: [
          { label: 'tehdä', cells: [{ value: 'tehdä', blank: false }, { value: 'tekemä-', blank: false }, { value: 'tekemättä', blank: true }] },
          { label: 'sanoa', cells: [{ value: 'sanoa', blank: false }, { value: 'sanoma-', blank: false }, { value: 'sanomatta', blank: true }] },
          { label: 'syödä', cells: [{ value: 'syödä', blank: false }, { value: 'syömä-', blank: false }, { value: 'syömättä', blank: true }] },
          { label: 'nukkua', cells: [{ value: 'nukkua', blank: false }, { value: 'nukkuma-', blank: false }, { value: 'nukkumatta', blank: true }] },
        ],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Abessive', url: 'https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-abessive-case-abessiivi' },
    { label: 'Wiktionary — Finnish abessive', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ARRAY
// ─────────────────────────────────────────────────────────────────────────────
export const CASE_TOPICS: GrammarTopic[] = [
  TOPIC_NOMINATIVE, TOPIC_GENITIVE, TOPIC_ACCUSATIVE,
  TOPIC_INESSIVE, TOPIC_ELATIVE, TOPIC_ILLATIVE,
  TOPIC_ADESSIVE, TOPIC_ABLATIVE, TOPIC_ALLATIVE,
  TOPIC_ESSIVE, TOPIC_TRANSLATIVE, TOPIC_LOCATIVE_OVERVIEW,
  TOPIC_COMITATIVE, TOPIC_INSTRUCTIVE, TOPIC_ABESSIVE,
];
