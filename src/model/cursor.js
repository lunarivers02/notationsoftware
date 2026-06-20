// ---- Cursor model ----
// Tracks the user's current position for keyboard note entry:
// which instrument, which measure, and which index within that measure's notes.
// Kept separate from score.js on purpose: the score is "what the music is",
// the cursor is transient UI state about where the user is looking/typing.
// It should never be saved as part of the score file itself.

export function createCursor({ instrumentId, measureId, noteIndex = 0 } = {}) {
  return { instrumentId, measureId, noteIndex };
}

// Build a cursor pointing at the first measure of the first instrument in a score.
export function initialCursor(score) {
  const inst = score.instruments[0];
  if (!inst) return null;
  const measure = inst.measures[0];
  return createCursor({ instrumentId: inst.id, measureId: measure.id, noteIndex: 0 });
}

// Resolve a cursor into the actual instrument/measure objects + flat lists needed for navigation.
export function resolveCursor(score, cursor) {
  if (!cursor) return null;
  const instIndex = score.instruments.findIndex((i) => i.id === cursor.instrumentId);
  if (instIndex === -1) return null;
  const inst = score.instruments[instIndex];
  const measureIndex = inst.measures.findIndex((m) => m.id === cursor.measureId);
  if (measureIndex === -1) return null;
  const measure = inst.measures[measureIndex];
  return { inst, instIndex, measure, measureIndex };
}

// Move the cursor one note to the right. Crosses into the next measure
// (and wraps to the next instrument's first measure) when at the end.
export function moveCursorRight(score, cursor) {
  const resolved = resolveCursor(score, cursor);
  if (!resolved) return cursor;
  const { inst, instIndex, measure, measureIndex } = resolved;

  if (cursor.noteIndex < measure.notes.length) {
    return { ...cursor, noteIndex: cursor.noteIndex + 1 };
  }
  // End of measure: move to next measure in this instrument
  if (measureIndex + 1 < inst.measures.length) {
    return { instrumentId: inst.id, measureId: inst.measures[measureIndex + 1].id, noteIndex: 0 };
  }
  // End of instrument: stay put (could extend to auto-add a measure later)
  return cursor;
}

export function moveCursorLeft(score, cursor) {
  const resolved = resolveCursor(score, cursor);
  if (!resolved) return cursor;
  const { inst, instIndex, measureIndex } = resolved;

  if (cursor.noteIndex > 0) {
    return { ...cursor, noteIndex: cursor.noteIndex - 1 };
  }
  // Start of measure: move to end of previous measure
  if (measureIndex > 0) {
    const prevMeasure = inst.measures[measureIndex - 1];
    return { instrumentId: inst.id, measureId: prevMeasure.id, noteIndex: prevMeasure.notes.length };
  }
  return cursor;
}

// Move to the same horizontal position in the instrument above/below
// (approximated by measure index — good enough until measures can have
// different lengths/splits across instruments).
export function moveCursorVertical(score, cursor, direction) {
  const resolved = resolveCursor(score, cursor);
  if (!resolved) return cursor;
  const { instIndex, measureIndex } = resolved;
  const targetInstIndex = instIndex + direction;
  const targetInst = score.instruments[targetInstIndex];
  if (!targetInst) return cursor;
  const targetMeasure = targetInst.measures[measureIndex] ?? targetInst.measures[targetInst.measures.length - 1];
  if (!targetMeasure) return cursor;
  const noteIndex = Math.min(cursor.noteIndex, targetMeasure.notes.length);
  return { instrumentId: targetInst.id, measureId: targetMeasure.id, noteIndex };
}
