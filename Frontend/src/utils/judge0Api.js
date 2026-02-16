/**
 * Judge0 CE API Utility
 *
 * This utility provides functions to execute code using the Judge0 CE API.
 * API Endpoint: https://ce.judge0.com/submissions?base64_encoded=false&wait=true
 */

const JUDGE0_BASE_URL =
  import.meta.env.VITE_JUDGE0_BASE_URL || "https://ce.judge0.com";
const JUDGE0_SUBMISSIONS_URL = `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=true`;

const LANGUAGE_ALIASES = {
  htmlcssjs: "javascript",
};

const DEFAULT_LANGUAGE_IDS = {
  bash: 46,
  c: 50,
  cpp: 54,
  csharp: 51,
  go: 60,
  java: 62,
  javascript: 63,
  julia: 93,
  kotlin: 78,
  perl: 85,
  python: 71,
  ruby: 72,
  rust: 73,
  sql: 82,
  typescript: 74,
};

const parseLanguageOverrides = () => {
  const raw = import.meta.env.VITE_JUDGE0_LANGUAGE_MAP;
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};
    return parsed;
  } catch (error) {
    console.warn(
      "Invalid VITE_JUDGE0_LANGUAGE_MAP JSON. Falling back to defaults.",
      error
    );
    return {};
  }
};

const JUDGE0_LANGUAGE_IDS = {
  ...DEFAULT_LANGUAGE_IDS,
  ...parseLanguageOverrides(),
};

const normalizeLanguage = (language) => {
  if (!language) return "";
  const lowered = language.toLowerCase();
  return LANGUAGE_ALIASES[lowered] || lowered;
};

export const isJudge0LanguageSupported = (language) => {
  const normalized = normalizeLanguage(language);
  return Boolean(JUDGE0_LANGUAGE_IDS[normalized]);
};

const resolveLanguageId = (language) => {
  const normalized = normalizeLanguage(language);
  return JUDGE0_LANGUAGE_IDS[normalized] || null;
};

/**
 * Execute code using the Judge0 CE API
 *
 * @param {string} language - The programming language (python, javascript, java, c)
 * @param {string} code - The source code to execute
 * @param {string} stdin - Optional standard input to provide to the program
 * @returns {Promise<Object>} - Object containing stdout, stderr, and output information
 */
export const executeCode = async (language, code, stdin = "") => {
  const languageId = resolveLanguageId(language);

  if (!languageId) {
    return {
      success: false,
      error: `Language '${language}' is not supported by the Judge0 API. Supported languages: ${Object.keys(
        JUDGE0_LANGUAGE_IDS
      ).join(", ")}`,
      stdout: "",
      stderr: "",
      output: "",
      compileOutput: "",
      compileStderr: "",
      compile: null,
      runtime: null,
      exitCode: null,
      executionTime: null,
    };
  }

  const requestBody = {
    language_id: languageId,
    source_code: code,
  };

  if (stdin !== undefined && stdin !== null && stdin !== "") {
    requestBody.stdin = stdin;
  }

  try {
    const response = await fetch(JUDGE0_SUBMISSIONS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const stdout = data?.stdout || "";
    const stderr = data?.stderr || "";
    const compileOutput = data?.compile_output || "";
    const exitCode =
      typeof data?.exit_code === "number" ? data.exit_code : null;
    const statusId = data?.status?.id;
    const statusDescription = data?.status?.description || "";
    const hasCompileError = Boolean(compileOutput);
    const hasRuntimeError = Boolean(stderr) || (statusId && statusId !== 3);
    const hasError = hasCompileError || hasRuntimeError;
    const errorOutput =
      compileOutput || stderr || data?.message || (hasError ? stdout : "");

    return {
      success: !hasError,
      error: hasError ? errorOutput || statusDescription : null,
      stdout,
      stderr,
      output: stdout.trim(),
      compileOutput,
      compileStderr: compileOutput,
      compile: compileOutput ? { stdout: "", stderr: compileOutput } : null,
      runtime: {
        time: data?.time || null,
        memory: data?.memory || null,
        status: statusDescription,
      },
      exitCode,
      executionTime:
        typeof data?.time === "string" ? Number(data.time) : data?.time || null,
    };
  } catch (error) {
    console.error("Judge0 API Error:", error);
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
      stdout: "",
      stderr: "",
      output: `Error: ${error.message}`,
      compileOutput: "",
      compileStderr: "",
      compile: null,
      runtime: null,
      exitCode: null,
      executionTime: null,
    };
  }
};

export default executeCode;
