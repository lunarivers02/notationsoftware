// ---- Renderer ----
// Translates our score data model into VexFlow draw calls.
// This is the ONLY file that should import from "vexflow" directly —
// keeps the rendering library swappable later if needed.

import { Renderer, Stave, StaveNote, Voice, Formatter, Beam } from "vexflow";

const MEASURE_WIDTH = 220;
const STAVE_X_START = 10;
const STAVE_Y = 40;
const STAVE_HEIGHT_GAP = 110;
const CARET_COLOR = "#4a6fff";

function toVexDuration(note) {
  return note.isRest ? `${note.duration}r` : note.duration;
}

function buildStaveNote(note, clef) {
  const vn = new StaveNote({
    keys: note.isRest ? ["b/4"] : note.keys,
    duration: toVexDuration(note),
    clef,
  });
  vn.__modelNoteId = note.id;
  return vn;
}

// Draws a thin vertical caret line + small triangle marker at a given x position.
function drawCaret(ctx, x, staveTop, staveBottom) {
  ctx.save();
  ctx.setStrokeStyle(CARET_COLOR);
  ctx.setFillStyle(CARET_COLOR);
  ctx.setLineWidth(2);
  ctx.beginPath();
  ctx.moveTo(x, staveTop - 6);
  ctx.lineTo(x, staveBottom + 6);
  ctx.stroke();
  // small triangle flag at the top so it's visible even when overlapping notes
  ctx.beginPath();
  ctx.moveTo(x - 4, staveTop - 6);
  ctx.lineTo(x + 4, staveTop - 6);
  ctx.lineTo(x, staveTop + 2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Renders one instrument (a single staff line, multiple measures) into a container div.
// `cursor` (optional) is { measureId, noteIndex } scoped to THIS instrument — draws a
// caret at that position. Returns per-measure layout info other code can use for hit-testing.
export function renderInstrument(container, instrument, { onNoteClick, cursor } = {}) {
  container.innerHTML = "";

  const width = STAVE_X_START * 2 + instrument.measures.length * MEASURE_WIDTH;
  const height = STAVE_Y + STAVE_HEIGHT_GAP;

  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, height);
  const ctx = renderer.getContext();

  let x = STAVE_X_START;
  const measureLayouts = [];

  instrument.measures.forEach((measure, idx) => {
    const stave = new Stave(x, STAVE_Y, MEASURE_WIDTH);
    if (idx === 0) {
      stave.addClef(instrument.clef);
      stave.addTimeSignature(measure.timeSig);
    }
    stave.setContext(ctx).draw();

    const isEmpty = measure.notes.length === 0;
    const notesToRender = isEmpty
      ? [{ id: `__rest_placeholder_${measure.id}`, isRest: true, duration: "w", keys: ["b/4"] }]
      : measure.notes;

    const staveNotes = notesToRender.map((n) => buildStaveNote(n, instrument.clef));

    const [num, den] = measure.timeSig.split("/").map(Number);
    const voice = new Voice({ numBeats: num, beatValue: den });
    voice.setStrict(false); // don't throw if a measure is under/overfull while editing
    voice.addTickables(staveNotes);

    new Formatter().joinVoices([voice]).format([voice], MEASURE_WIDTH - 40);
    voice.draw(ctx, stave);

    // Auto-beam eighth/sixteenth notes
    const beams = Beam.generateBeams(staveNotes.filter((n) => !n.isRest()));
    beams.forEach((b) => b.setContext(ctx).draw());

    // Attach click handlers + collect real screen X for each note (post-format)
    const notePositions = [];
    staveNotes.forEach((vn, i) => {
      const modelNote = notesToRender[i];
      const noteX = vn.getAbsoluteX();
      notePositions.push(noteX);

      if (onNoteClick && !modelNote.isRest) {
        const el = vn.getSVGElement?.();
        if (el) {
          el.style.cursor = "pointer";
          el.style.pointerEvents = "auto"; // re-enable hit-testing over the click overlay
          el.addEventListener("click", (evt) => {
            evt.stopPropagation(); // don't also trigger the "add note" overlay underneath
            onNoteClick({
              instrumentId: instrument.id,
              measureId: measure.id,
              noteId: modelNote.id,
              noteIndex: i,
            });
          });
        }
      }
    });

    measureLayouts.push({
      measureId: measure.id,
      staveX: x,
      staveWidth: MEASURE_WIDTH,
      noteCount: isEmpty ? 0 : staveNotes.length,
      notePositions, // screen x for each real note (empty if isEmpty)
      noteStartX: staveNotes[0] ? staveNotes[0].getAbsoluteX() : x + 40, // fallback for caret-in-empty-measure
    });

    // Draw the caret if the cursor points at this measure
    if (cursor && cursor.measureId === measure.id) {
      const staveTop = stave.getYForLine(0);
      const staveBottom = stave.getYForLine(4);
      let caretX;
      if (isEmpty) {
        caretX = staveNotes[0].getAbsoluteX(); // sits where the placeholder rest is
      } else if (cursor.noteIndex >= staveNotes.length || !staveNotes[cursor.noteIndex]) {
        // caret after the last note (or any out-of-range index — defensive):
        // place just after the last real note's glyph
        const lastNote = staveNotes[staveNotes.length - 1];
        caretX = lastNote.getAbsoluteX() + lastNote.getWidth() + 8;
      } else {
        caretX = staveNotes[cursor.noteIndex].getAbsoluteX();
      }
      drawCaret(ctx, caretX, staveTop, staveBottom);
    }

    x += MEASURE_WIDTH;
  });

  return measureLayouts;
}
