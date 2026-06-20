import { useEffect, useRef } from "react";
import { renderInstrument } from "../render/renderInstrument";

export default function Staff({ instrument, onNoteClick, cursor, onLayout }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const layout = renderInstrument(containerRef.current, instrument, { onNoteClick, cursor });
    onLayout?.(layout);
  }, [instrument, onNoteClick, cursor, onLayout]);

  return <div className="staff" ref={containerRef} />;
}
