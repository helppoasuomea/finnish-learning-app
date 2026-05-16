import type { GrammarTopic } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// 1. WORD ORDER
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_WORD_ORDER: GrammarTopic = {
  id: 'word-order',
  version: '1.0.0',
  title: 'Word order',
  subtitle: 'SVO, topic-fronting, and existential sentences.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: [],
  tags: ['syntax'],

  overview: {
    theme:
      'Finnish has a default Subject–Verb–Object order, but word order is far more flexible than in English. Moving a word to the front of a sentence signals that it is the topic or focus. Existential sentences follow a special V–S pattern.',
    grammarFocus: [
      'Default order: Subject – Verb – Object (SVO)',
      'Topic-fronting: moving a non-subject to clause-initial position for contrast or theme',
      'Existential sentences: location – verb – subject (e.g. On auto.)',
      'Question vs. statement word order',
    ],
    whyItMatters:
      'Even when every word is correctly conjugated, wrong word order sounds unnatural or changes meaning. Knowing when to front a time expression, an object, or a locative phrase is essential for fluent Finnish.',
  },

  sections: [
    {
      id: 'wo-svo',
      title: 'Basic SVO order',
      question: 'Mikä on suomen kielen peruslausejärjestys?',
      questionEn: 'What is the default sentence order in Finnish?',
      grammarPattern:
        'Finnish defaults to Subject–Verb–Object, just like English. The subject is in the nominative, the verb agrees with it, and the object follows.',
      formula: 'Subject (nominative) + Verb + Object',
      examples: [
        { fi: 'Pekka lukee kirjaa.', en: 'Pekka is reading a book.' },
        { fi: 'Minä ostan leivän.', en: 'I am buying (the) bread.' },
        { fi: 'Koira syö lihaa.', en: 'The dog is eating meat.' },
        { fi: 'Lapset katsovat televisiota.', en: 'The children are watching television.' },
      ],
      commonPitfalls: [
        'Finnish word order is more flexible than English — moving words does not make the sentence ungrammatical, but it changes pragmatic focus.',
        'The object case (partitive vs. accusative) is determined by the verb and aspect, not by its position.',
      ],
    },
    {
      id: 'wo-topic-front',
      title: 'Topic-fronting for emphasis',
      question: 'Miten lauseen painotusta muutetaan?',
      questionEn: 'How do I shift emphasis in a sentence?',
      grammarPattern:
        'Any constituent (time adverbial, object, location) can move to the front of the clause. The verb still agrees with the grammatical subject, but the fronted element becomes the discourse topic.',
      formula: 'Fronted element + Verb + Subject + (rest)',
      examples: [
        { fi: 'Eilen minä ostin leivän.', en: 'Yesterday I bought (the) bread. (Eilen = topic)' },
        { fi: 'Tänään on kylmä.', en: "Today it is cold. (Tänään = topic)" },
        { fi: 'Kirjan Minna luki, ei Pekka.', en: 'The book Minna read, not Pekka. (Kirjan = contrastive topic)' },
        { fi: 'Meille tulee vieraita.', en: 'We are having guests. (location fronted in existential-like pattern)' },
      ],
      commonPitfalls: [
        'Fronting an element does not change the case of the subject — it stays in the nominative.',
        'Contrastive fronting (as in "Kirjan Minna luki") requires the object before the subject, but the verb still comes second.',
      ],
    },
    {
      id: 'wo-existential',
      title: 'Existential sentences',
      question: 'Miten "on auto" eroaa "auto on"-rakenteesta?',
      questionEn: 'What is special about existential sentences?',
      grammarPattern:
        'Existential sentences express existence or presence. They follow the pattern: Location – Verb – Subject. The subject is typically in the partitive (indefinite) and the verb is always in the 3rd person singular.',
      formula: 'Location/Adverb + on/oli + Subject (partitive or nominative)',
      examples: [
        { fi: 'Pöydällä on kirja.', en: 'There is a book on the table.' },
        { fi: 'Kadulla on autoja.', en: 'There are cars on the street.' },
        { fi: 'Meillä on koira.', en: 'We have a dog. (lit. at us there is a dog)' },
        { fi: 'Ovella on joku.', en: 'There is someone at the door.' },
        { fi: 'Kaupassa ei ole maitoa.', en: 'There is no milk in the shop.' },
      ],
      commonPitfalls: [
        'The verb is always 3rd person singular (on, oli), even when the subject is plural: "Kadulla on autoja", not "ovat autoja".',
        'An indefinite (unknown) subject takes the partitive: "kirjaa", "autoja". A definite subject takes the nominative: "Kirja on pöydällä."',
      ],
    },
    {
      id: 'wo-question-vs-statement',
      title: 'Questions vs. statements',
      question: 'Miten kysymys eroaa väitelauseesta sanajärjestykseltään?',
      questionEn: 'Does word order change in questions?',
      grammarPattern:
        'Yes/no questions are formed by adding -ko/-kö to the verb and placing it first. Wh-questions put the question word first, followed by the verb. Declarative word order is otherwise preserved.',
      examples: [
        { fi: 'Pekka lukee. → Lukeeko Pekka?', en: 'Pekka is reading. → Is Pekka reading?' },
        { fi: 'Sinä tulet. → Tuletko sinä?', en: 'You are coming. → Are you coming?' },
        { fi: 'Missä kirja on?', en: 'Where is the book?' },
        { fi: 'Milloin juna lähtee?', en: 'When does the train leave?' },
      ],
      commonPitfalls: [
        'In yes/no questions the verb (with -ko/-kö) must come first: "Onko sinulla aikaa?" not "Sinulla onko aikaa?"',
        'Wh-question words (missä, milloin, kuka, miksi) always begin the question.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'S + V + O', use: 'Default declarative order', examples: ['Pekka lukee kirjaa.'], sectionRef: 'wo-svo' },
    { pattern: 'X + V + S + …', use: 'Topic-fronting (X is the discourse theme)', examples: ['Eilen minä ostin leivän.'], sectionRef: 'wo-topic-front' },
    { pattern: 'Loc + on + S(partitive)', use: 'Existential sentence', examples: ['Pöydällä on kirja.'], sectionRef: 'wo-existential' },
    { pattern: 'V-ko/-kö + S + ?', use: 'Yes/no question', examples: ['Lukeeko Pekka?'], sectionRef: 'wo-question-vs-statement' },
    { pattern: 'Wh + V + S + ?', use: 'Wh-question', examples: ['Missä kirja on?'], sectionRef: 'wo-question-vs-statement' },
  ],

  drills: [
    {
      id: 'wo-d1', kind: 'builder', sectionId: 'wo-svo',
      data: {
        tiles: ['kirjaa', 'Pekka', 'lukee'],
        correctOrder: [1, 2, 0],
        translation: 'Pekka is reading a book.',
      },
    },
    {
      id: 'wo-d2', kind: 'builder', sectionId: 'wo-topic-front',
      data: {
        tiles: ['minä', 'Eilen', 'leivän', 'ostin'],
        correctOrder: [1, 3, 0, 2],
        translation: 'Yesterday I bought (the) bread.',
      },
    },
    {
      id: 'wo-d3', kind: 'fill', sectionId: 'wo-existential',
      data: {
        sentence: 'Pöydällä _____ kirja.',
        answer: 'on',
        hint: 'Existential sentences always use 3rd person singular of olla.',
      },
    },
    {
      id: 'wo-d4', kind: 'mc', sectionId: 'wo-existential',
      data: {
        prompt: 'Which sentence is a correct existential sentence meaning "There are cars on the street"?',
        options: [
          'Autot ovat kadulla.',
          'Kadulla on autoja.',
          'Kadulla ovat autoja.',
          'Autoja on kadut.',
        ],
        correctIndex: 1,
        explanation: 'Existential: Location + on (always 3sg) + subject in partitive: Kadulla on autoja.',
      },
    },
    {
      id: 'wo-d5', kind: 'transform', sectionId: 'wo-question-vs-statement',
      data: {
        base: 'Pekka lukee kirjaa.',
        instruction: '→ yes/no question',
        answer: 'Lukeeko Pekka kirjaa?',
      },
    },
    {
      id: 'wo-d6', kind: 'spot-error', sectionId: 'wo-question-vs-statement',
      data: {
        sentence: 'Sinulla onko aikaa?',
        errorWord: 'Sinulla onko',
        correctForm: 'Onko sinulla',
        explanation: 'In yes/no questions the verb with -ko/-kö must come first.',
      },
    },
    {
      id: 'wo-d7', kind: 'translate', sectionId: 'wo-existential',
      data: {
        prompt: 'There is no milk in the shop.',
        target: 'Kaupassa ei ole maitoa.',
        acceptAlso: ['Kaupassa ei ole maitoa'],
      },
    },
    {
      id: 'wo-d8', kind: 'mc', sectionId: 'wo-topic-front',
      data: {
        prompt: 'You want to emphasise "today" in "Tänään on kylmä." What position does "tänään" take?',
        options: ['End of sentence', 'Middle of sentence', 'Beginning of sentence', 'After the verb'],
        correctIndex: 2,
        explanation: 'Topic/focus elements are fronted to the beginning of the sentence in Finnish.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Word order', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/finnish-word-order' },
    { label: 'Uusi kielemme — Existential sentences', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/existential-sentences' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. QUESTIONS
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_QUESTIONS: GrammarTopic = {
  id: 'questions',
  version: '1.0.0',
  title: 'Questions',
  subtitle: 'Wh-words, -ko/-kö, and question word order.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: ['present-tense'],
  tags: ['syntax'],

  overview: {
    theme:
      'Finnish forms two kinds of questions: wh-questions using interrogative words (mikä, kuka, missä…) and yes/no questions using the -ko/-kö clitic on the verb. Both have characteristic word orders.',
    grammarFocus: [
      'Interrogative pronouns: mikä (what), kuka (who)',
      'Interrogative adverbs: missä (where), milloin (when), miksi (why), miten/kuinka (how)',
      '-ko/-kö clitic on the first constituent for yes/no questions',
      'Question word order: Wh-word first, then verb-subject inversion',
    ],
    whyItMatters:
      "Asking questions is the cornerstone of conversation. Learning the wh-words and the -ko/-kö system will unlock almost every interaction from a beginner's first day.",
  },

  sections: [
    {
      id: 'qst-wh-words',
      title: 'Wh-question words',
      question: 'Mitä kysymyssanoja suomessa on?',
      questionEn: 'What are the Finnish question words?',
      grammarPattern:
        'Finnish question words all begin with m- or k- and are placed at the very beginning of the sentence. They agree in case with their role in the clause.',
      examples: [
        { fi: 'Mikä tämä on?', en: 'What is this?' },
        { fi: 'Kuka hän on?', en: 'Who is he/she?' },
        { fi: 'Missä asut?', en: 'Where do you live?' },
        { fi: 'Milloin juna lähtee?', en: 'When does the train leave?' },
        { fi: 'Miksi sinä itket?', en: 'Why are you crying?' },
        { fi: 'Miten tämä toimii?', en: 'How does this work?' },
        { fi: 'Kuinka paljon se maksaa?', en: 'How much does it cost?' },
      ],
      commonPitfalls: [
        '"Mikä" refers to things and asks about identity; "kuka" refers to people. Do not confuse them.',
        '"Missä" = static location; "mihin" = direction towards; "mistä" = direction from.',
      ],
    },
    {
      id: 'qst-case-agreement',
      title: 'Wh-words in different cases',
      question: 'Taivutuuko kysymyssana?',
      questionEn: 'Do question words inflect for case?',
      grammarPattern:
        '"Mikä" and "kuka" inflect in all cases, matching the grammatical role they play in the clause. "Missä/mistä/mihin" are already locative forms of "mikä".',
      formula: 'mikä → minkä (gen.), mitä (part.), missä (iness.), mistä (elat.), mihin (illat.)',
      examples: [
        { fi: 'Minkä ostat? (gen./acc.)', en: 'What are you buying?' },
        { fi: 'Mitä sinä ajattelet? (partitive)', en: 'What are you thinking?' },
        { fi: 'Mistä tulet? (elative)', en: 'Where are you coming from?' },
        { fi: 'Mihin menet? (illative)', en: 'Where are you going?' },
        { fi: 'Kenen kirja tämä on? (genitive of kuka)', en: 'Whose book is this?' },
      ],
      commonPitfalls: [
        'Many learners use only "mikä" and "missä". Remember to use the correct case form based on the verb or postposition that governs it.',
      ],
    },
    {
      id: 'qst-yesno',
      title: 'Yes/no questions with -ko/-kö',
      question: 'Miten kysytään kyllä/ei-kysymys?',
      questionEn: 'How do I form a yes/no question?',
      grammarPattern:
        'Add -ko (after back vowels a, o, u) or -kö (after front vowels ä, ö, y) to the verb and place it first. The personal pronoun (subject) follows.',
      formula: 'Verb + -ko/-kö + (Subject) + (rest)',
      examples: [
        { fi: 'Luetko sinä kirjaa?', en: 'Are you reading a book?' },
        { fi: 'Onko hän kotona?', en: 'Is he/she at home?' },
        { fi: 'Tuletteko te huomenna?', en: 'Are you (pl.) coming tomorrow?' },
        { fi: 'Söikö lapsi?', en: 'Did the child eat?' },
      ],
      commonPitfalls: [
        'Vowel harmony: use -ko after back-vowel verb forms (lukee → Lukeeko), -kö after front-vowel forms (syö → Syökö).',
        'The subject pronoun is often omitted in colloquial speech: "Tuletko?" instead of "Tuletko sinä?".',
      ],
    },
    {
      id: 'qst-word-order',
      title: 'Question word order',
      question: 'Muuttuuko sanajärjestys kysymyslauseessa?',
      questionEn: 'Does word order change in questions?',
      grammarPattern:
        'In wh-questions the interrogative word is first, followed immediately by the verb, then the subject. In yes/no questions the -ko/-kö verb is first. This is a mild verb-second (V2) tendency.',
      examples: [
        { fi: 'Miksi sinä itket? (Wh + V + S)', en: 'Why are you crying?' },
        { fi: 'Missä kirja on? (Wh + S/V)', en: 'Where is the book?' },
        { fi: 'Lukeeko Pekka? (V-ko + S)', en: 'Is Pekka reading?' },
        { fi: 'Milloin lähdet? (Wh + V, subject dropped)', en: 'When are you leaving?' },
      ],
      commonPitfalls: [
        'The question word cannot appear mid-sentence as in some languages: "Sinä asut missä?" is very informal/echo question style.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'mikä / minkä / mitä', use: 'What (thing) — nominative / genitive / partitive', sectionRef: 'qst-case-agreement' },
    { pattern: 'kuka / kenen / ketä', use: 'Who (person) — nominative / genitive / partitive', sectionRef: 'qst-case-agreement' },
    { pattern: 'missä / mistä / mihin', use: 'Where — location / source / destination', sectionRef: 'qst-wh-words' },
    { pattern: 'milloin', use: 'When', sectionRef: 'qst-wh-words' },
    { pattern: 'miksi', use: 'Why', sectionRef: 'qst-wh-words' },
    { pattern: 'miten / kuinka', use: 'How', sectionRef: 'qst-wh-words' },
    { pattern: 'V + -ko/-kö', use: 'Yes/no question clitic', examples: ['Lukeeko?', 'Onko?'], sectionRef: 'qst-yesno' },
  ],

  drills: [
    {
      id: 'qst-d1', kind: 'fill', sectionId: 'qst-wh-words',
      data: {
        sentence: '_____ sinä asut? (Where)',
        answer: 'Missä',
        hint: 'Static location = missä (inessive of mikä)',
      },
    },
    {
      id: 'qst-d2', kind: 'mc', sectionId: 'qst-wh-words',
      data: {
        prompt: 'Which question word asks "Why?"',
        options: ['Missä', 'Milloin', 'Miksi', 'Miten'],
        correctIndex: 2,
        explanation: 'Miksi = why. Missä = where. Milloin = when. Miten = how.',
      },
    },
    {
      id: 'qst-d3', kind: 'transform', sectionId: 'qst-yesno',
      data: {
        base: 'Sinä luet kirjaa.',
        instruction: '→ yes/no question',
        answer: 'Luetko sinä kirjaa?',
      },
    },
    {
      id: 'qst-d4', kind: 'transform', sectionId: 'qst-yesno',
      data: {
        base: 'Hän syö lounasta.',
        instruction: '→ yes/no question',
        answer: 'Syökö hän lounasta?',
      },
    },
    {
      id: 'qst-d5', kind: 'fill', sectionId: 'qst-case-agreement',
      data: {
        sentence: '_____ sinä ajattelet? (What — partitive)',
        answer: 'Mitä',
        hint: 'Partitive of mikä = mitä',
      },
    },
    {
      id: 'qst-d6', kind: 'translate', sectionId: 'qst-wh-words',
      data: {
        prompt: 'Where are you coming from?',
        target: 'Mistä tulet?',
        acceptAlso: ['Mistä sinä tulet?'],
      },
    },
    {
      id: 'qst-d7', kind: 'mc', sectionId: 'qst-case-agreement',
      data: {
        prompt: 'How do you ask "Whose book is this?" in Finnish?',
        options: ['Kuka kirja tämä on?', 'Mikä kirja tämä on?', 'Kenen kirja tämä on?', 'Ketä kirja tämä on?'],
        correctIndex: 2,
        explanation: 'Kenen is the genitive of kuka, used for possession: kenen = whose.',
      },
    },
    {
      id: 'qst-d8', kind: 'builder', sectionId: 'qst-word-order',
      data: {
        tiles: ['sinä', 'Miksi', 'itket'],
        correctOrder: [1, 2, 0],
        translation: 'Why are you crying?',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Question words', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/finnish-question-words' },
    { label: 'Uusi kielemme — Yes/no questions', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/yes-no-questions-in-finnish' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. QUESTION PARTICLE -KO/-KÖ
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_QUESTION_PARTICLE: GrammarTopic = {
  id: 'question-particle',
  version: '1.0.0',
  title: 'Question particle -ko/-kö',
  subtitle: 'Clitic that turns any word into a yes/no question or focus.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: ['questions'],
  tags: ['syntax'],

  overview: {
    theme:
      'The clitic -ko/-kö is a versatile particle that attaches to the first constituent of a clause to form a yes/no question. It can attach to the verb, a noun, an adverb — whatever the speaker wants to put in focus.',
    grammarFocus: [
      '-ko after back vowels (a, o, u); -kö after front vowels (ä, ö, y)',
      'Attaches to the verb in neutral yes/no questions',
      'Attaches to any word to make it the questioned focus',
      'Negative questions: eikö, etkö, eikö niin',
    ],
    whyItMatters:
      'Because -ko/-kö can attach to any word and that word moves to the front, this single clitic covers a huge range of questions and rhetorical moves that require complex constructions in other languages.',
  },

  sections: [
    {
      id: 'qp-verb',
      title: '-ko/-kö on the verb',
      question: 'Mihin -ko/-kö liitetään tavallisesti?',
      questionEn: 'Where does -ko/-kö typically attach?',
      grammarPattern:
        'In a neutral yes/no question, -ko/-kö is added to the conjugated verb which then moves to the front. Vowel harmony determines the allomorph.',
      formula: 'Verb-ko/-kö + (Subject) + …',
      examples: [
        { fi: 'Lukeeko sinä kirjaa?', en: 'Are you reading a book?' },
        { fi: 'Onko hän kotona?', en: 'Is she at home?' },
        { fi: 'Tuliko hän eilen?', en: 'Did he come yesterday?' },
        { fi: 'Söivätkö lapset?', en: 'Did the children eat?' },
      ],
      commonPitfalls: [
        'Vowel harmony: Lukeeko (e is front) but Onko (o is back).',
        '-ko/-kö attaches directly to the verb form including any personal endings: tulivat → tulivatko.',
      ],
    },
    {
      id: 'qp-any-word',
      title: '-ko/-kö on a non-verb word',
      question: 'Voiko -ko/-kö liittyä muuhun kuin verbiin?',
      questionEn: 'Can -ko/-kö attach to words other than the verb?',
      grammarPattern:
        'Yes. By fronting a non-verb element and attaching -ko/-kö to it, the speaker signals that that element is the focus of the question. The verb follows in normal order.',
      formula: 'Focused-word-ko/-kö + Verb + …',
      examples: [
        { fi: 'Pekallako on auto? (→ Is it Pekka who has a car?)', en: 'Is it Pekka who has a car?' },
        { fi: 'Tänäänkö hän tulee? (→ Is it today that he is coming?)', en: 'Is it today that he is coming?' },
        { fi: 'Sinäkö söit kakkuni? (→ Was it YOU who ate my cake?)', en: 'Was it you who ate my cake?' },
        { fi: 'Kouluunko hän menee?', en: 'Is it to school that he is going?' },
      ],
      commonPitfalls: [
        'The focused word must come first; the verb stays in its regular position after it.',
        'The case ending on the noun comes before -ko/-kö: Pekalla + ko = Pekallako.',
      ],
    },
    {
      id: 'qp-negative',
      title: 'Negative questions: eikö, etkö, emme…ko',
      question: 'Miten muodostetaan kielteinen kysymys?',
      questionEn: 'How are negative questions formed?',
      grammarPattern:
        'Attach -ko/-kö to the negative auxiliary (ei, et, emme, ette, eivät). The main verb appears in the connective form (same as used after ei). These often function as tag questions or rhetorical questions.',
      formula: 'Ei-ko/-kö + subject + connective verb',
      examples: [
        { fi: 'Eikö hän tule? (Isn\'t he coming?)', en: 'Isn\'t he coming?' },
        { fi: 'Etkö sinä muista? (Don\'t you remember?)', en: "Don't you remember?" },
        { fi: 'Eikö niin? (Isn\'t that so?)', en: "Isn't that so? / Right?" },
        { fi: 'Emmekö me sovittu tästä? (Didn\'t we agree on this?)', en: "Didn't we agree on this?" },
      ],
      commonPitfalls: [
        '"Eikö niin?" is a common tag question meaning "isn\'t that right?" — learn it as a fixed phrase.',
        'The main verb in negative questions is in the connective (negative) form, not the full conjugated form.',
      ],
    },
    {
      id: 'qp-vowel-harmony',
      title: 'Vowel harmony: -ko vs. -kö',
      question: 'Milloin käytetään -ko ja milloin -kö?',
      questionEn: 'When to use -ko and when -kö?',
      grammarPattern:
        'Vowel harmony governs the choice. If the word ends in or contains back vowels (a, o, u) use -ko. If it ends in or contains front vowels (ä, ö, y) use -kö.',
      formula: '…back vowel → -ko | …front vowel → -kö',
      examples: [
        { fi: 'onko (on → back vowel o)', en: 'Is there? / Is it?' },
        { fi: 'lukeeko (lukee → front vowel e)', en: 'Is (someone) reading?' },
        { fi: 'syökö (syö → front vowel ö)', en: 'Is (someone) eating?' },
        { fi: 'tulivatko (tulivat → back vowel a)', en: 'Did they come?' },
        { fi: 'menetkö (menet → front vowel e)', en: 'Are you going?' },
      ],
      commonPitfalls: [
        'The vowel harmony is determined by the last vowel of the base word, not by "i" or "e" which are neutral.',
        '"e" is a neutral vowel — look at the full word to decide: sanoe- has back-vowel root sano- → sanoko? No: sanooko? Actually sanotko is irregular — check individual forms.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'V-ko/-kö', use: 'Neutral yes/no question', examples: ['Lukeeko?', 'Onko?'], sectionRef: 'qp-verb' },
    { pattern: 'Word-ko/-kö + V', use: 'Focus question (is it X that…?)', examples: ['Sinäkö?', 'Tänäänkö?'], sectionRef: 'qp-any-word' },
    { pattern: 'Eikö / etkö / emmekö', use: 'Negative question / tag question', examples: ['Eikö niin?', 'Etkö muista?'], sectionRef: 'qp-negative' },
  ],

  drills: [
    {
      id: 'qp-d1', kind: 'transform', sectionId: 'qp-verb',
      data: {
        base: 'Hän tulee huomenna.',
        instruction: '→ yes/no question (attach -ko/-kö to verb)',
        answer: 'Tuleeko hän huomenna?',
      },
    },
    {
      id: 'qp-d2', kind: 'mc', sectionId: 'qp-vowel-harmony',
      data: {
        prompt: 'The correct question form of "sinä menet" is…',
        options: ['Menetkö sinä?', 'Menetko sinä?', 'Sinäkö menet?', 'Menekö sinä?'],
        correctIndex: 0,
        explanation: 'menet ends in front vowel e → -kö: menet + kö = menetkö.',
      },
    },
    {
      id: 'qp-d3', kind: 'fill', sectionId: 'qp-negative',
      data: {
        sentence: '_____ hän tule? (Isn\'t he coming?)',
        answer: 'Eikö',
        hint: 'Negative 3sg ei + kö = Eikö',
      },
    },
    {
      id: 'qp-d4', kind: 'translate', sectionId: 'qp-any-word',
      data: {
        prompt: 'Was it YOU who ate my cake? (emphasise "you")',
        target: 'Sinäkö söit kakkuni?',
        acceptAlso: ['Sinäkö söit kakkuni'],
      },
    },
    {
      id: 'qp-d5', kind: 'mc', sectionId: 'qp-any-word',
      data: {
        prompt: 'What does "Tänäänkö hän tulee?" mean?',
        options: [
          'Did he come today?',
          'Is it today that he is coming?',
          'He came today.',
          'Why is he coming today?',
        ],
        correctIndex: 1,
        explanation: '-kö on tänään makes it the focus: "Is it TODAY that he is coming?"',
      },
    },
    {
      id: 'qp-d6', kind: 'spot-error', sectionId: 'qp-verb',
      data: {
        sentence: 'Onkö sinulla aikaa?',
        errorWord: 'Onkö',
        correctForm: 'Onko',
        explanation: '"on" contains back vowel o → use -ko, not -kö: onko.',
      },
    },
    {
      id: 'qp-d7', kind: 'builder', sectionId: 'qp-negative',
      data: {
        tiles: ['muista', 'Etkö', 'sinä'],
        correctOrder: [1, 2, 0],
        translation: "Don't you remember?",
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — -ko/-kö question particle', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/the-ko-ko-question-particle' },
    { label: 'Uusi kielemme — Negative questions', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/negative-questions' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. SUBORDINATE CLAUSES
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_SUBORDINATE_CLAUSES: GrammarTopic = {
  id: 'subordinate-clauses',
  version: '1.0.0',
  title: 'Subordinate clauses',
  subtitle: 'että, koska, kun, jos, vaikka — connecting ideas.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 15,
  prerequisites: ['present-tense'],
  tags: ['syntax'],

  overview: {
    theme:
      'Finnish subordinate clauses are introduced by conjunctions and follow standard S–V–O order. Unlike some languages, there is no special subjunctive mood — the indicative is used throughout.',
    grammarFocus: [
      'että (that) — complement clauses after verbs of saying/thinking',
      'koska (because) — causal clauses',
      'kun (when/since/as) — temporal and causal clauses',
      'jos (if) — conditional clauses',
      'vaikka (although/even though) — concessive clauses',
    ],
    whyItMatters:
      'Without subordinating conjunctions, communication is limited to isolated statements. Mastering even two or three of these conjunctions immediately allows expressing reasons, conditions, and complex thoughts.',
  },

  sections: [
    {
      id: 'sub-etta',
      title: 'että — "that" clauses',
      question: 'Miten ilmaistaan "Luulen, että…"?',
      questionEn: 'How do I say "I think that…"?',
      grammarPattern:
        'The conjunction "että" introduces a complement clause after verbs of thinking, saying, knowing, or feeling. The subordinate clause has full finite verb agreement.',
      formula: 'Main clause + että + Subject + Verb + …',
      examples: [
        { fi: 'Luulen, että hän on kotona.', en: 'I think (that) he is at home.' },
        { fi: 'Tiedän, että sinä puhut suomea.', en: 'I know that you speak Finnish.' },
        { fi: 'Hän sanoo, että ruoka on hyvää.', en: 'He says that the food is good.' },
        { fi: 'Toivon, että tulet huomenna.', en: 'I hope that you come tomorrow.' },
      ],
      commonPitfalls: [
        'Unlike English, the "että" cannot be omitted in formal Finnish: "Luulen, että hän tulee" not "Luulen hän tulee".',
        'A comma before "että" is normal in written Finnish.',
      ],
    },
    {
      id: 'sub-koska',
      title: 'koska — because',
      question: 'Miten ilmaistaan syy?',
      questionEn: 'How do I give a reason using "because"?',
      grammarPattern:
        '"Koska" introduces a causal clause. It can begin a sentence (giving the reason first) or follow the main clause.',
      formula: 'Main clause + koska + reason clause  –OR–  Koska + reason + , + main clause',
      examples: [
        { fi: 'En tule, koska olen sairas.', en: "I'm not coming because I am sick." },
        { fi: 'Koska sataa, jäämme kotiin.', en: 'Because it is raining, we are staying home.' },
        { fi: 'Hän on väsynyt, koska hän ei nukkunut.', en: 'He is tired because he did not sleep.' },
        { fi: 'Rakastan kahvia, koska se maistuu hyvältä.', en: 'I love coffee because it tastes good.' },
      ],
      commonPitfalls: [
        '"Koska" is causal (because). Do not confuse with "milloin" (when). "Koska" never means "when" in standard Finnish.',
      ],
    },
    {
      id: 'sub-kun',
      title: 'kun — when / since / as',
      question: 'Mitä "kun" tarkoittaa?',
      questionEn: 'What does "kun" mean?',
      grammarPattern:
        '"Kun" is multifunctional: it expresses time (when/once), cause (since/as), or condition. Context disambiguates. In temporal clauses, tense in the subordinate clause matches the time reference of the main clause.',
      examples: [
        { fi: 'Soitan sinulle, kun tulen kotiin.', en: 'I will call you when I get home.' },
        { fi: 'Kun olin lapsi, asuin Tampereella.', en: 'When I was a child, I lived in Tampere.' },
        { fi: 'Kun et tiedä, kysy!', en: "Since/if you don't know, ask!" },
        { fi: 'Hän laulaa, kun on iloinen.', en: 'She sings when she is happy.' },
      ],
      commonPitfalls: [
        'In temporal clauses about the future, Finnish uses the present tense in the "kun" clause (not a future tense): "kun tulen" not "kun tulen olemaan".',
      ],
    },
    {
      id: 'sub-jos',
      title: 'jos — if',
      question: 'Miten muodostetaan ehtolause?',
      questionEn: 'How do I form a conditional clause?',
      grammarPattern:
        '"Jos" introduces a conditional clause. In open (real) conditions both clauses use indicative. In counterfactual conditions the conditional mood (-isi-) is used in both clauses.',
      examples: [
        { fi: 'Jos sataa, otan sateenvarjon.', en: 'If it rains, I will take an umbrella.' },
        { fi: 'Jos sinulla on aikaa, voimme tavata.', en: 'If you have time, we can meet.' },
        { fi: 'Jos olisin rikas, ostaisin talon.', en: 'If I were rich, I would buy a house.' },
        { fi: 'Menen, jos sinäkin tulet.', en: "I'll go if you come too." },
      ],
      commonPitfalls: [
        'In counterfactual "jos"-clauses, the conditional (-isi-) is used in both the jos-clause and the main clause.',
        '"Jos" never contracts or drops like English "if" — it is always present.',
      ],
    },
    {
      id: 'sub-vaikka',
      title: 'vaikka — although / even though',
      question: 'Miten ilmaistaan vastakohta "vaikka"-sanalla?',
      questionEn: 'How do I express concession with "although"?',
      grammarPattern:
        '"Vaikka" introduces a concessive clause. The main clause contrasts with or overrides the expectation set by the "vaikka" clause.',
      examples: [
        { fi: 'Tulen, vaikka olen väsynyt.', en: "I'm coming even though I'm tired." },
        { fi: 'Vaikka sataa, lähdemme kävelylle.', en: 'Although it is raining, we are going for a walk.' },
        { fi: 'Hän on iloinen, vaikka hänellä on vaikeuksia.', en: 'He is happy even though he has difficulties.' },
        { fi: 'Vaikka en pidä siitä, teen sen.', en: "Even though I don't like it, I'll do it." },
      ],
      commonPitfalls: [
        '"Vaikka" always implies contrast or unexpectedness — the main clause result is surprising given the concession.',
        'Do not confuse with "kun" (when) or "jos" (if).',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'V + että + S + V', use: 'Complement clause (that)', examples: ['Luulen, että hän tulee.'], sectionRef: 'sub-etta' },
    { pattern: 'V + koska + S + V', use: 'Causal clause (because)', examples: ['En tule, koska olen sairas.'], sectionRef: 'sub-koska' },
    { pattern: 'kun + S + V', use: 'Temporal clause (when) or causal (since)', examples: ['Soitan, kun tulen kotiin.'], sectionRef: 'sub-kun' },
    { pattern: 'jos + S + V', use: 'Conditional clause (if)', examples: ['Jos sataa, jäämme kotiin.'], sectionRef: 'sub-jos' },
    { pattern: 'vaikka + S + V', use: 'Concessive clause (although)', examples: ['Tulen, vaikka olen väsynyt.'], sectionRef: 'sub-vaikka' },
  ],

  drills: [
    {
      id: 'sub-d1', kind: 'fill', sectionId: 'sub-etta',
      data: {
        sentence: 'Luulen, _____ hän on kotona.',
        answer: 'että',
        hint: 'Complement clause conjunction = että',
      },
    },
    {
      id: 'sub-d2', kind: 'mc', sectionId: 'sub-koska',
      data: {
        prompt: 'Choose the correct conjunction: "En tule, _____ olen sairas."',
        options: ['kun', 'että', 'koska', 'jos'],
        correctIndex: 2,
        explanation: 'Koska = because — it introduces the reason.',
      },
    },
    {
      id: 'sub-d3', kind: 'translate', sectionId: 'sub-kun',
      data: {
        prompt: 'I will call you when I get home.',
        target: 'Soitan sinulle, kun tulen kotiin.',
        acceptAlso: ['Soitan sinulle kun tulen kotiin.'],
      },
    },
    {
      id: 'sub-d4', kind: 'fill', sectionId: 'sub-jos',
      data: {
        sentence: '_____ sataa, otan sateenvarjon.',
        answer: 'Jos',
        hint: 'Conditional clause = jos',
      },
    },
    {
      id: 'sub-d5', kind: 'translate', sectionId: 'sub-vaikka',
      data: {
        prompt: "I'm coming even though I'm tired.",
        target: 'Tulen, vaikka olen väsynyt.',
        acceptAlso: ['Tulen vaikka olen väsynyt.'],
      },
    },
    {
      id: 'sub-d6', kind: 'mc', sectionId: 'sub-jos',
      data: {
        prompt: 'Which sentence correctly expresses a counterfactual condition?',
        options: [
          'Jos olen rikas, ostan talon.',
          'Jos olisin rikas, ostaisin talon.',
          'Jos olen rikas, ostaisin talon.',
          'Vaikka olisin rikas, ostan talon.',
        ],
        correctIndex: 1,
        explanation: 'Counterfactual conditions require -isi- (conditional) in both clauses: olisin / ostaisin.',
      },
    },
    {
      id: 'sub-d7', kind: 'builder', sectionId: 'sub-etta',
      data: {
        tiles: ['on', 'hän', 'Tiedän,', 'että', 'kotona'],
        correctOrder: [2, 3, 1, 0, 4],
        translation: 'I know that he is at home.',
      },
    },
    {
      id: 'sub-d8', kind: 'spot-error', sectionId: 'sub-etta',
      data: {
        sentence: 'Luulen hän on kotona.',
        errorWord: 'hän on',
        correctForm: 'että hän on',
        explanation: 'In Finnish "että" cannot be omitted from complement clauses.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Subordinate clauses', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/subordinate-clauses' },
    { label: 'Uusi kielemme — Että', url: 'https://uusikielemme.fi/finnish-vocabulary/conjunctions/the-conjunction-etta' },
    { label: 'Uusi kielemme — Koska', url: 'https://uusikielemme.fi/finnish-vocabulary/conjunctions/the-conjunction-koska' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. RELATIVE CLAUSES
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_RELATIVE_CLAUSES: GrammarTopic = {
  id: 'relative-clauses',
  version: '1.0.0',
  title: 'Relative clauses',
  subtitle: 'joka, mikä, and jonka — agreeing in case with the antecedent.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 18,
  prerequisites: ['subordinate-clauses', 'genitive'],
  tags: ['syntax'],

  overview: {
    theme:
      'Finnish relative clauses are introduced by "joka" (for human and specific noun antecedents) or "mikä" (for indefinite or clausal antecedents). Crucially, the relative pronoun takes the case it plays in the relative clause, not the case of the antecedent.',
    grammarFocus: [
      'joka — animate or specific noun antecedent, fully inflected',
      'mikä — inanimate, indefinite pronouns, or whole-clause antecedent',
      'Case of the relative pronoun = its role in the relative clause',
      'jonka (genitive of joka) — "whose / of which"',
      'Partitive relative: minkä / jota',
    ],
    whyItMatters:
      '"Joka" and "mikä" allow Finnish speakers to build rich noun phrases without the particle constructions needed in English. Misusing them or assigning wrong case is one of the most common intermediate-level errors.',
  },

  sections: [
    {
      id: 'rel-joka',
      title: 'joka — relative pronoun for specific antecedents',
      question: 'Milloin käytetään "joka"-pronominia?',
      questionEn: 'When is "joka" used as a relative pronoun?',
      grammarPattern:
        '"Joka" is used when the antecedent is a specific noun (human or non-human). It inflects in all cases. In the nominative it is simply "joka".',
      examples: [
        { fi: 'Nainen, joka laulaa, on opettajani.', en: 'The woman who is singing is my teacher.' },
        { fi: 'Kirja, joka on pöydällä, on minun.', en: 'The book that is on the table is mine.' },
        { fi: 'Mies, jonka auto on punainen, asuu naapurissa.', en: 'The man whose car is red lives next door.' },
        { fi: 'Talo, jossa asun, on vanha.', en: 'The house in which I live is old.' },
      ],
      commonPitfalls: [
        'The case of "joka" is determined by its grammatical role in the relative clause, not by the case of the head noun.',
        '"Joka" agrees with its antecedent in number (singular joka, plural jotka).',
      ],
    },
    {
      id: 'rel-mika',
      title: 'mikä — relative pronoun for indefinite or clausal antecedents',
      question: 'Milloin käytetään "mikä" suhteellisessa lauseessa?',
      questionEn: 'When is "mikä" the correct relative pronoun?',
      grammarPattern:
        '"Mikä" is used when the antecedent is an indefinite pronoun (kaikki, jotain, se), a superlative noun phrase, or an entire clause.',
      examples: [
        { fi: 'Kaikki, mikä kiiltää, ei ole kultaa.', en: 'All that glitters is not gold.' },
        { fi: 'Se, mikä ei tapa, vahvistaa.', en: 'That which does not kill makes stronger.' },
        { fi: 'Hän teki sen, mistä olin varoittanut.', en: 'He did the thing I had warned about.' },
        { fi: 'Paras asia, mitä voin tehdä, on auttaa.', en: 'The best thing I can do is help.' },
      ],
      commonPitfalls: [
        'After superlatives and pronouns like "kaikki", "jotain", "se", use "mikä", never "joka".',
        '"Mikä" also inflects: nominative mikä, genitive minkä, partitive mitä, inessive missä, etc.',
      ],
    },
    {
      id: 'rel-case',
      title: 'Case agreement inside the relative clause',
      question: 'Missä sijamuodossa relatiivipronomi on?',
      questionEn: 'What case does the relative pronoun take?',
      grammarPattern:
        'The relative pronoun takes the case it plays inside its own clause. The head noun\'s case is irrelevant. For example if the relative pronoun is the object of a partitive verb, it appears in the partitive.',
      formula: 'Head noun (any case) + , + relative pronoun (case = its role) + rest of relative clause',
      examples: [
        { fi: 'Nainen, jota rakastan, on kaunis. (object of rakastaa → partitive)', en: 'The woman whom I love is beautiful.' },
        { fi: 'Kirja, jonka luin, oli pitkä. (object of lukea → genitive/accusative)', en: 'The book that I read was long.' },
        { fi: 'Kaupunki, jossa asun, on iso. (location → inessive)', en: 'The city where I live is big.' },
        { fi: 'Tyttö, jolle annoin kukat, hymyili. (indirect object → allative)', en: 'The girl to whom I gave flowers smiled.' },
      ],
      commonPitfalls: [
        'This is the hardest part. Decide: what role does the relative pronoun play in the relative clause? That determines its case.',
        '"joka" → "jonka" (genitive), "jota" (partitive), "jossa" (inessive), "josta" (elative), "johon" (illative), "jolle" (allative), "jolta" (ablative), "joksi" (translative).',
      ],
    },
    {
      id: 'rel-plural',
      title: 'Plural relative: jotka',
      question: 'Miten relatiivipronomi taipuu monikossa?',
      questionEn: 'How does the relative pronoun form its plural?',
      grammarPattern:
        'When the antecedent is plural, "joka" takes its plural form: "jotka" (nominative plural). Other cases: joita (partitive), joissa (inessive), joista (elative), joihin (illative), joille (allative).',
      examples: [
        { fi: 'Ihmiset, jotka tulevat, ovat ystäviäni.', en: 'The people who are coming are my friends.' },
        { fi: 'Kirjat, joita luin, olivat hyviä.', en: 'The books that I read were good.' },
        { fi: 'Talot, joissa asutaan, ovat vanhoja.', en: 'The houses in which people live are old.' },
      ],
      commonPitfalls: [
        'Singular antecedent → joka, joka, jonka, jota…; Plural antecedent → jotka, joita, joiden…',
        'Do not use "jotka" with a singular head noun.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'joka (nom. sg.)', use: 'Relative pronoun, specific antecedent, subject role', examples: ['nainen, joka laulaa'], sectionRef: 'rel-joka' },
    { pattern: 'jonka (gen. sg.)', use: 'Relative pronoun, possessor role (whose/of which)', examples: ['mies, jonka auto on punainen'], sectionRef: 'rel-joka' },
    { pattern: 'jota (part. sg.)', use: 'Relative pronoun, partitive object', examples: ['nainen, jota rakastan'], sectionRef: 'rel-case' },
    { pattern: 'jossa/josta/johon', use: 'Relative pronoun, local cases', examples: ['talo, jossa asun'], sectionRef: 'rel-case' },
    { pattern: 'jotka (nom. pl.)', use: 'Relative pronoun, plural antecedent', examples: ['ihmiset, jotka tulevat'], sectionRef: 'rel-plural' },
    { pattern: 'mikä / mitä / mistä', use: 'Relative pronoun for indefinite/clausal antecedent', examples: ['kaikki, mikä kiiltää'], sectionRef: 'rel-mika' },
  ],

  drills: [
    {
      id: 'rel-d1', kind: 'fill', sectionId: 'rel-joka',
      data: {
        sentence: 'Nainen, _____ laulaa, on opettajani.',
        answer: 'joka',
        hint: 'Human antecedent, subject role → joka',
      },
    },
    {
      id: 'rel-d2', kind: 'fill', sectionId: 'rel-case',
      data: {
        sentence: 'Nainen, _____ rakastan, on kaunis.',
        answer: 'jota',
        hint: 'Object of rakastaa → partitive → jota',
      },
    },
    {
      id: 'rel-d3', kind: 'mc', sectionId: 'rel-mika',
      data: {
        prompt: 'Complete: "Kaikki, _____ kiiltää, ei ole kultaa."',
        options: ['joka', 'mikä', 'jotka', 'mitä'],
        correctIndex: 1,
        explanation: '"Kaikki" is an indefinite pronoun → use mikä, not joka.',
      },
    },
    {
      id: 'rel-d4', kind: 'fill', sectionId: 'rel-joka',
      data: {
        sentence: 'Mies, _____ auto on punainen, asuu naapurissa.',
        answer: 'jonka',
        hint: 'Possessor role → genitive of joka = jonka',
      },
    },
    {
      id: 'rel-d5', kind: 'translate', sectionId: 'rel-case',
      data: {
        prompt: 'The city where I live is big.',
        target: 'Kaupunki, jossa asun, on iso.',
        acceptAlso: ['Kaupunki jossa asun on iso.'],
      },
    },
    {
      id: 'rel-d6', kind: 'mc', sectionId: 'rel-plural',
      data: {
        prompt: 'Choose the correct form: "Ihmiset, _____ tulevat, ovat ystäviäni."',
        options: ['joka', 'jolle', 'jotka', 'joita'],
        correctIndex: 2,
        explanation: 'Plural antecedent (ihmiset) + subject role → jotka.',
      },
    },
    {
      id: 'rel-d7', kind: 'spot-error', sectionId: 'rel-case',
      data: {
        sentence: 'Kirja, jonka luin, oli pitkä.',
        errorWord: '',
        correctForm: 'jonka',
        explanation: 'Object of lukea (total object) → genitive/accusative → jonka is correct here.',
      },
    },
    {
      id: 'rel-d8', kind: 'translate', sectionId: 'rel-joka',
      data: {
        prompt: 'The girl to whom I gave flowers smiled.',
        target: 'Tyttö, jolle annoin kukat, hymyili.',
        acceptAlso: ['Tyttö jolle annoin kukat hymyili.'],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Relative clauses', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/relative-clauses-in-finnish' },
    { label: 'Uusi kielemme — joka vs. mikä', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/joka-vs-mika' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. COMPARATIVE
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_COMPARATIVE: GrammarTopic = {
  id: 'comparative',
  version: '1.0.0',
  title: 'Comparative and superlative',
  subtitle: '-mpi, -(i)n, and comparisons with kuin.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 14,
  prerequisites: ['nominative'],
  tags: ['syntax', 'adjectives'],

  overview: {
    theme:
      'Finnish forms the comparative of adjectives with the suffix -mpi (added to the comparative stem) and the superlative with -(i)n or -in. Comparisons use "kuin" (than) or the ablative/adessive case.',
    grammarFocus: [
      'Comparative: adjective comparative stem + -mpi',
      'Stem formation: most adjectives drop the final vowel, add -empi / -ampi',
      'Common irregulars: hyvä → parempi, pitkä → pitempi/pidempi',
      'Superlative: -(i)n suffix on the comparative stem',
      'Comparison: X on -mpi kuin Y  /  X:llä on enemmän kuin Y:llä',
    ],
    whyItMatters:
      'Describing degrees of quality — faster, bigger, best — is indispensable for everyday descriptions, opinions, and comparisons.',
  },

  sections: [
    {
      id: 'comp-formation',
      title: 'Forming the comparative: -mpi',
      question: 'Miten vertailuaste muodostetaan?',
      questionEn: 'How is the comparative formed?',
      grammarPattern:
        'Take the adjective, remove the final vowel (the stem), and add -mpi. Vowel harmony applies. If the stem ends in a consonant cluster, a linking vowel -e- is added.',
      formula: 'adj. stem + -mpi  (front: -mpi / back: -mpi — same form)',
      morphology: {
        surface: 'iso → isompi',
        stem: 'iso',
        ending: '-mpi',
        breakdown: [
          { token: 'iso', role: 'stem', note: 'big — final vowel dropped in some analyses' },
          { token: 'mpi', role: 'ending', note: 'comparative suffix' },
        ],
      },
      examples: [
        { fi: 'iso → isompi', en: 'big → bigger' },
        { fi: 'nopea → nopeampi', en: 'fast → faster' },
        { fi: 'kaunis → kauniimpi', en: 'beautiful → more beautiful' },
        { fi: 'vaikea → vaikeampi', en: 'difficult → more difficult' },
        { fi: 'pitkä → pitempi (or pidempi)', en: 'tall/long → taller/longer' },
      ],
      commonPitfalls: [
        'The comparative stem often shortens: kaunis → kaunii- + mpi = kauniimpi (not kauniismpi).',
        'Hyvä (good) is irregular: parempi (not hyvämpi).',
      ],
    },
    {
      id: 'comp-irregular',
      title: 'Irregular comparatives',
      question: 'Mitkä vertailumuodot ovat epäsäännöllisiä?',
      questionEn: 'Which comparative forms are irregular?',
      grammarPattern:
        'Several common adjectives have suppletive or highly irregular comparative forms. These must be memorised.',
      examples: [
        { fi: 'hyvä → parempi → paras', en: 'good → better → best' },
        { fi: 'paha → pahempi → pahin', en: 'bad → worse → worst' },
        { fi: 'paljon → enemmän → eniten', en: 'much/many → more → most' },
        { fi: 'vähän → vähemmän → vähiten', en: 'little → less → least' },
        { fi: 'pitkä → pitempi/pidempi → pisin', en: 'long/tall → longer → longest' },
      ],
      commonPitfalls: [
        '"Parempi" is the only valid comparative of "hyvä". "Hyvämpi" does not exist.',
        '"Enemmän" is used for quantity (more of something), not for degree comparisons of adjectives.',
      ],
    },
    {
      id: 'comp-kuin',
      title: 'Comparison with kuin',
      question: 'Miten vertaillaan kahta asiaa?',
      questionEn: 'How do I compare two things?',
      grammarPattern:
        'Use "kuin" (than) after the comparative adjective. The noun following "kuin" takes the same case as the element it is being compared to, usually the nominative.',
      formula: 'X on [comparative] kuin Y',
      examples: [
        { fi: 'Pekka on isompi kuin Minna.', en: 'Pekka is bigger than Minna.' },
        { fi: 'Helsinki on suurempi kuin Tampere.', en: 'Helsinki is larger than Tampere.' },
        { fi: 'Tämä kirja on vaikeampi kuin tuo.', en: 'This book is more difficult than that one.' },
        { fi: 'Juokseminen on nopeampaa kuin käveleminen.', en: 'Running is faster than walking.' },
      ],
      commonPitfalls: [
        'The comparative adjective also inflects in case if it modifies a noun: "isommassa talossa" (in a bigger house).',
        'In colloquial Finnish "ku" is often used instead of "kuin": "Pekka on isompi ku Minna."',
      ],
    },
    {
      id: 'comp-superlative',
      title: 'Superlative: -(i)n',
      question: 'Miten superlatiivi muodostetaan?',
      questionEn: 'How is the superlative formed?',
      grammarPattern:
        'Take the comparative stem (the -mpi form, remove -mpi) and add -(i)n. The superlative also inflects in case when modifying nouns.',
      formula: 'comparative stem + -(i)n',
      examples: [
        { fi: 'iso → isompi → isoin', en: 'big → bigger → biggest' },
        { fi: 'nopea → nopeampi → nopein', en: 'fast → faster → fastest' },
        { fi: 'hyvä → parempi → paras', en: 'good → better → best (suppletive)' },
        { fi: 'Se on kallein vaihtoehto.', en: 'It is the most expensive option.' },
        { fi: 'Hän on luokan paras opiskelija.', en: 'She is the best student in the class.' },
      ],
      commonPitfalls: [
        'The superlative agrees in case with the noun it modifies: "parasta ruokaa" (partitive), "parhaassa talossa" (inessive).',
        '"Paras" has the irregular partitive "parasta" and inessive "parhaassa".',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'adj. + -mpi', use: 'Comparative degree', examples: ['isompi', 'nopeampi', 'kauniimpi'], sectionRef: 'comp-formation' },
    { pattern: 'hyvä → parempi → paras', use: 'Irregular good/better/best', sectionRef: 'comp-irregular' },
    { pattern: 'X on -mpi kuin Y', use: 'Comparison construction', examples: ['Pekka on isompi kuin Minna.'], sectionRef: 'comp-kuin' },
    { pattern: 'comp. stem + -(i)n', use: 'Superlative degree', examples: ['isoin', 'nopein', 'paras'], sectionRef: 'comp-superlative' },
  ],

  drills: [
    {
      id: 'comp-d1', kind: 'transform', sectionId: 'comp-formation',
      data: {
        base: 'iso',
        instruction: '→ comparative',
        answer: 'isompi',
      },
    },
    {
      id: 'comp-d2', kind: 'transform', sectionId: 'comp-formation',
      data: {
        base: 'nopea',
        instruction: '→ comparative',
        answer: 'nopeampi',
      },
    },
    {
      id: 'comp-d3', kind: 'mc', sectionId: 'comp-irregular',
      data: {
        prompt: 'What is the comparative of "hyvä" (good)?',
        options: ['hyvämpi', 'parempi', 'hyvästi', 'parhain'],
        correctIndex: 1,
        explanation: 'hyvä → parempi (suppletive/irregular). "Hyvämpi" does not exist.',
      },
    },
    {
      id: 'comp-d4', kind: 'translate', sectionId: 'comp-kuin',
      data: {
        prompt: 'Helsinki is larger than Tampere.',
        target: 'Helsinki on suurempi kuin Tampere.',
        acceptAlso: ['Helsinki on suurempi ku Tampere.'],
      },
    },
    {
      id: 'comp-d5', kind: 'transform', sectionId: 'comp-superlative',
      data: {
        base: 'iso → isompi',
        instruction: '→ superlative',
        answer: 'isoin',
      },
    },
    {
      id: 'comp-d6', kind: 'mc', sectionId: 'comp-superlative',
      data: {
        prompt: 'What is the superlative of "hyvä"?',
        options: ['hyvin', 'parempi', 'paras', 'parhain'],
        correctIndex: 2,
        explanation: 'The suppletive superlative of hyvä is paras.',
      },
    },
    {
      id: 'comp-d7', kind: 'table', sectionId: 'comp-formation',
      data: {
        headers: ['Adjective', 'Comparative', 'Superlative'],
        rows: [
          { label: 'iso', cells: [{ value: 'iso', blank: false }, { value: 'isompi', blank: true }, { value: 'isoin', blank: true }] },
          { label: 'nopea', cells: [{ value: 'nopea', blank: false }, { value: 'nopeampi', blank: true }, { value: 'nopein', blank: true }] },
          { label: 'hyvä', cells: [{ value: 'hyvä', blank: false }, { value: 'parempi', blank: true }, { value: 'paras', blank: true }] },
        ],
      },
    },
    {
      id: 'comp-d8', kind: 'spot-error', sectionId: 'comp-irregular',
      data: {
        sentence: 'Tämä on hyvämpi vaihtoehto.',
        errorWord: 'hyvämpi',
        correctForm: 'parempi',
        explanation: 'The comparative of hyvä is the irregular "parempi", not "hyvämpi".',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Comparative adjectives', url: 'https://uusikielemme.fi/finnish-grammar/word-types/adjectives/the-comparative-form-of-finnish-adjectives' },
    { label: 'Uusi kielemme — Superlative adjectives', url: 'https://uusikielemme.fi/finnish-grammar/word-types/adjectives/the-superlative-form-of-finnish-adjectives' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. PRONOUNS
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_PRONOUNS: GrammarTopic = {
  id: 'pronouns',
  version: '1.0.0',
  title: 'Pronouns',
  subtitle: 'Personal, demonstrative, interrogative — and hän vs. se.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: [],
  tags: ['syntax'],

  overview: {
    theme:
      'Finnish pronouns inflect in all cases, just like nouns. The personal pronouns have both formal and colloquial forms. "Hän" refers exclusively to humans; "se" (normally "it") is used for animals and things, but is also the colloquial substitute for "hän" in speech.',
    grammarFocus: [
      'Personal pronouns: minä/sinä/hän/me/te/he and colloquial mä/sä/se/me/te/ne',
      'Demonstrative pronouns: tämä (this), tuo (that), se (that/it)',
      'Interrogative pronouns: kuka (who), mikä (what)',
      'hän vs. se: formal he/she vs. colloquial he/she/it',
      'Pronouns inflect in all 15 cases',
    ],
    whyItMatters:
      'Finnish pronouns are unavoidable from day one. The hän/se distinction trips up learners who have only seen formal Finnish, and not knowing colloquial forms can make natural speech very difficult.',
  },

  sections: [
    {
      id: 'pron-personal',
      title: 'Personal pronouns',
      question: 'Mitkä ovat suomen persoonapronominit?',
      questionEn: 'What are the Finnish personal pronouns?',
      grammarPattern:
        'Finnish has six personal pronouns for six persons. In spoken Finnish, colloquial short forms are almost always used instead of the full forms.',
      examples: [
        { fi: 'minä / mä — sinä / sä — hän / se', en: 'I / you (sg.) / he, she' },
        { fi: 'me / me — te / te — he / ne', en: 'we / you (pl.) / they' },
        { fi: 'Minä olen opiskelija.', en: 'I am a student.' },
        { fi: 'Hän on kotona. (formal) / Se on kotona. (colloquial)', en: 'He/she is at home.' },
        { fi: 'He tulevat huomenna. (formal) / Ne tulevat huomenna. (colloquial)', en: 'They are coming tomorrow.' },
      ],
      commonPitfalls: [
        'In standard written Finnish "hän" and "he" are used for people. In colloquial speech "se" and "ne" replace them.',
        'The subject pronoun is often omitted in speech since the verb ending marks person: "Olen väsynyt" = "I am tired".',
      ],
    },
    {
      id: 'pron-cases',
      title: 'Personal pronouns in different cases',
      question: 'Miten persoonapronominit taipuvat?',
      questionEn: 'How do personal pronouns inflect?',
      grammarPattern:
        'Pronouns inflect in all 15 cases. The genitive of minä is minun, the partitive is minua, the allative is minulle. The genitive forms are particularly important for possessive constructions.',
      formula: 'minun (gen.) / minua (part.) / minulle (allat.) / minulla (adess.) / minulta (ablat.) / minuun (illat.)',
      examples: [
        { fi: 'Minulla on koira. (adessive = "at me")', en: 'I have a dog.' },
        { fi: 'Hän katsoo minua. (partitive object)', en: 'He/she is looking at me.' },
        { fi: 'Anna se minulle. (allative = to me)', en: 'Give it to me.' },
        { fi: 'Sinun kirjasi on tässä. (genitive)', en: 'Your book is here.' },
      ],
      commonPitfalls: [
        '"Minulla on" (I have) uses the adessive case, not the nominative. Literally "at me there is".',
        'Genitive forms (minun, sinun, hänen…) are used for explicit possession and before possessive suffixes.',
      ],
    },
    {
      id: 'pron-demonstrative',
      title: 'Demonstrative pronouns: tämä, tuo, se',
      question: 'Miten osoittavat pronominit eroavat toisistaan?',
      questionEn: 'What is the difference between tämä, tuo, and se?',
      grammarPattern:
        '"Tämä" (this) is near the speaker, "tuo" (that) is near the listener or visible but at a distance, "se" (that/it) is the most neutral and is also the standard pronoun for "it" and in colloquial speech for "he/she".',
      examples: [
        { fi: 'Tämä on minun kirjani. (near me)', en: 'This is my book.' },
        { fi: 'Tuo on sinun kirjasi. (near you)', en: 'That is your book.' },
        { fi: 'Se on kallis. (neutral "it")', en: 'It is expensive.' },
        { fi: 'Nämä ovat halpoja. (plural of tämä)', en: 'These are cheap.' },
        { fi: 'Nuo talot ovat kauniita. (plural of tuo)', en: 'Those houses are beautiful.' },
      ],
      commonPitfalls: [
        'Tämä/nämä → near speaker; tuo/nuo → visible but distant; se/ne → general reference or not in sight.',
        'In formal writing "se" never refers to a person. In speech it refers to the same person as "hän".',
      ],
    },
    {
      id: 'pron-han-se',
      title: 'hän vs. se — formal vs. colloquial',
      question: 'Miksi puhutaan "se" eikä "hän"?',
      questionEn: 'Why do Finnish speakers say "se" instead of "hän"?',
      grammarPattern:
        'In standard Finnish "hän" is the third-person singular human pronoun (he/she — Finnish does not distinguish gender). In everyday spoken Finnish "se" has taken over as the colloquial equivalent. "He" (formal plural) is replaced by "ne" in speech.',
      examples: [
        { fi: 'Hän on lääkäri. (formal, written)', en: 'He/she is a doctor.' },
        { fi: 'Se on lääkäri. (colloquial spoken)', en: 'He/she is a doctor.' },
        { fi: 'He lähtevät huomenna. (formal)', en: 'They are leaving tomorrow.' },
        { fi: 'Ne lähtee huomenna. (colloquial — also note singular verb agreement in colloquial)', en: 'They are leaving tomorrow.' },
      ],
      specialNote: {
        fi: 'Suomen kielessä ei ole sukupuoleen perustuvaa pronominia: "hän" tarkoittaa sekä "hän (mies)" että "hän (nainen)".',
        en: 'Finnish has no gendered pronouns: "hän" covers both he and she.',
      },
      commonPitfalls: [
        'In formal writing always use "hän" for people. Using "se" for a person in formal contexts is considered rude or degrading.',
        'In colloquial speech "se" is the default — using "hän" sounds overly formal.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'minä / mä', use: 'I (formal / colloquial)', sectionRef: 'pron-personal' },
    { pattern: 'sinä / sä', use: 'You (sg.) formal / colloquial', sectionRef: 'pron-personal' },
    { pattern: 'hän / se', use: 'He/She — formal (hän) / colloquial (se)', sectionRef: 'pron-han-se' },
    { pattern: 'me / te / he (ne)', use: 'We / You (pl.) / They — (ne = colloquial they)', sectionRef: 'pron-personal' },
    { pattern: 'tämä / tuo / se', use: 'This (near) / That (visible) / That/It (neutral)', sectionRef: 'pron-demonstrative' },
    { pattern: 'kuka / mikä', use: 'Who (person) / What (thing) — interrogative', sectionRef: 'pron-personal' },
    { pattern: 'minulla on', use: 'I have (adessive of minä + olla)', sectionRef: 'pron-cases' },
  ],

  drills: [
    {
      id: 'pron-d1', kind: 'mc', sectionId: 'pron-han-se',
      data: {
        prompt: 'In formal written Finnish, which pronoun refers to a person (he/she)?',
        options: ['se', 'tämä', 'hän', 'ne'],
        correctIndex: 2,
        explanation: 'In standard Finnish, hän is the third-person singular human pronoun.',
      },
    },
    {
      id: 'pron-d2', kind: 'fill', sectionId: 'pron-cases',
      data: {
        sentence: '_____ on koira. (I have a dog — use adessive)',
        answer: 'Minulla',
        hint: 'Adessive of minä = minulla; "minulla on" = I have',
      },
    },
    {
      id: 'pron-d3', kind: 'mc', sectionId: 'pron-demonstrative',
      data: {
        prompt: 'Which demonstrative pronoun means "this" (near the speaker)?',
        options: ['tuo', 'se', 'tämä', 'nuo'],
        correctIndex: 2,
        explanation: 'tämä = this (near speaker); tuo = that (near listener/visible); se = neutral it/that.',
      },
    },
    {
      id: 'pron-d4', kind: 'translate', sectionId: 'pron-personal',
      data: {
        prompt: 'Give it to me.',
        target: 'Anna se minulle.',
        acceptAlso: ['Anna minulle se.'],
      },
    },
    {
      id: 'pron-d5', kind: 'table', sectionId: 'pron-cases',
      data: {
        headers: ['Person', 'Nominative', 'Genitive', 'Adessive'],
        rows: [
          { label: '1sg', cells: [{ value: 'minä', blank: false }, { value: 'minun', blank: true }, { value: 'minulla', blank: true }] },
          { label: '2sg', cells: [{ value: 'sinä', blank: false }, { value: 'sinun', blank: true }, { value: 'sinulla', blank: true }] },
          { label: '3sg', cells: [{ value: 'hän', blank: false }, { value: 'hänen', blank: true }, { value: 'hänellä', blank: true }] },
        ],
      },
    },
    {
      id: 'pron-d6', kind: 'mc', sectionId: 'pron-han-se',
      data: {
        prompt: 'In everyday spoken Finnish, what pronoun replaces "he" (they)?',
        options: ['he', 'ne', 'te', 'nuo'],
        correctIndex: 1,
        explanation: 'In colloquial Finnish "he" (formal plural) is replaced by "ne".',
      },
    },
    {
      id: 'pron-d7', kind: 'spot-error', sectionId: 'pron-demonstrative',
      data: {
        sentence: 'Tuo on minun kirjani. (referring to a book right next to the speaker)',
        errorWord: 'Tuo',
        correctForm: 'Tämä',
        explanation: 'A book next to the speaker is "tämä" (this), not "tuo" (that/near listener).',
      },
    },
    {
      id: 'pron-d8', kind: 'translate', sectionId: 'pron-personal',
      data: {
        prompt: 'He/She is a doctor. (formal written Finnish)',
        target: 'Hän on lääkäri.',
        acceptAlso: ['Hän on lääkäri'],
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Personal pronouns', url: 'https://uusikielemme.fi/finnish-grammar/word-types/pronouns/personal-pronouns-in-finnish' },
    { label: 'Uusi kielemme — Demonstrative pronouns', url: 'https://uusikielemme.fi/finnish-grammar/word-types/pronouns/demonstrative-pronouns-in-finnish' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. POSSESSIVE SUFFIXES
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_POSSESSIVE_SUFFIXES: GrammarTopic = {
  id: 'possessive-suffixes',
  version: '1.0.0',
  title: 'Possessive suffixes',
  subtitle: '-ni, -si, -(V)nsa, -mme, -nne — my, your, his/her…',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 16,
  prerequisites: ['genitive'],
  tags: ['syntax', 'morphology'],

  overview: {
    theme:
      'Finnish encodes possession directly on the noun via possessive suffixes. These suffixes change shape when the noun is inflected in other cases, but always remain at the very end of the word form.',
    grammarFocus: [
      '1sg: -ni (kirjani = my book)',
      '2sg: -si (kirjasi = your book)',
      '3sg/pl: -(V)nsa or -(V)nsä (kirjansa = his/her book)',
      '1pl: -mme (kirjamme = our book)',
      '2pl: -nne (kirjanne = your (pl.) book)',
      'The genitive pronoun (minun, sinun…) is usually added for clarity or emphasis',
      'The suffix survives through case inflection: kirjassani = in my book',
    ],
    whyItMatters:
      'Possessive suffixes are everywhere in Finnish — not just on nouns but on infinitives, participles, and postpositions. Learning them early dramatically expands what you can express.',
  },

  sections: [
    {
      id: 'poss-forms',
      title: 'The six possessive suffixes',
      question: 'Mitkä ovat omistusliitteet?',
      questionEn: 'What are the possessive suffixes?',
      grammarPattern:
        'Each grammatical person has its own suffix. 1sg and 2sg are simple; 3rd person (any number) uses -(V)nsa/-(V)nsä where V is a copy of the preceding vowel. 1pl and 2pl end in -mme and -nne.',
      formula: '1sg: -ni | 2sg: -si | 3sg/pl: -(V)nsa/-(V)nsä | 1pl: -mme | 2pl: -nne',
      morphology: {
        surface: 'kirja + ni = kirjani',
        stem: 'kirja',
        ending: '-ni',
        breakdown: [
          { token: 'kirja', role: 'stem', note: 'book — nominative stem' },
          { token: 'ni', role: 'ending', note: '1sg possessive suffix' },
        ],
      },
      examples: [
        { fi: 'kirjani', en: 'my book (1sg)' },
        { fi: 'kirjasi', en: 'your book (2sg)' },
        { fi: 'kirjansa', en: 'his/her/their book (3rd person)' },
        { fi: 'kirjamme', en: 'our book (1pl)' },
        { fi: 'kirjanne', en: 'your (pl.) book (2pl)' },
      ],
      commonPitfalls: [
        'The 3rd person suffix -(V)nsa copies the last vowel of the stem: kirja → kirjansa, talo → taloonsa.',
        'There is no separate 3sg vs. 3pl suffix — kirjansa is both "his book" and "their book".',
      ],
    },
    {
      id: 'poss-genitive-pronoun',
      title: 'Genitive pronoun + possessive suffix',
      question: 'Milloin lisätään myös genetiivimuotoinen pronomini?',
      questionEn: 'When is the genitive pronoun added alongside the suffix?',
      grammarPattern:
        'In standard Finnish the genitive pronoun (minun, sinun, hänen, meidän, teidän, heidän) is usually present for 1st and 2nd person to avoid ambiguity. It can be omitted in informal speech. For 3rd person, "hänen" or "heidän" is regularly included.',
      formula: 'Genitive pronoun (optional/emphatic) + Noun + possessive suffix',
      examples: [
        { fi: 'Minun kirjani on pöydällä.', en: 'My book is on the table.' },
        { fi: 'Sinun autosi on kaunis.', en: 'Your car is beautiful.' },
        { fi: 'Hänen kirjansa on iso.', en: 'His/her book is big.' },
        { fi: 'Meidän koiramme on ystävällinen.', en: 'Our dog is friendly.' },
      ],
      commonPitfalls: [
        'The possessive suffix must always be present even when the pronoun is included: "minun kirja" without -ni is ungrammatical.',
        'Dropping the pronoun is colloquial: "Kirjani on pöydällä" is perfectly natural.',
      ],
    },
    {
      id: 'poss-case-inflection',
      title: 'Suffix survives case inflection',
      question: 'Miten omistusliite pysyy eri sijamuodoissa?',
      questionEn: 'How does the possessive suffix behave when the noun is inflected?',
      grammarPattern:
        'The possessive suffix is always the final element of the word form. The case ending comes before it. This means the suffix may change slightly to fit phonological rules (especially for -si and 3rd person).',
      formula: 'Noun stem + case ending + possessive suffix',
      examples: [
        { fi: 'kirjassani (kirja + ssa + ni)', en: 'in my book (inessive)' },
        { fi: 'kirjalleni (kirja + lle + ni)', en: 'to my book / onto my book (allative)' },
        { fi: 'talossasi (talo + ssa + si)', en: 'in your house' },
        { fi: 'kodissaan (koti → kodi + ssa + nsa)', en: 'in his/her home' },
        { fi: 'ystäviämme (ystävä plural + mme partitive)', en: 'our friends (partitive)' },
      ],
      commonPitfalls: [
        'The 2sg suffix -si can merge with certain case endings: kirja + ssa + si = kirjassasi (not kirjassasi → only one s between endings is pronounced).',
        'The 3rd person suffix after the inessive ssa/ssä becomes -an or -ään: kodissaan (kodi+ssa+nsa contracts to kodissaan).',
      ],
    },
    {
      id: 'poss-postpositions',
      title: 'Possessive suffixes on postpositions and infinitives',
      question: 'Esiintyykö omistusliite myös muissa sanaluokissa?',
      questionEn: 'Do possessive suffixes appear on postpositions and infinitives too?',
      grammarPattern:
        'Yes. Postpositions and certain infinitive forms also take possessive suffixes, especially after genitive pronouns.',
      examples: [
        { fi: 'minun täytyi mennä — minun täytyy lukea kirjani', en: 'I had to go — I have to read my book' },
        { fi: 'hänen takianaan (hänen + takiana + nsa)', en: 'because of him/her (postposition with suffix)' },
        { fi: 'ennen lähtöäni (ennen + lähtö + äni)', en: 'before my departure' },
        { fi: 'lukiessani (luki + essa + ni = while I was reading)', en: 'while I was reading' },
      ],
      commonPitfalls: [
        'Postpositions like "takana, edessä, vieressä" take possessive suffixes when the possessor is a pronoun: "minun edessäni" = in front of me.',
        'The second infinitive inessive (lukiessa-) takes suffixes to express "while (someone) does X": lukiessasi = while you read.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: 'N + -ni', use: '1sg possession (my N)', examples: ['kirjani', 'autoni', 'kodissani'], sectionRef: 'poss-forms' },
    { pattern: 'N + -si', use: '2sg possession (your N)', examples: ['kirjasi', 'kodissasi'], sectionRef: 'poss-forms' },
    { pattern: 'N + -(V)nsa/-(V)nsä', use: '3rd person possession (his/her/their N)', examples: ['kirjansa', 'kodissaan'], sectionRef: 'poss-forms' },
    { pattern: 'N + -mme', use: '1pl possession (our N)', examples: ['kirjamme', 'kodissamme'], sectionRef: 'poss-forms' },
    { pattern: 'N + -nne', use: '2pl possession (your (pl.) N)', examples: ['kirjanne', 'kodissanne'], sectionRef: 'poss-forms' },
    { pattern: 'N-case ending + suffix', use: 'Suffix survives case inflection', examples: ['kirjassani', 'talollesi', 'kodissaan'], sectionRef: 'poss-case-inflection' },
  ],

  drills: [
    {
      id: 'poss-d1', kind: 'transform', sectionId: 'poss-forms',
      data: {
        base: 'kirja',
        instruction: '→ "my book" (add 1sg possessive suffix)',
        answer: 'kirjani',
      },
    },
    {
      id: 'poss-d2', kind: 'transform', sectionId: 'poss-forms',
      data: {
        base: 'auto',
        instruction: '→ "your (sg.) car" (2sg suffix)',
        answer: 'autosi',
      },
    },
    {
      id: 'poss-d3', kind: 'transform', sectionId: 'poss-case-inflection',
      data: {
        base: 'kirja (inessive)',
        instruction: '→ "in my book" (inessive + 1sg suffix)',
        answer: 'kirjassani',
      },
    },
    {
      id: 'poss-d4', kind: 'mc', sectionId: 'poss-forms',
      data: {
        prompt: 'What is the 3rd person possessive form of "talo" (house)?',
        options: ['taloni', 'talosi', 'talomme', 'taloonsa'],
        correctIndex: 3,
        explanation: '3rd person suffix on talo (illative stem taloon-): taloonsa. Or talonsa in other analyses. The form showing clearly is taloonsa.',
      },
    },
    {
      id: 'poss-d5', kind: 'fill', sectionId: 'poss-genitive-pronoun',
      data: {
        sentence: 'Minun _____ on pöydällä. (kirja + 1sg suffix)',
        answer: 'kirjani',
        hint: 'kirja + -ni = kirjani',
      },
    },
    {
      id: 'poss-d6', kind: 'translate', sectionId: 'poss-case-inflection',
      data: {
        prompt: 'He/she is in his/her home.',
        target: 'Hän on kodissaan.',
        acceptAlso: ['Hän on kotonaan.'],
      },
    },
    {
      id: 'poss-d7', kind: 'table', sectionId: 'poss-forms',
      data: {
        headers: ['Person', 'Suffix', 'kirja + suffix'],
        rows: [
          { label: '1sg', cells: [{ value: '1sg', blank: false }, { value: '-ni', blank: false }, { value: 'kirjani', blank: true }] },
          { label: '2sg', cells: [{ value: '2sg', blank: false }, { value: '-si', blank: false }, { value: 'kirjasi', blank: true }] },
          { label: '3sg/pl', cells: [{ value: '3sg/pl', blank: false }, { value: '-(V)nsa', blank: false }, { value: 'kirjansa', blank: true }] },
          { label: '1pl', cells: [{ value: '1pl', blank: false }, { value: '-mme', blank: false }, { value: 'kirjamme', blank: true }] },
          { label: '2pl', cells: [{ value: '2pl', blank: false }, { value: '-nne', blank: false }, { value: 'kirjanne', blank: true }] },
        ],
      },
    },
    {
      id: 'poss-d8', kind: 'spot-error', sectionId: 'poss-genitive-pronoun',
      data: {
        sentence: 'Minun kirja on pöydällä.',
        errorWord: 'kirja',
        correctForm: 'kirjani',
        explanation: 'Even when the genitive pronoun is present, the possessive suffix -ni must be on the noun: minun kirjani.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Possessive suffixes', url: 'https://uusikielemme.fi/finnish-grammar/word-types/suffixes/possessive-suffixes-in-finnish' },
    { label: 'Uusi kielemme — Possessive suffixes with cases', url: 'https://uusikielemme.fi/finnish-grammar/word-types/suffixes/possessive-suffixes-in-different-cases' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. PARTICIPLE CLAUSES (LAUSEENVASTIKKEET)
// ─────────────────────────────────────────────────────────────────────────────
const TOPIC_PARTICIPLE_CLAUSES: GrammarTopic = {
  id: 'participle-clauses',
  version: '1.0.0',
  title: 'Participle clauses (lauseenvastikkeet)',
  subtitle: 'Clause equivalents: referative, temporal, and agent constructions.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 22,
  prerequisites: ['referative-construction', 'temporal-construction', 'agent-participle'],
  tags: ['syntax', 'verbs'],

  overview: {
    theme:
      'Finnish has a system of "clause equivalents" (lauseenvastikkeet) — non-finite constructions using participles that replace full subordinate clauses. They are highly condensed, native-sounding, and typical of formal or literary Finnish.',
    grammarFocus: [
      'Referative construction: replaces "että" clauses (he knows that it happened)',
      'Temporal construction: replaces "kun" clauses (after/when doing X)',
      'Agent construction: replaces relative clauses with a passive verb (a letter written by him)',
      'When NOT to use participle clauses: different subjects, negation in some patterns',
      'Nominative vs. accusative participant in agent construction',
    ],
    whyItMatters:
      'Participle clauses appear throughout authentic Finnish texts, news, and formal speech. Without them, reading newspapers or academic Finnish is difficult, and writing sounds unnatural.',
  },

  sections: [
    {
      id: 'partcl-overview',
      title: 'Overview: what are lauseenvastikkeet?',
      question: 'Mitä lauseenvastikkeet ovat?',
      questionEn: 'What are clause equivalents?',
      grammarPattern:
        'Lauseenvastikkeet (clause equivalents) are constructions using verb forms — mainly participles — to compress a subordinate clause into a nominalized structure. They are characteristic of standard literary Finnish and are absent from most spoken dialects.',
      formula: 'Full clause (kirjoitti kirjeen) → Participle structure (kirjoittama kirje)',
      examples: [
        { fi: 'Tiedän, että hän tuli. (full clause)', en: 'I know that he came.' },
        { fi: 'Tiedän hänen tulleen. (referative — lauseenvastike)', en: 'I know him to have come. / I know that he came.' },
        { fi: 'Kun tulin kotiin, söin. (full temporal)', en: 'When I came home, I ate.' },
        { fi: 'Kotiin tultuani söin. (temporal — lauseenvastike)', en: 'Having come home, I ate.' },
      ],
      commonPitfalls: [
        'Lauseenvastikkeet require the same subject in the main clause and the participle clause, with the referative as a partial exception.',
        'They are formal/literary. In everyday spoken Finnish the full clause is always fine.',
      ],
    },
    {
      id: 'partcl-referative',
      title: 'Referative construction — replacing että',
      question: 'Miten referatiivirakenne korvaa että-lauseen?',
      questionEn: 'How does the referative construction replace a "that" clause?',
      grammarPattern:
        'The referative construction uses the present or past participle active II in a possessive suffix construction. It replaces "että + finite clause" after verbs of reporting, knowing, or believing.',
      formula: 'Verb + [Subject(genitive)] + [Verb-NEN/NEen participle]',
      specialNote: {
        fi: 'Aktiivin 2. partisiippi: tehdä → tehnyt/tehneensä. Rakenne: "Tiedän hänen tulleen." (hänen = omistajapronomiini, tulleen = past partisiippi + genetiivi)',
        en: 'Active past participle: tehdä → tehnyt. Structure: Tiedän hänen tulleen. (hänen = possessor pronoun in genitive, tulleen = past participle genitive form)',
      },
      examples: [
        { fi: 'Sanon hänen olevan kotona. (olevan = present participle genitive)', en: 'I say that he is at home.' },
        { fi: 'Tiedän hänen tulleen eilen. (tulleen = past participle genitive)', en: 'I know that he came yesterday.' },
        { fi: 'He uskovat sen olevan totta.', en: 'They believe it to be true.' },
        { fi: 'Kuulin sinun soittaneen.', en: 'I heard that you had called.' },
      ],
      commonPitfalls: [
        'The subject of the embedded clause appears in the genitive (hänen, sinun) and the participle takes the genitive ending (-en): tulleen, olevan.',
        'If the subject is the same in both clauses, the referative is used WITHOUT the genitive pronoun: "Sanon olevani väsynyt" = "I say that I am tired."',
      ],
    },
    {
      id: 'partcl-temporal',
      title: 'Temporal construction — replacing kun (after)',
      question: 'Miten temporaalirakenne korvaa kun-lauseen?',
      questionEn: 'How does the temporal construction replace a "when/after" clause?',
      grammarPattern:
        'The temporal construction uses the second infinitive forms (-essa/-essä for simultaneous, or 4th infinitive / past participle for sequential) to express when something happens. The subject of the temporal clause must be the same as the main clause.',
      formula: 'Verb 2nd infinitive inessive (-essa/-essä) + possessive suffix  OR  Noun(time) + V past participle translative + possessive suffix',
      examples: [
        { fi: 'Kotiin tullessani löysin kirjeen. (tullessani = while coming home)', en: 'Upon coming home / While coming home, I found a letter.' },
        { fi: 'Kotiin tultuani söin. (tultuani = after having come home)', en: 'After coming home, I ate.' },
        { fi: 'Opiskellessaan hän kuuntelee musiikkia. (opiskellessaan = while studying)', en: 'While studying, he listens to music.' },
        { fi: 'Saavuttuaan Helsinkiin hän soitti. (saavuttuaan = after having arrived)', en: 'After arriving in Helsinki, he called.' },
      ],
      commonPitfalls: [
        '-essa/-essä + possessive suffix = simultaneous (while doing); past participle translative (tultuaan) = sequential (after having done).',
        'Both subject of the main clause and the temporal clause must be the same person.',
      ],
    },
    {
      id: 'partcl-agent',
      title: 'Agent construction — replacing a passive relative clause',
      question: 'Miten agenttirakenne korvaa relatiivilauseen?',
      questionEn: 'How does the agent construction replace a relative clause?',
      grammarPattern:
        'The agent construction uses the agent participle (-ma/-mä attached to a noun) to replace a relative clause where the relative clause verb is passive or has an expressed human agent.',
      formula: 'Agent (genitive) + Noun-MA participle  =  Noun that [agent] Verb-ed',
      examples: [
        { fi: 'Pekan kirjoittama kirje oli pitkä. (= kirje, jonka Pekka kirjoitti)', en: 'The letter written by Pekka was long.' },
        { fi: 'Hän luki minun ostamani kirjan. (= kirjan, jonka minä ostin)', en: 'He read the book I had bought.' },
        { fi: 'Professorin pitämä luento oli mielenkiintoinen.', en: 'The lecture given by the professor was interesting.' },
        { fi: 'Äidin tekemä ruoka maistuu parhaalta.', en: 'Food made by mother tastes best.' },
      ],
      commonPitfalls: [
        'The agent is in the genitive (Pekan, minun); the participle agrees in case with the head noun it modifies.',
        'This construction is only used when the agent is a specific person or entity — not for impersonal or unknown agents.',
      ],
    },
    {
      id: 'partcl-restrictions',
      title: 'When NOT to use participle clauses',
      question: 'Milloin lauseenvastiketta ei voi käyttää?',
      questionEn: 'When is the participle clause construction NOT allowed?',
      grammarPattern:
        'Participle clause constructions are blocked when: (1) the subjects of the main and embedded clause differ (except in referative); (2) the embedded clause is negated (in temporal/agent constructions); (3) the tense relationship is complex.',
      examples: [
        { fi: 'Minä tiedän, että hän tuli. (different subjects → must use full clause, not *minä tiedän tultuani)', en: 'I know that he came. (cannot use temporal construction — different subjects)' },
        { fi: 'Kun en tullut, hän lähti. (negated embedded clause → cannot use temporal construction)', en: 'When I did not come, he left. (negation blocks the temporal lauseenvastike)' },
        { fi: 'Oletko tullut kotiin? (interrogative main clause is fine; the construction still works in positive embedded)', en: 'Have you come home? (no issue here)' },
        { fi: 'Hän sanoo, että minä tulin. (different subjects → referative needed with possessive: Hän sanoo minun tulleen)', en: 'He says that I came. (different subjects — use referative with minun tulleen)' },
      ],
      commonPitfalls: [
        'The most common error is applying a temporal participle construction when the subjects differ: "*Tultuaan kotiin, äiti laittoi ruokaa" is fine (same subject implied), but "*Minun tultuani, hän lähti" — here different subjects are involved and the possessive suffix solves it: minun tultuani (my having come, after I came).',
        'When in doubt, use the full finite subordinate clause — it is always grammatically safe.',
      ],
    },
  ],

  grammarIndex: [
    { pattern: '[Genitive] + V-NEN/NEEN', use: 'Referative — replaces "että + finite clause"', examples: ['hänen tulleen', 'sinun olevan'], sectionRef: 'partcl-referative' },
    { pattern: 'V-essa/-essä + suffix', use: 'Temporal simultaneous — while doing X', examples: ['tullessani', 'opiskellessaan'], sectionRef: 'partcl-temporal' },
    { pattern: 'V-tua/-tyä + suffix', use: 'Temporal sequential — after having done X', examples: ['tultuani', 'saavuttuaan'], sectionRef: 'partcl-temporal' },
    { pattern: 'Agent(gen.) + N-MA/-MÄ', use: 'Agent participle — N that [agent] did', examples: ['Pekan kirjoittama kirje', 'minun ostamani kirja'], sectionRef: 'partcl-agent' },
    { pattern: 'Different subjects → avoid temporal/agent', use: 'Use full clause when subjects differ', sectionRef: 'partcl-restrictions' },
  ],

  drills: [
    {
      id: 'partcl-d1', kind: 'transform', sectionId: 'partcl-referative',
      data: {
        base: 'Tiedän, että hän tuli eilen.',
        instruction: '→ referative construction',
        answer: 'Tiedän hänen tulleen eilen.',
      },
    },
    {
      id: 'partcl-d2', kind: 'mc', sectionId: 'partcl-referative',
      data: {
        prompt: 'Transform: "Sanon, että olen väsynyt." → referative (same subject)',
        options: [
          'Sanon hänen olevan väsynyt.',
          'Sanon olevani väsynyt.',
          'Sanon olevansa väsynyt.',
          'Sanon olen väsynyt.',
        ],
        correctIndex: 1,
        explanation: 'Same subject → no genitive pronoun; 1sg possessive suffix on participle: olevani.',
      },
    },
    {
      id: 'partcl-d3', kind: 'transform', sectionId: 'partcl-temporal',
      data: {
        base: 'Kun tulin kotiin, söin.',
        instruction: '→ temporal construction (sequential, after having come home)',
        answer: 'Kotiin tultuani söin.',
      },
    },
    {
      id: 'partcl-d4', kind: 'fill', sectionId: 'partcl-temporal',
      data: {
        sentence: 'Opiskell_____ hän kuuntelee musiikkia. (while studying)',
        answer: 'Opiskellessaan',
        hint: '2nd infinitive inessive of opiskella + 3sg possessive suffix: opiskellessaan',
      },
    },
    {
      id: 'partcl-d5', kind: 'transform', sectionId: 'partcl-agent',
      data: {
        base: 'kirje, jonka Pekka kirjoitti',
        instruction: '→ agent participle construction',
        answer: 'Pekan kirjoittama kirje',
      },
    },
    {
      id: 'partcl-d6', kind: 'mc', sectionId: 'partcl-restrictions',
      data: {
        prompt: 'Which sentence correctly uses a participle clause construction?',
        options: [
          'Minä tiedän sinun tulleen. (different subjects — referative)',
          '*Tultuani, hän lähti. (different subjects — temporal — WRONG)',
          'Kotiin tultuani söin. (same subject — temporal — CORRECT)',
          '*Opiskellessani, hän katsoi televisiota. (different subjects — temporal — WRONG)',
        ],
        correctIndex: 2,
        explanation: 'Temporal clause constructions require the same subject. "Kotiin tultuani söin" is correct: the "I" who came home is the same "I" who ate.',
      },
    },
    {
      id: 'partcl-d7', kind: 'translate', sectionId: 'partcl-agent',
      data: {
        prompt: 'The lecture given by the professor was interesting.',
        target: 'Professorin pitämä luento oli mielenkiintoinen.',
        acceptAlso: ['Professorin pitämä luento oli mielenkiintoinen'],
      },
    },
    {
      id: 'partcl-d8', kind: 'spot-error', sectionId: 'partcl-restrictions',
      data: {
        sentence: 'Minä tiedän tultuani eilen. (Meaning: I know that he came yesterday.)',
        errorWord: 'tultuani',
        correctForm: 'hänen tulleen',
        explanation: 'Different subjects (I know / he came) → use referative with genitive pronoun: tiedän hänen tulleen eilen.',
      },
    },
  ],

  sources: [
    { label: 'Uusi kielemme — Lauseenvastikkeet (clause equivalents)', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/clause-equivalents-lauseenvastikkeet' },
    { label: 'Uusi kielemme — Referative construction', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/the-referative-construction' },
    { label: 'Uusi kielemme — Temporal construction', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/the-temporal-construction' },
    { label: 'Uusi kielemme — Agent participle', url: 'https://uusikielemme.fi/finnish-grammar/word-types/verbs/the-agent-participle' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// INDIRECT SPEECH
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_INDIRECT_SPEECH: GrammarTopic = {
  id: 'indirect-speech',
  version: '1.0.0',
  title: 'Indirect speech',
  subtitle: "Reporting what someone said — että-clauses and the referative shortcut.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 14,
  prerequisites: ['subordinate-clauses', 'referative-construction'],
  tags: ['syntax'],
  overview: {
    theme: "Finnish reports speech in two main ways: (1) the että-clause, where the reported speech is a full finite clause (Hän sanoi, että tulee. — He said that he would come.); (2) the referative construction, a participial shortcut used in formal/written language. Crucially, Finnish does NOT shift tenses in indirect speech the way English does.",
    grammarFocus: [
      'että-clause: Hän sanoi, että tulee. (He said that he is coming / he would come.)',
      'No tense shift: present tense stays present even in past indirect speech',
      'Referative shortcut: Hän sanoi tulevansa. (He said he was coming.)',
      'Verbs of saying: sanoa, kertoa, väittää, ajatella, uskoa, luulla',
      'Questions in indirect speech: Hän kysyi, tuleeko hän. (She asked whether he was coming.)',
    ],
    whyItMatters: "Any time you report what someone said, thought, or asked, you need indirect speech. Finnish is simpler than English in one key way: no tense backshifting. But it uses two very different structures (että vs. referative) that need to be learned.",
  },
  sections: [
    {
      id: 'indspeech-etta',
      title: 'että-clause for indirect speech',
      question: 'Miten epäsuora esitys muodostetaan että-lauseella?',
      questionEn: 'How is indirect speech expressed with an että-clause?',
      grammarPattern:
        "Verb of saying/thinking + että + full finite clause. The reported clause keeps its own tense. Finnish does NOT backshift tenses — a present tense in the original stays present in the report.",
      formula: 'verb of saying + että + clause (tense unchanged)',
      examples: [
        { fi: 'Hän sanoi, että hän tulee huomenna.', en: 'He said (that) he is coming tomorrow. (present stays present)' },
        { fi: 'Hän sanoi, että hän tuli eilen.', en: 'He said (that) he came yesterday. (past stays past)' },
        { fi: 'Ajattelen, että tämä on oikein.', en: 'I think (that) this is correct.' },
        { fi: 'Hän kertoi, että talvi oli kylmä.', en: 'She said that the winter was cold.' },
        { fi: 'Luulin, että hän on kotona.', en: 'I thought that he is at home. (Finnish: is, not *was)' },
      ],
      commonPitfalls: [
        'NO tense backshifting in Finnish. Where English says "I thought he WAS at home", Finnish says "Luulin, että hän ON kotona" — present tense in the that-clause.',
        'The comma before että is obligatory in written Finnish.',
      ],
    },
    {
      id: 'indspeech-referative',
      title: 'Referative construction as indirect speech shortcut',
      question: 'Miten referatiivirakenne korvaa että-lauseen?',
      questionEn: 'How does the referative replace the että-clause?',
      grammarPattern:
        'In formal/written Finnish, the referative construction replaces the että-clause. The verb of the reported clause becomes a present or past active participle + possessive suffix (if subjects differ). This is shorter and more elegant in writing.',
      formula: 'verb + inf.stem + -van/-vän (pres.) or -neen (past) + possessive suffix',
      examples: [
        { fi: 'Hän sanoi tulevansa. (= sanoi, että tulee)', en: 'He said he is/was coming. (referative = että shortcut)' },
        { fi: 'Hän sanoi tulleensa. (= sanoi, että tuli)', en: 'He said he had come / came. (past referative)' },
        { fi: 'Ajattelen olevani oikeassa. (= ajattelen, että olen oikeassa)', en: 'I think I am right.' },
        { fi: 'Hän uskoo hänen tulevan. (different subjects: genitive + tulevan)', en: 'She believes he is coming. (genitive pronoun + referative)' },
      ],
      commonPitfalls: [
        'When the subjects of the main verb and reported verb are the SAME, use a possessive suffix without genitive pronoun: sanoin tulevani (I said I was coming).',
        'When subjects DIFFER, use genitive pronoun + participial form: sanoin hänen tulevan (I said he was coming).',
      ],
    },
    {
      id: 'indspeech-questions',
      title: 'Indirect questions',
      question: 'Miten epäsuora kysymys muodostetaan?',
      questionEn: 'How are indirect questions formed?',
      grammarPattern:
        'Yes/no indirect questions use -ko/-kö on the verb of the reported clause. Wh-questions retain the question word. Both retain the finite clause structure with no tense shift.',
      examples: [
        { fi: 'Hän kysyi, tuleeko hän. (yes/no)', en: 'She asked whether he is coming. (-ko preserved)' },
        { fi: 'Hän kysyi, onko hän kotona.', en: 'He asked whether she is at home.' },
        { fi: 'Hän kysyi, missä asun. (wh-question)', en: 'She asked where I live.' },
        { fi: 'En tiedä, kuka hän on.', en: "I don't know who he/she is." },
        { fi: 'Hän halusi tietää, mitä syöt.', en: 'He wanted to know what you are eating.' },
      ],
      commonPitfalls: [
        'In indirect yes/no questions, -ko/-kö stays on the verb: Hän kysyi, tuleeko hän (not *Hän kysyi, tulee hän).',
        'No inversion of word order in indirect questions — the word order is the same as in a declarative clause.',
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'sanoi, että + clause', use: 'Indirect speech with että (no tense shift)', examples: ['Hän sanoi, että tulee.', 'Luulin, että hän on kotona.'], sectionRef: 'indspeech-etta' },
    { pattern: 'sanoi + -van/-neen + poss.suf.', use: 'Referative shortcut for indirect speech', examples: ['Hän sanoi tulevansa.', 'sanoin tulleeni'], sectionRef: 'indspeech-referative' },
    { pattern: 'kysyi, + verb + -ko/-kö', use: 'Indirect yes/no question', examples: ['Hän kysyi, tuleeko hän.'], sectionRef: 'indspeech-questions' },
  ],
  drills: [
    { id: 'is-d1', kind: 'fill', sectionId: 'indspeech-etta',
      data: { sentence: 'Hän sanoi, _____ hän _____ (tulla) huomenna.', answer: 'että / tulee', hint: 'että + present (no tense shift)', baseForm: 'tulla' } },
    { id: 'is-d2', kind: 'transform', sectionId: 'indspeech-referative',
      data: { base: 'Hän sanoi, että hän tulee.', instruction: '→ referative construction', answer: 'Hän sanoi tulevansa.' } },
    { id: 'is-d3', kind: 'mc', sectionId: 'indspeech-etta',
      data: { prompt: '"I thought he WAS at home" in Finnish?',
        options: ['Luulin, että hän oli kotona.', 'Luulin, että hän on kotona.', 'Luulin, hänen olevan kotona.', 'Luulin, että hän olisi kotona.'], correctIndex: 1,
        explanation: 'No tense backshift in Finnish: present stays present — Luulin, että hän ON kotona.' } },
    { id: 'is-d4', kind: 'fill', sectionId: 'indspeech-questions',
      data: { sentence: 'Hän kysyi, _____ hän _____ (tulla).', answer: 'tuleeko', hint: 'Indirect yes/no question: verb + -ko/-kö', baseForm: 'tulla' } },
    { id: 'is-d5', kind: 'translate', sectionId: 'indspeech-etta',
      data: { prompt: 'She said the winter was cold.', target: 'Hän sanoi, että talvi oli kylmä', acceptAlso: ['Hän sanoi, että talvi oli kylmä.'] } },
    { id: 'is-d6', kind: 'spot-error', sectionId: 'indspeech-etta',
      data: { sentence: 'Luulin, että hän oli kotona. (correct Finnish?)', errorWord: 'oli', correctForm: 'on',
        explanation: 'Finnish does not backshift tenses in indirect speech. "I thought he was home" = Luulin, että hän ON kotona (present, not past).' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Indirect speech', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/indirect-speech' },
    { label: 'VISK § 1476 — Epäsuora esitys', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=1476' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// CONCESSIVE & CONDITIONAL CLAUSES
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_CONCESSIVE_CLAUSES: GrammarTopic = {
  id: 'concessive-clauses',
  version: '1.0.0',
  title: 'Concessive & conditional clauses',
  subtitle: "Vaikka, jos, ellei, mikäli — although, if, unless, provided that.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 16,
  prerequisites: ['subordinate-clauses', 'conditional'],
  tags: ['syntax'],
  overview: {
    theme: "Finnish has a rich set of subordinating conjunctions for concession (vaikka — although), condition (jos — if), negative condition (ellei — unless), and formal condition (mikäli — provided that / in case that). The mood of the verb in these clauses — indicative vs. conditional — carries significant meaning.",
    grammarFocus: [
      'vaikka + indicative: although (factual concession)',
      'vaikka + conditional: even if (hypothetical)',
      'jos + indicative: if (open/real condition)',
      'jos + conditional: if (hypothetical/counterfactual)',
      'ellei/elleivät: unless (negative conditional)',
      'mikäli: provided that, in case that (formal)',
    ],
    whyItMatters: "These conjunctions are essential for complex argumentation, storytelling, and expressing nuance. 'Vaikka sataa, menen ulos' (Even though it is raining, I'll go out) vs. 'Vaikka sataisi, menisin ulos' (Even if it were raining, I'd go out) — the mood difference is not optional.",
  },
  sections: [
    {
      id: 'conc-vaikka',
      title: 'vaikka — although / even if',
      question: 'Miten vaikka-lauseet muodostetaan?',
      questionEn: 'How are vaikka-clauses formed?',
      grammarPattern:
        'vaikka + indicative = factual concession (although — the subordinate clause is true). vaikka + conditional = hypothetical concession (even if — the subordinate clause is not necessarily true).',
      examples: [
        { fi: 'Vaikka sataa, menen ulos. (indicative)', en: 'Although it is raining, I will go out. (it really is raining)' },
        { fi: 'Vaikka sataisi, menisin ulos. (conditional)', en: 'Even if it were raining, I would go out. (hypothetical)' },
        { fi: 'Hän jatkoi, vaikka oli väsynyt.', en: 'She continued, although she was tired.' },
        { fi: 'Tekisin sen, vaikka se olisikin vaikea.', en: 'I would do it, even if it were hard. (-kin adds emphasis)' },
        { fi: 'Vaikka kuinka yrittäisin, en onnistu.', en: 'However hard I try, I do not succeed.' },
      ],
      commonPitfalls: [
        'vaikka + indicative = "although" (fact). vaikka + conditional = "even if" (hypothesis). The English translations look similar but the Finnish mood changes the meaning.',
        '-kin can be added: vaikka olisikin (even if it were) — adds emphasis to the hypothetical.',
      ],
    },
    {
      id: 'conc-jos',
      title: 'jos — if (open and hypothetical)',
      question: 'Miten jos-lauseet muodostetaan?',
      questionEn: 'How are jos if-clauses formed?',
      grammarPattern:
        'jos + indicative = open/real condition (if — the condition might actually happen). jos + conditional = hypothetical condition (if — unlikely or counterfactual). Both clauses use the same mood.',
      examples: [
        { fi: 'Jos tulet, soita minulle. (indicative — real possibility)', en: "If you come, call me. (it's possible you will come)" },
        { fi: 'Jos tulisit, soittaisin sinulle. (conditional — hypothetical)', en: 'If you came, I would call you. (less likely, hypothetical)' },
        { fi: 'Jos olisin rikkaampi, ostaisin talon. (cond. perfect / conditional)', en: 'If I were richer, I would buy a house.' },
        { fi: 'Jos sataa, ota sateenvarjo.', en: 'If it rains, take an umbrella. (real condition, present)' },
      ],
      commonPitfalls: [
        'In Finnish hypothetical if-clauses, BOTH clauses use the conditional — unlike English which sometimes uses past in the if-clause and conditional in the main clause.',
        'Do not mix indicative and conditional in the same hypothetical: Jos tulisit + soittaisin (not *soitan).',
      ],
    },
    {
      id: 'conc-ellei',
      title: 'ellei / elleivät — unless',
      question: 'Miten muodostetaan ellei-lause?',
      questionEn: 'How is an "unless" clause formed?',
      grammarPattern:
        'ellei (sg) / elleivät (pl) = unless = if not. Formed from jos + negation (jos + ei → ellei). The verb in the ellei-clause is in a special negative conditional form. Alternatively: jos + ei (standard) can be used instead.',
      formula: 'ellei + verb / jos + ei + verb',
      examples: [
        { fi: 'Ellei sada, menemme ulos.', en: 'Unless it rains, we will go out.' },
        { fi: 'Ellei hän tule, aloitamme ilman häntä.', en: 'Unless he comes, we will start without him.' },
        { fi: 'En mene, ellei sinäkin tule.', en: "I won't go unless you come too." },
        { fi: 'Ellei pysähdy, kaatuu.', en: 'Unless he stops, he will fall.' },
      ],
      commonPitfalls: [
        'ellei agrees with the subject: ellei (3sg), elleivät (3pl), ellet (2sg), ellen (1sg), emme (1pl), ellette (2pl).',
        "Alternative: Jos ei sada, menemme ulos — same meaning as ellei sada. The ellei-form is slightly more formal.",
      ],
    },
    {
      id: 'conc-mikali',
      title: 'mikäli — provided that / in case that (formal)',
      question: 'Mitä mikäli tarkoittaa?',
      questionEn: 'What does mikäli mean?',
      grammarPattern:
        'mikäli is a formal conjunction meaning "provided that", "in case that", "if and only if". It implies a more specific condition than jos — the consequence strictly depends on the condition being met.',
      examples: [
        { fi: 'Tulen, mikäli saan luvan.', en: 'I will come, provided (that) I get permission.' },
        { fi: 'Mikäli tarvitset apua, ota yhteyttä.', en: 'In case you need help, get in touch.' },
        { fi: 'Sopimus solmitaan, mikäli ehdot täyttyvät.', en: 'The contract will be signed, provided that the conditions are met.' },
      ],
      commonPitfalls: [
        'mikäli is formal/written. In everyday speech, jos is always used instead.',
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'vaikka + indicative', use: '"Although" — factual concession', examples: ['Vaikka sataa, menen ulos.'], sectionRef: 'conc-vaikka' },
    { pattern: 'vaikka + conditional', use: '"Even if" — hypothetical concession', examples: ['Vaikka sataisi, menisin ulos.'], sectionRef: 'conc-vaikka' },
    { pattern: 'jos + indicative', use: '"If" — open/real condition', examples: ['Jos tulet, soita.'], sectionRef: 'conc-jos' },
    { pattern: 'jos + conditional', use: '"If" — hypothetical condition', examples: ['Jos tulisit, soittaisin.'], sectionRef: 'conc-jos' },
    { pattern: 'ellei + verb', use: '"Unless" (negative conditional)', examples: ['Ellei sada, menemme ulos.'], sectionRef: 'conc-ellei' },
    { pattern: 'mikäli + indicative', use: '"Provided that" (formal)', examples: ['Tulen, mikäli saan luvan.'], sectionRef: 'conc-mikali' },
  ],
  drills: [
    { id: 'cc-d1', kind: 'mc', sectionId: 'conc-vaikka',
      data: { prompt: '"Although it is raining, I will go out" — which form of vaikka?',
        options: ['vaikka + conditional', 'vaikka + indicative', 'vaikka + imperative', 'vaikka + past participle'], correctIndex: 1,
        explanation: 'Factual concession (it really is raining) → vaikka + indicative.' } },
    { id: 'cc-d2', kind: 'mc', sectionId: 'conc-vaikka',
      data: { prompt: '"Even if it were raining, I would go out" — which form?',
        options: ['vaikka + conditional', 'vaikka + indicative', 'jos + conditional', 'ellei'], correctIndex: 0,
        explanation: 'Hypothetical concession → vaikka + conditional: Vaikka sataisi, menisin ulos.' } },
    { id: 'cc-d3', kind: 'fill', sectionId: 'conc-jos',
      data: { sentence: 'Jos _____ (sataa, real condition), ota sateenvarjo.', answer: 'sataa', hint: 'Real/open condition: jos + indicative present', baseForm: 'sataa' } },
    { id: 'cc-d4', kind: 'transform', sectionId: 'conc-ellei',
      data: { base: 'Jos ei sada, menemme ulos.', instruction: '→ rewrite with ellei', answer: 'Ellei sada, menemme ulos.' } },
    { id: 'cc-d5', kind: 'translate', sectionId: 'conc-jos',
      data: { prompt: 'If you came, I would call you.', target: 'Jos tulisit, soittaisin sinulle', acceptAlso: ['Jos tulisit, soittaisin sinulle.'] } },
    { id: 'cc-d6', kind: 'spot-error', sectionId: 'conc-jos',
      data: { sentence: 'Jos tulisit, soitan sinulle.', errorWord: 'soitan', correctForm: 'soittaisin',
        explanation: 'Hypothetical condition: both clauses must use conditional. Jos tulisit → soittaisin (not soitan).' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Concessive clauses', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structure/concessive-clauses' },
    { label: 'VISK § 1139 — Konditionaalilause', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=1139' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// FORMAL VS. COLLOQUIAL REGISTER
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_REGISTER: GrammarTopic = {
  id: 'register-formal-colloquial',
  version: '1.0.0',
  title: 'Formal vs. colloquial register',
  subtitle: "Kirjakieli vs. puhekieli — me ollaan, mä, sä, contracted endings.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 18,
  prerequisites: ['pronouns', 'passive'],
  tags: ['syntax'],
  overview: {
    theme: "Written Finnish (kirjakieli) and spoken Finnish (puhekieli) are substantially different. Native speakers use colloquial forms constantly in everyday speech, but schools, media, and official writing use the standard language. To understand Finnish conversations, podcasts, and social media, you must know the colloquial patterns.",
    grammarFocus: [
      'Pronouns: minä/sinä → mä/sä; tämä → tää; nämä → nää; hän → se (colloquial)',
      'Possessives: minulla → mulla; sinulle → sulle; meillä → meillä (unchanged)',
      'Passive as we-form: me ollaan → me olemme; me mennään → me menemme',
      'Verb contractions: olen → oon; menet → meet; oletko → ooksä/oletko',
      'Dropped syllables: nyt → ny; sitten → sit; totta kai → tokkai',
    ],
    whyItMatters: "Without knowing colloquial Finnish, you cannot follow a normal conversation between Finns. 'Me ollaan väsyneitä' sounds completely natural to a native speaker — but learners who only know kirjakieli hear 'me olemme väsyneitä' and are confused. This is the most practical topic at B2 level.",
  },
  sections: [
    {
      id: 'reg-pronouns',
      title: 'Colloquial pronouns',
      question: 'Mitä pronomineja käytetään puhekielessä?',
      questionEn: 'What pronouns are used in colloquial Finnish?',
      grammarPattern:
        'Personal pronouns are shortened. The demonstrative tämä becomes tää. Third person hän (literary) is replaced by se (colloquial) for people as well as things. The plural nämä becomes nää, ne.',
      examples: [
        { fi: 'minä → mä  /  sinä → sä', en: 'I → mä  /  you → sä' },
        { fi: 'hän (literary) → se (colloquial, for people too)', en: 'he/she → se' },
        { fi: 'me, te, he (literary) → me, te, ne (colloquial)', en: 'we/you/they — ne replaces he in speech' },
        { fi: 'tämä → tää  /  nämä → nää  /  tuo → toi', en: 'this → tää  /  these → nää  /  that → toi' },
        { fi: 'Mä oon väsynyt. (= Minä olen väsynyt.)', en: 'I am tired.' },
        { fi: 'Se on opettaja. (referring to a person)', en: 'He/She is a teacher. (colloquial use of se)' },
      ],
      commonPitfalls: [
        'Using se for people is colloquial — in formal writing, always use hän.',
        'The colloquial mä and sä are not abbreviated minä/sinä — they are completely different forms. Do not write them in formal Finnish.',
      ],
    },
    {
      id: 'reg-passive-we',
      title: 'Passive as the we-form',
      question: 'Miten "me" ilmaistaan puhekielessä?',
      questionEn: 'How is "we" expressed in colloquial speech?',
      grammarPattern:
        "Colloquial Finnish uses the passive voice (present passive + me) instead of the 1st person plural form. This is extremely common — most spoken Finnish uses it. It sounds natural to Finns but looks unusual on paper.",
      examples: [
        { fi: 'Me olemme väsyneitä. (kirjakieli)', en: 'We are tired. (formal/literary)' },
        { fi: 'Me ollaan väsyneitä. (puhekieli)', en: 'We are tired. (colloquial — passive as we-form)' },
        { fi: 'Me menemme kauppaan. → Me mennään kauppaan.', en: "We're going to the shop." },
        { fi: 'Me söimme yhdessä. → Me syötiin yhdessä.', en: 'We ate together. (past passive as we-past)' },
        { fi: 'Me otamme / Me otetaan kahvia.', en: "We'll have coffee." },
      ],
      commonPitfalls: [
        'The colloquial we-form uses me + passive present (or past). Never use me + 1pl form in spontaneous speech — it sounds bookish.',
        'This is only "we" in practice. Grammatically it is a passive, but pragmatically it is exclusively the 1pl.',
      ],
    },
    {
      id: 'reg-contractions',
      title: 'Verb contractions and short forms',
      question: 'Miten verbejä lyhennetään puhekielessä?',
      questionEn: 'How are verbs shortened in colloquial Finnish?',
      grammarPattern:
        "Several verbs have contracted colloquial forms. The most common: olen → oon, olet → oot, on → on (unchanged), olemme → ollaan (passive), menet → meet, tulet → tuut, tuleeko → tuuko.",
      examples: [
        { fi: 'olen → oon  /  olet → oot  /  olemme → ollaan', en: 'I am → oon  /  you are → oot  /  we are → ollaan' },
        { fi: 'menet → meet  /  tulet → tuut  /  teet → teet (unchanged)', en: "you go → meet  /  you come → tuut" },
        { fi: 'ei ole → ei oo', en: "is not → ei oo" },
        { fi: 'oletko → ooksä / ootko', en: 'are you → ooksä (very colloquial) / ootko' },
        { fi: 'menenkö → meenkö', en: 'shall I go? → meenkö?' },
      ],
      commonPitfalls: [
        'These contracted forms are heard in speech but generally not written except in dialogue, social media, and informal texts.',
        'oon (1sg of olla) is completely standard in speech — using olen in conversation sounds formal or emphatic.',
      ],
    },
    {
      id: 'reg-adverbs',
      title: 'Colloquial particles and adverbs',
      question: 'Mitä puhekielen partikkeleita on?',
      questionEn: 'What colloquial particles and adverbs are common?',
      grammarPattern:
        "Many common adverbs and particles have shortened or fused colloquial forms. Knowing them is essential for understanding native speakers.",
      examples: [
        { fi: 'nyt → ny  /  sitten → sit  /  totta kai → tokkai', en: "now → ny  /  then → sit  /  of course → tokkai" },
        { fi: 'kyllä → kyl  /  ei niin → no  /  joo (= juu = yes)', en: 'yes → kyl / no yeah → no / yeah → joo' },
        { fi: 'että → et (in speech)  /  kun → ku', en: 'that → et (linking) / when/because → ku' },
        { fi: 'Mä oon ku väsynyt. (= Olen kuin väsynyt.)', en: "I'm like tired. (ku as 'like/as')" },
        { fi: "Mä en tiiä. (= En tiedä.)", en: "I don't know. (tiiä = contracted tiedä)" },
      ],
      commonPitfalls: [
        'En tiiä (not tiedä) is one of the most common colloquial phrases. You will hear it constantly.',
        'ku functions as both kun (when), koska (because), and kuin (as/like) in colloquial speech — context disambiguates.',
      ],
    },
    {
      id: 'reg-possessives',
      title: 'Colloquial possessive forms',
      question: 'Miten omistusmuodot muuttuvat puhekielessä?',
      questionEn: 'How do possessive and adessive forms change in colloquial speech?',
      grammarPattern:
        "Adessive and allative/ablative pronoun forms are contracted. The -lla/-llä adessive forms of minä, sinä merge with the adessive ending.",
      examples: [
        { fi: 'minulla → mulla  /  sinulla → sulla  /  hänellä → sillä', en: 'I have (on me) → mulla / you have → sulla / he/she has → sillä' },
        { fi: 'minulle → mulle  /  sinulle → sulle  /  hänelle → sille', en: 'to me → mulle / to you → sulle / to him/her → sille' },
        { fi: 'minulta → multa  /  sinulta → sulta', en: 'from me → multa / from you → sulta' },
        { fi: 'Mulle tuli viesti. (= Minulle tuli viesti.)', en: 'I got a message.' },
        { fi: 'Sillä on auto. (= Hänellä on auto.)', en: 'He/she has a car.' },
      ],
      commonPitfalls: [
        'meillä/teillä/heillä do not contract — only the 1sg and 2sg change: mulla, sulla.',
        'sillä on (he/she has) and sillä (adessive of se = with it/by means of it) are formally identical — context determines.',
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'minä → mä, sinä → sä', use: 'Colloquial 1sg/2sg pronouns', examples: ['Mä oon täällä.', 'Sä teet sen.'], sectionRef: 'reg-pronouns' },
    { pattern: 'hän → se (people)', use: 'Colloquial 3sg for people', examples: ['Se on opettaja.'], sectionRef: 'reg-pronouns' },
    { pattern: 'me + passive', use: 'Colloquial we-form', examples: ['me ollaan', 'me mennään', 'me syötiin'], sectionRef: 'reg-passive-we' },
    { pattern: 'olen → oon, olet → oot', use: 'Contracted olla forms', examples: ['Mä oon väsynyt.', 'Ooksä kotona?'], sectionRef: 'reg-contractions' },
    { pattern: 'minulla → mulla, sinulle → sulle', use: 'Contracted adessive/allative pronouns', examples: ['Mulle tuli viesti.', 'Sillä on auto.'], sectionRef: 'reg-possessives' },
  ],
  drills: [
    { id: 'reg-d1', kind: 'transform', sectionId: 'reg-passive-we',
      data: { base: 'Me olemme väsyneitä.', instruction: '→ colloquial puhekieli form', answer: 'Me ollaan väsyneitä.' } },
    { id: 'reg-d2', kind: 'transform', sectionId: 'reg-pronouns',
      data: { base: 'Minä olen kotona.', instruction: '→ colloquial form', answer: 'Mä oon kotona.' } },
    { id: 'reg-d3', kind: 'mc', sectionId: 'reg-passive-we',
      data: { prompt: 'The colloquial equivalent of "Me menemme kauppaan" is…',
        options: ['Me mennään kauppaan.', 'Me menkää kauppaan.', 'Me mene kauppaan.', 'Me menimme kauppaan.'], correctIndex: 0,
        explanation: 'Colloquial we-form = me + passive present: me mennään.' } },
    { id: 'reg-d4', kind: 'fill', sectionId: 'reg-possessives',
      data: { sentence: 'Minulla on koira. → _____ on koira. (colloquial)', answer: 'Mulla', hint: 'minulla → mulla in colloquial speech', baseForm: 'minulla' } },
    { id: 'reg-d5', kind: 'mc', sectionId: 'reg-contractions',
      data: { prompt: 'Colloquial form of "olen"?',
        options: ['oon', 'on', 'ole', 'olen'], correctIndex: 0,
        explanation: 'olen → oon in colloquial speech (1sg of olla).' } },
    { id: 'reg-d6', kind: 'translate', sectionId: 'reg-pronouns',
      data: { prompt: 'In colloquial Finnish: "She is a teacher" (use se)', target: 'Se on opettaja', acceptAlso: ['Se on opettaja.'] } },
  ],
  sources: [
    { label: 'Uusi kielemme — Colloquial Finnish', url: 'https://uusikielemme.fi/spoken-language-features' },
    { label: 'VISK § 1251 — Puhuttu kieli', url: 'http://scripta.kotus.fi/visk/sisallys.php?p=1251' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT
// ─────────────────────────────────────────────────────────────────────────────
export const SYNTAX_TOPICS: GrammarTopic[] = [
  TOPIC_WORD_ORDER,
  TOPIC_QUESTIONS,
  TOPIC_QUESTION_PARTICLE,
  TOPIC_SUBORDINATE_CLAUSES,
  TOPIC_RELATIVE_CLAUSES,
  TOPIC_COMPARATIVE,
  TOPIC_PRONOUNS,
  TOPIC_POSSESSIVE_SUFFIXES,
  TOPIC_PARTICIPLE_CLAUSES,
  TOPIC_INDIRECT_SPEECH,
  TOPIC_CONCESSIVE_CLAUSES,
  TOPIC_REGISTER,
];
