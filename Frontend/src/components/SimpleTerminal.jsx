import React, { forwardRef, useImperativeHandle, useRef } from "react";
import "./SimpleTerminal.css";

const SimpleTerminal = forwardRef(function SimpleTerminal(props, ref) {
  const contentRef = useRef([]);
  const displayRef = useRef(null);

  const updateDisplay = () => {
    if (displayRef.current) {
      displayRef.current.textContent = contentRef.current.join("");
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      write: (text) => {
        if (!text) return;
        contentRef.current.push(text);
        updateDisplay();
      },
      writeln: (text) => {
        if (text) contentRef.current.push(text);
        contentRef.current.push("\n");
        updateDisplay();
      },
      clear: () => {
        contentRef.current = [];
        updateDisplay();
      },
      reset: () => {
        contentRef.current = [];
        updateDisplay();
      },
    }),
    []
  );

  return (
    <div className="simple-terminal">
      <pre ref={displayRef} className="simple-terminal-content"></pre>
    </div>
  );
});

SimpleTerminal.displayName = "SimpleTerminal";

export default SimpleTerminal;
