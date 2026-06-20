/**
 * Advanced notation properties for musical expression
 * Includes articulations, dynamics, ornaments, and other markings
 */

export const ARTICULATIONS = {
  staccato: { symbol: ".", label: "Staccato", shortcut: "." },
  tenuto: { symbol: "−", label: "Tenuto", shortcut: "-" },
  accent: { symbol: ">", label: "Accent", shortcut: ">" },
  marcato: { symbol: "^", label: "Marcato", shortcut: "^" },
  staccatissimo: { symbol: "'" or "v", label: "Staccatissimo", shortcut: "'" },
  pizzicato: { symbol: "pizz.", label: "Pizzicato", shortcut: "p" },
  arco: { symbol: "arco", label: "Arco", shortcut: "a" },
  tremolo: { symbol: "tremolo", label: "Tremolo", shortcut: "t" },
  fermata: { symbol: "𝄐", label: "Fermata", shortcut: "f" },
};

export const DYNAMICS = {
  ppp: { label: "Pianississimo", value: 1, shortcut: "ppp" },
  pp: { label: "Pianissimo", value: 2, shortcut: "pp" },
  p: { label: "Piano", value: 3, shortcut: "p" },
  mp: { label: "Mezzo-piano", value: 4, shortcut: "mp" },
  mf: { label: "Mezzo-forte", value: 5, shortcut: "mf" },
  f: { label: "Forte", value: 6, shortcut: "f" },
  ff: { label: "Fortissimo", value: 7, shortcut: "ff" },
  fff: { label: "Fortississimo", value: 8, shortcut: "fff" },
  sfz: { label: "Sforzando", value: 6.5, shortcut: "sfz" },
  cresc: { label: "Crescendo", value: "variable", shortcut: "cresc" },
  dim: { label: "Diminuendo", value: "variable", shortcut: "dim" },
};

export const ACCIDENTALS = {
  natural: { symbol: "♮", semitones: 0, label: "Natural", shortcut: "n" },
  sharp: { symbol: "♯", semitones: 1, label: "Sharp", shortcut: "#" },
  doubleSharp: { symbol: "𝄪", semitones: 2, label: "Double Sharp", shortcut: "##" },
  flat: { symbol: "♭", semitones: -1, label: "Flat", shortcut: "b" },
  doubleFlat: { symbol: "𝄫", semitones: -2, label: "Double Flat", shortcut: "bb" },
};

export const ORNAMENTS = {
  trill: { symbol: "tr", label: "Trill", shortcut: "tr" },
  mordent: { symbol: "m", label: "Mordent", shortcut: "m" },
  turn: { symbol: "𝄥", label: "Turn", shortcut: "tu" },
  inverted_turn: { symbol: "⁋", label: "Inverted Turn", shortcut: "it" },
  slide: { symbol: "/", label: "Slide", shortcut: "/" },
  glissando: { symbol: "gliss.", label: "Glissando", shortcut: "gl" },
  arpeggio: { symbol: "𝄞", label: "Arpeggio", shortcut: "arp" },
};

export const TEMPO_MARKS = {
  largo: { label: "Largo", bpm: 40 },
  adagio: { label: "Adagio", bpm: 66 },
  andante: { label: "Andante", bpm: 76 },
  moderato: { label: "Moderato", bpm: 108 },
  allegro: { label: "Allegro", bpm: 120 },
  vivace: { label: "Vivace", bpm: 156 },
  presto: { label: "Presto", bpm: 168 },
};

export const TEXT_EXPRESSIONS = {
  muted: "con sordino",
  unmuted: "senza sordino",
  vibrato: "con vibrato",
  noVibrato: "senza vibrato",
  softMallet: "soft mallets",
  hardMallet: "hard mallets",
  naturalHarmonic: "nat. harm.",
  artificialHarmonic: "art. harm.",
  sul_pont: "sul ponticello",
  sul_tasto: "sul tasto",
  ordinario: "ordinario",
  flutter: "flutter tonguing",
};

/**
 * Extended note model with articulation and dynamic properties
 * Structure: { keys, duration, isRest, accidentals, articulation, dynamic, ornament }
 */
export function createAdvancedNote({
  keys = ["b/4"],
  duration = "q",
  isRest = false,
  accidentals = {},  // { "b/4": "sharp" }
  articulations = [],  // ["staccato", "accent"]
  dynamics = null,  // "f", "pp", etc.
  ornaments = [],  // ["trill", "mordent"]
  textExpression = null,  // "con sordino", etc.
  velocity = 100,  // 0-127 for playback
  fermata = false,
} = {}) {
  return {
    id: crypto.randomUUID(),
    keys,
    duration,
    isRest,
    accidentals,
    articulations,
    dynamics,
    ornaments,
    textExpression,
    velocity,
    fermata,
  };
}

/**
 * Update note with new articulation
 */
export function addArticulation(note, articulationKey) {
  const art = ARTICULATIONS[articulationKey];
  if (!art) return note;
  return {
    ...note,
    articulations: [...new Set([...note.articulations, articulationKey])],
  };
}

/**
 * Remove articulation from note
 */
export function removeArticulation(note, articulationKey) {
  return {
    ...note,
    articulations: note.articulations.filter((a) => a !== articulationKey),
  };
}

/**
 * Update note dynamics
 */
export function setNoteDynamic(note, dynamicKey) {
  return { ...note, dynamics: dynamicKey };
}

/**
 * Add accidental to a specific pitch in the note
 */
export function addAccidental(note, pitchKey, accidentalKey) {
  const acc = ACCIDENTALS[accidentalKey];
  if (!acc) return note;
  return {
    ...note,
    accidentals: {
      ...note.accidentals,
      [pitchKey]: accidentalKey,
    },
  };
}

/**
 * Add ornament to note
 */
export function addOrnament(note, ornamentKey) {
  const orn = ORNAMENTS[ornamentKey];
  if (!orn) return note;
  return {
    ...note,
    ornaments: [...new Set([...note.ornaments, ornamentKey])],
  };
}

/**
 * Get display text for a note with all its markings
 */
export function getNoteDisplayLabel(note) {
  let label = note.keys.join(", ");
  
  if (note.articulations.length > 0) {
    label += ` [${note.articulations.map((a) => ARTICULATIONS[a].symbol).join("")}]`;
  }
  
  if (note.dynamics) {
    label += ` ${note.dynamics}`;
  }
  
  if (note.ornaments.length > 0) {
    label += ` (${note.ornaments.map((o) => ORNAMENTS[o].label).join(", ")})`;
  }
  
  return label;
}
