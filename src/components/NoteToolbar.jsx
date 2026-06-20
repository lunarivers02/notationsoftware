import { DURATIONS } from "../model/score";

// Duration + rest toggle, as clickable mouse alternatives to the keyboard
// shortcuts (1/2/4/8/6 and R). Pitch is keyboard-only now (letters A-G) —
// see the instructions banner in App.jsx for the full shortcut list.
export default function NoteToolbar({
  selectedDuration,
  onSelectDuration,
  isRestMode,
  onToggleRest,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-group">
        <span className="toolbar-label">Duration</span>
        {DURATIONS.map((d) => (
          <button
            key={d.id}
            className={`btn ${selectedDuration === d.id ? "btn-active" : ""}`}
            onClick={() => onSelectDuration(d.id)}
            title={d.label}
          >
            {d.label}
          </button>
        ))}
        <button
          className={`btn ${isRestMode ? "btn-active" : ""}`}
          onClick={onToggleRest}
        >
          Rest
        </button>
      </div>
    </div>
  );
}
