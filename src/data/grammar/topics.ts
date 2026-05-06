import type { GrammarTopic } from './types';

export const TOPIC_TIME: GrammarTopic = {
  id: "time-expressions",
  version: "1.0.0",
  title: "Time expressions",
  subtitle: "When? Duration. Relative time.",
  language: "fi",
  targetLanguage: "en",
  level: "A1",
  estimatedMin: 12,
  prerequisites: [],
  tags: ["time", "cases", "adverbs"],

  overview: {
    theme: "When? Time, date, week, month, season, year, duration, and time-related adverbs.",
    grammarFocus: [
      "Monelta? → clock time in -lta/-ltä",
      "Milloin? → time-of-day / season in -lla/-llä",
      "Minä päivänä? / Minä vuonna? → essive -na/-nä for days and years",
      "Missä kuussa? → month in -ssa/-ssä",
      "Kuinka kauan? → duration in plural partitive or basic numeral",
      "Kuinka pitkäksi ajaksi? → planned duration in translative -ksi",
      "Relative time: viime / tämä / ensi, sitten, kuluttua / päästä",
    ],
    whyItMatters: "Every conversation about scheduling, plans, or the past uses these. Pick the wrong case and 'on Monday' becomes ungrammatical.",
  },

  sections: [
    {
      id: "clock-time",
      title: "Kello",
      question: "Monelta?",
      questionEn: "At what time?",
      grammarPattern: "Clock times take the ablative ending -lta/-ltä.",
      caseMarker: "-lta/-ltä",
      morphology: {
        stem: "neljä",
        ending: "-ltä",
        surface: "neljältä",
        breakdown: [
          { token: "neljä", role: "stem", note: "'four', the base numeral" },
          { token: "ltä",   role: "ending", note: "ablative (vowel-harmony -ltä after front vowels)" },
        ],
      },
      examples: [
        { fi: "neljältä", en: "at four o'clock" },
        { fi: "kahdeksalta", en: "at eight o'clock" },
        { fi: "puoli kahdeltatoista", en: "at half past eleven" },
      ],
      tags: ["time", "clock"],
    },
    {
      id: "time-of-day",
      title: "Vuorokaudenaika",
      question: "Milloin?",
      questionEn: "When (time of day)?",
      grammarPattern: "Times of day take the adessive ending -lla/-llä.",
      caseMarker: "-lla/-llä",
      morphology: {
        stem: "aamu",
        ending: "-lla",
        surface: "aamulla",
        breakdown: [
          { token: "aamu", role: "stem", note: "'morning'" },
          { token: "lla",  role: "ending", note: "adessive (back-vowel -lla)" },
        ],
      },
      examples: [
        { fi: "aamulla", en: "in the morning" },
        { fi: "päivällä", en: "during the day" },
        { fi: "illalla", en: "in the evening" },
        { fi: "yöllä", en: "at night" },
      ],
      relativeExamples: [
        { fi: "viime yönä", en: "last night" },
        { fi: "tänä aamuna", en: "this morning" },
        { fi: "tänä iltana", en: "this evening" },
        { fi: "tänä yönä", en: "tonight" },
        { fi: "ensi yönä", en: "next night" },
      ],
      commonPitfalls: [
        "With 'viime / tänä / ensi', the noun shifts to essive -na/-nä — not adessive.",
      ],
      tags: ["time", "daytime"],
    },
    {
      id: "day",
      title: "Päivä",
      question: "Minä päivänä?",
      questionEn: "On which day?",
      grammarPattern: "Days and dates take the essive -na/-nä.",
      caseMarker: "-na/-nä",
      morphology: {
        stem: "maanantai",
        ending: "-na",
        surface: "maanantaina",
        breakdown: [
          { token: "maanantai", role: "stem", note: "'Monday'" },
          { token: "na", role: "ending", note: "essive (back-vowel -na)" },
        ],
      },
      examples: [
        { fi: "maanantaina", en: "on Monday" },
        { fi: "viikonloppuna", en: "on the weekend" },
        { fi: "jouluna", en: "at Christmas" },
        { fi: "eräänä päivänä", en: "one day" },
      ],
      datePattern: {
        label: "Päiväys",
        fi: "16. marraskuuta 2022",
        en: "16 November 2022",
        note: "Dates use the partitive of the month + the year in cardinal form.",
      },
      relativeExamples: [
        { fi: "viime lauantaina", en: "last Saturday" },
        { fi: "tänä sunnuntaina", en: "this Sunday" },
        { fi: "ensi viikonloppuna", en: "next weekend" },
      ],
      tags: ["time", "day", "date"],
    },
    {
      id: "week",
      title: "Viikko",
      question: "Millä viikolla?",
      questionEn: "In which week?",
      grammarPattern: "Weeks take the adessive -lla/-llä.",
      caseMarker: "-lla/-llä",
      morphology: {
        stem: "viikko",
        gradation: "kk → k",
        ending: "-lla",
        surface: "viikolla",
        breakdown: [
          { token: "viiko", role: "stem", note: "stem of viikko with consonant gradation (kk → k)" },
          { token: "lla", role: "ending", note: "adessive" },
        ],
      },
      examples: [
        { fi: "seuraavalla viikolla", en: "next week / on the following week" },
      ],
      relativeExamples: [
        { fi: "viime viikolla", en: "last week" },
        { fi: "tällä viikolla", en: "this week" },
        { fi: "ensi viikolla", en: "next week" },
      ],
      commonPitfalls: [
        "viikko has strong gradation: viikko → viikolla (kk → k).",
      ],
      tags: ["time", "week"],
    },
    {
      id: "month",
      title: "Kuukausi",
      question: "Missä kuussa?",
      questionEn: "In which month?",
      grammarPattern: "Months take the inessive -ssa/-ssä.",
      caseMarker: "-ssa/-ssä",
      morphology: {
        stem: "tammikuu",
        ending: "-ssa",
        surface: "tammikuussa",
        breakdown: [
          { token: "tammikuu", role: "stem", note: "'January'" },
          { token: "ssa", role: "ending", note: "inessive ('in')" },
        ],
      },
      examples: [
        { fi: "tammikuussa", en: "in January" },
        { fi: "heinäkuussa", en: "in July" },
      ],
      relativeExamples: [
        { fi: "viime kuussa", en: "last month" },
        { fi: "tässä kuussa", en: "this month" },
        { fi: "ensi kuussa", en: "next month" },
      ],
      tags: ["time", "month"],
    },
    {
      id: "season",
      title: "Vuodenaika",
      question: "Milloin?",
      questionEn: "When (season)?",
      grammarPattern: "Seasons take the adessive -lla/-llä.",
      caseMarker: "-lla/-llä",
      morphology: {
        stem: "kevät",
        gradation: "t → ä",
        ending: "-llä",
        surface: "keväällä",
        breakdown: [
          { token: "kevää", role: "stem", note: "oblique stem of kevät ('spring')" },
          { token: "llä", role: "ending", note: "adessive (front-vowel -llä)" },
        ],
      },
      examples: [
        { fi: "keväällä", en: "in spring" },
        { fi: "kesällä", en: "in summer" },
        { fi: "syksyllä", en: "in autumn" },
        { fi: "talvella", en: "in winter" },
      ],
      relativeExamples: [
        { fi: "viime kesänä", en: "last summer" },
        { fi: "tänä kesänä", en: "this summer" },
        { fi: "ensi kesänä", en: "next summer" },
      ],
      tags: ["time", "season"],
    },
    {
      id: "year",
      title: "Vuosi",
      question: "Minä vuonna?",
      questionEn: "In which year?",
      grammarPattern: "Years take the essive -na/-nä.",
      caseMarker: "-na/-nä",
      morphology: {
        stem: "vuo",
        ending: "-nna",
        surface: "vuonna",
        breakdown: [
          { token: "vuo", role: "stem", note: "shortened stem" },
          { token: "nna", role: "ending", note: "essive with geminate n" },
        ],
      },
      examples: [
        { fi: "vuonna 1968", en: "in 1968" },
        { fi: "vuonna 2026", en: "in 2026" },
      ],
      relativeExamples: [
        { fi: "viime vuonna", en: "last year" },
        { fi: "tänä vuonna", en: "this year" },
        { fi: "ensi vuonna", en: "next year" },
      ],
      tags: ["time", "year"],
    },
    {
      id: "relative-time-sitten",
      title: "Sitten",
      question: "Milloin menneisyydessä?",
      questionEn: "How long ago?",
      grammarPattern: "Use: quantity + partitive time unit + sitten.",
      formula: "quantity + partitive time unit + sitten",
      examples: [
        { fi: "Muutin Suomeen neljä ja puoli vuotta sitten.", en: "I moved to Finland four and a half years ago." },
        { fi: "Näin hänet kaksi viikkoa sitten.", en: "I saw them two weeks ago." },
      ],
      tags: ["time", "relative", "past"],
    },
    {
      id: "relative-time-kuluttua-paasta",
      title: "Kuluttua / päästä",
      question: "Milloin tulevaisuudessa?",
      questionEn: "In how long?",
      grammarPattern: "Use: genitive quantity phrase + kuluttua or päästä.",
      formula: "genitive quantity + kuluttua / päästä",
      examples: [
        { fi: "Uusi kurssi alkaa kolmen viikon päästä.", en: "The new course starts in three weeks." },
        { fi: "Parin kuukauden kuluttua on jo talvi.", en: "In a couple of months it will already be winter." },
      ],
      commonPitfalls: [
        "The quantity and time unit are both in the genitive: kolmen viikon, not kolme viikkoa.",
      ],
      tags: ["time", "relative", "future"],
    },
    {
      id: "duration-kuinka-kauan",
      title: "Kuinka kauan?",
      question: "Kuinka kauan?",
      questionEn: "For how long (duration)?",
      grammarPattern: "Duration uses plural partitive. For 'one unit', Finnish uses the singular genitive form (viikon, tunnin).",
      examples: [
        { fi: "Olemme matkalla kaksi viikkoa.", en: "We are travelling for two weeks." },
        { fi: "Opiskelin ensin kolme tuntia ja lähdin sitten ulos.", en: "I studied for three hours and then went out." },
      ],
      specialNote: {
        fi: "Yksi tunti / päivä / viikko → viikon, tunnin.",
        en: "With one hour / day / week, use viikon, tunnin (genitive form).",
      },
      tags: ["duration", "time"],
    },
    {
      id: "duration-kuinka-pitkaksi-ajaksi",
      title: "Kuinka pitkäksi ajaksi?",
      question: "Kuinka pitkäksi ajaksi?",
      questionEn: "For how long (planned)?",
      grammarPattern: "Planned duration with movement verbs (lähteä, mennä, tulla) uses translative -ksi.",
      caseMarker: "-ksi",
      morphology: {
        stem: "viiko",
        ending: "-ksi",
        surface: "viikoksi",
        breakdown: [
          { token: "kahde", role: "stem", note: "'two' — genitive-like quantity" },
          { token: "ksi", role: "ending", note: "translative on the numeral" },
          { token: "viiko", role: "stem", note: "stem of viikko (kk → k)" },
          { token: "ksi", role: "ending", note: "translative on the noun" },
        ],
      },
      examples: [
        { fi: "Lähdemme matkalle kahdeksi viikoksi.", en: "We are leaving on a trip for two weeks." },
        { fi: "Menin ulos tunniksi.", en: "I went outside for an hour." },
      ],
      verbNote: {
        fi: "Tyypillisesti verbien lähteä, mennä, tulla kanssa.",
        en: "Typically with the verbs 'to leave', 'to go', 'to come'.",
      },
      tags: ["duration", "translative", "verbs"],
    },
    {
      id: "early-late",
      title: "Aikaisin ↔ myöhään",
      question: "Milloin aikataulun kannalta?",
      questionEn: "Early or late?",
      grammarPattern: "Adverbs: aikaisin = early, myöhään = late (in a general sense).",
      examples: [
        { fi: "Juna lähtee todella aikaisin aamulla, jo kello 5.30.", en: "The train leaves very early in the morning, already at 5:30." },
        { fi: "Tulemme silti perille hyvin myöhään, vasta kello 23.45.", en: "We still arrive very late, only at 23:45." },
      ],
      tags: ["adverbs", "time"],
    },
    {
      id: "on-time-late",
      title: "Ajoissa ↔ myöhässä",
      question: "Ajoissa vai myöhässä?",
      questionEn: "On time or late?",
      grammarPattern: "Adverbs: ajoissa = on time, myöhässä = late (relative to a schedule).",
      examples: [
        { fi: "Kokous alkoi kello 9. Muut tulivat ajoissa, mutta Jussi oli myöhässä.", en: "The meeting started at 9. The others came on time, but Jussi was late." },
      ],
      commonPitfalls: [
        "myöhään vs myöhässä: myöhään is general ('late at night'); myöhässä is relative to a schedule ('late for the meeting').",
      ],
      tags: ["adverbs", "punctuality"],
    },
  ],

  grammarIndex: [
    { pattern: "-lta/-ltä", use: "Clock time (Monelta?)", examples: ["neljältä", "kahdeksalta", "puoli kahdeltatoista"] },
    { pattern: "-lla/-llä", use: "Time of day, week, season", examples: ["aamulla", "tällä viikolla", "kesällä"] },
    { pattern: "-na/-nä", use: "Day, year, essive time", examples: ["maanantaina", "vuonna 1968", "viime kesänä"] },
    { pattern: "-ssa/-ssä", use: "Month", examples: ["tammikuussa"] },
    { pattern: "-ksi", use: "Planned duration with movement verbs", examples: ["kahdeksi viikoksi", "tunniksi"] },
    { pattern: "+ sitten", use: "'X ago' — partitive quantity + sitten", examples: ["kaksi viikkoa sitten"] },
    { pattern: "gen + kuluttua / päästä", use: "'In X time' — genitive quantity + kuluttua/päästä", examples: ["kolmen viikon päästä"] },
  ],

  drills: [
    // clock-time
    { id: "t-d1", kind: "transform", sectionId: "clock-time",
      data: { base: "neljä", instruction: "→ at four o'clock (-lta/-ltä)", answer: "neljältä" } },
    { id: "t-d2", kind: "mc", sectionId: "clock-time",
      data: { prompt: "How do you say 'at eight o'clock'?", options: ["kahdeksassa", "kahdeksalle", "kahdeksalta", "kahdeksana"], correctIndex: 2,
        explanation: "Clock times use the ablative -lta/-ltä." } },

    // time-of-day
    { id: "t-d3", kind: "fill", sectionId: "time-of-day",
      data: { sentence: "Juon kahvia _____ (aamu).", answer: "aamulla", hint: "time of day → -lla", baseForm: "aamu" } },
    { id: "t-d4", kind: "transform", sectionId: "time-of-day",
      data: { base: "ilta", instruction: "→ in the evening", answer: "illalla" } },

    // day
    { id: "t-d5", kind: "fill", sectionId: "day",
      data: { sentence: "Menen kouluun _____ (maanantai).", answer: "maanantaina", hint: "day → -na/-nä", baseForm: "maanantai" } },
    { id: "t-d6", kind: "translate", sectionId: "day",
      data: { prompt: "on Saturday", target: "lauantaina", gradingFocus: "essive -na", acceptAlso: ["Lauantaina"] } },

    // week
    { id: "t-d7", kind: "fill", sectionId: "week",
      data: { sentence: "Olemme lomalla _____ (tämä viikko).", answer: "tällä viikolla", hint: "'this week' — both words take -lla", baseForm: "tämä viikko" } },

    // month
    { id: "t-d8", kind: "transform", sectionId: "month",
      data: { base: "tammikuu", instruction: "→ in January", answer: "tammikuussa" } },
    { id: "t-d9", kind: "mc", sectionId: "month",
      data: { prompt: "'in July' is…", options: ["heinäkuuna", "heinäkuussa", "heinäkuulla", "heinäkuulta"], correctIndex: 1 } },

    // season
    { id: "t-d10", kind: "fill", sectionId: "season",
      data: { sentence: "Suomi on kaunis _____ (kesä).", answer: "kesällä", hint: "season → -lla/-llä", baseForm: "kesä" } },

    // year
    { id: "t-d11", kind: "translate", sectionId: "year",
      data: { prompt: "in 2026", target: "vuonna 2026", gradingFocus: "essive year" } },

    // sitten
    { id: "t-d12", kind: "builder", sectionId: "relative-time-sitten",
      data: { tiles: ["sitten", "kaksi", "viikkoa"], correctOrder: [1, 2, 0], translation: "two weeks ago" } },

    // kuluttua
    { id: "t-d13", kind: "fill", sectionId: "relative-time-kuluttua-paasta",
      data: { sentence: "Kurssi alkaa _____ _____ päästä. (kolme · viikko)", answer: "kolmen viikon", hint: "quantity + noun in genitive", baseForm: "kolme viikko" } },

    // kuinka-kauan
    { id: "t-d14", kind: "fill", sectionId: "duration-kuinka-kauan",
      data: { sentence: "Opiskelin _____ (kolme · tunti).", answer: "kolme tuntia", hint: "duration: plural partitive", baseForm: "kolme tunti" } },

    // translative
    { id: "t-d15", kind: "transform", sectionId: "duration-kuinka-pitkaksi-ajaksi",
      data: { base: "tunti", instruction: "→ 'for an hour' (translative)", answer: "tunniksi" } },

    // spot-error — cross-section
    { id: "t-d16", kind: "spot-error", sectionId: "day",
      data: { sentence: "Menen kouluun maanantai aamulla.", errorWord: "maanantai", correctForm: "maanantaina",
        explanation: "Days take the essive -na. 'Maanantai' must become 'maanantaina' in a time expression." } },

    // listen
    { id: "t-d17", kind: "listen", sectionId: "time-of-day",
      data: { transcript: "Näen sinut illalla.", question: "Which case is 'illalla'?",
        options: ["essive (-na/-nä)", "adessive (-lla/-llä)", "inessive (-ssa/-ssä)", "translative (-ksi)"], correctIndex: 1 } },

    // table
    { id: "t-d18", kind: "table", sectionId: "time-of-day",
      data: {
        headers: ["Base", "'in / at the' form"],
        rows: [
          { label: "aamu", cells: [{ value: "aamu", blank: false }, { value: "aamulla", blank: true }] },
          { label: "ilta", cells: [{ value: "ilta", blank: false }, { value: "illalla", blank: true }] },
          { label: "päivä", cells: [{ value: "päivä", blank: false }, { value: "päivällä", blank: true }] },
          { label: "yö", cells: [{ value: "yö", blank: false }, { value: "yöllä", blank: true }] },
        ],
      } },
  ],

  sources: [
    { label: "Suomen mestari 1", citation: "Kappale 1 — Sanasto, pp. 14–15" },
    { label: "Uusi kielemme — Time expressions", url: "https://uusikielemme.fi/finnish-grammar/adverbs/time-expressions" },
  ],
};

export const TOPIC_PARTITIVE: GrammarTopic = {
  id: "partitive",
  version: "1.0.0",
  title: "Partitive case",
  subtitle: "The headache. Partial objects, numbers, negatives, feelings.",
  language: "fi",
  targetLanguage: "en",
  level: "A1",
  estimatedMin: 18,
  prerequisites: [],
  tags: ["cases", "core-grammar"],

  overview: {
    theme: "The partitive marks partial, ongoing, negated, or uncountable things. It's Finnish's most-used and most-feared case.",
    grammarFocus: [
      "Formation: -a/-ä, -ta/-tä, or -tta/-ttä based on stem",
      "Partial/unfinished objects: 'I'm drinking coffee' (not all of it)",
      "After numbers greater than one: 'two coffees'",
      "After negation: 'I don't have coffee'",
      "With emotions and mass nouns: 'I love music'",
      "Partitive plural: -ja/-jä, -ia/-iä, -oita/-öitä",
    ],
    whyItMatters: "If you can't pick partitive vs nominative/accusative, you can't form a basic Finnish object. It's the single biggest hurdle.",
  },

  sections: [
    {
      id: "formation",
      title: "Forming the partitive",
      question: "Miten partitiivi muodostetaan?",
      questionEn: "How is the partitive formed?",
      grammarPattern: "Singular partitive: -a/-ä after vowel stems; -ta/-tä after consonant stems or long vowels; -tta/-ttä after -e endings.",
      caseMarker: "-a / -ta / -tta",
      morphology: {
        stem: "kahvi",
        ending: "-a",
        surface: "kahvia",
        breakdown: [
          { token: "kahvi", role: "stem", note: "basic noun stem" },
          { token: "a", role: "ending", note: "partitive -a after vowel stem" },
        ],
      },
      examples: [
        { fi: "kahvi → kahvia", en: "coffee" },
        { fi: "maito → maitoa", en: "milk" },
        { fi: "vesi → vettä", en: "water (consonant stem → -ttä with gradation)" },
        { fi: "perhe → perhettä", en: "family (-e ending → -ttä)" },
        { fi: "mies → miestä", en: "man (consonant stem)" },
      ],
      commonPitfalls: [
        "Words ending in -e almost always take -tta/-ttä, not -a/-ä.",
        "'vesi' is irregular: the partitive is vettä, not vesta.",
      ],
      tags: ["formation"],
    },
    {
      id: "partial-object",
      title: "Partial / unfinished object",
      question: "Milloin käytetään partitiivia objektina?",
      questionEn: "When is the partitive used for objects?",
      grammarPattern: "Partitive marks an object that is partial, ongoing, or unspecified in quantity. 'I'm drinking coffee' (some, not all) vs 'I drank the coffee' (all of it).",
      caseMarker: "-a/-ä (object)",
      examples: [
        { fi: "Juon kahvia.", en: "I'm drinking coffee. (some)" },
        { fi: "Luen kirjaa.", en: "I'm reading a book. (ongoing)" },
        { fi: "Syön omenaa.", en: "I'm eating an apple. (some of it)" },
        { fi: "Join kahvin.", en: "I drank the coffee. (accusative — finished)" },
      ],
      commonPitfalls: [
        "If the action is complete and the whole object is affected, use accusative (kahvin), not partitive (kahvia).",
        "Ongoing action (imperfective aspect) almost always forces partitive.",
      ],
      tags: ["object", "aspect"],
    },
    {
      id: "numbers",
      title: "After numbers",
      question: "Miksi numeron jälkeen partitiivi?",
      questionEn: "Why partitive after numbers?",
      grammarPattern: "Any number greater than one is followed by partitive singular.",
      caseMarker: "-a/-ä",
      morphology: {
        stem: "kahvi",
        ending: "-a",
        surface: "kaksi kahvia",
        breakdown: [
          { token: "kaksi", role: "other", note: "numeral 'two'" },
          { token: "kahvi", role: "stem", note: "noun stem" },
          { token: "a", role: "ending", note: "partitive singular" },
        ],
      },
      examples: [
        { fi: "kaksi kahvia", en: "two coffees" },
        { fi: "kolme omenaa", en: "three apples" },
        { fi: "viisi minuuttia", en: "five minutes" },
        { fi: "yksi kahvi", en: "one coffee (nominative — exception)" },
      ],
      specialNote: {
        fi: "yksi + nominatiivi. Kaikki muut numerot + partitiivi.",
        en: "'One' + nominative. All other numbers + partitive singular.",
      },
      tags: ["numbers"],
    },
    {
      id: "negation",
      title: "After negation",
      question: "Miksi kieltolause + partitiivi?",
      questionEn: "Why partitive in negated sentences?",
      grammarPattern: "Negation always forces the object into partitive. 'I don't have X' / 'I don't drink X'.",
      caseMarker: "-a/-ä (object under negation)",
      examples: [
        { fi: "Minulla ei ole kahvia.", en: "I don't have coffee." },
        { fi: "En juo maitoa.", en: "I don't drink milk." },
        { fi: "En näe autoa.", en: "I don't see the car." },
      ],
      commonPitfalls: [
        "Positive: 'Minulla on kahvi' (nominative). Negative: 'Minulla ei ole kahvia' (partitive). The flip is automatic.",
      ],
      tags: ["negation"],
    },
    {
      id: "emotions-mass",
      title: "With emotions and mass nouns",
      question: "Mitä rakastan?",
      questionEn: "What do I love?",
      grammarPattern: "Verbs of emotion (rakastaa, vihata, pelätä, odottaa) and mass/abstract nouns take partitive.",
      caseMarker: "-a/-ä",
      examples: [
        { fi: "Rakastan musiikkia.", en: "I love music." },
        { fi: "Pelkään pimeää.", en: "I'm afraid of the dark." },
        { fi: "Odotan junaa.", en: "I'm waiting for the train." },
        { fi: "Tarvitsen apua.", en: "I need help." },
      ],
      tags: ["emotions", "mass-nouns"],
    },
    {
      id: "plural",
      title: "Partitive plural",
      question: "Miten tehdään monikon partitiivi?",
      questionEn: "How is the partitive plural formed?",
      grammarPattern: "Partitive plural: -ja/-jä (after -o/-ö/-u/-y stems), -ia/-iä (after -a/-ä/-i), or -oita/-öitä for longer stems.",
      caseMarker: "-ja / -ia / -oita",
      morphology: {
        stem: "kiel",
        ending: "-iä",
        surface: "kieliä",
        breakdown: [
          { token: "kiel", role: "stem", note: "stem of kieli ('language')" },
          { token: "iä", role: "ending", note: "partitive plural (-iä after front vowel)" },
        ],
      },
      examples: [
        { fi: "omena → omenoita", en: "apples" },
        { fi: "kieli → kieliä", en: "languages" },
        { fi: "auto → autoja", en: "cars" },
        { fi: "lapsi → lapsia", en: "children" },
      ],
      commonPitfalls: [
        "The plural partitive has several surface forms based on the stem vowel. This is the hardest part of partitive to produce quickly.",
      ],
      tags: ["plural"],
    },
  ],

  grammarIndex: [
    { pattern: "-a / -ä", use: "Partitive singular (vowel stems)", examples: ["kahvia", "maitoa", "musiikkia"] },
    { pattern: "-ta / -tä", use: "Partitive singular (consonant stems / long vowels)", examples: ["vettä", "miestä", "maata"] },
    { pattern: "-tta / -ttä", use: "Partitive (-e endings)", examples: ["perhettä", "huonetta"] },
    { pattern: "-ja / -jä", use: "Partitive plural (-o/-u stems)", examples: ["autoja", "taloja"] },
    { pattern: "-ia / -iä", use: "Partitive plural (-a/-ä/-i stems)", examples: ["kieliä", "lapsia"] },
    { pattern: "-oita / -öitä", use: "Partitive plural (longer stems)", examples: ["omenoita", "teloita"] },
  ],

  drills: [
    { id: "p-d1", kind: "transform", sectionId: "formation",
      data: { base: "kahvi", instruction: "→ partitive singular", answer: "kahvia" } },
    { id: "p-d2", kind: "transform", sectionId: "formation",
      data: { base: "vesi", instruction: "→ partitive singular", answer: "vettä" } },
    { id: "p-d3", kind: "transform", sectionId: "formation",
      data: { base: "perhe", instruction: "→ partitive singular", answer: "perhettä" } },

    { id: "p-d4", kind: "fill", sectionId: "partial-object",
      data: { sentence: "Juon _____ (kahvi).", answer: "kahvia", hint: "ongoing action → partitive", baseForm: "kahvi" } },
    { id: "p-d5", kind: "fill", sectionId: "partial-object",
      data: { sentence: "Luen _____ (kirja).", answer: "kirjaa", hint: "ongoing → partitive", baseForm: "kirja" } },

    { id: "p-d6", kind: "mc", sectionId: "numbers",
      data: { prompt: "'three apples' is…", options: ["kolme omena", "kolme omenan", "kolme omenaa", "kolme omenoita"], correctIndex: 2,
        explanation: "Numbers > 1 take partitive singular." } },
    { id: "p-d7", kind: "fill", sectionId: "numbers",
      data: { sentence: "Tilaan _____ _____ (kaksi · kahvi).", answer: "kaksi kahvia", hint: "number + partitive sg", baseForm: "kaksi kahvi" } },

    { id: "p-d8", kind: "transform", sectionId: "negation",
      data: { base: "Minulla on maito.", instruction: "→ negate it", answer: "Minulla ei ole maitoa",
        acceptAlso: ["Minulla ei ole maitoa."] } },
    { id: "p-d9", kind: "fill", sectionId: "negation",
      data: { sentence: "En juo _____ (maito).", answer: "maitoa", hint: "negation → partitive", baseForm: "maito" } },

    { id: "p-d10", kind: "translate", sectionId: "emotions-mass",
      data: { prompt: "I love music.", target: "Rakastan musiikkia", gradingFocus: "partitive object after rakastaa",
        acceptAlso: ["Rakastan musiikkia.", "Minä rakastan musiikkia", "Minä rakastan musiikkia."] } },

    { id: "p-d11", kind: "spot-error", sectionId: "partial-object",
      data: { sentence: "Juon kahvi aamulla.", errorWord: "kahvi", correctForm: "kahvia",
        explanation: "'Juon' (I'm drinking) is an ongoing action — the object must be in the partitive: 'kahvia'." } },
    { id: "p-d12", kind: "spot-error", sectionId: "numbers",
      data: { sentence: "Ostin kolme omena kaupasta.", errorWord: "omena", correctForm: "omenaa",
        explanation: "After a number greater than one, the noun is in the partitive singular: 'kolme omenaa'." } },

    { id: "p-d13", kind: "mc", sectionId: "plural",
      data: { prompt: "The partitive plural of 'auto' is…", options: ["autot", "autoja", "autoita", "autoa"], correctIndex: 1 } },
    { id: "p-d14", kind: "transform", sectionId: "plural",
      data: { base: "kieli", instruction: "→ partitive plural", answer: "kieliä" } },

    { id: "p-d15", kind: "builder", sectionId: "partial-object",
      data: { tiles: ["kahvia", "Juon", "aamulla"], correctOrder: [1, 0, 2], translation: "I drink coffee in the morning." } },

    { id: "p-d16", kind: "listen", sectionId: "numbers",
      data: { transcript: "Tilasin kaksi kahvia ja yhden teen.", question: "Why is 'kahvia' in the partitive?",
        options: ["It's negated", "After a number > 1", "It's an emotion verb", "It's a mass noun"], correctIndex: 1 } },

    { id: "p-d17", kind: "table", sectionId: "formation",
      data: {
        headers: ["Base", "Partitive sg"],
        rows: [
          { label: "kahvi",  cells: [{ value: "kahvi",  blank: false }, { value: "kahvia",  blank: true }] },
          { label: "vesi",   cells: [{ value: "vesi",   blank: false }, { value: "vettä",   blank: true }] },
          { label: "perhe",  cells: [{ value: "perhe",  blank: false }, { value: "perhettä", blank: true }] },
          { label: "mies",   cells: [{ value: "mies",   blank: false }, { value: "miestä",  blank: true }] },
          { label: "maito",  cells: [{ value: "maito",  blank: false }, { value: "maitoa",  blank: true }] },
        ],
      } },
  ],

  sources: [
    { label: "Uusi kielemme — Partitive", url: "https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases/the-partitive-case-partitiivi", license: "CC-BY-SA" },
    { label: "Wiktionary — Finnish partitive", url: "https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension" },
  ],
};

export const TOPIC_LOCATIVE: GrammarTopic = {
  id: "locative-cases",
  version: "1.0.0",
  title: "Locative cases",
  subtitle: "Where things are, go to, and come from — inside and outside.",
  language: "fi",
  targetLanguage: "en",
  level: "A2",
  estimatedMin: 15,
  prerequisites: ["partitive"],
  tags: ["cases", "core-grammar", "location"],

  overview: {
    theme: "Finnish uses six cases to express location, split into 'inside' (at / into / out of) and 'outside' (on / onto / off) sets.",
    grammarFocus: [
      "Internal (inside): inessive -ssa/-ssä, elative -sta/-stä, illative -Vn/-seen",
      "External (on / at surfaces): adessive -lla/-llä, ablative -lta/-ltä, allative -lle",
      "Internal cases tend to go with buildings, countries, closed spaces",
      "External cases tend to go with surfaces, people, open areas",
      "Direction matters: static / motion-toward / motion-from each have their own case",
    ],
    whyItMatters: "If you say 'I live on Finland' instead of 'I live in Finland', you'll be understood but marked as a beginner. These are the most common case mistakes.",
  },

  sections: [
    {
      id: "inessive",
      title: "Inessive — Missä?",
      question: "Missä?",
      questionEn: "Where (inside)?",
      grammarPattern: "Static location inside. Ending: -ssa/-ssä.",
      caseMarker: "-ssa/-ssä",
      morphology: {
        stem: "talo",
        ending: "-ssa",
        surface: "talossa",
        breakdown: [
          { token: "talo", role: "stem", note: "'house'" },
          { token: "ssa", role: "ending", note: "inessive ('in / inside')" },
        ],
      },
      examples: [
        { fi: "talossa", en: "in the house" },
        { fi: "Suomessa", en: "in Finland" },
        { fi: "koulussa", en: "at school" },
        { fi: "autossa", en: "in the car" },
      ],
      tags: ["internal", "static"],
    },
    {
      id: "elative",
      title: "Elative — Mistä?",
      question: "Mistä?",
      questionEn: "From where (inside)?",
      grammarPattern: "Motion out of. Ending: -sta/-stä.",
      caseMarker: "-sta/-stä",
      morphology: {
        stem: "talo",
        ending: "-sta",
        surface: "talosta",
        breakdown: [
          { token: "talo", role: "stem" },
          { token: "sta", role: "ending", note: "elative ('out of')" },
        ],
      },
      examples: [
        { fi: "talosta", en: "out of / from the house" },
        { fi: "Suomesta", en: "from Finland" },
        { fi: "koulusta", en: "from school" },
      ],
      tags: ["internal", "from"],
    },
    {
      id: "illative",
      title: "Illative — Mihin?",
      question: "Mihin?",
      questionEn: "To where (inside)?",
      grammarPattern: "Motion into. Ending: double the final vowel + -n, or -seen.",
      caseMarker: "-Vn / -seen",
      morphology: {
        stem: "talo",
        ending: "-on",
        surface: "taloon",
        breakdown: [
          { token: "talo", role: "stem" },
          { token: "on", role: "ending", note: "illative: doubled final vowel + n" },
        ],
      },
      examples: [
        { fi: "taloon", en: "into the house" },
        { fi: "Suomeen", en: "to Finland" },
        { fi: "kouluun", en: "to school" },
        { fi: "kaupunkiin", en: "to the city" },
      ],
      commonPitfalls: [
        "Illative is the irregular one. -talo → taloon, but -kaupunki → kaupunkiin (front vowel + -n doubling).",
        "Some words use -seen: huoneeseen, Porvooseen.",
      ],
      tags: ["internal", "to"],
    },
    {
      id: "adessive",
      title: "Adessive — Millä?",
      question: "Millä?",
      questionEn: "Where (on / at)?",
      grammarPattern: "Static location on a surface, or 'with'/'by means of'. Ending: -lla/-llä.",
      caseMarker: "-lla/-llä",
      morphology: {
        stem: "pöytä",
        gradation: "t → d",
        ending: "-llä",
        surface: "pöydällä",
        breakdown: [
          { token: "pöydä", role: "stem", note: "stem of pöytä with gradation (t → d)" },
          { token: "llä", role: "ending", note: "adessive ('on')" },
        ],
      },
      examples: [
        { fi: "pöydällä", en: "on the table" },
        { fi: "kadulla", en: "on the street" },
        { fi: "junalla", en: "by train (means)" },
        { fi: "minulla on", en: "I have (lit. 'on me is')" },
      ],
      commonPitfalls: [
        "Finnish uses adessive (NOT a 'have' verb) to express possession: 'minulla on kissa' = 'I have a cat'.",
      ],
      tags: ["external", "static"],
    },
    {
      id: "ablative",
      title: "Ablative — Miltä?",
      question: "Miltä?",
      questionEn: "From where (surface)?",
      grammarPattern: "Motion off a surface, or 'from' a person. Ending: -lta/-ltä.",
      caseMarker: "-lta/-ltä",
      examples: [
        { fi: "pöydältä", en: "off the table" },
        { fi: "kadulta", en: "off the street" },
        { fi: "opettajalta", en: "from the teacher" },
      ],
      tags: ["external", "from"],
    },
    {
      id: "allative",
      title: "Allative — Mille?",
      question: "Mille?",
      questionEn: "To where (surface)?",
      grammarPattern: "Motion onto a surface, or 'to' a person. Ending: -lle.",
      caseMarker: "-lle",
      examples: [
        { fi: "pöydälle", en: "onto the table" },
        { fi: "kadulle", en: "onto the street" },
        { fi: "opettajalle", en: "to the teacher" },
      ],
      tags: ["external", "to"],
    },
  ],

  grammarIndex: [
    { pattern: "-ssa / -ssä", use: "Inessive — in / inside (static)", examples: ["talossa", "Suomessa"] },
    { pattern: "-sta / -stä", use: "Elative — out of / from inside", examples: ["talosta", "Suomesta"] },
    { pattern: "-Vn / -seen", use: "Illative — into", examples: ["taloon", "Suomeen"] },
    { pattern: "-lla / -llä", use: "Adessive — on / with / possession", examples: ["pöydällä", "junalla"] },
    { pattern: "-lta / -ltä", use: "Ablative — off / from a person", examples: ["pöydältä", "opettajalta"] },
    { pattern: "-lle",        use: "Allative — onto / to a person", examples: ["pöydälle", "opettajalle"] },
  ],

  drills: [
    { id: "l-d1", kind: "transform", sectionId: "inessive", data: { base: "talo", instruction: "→ inessive (in)", answer: "talossa" } },
    { id: "l-d2", kind: "transform", sectionId: "inessive", data: { base: "Suomi", instruction: "→ 'in Finland'", answer: "Suomessa" } },
    { id: "l-d3", kind: "transform", sectionId: "elative",  data: { base: "koulu", instruction: "→ 'from school'", answer: "koulusta" } },
    { id: "l-d4", kind: "transform", sectionId: "illative", data: { base: "talo", instruction: "→ 'into the house'", answer: "taloon" } },
    { id: "l-d5", kind: "transform", sectionId: "adessive", data: { base: "pöytä", instruction: "→ 'on the table'", answer: "pöydällä" } },
    { id: "l-d6", kind: "transform", sectionId: "allative", data: { base: "pöytä", instruction: "→ 'onto the table'", answer: "pöydälle" } },
    { id: "l-d7", kind: "transform", sectionId: "ablative", data: { base: "opettaja", instruction: "→ 'from the teacher'", answer: "opettajalta" } },

    { id: "l-d8", kind: "mc", sectionId: "inessive",
      data: { prompt: "'I live in Helsinki' — pick the form of Helsinki.",
        options: ["Helsinkiin", "Helsingissä", "Helsingistä", "Helsinkiä"], correctIndex: 1,
        explanation: "Static location inside → inessive -ssä." } },
    { id: "l-d9", kind: "mc", sectionId: "illative",
      data: { prompt: "'I'm going to Finland' — pick the form.",
        options: ["Suomessa", "Suomesta", "Suomeen", "Suomelle"], correctIndex: 2 } },

    { id: "l-d10", kind: "fill", sectionId: "adessive",
      data: { sentence: "Minulla on kirja _____ (pöytä).", answer: "pöydällä", hint: "on the table → adessive + gradation", baseForm: "pöytä" } },
    { id: "l-d11", kind: "fill", sectionId: "inessive",
      data: { sentence: "Asun _____ (Suomi).", answer: "Suomessa", hint: "static 'in' → inessive", baseForm: "Suomi" } },

    { id: "l-d12", kind: "spot-error", sectionId: "illative",
      data: { sentence: "Menen Suomessa kesällä.", errorWord: "Suomessa", correctForm: "Suomeen",
        explanation: "'Menen' = 'I'm going (to)' — motion toward. Needs illative 'Suomeen', not inessive 'Suomessa'." } },

    { id: "l-d13", kind: "translate", sectionId: "adessive",
      data: { prompt: "I have a cat.", target: "Minulla on kissa", gradingFocus: "adessive possession",
        acceptAlso: ["Minulla on kissa.", "minulla on kissa"] } },

    { id: "l-d14", kind: "builder", sectionId: "illative",
      data: { tiles: ["kouluun", "menen", "aamulla"], correctOrder: [1, 0, 2], translation: "I go to school in the morning." } },

    { id: "l-d15", kind: "listen", sectionId: "adessive",
      data: { transcript: "Kirja on pöydällä.", question: "Which case is 'pöydällä'?",
        options: ["Inessive (-ssa)", "Adessive (-lla)", "Allative (-lle)", "Elative (-sta)"], correctIndex: 1 } },

    { id: "l-d16", kind: "table", sectionId: "inessive",
      data: {
        headers: ["Base", "in (ss-)", "from (st-)", "to (-Vn)"],
        rows: [
          { label: "talo", cells: [{ value: "talo", blank: false }, { value: "talossa", blank: true }, { value: "talosta", blank: true }, { value: "taloon", blank: true }] },
          { label: "Suomi", cells: [{ value: "Suomi", blank: false }, { value: "Suomessa", blank: true }, { value: "Suomesta", blank: true }, { value: "Suomeen", blank: true }] },
          { label: "koulu", cells: [{ value: "koulu", blank: false }, { value: "koulussa", blank: true }, { value: "koulusta", blank: true }, { value: "kouluun", blank: true }] },
        ],
      } },
    { id: "l-d17", kind: "table", sectionId: "adessive",
      data: {
        headers: ["Base", "on (-lla)", "off (-lta)", "onto (-lle)"],
        rows: [
          { label: "pöytä", cells: [{ value: "pöytä", blank: false }, { value: "pöydällä", blank: true }, { value: "pöydältä", blank: true }, { value: "pöydälle", blank: true }] },
          { label: "katu", cells: [{ value: "katu", blank: false }, { value: "kadulla", blank: true }, { value: "kadulta", blank: true }, { value: "kadulle", blank: true }] },
        ],
      } },
  ],

  sources: [
    { label: "Uusi kielemme — Locative cases", url: "https://uusikielemme.fi/finnish-grammar/grammatical-cases/the-finnish-cases" },
    { label: "Wiktionary — Finnish declension", url: "https://en.wiktionary.org/wiki/Appendix:Finnish_noun_declension" },
  ],
};
