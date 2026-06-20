/**
 * Instrument library with realistic orchestral/ensemble instruments
 * Each instrument defines: name, family, clefs, transposition, range
 */

export const INSTRUMENT_FAMILIES = {
  WOODWINDS: "woodwinds",
  BRASS: "brass",
  STRINGS: "strings",
  PERCUSSION: "percussion",
  KEYBOARD: "keyboard",
  VOICES: "voices",
};

export const INSTRUMENTS = {
  // Woodwinds
  piccolo: {
    name: "Piccolo",
    family: INSTRUMENT_FAMILIES.WOODWINDS,
    clefs: ["treble"],
    transposition: 12, // semitones above concert pitch
    range: { low: "d/5", high: "c/8" },
    abbreviation: "Picc.",
  },
  flute: {
    name: "Flute",
    family: INSTRUMENT_FAMILIES.WOODWINDS,
    clefs: ["treble"],
    transposition: 0,
    range: { low: "c/4", high: "d/7" },
    abbreviation: "Fl.",
  },
  oboe: {
    name: "Oboe",
    family: INSTRUMENT_FAMILIES.WOODWINDS,
    clefs: ["treble"],
    transposition: 0,
    range: { low: "b/3", high: "a/6" },
    abbreviation: "Ob.",
  },
  englishHorn: {
    name: "English Horn",
    family: INSTRUMENT_FAMILIES.WOODWINDS,
    clefs: ["treble"],
    transposition: -7, // F instrument
    range: { low: "e/3", high: "d/6" },
    abbreviation: "E.H.",
  },
  clarinet: {
    name: "Clarinet",
    family: INSTRUMENT_FAMILIES.WOODWINDS,
    clefs: ["treble"],
    transposition: -2, // B♭ clarinet
    range: { low: "d/3", high: "a/6" },
    abbreviation: "Cl.",
  },
  bassoon: {
    name: "Bassoon",
    family: INSTRUMENT_FAMILIES.WOODWINDS,
    clefs: ["tenor", "bass"],
    transposition: 0,
    range: { low: "b/1", high: "e/5" },
    abbreviation: "Bn.",
  },

  // Brass
  frenchHorn: {
    name: "French Horn",
    family: INSTRUMENT_FAMILIES.BRASS,
    clefs: ["treble"],
    transposition: -7, // F instrument
    range: { low: "b/1", high: "f/5" },
    abbreviation: "Hn.",
  },
  trumpet: {
    name: "Trumpet",
    family: INSTRUMENT_FAMILIES.BRASS,
    clefs: ["treble"],
    transposition: -2, // B♭ trumpet
    range: { low: "e/3", high: "c/6" },
    abbreviation: "Tpt.",
  },
  trombone: {
    name: "Trombone",
    family: INSTRUMENT_FAMILIES.BRASS,
    clefs: ["tenor", "bass"],
    transposition: 0,
    range: { low: "e/1", high: "b/4" },
    abbreviation: "Tbn.",
  },
  tuba: {
    name: "Tuba",
    family: INSTRUMENT_FAMILIES.BRASS,
    clefs: ["bass"],
    transposition: 0,
    range: { low: "a/0", high: "g/3" },
    abbreviation: "Tba.",
  },

  // Strings
  violin: {
    name: "Violin",
    family: INSTRUMENT_FAMILIES.STRINGS,
    clefs: ["treble"],
    transposition: 0,
    range: { low: "g/3", high: "e/7" },
    abbreviation: "Vn.",
  },
  viola: {
    name: "Viola",
    family: INSTRUMENT_FAMILIES.STRINGS,
    clefs: ["alto", "treble"],
    transposition: 0,
    range: { low: "c/3", high: "a/6" },
    abbreviation: "Va.",
  },
  cello: {
    name: "Cello",
    family: INSTRUMENT_FAMILIES.STRINGS,
    clefs: ["tenor", "bass"],
    transposition: 0,
    range: { low: "c/2", high: "a/5" },
    abbreviation: "Vc.",
  },
  doubleBass: {
    name: "Double Bass",
    family: INSTRUMENT_FAMILIES.STRINGS,
    clefs: ["bass"],
    transposition: 0,
    range: { low: "e/1", high: "c/5" },
    abbreviation: "D.B.",
  },

  // Percussion
  timpani: {
    name: "Timpani",
    family: INSTRUMENT_FAMILIES.PERCUSSION,
    clefs: ["bass"],
    transposition: 0,
    range: { low: "d/2", high: "a/4" },
    abbreviation: "Timp.",
  },
  snare: {
    name: "Snare Drum",
    family: INSTRUMENT_FAMILIES.PERCUSSION,
    clefs: ["percussion"],
    transposition: 0,
    range: { low: "a/4", high: "a/4" }, // unpitched
    abbreviation: "Sn.",
  },
  xylophone: {
    name: "Xylophone",
    family: INSTRUMENT_FAMILIES.PERCUSSION,
    clefs: ["treble"],
    transposition: 0,
    range: { low: "g/4", high: "c/8" },
    abbreviation: "Xyl.",
  },

  // Keyboard
  piano: {
    name: "Piano",
    family: INSTRUMENT_FAMILIES.KEYBOARD,
    clefs: ["treble", "bass"], // grand staff
    transposition: 0,
    range: { low: "a/0", high: "c/8" },
    abbreviation: "Pno.",
  },

  // Voices
  soprano: {
    name: "Soprano",
    family: INSTRUMENT_FAMILIES.VOICES,
    clefs: ["treble"],
    transposition: 0,
    range: { low: "c/4", high: "a/5" },
    abbreviation: "S.",
  },
  alto: {
    name: "Alto",
    family: INSTRUMENT_FAMILIES.VOICES,
    clefs: ["treble"],
    transposition: 0,
    range: { low: "g/3", high: "e/5" },
    abbreviation: "A.",
  },
  tenor: {
    name: "Tenor",
    family: INSTRUMENT_FAMILIES.VOICES,
    clefs: ["tenor", "treble"],
    transposition: 0,
    range: { low: "c/3", high: "c/5" },
    abbreviation: "T.",
  },
  bass: {
    name: "Bass",
    family: INSTRUMENT_FAMILIES.VOICES,
    clefs: ["bass"],
    transposition: 0,
    range: { low: "e/2", high: "g/4" },
    abbreviation: "B.",
  },
};

/**
 * Pre-built ensemble templates for quick score setup
 */
export const ENSEMBLE_TEMPLATES = {
  soloInstrument: {
    name: "Solo Instrument",
    instruments: ["piano"],
  },
  stringQuartet: {
    name: "String Quartet",
    instruments: ["violin", "violin", "viola", "cello"],
  },
  woodwindQuintet: {
    name: "Woodwind Quintet",
    instruments: ["flute", "oboe", "clarinet", "frenchHorn", "bassoon"],
  },
  brassBand: {
    name: "Brass Band",
    instruments: ["trumpet", "frenchHorn", "trombone", "tuba"],
  },
  smallOrchestra: {
    name: "Small Orchestra",
    instruments: [
      "flute",
      "oboe",
      "clarinet",
      "bassoon",
      "frenchHorn",
      "trumpet",
      "trombone",
      "timpani",
      "violin",
      "violin",
      "viola",
      "cello",
      "doubleBass",
    ],
  },
  pianoReduction: {
    name: "Piano Reduction",
    instruments: ["piano"],
  },
  satb: {
    name: "SATB Chorus",
    instruments: ["soprano", "alto", "tenor", "bass"],
  },
};

/**
 * Get the primary clef for an instrument
 */
export function getPrimaryClef(instrumentKey) {
  const inst = INSTRUMENTS[instrumentKey];
  return inst?.clefs[0] || "treble";
}

/**
 * Get all instruments in a family
 */
export function getInstrumentsByFamily(family) {
  return Object.entries(INSTRUMENTS)
    .filter(([_, inst]) => inst.family === family)
    .map(([key, inst]) => ({ key, ...inst }));
}
