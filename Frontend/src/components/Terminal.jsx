import React, { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { Terminal as XTerm } from "xterm";
import "xterm/css/xterm.css";
import "./Terminal.css";

const Terminal = forwardRef(function Terminal(props, ref) {
  const { className = "" } = props;
  const containerRef = useRef(null);
  const terminalRef = useRef(null);

  useImperativeHandle(
    ref,
    () => ({
      write: (text) => {
        if (terminalRef.current && text) {
          console.log("🖨️ Terminal.write() called, text length:", text.length);
          try {
            // Replace \n with \r\n for proper terminal line endings
            const processedText = text.replace(/\n/g, "\r\n");
            terminalRef.current.write(processedText);
            console.log("✅ Text written successfully");
          } catch (e) {
            console.error("❌ Error writing to terminal:", e.message);
          }
        } else {
          console.warn("⚠️ Terminal.write() called but terminalRef or text invalid", {
            hasTerminal: !!terminalRef.current,
            text: text?.substring(0, 50),
          });
        }
      },
      writeln: (text) => {
        if (terminalRef.current) {
          if (text) {
            console.log("🖨️ Terminal.writeln() called with text:", text.substring(0, 100));
            terminalRef.current.write(text);
          }
          terminalRef.current.write("\r\n");
        }
      },
      clear: () => {
        if (terminalRef.current) {
          console.log("🧹 Terminal.clear() called");
          terminalRef.current.clear();
        }
      },
      reset: () => {
        if (terminalRef.current) {
          console.log("🔄 Terminal.reset() called");
          terminalRef.current.reset();
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (!containerRef.current) return undefined;

    const term = new XTerm({
      cursorBlink: true,
      fontFamily: "'Source Code Pro', 'Consolas', 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 1.5,
      theme: {
        background: "#1e1e1e",
        foreground: "#d4d4d4",
        cursor: "#d4d4d4",
        selectionBackground: "#264f78",
      },
      scrollback: 3000,
      convertEol: true,
    });

    term.open(containerRef.current);
    console.log("✅ xterm terminal opened in container");
    terminalRef.current = term;

    // Let terminal know to fit to container dimensions
    setTimeout(() => {
      try {
        // Check actual dimensions
        const containerDims = {
          width: containerRef.current?.clientWidth,
          height: containerRef.current?.clientHeight,
          offsetWidth: containerRef.current?.offsetWidth,
          offsetHeight: containerRef.current?.offsetHeight,
        };
        const termDims = {
          cols: term.cols,
          rows: term.rows,
          screenElement: term.element?.className,
        };
        console.log("📏 Container dimensions:", containerDims);
        console.log("📏 Terminal dimensions:", termDims);
        console.log("📏 Canvas element:", {
          exists: !!term.element?.querySelector("canvas"),
          width: term.element?.querySelector("canvas")?.width,
          height: term.element?.querySelector("canvas")?.height,
        });
      } catch (e) {
        console.error("❌ Error checking dimensions:", e);
      }
    }, 200);

    return () => {
      if (terminalRef.current) {
        terminalRef.current.dispose();
        terminalRef.current = null;
      }
    };
  }, []);

  return <div ref={containerRef} className={`terminal-root ${className}`} />;
});

Terminal.displayName = "Terminal";

export default Terminal;
