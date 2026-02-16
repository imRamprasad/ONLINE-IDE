/**
 * Code Runner Utility
 *
 * Routes execution requests to the configured provider (Judge0 or Piston).
 */

import { executeCode as executePistonCode, LANGUAGE_CONFIGS } from "./pistonApi";
import {
  executeCode as executeJudge0Code,
  isJudge0LanguageSupported,
} from "./judge0Api";

const RUNNER_PROVIDER =
  (import.meta.env.VITE_CODE_RUNNER_PROVIDER || "judge0").toLowerCase();
const RUNNER_FALLBACK =
  (import.meta.env.VITE_CODE_RUNNER_FALLBACK || "piston").toLowerCase();

const unsupportedLanguageResult = (language, provider) => ({
  success: false,
  error: `Language '${language}' is not supported by the ${provider} API.`,
  stdout: "",
  stderr: "",
  output: "",
  compileOutput: "",
  compileStderr: "",
  compile: null,
  runtime: null,
  exitCode: null,
  executionTime: null,
});

export const executeCode = async (language, code, stdin = "") => {
  if (RUNNER_PROVIDER === "piston") {
    return executePistonCode(language, code, stdin);
  }

  if (RUNNER_PROVIDER === "judge0") {
    if (!isJudge0LanguageSupported(language)) {
      if (RUNNER_FALLBACK === "piston") {
        return executePistonCode(language, code, stdin);
      }

      return unsupportedLanguageResult(language, "Judge0");
    }

    return executeJudge0Code(language, code, stdin);
  }

  return executePistonCode(language, code, stdin);
};

export { LANGUAGE_CONFIGS };

export default executeCode;
