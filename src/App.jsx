import { useState, useCallback, useEffect, useMemo } from "react";
import {
  createScore,
  createNote,
  addInstrument,
  removeInstrument,
  addMeasure,
  insertNoteAt,
  removeNoteAt,
  measureBeatsUsed,
  measureBeatsCapacity,
  DURATIONS,
} from "./model/score";
import {
  initialCursor,
  resolveCursor,
  moveCursorLeft,
  moveCursorRight,
  moveCursorVertical,
} from "./model/cursor";
import Staff from "./components/Staff";
import NoteToolbar from "./components/NoteToolbar";
import "./App.css";

const CLEF_OPTIONS = ["treble", "bass", "alto", "tenor"];
const BEAT_VALUE = { w: 4, h: 2, q: 1, "8": 0.5, "16": 0.25 };

// Keyboard shortcuts for duration, matching the common Sibelius/Finale convention
// (number row sets duration of the NEXT note typed).
const DURATION_KEYS = { "1": "w", "2": "h", "4": "q", "8": "8", "6": "16" };

// Letter keys A-G map directly to pitch names.
const PITCH_LETTERS = new Set(["a", "b", "c", "d", "e", "f", "g"]);

export default function App() {
  const [score, setScore] = useState(() => createScore({ title: "My Score" }));
  const [cursor, setCursor] = useState(() => initialCursor(score));
  const [selectedDuration, setSelectedDuration] = useState("q");
  const [isRestMode, setIsRestMode] = useState(false);
  // Remember the last octave used per instrument so repeated letters stay in a sensible register
  const [lastOctave, setLastOctave] = useState(4);

  // Keep cursor valid if instruments/measures are added or removed
  useEffect(() => {
    const resolved = resolveCursor(score, cursor);
    if (!resolved) setCursor(initialCursor(score));
  }, [score, cursor]);

  // ---- Core note entry: insert a note/rest at the cursor, then advance ----
  const insertAtCursor = useCallback(
    (pitchLetter) => {
      const resolved = resolveCursor(score, cursor);
      if (!resolved) return;
      const { measure } = resolved;

      const beats = BEAT_VALUE[selectedDuration];
      const used = measureBeatsUsed(measure);
      const capacity = measureBeatsCapacity(measure);
      if (used + beats > capacity + 0.001) return; // measure full, do nothing

      const note = createNote({
        keys: [`${pitchLetter}/${lastOctave}`],
        duration: selectedDuration,
        isRest: isRestMode,
      });

      setScore((prevScore) =>
        insertNoteAt(prevScore, cursor.instrumentId, cursor.measureId, cursor.noteIndex, note)
      );
      // Advance by exactly one position within the same measure (NOT moveCursorRight's
      // navigation logic — that treats "at the last existing note" as "end of measure"
      // and would jump ahead prematurely right after a fresh insert).
      setCursor((prev) => ({ ...prev, noteIndex: prev.noteIndex + 1 }));
    },
    [cursor, selectedDuration, isRestMode, lastOctave, score]
  );

  const deleteBeforeCursor = useCallback(() => {
    setScore((prevScore) => {
      const resolved = resolveCursor(prevScore, cursor);
      if (!resolved || cursor.noteIndex === 0) return prevScore;
      return removeNoteAt(prevScore, cursor.instrumentId, cursor.measureId, cursor.noteIndex - 1);
    });
    setCursor((prev) => (prev.noteIndex > 0 ? { ...prev, noteIndex: prev.noteIndex - 1 } : prev));
  }, [cursor]);

  // ---- Global keyboard handler ----
  useEffect(() => {
    function onKeyDown(e) {
      // Don't hijack typing when focus is in a text input (e.g. score title)
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

      const key = e.key.toLowerCase();

      if (PITCH_LETTERS.has(key)) {
        e.preventDefault();
        insertAtCursor(key);
        return;
      }
      if (DURATION_KEYS[e.key]) {
        e.preventDefault();
        setSelectedDuration(DURATION_KEYS[e.key]);
        return;
      }
      if (key === "r") {
        e.preventDefault();
        setIsRestMode((r) => !r);
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCursor((prev) => moveCursorLeft(score, prev));
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setCursor((prev) => moveCursorRight(score, prev));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (e.shiftKey) {
          // Shift+Up: raise octave of the pitch register used for new notes
          setLastOctave((o) => Math.min(o + 1, 7));
        } else {
          setCursor((prev) => moveCursorVertical(score, prev, -1));
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (e.shiftKey) {
          setLastOctave((o) => Math.max(o - 1, 1));
        } else {
          setCursor((prev) => moveCursorVertical(score, prev, 1));
        }
        return;
      }
      if (e.key === "Backspace") {
        e.preventDefault();
        deleteBeforeCursor();
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [insertAtCursor, deleteBeforeCursor, score]);

  // ---- Mouse fallback: clicking still works, and also moves the cursor there ----
  const handleMeasureClick = useCallback(
    (instrumentId, measureId) => {
      setCursor((prev) => {
        const inst = score.instruments.find((i) => i.id === instrumentId);
        const measure = inst.measures.find((m) => m.id === measureId);
        return { instrumentId, measureId, noteIndex: measure.notes.length };
      });
    },
    [score]
  );

  const handleNoteClick = useCallback(({ instrumentId, measureId, noteIndex }) => {
    setCursor({ instrumentId, measureId, noteIndex });
  }, []);

  const handleAddInstrument = (clef) => {
    setScore((prev) => addInstrument(prev, { name: `New ${clef} part`, clef }));
  };

  const durationLabel = useMemo(
    () => DURATIONS.find((d) => d.id === selectedDuration)?.label ?? selectedDuration,
    [selectedDuration]
  );

  return (
    <div className="app">
      <header className="app-header">
        <input
          className="title-input"
          value={score.title}
          onChange={(e) => setScore((p) => ({ ...p, title: e.target.value }))}
        />
      </header>

      <NoteToolbar
        selectedDuration={selectedDuration}
        onSelectDuration={setSelectedDuration}
        isRestMode={isRestMode}
        onToggleRest={() => setIsRestMode((r) => !r)}
      />

      <div className="instructions">
        <strong>Keyboard:</strong> letters A–G enter a note · 1/2/4/8/6 set duration (whole/half/quarter/eighth/sixteenth)
        · R toggles rest · ←/→ move cursor · ↑/↓ switch instrument · Shift+↑/↓ change octave (currently <strong>{lastOctave}</strong>)
        · Backspace deletes. Click a note or empty measure to move the cursor there with the mouse.
        Current duration: <strong>{durationLabel}{isRestMode ? " (rest)" : ""}</strong>
      </div>

      <div className="score">
        {score.instruments.map((inst) => (
          <div key={inst.id} className="instrument-row">
            <div className="instrument-label">
              <span>{inst.name}</span>
              <button
                className="btn btn-small"
                onClick={() => setScore((p) => addMeasure(p, inst.id))}
              >
                + Measure
              </button>
              {score.instruments.length > 1 && (
                <button
                  className="btn btn-small btn-danger"
                  onClick={() => setScore((p) => removeInstrument(p, inst.id))}
                >
                  Remove
                </button>
              )}
            </div>
            <MeasureClickLayer
              instrument={inst}
              cursor={cursor && cursor.instrumentId === inst.id ? cursor : null}
              onMeasureClick={(measureId) => handleMeasureClick(inst.id, measureId)}
              onNoteClick={handleNoteClick}
            />
          </div>
        ))}
      </div>

      <div className="add-instrument-row">
        <span className="toolbar-label">Add instrument:</span>
        {CLEF_OPTIONS.map((clef) => (
          <button key={clef} className="btn btn-small" onClick={() => handleAddInstrument(clef)}>
            {clef}
          </button>
        ))}
      </div>
    </div>
  );
}

// Wraps Staff with a transparent click layer split into per-measure columns,
// so we know WHICH measure was clicked even on empty space (VexFlow notes
// handle their own click via onNoteClick inside the renderer).
function MeasureClickLayer({ instrument, onMeasureClick, onNoteClick, cursor }) {
  return (
    <div className="staff-wrap" style={{ position: "relative" }}>
      <Staff instrument={instrument} onNoteClick={onNoteClick} cursor={cursor} />
      <div className="measure-click-overlay">
        {instrument.measures.map((m) => (
          <div
            key={m.id}
            className="measure-click-zone"
            onClick={() => onMeasureClick(m.id)}
            title="Click to move cursor here"
          />
        ))}
      </div>
    </div>
  );
}
