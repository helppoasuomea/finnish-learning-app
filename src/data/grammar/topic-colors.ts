/**
 * Hue (degrees, oklch) per grammar topic.
 * The 12 cases are distributed ~30° apart around the full wheel.
 * Verbs and participles fill the remaining gaps.
 * Minimum spacing between the most commonly co-occurring topics: 30°.
 */
export const TOPIC_HUE: Record<string, number> = {
  // ── Nominal cases — one per 30° slot ──
  'partitive':           0,   // red          — partial / ongoing
  'genitive':           30,   // amber-orange  — possession
  'allative':           60,   // yellow        — movement onto/to
  'ablative':           90,   // yellow-green  — movement from surface
  'adessive':          120,   // green         — on / at / by means of
  'elative':           150,   // teal-green    — from inside
  'inessive':          180,   // cyan          — inside
  'nominative':        210,   // blue          — subject (neutral)
  'illative':          240,   // indigo        — into / direction in
  'essive':            270,   // violet        — temporary state "as"
  'translative':       300,   // magenta       — becoming / change of state
  'accusative':        330,   // rose-pink     — total direct object

  // Rare nominal cases — share nearest semantic slot
  'comitative':        300,   // with → translative hue
  'instructive':        90,   // by means of → ablative hue
  'abessive':           30,   // without → near genitive
  'locative-overview': 180,   // overview → inessive hue

  // ── Verb tenses & moods ──
  'present-tense':     165,   // teal-cyan     — happening now
  'imperfect':         285,   // purple        — simple past
  'perfect':           315,   // pink-magenta  — have done
  'pluperfect':        320,   // deep pink     — had done
  'conditional':        45,   // gold-amber    — would do
  'conditional-perfect': 50,  // amber         — would have done
  'imperative':         15,   // orange-red    — commands
  'passive':           345,   // crimson-rose  — generic "one does"
  'passive-past':        5,   // red           — was done
  'passive-conditional':350,  // dark rose     — would be done
  'negation':           10,   // red-orange    — negation verb

  // ── Participles & infinitives ──
  'infinitive-1':      135,   // green-teal    — dictionary form
  'infinitive-2':      155,   // teal          — while doing
  'infinitive-3':      170,   // teal-cyan     — in/from doing
  'infinitive-4':      195,   // cyan-blue     — verbal noun
  'infinitive-5':      215,   // blue          — on the verge of
  'past-participle':   255,   // blue-violet   — -nut/-nyt
  'active-present-participle': 140, // green   — -va/-vä
  'agent-participle':  125,   // green         — -ma/-mä
  'referative-construction':  245, // indigo-blue — replaces että-clause
  'temporal-construction':    265, // violet     — after doing

  // ── Morphology ──
  'consonant-gradation': 225, // blue          — k/p/t alternation
  'vowel-harmony':       190, // cyan          — a/ä alternation
  'plural-forms':        200, // sky-blue      — monikon muodot
  'possessive-suffixes': 280, // purple        — -ni/-si/-nsa

  // ── Other ──
  'time-expressions':   60,   // yellow        — shares allative hue
  'verb-tenses':       285,   // purple        — overview
  'verb-types':        130,   // green         — type 1–6
  'modal-verbs':       290,   // violet-purple — täytyy / voida
  'necessive-construction': 275, // violet     — genitive + täytyy
  'question-particle':  75,   // yellow-green  — -ko/-kö
  'clitics':            85,   // yellow-green  — -kin/-kaan
  'comparative':       105,   // lime-green    — enemmän
};

export function topicHue(topicId: string | undefined): number | undefined {
  return topicId ? TOPIC_HUE[topicId] : undefined;
}

export function topicStyle(topicId: string | undefined): React.CSSProperties {
  const hue = topicHue(topicId);
  return hue !== undefined ? ({ '--topic-hue': String(hue) } as React.CSSProperties) : {};
}
