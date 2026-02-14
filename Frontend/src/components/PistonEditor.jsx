import React, { useEffect, useMemo, useRef, useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import OutputConsole from "./OutputConsole";
import { executeCode, LANGUAGE_CONFIGS } from "../utils/pistonApi";

const STARTER_CODE = {
  python: "print('Hello from Python')",
  javascript: "console.log('Hello from JavaScript');",
  java: "public class Main {\n  public static void main(String[] args) {\n    System.out.println(\"Hello from Java\");\n  }\n}\n",
  c: "#include <stdio.h>\n\nint main() {\n  printf(\"Hello from C\\n\");\n  return 0;\n}\n",
};

const STORAGE_KEY = "__pistonRunnerState__";
const MONACO_LANGUAGE_MAP = {
  bash: "shell",
  c: "c",
  cpp: "cpp",
  csharp: "csharp",
  go: "go",
  java: "java",
  javascript: "javascript",
  julia: "julia",
  kotlin: "kotlin",
  perl: "perl",
  python: "python",
  ruby: "ruby",
  rust: "rust",
  sql: "sql",
  typescript: "typescript",
};

const PistonEditor = ({ isDarkMode = true }) => {
  const languages = useMemo(() => Object.keys(LANGUAGE_CONFIGS), []);
  const editorRef = useRef(null);
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(STARTER_CODE.python);
  const [stdin, setStdin] = useState("");
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [compileOutput, setCompileOutput] = useState("");
  const [compileStderr, setCompileStderr] = useState("");
  const [error, setError] = useState(null);
  const [executionTime, setExecutionTime] = useState(null);
  const [exitCode, setExitCode] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed.language && LANGUAGE_CONFIGS[parsed.language]) {
        setLanguage(parsed.language);
      }
      if (typeof parsed.code === "string") setCode(parsed.code);
      if (typeof parsed.stdin === "string") setStdin(parsed.stdin);
      if (typeof parsed.stdout === "string") setStdout(parsed.stdout);
      if (typeof parsed.stderr === "string") setStderr(parsed.stderr);
      if (typeof parsed.compileOutput === "string") setCompileOutput(parsed.compileOutput);
      if (typeof parsed.compileStderr === "string") setCompileStderr(parsed.compileStderr);
      if (typeof parsed.error === "string") setError(parsed.error);
      if (typeof parsed.executionTime === "number") setExecutionTime(parsed.executionTime);
      if (typeof parsed.exitCode === "number") setExitCode(parsed.exitCode);
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    const payload = {
      language,
      code,
      stdin,
      stdout,
      stderr,
      compileOutput,
      compileStderr,
      error,
      executionTime,
      exitCode,
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [
    language,
    code,
    stdin,
    stdout,
    stderr,
    compileOutput,
    compileStderr,
    error,
    executionTime,
    exitCode,
  ]);

  const handleLanguageChange = (event) => {
    const nextLanguage = event.target.value;
    setLanguage(nextLanguage);
    setCode(STARTER_CODE[nextLanguage] || "");
    setStdin("");
    setStdout("");
    setStderr("");
    setCompileOutput("");
    setCompileStderr("");
    setError(null);
    setExecutionTime(null);
    setExitCode(null);
  };

  const clearOutput = () => {
    setStdout("");
    setStderr("");
    setCompileOutput("");
    setCompileStderr("");
    setError(null);
    setExecutionTime(null);
    setExitCode(null);
  };

  const copyOutput = async () => {
    const combined = [compileOutput, compileStderr, stdout, stderr, error]
      .filter(Boolean)
      .join("\n")
      .trim();

    if (!combined) return;

    try {
      await navigator.clipboard.writeText(combined);
    } catch {
      // Clipboard can fail silently in some browsers
    }
  };

  const handleRun = async () => {
    if (!code.trim()) return;

    setIsRunning(true);
    setStdout("");
    setStderr("");
    setCompileOutput("");
    setCompileStderr("");
    setError(null);
    setExecutionTime(null);
    setExitCode(null);

    const result = await executeCode(language, code, stdin);

    setStdout(result.stdout || "");
    setStderr(result.stderr || "");
    setCompileOutput(result.compileOutput || "");
    setCompileStderr(result.compileStderr || "");
    setError(result.error || null);
    setExecutionTime(result.executionTime ?? null);
    setExitCode(result.exitCode ?? null);
    setIsRunning(false);
  };

  const monacoLanguage = useMemo(
    () => MONACO_LANGUAGE_MAP[language] || "plaintext",
    [language]
  );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-semibold">Quick Run (Piston)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Run code instantly in the browser using the public Piston API.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={clearOutput}
            disabled={isRunning}
          >
            Clear Output
          </button>
          <button
            className="px-3 py-2 rounded border text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={copyOutput}
            disabled={isRunning}
          >
            Copy Output
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Language</label>
          <select
            className="w-full p-2 rounded border dark:bg-gray-800 dark:border-gray-700"
            value={language}
            onChange={handleLanguageChange}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Code</label>
          <div className="rounded border dark:border-gray-700 overflow-hidden">
            <MonacoEditor
              language={monacoLanguage}
              value={code}
              onChange={(newValue) => setCode(newValue || "")}
              onMount={(editor) => {
                editorRef.current = editor;
                editor.focus();
              }}
              height="260px"
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              options={{
                minimap: { enabled: false },
                fontFamily: "Source Code Pro",
                fontWeight: "bold",
                fontSize: 14,
                scrollBeyondLastLine: false,
              }}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Stdin (optional)</label>
          <textarea
            className="w-full min-h-[100px] p-3 font-mono text-sm rounded border dark:bg-gray-900 dark:border-gray-700"
            value={stdin}
            onChange={(event) => setStdin(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            className={`px-4 py-2 rounded text-white ${
              isRunning ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"
            }`}
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? "Running..." : "Run"}
          </button>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Supports {languages.join(", ")}
          </span>
        </div>
      </div>

      <OutputConsole
        stdout={stdout}
        stderr={stderr}
        error={error}
        compileOutput={compileOutput}
        compileStderr={compileStderr}
        executionTime={executionTime}
        exitCode={exitCode}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default PistonEditor;
