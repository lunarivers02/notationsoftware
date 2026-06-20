// ---- Core data model ----
// This is the single source of truth for a score. The renderer reads it,
// note-entry mutates it, and later: playback + file export will read it too.
// Keep this layer free of any VexFlow/rendering concerns.

// A Note: { keys: ["c/4"], duration: "q", isRest: false }
//   - keys: VexFlow-style pitch strings (note/octave). Chords = multiple keys.
//   - duration: VexFlow duration string: "w","h","q","8","16",... (+"r" for rest, e.g. "qr")

export const DURATIONS = [
  { id: "w", label: "Whole", beats: 4 },
  { id: "h", label: "Half", beats: 2 },
  { id: "q", label: "Quarter", beats: 1 },
  { id: "8", label: "Eighth", beats: 0.5 },
  { id: "16", label: "Sixteenth", beats: 0.25 },
];

export function createNote({ keys = ["b/4"], duration = "q", isRest = false } = {}) {
  return { id: crypto.randomUUID(), keys, duration, isRest };
}

export function createMeasure({ notes = [], timeSig = "4/4" } = {}) {
  return { id: crypto.randomUUID(), notes, timeSig };
}

export function createInstrument({
  name = "Piano",
  clef = "treble",
  measures = null,
  measureCount = 4,
} = {}) {
  return {
    id: crypto.randomUUID(),
    name,
    clef, // "treble" | "bass" | "alto" | "tenor"
    measures: measures ?? Array.from({ length: measureCount }, () => createMeasure()),
  };
}

export function createScore({ title = "Untitled Score", instruments = null } = {}) {
  return {
    title,
    instruments: instruments ?? [createInstrument()],
  };
}

// ---- Helpers for mutating the model immutably (React-friendly) ----

export function updateMeasureNotes(score, instrumentId, measureId, notes) {
  return {
    ...score,
    instruments: score.instruments.map((inst) =>
      inst.id !== instrumentId
        ? inst
        : {
            ...inst,
            measures: inst.measures.map((m) =>
              m.id !== measureId ? m : { ...m, notes }
            ),
          }
    ),
  };
}

// Insert a note at a given index within a measure (used by keyboard entry,
// where the cursor marks "insert here" rather than always appending at the end).
export function insertNoteAt(score, instrumentId, measureId, index, note) {
  const inst = score.instruments.find((i) => i.id === instrumentId);
  const measure = inst.measures.find((m) => m.id === measureId);
  const notes = [...measure.notes.slice(0, index), note, ...measure.notes.slice(index)];
  return updateMeasureNotes(score, instrumentId, measureId, notes);
}

// Replace the note at a given index (used when you retype a pitch/duration
// at the current cursor position instead of always inserting a new one).
export function replaceNoteAt(score, instrumentId, measureId, index, note) {
  const inst = score.instruments.find((i) => i.id === instrumentId);
  const measure = inst.measures.find((m) => m.id === measureId);
  const notes = measure.notes.map((n, i) => (i === index ? note : n));
  return updateMeasureNotes(score, instrumentId, measureId, notes);
}

// Remove the note at a given index (backspace).
export function removeNoteAt(score, instrumentId, measureId, index) {
  const inst = score.instruments.find((i) => i.id === instrumentId);
  const measure = inst.measures.find((m) => m.id === measureId);
  const notes = measure.notes.filter((_, i) => i !== index);
  return updateMeasureNotes(score, instrumentId, measureId, notes);
}

export function addMeasure(score, instrumentId) {
  return {
    ...score,
    instruments: score.instruments.map((inst) =>
      inst.id !== instrumentId
        ? inst
        : { ...inst, measures: [...inst.measures, createMeasure()] }
    ),
  };
}

export function addInstrument(score, opts) {
  return {
    ...score,
    instruments: [...score.instruments, createInstrument(opts)],
  };
}

export function removeInstrument(score, instrumentId) {
  return {
    ...score,
    instruments: score.instruments.filter((inst) => inst.id !== instrumentId),
  };
}

// Sum of beats currently in a measure, given its time signature numerator/denominator
export function measureBeatsUsed(measure) {
  const beatValue = { w: 4, h: 2, q: 1, "8": 0.5, "16": 0.25 };
  return measure.notes.reduce((sum, n) => sum + (beatValue[n.duration] || 0), 0);
}

export function measureBeatsCapacity(measure) {
  const [num, den] = measure.timeSig.split("/").map(Number);
  return num * (4 / den);
}
