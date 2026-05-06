import type { GrammarTopic } from './types';

// ─────────────────────────────────────────────────────────────────────────────
// 1. VERB TYPES 1–6
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_VERB_TYPES: GrammarTopic = {
  id: 'verb-types',
  version: '1.0.0',
  title: 'Verb types 1–6',
  subtitle: 'The gateway to every conjugation.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 15,
  prerequisites: [],
  tags: ['verbs'],
  overview: {
    theme: 'Finnish verbs are grouped into six types based on their infinitive ending. Knowing the type immediately tells you how to find the stem and apply personal endings.',
    grammarFocus: [
      'Type 1: -Vn infinitive (sanoa, asua, soittaa) — drop -a/-ä',
      'Type 2: -dA infinitive (syödä, juoda) — drop -da/-dä',
      'Type 3: -llA/-nnA/-rrA/-stA infinitive (tulla, mennä) — drop vowel + consonant cluster',
      'Type 4: -Ata/-ätä infinitive (haluta, pelata) — remove -ta/-tä → -a/-ä',
      'Type 5: -ita/-itä infinitive (tarvita) — remove -ta/-tä → -itse-',
      'Type 6: -eta/-etä infinitive (paeta, vanheta) — remove -ta/-tä → -ene-',
    ],
    whyItMatters: 'Every conjugation rule in Finnish references the verb type. Learn to recognise the type from the infinitive and you can conjugate any verb in any tense.',
  },
  sections: [
    {
      id: 'type1',
      title: 'Type 1 — -aa/-ää, -oa/-öä, -ua/-yä, -ia/-iä',
      question: 'Mikä on verbityypin 1 vartalo?',
      questionEn: 'How do I find the stem of a Type 1 verb?',
      grammarPattern: 'Drop the final -a/-ä from the infinitive. Most Finnish verbs are Type 1.',
      formula: 'infinitive − a/ä = present stem',
      morphology: {
        surface: 'sanoa → sano-',
        stem: 'sano',
        ending: '-a',
        breakdown: [
          { token: 'sano', role: 'stem', note: 'present stem' },
          { token: 'a', role: 'ending', note: 'infinitive ending, dropped to get stem' },
        ],
      },
      examples: [
        { fi: 'sanoa → sano- (puhua, lukea, asua, soittaa → soita-)', en: 'to say → say- (to speak, to read, to live, to play)' },
        { fi: 'minä sano-n, sinä sano-t, hän sano-o', en: 'I say, you say, he/she says' },
        { fi: 'minä lue-n, sinä lue-t, hän luke-e', en: 'I read, you read, he/she reads (note stem alternation in 3rd sg)' },
        { fi: 'Hän asuu Helsingissä.', en: 'She lives in Helsinki.' },
        { fi: 'Soitan kitaraa.', en: 'I play the guitar.' },
      ],
      commonPitfalls: [
        'In 3rd person singular, the stem vowel doubles: sano → sanoo, lue → lukee (stem change), asu → asuu.',
        'Some Type 1 verbs have consonant-gradation stems: lukea → lue- (present), but luen (1sg), luet (2sg), lukee (3sg).',
      ],
    },
    {
      id: 'type2',
      title: 'Type 2 — -da/-dä',
      question: 'Mikä on verbityypin 2 vartalo?',
      questionEn: 'How do I find the stem of a Type 2 verb?',
      grammarPattern: 'Drop the final -da/-dä from the infinitive. The stem ends in a long vowel or diphthong.',
      formula: 'infinitive − da/dä = stem',
      morphology: {
        surface: 'syödä → syö-',
        stem: 'syö',
        ending: '-dä',
        breakdown: [
          { token: 'syö', role: 'stem', note: 'present stem (long vowel preserved)' },
          { token: 'dä', role: 'ending', note: 'Type 2 infinitive ending' },
        ],
      },
      examples: [
        { fi: 'syödä → syö-', en: 'to eat → eat-' },
        { fi: 'juoda → juo-', en: 'to drink → drink-' },
        { fi: 'tehdä → tee- / teke-', en: 'to do/make → do- (irregular; tekee in 3sg)' },
        { fi: 'minä syö-n, sinä syö-t, hän syö', en: 'I eat, you eat, he/she eats (no ending in 3sg)' },
        { fi: 'Juon kahvia aamulla.', en: 'I drink coffee in the morning.' },
      ],
      commonPitfalls: [
        'In 3rd person singular, no personal ending is added — the stem stands alone: hän syö, hän juo.',
        'tehdä is irregular: present stem is teke- for most forms, but tee- in 3sg (tekee).',
      ],
    },
    {
      id: 'type3',
      title: 'Type 3 — -lla/-llä, -nna/-nnä, -rra/-rrä, -sta/-stä',
      question: 'Mikä on verbityypin 3 vartalo?',
      questionEn: 'How do I find the stem of a Type 3 verb?',
      grammarPattern: 'The infinitive ends in a vowel + consonant cluster + -a/-ä. Drop the final -la/-lä (etc.) and the preceding short vowel to get the stem; then add -e-.',
      formula: 'stem = infinitive minus final syllable, replace with -e-',
      morphology: {
        surface: 'tulla → tule-',
        stem: 'tule',
        ending: '-lla',
        breakdown: [
          { token: 'tul', role: 'stem', note: 'root consonants' },
          { token: 'e', role: 'ending', note: 'connecting vowel in present stem' },
          { token: 'la', role: 'ending', note: 'Type 3 infinitive ending (dropped)' },
        ],
      },
      examples: [
        { fi: 'tulla → tule-', en: 'to come → come-' },
        { fi: 'mennä → mene-', en: 'to go → go-' },
        { fi: 'olla → ole-', en: 'to be → be-' },
        { fi: 'pestä → pese-', en: 'to wash → wash-' },
        { fi: 'Hän tulee kotiin.', en: 'She comes home.' },
      ],
      commonPitfalls: [
        'olla is irregular in the present: olen, olet, on, olemme, olette, ovat — the 3sg is on, not *olee.',
        'The infinitive of Type 3 verbs can end in -lla, -nnä, -rrä, -sta, -nta, -rta — all map to the -e- stem pattern.',
      ],
    },
    {
      id: 'type4',
      title: 'Type 4 — -ata/-ätä, -ota/-ötä, -uta/-ytä',
      question: 'Mikä on verbityypin 4 vartalo?',
      questionEn: 'How do I find the stem of a Type 4 verb?',
      grammarPattern: 'Remove the final -ta/-tä from the infinitive, leaving a vowel. Add -a/-ä to get the stem for most forms.',
      formula: 'infinitive − ta/tä + aa/ää = stem used in 3sg etc.',
      morphology: {
        surface: 'haluta → halua-',
        stem: 'halua',
        ending: '-ta',
        breakdown: [
          { token: 'halu', role: 'stem', note: 'root' },
          { token: 'a', role: 'gradation', note: 'connecting vowel' },
          { token: 'ta', role: 'ending', note: 'Type 4 infinitive ending, dropped' },
        ],
      },
      examples: [
        { fi: 'haluta → halua-', en: 'to want → want-' },
        { fi: 'pelata → pelaa-', en: 'to play (a game) → play-' },
        { fi: 'tavata → tapaa-', en: 'to meet → meet- (consonant gradation t → p)' },
        { fi: 'minä halua-n, hän halua-a', en: 'I want, he/she wants' },
        { fi: 'Pelaatko jalkapalloa?', en: 'Do you play football?' },
      ],
      commonPitfalls: [
        'tavata → tapaa- has consonant gradation (t → p). This is a Type 4 verb despite the irregular-looking stem change.',
        'In 3rd person singular the stem vowel doubles: halua → haluaa.',
      ],
    },
    {
      id: 'type5',
      title: 'Type 5 — -ita/-itä',
      question: 'Mikä on verbityypin 5 vartalo?',
      questionEn: 'How do I find the stem of a Type 5 verb?',
      grammarPattern: 'Remove -ta/-tä; the remaining -it- expands to -itse- in the present tense stem.',
      formula: 'infinitive: -ita → present stem: -itse-',
      morphology: {
        surface: 'tarvita → tarvitse-',
        stem: 'tarvitse',
        ending: '-ta',
        breakdown: [
          { token: 'tarvi', role: 'stem', note: 'root' },
          { token: 'tse', role: 'gradation', note: '-it- → -itse- expansion' },
          { token: 'ta', role: 'ending', note: 'Type 5 infinitive ending, replaced' },
        ],
      },
      examples: [
        { fi: 'tarvita → tarvitse-', en: 'to need → need-' },
        { fi: 'häiritä → häiritse-', en: 'to disturb → disturb-' },
        { fi: 'minä tarvitse-n apua', en: 'I need help' },
        { fi: 'hän häiritse-e minua', en: 'he/she disturbs me' },
      ],
      commonPitfalls: [
        'The -it- → -itse- expansion only applies in the present tense. In the imperfect you see tarvitsi-.',
        'There are relatively few Type 5 verbs; tarvita and häiritä are the most common.',
      ],
    },
    {
      id: 'type6',
      title: 'Type 6 — -eta/-etä',
      question: 'Mikä on verbityypin 6 vartalo?',
      questionEn: 'How do I find the stem of a Type 6 verb?',
      grammarPattern: 'Remove -ta/-tä; the remaining -e- expands to -ene- in the present tense stem.',
      formula: 'infinitive: -eta → present stem: -ene-',
      morphology: {
        surface: 'vanheta → vanhene-',
        stem: 'vanhene',
        ending: '-ta',
        breakdown: [
          { token: 'vanhe', role: 'stem', note: 'root (old/age)' },
          { token: 'ne', role: 'gradation', note: '-e- → -ene- expansion' },
          { token: 'ta', role: 'ending', note: 'Type 6 infinitive ending, replaced' },
        ],
      },
      examples: [
        { fi: 'vanheta → vanhene-', en: 'to grow old → age-' },
        { fi: 'paeta → pakene-', en: 'to flee → flee- (consonant gradation p → k)' },
        { fi: 'hän vanhene-e nopeasti', en: 'he/she is ageing fast' },
        { fi: 'he pakenevat vaaraa', en: 'they flee danger' },
      ],
      commonPitfalls: [
        'paeta has consonant gradation: paeta → pakene- (p → k in the stem).',
        'Type 6 verbs are mostly intransitive verbs of change of state (becoming older, bigger, etc.).',
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'Type 1 (-Vn/-Vä)', use: 'Drop -a/-ä; 3sg doubles stem vowel', examples: ['sanoa → sano-', 'lukea → luke-'], sectionRef: 'type1' },
    { pattern: 'Type 2 (-da/-dä)', use: 'Drop -da/-dä; 3sg = bare stem', examples: ['syödä → syö-', 'juoda → juo-'], sectionRef: 'type2' },
    { pattern: 'Type 3 (-lla etc.)', use: 'Drop last syllable + add -e-', examples: ['tulla → tule-', 'mennä → mene-'], sectionRef: 'type3' },
    { pattern: 'Type 4 (-ata/-ätä)', use: 'Drop -ta/-tä; stem doubles vowel in 3sg', examples: ['haluta → halua-', 'pelata → pelaa-'], sectionRef: 'type4' },
    { pattern: 'Type 5 (-ita/-itä)', use: '-it- → -itse- in present', examples: ['tarvita → tarvitse-'], sectionRef: 'type5' },
    { pattern: 'Type 6 (-eta/-etä)', use: '-e- → -ene- in present', examples: ['vanheta → vanhene-'], sectionRef: 'type6' },
  ],
  drills: [
    { id: 'vt-d1', kind: 'mc', sectionId: 'type1',
      data: { prompt: 'What is the present stem of "puhua" (to speak)?', options: ['puhu-', 'puha-', 'puhuu-', 'puhua-'], correctIndex: 0, explanation: 'Type 1: drop -a → puhu-.' } },
    { id: 'vt-d2', kind: 'transform', sectionId: 'type1',
      data: { base: 'lukea', instruction: '→ present stem (Type 1)', answer: 'luke-' } },
    { id: 'vt-d3', kind: 'mc', sectionId: 'type2',
      data: { prompt: 'What type is "juoda"?', options: ['Type 1', 'Type 2', 'Type 3', 'Type 4'], correctIndex: 1, explanation: 'juoda ends in -da → Type 2.' } },
    { id: 'vt-d4', kind: 'transform', sectionId: 'type2',
      data: { base: 'syödä', instruction: '→ present stem (Type 2)', answer: 'syö-' } },
    { id: 'vt-d5', kind: 'transform', sectionId: 'type3',
      data: { base: 'tulla', instruction: '→ present stem (Type 3)', answer: 'tule-' } },
    { id: 'vt-d6', kind: 'fill', sectionId: 'type3',
      data: { sentence: 'mennä → _____ (present stem)', answer: 'mene-', hint: 'Type 3: drop final syllable, add -e-', baseForm: 'mennä' } },
    { id: 'vt-d7', kind: 'transform', sectionId: 'type4',
      data: { base: 'haluta', instruction: '→ present stem (Type 4)', answer: 'halua-' } },
    { id: 'vt-d8', kind: 'mc', sectionId: 'type5',
      data: { prompt: 'What is the present stem of "tarvita"?', options: ['tarvi-', 'tarvita-', 'tarvitse-', 'tarvitsi-'], correctIndex: 2 } },
    { id: 'vt-d9', kind: 'table', sectionId: 'type1',
      data: {
        headers: ['Infinitive', 'Type', 'Present stem'],
        rows: [
          { label: 'sanoa',   cells: [{ value: 'sanoa',   blank: false }, { value: '1', blank: false }, { value: 'sano-',    blank: true }] },
          { label: 'syödä',   cells: [{ value: 'syödä',   blank: false }, { value: '2', blank: false }, { value: 'syö-',     blank: true }] },
          { label: 'tulla',   cells: [{ value: 'tulla',   blank: false }, { value: '3', blank: false }, { value: 'tule-',    blank: true }] },
          { label: 'pelata',  cells: [{ value: 'pelata',  blank: false }, { value: '4', blank: false }, { value: 'pelaa-',   blank: true }] },
          { label: 'tarvita', cells: [{ value: 'tarvita', blank: false }, { value: '5', blank: false }, { value: 'tarvitse-', blank: true }] },
        ],
      } },
    { id: 'vt-d10', kind: 'spot-error', sectionId: 'type2',
      data: { sentence: 'hän syödä kahvia', errorWord: 'syödä', correctForm: 'syö',
        explanation: '3rd person singular of Type 2 verb syödä is bare stem: hän syö.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Verb types', url: 'https://uusikielemme.fi/finnish-grammar/verbs/verb-types' },
    { label: 'Wiktionary — Finnish conjugation', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_verb_conjugation' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. PRESENT TENSE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_PRESENT_TENSE: GrammarTopic = {
  id: 'present-tense',
  version: '1.0.0',
  title: 'Present tense',
  subtitle: 'I do / I am doing — Finnish has just one present.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 14,
  prerequisites: ['verb-types'],
  tags: ['verbs'],
  overview: {
    theme: 'Finnish has a single present tense that covers both "I do" and "I am doing". The personal endings attach directly to the present stem found by removing the infinitive ending.',
    grammarFocus: [
      'Personal endings: -n (1sg), -t (2sg), -∅ (3sg, stem vowel doubles), -mme (1pl), -tte (2pl), -vAt (3pl)',
      'Finding the stem from the verb type',
      'Type 1 and Type 4 verbs in present',
      'Type 2 and Type 3 verbs in present',
      'Irregular verb olla (to be)',
    ],
    whyItMatters: 'The present tense is the first thing you need in Finnish. Every other tense builds on the stem you learn here.',
  },
  sections: [
    {
      id: 'personal-endings',
      title: 'Personal endings',
      question: 'Mitkä ovat persoonapäätteet?',
      questionEn: 'What are the personal endings?',
      grammarPattern: 'Add the personal ending to the present stem. The 3rd person singular is special: no ending is added, but the final stem vowel is doubled.',
      formula: 'stem + -n / -t / -∅(double vowel) / -mme / -tte / -vAt',
      morphology: {
        surface: 'sano-n',
        stem: 'sano',
        ending: '-n',
        breakdown: [
          { token: 'sano', role: 'stem', note: 'present stem of sanoa' },
          { token: 'n', role: 'ending', note: '1st person singular ending' },
        ],
      },
      examples: [
        { fi: 'minä sano-n, sinä sano-t, hän sano-o', en: 'I say, you say, he/she says' },
        { fi: 'me sano-mme, te sano-tte, he sano-vat', en: 'we say, you (pl) say, they say' },
        { fi: 'Puhutko suomea?', en: 'Do you speak Finnish?' },
        { fi: 'He opiskelevat yhdessä.', en: 'They study together.' },
      ],
      commonPitfalls: [
        'In 3rd sg, the last stem vowel doubles: sano → sanoo, pure → purree (not *sanon, *purren).',
        'The pronoun (minä, sinä…) is usually dropped in speech — the ending carries the meaning.',
      ],
    },
    {
      id: 'type1-present',
      title: 'Type 1 verbs in present',
      question: 'Miten tyyppi 1 verbit taipuvat preesenssissä?',
      questionEn: 'How do Type 1 verbs conjugate in the present?',
      grammarPattern: 'Stem = infinitive minus -a/-ä. Add personal endings. 3sg doubles the final vowel.',
      examples: [
        { fi: 'puhua: puhu-n, puhu-t, puhu-u, puhu-mme, puhu-tte, puhu-vat', en: 'to speak: I speak, you speak, she speaks, we speak, you speak, they speak' },
        { fi: 'lukea: lue-n, lue-t, luke-e, lue-mme, lue-tte, luke-vat', en: 'to read: I read, you read, she reads, we read, you read, they read' },
        { fi: 'asua: asu-n, asu-t, asu-u, asu-mme, asu-tte, asu-vat', en: 'to live: I live, you live, she lives, we live, you live, they live' },
      ],
      commonPitfalls: [
        'lukea has a weak-grade stem lue- in 1sg/2sg/1pl/2pl but strong-grade luke- in 3sg and 3pl.',
      ],
    },
    {
      id: 'type23-present',
      title: 'Type 2 and Type 3 verbs in present',
      question: 'Miten tyyppien 2 ja 3 verbit taipuvat?',
      questionEn: 'How do Type 2 and Type 3 verbs conjugate?',
      grammarPattern: 'Type 2 (-dA): stem = infinitive − da/dä, 3sg = bare stem. Type 3 (-llA etc.): stem = root + -e-, 3sg doubles vowel.',
      examples: [
        { fi: 'syödä: syö-n, syö-t, syö, syö-mme, syö-tte, syö-vät', en: 'to eat: I eat, you eat, she eats, we eat, you eat, they eat' },
        { fi: 'juoda: juo-n, juo-t, juo, juo-mme, juo-tte, juo-vat', en: 'to drink: I drink, you drink, she drinks, we drink, you drink, they drink' },
        { fi: 'tulla: tule-n, tule-t, tule-e, tule-mme, tule-tte, tule-vat', en: 'to come: I come, you come, she comes, we come, you come, they come' },
        { fi: 'mennä: mene-n, mene-t, mene-e, mene-mme, mene-tte, mene-vät', en: 'to go: I go, you go, she goes, we go, you go, they go' },
      ],
      commonPitfalls: [
        'Type 2 3sg has NO ending and NO vowel doubling — hän syö, hän juo (not *syöö, *juoo).',
      ],
    },
    {
      id: 'olla-present',
      title: 'Irregular: olla (to be)',
      question: 'Miten olla-verbi taipuu?',
      questionEn: 'How does olla (to be) conjugate?',
      grammarPattern: 'olla is Type 3 but has an irregular 3sg form: on (not *olee). All other forms are regular.',
      examples: [
        { fi: 'olen, olet, on, olemme, olette, ovat', en: 'I am, you are, he/she is, we are, you are, they are' },
        { fi: 'Olen opettaja.', en: 'I am a teacher.' },
        { fi: 'Hän on väsynyt.', en: 'She is tired.' },
        { fi: 'Olemme kotona.', en: 'We are at home.' },
      ],
      commonPitfalls: [
        '3sg is on, not *olee. This is the single most important irregular form to memorise.',
        'olla also combines with adessive for possession: Minulla on koira. (I have a dog.)',
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -n',   use: '1st person singular (minä)', examples: ['sanon', 'tulen', 'olen'] },
    { pattern: 'stem + -t',   use: '2nd person singular (sinä)', examples: ['sanot', 'tulet', 'olet'] },
    { pattern: 'stem + V+V',  use: '3rd person singular (hän/se) — vowel doubled', examples: ['sanoo', 'tulee', 'syö (no doubling in Type 2)'] },
    { pattern: 'stem + -mme', use: '1st person plural (me)', examples: ['sanomme', 'tulemme', 'olemme'] },
    { pattern: 'stem + -tte', use: '2nd person plural (te)', examples: ['sanotte', 'tulette', 'olette'] },
    { pattern: 'stem + -vAt', use: '3rd person plural (he/ne)', examples: ['sanovat', 'tulevat', 'ovat'] },
  ],
  drills: [
    { id: 'pres-d1', kind: 'table', sectionId: 'personal-endings',
      data: {
        headers: ['Person', 'sanoa (to say)', 'tulla (to come)'],
        rows: [
          { label: 'minä',  cells: [{ value: 'minä',  blank: false }, { value: 'sanon',   blank: true }, { value: 'tulen',   blank: true }] },
          { label: 'sinä',  cells: [{ value: 'sinä',  blank: false }, { value: 'sanot',   blank: true }, { value: 'tulet',   blank: true }] },
          { label: 'hän',   cells: [{ value: 'hän',   blank: false }, { value: 'sanoo',   blank: true }, { value: 'tulee',   blank: true }] },
          { label: 'me',    cells: [{ value: 'me',    blank: false }, { value: 'sanomme', blank: true }, { value: 'tulemme', blank: true }] },
          { label: 'te',    cells: [{ value: 'te',    blank: false }, { value: 'sanotte', blank: true }, { value: 'tulette', blank: true }] },
          { label: 'he',    cells: [{ value: 'he',    blank: false }, { value: 'sanovat', blank: true }, { value: 'tulevat', blank: true }] },
        ],
      } },
    { id: 'pres-d2', kind: 'fill', sectionId: 'type1-present',
      data: { sentence: 'Hän _____ (puhua) hyvin suomea.', answer: 'puhuu', hint: '3sg: stem puhu- + doubles to puhu-u', baseForm: 'puhua' } },
    { id: 'pres-d3', kind: 'fill', sectionId: 'type23-present',
      data: { sentence: 'Me _____ (syödä) illallista.', answer: 'syömme', hint: 'Type 2 1pl: syö + mme', baseForm: 'syödä' } },
    { id: 'pres-d4', kind: 'fill', sectionId: 'olla-present',
      data: { sentence: 'Hän _____ väsynyt.', answer: 'on', hint: 'Irregular 3sg of olla', baseForm: 'olla' } },
    { id: 'pres-d5', kind: 'transform', sectionId: 'type1-present',
      data: { base: 'lukea (3sg)', instruction: '→ present tense 3sg', answer: 'lukee' } },
    { id: 'pres-d6', kind: 'mc', sectionId: 'type23-present',
      data: { prompt: '3rd person singular of "syödä"?', options: ['syödä', 'syöö', 'syö', 'syöy'], correctIndex: 2, explanation: 'Type 2: 3sg = bare stem, no ending and no doubling.' } },
    { id: 'pres-d7', kind: 'translate', sectionId: 'olla-present',
      data: { prompt: 'We are at home.', target: 'Olemme kotona', acceptAlso: ['Me olemme kotona', 'Me olemme kotona.', 'Olemme kotona.'] } },
    { id: 'pres-d8', kind: 'spot-error', sectionId: 'olla-present',
      data: { sentence: 'Hän olee opettaja.', errorWord: 'olee', correctForm: 'on', explanation: '3sg of olla is on, not *olee.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Present tense', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-present-tense' },
    { label: 'Wiktionary — Finnish verb conjugation', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_verb_conjugation' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. NEGATION
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_NEGATION: GrammarTopic = {
  id: 'negation',
  version: '1.0.0',
  title: 'Negation',
  subtitle: 'Finnish negates with a conjugating verb.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: ['present-tense'],
  tags: ['verbs', 'syntax'],
  overview: {
    theme: 'In Finnish, negation is expressed by the negative auxiliary verb (ei-verb) which conjugates for person, followed by the negative stem of the main verb. Objects shift to partitive.',
    grammarFocus: [
      'Negative verb: en / et / ei / emme / ette / eivät',
      'Negative stem: present stem minus the personal ending',
      'Negative of olla: ei ole',
      'Objects in negative sentences → partitive',
    ],
    whyItMatters: 'Finnish negation is fundamentally different from English "not". The negative word is a full verb that inflects. Mastering this unlocks all tenses in the negative.',
  },
  sections: [
    {
      id: 'neg-verb',
      title: 'The negative verb en/et/ei…',
      question: 'Mikä on kieltosana?',
      questionEn: 'What is the negative word?',
      grammarPattern: 'The negative auxiliary conjugates for person. It is followed by the bare negative stem of the main verb (= present stem, no personal ending).',
      morphology: {
        surface: 'en puhu',
        stem: 'e',
        ending: '-n',
        breakdown: [
          { token: 'e', role: 'stem', note: 'stem of the negative verb' },
          { token: 'n', role: 'ending', note: '1st person singular ending on the negative verb' },
          { token: 'puhu', role: 'other', note: 'negative stem of puhua (= present stem without ending)' },
        ],
      },
      examples: [
        { fi: 'en puhu, et puhu, ei puhu, emme puhu, ette puhu, eivät puhu', en: "I don't speak, you don't speak, she doesn't speak, we don't speak, you don't speak, they don't speak" },
        { fi: 'En ymmärrä.', en: "I don't understand." },
        { fi: 'Eivät he ymmärrä.', en: "They don't understand." },
      ],
      commonPitfalls: [
        'The main verb does NOT take a personal ending — it stays as the bare stem: en puhu (not *en puhun).',
        'ei is the most common form (3sg). Do not use "ei" for all persons.',
      ],
    },
    {
      id: 'negative-stem',
      title: 'Negative stem',
      question: 'Mikä on kieltomuodon vartalo?',
      questionEn: 'What is the negative stem?',
      grammarPattern: 'The negative stem is the same as the present stem (without any personal ending). For Type 1 verbs it ends in the stem vowel; for Type 3 it ends in -e.',
      examples: [
        { fi: 'sanoa → sano (en sano)', en: "to say → say- (I don't say)" },
        { fi: 'tulla → tule (ei tule)', en: "to come → come- (she doesn't come)" },
        { fi: 'syödä → syö (et syö)', en: "to eat → eat- (you don't eat)" },
        { fi: 'tarvita → tarvitse (emme tarvitse)', en: "to need → need- (we don't need)" },
        { fi: 'En halua kahvia.', en: "I don't want coffee." },
      ],
    },
    {
      id: 'ei-ole',
      title: 'Ei ole — "to not have / to not be"',
      question: 'Miten kielletään olla-verbi?',
      questionEn: 'How is olla negated?',
      grammarPattern: 'The negative of on is ei ole. For other persons: en ole, et ole, emme ole, ette ole, eivät ole.',
      examples: [
        { fi: 'Hän ei ole kotona.', en: 'She is not at home.' },
        { fi: 'Minulla ei ole autoa.', en: "I don't have a car. (lit. 'on me is not car')" },
        { fi: 'Meillä ei ole aikaa.', en: "We don't have time." },
        { fi: 'Se ei ole totta.', en: "That is not true." },
      ],
      commonPitfalls: [
        'Possession: positive = minulla on + nominative; negative = minulla ei ole + partitive.',
      ],
    },
    {
      id: 'neg-partitive',
      title: 'Negation forces partitive on the object',
      question: 'Miksi kieltomuodossa käytetään partitiivia?',
      questionEn: 'Why does negation force partitive?',
      grammarPattern: 'In negative sentences, the direct object always takes the partitive case (never accusative/nominative).',
      examples: [
        { fi: 'Ostan leivän. → En osta leipää.', en: "I'm buying the bread. → I'm not buying bread." },
        { fi: 'Näen auton. → En näe autoa.', en: "I see the car. → I don't see the car." },
        { fi: 'Minulla on kahvi. → Minulla ei ole kahvia.', en: "I have coffee. → I don't have coffee." },
      ],
      commonPitfalls: [
        'The switch nominative/accusative → partitive in negatives is automatic. When in doubt in a negative sentence: use partitive.',
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'en + stem',    use: '1sg negative', examples: ['en puhu', 'en ole'] },
    { pattern: 'et + stem',    use: '2sg negative', examples: ['et puhu', 'et ole'] },
    { pattern: 'ei + stem',    use: '3sg negative', examples: ['ei puhu', 'ei ole'] },
    { pattern: 'emme + stem',  use: '1pl negative', examples: ['emme puhu', 'emme ole'] },
    { pattern: 'ette + stem',  use: '2pl negative', examples: ['ette puhu', 'ette ole'] },
    { pattern: 'eivät + stem', use: '3pl negative', examples: ['eivät puhu', 'eivät ole'] },
  ],
  drills: [
    { id: 'neg-d1', kind: 'transform', sectionId: 'neg-verb',
      data: { base: 'Hän puhuu suomea.', instruction: '→ negate (3sg)', answer: 'Hän ei puhu suomea.' } },
    { id: 'neg-d2', kind: 'fill', sectionId: 'neg-verb',
      data: { sentence: 'Me _____ _____ (tulla) tänään.', answer: 'emme tule', hint: '1pl neg verb + negative stem of tulla', baseForm: 'emme tulla' } },
    { id: 'neg-d3', kind: 'mc', sectionId: 'neg-verb',
      data: { prompt: '"They don\'t eat" = ?', options: ['he ei syövät', 'eivät syö', 'he eivät syödä', 'eivät syödä'], correctIndex: 1 } },
    { id: 'neg-d4', kind: 'fill', sectionId: 'ei-ole',
      data: { sentence: 'Minulla _____ _____ kahvia.', answer: 'ei ole', hint: 'negative of minulla on', baseForm: 'olla' } },
    { id: 'neg-d5', kind: 'transform', sectionId: 'neg-partitive',
      data: { base: 'Ostan leivän.', instruction: '→ negate (object → partitive)', answer: 'En osta leipää.' } },
    { id: 'neg-d6', kind: 'spot-error', sectionId: 'neg-verb',
      data: { sentence: 'En puhun suomea.', errorWord: 'puhun', correctForm: 'puhu', explanation: 'After the negative verb, the main verb takes bare stem — no personal ending.' } },
    { id: 'neg-d7', kind: 'translate', sectionId: 'ei-ole',
      data: { prompt: 'We do not have time.', target: 'Meillä ei ole aikaa', acceptAlso: ['Meillä ei ole aikaa.'] } },
    { id: 'neg-d8', kind: 'table', sectionId: 'neg-verb',
      data: {
        headers: ['Person', 'Neg. verb', 'puhua'],
        rows: [
          { label: 'minä', cells: [{ value: 'minä', blank: false }, { value: 'en', blank: true }, { value: 'puhu', blank: false }] },
          { label: 'sinä', cells: [{ value: 'sinä', blank: false }, { value: 'et', blank: true }, { value: 'puhu', blank: false }] },
          { label: 'hän',  cells: [{ value: 'hän',  blank: false }, { value: 'ei', blank: true }, { value: 'puhu', blank: false }] },
          { label: 'me',   cells: [{ value: 'me',   blank: false }, { value: 'emme', blank: true }, { value: 'puhu', blank: false }] },
          { label: 'te',   cells: [{ value: 'te',   blank: false }, { value: 'ette', blank: true }, { value: 'puhu', blank: false }] },
          { label: 'he',   cells: [{ value: 'he',   blank: false }, { value: 'eivät', blank: true }, { value: 'puhu', blank: false }] },
        ],
      } },
  ],
  sources: [
    { label: 'Uusi kielemme — Negation', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-negative-verb' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. IMPERFECT TENSE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_IMPERFECT: GrammarTopic = {
  id: 'imperfect',
  version: '1.0.0',
  title: 'Imperfect tense',
  subtitle: "Simple past — 'I did, I went, I drank.'",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 16,
  prerequisites: ['present-tense'],
  tags: ['verbs'],
  overview: {
    theme: "The Finnish imperfect (simple past) is formed by inserting the marker -i- between the stem and the personal ending. Several stem changes occur before -i-.",
    grammarFocus: [
      'Imperfect marker: -i- inserted before personal endings',
      'Stem changes: final -a/-ä often drops before -i-; long vowels shorten',
      'Irregular imperfect: olla → oli, tulla → tuli, mennä → meni',
      'Object case in imperfect positive sentences',
    ],
    whyItMatters: "The simple past is essential for telling stories and describing completed events. The stem changes are the main difficulty.",
  },
  sections: [
    {
      id: 'imperfect-marker',
      title: 'The -i- marker',
      question: 'Miten imperfekti muodostetaan?',
      questionEn: 'How is the imperfect formed?',
      grammarPattern: 'Insert -i- between the present stem and the personal ending. In 3sg the stem vowel does NOT double; the -i- itself serves.',
      formula: 'stem + -i- + personal ending',
      morphology: {
        surface: 'puhu-i-n',
        stem: 'puhu',
        ending: '-in',
        breakdown: [
          { token: 'puhu', role: 'stem', note: 'present stem of puhua' },
          { token: 'i',    role: 'gradation', note: 'imperfect marker' },
          { token: 'n',    role: 'ending', note: '1st person singular ending' },
        ],
      },
      examples: [
        { fi: 'puhuin, puhuit, puhui, puhuimme, puhuitte, puhuivat', en: 'I spoke, you spoke, he/she spoke, we spoke, you spoke, they spoke' },
        { fi: 'Söin omenaa.', en: 'I ate an apple.' },
        { fi: 'Keitimme kahvia.', en: 'We made coffee.' },
      ],
      commonPitfalls: [
        "3sg imperfect has no double vowel — just stem + i: puhui (not *puhuii).",
        "The same personal endings as present attach after -i-: -n, -t, -∅, -mme, -tte, -vAt.",
      ],
    },
    {
      id: 'imperfect-stem-changes',
      title: 'Stem changes before -i-',
      question: 'Mitä vartalossa tapahtuu ennen -i-:tä?',
      questionEn: 'What changes happen in the stem before -i-?',
      grammarPattern: 'Final -a/-ä usually drops before -i-. Long vowels (aa, ää, oo etc.) shorten. The diphthong -uo- and -yö- often become -o-/-ö-.',
      examples: [
        { fi: 'puhua → puhu + i → puhuin (a drops)', en: 'to speak → puhuin' },
        { fi: 'sanoa → sano + i → sanoin (a drops)', en: 'to say → sanoin' },
        { fi: 'lukea → luki- (e+a → i)', en: 'to read → luin (I read, further contraction)' },
        { fi: 'tietää → tiesi- (ää → esi)', en: 'to know → tiesin (irregular contraction)' },
        { fi: 'juoda → joi- (uo+da → joi)', en: 'to drink → join (I drank)' },
      ],
      commonPitfalls: [
        "The changes are largely predictable but require practice. Most Type 1 verbs simply drop the final -a/-ä.",
        "juoda (Type 2): juoda → joi- is irregular; join (I drank), joi (she drank).",
      ],
    },
    {
      id: 'imperfect-irregular',
      title: 'Irregular imperfect forms',
      question: 'Mitkä verbit ovat epäsäännöllisiä imperfektissä?',
      questionEn: 'Which verbs have irregular imperfect forms?',
      grammarPattern: 'The most common irregular imperfects must be memorised: olla → oli, tulla → tuli, mennä → meni, tehdä → teki, nähdä → näki.',
      examples: [
        { fi: 'olla → olin, olit, oli, olimme, olitte, olivat', en: 'to be → I was, you were, she was, we were, you were, they were' },
        { fi: 'tulla → tulin, tulit, tuli, tulimme, tulitte, tulivat', en: 'to come → I came …' },
        { fi: 'mennä → menin, menit, meni, menimme, menitte, menivät', en: 'to go → I went …' },
        { fi: 'tehdä → tein, teit, teki, teimme, teitte, tekivät', en: 'to do → I did …' },
        { fi: 'nähdä → näin, näit, näki, näimme, näitte, näkivät', en: 'to see → I saw …' },
      ],
    },
    {
      id: 'imperfect-object',
      title: 'Object case in imperfect',
      question: 'Mikä sijamuoto on objektilla imperfektissä?',
      questionEn: 'What case does the object take in the imperfect?',
      grammarPattern: 'In affirmative imperfect sentences, a total object takes accusative (genitive -n for sg, nominative pl). A partial/ongoing object takes partitive.',
      examples: [
        { fi: 'Join kahvin. (total: accusative)', en: 'I drank the coffee (all of it).' },
        { fi: 'Luin kirjan. (total: accusative)', en: 'I read the book (all the way through).' },
        { fi: 'Luin kirjaa. (partial: partitive)', en: 'I was reading a book (not necessarily finished).' },
        { fi: 'Söin omenaa. (partial)', en: 'I ate some apple.' },
      ],
      commonPitfalls: [
        "In negative imperfect, always partitive: En lukenut kirjaa.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -in',     use: '1sg imperfect', examples: ['puhuin', 'join'] },
    { pattern: 'stem + -it',     use: '2sg imperfect', examples: ['puhuit', 'joit'] },
    { pattern: 'stem + -i',      use: '3sg imperfect', examples: ['puhui', 'joi'] },
    { pattern: 'stem + -imme',   use: '1pl imperfect', examples: ['puhuimme', 'joimme'] },
    { pattern: 'stem + -itte',   use: '2pl imperfect', examples: ['puhuitte', 'joitte'] },
    { pattern: 'stem + -ivAt',   use: '3pl imperfect', examples: ['puhuivat', 'joivat'] },
    { pattern: 'olla → oli',     use: 'Irregular: to be (past)', examples: ['olin', 'oli', 'olivat'] },
  ],
  drills: [
    { id: 'imp-d1', kind: 'transform', sectionId: 'imperfect-marker',
      data: { base: 'puhua (minä)', instruction: '→ imperfect 1sg', answer: 'puhuin' } },
    { id: 'imp-d2', kind: 'fill', sectionId: 'imperfect-marker',
      data: { sentence: 'Hän _____ (sanoa) hei.', answer: 'sanoi', hint: 'Type 1 imperfect 3sg: sano + i', baseForm: 'sanoa' } },
    { id: 'imp-d3', kind: 'transform', sectionId: 'imperfect-irregular',
      data: { base: 'olla (he)', instruction: '→ imperfect 3pl', answer: 'olivat' } },
    { id: 'imp-d4', kind: 'fill', sectionId: 'imperfect-irregular',
      data: { sentence: 'Me _____ (mennä) kauppaan.', answer: 'menimme', hint: 'mennä → meni + mme', baseForm: 'mennä' } },
    { id: 'imp-d5', kind: 'mc', sectionId: 'imperfect-stem-changes',
      data: { prompt: 'Imperfect 1sg of "juoda" (to drink)?', options: ['juoin', 'join', 'juodain', 'juodin'], correctIndex: 1, explanation: 'juoda → joi- (uo+da contracts to joi-): join.' } },
    { id: 'imp-d6', kind: 'translate', sectionId: 'imperfect-irregular',
      data: { prompt: 'I saw her yesterday.', target: 'Näin hänet eilen', acceptAlso: ['Näin hänet eilen.', 'Minä näin hänet eilen.', 'Minä näin hänet eilen'] } },
    { id: 'imp-d7', kind: 'spot-error', sectionId: 'imperfect-marker',
      data: { sentence: 'Hän puhuii suomea.', errorWord: 'puhuii', correctForm: 'puhui', explanation: '3sg imperfect: no vowel doubling — just stem + i = puhui.' } },
    { id: 'imp-d8', kind: 'table', sectionId: 'imperfect-irregular',
      data: {
        headers: ['Person', 'olla (imp.)', 'mennä (imp.)'],
        rows: [
          { label: 'minä', cells: [{ value: 'minä', blank: false }, { value: 'olin',    blank: true }, { value: 'menin',    blank: true }] },
          { label: 'sinä', cells: [{ value: 'sinä', blank: false }, { value: 'olit',    blank: true }, { value: 'menit',    blank: true }] },
          { label: 'hän',  cells: [{ value: 'hän',  blank: false }, { value: 'oli',     blank: true }, { value: 'meni',     blank: true }] },
          { label: 'me',   cells: [{ value: 'me',   blank: false }, { value: 'olimme',  blank: true }, { value: 'menimme',  blank: true }] },
          { label: 'te',   cells: [{ value: 'te',   blank: false }, { value: 'olitte',  blank: true }, { value: 'menitte',  blank: true }] },
          { label: 'he',   cells: [{ value: 'he',   blank: false }, { value: 'olivat',  blank: true }, { value: 'menivät',  blank: true }] },
        ],
      } },
  ],
  sources: [
    { label: 'Uusi kielemme — Imperfect', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-imperfect-tense' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. PERFECT TENSE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_PERFECT: GrammarTopic = {
  id: 'perfect',
  version: '1.0.0',
  title: 'Perfect tense',
  subtitle: "olen + past participle — 'I have done.'",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 14,
  prerequisites: ['imperfect', 'past-participle'],
  tags: ['verbs'],
  overview: {
    theme: "The Finnish perfect is formed with the present tense of olla + the past participle (-nut/-nyt). It describes events relevant to the present or of unspecified time.",
    grammarFocus: [
      'Auxiliary: olen/olet/on/olemme/olette/ovat',
      'Past participle: -nut (back-vowel verbs) / -nyt (front-vowel verbs)',
      'Plural participle: -neet',
      'Perfect vs imperfect: relevance vs completed past',
    ],
    whyItMatters: "Perfect is used constantly: 'Have you ever been to Finland?', 'I have already eaten.' Confusing it with imperfect is a common learner error.",
  },
  sections: [
    {
      id: 'perfect-form',
      title: 'Forming the perfect',
      question: 'Miten perfekti muodostetaan?',
      questionEn: 'How is the perfect formed?',
      grammarPattern: 'olla (present) + past participle. Singular: -nut/-nyt. Plural: -neet.',
      formula: 'olen/olet/on/olemme/olette/ovat + -nut/-nyt (sg) or -neet (pl)',
      morphology: {
        surface: 'olen puhunut',
        stem: 'puhu',
        ending: '-nut',
        breakdown: [
          { token: 'olen',  role: 'other', note: '1sg of olla (auxiliary)' },
          { token: 'puhu',  role: 'stem',  note: 'stem of puhua' },
          { token: 'nut',   role: 'ending', note: 'past participle suffix (back-vowel verb)' },
        ],
      },
      examples: [
        { fi: 'olen puhunut, olet puhunut, on puhunut', en: 'I have spoken, you have spoken, she has spoken' },
        { fi: 'olemme puhuneet, olette puhuneet, ovat puhuneet', en: 'we have spoken, you have spoken, they have spoken' },
        { fi: 'Oletko käynyt Suomessa?', en: 'Have you ever been to Finland?' },
        { fi: 'Olen jo syönyt.', en: 'I have already eaten.' },
      ],
      commonPitfalls: [
        "Singular subject → -nut/-nyt. Plural subject → -neet. The participle doesn't change for person otherwise.",
      ],
    },
    {
      id: 'perfect-vs-imperfect',
      title: 'Perfect vs imperfect',
      question: 'Milloin käytetään perfektiä, milloin imperfektiä?',
      questionEn: 'When to use perfect vs imperfect?',
      grammarPattern: 'Use the perfect for: (1) events of unspecified time in the past, (2) events still relevant now. Use the imperfect for: events at a specific past time or a clear completed narrative.',
      examples: [
        { fi: 'Olen asunut Suomessa kolme vuotta. (perfect — still relevant)', en: 'I have lived in Finland for three years. (still living or just relevant)' },
        { fi: 'Asuin Suomessa 2010–2013. (imperfect — specific past period)', en: 'I lived in Finland in 2010–2013.' },
        { fi: 'Oletko koskaan syönyt salmiakkia? (perfect — life experience)', en: 'Have you ever eaten salmiakki?' },
        { fi: 'Söin eilen paljon. (imperfect — specific time: yesterday)', en: 'I ate a lot yesterday.' },
      ],
      commonPitfalls: [
        "Words like eilen (yesterday), viime viikolla (last week) trigger imperfect, not perfect.",
        "'Koskaan' (ever) and 'jo' (already) are strong signals for the perfect.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'olen/on + -nut/-nyt', use: 'Perfect sg', examples: ['olen puhunut', 'on tullut'] },
    { pattern: 'olemme/ovat + -neet', use: 'Perfect pl', examples: ['olemme puhuneet', 'ovat tulleet'] },
    { pattern: 'en ole + -nut/-nyt',  use: 'Negative perfect', examples: ['en ole puhunut', 'ei ole tullut'] },
  ],
  drills: [
    { id: 'perf-d1', kind: 'fill', sectionId: 'perfect-form',
      data: { sentence: 'Oletko _____ (käydä) Suomessa?', answer: 'käynyt', hint: 'past participle of käydä', baseForm: 'käydä' } },
    { id: 'perf-d2', kind: 'transform', sectionId: 'perfect-form',
      data: { base: 'puhua (me, perfect)', instruction: '→ perfect 1pl', answer: 'olemme puhuneet' } },
    { id: 'perf-d3', kind: 'mc', sectionId: 'perfect-vs-imperfect',
      data: { prompt: '"I ate a lot yesterday" — which tense?', options: ['perfect', 'imperfect', 'either'], correctIndex: 1, explanation: "'Eilen' (yesterday) specifies a past time → imperfect." } },
    { id: 'perf-d4', kind: 'translate', sectionId: 'perfect-form',
      data: { prompt: 'She has already left.', target: 'Hän on jo lähtenyt', acceptAlso: ['Hän on jo lähtenyt.'] } },
    { id: 'perf-d5', kind: 'spot-error', sectionId: 'perfect-form',
      data: { sentence: 'He ovat puhunut suomea.', errorWord: 'puhunut', correctForm: 'puhuneet', explanation: 'Plural subject (he) → plural past participle: puhuneet.' } },
    { id: 'perf-d6', kind: 'fill', sectionId: 'perfect-vs-imperfect',
      data: { sentence: 'Asuin Turussa _____ (vuosi 2015–2018).', answer: 'vuosina 2015–2018', hint: 'Specific past period → imperfect (asuin). The time phrase uses essive plural.', baseForm: 'vuosi' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Perfect tense', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-perfect-tense' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. PLUPERFECT TENSE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_PLUPERFECT: GrammarTopic = {
  id: 'pluperfect',
  version: '1.0.0',
  title: 'Pluperfect tense',
  subtitle: "olin + past participle — 'I had done.'",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 10,
  prerequisites: ['perfect'],
  tags: ['verbs'],
  overview: {
    theme: "The pluperfect (past perfect) uses olla in the imperfect + past participle. It describes events that were completed before another past event.",
    grammarFocus: [
      'Auxiliary: olin/olit/oli/olimme/olitte/olivat (imperfect of olla)',
      'Past participle: -nut/-nyt (sg), -neet (pl)',
      'Sequencing: event A happened before event B (both in the past)',
    ],
    whyItMatters: "When you tell a story with multiple past events, you need pluperfect to show what happened first.",
  },
  sections: [
    {
      id: 'pluperfect-form',
      title: 'Forming the pluperfect',
      question: 'Miten pluskvamperfekti muodostetaan?',
      questionEn: 'How is the pluperfect formed?',
      grammarPattern: 'olla in imperfect (olin/olit/oli…) + past participle (-nut/-nyt sg or -neet pl).',
      formula: 'olin/oli/olivat + -nut/-nyt / -neet',
      morphology: {
        surface: 'olin puhunut',
        stem: 'puhu',
        ending: '-nut',
        breakdown: [
          { token: 'olin',  role: 'other',  note: '1sg imperfect of olla' },
          { token: 'puhu',  role: 'stem',   note: 'stem of puhua' },
          { token: 'nut',   role: 'ending', note: 'past participle suffix' },
        ],
      },
      examples: [
        { fi: 'olin lähtenyt ennen kuin hän tuli', en: 'I had left before he arrived' },
        { fi: 'Hän oli nukkunut koko päivän.', en: 'She had slept all day.' },
        { fi: 'Olimme jo syöneet, kun he saapuivat.', en: 'We had already eaten when they arrived.' },
      ],
      commonPitfalls: [
        "Do not confuse perfect (olen puhunut — I have spoken) with pluperfect (olin puhunut — I had spoken).",
      ],
    },
    {
      id: 'pluperfect-sequence',
      title: 'Sequencing past events',
      question: 'Milloin pluskvamperfektiä käytetään?',
      questionEn: 'When is the pluperfect used?',
      grammarPattern: 'Use pluperfect for an event that was already completed at the time of another past event. Often combined with kun (when) or ennen kuin (before).',
      examples: [
        { fi: 'Kun tulin kotiin, hän oli jo lähtenyt.', en: 'When I came home, she had already left.' },
        { fi: 'Olin opiskellut suomea kaksi vuotta, ennen kuin muutin Helsinkiin.', en: 'I had studied Finnish for two years before I moved to Helsinki.' },
        { fi: 'He eivät olleet kuulleet uutisia.', en: 'They had not heard the news.' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'olin + -nut/-nyt', use: 'Pluperfect sg', examples: ['olin lähtenyt', 'oli syönyt'] },
    { pattern: 'olimme + -neet',   use: 'Pluperfect pl', examples: ['olimme syöneet', 'olivat tulleet'] },
    { pattern: 'en ollut + -nut',  use: 'Negative pluperfect', examples: ['en ollut syönyt', 'ei ollut tullut'] },
  ],
  drills: [
    { id: 'plup-d1', kind: 'fill', sectionId: 'pluperfect-form',
      data: { sentence: 'Hän _____ _____ (nukkua) koko yön.', answer: 'oli nukkunut', hint: '3sg pluperfect: oli + past participle of nukkua', baseForm: 'nukkua' } },
    { id: 'plup-d2', kind: 'transform', sectionId: 'pluperfect-form',
      data: { base: 'lähteä (he, pluperfect)', instruction: '→ pluperfect 3pl', answer: 'olivat lähteneet' } },
    { id: 'plup-d3', kind: 'translate', sectionId: 'pluperfect-sequence',
      data: { prompt: 'When I arrived, they had already eaten.', target: 'Kun saavuin, he olivat jo syöneet', acceptAlso: ['Kun saavuin, he olivat jo syöneet.'] } },
    { id: 'plup-d4', kind: 'mc', sectionId: 'pluperfect-form',
      data: { prompt: '"She had slept" in Finnish?', options: ['hän nukkui', 'hän on nukkunut', 'hän oli nukkunut', 'hän nukkuisi'], correctIndex: 2 } },
    { id: 'plup-d5', kind: 'spot-error', sectionId: 'pluperfect-form',
      data: { sentence: 'Olin lähtenyt jo, kun hän tulee.', errorWord: 'tulee', correctForm: 'tuli', explanation: 'Both events are in the past. The second event (arrival) should be imperfect: tuli.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Pluperfect', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-pluperfect-tense' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. CONDITIONAL MOOD
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_CONDITIONAL: GrammarTopic = {
  id: 'conditional',
  version: '1.0.0',
  title: 'Conditional mood (-isi-)',
  subtitle: "Polite requests, hypotheticals — 'I would do.'",
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 14,
  prerequisites: ['present-tense'],
  tags: ['verbs'],
  overview: {
    theme: "The conditional mood is formed by inserting -isi- between the stem and the personal ending. It expresses wishes, polite requests, and hypothetical situations.",
    grammarFocus: [
      'Conditional marker: -isi- + personal endings',
      'Polite requests: Haluaisitko…? Voisitko…?',
      'Jos-clauses (if-clauses) with conditional',
      'Conditional perfect: olisin + past participle',
    ],
    whyItMatters: "Conditional is everywhere: polite conversation, expressing wishes, and discussing hypotheticals. It is one of the most useful moods after the basic present.",
  },
  sections: [
    {
      id: 'conditional-form',
      title: 'Forming the conditional (-isi-)',
      question: 'Miten konditionaali muodostetaan?',
      questionEn: 'How is the conditional formed?',
      grammarPattern: 'Insert -isi- between the present stem and the personal ending. Same personal endings as present. In 3sg, no vowel doubling.',
      formula: 'stem + -isi- + personal ending',
      morphology: {
        surface: 'puhu-isi-n',
        stem: 'puhu',
        ending: '-isin',
        breakdown: [
          { token: 'puhu',  role: 'stem',     note: 'present stem of puhua' },
          { token: 'isi',   role: 'gradation', note: 'conditional marker' },
          { token: 'n',     role: 'ending',    note: '1sg personal ending' },
        ],
      },
      examples: [
        { fi: 'puhuisin, puhuisit, puhuisi, puhuisimme, puhuisitte, puhuisivat', en: 'I would speak, you would speak, she would speak, we would speak, you would speak, they would speak' },
        { fi: 'Haluaisin kahvia, kiitos.', en: 'I would like a coffee, please.' },
        { fi: 'Tulisitko mukaan?', en: 'Would you come along?' },
      ],
      commonPitfalls: [
        "3sg conditional ends in just -isi (not *puhuisii): hän puhuisi.",
        "The stem is the same present stem used for conjugation — no special stem needed.",
      ],
    },
    {
      id: 'conditional-polite',
      title: 'Polite requests',
      question: 'Miten tehdään kohtelias pyyntö?',
      questionEn: 'How are polite requests formed?',
      grammarPattern: 'Use the conditional of haluata, voida, saada, or tulla to make requests more polite.',
      examples: [
        { fi: 'Haluaisitko lisää teetä?', en: 'Would you like more tea?' },
        { fi: 'Voisitko auttaa minua?', en: 'Could you help me?' },
        { fi: 'Saisinko lisää kahvia?', en: 'Could I have more coffee?' },
        { fi: 'Voisimmeko varata pöydän?', en: 'Could we reserve a table?' },
      ],
    },
    {
      id: 'conditional-jos',
      title: 'Jos-clauses (if-clauses)',
      question: 'Miten jos-lause toimii konditionaalin kanssa?',
      questionEn: 'How do if-clauses work with the conditional?',
      grammarPattern: 'Both clauses take conditional: Jos + conditional, main clause + conditional. (Unlike English "If I had…" vs "I would…" — Finnish uses conditional in both.)',
      examples: [
        { fi: 'Jos minulla olisi aikaa, tulisi täällä.', en: 'If I had time, I would come here.' },
        { fi: 'Jos hän puhuisi hitaammin, ymmärtäisin paremmin.', en: 'If he spoke more slowly, I would understand better.' },
        { fi: 'Mitä tekisit, jos voittaisit lotossa?', en: 'What would you do if you won the lottery?' },
      ],
      commonPitfalls: [
        "Both clauses use conditional — do not use present tense in the jos-clause (unlike colloquial English).",
      ],
    },
    {
      id: 'conditional-perfect',
      title: 'Conditional perfect — olisin + past participle',
      question: 'Miten konditionaalin perfekti muodostetaan?',
      questionEn: 'How is the conditional perfect formed?',
      grammarPattern: 'olisin/olisit/olisi/olisimme/olisitte/olisivat + past participle (-nut/-nyt sg, -neet pl).',
      examples: [
        { fi: 'Olisin tullut, mutta minulla oli kiire.', en: 'I would have come, but I was in a hurry.' },
        { fi: 'Hän olisi syönyt enemmän, jos olisi ollut nälkäinen.', en: 'She would have eaten more if she had been hungry.' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -isin',    use: '1sg conditional', examples: ['puhuisin', 'tulisi'] },
    { pattern: 'stem + -isi',     use: '3sg conditional', examples: ['puhuisi', 'tulisi', 'olisi'] },
    { pattern: 'stem + -isimme',  use: '1pl conditional', examples: ['puhuisimme'] },
    { pattern: 'olisin + -nut',   use: 'Conditional perfect sg', examples: ['olisin puhunut', 'olisi tullut'] },
  ],
  drills: [
    { id: 'cond-d1', kind: 'transform', sectionId: 'conditional-form',
      data: { base: 'puhua (minä, conditional)', instruction: '→ conditional 1sg', answer: 'puhuisin' } },
    { id: 'cond-d2', kind: 'fill', sectionId: 'conditional-polite',
      data: { sentence: '_____ _____ (voida, 2sg cond.) auttaa minua?', answer: 'Voisitko', hint: 'Polite request: voida conditional 2sg', baseForm: 'voida' } },
    { id: 'cond-d3', kind: 'translate', sectionId: 'conditional-jos',
      data: { prompt: 'If I had time, I would help.', target: 'Jos minulla olisi aikaa, auttaisin', acceptAlso: ['Jos minulla olisi aikaa, auttaisin.'] } },
    { id: 'cond-d4', kind: 'mc', sectionId: 'conditional-form',
      data: { prompt: '3sg conditional of "tulla"?', options: ['tulisi', 'tulee', 'tulisin', 'tulisi-'], correctIndex: 0 } },
    { id: 'cond-d5', kind: 'fill', sectionId: 'conditional-perfect',
      data: { sentence: 'Hän _____ _____ (lähteä, 3sg cond. perfect) jo.', answer: 'olisi lähtenyt', hint: 'olisi + past participle of lähteä', baseForm: 'lähteä' } },
    { id: 'cond-d6', kind: 'spot-error', sectionId: 'conditional-jos',
      data: { sentence: 'Jos minulla on aikaa, tulisin.', errorWord: 'on', correctForm: 'olisi', explanation: 'In Finnish if-clauses for hypotheticals, both clauses use conditional: Jos minulla olisi aikaa…' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Conditional', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-conditional-mood' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 8. IMPERATIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_IMPERATIVE: GrammarTopic = {
  id: 'imperative',
  version: '1.0.0',
  title: 'Imperative (commands)',
  subtitle: 'Tule! Mene! Älä huuda! — commands.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 12,
  prerequisites: ['present-tense', 'negation'],
  tags: ['verbs'],
  overview: {
    theme: "The imperative mood is used for commands and requests. The 2nd person singular imperative is simply the bare stem of the verb. The plural and polite forms add -kaa/-kää.",
    grammarFocus: [
      '2sg imperative: bare stem (= remove personal ending from 2sg present)',
      '2pl imperative: stem + -kaa/-kää',
      'Negative imperative: älä + stem (sg) / älkää + ko/kö-form (pl)',
      'Polite: olkaa hyvä (please)',
    ],
    whyItMatters: "Commands are essential from the very beginning — directions, recipes, instructions. The negative imperative (älä!) is especially useful.",
  },
  sections: [
    {
      id: 'imperative-2sg',
      title: '2nd person singular imperative',
      question: 'Miten käskymuoto muodostetaan yksikössä?',
      questionEn: 'How is the singular imperative formed?',
      grammarPattern: 'The 2sg imperative is the bare present stem — no ending added. This is the same as the negative stem.',
      formula: 'bare stem (= 2sg present minus -t)',
      examples: [
        { fi: 'Puhu! (puhua)', en: 'Speak!' },
        { fi: 'Tule! (tulla)', en: 'Come!' },
        { fi: 'Mene! (mennä)', en: 'Go!' },
        { fi: 'Syö! (syödä)', en: 'Eat!' },
        { fi: 'Ota! (ottaa)', en: 'Take!' },
        { fi: 'Kuuntele! (kuunnella)', en: 'Listen!' },
      ],
      commonPitfalls: [
        "Do NOT add -t or -n to the imperative: 'Puhu!' not '*Puhut!'",
        "olla is irregular: ole! (be!)",
      ],
    },
    {
      id: 'imperative-2pl',
      title: '2nd person plural / formal imperative',
      question: 'Miten käskymuoto muodostetaan monikossa?',
      questionEn: 'How is the plural/formal imperative formed?',
      grammarPattern: 'Add -kaa/-kää to the bare stem. Vowel harmony: back vowels → -kaa, front vowels → -kää.',
      formula: 'stem + -kaa (back) / -kää (front)',
      examples: [
        { fi: 'Puhukaa! (puhua)', en: 'Speak! (pl/formal)' },
        { fi: 'Tulkaa! (tulla)', en: 'Come! (pl)' },
        { fi: 'Menkää! (mennä)', en: 'Go! (pl)' },
        { fi: 'Syökää! (syödä)', en: 'Eat! (pl)' },
        { fi: 'Olkaa hyvä.', en: 'Please. / Here you are. (polite)' },
      ],
    },
    {
      id: 'imperative-negative',
      title: 'Negative imperative',
      question: 'Miten kielletään käskymuodossa?',
      questionEn: 'How is the negative imperative formed?',
      grammarPattern: 'Singular: älä + bare stem. Plural: älkää + stem + -ko/-kö.',
      formula: 'älä + stem (sg) / älkää + stem + -ko/-kö (pl)',
      examples: [
        { fi: 'Älä puhu! (sg)', en: "Don't speak!" },
        { fi: 'Älä tule tänne!', en: "Don't come here!" },
        { fi: 'Älkää puhuko! (pl)', en: "Don't speak! (pl)" },
        { fi: 'Älä huuda!', en: "Don't shout!" },
        { fi: 'Älkää unohtako!', en: "Don't forget! (pl)" },
      ],
      commonPitfalls: [
        "Singular negative: älä + bare stem (no -ko/-kö). Plural: älkää + stem + -ko/-kö.",
      ],
    },
    {
      id: 'imperative-polite',
      title: 'Polite forms and set phrases',
      question: 'Mitkä ovat kohteliaita käskymuotoja?',
      questionEn: 'What are polite imperative forms?',
      grammarPattern: 'Olkaa hyvä is the standard polite phrase. Istukaa (please sit), tulkaa sisään (come in).',
      examples: [
        { fi: 'Olkaa hyvä. / Ole hyvä.', en: 'Please. / Here you go. / You are welcome.' },
        { fi: 'Tulkaa sisään!', en: 'Come in! (pl/polite)' },
        { fi: 'Istukaa!', en: 'Please sit! (formal)' },
        { fi: 'Odota hetki!', en: 'Wait a moment!' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'bare stem',         use: '2sg imperative', examples: ['puhu!', 'tule!', 'syö!'] },
    { pattern: 'stem + -kaa/-kää',  use: '2pl/formal imperative', examples: ['puhukaa!', 'tulkaa!'] },
    { pattern: 'älä + stem',        use: 'Negative imperative sg', examples: ['älä puhu!', 'älä mene!'] },
    { pattern: 'älkää + stem + -ko/-kö', use: 'Negative imperative pl', examples: ['älkää puhuko!'] },
  ],
  drills: [
    { id: 'imper-d1', kind: 'transform', sectionId: 'imperative-2sg',
      data: { base: 'tulla', instruction: '→ 2sg imperative', answer: 'Tule!' } },
    { id: 'imper-d2', kind: 'transform', sectionId: 'imperative-2pl',
      data: { base: 'mennä', instruction: '→ 2pl imperative', answer: 'Menkää!' } },
    { id: 'imper-d3', kind: 'fill', sectionId: 'imperative-negative',
      data: { sentence: '_____ _____ (huutaa, neg. sg)!', answer: 'Älä huuda', hint: 'älä + bare stem of huutaa', baseForm: 'huutaa' } },
    { id: 'imper-d4', kind: 'mc', sectionId: 'imperative-2sg',
      data: { prompt: '2sg imperative of "syödä"?', options: ['syödä', 'syö', 'syöt', 'syöy'], correctIndex: 1 } },
    { id: 'imper-d5', kind: 'translate', sectionId: 'imperative-negative',
      data: { prompt: "Don't forget! (plural)", target: 'Älkää unohtako', acceptAlso: ['Älkää unohtako!'] } },
    { id: 'imper-d6', kind: 'spot-error', sectionId: 'imperative-2sg',
      data: { sentence: 'Puhua nyt!', errorWord: 'Puhua', correctForm: 'Puhu', explanation: '2sg imperative is the bare stem, not the infinitive: Puhu!' } },
    { id: 'imper-d7', kind: 'builder', sectionId: 'imperative-negative',
      data: { tiles: ['tule', 'Älä', 'tänne'], correctOrder: [1, 0, 2], translation: "Don't come here!" } },
  ],
  sources: [
    { label: 'Uusi kielemme — Imperative', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-imperative-mood' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 9. PASSIVE VOICE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_PASSIVE: GrammarTopic = {
  id: 'passive',
  version: '1.0.0',
  title: 'Passive voice (-taan/-tään)',
  subtitle: "Generic 'one does' and the colloquial we-form.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 16,
  prerequisites: ['present-tense', 'imperfect'],
  tags: ['verbs'],
  overview: {
    theme: "Finnish passive expresses an action done by an unspecified agent ('one does', 'it is done'). Colloquially it also functions as the we-form (me mennään = we go).",
    grammarFocus: [
      'Present passive: stem + -taan/-tään (Type 1-4) or -daan/-dään (Type 2 long-vowel stems)',
      'Past passive: stem + -ttiin',
      'Passive perfect: on tehty, on sanottu',
      'Colloquial we: me mennään, me syödään',
    ],
    whyItMatters: "Passive is used constantly in spoken and written Finnish — signs, instructions, recipes, and informal speech all rely on it.",
  },
  sections: [
    {
      id: 'passive-present',
      title: 'Present passive (-taan/-tään)',
      question: 'Miten passiivi muodostetaan preesensissä?',
      questionEn: 'How is the present passive formed?',
      grammarPattern: 'For most verbs: find the present stem, add -taan (back vowel) or -tään (front vowel). Type 1 verbs ending in a vowel use the stem directly + -taan/-tään.',
      formula: 'present stem + -taan / -tään',
      morphology: {
        surface: 'puhu-taan',
        stem: 'puhu',
        ending: '-taan',
        breakdown: [
          { token: 'puhu', role: 'stem',   note: 'present stem of puhua' },
          { token: 'taan', role: 'ending', note: 'passive present ending (back vowel)' },
        ],
      },
      examples: [
        { fi: 'Suomessa puhutaan suomea.', en: 'Finnish is spoken in Finland. / In Finland they speak Finnish.' },
        { fi: 'Täällä syödään hyvin.', en: 'People eat well here.' },
        { fi: 'Tätä tehdään joka päivä.', en: 'This is done every day.' },
        { fi: 'Milloin mennään?', en: 'When do we go? (colloquial)' },
      ],
      commonPitfalls: [
        "The passive has no subject — it is not 'we', 'they', or any person, in formal Finnish.",
        "Type 3 verbs (tulla → tullaan, mennä → mennään): the stem consonant cluster gets a -aa/-ää directly.",
      ],
    },
    {
      id: 'passive-past',
      title: 'Past passive (-ttiin)',
      question: 'Miten passiivi muodostetaan imperfektissä?',
      questionEn: 'How is the past passive formed?',
      grammarPattern: 'Past passive = passive stem + -ttiin. The passive stem is the same base that takes -taan/-tään (remove the -an/-ään to find it, then add -ttiin).',
      formula: 'passive stem + -ttiin',
      examples: [
        { fi: 'puhuttiin (puhua)', en: 'it was spoken / people spoke' },
        { fi: 'syötiin (syödä)', en: 'it was eaten / people ate' },
        { fi: 'tehtiin (tehdä)', en: 'it was done / people did' },
        { fi: 'Eilen kokouksessa puhuttiin paljon.', en: 'Yesterday a lot was talked about at the meeting.' },
        { fi: 'Suomessa puhuttiin saamea ennen.', en: 'Sámi was spoken in Finland before.' },
      ],
    },
    {
      id: 'passive-perfect',
      title: 'Passive perfect — on tehty',
      question: 'Miten passiivi muodostetaan perfektissä?',
      questionEn: 'How is the passive perfect formed?',
      grammarPattern: 'on/oli + passive past participle (-ttu/-tty). The passive past participle is formed from the passive stem: -ttu (back) / -tty (front).',
      formula: 'on + -ttu/-tty (sg), on + -ttu/-tty (same form, invariable)',
      examples: [
        { fi: 'Se on tehty. (tehdä → tehty)', en: 'It has been done / It is done.' },
        { fi: 'Kirje on lähetetty.', en: 'The letter has been sent.' },
        { fi: 'Talo on rakennettu 1920.', en: 'The house was built in 1920.' },
        { fi: 'Oli sovittu, että…', en: 'It had been agreed that…' },
      ],
      commonPitfalls: [
        "The passive past participle is uninflected (no case, number agreement): se on tehty, ne on tehty.",
      ],
    },
    {
      id: 'passive-colloquial-we',
      title: 'Colloquial we-form',
      question: 'Miten sanotaan "me" puhekielessä?',
      questionEn: 'How is "we" expressed colloquially with the passive?',
      grammarPattern: "In colloquial speech, me + passive present is used instead of the 1pl form: 'me mennään' = 'me menemme' = 'we go'.",
      examples: [
        { fi: 'Me mennään kauppaan. (puhekieli)', en: "We're going to the shop." },
        { fi: 'Me syödään illallista yhdessä.', en: "We're eating dinner together." },
        { fi: 'Me oltiin väsyneitä. (past)', en: 'We were tired.' },
      ],
      commonPitfalls: [
        "This is colloquial — in writing or formal speech use menemme, olimme etc.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -taan/-tään',   use: 'Present passive', examples: ['puhutaan', 'syödään', 'mennään'] },
    { pattern: 'passive stem + -ttiin', use: 'Past passive', examples: ['puhuttiin', 'syötiin', 'tehtiin'] },
    { pattern: 'on + -ttu/-tty',        use: 'Passive perfect', examples: ['on tehty', 'on sanottu'] },
  ],
  drills: [
    { id: 'pass-d1', kind: 'transform', sectionId: 'passive-present',
      data: { base: 'puhua', instruction: '→ present passive', answer: 'puhutaan' } },
    { id: 'pass-d2', kind: 'transform', sectionId: 'passive-past',
      data: { base: 'tehdä', instruction: '→ past passive', answer: 'tehtiin' } },
    { id: 'pass-d3', kind: 'fill', sectionId: 'passive-present',
      data: { sentence: 'Täällä _____ (syödä) hyvin.', answer: 'syödään', hint: 'present passive of syödä', baseForm: 'syödä' } },
    { id: 'pass-d4', kind: 'translate', sectionId: 'passive-perfect',
      data: { prompt: 'The letter has been sent.', target: 'Kirje on lähetetty', acceptAlso: ['Kirje on lähetetty.'] } },
    { id: 'pass-d5', kind: 'mc', sectionId: 'passive-past',
      data: { prompt: 'Past passive of "sanoa"?', options: ['sanottiin', 'sanoittiin', 'sanottaan', 'sanoitiin'], correctIndex: 0 } },
    { id: 'pass-d6', kind: 'spot-error', sectionId: 'passive-colloquial-we',
      data: { sentence: 'Me menimme kauppaan. (colloquial version?)', errorWord: 'menimme', correctForm: 'mennään', explanation: "In colloquial speech 'we go' = me mennään (passive present)." } },
    { id: 'pass-d7', kind: 'table', sectionId: 'passive-present',
      data: {
        headers: ['Infinitive', 'Present passive', 'Past passive'],
        rows: [
          { label: 'puhua',  cells: [{ value: 'puhua',  blank: false }, { value: 'puhutaan',  blank: true }, { value: 'puhuttiin',  blank: true }] },
          { label: 'syödä',  cells: [{ value: 'syödä',  blank: false }, { value: 'syödään',   blank: true }, { value: 'syötiin',    blank: true }] },
          { label: 'tulla',  cells: [{ value: 'tulla',  blank: false }, { value: 'tullaan',   blank: true }, { value: 'tultiin',    blank: true }] },
          { label: 'tehdä',  cells: [{ value: 'tehdä',  blank: false }, { value: 'tehdään',   blank: true }, { value: 'tehtiin',    blank: true }] },
        ],
      } },
  ],
  sources: [
    { label: 'Uusi kielemme — Passive', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-passive-voice' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 10. FIRST INFINITIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_INFINITIVE_1: GrammarTopic = {
  id: 'infinitive-1',
  version: '1.0.0',
  title: 'First infinitive (-a/-ä)',
  subtitle: 'The dictionary form — what to do with it.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A1',
  estimatedMin: 10,
  prerequisites: ['verb-types'],
  tags: ['verbs'],
  overview: {
    theme: "The first infinitive is the dictionary form of Finnish verbs. It is used after modal verbs and verbs of wanting/intending. Its ending reveals the verb type.",
    grammarFocus: [
      'First infinitive endings: -a/-ä (Type 1,3,4), -da/-dä (Type 2), -ta/-tä (Type 4 variant, Type 5, 6)',
      'After modal verbs: voida, osata, saada, täytyy, pitää',
      'After haluaa, voi, täytyy, kannattaa, yrittää',
      'Negative infinite: after ei voi, ei tarvitse',
    ],
    whyItMatters: "You look up a verb in the dictionary using its first infinitive. You also use it constantly after other verbs: 'I want to go', 'I can come', 'I must eat'.",
  },
  sections: [
    {
      id: 'inf1-form',
      title: 'First infinitive forms',
      question: 'Miltä ensimmäinen infinitiivi näyttää?',
      questionEn: 'What does the first infinitive look like?',
      grammarPattern: 'The first infinitive ends in -a/-ä, -da/-dä, or -ta/-tä depending on the verb type. It is the dictionary form.',
      examples: [
        { fi: 'puhua, sanoa, lukea, soittaa (Type 1, -a/-ä)', en: 'to speak, to say, to read, to play' },
        { fi: 'syödä, juoda, tehdä (Type 2, -da/-dä)', en: 'to eat, to drink, to do' },
        { fi: 'tulla, mennä, olla (Type 3, -lla/-nnä etc.)', en: 'to come, to go, to be' },
        { fi: 'haluta, pelata (Type 4, -ata)', en: 'to want, to play (a game)' },
        { fi: 'tarvita (Type 5, -ita)', en: 'to need' },
        { fi: 'vanheta (Type 6, -eta)', en: 'to grow old' },
      ],
    },
    {
      id: 'inf1-after-modal',
      title: 'After modal verbs',
      question: 'Milloin ensimmäistä infinitiiviä käytetään?',
      questionEn: 'When is the first infinitive used?',
      grammarPattern: 'The first infinitive follows modal verbs and verbs of wanting/trying. The infinitive does not change form regardless of the subject.',
      formula: 'modal verb (conjugated) + first infinitive',
      examples: [
        { fi: 'Voin auttaa sinua.', en: 'I can help you.' },
        { fi: 'Haluatko tulla mukaan?', en: 'Do you want to come along?' },
        { fi: 'Täytyy syödä jotain.', en: 'One must eat something.' },
        { fi: 'Yritän oppia suomea.', en: 'I am trying to learn Finnish.' },
        { fi: 'Kannattaa kokeilla.', en: 'It is worth trying.' },
      ],
    },
    {
      id: 'inf1-after-haluaa-voi',
      title: 'haluaa / voi / täytyy + infinitive',
      question: 'Miten haluaa, voi ja täytyy toimivat?',
      questionEn: 'How do haluaa, voi and täytyy work?',
      grammarPattern: 'haluaa, voida, täytyy, pitää, kannattaa, osata + first infinitive. The subject of the infinitive is the same as that of the main verb (or genitive with täytyy — see necessive construction).',
      examples: [
        { fi: 'Haluan mennä kotiin.', en: 'I want to go home.' },
        { fi: 'Hän ei voi tulla.', en: 'She cannot come.' },
        { fi: 'Minun täytyy lähteä.', en: 'I have to leave.' },
        { fi: 'Osaatko uida?', en: 'Can you swim? (Do you know how?)' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: '-a/-ä',   use: 'First infinitive (Type 1, 3, some 4)', examples: ['puhua', 'tulla', 'haluta'] },
    { pattern: '-da/-dä', use: 'First infinitive (Type 2)', examples: ['syödä', 'juoda'] },
    { pattern: 'modal + inf.', use: 'Infinitive after modal verbs', examples: ['voin tulla', 'haluan syödä'] },
  ],
  drills: [
    { id: 'inf1-d1', kind: 'mc', sectionId: 'inf1-form',
      data: { prompt: 'Which is the first infinitive of "to eat"?', options: ['syö', 'syön', 'syödä', 'syöty'], correctIndex: 2 } },
    { id: 'inf1-d2', kind: 'fill', sectionId: 'inf1-after-modal',
      data: { sentence: 'Haluan _____ (mennä) kotiin.', answer: 'mennä', hint: 'first infinitive after haluaa', baseForm: 'mennä' } },
    { id: 'inf1-d3', kind: 'translate', sectionId: 'inf1-after-haluaa-voi',
      data: { prompt: 'I want to go home.', target: 'Haluan mennä kotiin', acceptAlso: ['Haluan mennä kotiin.', 'Minä haluan mennä kotiin', 'Minä haluan mennä kotiin.'] } },
    { id: 'inf1-d4', kind: 'spot-error', sectionId: 'inf1-after-modal',
      data: { sentence: 'Voin auttamaan sinua.', errorWord: 'auttamaan', correctForm: 'auttaa', explanation: 'After voi, use first infinitive (auttaa), not the -maan/-mään form.' } },
    { id: 'inf1-d5', kind: 'builder', sectionId: 'inf1-after-modal',
      data: { tiles: ['uida', 'Osaatko', '?'], correctOrder: [1, 0, 2], translation: 'Can you swim?' } },
  ],
  sources: [
    { label: 'Uusi kielemme — First infinitive', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-first-infinitive' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 11. PAST PARTICIPLE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_PAST_PARTICIPLE: GrammarTopic = {
  id: 'past-participle',
  version: '1.0.0',
  title: 'Past participle (-nut/-nyt)',
  subtitle: 'The building block of perfect tenses.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'A2',
  estimatedMin: 13,
  prerequisites: ['imperfect'],
  tags: ['verbs'],
  overview: {
    theme: "The active past participle (-nut/-nyt singular, -neet plural) is used in perfect and pluperfect tenses and as an adjective.",
    grammarFocus: [
      'Formation: stem + -nut (back vowels) / -nyt (front vowels)',
      'Plural: stem + -neet',
      'Consonant gradation effects in the participle',
      'Used in perfect (olen puhunut) and pluperfect (olin puhunut)',
      'As an adjective: väsynyt (tired), nukkunut (one who has slept)',
    ],
    whyItMatters: "You cannot form the perfect or pluperfect without the past participle. It also appears frequently as an attributive adjective.",
  },
  sections: [
    {
      id: 'pp-form',
      title: 'Forming the past participle',
      question: 'Miten partisiippi II muodostetaan?',
      questionEn: 'How is the past participle formed?',
      grammarPattern: 'Present stem + -nut (back vowel verbs) or -nyt (front vowel verbs). For Type 3 verbs with -l/-n/-r/-s stem endings, the participle is -llut/-nnyt etc.',
      formula: 'present stem + -nut / -nyt',
      morphology: {
        surface: 'puhu-nut',
        stem: 'puhu',
        ending: '-nut',
        breakdown: [
          { token: 'puhu', role: 'stem',   note: 'present stem of puhua' },
          { token: 'nut',  role: 'ending', note: 'past participle suffix (back vowel)' },
        ],
      },
      examples: [
        { fi: 'puhua → puhunut (puhu + nut)', en: 'to speak → having spoken' },
        { fi: 'syödä → syönyt (syö + nyt)', en: 'to eat → having eaten' },
        { fi: 'tulla → tullut (tule → tul + lut, with -l-)', en: 'to come → having come' },
        { fi: 'mennä → mennyt (mene → men + nyt, with -n-)', en: 'to go → having gone' },
        { fi: 'olla → ollut', en: 'to be → having been' },
      ],
      commonPitfalls: [
        "Type 3 verbs: the -e- of the stem disappears and the consonant doubles: tulla → tullut (not *tulunut), mennä → mennyt.",
        "tehdä → tehnyt (special: the e-stem teke- contracts: teh + nyt).",
      ],
    },
    {
      id: 'pp-plural',
      title: 'Plural past participle (-neet)',
      question: 'Miten partisiippi II muodostetaan monikossa?',
      questionEn: 'How is the plural past participle formed?',
      grammarPattern: 'Replace -nut/-nyt with -neet. Used when the subject is plural.',
      examples: [
        { fi: 'puhunut (sg) → puhuneet (pl)', en: 'having spoken (sg/pl)' },
        { fi: 'syönyt (sg) → syöneet (pl)', en: 'having eaten (sg/pl)' },
        { fi: 'tullut (sg) → tulleet (pl)', en: 'having come (sg/pl)' },
        { fi: 'He ovat puhuneet. (pl)', en: 'They have spoken.' },
        { fi: 'Olemme tulleet myöhään.', en: 'We have come late.' },
      ],
    },
    {
      id: 'pp-in-perfect',
      title: 'Past participle in perfect tenses',
      question: 'Miten partisiippia käytetään perfektissä ja pluskvamperfektissä?',
      questionEn: 'How is the past participle used in perfect tenses?',
      grammarPattern: 'Perfect: olen/on + -nut/-nyt (sg), olemme/ovat + -neet (pl). Pluperfect: olin/oli + same forms.',
      examples: [
        { fi: 'Olen puhunut hänelle. (perfect, sg)', en: 'I have spoken to her.' },
        { fi: 'Olemme puhuneet asiasta. (perfect, pl)', en: 'We have talked about the matter.' },
        { fi: 'Hän oli jo lähtenyt. (pluperfect)', en: 'She had already left.' },
      ],
    },
    {
      id: 'pp-as-adjective',
      title: 'Past participle as adjective',
      question: 'Miten partisiippia käytetään adjektiivina?',
      questionEn: 'How is the past participle used as an adjective?',
      grammarPattern: 'The past participle can function as an adjective and must agree with the noun in case and number.',
      examples: [
        { fi: 'väsynyt ihminen (tired person)', en: 'a tired person' },
        { fi: 'nukkunut lapsi (child who has slept)', en: 'a sleeping child / child who has slept' },
        { fi: 'hajonnut auto (broken-down car)', en: 'a broken-down car' },
        { fi: 'väsynyttä ihmistä (partitive)', en: 'a tired person (partitive object)' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -nut',  use: 'Past participle sg (back vowel)', examples: ['puhunut', 'tullut'] },
    { pattern: 'stem + -nyt',  use: 'Past participle sg (front vowel)', examples: ['syönyt', 'mennyt', 'tehnyt'] },
    { pattern: 'stem + -neet', use: 'Past participle pl', examples: ['puhuneet', 'tulleet', 'syöneet'] },
  ],
  drills: [
    { id: 'pp-d1', kind: 'transform', sectionId: 'pp-form',
      data: { base: 'puhua', instruction: '→ past participle sg', answer: 'puhunut' } },
    { id: 'pp-d2', kind: 'transform', sectionId: 'pp-form',
      data: { base: 'syödä', instruction: '→ past participle sg', answer: 'syönyt' } },
    { id: 'pp-d3', kind: 'transform', sectionId: 'pp-form',
      data: { base: 'tulla', instruction: '→ past participle sg', answer: 'tullut' } },
    { id: 'pp-d4', kind: 'transform', sectionId: 'pp-plural',
      data: { base: 'mennä', instruction: '→ past participle pl', answer: 'menneet' } },
    { id: 'pp-d5', kind: 'fill', sectionId: 'pp-in-perfect',
      data: { sentence: 'He ovat _____ (lähteä) jo.', answer: 'lähteneet', hint: 'plural past participle of lähteä', baseForm: 'lähteä' } },
    { id: 'pp-d6', kind: 'mc', sectionId: 'pp-form',
      data: { prompt: 'Past participle sg of "olla"?', options: ['oleva', 'ollut', 'olinut', 'olevat'], correctIndex: 1 } },
    { id: 'pp-d7', kind: 'table', sectionId: 'pp-form',
      data: {
        headers: ['Infinitive', 'Past part. sg', 'Past part. pl'],
        rows: [
          { label: 'puhua',  cells: [{ value: 'puhua',  blank: false }, { value: 'puhunut',  blank: true }, { value: 'puhuneet',  blank: true }] },
          { label: 'syödä',  cells: [{ value: 'syödä',  blank: false }, { value: 'syönyt',   blank: true }, { value: 'syöneet',   blank: true }] },
          { label: 'tulla',  cells: [{ value: 'tulla',  blank: false }, { value: 'tullut',   blank: true }, { value: 'tulleet',   blank: true }] },
          { label: 'mennä',  cells: [{ value: 'mennä',  blank: false }, { value: 'mennyt',   blank: true }, { value: 'menneet',   blank: true }] },
          { label: 'tehdä',  cells: [{ value: 'tehdä',  blank: false }, { value: 'tehnyt',   blank: true }, { value: 'tehneet',   blank: true }] },
        ],
      } },
  ],
  sources: [
    { label: 'Uusi kielemme — Past participle', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-past-active-participle' },
    { label: 'Wiktionary — Finnish past participle', url: 'https://en.wiktionary.org/wiki/Appendix:Finnish_verb_conjugation' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 12. SECOND INFINITIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_INFINITIVE_2: GrammarTopic = {
  id: 'infinitive-2',
  version: '1.0.0',
  title: 'Second infinitive (-e-)',
  subtitle: "Tehdessä, tullen — 'while doing', 'by doing'.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 12,
  prerequisites: ['infinitive-1', 'inessive'],
  tags: ['verbs'],
  overview: {
    theme: "The second infinitive is an adverbial form of the verb. Its inessive form (-essa/-essä) expresses 'while doing'; its instructive form (-en) expresses 'by doing / by means of doing'.",
    grammarFocus: [
      'Second infinitive stem: remove -da/-dä or -a/-ä, add -e-',
      'Inessive (-essa/-essä): simultaneous action (while doing)',
      'Instructive (-en): manner (by doing)',
    ],
    whyItMatters: "The second infinitive inessive is a very common way to express simultaneity — an elegant alternative to the conjunction 'kun' (when/while).",
  },
  sections: [
    {
      id: 'inf2-inessive',
      title: 'Inessive — while doing (-essa/-essä)',
      question: 'Miten toinen infinitiivi muodostetaan inessiivissä?',
      questionEn: 'How is the second infinitive inessive formed?',
      grammarPattern: 'Present stem + -essa/-essä. Meaning: while doing X (simultaneous action). Can have possessive suffixes when subjects differ.',
      formula: 'present stem + -essa / -essä',
      morphology: {
        surface: 'puhu-essa',
        stem: 'puhu',
        ending: '-essa',
        breakdown: [
          { token: 'puhu', role: 'stem',   note: 'present stem of puhua' },
          { token: 'essa', role: 'ending', note: 'inessive ending of 2nd infinitive' },
        ],
      },
      examples: [
        { fi: 'Kuuntelin musiikkia syödessäni. (syödä + essä + ni)', en: 'I listened to music while eating.' },
        { fi: 'Hän lauloi suihkussa käydessään.', en: 'She sang in the shower while showering.' },
        { fi: 'Puhuessa pitää katsoa silmiin.', en: 'While speaking, you should look in the eyes.' },
        { fi: 'Juostessa ei saa puhua puhelimeen.', en: "While running, you shouldn't talk on the phone." },
      ],
      commonPitfalls: [
        "When the subject of the main clause and the infinitive clause are the same, add a possessive suffix: syödessäni (while I eat), syödessäsi (while you eat).",
        "When subjects differ, use the genitive + 2nd infinitive: hänen puhuessaan (while he speaks).",
      ],
    },
    {
      id: 'inf2-instructive',
      title: 'Instructive — by doing (-en)',
      question: 'Miten toinen infinitiivi muodostetaan instruktiivissa?',
      questionEn: 'How is the second infinitive instructive formed?',
      grammarPattern: 'Present stem + -en. Means: by doing X, in doing X. A manner adverb.',
      formula: 'present stem + -en',
      examples: [
        { fi: 'Oppii tekemällä. / Oppii tehden.', en: 'One learns by doing.' },
        { fi: 'Hän tuli juosten.', en: 'He came running / by running.' },
        { fi: 'Lauseen voi lopettaa hymyillen.', en: 'You can end the sentence with a smile (by smiling).' },
      ],
      commonPitfalls: [
        "-en form is somewhat formal/literary. -malla/-mällä (3rd infinitive adessive) is more common in spoken language for 'by doing'.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -essa/-essä', use: 'While doing (simultaneous)', examples: ['syödessä', 'puhuessa', 'tullessa'] },
    { pattern: 'stem + -en',        use: 'By doing (manner)', examples: ['tehden', 'juosten', 'hymyillen'] },
  ],
  drills: [
    { id: 'inf2-d1', kind: 'transform', sectionId: 'inf2-inessive',
      data: { base: 'syödä', instruction: '→ 2nd infinitive inessive', answer: 'syödessä' } },
    { id: 'inf2-d2', kind: 'fill', sectionId: 'inf2-inessive',
      data: { sentence: 'Kuuntelin musiikkia _____ (syödä + 1sg poss.suf).', answer: 'syödessäni', hint: '2nd inf inessive + -ni (1sg possessive suffix)', baseForm: 'syödä' } },
    { id: 'inf2-d3', kind: 'translate', sectionId: 'inf2-inessive',
      data: { prompt: 'While running, one should not talk.', target: 'Juostessa ei saa puhua', acceptAlso: ['Juostessa ei saa puhua.'] } },
    { id: 'inf2-d4', kind: 'mc', sectionId: 'inf2-instructive',
      data: { prompt: '2nd infinitive instructive of "juosta" (to run)?', options: ['juosten', 'juoksien', 'juostessa', 'juostaen'], correctIndex: 0 } },
    { id: 'inf2-d5', kind: 'spot-error', sectionId: 'inf2-inessive',
      data: { sentence: 'Puhuessani en kuullut mitään.', errorWord: 'Puhuessani', correctForm: 'Puhuessani', explanation: 'Actually correct! Puhuessani = while I was speaking (1sg possessive suffix -ni). No error here — this tests recognition.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Second infinitive', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-second-infinitive' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 13. THIRD INFINITIVE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_INFINITIVE_3: GrammarTopic = {
  id: 'infinitive-3',
  version: '1.0.0',
  title: 'Third infinitive (-ma-/-mä-)',
  subtitle: 'menossa, tekemässä, lukemasta — verbs in case forms.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 16,
  prerequisites: ['infinitive-1', 'inessive', 'elative'],
  tags: ['verbs'],
  overview: {
    theme: "The third infinitive (also called the MA-infinitive) has a stem -ma-/-mä- to which various case endings attach. Each case gives a different adverbial meaning.",
    grammarFocus: [
      '-mA- stem: verb stem + -ma- (back) / -mä- (front)',
      'Inessive (-massa/-mässä): olen tekemässä = I am (in the process of) doing',
      'Elative (-masta/-mästä): lakata tekemästä = to stop doing',
      'Illative (-maan/-mään): ryhtyä tekemään = to start doing',
      'Adessive (-malla/-mällä): oppii tekemällä = learn by doing',
      'Abessive (-matta/-mättä): tekemättä = without doing',
    ],
    whyItMatters: "The third infinitive appears in many common structures. You'll hear 'olen tulossa', 'laakkaan syömästä', 'ryhtyä tekemään' constantly.",
  },
  sections: [
    {
      id: 'inf3-stem',
      title: '-mA- stem formation',
      question: 'Miten MA-infinitiivistä muodostetaan vartalo?',
      questionEn: 'How is the -mA- stem formed?',
      grammarPattern: 'Present stem + -ma (back vowel) / -mä (front vowel). This stem then takes normal case endings.',
      formula: 'present stem + -ma / -mä',
      morphology: {
        surface: 'teke-mä-ssä',
        stem: 'teke',
        ending: '-mässä',
        breakdown: [
          { token: 'teke', role: 'stem',     note: 'present stem of tehdä' },
          { token: 'mä',   role: 'gradation', note: 'MA-infinitive suffix (front vowel)' },
          { token: 'ssä',  role: 'ending',    note: 'inessive case ending' },
        ],
      },
      examples: [
        { fi: 'puhua → puhu-ma- (puhumassa, puhumasta, puhumaan…)', en: 'to speak → MA-stem' },
        { fi: 'tehdä → teke-mä- (tekemässä, tekemästä, tekemään…)', en: 'to do → MA-stem' },
        { fi: 'tulla → tule-ma- (tulemassa, tulemasta, tulemaan…)', en: 'to come → MA-stem' },
      ],
    },
    {
      id: 'inf3-inessive',
      title: 'Inessive: olen tekemässä',
      question: 'Mitä -mAssA tarkoittaa?',
      questionEn: "What does -mAssA mean?",
      grammarPattern: 'olla + -mAssA = to be in the process of doing. Indicates an ongoing action, especially with verbs of motion.',
      formula: 'olen + stem + -massa/-mässä',
      examples: [
        { fi: 'Olen tekemässä töitä.', en: 'I am (in the middle of) working.' },
        { fi: 'Hän on tulossa tänne.', en: 'She is coming here / on her way here.' },
        { fi: 'Olemme lähdössä pian.', en: 'We are about to leave.' },
        { fi: 'Olin nukkumassa.', en: 'I was (in the middle of) sleeping.' },
      ],
    },
    {
      id: 'inf3-elative',
      title: 'Elative: lakata tekemästä',
      question: 'Mitä -mAstA tarkoittaa?',
      questionEn: "What does -mAstA mean?",
      grammarPattern: '-mAstA follows verbs meaning "to stop/cease/prevent/abstain from doing". The sense is "from doing X".',
      formula: 'verb + stem + -masta/-mästä',
      examples: [
        { fi: 'Lakkasin tupakoimasta.', en: 'I stopped smoking.' },
        { fi: 'Hän pidättäytyi kommentoimasta.', en: 'She refrained from commenting.' },
        { fi: 'En voi estää sinua lähtemästä.', en: 'I cannot prevent you from leaving.' },
      ],
    },
    {
      id: 'inf3-illative',
      title: 'Illative: ryhtyä tekemään',
      question: 'Mitä -mAAn tarkoittaa?',
      questionEn: "What does -mAAn mean?",
      grammarPattern: '-mAAn follows verbs meaning "to start/begin doing" or "to be coming to do". The sense is "into doing X".',
      formula: 'verb + stem + -maan/-mään',
      examples: [
        { fi: 'Ryhdyin opiskelemaan suomea.', en: 'I started studying Finnish.' },
        { fi: 'Hän meni nukkumaan.', en: 'She went to sleep.' },
        { fi: 'Tule syömään!', en: 'Come and eat!' },
        { fi: 'Opettaja pyysi meitä istumaan.', en: 'The teacher asked us to sit down.' },
      ],
    },
    {
      id: 'inf3-adessive',
      title: 'Adessive: oppii tekemällä',
      question: 'Mitä -mAllA tarkoittaa?',
      questionEn: "What does -mAllA mean?",
      grammarPattern: '-mAllA expresses the means or method: "by doing X". The most common way to express "by doing" in everyday Finnish.',
      formula: 'stem + -malla/-mällä',
      examples: [
        { fi: 'Oppii tekemällä.', en: 'One learns by doing.' },
        { fi: 'Pidin sen salassa vaikenemalla.', en: 'I kept it secret by staying silent.' },
        { fi: 'Hän ilmaisi mielipiteensä hymyilemällä.', en: 'She expressed her opinion by smiling.' },
      ],
    },
    {
      id: 'inf3-abessive',
      title: 'Abessive: tekemättä — without doing',
      question: 'Mitä -mAttA tarkoittaa?',
      questionEn: "What does -mAttA mean?",
      grammarPattern: '-mAttA = "without doing X". Very common in Finnish — equivalent to English "without + gerund".',
      formula: 'stem + -matta/-mättä',
      examples: [
        { fi: 'Hän lähti sanomatta mitään.', en: 'She left without saying anything.' },
        { fi: 'En voi elää syömättä.', en: 'I cannot live without eating.' },
        { fi: 'Tehtävä jäi tekemättä.', en: 'The task was left undone (without being done).' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -massa/-mässä', use: 'Ongoing action (in the middle of doing)', examples: ['tekemässä', 'tulossa', 'lähdössä'] },
    { pattern: 'stem + -masta/-mästä', use: 'Stop/prevent/abstain from doing', examples: ['tekemästä', 'tulemasta'] },
    { pattern: 'stem + -maan/-mään',   use: 'Start/begin/go to do', examples: ['tekemään', 'nukkumaan'] },
    { pattern: 'stem + -malla/-mällä', use: 'By doing (method)', examples: ['tekemällä', 'puhumalla'] },
    { pattern: 'stem + -matta/-mättä', use: 'Without doing', examples: ['tekemättä', 'syömättä'] },
  ],
  drills: [
    { id: 'inf3-d1', kind: 'fill', sectionId: 'inf3-inessive',
      data: { sentence: 'Olen _____ (tehdä) töitä.', answer: 'tekemässä', hint: '3rd inf inessive of tehdä: teke + mässä', baseForm: 'tehdä' } },
    { id: 'inf3-d2', kind: 'transform', sectionId: 'inf3-abessive',
      data: { base: 'sanoa', instruction: '→ 3rd infinitive abessive (without saying)', answer: 'sanomatta' } },
    { id: 'inf3-d3', kind: 'translate', sectionId: 'inf3-illative',
      data: { prompt: 'She went to sleep.', target: 'Hän meni nukkumaan', acceptAlso: ['Hän meni nukkumaan.'] } },
    { id: 'inf3-d4', kind: 'mc', sectionId: 'inf3-adessive',
      data: { prompt: '"By doing" uses which 3rd infinitive form?', options: ['-mässä', '-mästä', '-mällä', '-mättä'], correctIndex: 2 } },
    { id: 'inf3-d5', kind: 'fill', sectionId: 'inf3-elative',
      data: { sentence: 'Lakkasin _____ (tupakoida).', answer: 'tupakoimasta', hint: '3rd inf elative: tupakoi + masta', baseForm: 'tupakoida' } },
    { id: 'inf3-d6', kind: 'translate', sectionId: 'inf3-abessive',
      data: { prompt: 'She left without saying anything.', target: 'Hän lähti sanomatta mitään', acceptAlso: ['Hän lähti sanomatta mitään.'] } },
    { id: 'inf3-d7', kind: 'table', sectionId: 'inf3-stem',
      data: {
        headers: ['Infinitive', '-mAssA', '-mAstA', '-mAAn', '-mAllA', '-mAttA'],
        rows: [
          { label: 'tehdä', cells: [
            { value: 'tehdä', blank: false },
            { value: 'tekemässä', blank: true },
            { value: 'tekemästä', blank: true },
            { value: 'tekemään',  blank: true },
            { value: 'tekemällä', blank: true },
            { value: 'tekemättä', blank: true },
          ] },
          { label: 'puhua', cells: [
            { value: 'puhua', blank: false },
            { value: 'puhumassa', blank: true },
            { value: 'puhumasta', blank: true },
            { value: 'puhumaan',  blank: true },
            { value: 'puhumalla', blank: true },
            { value: 'puhumatta', blank: true },
          ] },
        ],
      } },
  ],
  sources: [
    { label: 'Uusi kielemme — Third infinitive', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-third-infinitive' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 14. AGENT PARTICIPLE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_AGENT_PARTICIPLE: GrammarTopic = {
  id: 'agent-participle',
  version: '1.0.0',
  title: 'Agent participle (-ma/-mä)',
  subtitle: "Äidin tekemä ruoka — 'the food made by mom'.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 14,
  prerequisites: ['past-participle', 'genitive'],
  tags: ['verbs'],
  overview: {
    theme: "The agent participle (-ma/-mä) is attached to a genitive agent and modifies a noun. It replaces passive relative clauses: 'the letter sent by him' = hänen lähettämänsä kirje.",
    grammarFocus: [
      'Formation: verb stem + -ma (back) / -mä (front)',
      'Agrees with the modified noun in case and number',
      'Genitive agent: äidin tekemä (made by mom)',
      'Possessive suffix replaces the definite article: tekemänsä (his/her done)',
      'Replaces passive relative clauses',
    ],
    whyItMatters: "Agent participle is a hallmark of written Finnish and formal speech. It is far more compact than a relative clause.",
  },
  sections: [
    {
      id: 'agp-form',
      title: 'Forming the agent participle',
      question: 'Miten agenttipartisiippi muodostetaan?',
      questionEn: 'How is the agent participle formed?',
      grammarPattern: 'Present stem + -ma (back vowel) / -mä (front vowel). Then add case and number endings as for any adjective.',
      formula: 'present stem + -ma / -mä + case/number endings',
      morphology: {
        surface: 'teke-mä',
        stem: 'teke',
        ending: '-mä',
        breakdown: [
          { token: 'teke', role: 'stem',   note: 'present stem of tehdä' },
          { token: 'mä',   role: 'ending', note: 'agent participle suffix (front vowel)' },
        ],
      },
      examples: [
        { fi: 'äidin tekemä ruoka', en: 'the food made by mom' },
        { fi: 'hänen kirjoittamansa kirje', en: 'the letter written by him/her (+ possessive suffix)' },
        { fi: 'opiskelijan ostama kirja', en: 'the book bought by the student' },
        { fi: 'tuulen kaatama puu', en: 'the tree knocked down by the wind' },
      ],
    },
    {
      id: 'agp-agreement',
      title: 'Case and number agreement',
      question: 'Miten agenttipartisiippi taivutetaan?',
      questionEn: 'How does the agent participle inflect?',
      grammarPattern: 'The agent participle inflects like an adjective — it agrees with the head noun in case and number.',
      examples: [
        { fi: 'äidin tekemä ruoka (nominative)', en: 'food made by mom (nominative)' },
        { fi: 'äidin tekemää ruokaa (partitive)', en: 'food made by mom (partitive)' },
        { fi: 'äidin tekemässä ruoassa (inessive)', en: 'in the food made by mom' },
        { fi: 'äidin tekemät ruoat (plural nominative)', en: 'the foods made by mom (pl)' },
      ],
      commonPitfalls: [
        "The agent participle stem is -ma-/-mä-: add normal adjective case endings (tekemä → tekemää in partitive, tekemät in pl nom).",
      ],
    },
    {
      id: 'agp-replaces-relative',
      title: 'Replaces passive relative clauses',
      question: 'Mitä rakenteita agenttipartisiippi korvaa?',
      questionEn: 'What does the agent participle replace?',
      grammarPattern: 'Agent participle replaces "joka on tehty / jonka X on tehnyt" relative clauses. The genitive agent is obligatory.',
      examples: [
        { fi: 'ruoka, jonka äiti teki → äidin tekemä ruoka', en: 'the food that mom made → food made by mom' },
        { fi: 'kirje, jonka hän lähetti → hänen lähettämänsä kirje', en: 'the letter he sent → his sent letter' },
        { fi: 'suunnitelma, jonka opiskelijat tekivät → opiskelijoiden tekemä suunnitelma', en: 'the plan made by the students' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'gen. agent + stem + -ma/-mä', use: 'Agent participle — done by X', examples: ['äidin tekemä', 'hänen kirjoittama'] },
    { pattern: '+ possessive suffix',         use: 'When agent = sentence subject', examples: ['tekemänsä', 'kirjoittamansa'] },
  ],
  drills: [
    { id: 'agp-d1', kind: 'transform', sectionId: 'agp-form',
      data: { base: 'tehdä (äiti)', instruction: '→ agent participle phrase: food made by mom', answer: 'äidin tekemä ruoka' } },
    { id: 'agp-d2', kind: 'translate', sectionId: 'agp-replaces-relative',
      data: { prompt: 'The book bought by the student (nominative)', target: 'opiskelijan ostama kirja', acceptAlso: ['Opiskelijan ostama kirja'] } },
    { id: 'agp-d3', kind: 'mc', sectionId: 'agp-form',
      data: { prompt: 'Agent participle of "kirjoittaa" (to write)?', options: ['kirjoittava', 'kirjoittanut', 'kirjoittama', 'kirjoitettava'], correctIndex: 2 } },
    { id: 'agp-d4', kind: 'fill', sectionId: 'agp-agreement',
      data: { sentence: 'Söin äidin _____ (tehdä) ruokaa.', answer: 'tekemää', hint: 'agent participle in partitive: tekemä → tekemää', baseForm: 'tehdä' } },
    { id: 'agp-d5', kind: 'spot-error', sectionId: 'agp-form',
      data: { sentence: 'Äiti tekemä ruoka oli hyvää.', errorWord: 'Äiti', correctForm: 'Äidin', explanation: 'The agent must be in the genitive: äidin tekemä.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Agent participle', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-agent-participle' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 15. ACTIVE PRESENT PARTICIPLE
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_ACTIVE_PRESENT_PARTICIPLE: GrammarTopic = {
  id: 'active-present-participle',
  version: '1.0.0',
  title: 'Present participle (-va/-vä)',
  subtitle: 'Lukeva, juokseva — verbal adjectives.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 13,
  prerequisites: ['present-tense'],
  tags: ['verbs'],
  overview: {
    theme: "The active present participle (-va/-vä) is a verbal adjective meaning 'the one who does' or 'doing'. It declines like any adjective.",
    grammarFocus: [
      'Formation: present stem + -va (back) / -vä (front)',
      'Declines as adjective in all cases',
      'Used as attributive adjective',
      'Used as predicate: hän on tekevä (he is about to do)',
      'Basis for the referative construction',
    ],
    whyItMatters: "The present participle is very productive in Finnish: lukeva ihminen (a reading person), juokseva vesi (running water). It also feeds into the referative construction.",
  },
  sections: [
    {
      id: 'app-form',
      title: 'Forming the present participle (-va/-vä)',
      question: 'Miten aktiivin 1. partisiippi muodostetaan?',
      questionEn: 'How is the active present participle formed?',
      grammarPattern: 'Present stem + -va (back vowel) / -vä (front vowel). Declines like a regular adjective.',
      formula: 'present stem + -va / -vä',
      morphology: {
        surface: 'luke-va',
        stem: 'luke',
        ending: '-va',
        breakdown: [
          { token: 'luke', role: 'stem',   note: 'present stem of lukea' },
          { token: 'va',   role: 'ending', note: 'present participle suffix (back vowel)' },
        ],
      },
      examples: [
        { fi: 'lukea → lukeva (reading)', en: 'a reading / who reads' },
        { fi: 'juosta → juokseva (running)', en: 'running / who runs' },
        { fi: 'tulla → tuleva (coming, future)', en: 'coming, upcoming, future' },
        { fi: 'tehdä → tekevä (doing, active)', en: 'doing, active' },
        { fi: 'lukeva lapsi', en: 'a child who reads' },
      ],
    },
    {
      id: 'app-declension',
      title: 'Declension as adjective',
      question: 'Miten partisiippi taivutetaan?',
      questionEn: 'How does the present participle decline?',
      grammarPattern: 'Declines like adjectives ending in -va/-vä. Stem in oblique cases: lukevan (gen), lukevaa (part), lukevassa (iness), etc.',
      examples: [
        { fi: 'lukeva (nom sg)', en: 'reading (nominative)' },
        { fi: 'lukevaa (part sg)', en: 'reading (partitive)' },
        { fi: 'lukevan (gen sg)', en: "of the reading / reading's" },
        { fi: 'lukevat (nom pl)', en: 'reading (plural nominative)' },
        { fi: 'lukevassa kirjassa', en: 'in the reading book (inessive)' },
      ],
    },
    {
      id: 'app-as-adjective',
      title: 'Uses as attributive adjective',
      question: 'Missä tilanteissa partisiippia käytetään?',
      questionEn: 'In what situations is the present participle used?',
      grammarPattern: 'Used to describe ongoing qualities or states: lukeva ihminen = a reading person, juokseva vesi = running water.',
      examples: [
        { fi: 'juokseva vesi', en: 'running water' },
        { fi: 'tuleva viikko', en: 'the coming week / next week' },
        { fi: 'kasvava kaupunki', en: 'a growing city' },
        { fi: 'näkyvä muutos', en: 'a visible change' },
        { fi: 'Hän on erittäin osaava asiantuntija.', en: 'She is a very capable expert.' },
      ],
    },
    {
      id: 'app-complex-use',
      title: 'Present participle in complex sentences',
      question: 'Miten partisiippia käytetään lauseenvastikkeissa?',
      questionEn: 'How is the present participle used in participle clauses?',
      grammarPattern: 'The present participle can replace a joka/jotka relative clause when the participle subject matches: kirja, jota luemme → lukemamme kirja.',
      examples: [
        { fi: 'Näin miehen, joka juoksi. → Näin juoksevan miehen.', en: 'I saw the man who was running. → I saw the running man.' },
        { fi: 'Tyttö, joka laulaa, on lahjakas. → Laulava tyttö on lahjakas.', en: 'The girl who sings is talented. → The singing girl is talented.' },
      ],
      commonPitfalls: [
        "This shortening only works for simultaneous/ongoing relative clauses — for completed actions use the agent or past participle.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'stem + -va/-vä',   use: 'Present participle — X-ing / who X-es', examples: ['lukeva', 'juokseva', 'tuleva'] },
    { pattern: 'lukevan/lukevaa',  use: 'Oblique case forms (gen./part.)', examples: ['lukevan miehen', 'lukevaa kirjaa'] },
  ],
  drills: [
    { id: 'app-d1', kind: 'transform', sectionId: 'app-form',
      data: { base: 'lukea', instruction: '→ present participle', answer: 'lukeva' } },
    { id: 'app-d2', kind: 'fill', sectionId: 'app-as-adjective',
      data: { sentence: '_____ (kasvaa) kaupunki tarvitsee lisää kouluja.', answer: 'Kasvava', hint: 'present participle of kasvaa', baseForm: 'kasvaa' } },
    { id: 'app-d3', kind: 'translate', sectionId: 'app-as-adjective',
      data: { prompt: 'running water', target: 'juokseva vesi', acceptAlso: ['Juokseva vesi'] } },
    { id: 'app-d4', kind: 'mc', sectionId: 'app-declension',
      data: { prompt: 'Partitive singular of "lukeva"?', options: ['lukevana', 'lukevan', 'lukevaa', 'lukevasta'], correctIndex: 2 } },
    { id: 'app-d5', kind: 'spot-error', sectionId: 'app-form',
      data: { sentence: 'Näin juoksen miehen.', errorWord: 'juoksen', correctForm: 'juoksevan', explanation: 'As an adjective modifying miehen (genitive), the participle must also be in genitive: juoksevan.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Present participle', url: 'https://uusikielemme.fi/finnish-grammar/verbs/the-present-active-participle' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 16. REFERATIVE CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_REFERATIVE: GrammarTopic = {
  id: 'referative-construction',
  version: '1.0.0',
  title: 'Referative construction',
  subtitle: 'Sanoin hänen tulevan — replaces että-clauses.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 14,
  prerequisites: ['active-present-participle', 'past-participle'],
  tags: ['verbs', 'syntax'],
  overview: {
    theme: "The referative construction replaces että (that) subordinate clauses after verbs of saying, believing, and perceiving. The embedded verb appears as an inflected participle.",
    grammarFocus: [
      'Present referative: main verb stem + -van/-vän (genitive of present participle)',
      'Past referative: past participle genitive -neen',
      'Subject of embedded clause: genitive (if different from main subject)',
      'Possessive suffix when subjects are the same',
    ],
    whyItMatters: "Referative constructions are characteristic of formal and written Finnish. Recognising them is essential for reading authentic texts.",
  },
  sections: [
    {
      id: 'ref-present',
      title: 'Present referative (tulevan)',
      question: 'Miten referatiivirakenne muodostetaan preesensissä?',
      questionEn: 'How is the present referative formed?',
      grammarPattern: 'Replace "että + present" with the genitive of the present participle (-van/-vän). If the subject differs, put it in genitive before the participle.',
      formula: 'verb of saying + (gen. subject) + stem + -van/-vän',
      examples: [
        { fi: 'Sanoin, että hän tulee. → Sanoin hänen tulevan.', en: 'I said that he is coming. → I said him to be coming.' },
        { fi: 'Luulen, että hän on sairas. → Luulen hänen olevan sairas.', en: 'I think he is sick. → I think him to be sick.' },
        { fi: 'Kuulen, että lapset laulavat. → Kuulen lasten laulavan.', en: 'I hear the children singing.' },
        { fi: 'Uskon tulevan pian. (same subject: I believe I will come soon)', en: 'I believe (myself) to be coming soon.' },
      ],
      commonPitfalls: [
        "The participle takes the genitive case ending (-van/-vän), not the nominative (-va/-vä).",
        "When subjects are the same, no overt subject appears — just the participle with possessive suffix if needed.",
      ],
    },
    {
      id: 'ref-past',
      title: 'Past referative (tulleen)',
      question: 'Miten referatiivirakenne muodostetaan menneisyydessä?',
      questionEn: 'How is the past referative formed?',
      grammarPattern: 'Replace "että + past/perfect" with the genitive of the past participle (-neen). Indicates completed action.',
      formula: 'verb of saying + (gen. subject) + pp-stem + -neen',
      examples: [
        { fi: 'Sanoin, että hän tuli. → Sanoin hänen tulleen.', en: 'I said that he came. → I said him to have come.' },
        { fi: 'Kuulin hänen lähteneen jo.', en: 'I heard that he had already left.' },
        { fi: 'Tiedän sinun olleen oikeassa.', en: 'I know (that) you were right.' },
      ],
    },
    {
      id: 'ref-different-subjects',
      title: 'Different subjects',
      question: 'Mitä tapahtuu, kun lauseilla on eri subjektit?',
      questionEn: 'What happens when the clauses have different subjects?',
      grammarPattern: 'When the subject of the embedded clause differs from the main clause subject, it appears in the genitive before the referative participle.',
      examples: [
        { fi: 'Luulin Pekan olevan kotona. (Pekka ≠ I)', en: 'I thought Pekka was at home.' },
        { fi: 'Kuulin lasten laulavan. (children ≠ I)', en: 'I heard the children singing.' },
        { fi: 'Tiedän hänen tulleen eilen. (she ≠ I)', en: 'I know that she came yesterday.' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: '(gen.) + stem + -van/-vän', use: 'Present referative (that X is doing)', examples: ['tulevan', 'olevan', 'laulavan'] },
    { pattern: '(gen.) + pp-stem + -neen',  use: 'Past referative (that X did/has done)', examples: ['tulleen', 'olleen', 'sanoneen'] },
  ],
  drills: [
    { id: 'ref-d1', kind: 'transform', sectionId: 'ref-present',
      data: { base: 'Sanoin, että hän tulee.', instruction: '→ referative construction', answer: 'Sanoin hänen tulevan.' } },
    { id: 'ref-d2', kind: 'transform', sectionId: 'ref-past',
      data: { base: 'Kuulin, että hän lähti.', instruction: '→ past referative', answer: 'Kuulin hänen lähteneen.' } },
    { id: 'ref-d3', kind: 'fill', sectionId: 'ref-present',
      data: { sentence: 'Luulen lasten _____ (laulaa).', answer: 'laulavan', hint: 'present referative: genitive of present participle', baseForm: 'laulaa' } },
    { id: 'ref-d4', kind: 'mc', sectionId: 'ref-past',
      data: { prompt: 'Past referative of "tulla" (to come)?', options: ['tulevan', 'tulleen', 'tultuaan', 'tullut'], correctIndex: 1 } },
    { id: 'ref-d5', kind: 'translate', sectionId: 'ref-different-subjects',
      data: { prompt: 'I know that she came yesterday.', target: 'Tiedän hänen tulleen eilen', acceptAlso: ['Tiedän hänen tulleen eilen.'] } },
    { id: 'ref-d6', kind: 'spot-error', sectionId: 'ref-present',
      data: { sentence: 'Sanoin hänen tulevan kotiin.', errorWord: 'tulevan', correctForm: 'tulevan', explanation: 'Actually correct: tulevan is the genitive of the present participle tuleva. No error here — tests recognition.' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Referative construction', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structures/the-referative-construction' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 17. TEMPORAL CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_TEMPORAL: GrammarTopic = {
  id: 'temporal-construction',
  version: '1.0.0',
  title: 'Temporal construction',
  subtitle: "Hänen tultuaan — 'after he came'. Replaces kun-clauses.",
  language: 'fi',
  targetLanguage: 'en',
  level: 'B2',
  estimatedMin: 13,
  prerequisites: ['past-participle'],
  tags: ['verbs', 'syntax'],
  overview: {
    theme: "The temporal construction replaces 'kun' (when/after) clauses. It is formed from the genitive of the agent + the past participle in the translative or other case.",
    grammarFocus: [
      'Temporal stem: passive past participle base (e.g. tultua from tullaan)',
      'After action: genitive agent + -ttua/-ttyä (elative of passive participle)',
      'Formation: passive past participle → remove -ttiin → add -tua/-tyä → add -an/-än',
      'Simultaneous / same subject forms',
    ],
    whyItMatters: "Temporal constructions are extremely common in newspapers, academic prose, and formal speech. Knowing them helps you read authentic Finnish.",
  },
  sections: [
    {
      id: 'temporal-form',
      title: 'Forming the temporal construction',
      question: 'Miten temporaalirakenne muodostetaan?',
      questionEn: 'How is the temporal construction formed?',
      grammarPattern: 'Take the passive past stem (the part before -ttiin), add -tua/-tyä, then add -an/-än. Precede with genitive agent.',
      formula: 'gen. subject + passive past stem + -tua/-tyä + -an/-än',
      morphology: {
        surface: 'hänen tul-tua-an',
        stem: 'tul',
        ending: '-tuaan',
        breakdown: [
          { token: 'hänen',  role: 'other',  note: 'genitive agent (he/she)' },
          { token: 'tul',    role: 'stem',   note: 'passive past stem of tulla (tultiin → tul-)' },
          { token: 'tua',    role: 'gradation', note: 'temporal suffix' },
          { token: 'an',     role: 'ending', note: 'possessive suffix (3rd person)' },
        ],
      },
      examples: [
        { fi: 'Hänen tultuaan kaikki nousivat seisomaan.', en: 'After he came, everyone stood up.' },
        { fi: 'Syötyään hän meni nukkumaan. (same subject: no genitive)', en: 'After eating, he went to sleep.' },
        { fi: 'Opittuaan kielen, hän muutti maahan.', en: 'After learning the language, she moved to the country.' },
      ],
      commonPitfalls: [
        "When the subject is the same in both clauses, use possessive suffix only (syötyään = after he/she ate), no genitive pronoun.",
        "When subjects differ, put the embedded subject in genitive: hänen tultuaan.",
      ],
    },
    {
      id: 'temporal-sequence',
      title: 'Expressing sequence of events',
      question: 'Miten aikajärjestys ilmaistaan temporaalirakenteella?',
      questionEn: 'How is sequence expressed with the temporal construction?',
      grammarPattern: 'Temporal construction = the first event (in the -tua form), main clause = the second event (any tense).',
      examples: [
        { fi: 'Luettuaan kirjan hän palautti sen kirjastoon.', en: 'After reading the book, he returned it to the library.' },
        { fi: 'Tultuaan kotiin hän laittoi television päälle.', en: 'After coming home, she turned on the TV.' },
        { fi: 'Heidän lähdettyään huone tuntui tyhjältä.', en: 'After they left, the room felt empty.' },
      ],
    },
  ],
  grammarIndex: [
    { pattern: '(gen.) + passive stem + -tua/-tyä + -an/-än', use: 'After doing (temporal)', examples: ['tultuaan', 'syötyään', 'hänen tultuaan'] },
  ],
  drills: [
    { id: 'tmp-d1', kind: 'transform', sectionId: 'temporal-form',
      data: { base: 'hän / tulla', instruction: '→ temporal construction (after he came)', answer: 'hänen tultuaan' } },
    { id: 'tmp-d2', kind: 'fill', sectionId: 'temporal-sequence',
      data: { sentence: '_____ (lukea, same subj.) kirjan hän meni nukkumaan.', answer: 'Luettuaan', hint: 'same subject temporal: passive stem lue+ttu+aan', baseForm: 'lukea' } },
    { id: 'tmp-d3', kind: 'translate', sectionId: 'temporal-sequence',
      data: { prompt: 'After eating, she went to sleep.', target: 'Syötyään hän meni nukkumaan', acceptAlso: ['Syötyään hän meni nukkumaan.'] } },
    { id: 'tmp-d4', kind: 'mc', sectionId: 'temporal-form',
      data: { prompt: 'What does "tultuaan" mean?', options: ['while coming', 'after coming', 'before coming', 'by coming'], correctIndex: 1 } },
    { id: 'tmp-d5', kind: 'spot-error', sectionId: 'temporal-form',
      data: { sentence: 'Hän tultuaan kaikki nousivat.', errorWord: 'Hän', correctForm: 'Hänen', explanation: 'When the subject differs, use genitive: Hänen tultuaan (not nominative Hän).' } },
  ],
  sources: [
    { label: 'Uusi kielemme — Temporal construction', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structures/the-temporal-construction' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 18. MODAL VERBS
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_MODAL_VERBS: GrammarTopic = {
  id: 'modal-verbs',
  version: '1.0.0',
  title: 'Modal verbs',
  subtitle: 'Täytyy, pitää, voida, saada, osata, tarvita.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 16,
  prerequisites: ['present-tense', 'infinitive-1'],
  tags: ['verbs'],
  overview: {
    theme: "Finnish has several modal verbs expressing ability, necessity, permission, and need. Each has its own nuance and negation pattern.",
    grammarFocus: [
      'Ability: voida (can, be able to), osata (know how to)',
      'Necessity: täytyy/täytyi (must, impersonal), pitää (should/must)',
      'Permission: saada (be allowed to, may)',
      'Need: tarvita (need to) — negation: ei tarvitse (need not)',
      'All take first infinitive',
    ],
    whyItMatters: "Modal verbs are needed in almost every conversation — asking for permission, saying what you can or must do. Each has a different negation.",
  },
  sections: [
    {
      id: 'modal-ability',
      title: 'Ability: voida and osata',
      question: 'Miten ilmaistaan kyky ja taito?',
      questionEn: 'How are ability and skill expressed?',
      grammarPattern: 'voida = can, be able to (physical/circumstantial ability). osata = know how to (learned skill). Both + first infinitive.',
      examples: [
        { fi: 'Voin tulla huomenna.', en: 'I can come tomorrow. (I am able to)' },
        { fi: 'En voi tulla tänään.', en: "I can't come today." },
        { fi: 'Osaatko uida?', en: 'Can you swim? (Do you know how?)' },
        { fi: 'Hän osaa puhua kolmea kieltä.', en: 'She can speak three languages (learned skill).' },
        { fi: 'En osaa sanoa.', en: "I can't say (I don't know how)." },
      ],
      commonPitfalls: [
        "voida vs osata: 'Voin uida' = I can swim (right now, nothing stops me). 'Osaan uida' = I know how to swim.",
      ],
    },
    {
      id: 'modal-necessity',
      title: 'Necessity: täytyy and pitää',
      question: 'Miten ilmaistaan välttämättömyys?',
      questionEn: 'How is necessity expressed?',
      grammarPattern: 'täytyy (impersonal) and pitää (personal and impersonal) + first infinitive. With genitive subject (necessive construction): Minun täytyy…',
      examples: [
        { fi: 'Täytyy mennä nyt.', en: "One must go now. / I must go now." },
        { fi: 'Minun täytyy syödä.', en: 'I must eat. (genitive subject + täytyy)' },
        { fi: 'Pitää opiskella enemmän.', en: 'One should / must study more.' },
        { fi: 'Sinun pitää olla kotona kahdeksalta.', en: 'You have to be home at eight.' },
      ],
      commonPitfalls: [
        "täytyy is impersonal — technically has no personal subject. But in speech, 'Minun täytyy' is extremely common.",
        "Both täytyy and pitää are roughly synonymous but pitää is slightly less urgent.",
      ],
    },
    {
      id: 'modal-permission',
      title: 'Permission: saada',
      question: 'Miten ilmaistaan lupa?',
      questionEn: 'How is permission expressed?',
      grammarPattern: 'saada = to be allowed to, may (permission). Positive: saan = I may/I am allowed. Negative: en saa = I am not allowed.',
      examples: [
        { fi: 'Saanko avata ikkunan?', en: 'May I open the window?' },
        { fi: 'Et saa tupakoida täällä.', en: 'You are not allowed to smoke here.' },
        { fi: 'Lapset saavat syödä jälkiruokaa.', en: 'The children are allowed to eat dessert.' },
        { fi: 'Saatko lähteä aikaisin?', en: 'Are you allowed to leave early?' },
      ],
    },
    {
      id: 'modal-need',
      title: 'Need: tarvita — and ei tarvitse',
      question: 'Miten ilmaistaan tarve tai sen puuttuminen?',
      questionEn: 'How are need and lack of need expressed?',
      grammarPattern: 'tarvita = to need to. Negative: ei tarvitse = need not (does not need to). The negative form is very common.',
      examples: [
        { fi: 'Tarvitsen apua.', en: 'I need help.' },
        { fi: 'Sinun ei tarvitse tulla.', en: "You don't need to come." },
        { fi: 'Ei tarvitse maksaa.', en: "You don't have to pay." },
        { fi: 'Tarvitsetko vettä?', en: 'Do you need water?' },
      ],
      commonPitfalls: [
        "ei tarvitse (negative) is not the same as ei saa (not allowed) or ei voi (cannot). 'Ei tarvitse' = no need, it is optional.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'voida + inf.',      use: 'Can (ability/possibility)', examples: ['voin tulla', 'ei voi'] },
    { pattern: 'osata + inf.',      use: 'Know how to (skill)', examples: ['osaan uida', 'ei osaa'] },
    { pattern: 'täytyy + inf.',     use: 'Must (necessity, impersonal)', examples: ['täytyy mennä', 'ei tarvitse (neg)'] },
    { pattern: 'pitää + inf.',      use: 'Should/must', examples: ['pitää syödä', 'ei tarvitse (neg)'] },
    { pattern: 'saada + inf.',      use: 'May (permission)', examples: ['saan lähteä', 'ei saa'] },
    { pattern: 'tarvita + inf.',    use: 'Need to', examples: ['tarvitsen syödä', 'ei tarvitse'] },
  ],
  drills: [
    { id: 'mod-d1', kind: 'mc', sectionId: 'modal-ability',
      data: { prompt: '"I know how to play piano" — which verb?', options: ['voin', 'osaan', 'täytyy', 'saan'], correctIndex: 1, explanation: 'osata = know how to (learned skill).' } },
    { id: 'mod-d2', kind: 'fill', sectionId: 'modal-necessity',
      data: { sentence: 'Minun _____ (täytyy/pitää) lähteä nyt.', answer: 'täytyy', hint: 'impersonal necessity with genitive subject', baseForm: 'täytyy' } },
    { id: 'mod-d3', kind: 'translate', sectionId: 'modal-permission',
      data: { prompt: 'May I open the window?', target: 'Saanko avata ikkunan', acceptAlso: ['Saanko avata ikkunan?'] } },
    { id: 'mod-d4', kind: 'fill', sectionId: 'modal-need',
      data: { sentence: 'Sinun ei _____ (tarvita) tulla.', answer: 'tarvitse', hint: 'negative of tarvita: ei tarvitse', baseForm: 'tarvita' } },
    { id: 'mod-d5', kind: 'mc', sectionId: 'modal-permission',
      data: { prompt: '"You are not allowed to smoke here" = ?', options: ['Et voi tupakoida täällä', 'Et saa tupakoida täällä', 'Et tarvitse tupakoida täällä', 'Sinun ei osaa tupakoida'], correctIndex: 1 } },
    { id: 'mod-d6', kind: 'spot-error', sectionId: 'modal-ability',
      data: { sentence: 'Osaan tulla huomenna.', errorWord: 'Osaan', correctForm: 'Voin', explanation: "Coming tomorrow is a circumstantial ability, not a learned skill — use 'voin' (can, am able to)." } },
    { id: 'mod-d7', kind: 'translate', sectionId: 'modal-need',
      data: { prompt: "You don't need to pay.", target: 'Ei tarvitse maksaa', acceptAlso: ['Sinun ei tarvitse maksaa', 'Sinun ei tarvitse maksaa.', 'Ei tarvitse maksaa.'] } },
  ],
  sources: [
    { label: 'Uusi kielemme — Modal verbs', url: 'https://uusikielemme.fi/finnish-grammar/verbs/modal-verbs' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 19. NECESSIVE CONSTRUCTION
// ─────────────────────────────────────────────────────────────────────────────
export const TOPIC_NECESSIVE: GrammarTopic = {
  id: 'necessive-construction',
  version: '1.0.0',
  title: 'Necessive construction',
  subtitle: 'Minun täytyy mennä — genitive subject + modal.',
  language: 'fi',
  targetLanguage: 'en',
  level: 'B1',
  estimatedMin: 12,
  prerequisites: ['modal-verbs', 'genitive'],
  tags: ['verbs', 'syntax'],
  overview: {
    theme: "The necessive construction expresses obligation or necessity. The modal verb (täytyy, pitää, täytyi) stays in 3rd person singular, and the logical subject appears in the genitive case.",
    grammarFocus: [
      'Genitive subject: minun/sinun/hänen/meidän/teidän/heidän',
      'Modal stays in 3sg: täytyy, pitää (regardless of subject)',
      'First infinitive of main verb',
      'Negation: genitive subject + ei tarvitse + infinitive',
      'pakko: minulla on pakko (I absolutely must)',
    ],
    whyItMatters: "This is one of the most distinctive Finnish constructions. English speakers find it confusing because the 'subject' is in genitive, not nominative.",
  },
  sections: [
    {
      id: 'necess-genitive-subject',
      title: 'Genitive subject + täytyy/pitää',
      question: 'Miten necessiivirakenne muodostetaan?',
      questionEn: 'How is the necessive construction formed?',
      grammarPattern: 'The logical subject appears in the genitive case. The modal verb (täytyy/pitää/täytyi) is always 3rd person singular. Main verb is first infinitive.',
      formula: 'gen. subject + täytyy/pitää + first infinitive',
      morphology: {
        surface: 'minun täytyy mennä',
        stem: 'minun',
        ending: 'täytyy',
        breakdown: [
          { token: 'minun',  role: 'other',  note: 'genitive of minä — logical subject' },
          { token: 'täytyy', role: 'stem',   note: 'modal verb, fixed 3sg form' },
          { token: 'mennä',  role: 'ending', note: 'first infinitive of mennä' },
        ],
      },
      examples: [
        { fi: 'Minun täytyy mennä.', en: 'I must go. (lit. of-me must go)' },
        { fi: 'Sinun pitää syödä.', en: 'You should eat.' },
        { fi: 'Hänen täytyy nukkua.', en: 'He/she must sleep.' },
        { fi: 'Meidän pitää puhua asiasta.', en: 'We need to talk about the matter.' },
        { fi: 'Heidän täytyi lähteä aikaisin.', en: 'They had to leave early. (täytyi = imperfect of täytyy)' },
      ],
      commonPitfalls: [
        "Do NOT conjugate täytyy for person: *minä täytyn is wrong. The form is always täytyy regardless of the genitive subject.",
        "In speech, the genitive pronoun is often omitted: Täytyy mennä. = I/one must go.",
      ],
    },
    {
      id: 'necess-negation',
      title: 'Negation: ei tarvitse',
      question: 'Miten necessiivirakenne kielletään?',
      questionEn: 'How is the necessive construction negated?',
      grammarPattern: 'The negative of täytyy/pitää in this construction is ei tarvitse (need not, do not have to) — not ei täydy.',
      formula: 'gen. subject + ei tarvitse + first infinitive',
      examples: [
        { fi: 'Sinun ei tarvitse tulla.', en: 'You do not need to come.' },
        { fi: 'Minun ei tarvitse maksaa.', en: 'I do not have to pay.' },
        { fi: 'Heidän ei tarvinnut lähteä.', en: 'They did not have to leave. (tarvinnut = past)' },
        { fi: 'Ei tarvitse huolehtia.', en: "There's no need to worry." },
      ],
      commonPitfalls: [
        "The negation is ei tarvitse, not *ei täydy or *ei pidä (these mean something different or are ungrammatical in this context).",
      ],
    },
    {
      id: 'necess-pakko',
      title: 'minulla on pakko',
      question: 'Mitä "pakko" tarkoittaa?',
      questionEn: 'What does "pakko" mean in this context?',
      grammarPattern: 'minulla/sinulla/hänellä on pakko + infinitive = I absolutely must (stronger than täytyy). Adessive subject + on pakko.',
      formula: 'adessive subject + on pakko + first infinitive',
      examples: [
        { fi: 'Minulla on pakko lähteä heti.', en: 'I absolutely must leave immediately.' },
        { fi: 'Hänellä on pakko saada lisää rahaa.', en: 'He absolutely must get more money.' },
        { fi: 'Meillä on pakko tehdä päätös tänään.', en: 'We absolutely must make a decision today.' },
      ],
      commonPitfalls: [
        "pakko uses the adessive (minulla), not the genitive (minun). This is a different construction from täytyy.",
      ],
    },
  ],
  grammarIndex: [
    { pattern: 'gen + täytyy + inf.',     use: 'Must (necessary)', examples: ['minun täytyy mennä', 'hänen pitää tulla'] },
    { pattern: 'gen + ei tarvitse + inf.', use: 'Need not (lack of necessity)', examples: ['sinun ei tarvitse tulla'] },
    { pattern: 'adess + on pakko + inf.',  use: 'Absolutely must', examples: ['minulla on pakko lähteä'] },
  ],
  drills: [
    { id: 'nec-d1', kind: 'fill', sectionId: 'necess-genitive-subject',
      data: { sentence: '_____ täytyy mennä nyt. (I)', answer: 'Minun', hint: 'genitive of minä', baseForm: 'minä' } },
    { id: 'nec-d2', kind: 'transform', sectionId: 'necess-genitive-subject',
      data: { base: 'You must eat. (sinä)', instruction: '→ necessive construction', answer: 'Sinun täytyy syödä.' } },
    { id: 'nec-d3', kind: 'fill', sectionId: 'necess-negation',
      data: { sentence: 'Sinun ei _____ _____ (tarvita) tulla.', answer: 'tarvitse', hint: 'negation of necessity: ei tarvitse', baseForm: 'tarvita' } },
    { id: 'nec-d4', kind: 'translate', sectionId: 'necess-genitive-subject',
      data: { prompt: 'They had to leave early.', target: 'Heidän täytyi lähteä aikaisin', acceptAlso: ['Heidän täytyi lähteä aikaisin.'] } },
    { id: 'nec-d5', kind: 'mc', sectionId: 'necess-negation',
      data: { prompt: 'How do you negate "minun täytyy tulla"?', options: ['minun ei täydy tulla', 'minun ei tarvitse tulla', 'minä en täydy tulla', 'en täydy tulla'], correctIndex: 1 } },
    { id: 'nec-d6', kind: 'spot-error', sectionId: 'necess-genitive-subject',
      data: { sentence: 'Minä täytyy mennä nyt.', errorWord: 'Minä', correctForm: 'Minun', explanation: 'In the necessive construction the subject is in genitive: Minun täytyy (not nominative Minä).' } },
    { id: 'nec-d7', kind: 'table', sectionId: 'necess-genitive-subject',
      data: {
        headers: ['Nominative', 'Genitive (necessive)', 'Example'],
        rows: [
          { label: 'minä', cells: [{ value: 'minä', blank: false }, { value: 'minun', blank: true }, { value: 'minun täytyy', blank: false }] },
          { label: 'sinä', cells: [{ value: 'sinä', blank: false }, { value: 'sinun', blank: true }, { value: 'sinun täytyy', blank: false }] },
          { label: 'hän',  cells: [{ value: 'hän',  blank: false }, { value: 'hänen', blank: true }, { value: 'hänen täytyy', blank: false }] },
          { label: 'me',   cells: [{ value: 'me',   blank: false }, { value: 'meidän', blank: true }, { value: 'meidän täytyy', blank: false }] },
          { label: 'te',   cells: [{ value: 'te',   blank: false }, { value: 'teidän', blank: true }, { value: 'teidän täytyy', blank: false }] },
          { label: 'he',   cells: [{ value: 'he',   blank: false }, { value: 'heidän', blank: true }, { value: 'heidän täytyy', blank: false }] },
        ],
      } },
  ],
  sources: [
    { label: 'Uusi kielemme — Necessive construction', url: 'https://uusikielemme.fi/finnish-grammar/sentence-structures/the-necessive-construction' },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT ARRAY
// ─────────────────────────────────────────────────────────────────────────────
export const VERB_TOPICS: GrammarTopic[] = [
  TOPIC_VERB_TYPES, TOPIC_PRESENT_TENSE, TOPIC_NEGATION, TOPIC_IMPERFECT,
  TOPIC_PERFECT, TOPIC_PLUPERFECT, TOPIC_CONDITIONAL, TOPIC_IMPERATIVE,
  TOPIC_PASSIVE, TOPIC_INFINITIVE_1, TOPIC_PAST_PARTICIPLE, TOPIC_INFINITIVE_2,
  TOPIC_INFINITIVE_3, TOPIC_AGENT_PARTICIPLE, TOPIC_ACTIVE_PRESENT_PARTICIPLE,
  TOPIC_REFERATIVE, TOPIC_TEMPORAL, TOPIC_MODAL_VERBS, TOPIC_NECESSIVE,
];
