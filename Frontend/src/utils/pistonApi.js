/**
 * Piston API Utility
 *
 * This utility provides functions to execute code using the Piston API.
 * API Endpoint: https://emkc.org/api/v2/piston/execute
 */

// Language configurations used by the editor
export const LANGUAGE_CONFIGS = {
  bash: {
    name: 'bash',
    version: 'latest',
    fileName: 'main.sh',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  c: {
    name: 'c',
    version: 'latest',
    fileName: 'main.c',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  cpp: {
    name: 'cpp',
    version: 'latest',
    fileName: 'main.cpp',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  csharp: {
    name: 'csharp',
    version: 'latest',
    fileName: 'main.cs',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  go: {
    name: 'go',
    version: 'latest',
    fileName: 'main.go',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  java: {
    name: 'java',
    version: 'latest',
    fileName: 'Main.java',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  python: {
    name: 'python',
    version: 'latest',
    fileName: 'main.py',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  javascript: {
    name: 'javascript',
    version: 'latest',
    fileName: 'main.js',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  julia: {
    name: 'julia',
    version: 'latest',
    fileName: 'main.jl',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  kotlin: {
    name: 'kotlin',
    version: 'latest',
    fileName: 'Main.kt',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  perl: {
    name: 'perl',
    version: 'latest',
    fileName: 'main.pl',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  ruby: {
    name: 'ruby',
    version: 'latest',
    fileName: 'main.rb',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  rust: {
    name: 'rust',
    version: 'latest',
    fileName: 'main.rs',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  sql: {
    name: 'sql',
    version: 'latest',
    fileName: 'main.sql',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  typescript: {
    name: 'typescript',
    version: 'latest',
    fileName: 'main.ts',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
};

const LANGUAGE_ALIASES = {
  htmlcssjs: 'javascript',
};

const PISTON_BASE_URL = import.meta.env.VITE_PISTON_BASE_URL || 'https://emkc.org/api/v2/piston';

const PISTON_LANGUAGE_CONFIGS = {
  bash: { language: 'bash', version: 'latest' },
  c: { language: 'c', version: 'latest' },
  cpp: { language: 'cpp', version: 'latest' },
  csharp: { language: 'csharp', version: 'latest' },
  go: { language: 'go', version: 'latest' },
  java: { language: 'java', version: 'latest' },
  javascript: { language: 'javascript', version: 'latest' },
  julia: { language: 'julia', version: 'latest' },
  kotlin: { language: 'kotlin', version: 'latest' },
  perl: { language: 'perl', version: 'latest' },
  python: { language: 'python', version: 'latest' },
  ruby: { language: 'ruby', version: 'latest' },
  rust: { language: 'rust', version: 'latest' },
  sql: { language: 'sql', version: 'latest' },
  typescript: { language: 'typescript', version: 'latest' },
};

const resolvePistonConfig = (language) => {
  if (!language) return null;
  const normalized = (LANGUAGE_ALIASES[language.toLowerCase()] || language).toLowerCase();
  return PISTON_LANGUAGE_CONFIGS[normalized] || null;
};

/**
 * Execute code using the Piston API
 * 
 * @param {string} language - The programming language (python, javascript, java, c)
 * @param {string} code - The source code to execute
 * @param {string} stdin - Optional standard input to provide to the program
 * @returns {Promise<Object>} - Object containing stdout, stderr, and output information
 */
export const executeCode = async (language, code, stdin = '') => {
  const normalizedLanguage = (LANGUAGE_ALIASES[language?.toLowerCase()] || language || '').toLowerCase();
  const pistonConfig = resolvePistonConfig(normalizedLanguage);

  if (!pistonConfig) {
    return {
      success: false,
      error: `Language '${language}' is not supported by the Piston API. Supported languages: ${Object.keys(PISTON_LANGUAGE_CONFIGS).join(', ')}`,
      stdout: '',
      stderr: '',
      output: '',
      compile: null,
      runtime: null,
    };
  }

  const fileName = LANGUAGE_CONFIGS[normalizedLanguage]?.fileName || 'main.txt';
  const requestBody = {
    language: pistonConfig.language,
    version: pistonConfig.version,
    files: [{ name: fileName, content: code }],
  };

  if (stdin !== undefined && stdin !== null && stdin !== '') {
    requestBody.stdin = stdin;
    console.log('📥 stdin added to request:', JSON.stringify(stdin));
  } else {
    console.warn('⚠️ stdin is empty or not provided');
  }

  console.log('📝 Piston API Request Body:', JSON.stringify(requestBody, null, 2));

  try {
    const response = await fetch(`${PISTON_BASE_URL}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    console.log('📤 Piston API Response:', JSON.stringify(data, null, 2));

    const compileOutput = data?.compile?.stdout || '';
    const compileStderr = data?.compile?.stderr || '';
    const stdout = data?.run?.stdout || '';
    const stderr = data?.run?.stderr || '';
    const exitCode = typeof data?.run?.code === 'number' ? data.run.code : null;
    const hasCompileError = Boolean(compileStderr);
    const hasRuntimeError = Boolean(stderr) || (exitCode !== null && exitCode !== 0);
    const hasError = hasCompileError || hasRuntimeError;
    const errorOutput = compileStderr || stderr || (hasError ? stdout : '');

    return {
      success: !hasError,
      error: hasError ? errorOutput : null,
      stdout,
      stderr,
      output: stdout.trim(),
      compileOutput,
      compileStderr,
      compile: data?.compile || null,
      runtime: data?.run || null,
      exitCode,
      executionTime: null,
    };
  } catch (error) {
    console.error('Piston API Error:', error);
    return {
      success: false,
      error: `Failed to execute code: ${error.message}`,
      stdout: '',
      stderr: '',
      output: `Error: ${error.message}`,
      compileOutput: '',
      compileStderr: '',
      compile: null,
      runtime: null,
      exitCode: null,
    };
  }
};

/**
 * Get the list of supported languages
 * 
 * @returns {Array<string>} - Array of supported language names
 */
export const getSupportedLanguages = () => {
  return Object.keys(LANGUAGE_CONFIGS);
};

/**
 * Get language configuration
 * 
 * @param {string} language - The programming language
 * @returns {Object|null} - Language configuration or null if not supported
 */
export const getLanguageConfig = (language) => {
  return LANGUAGE_CONFIGS[language.toLowerCase()] || null;
};

export default executeCode;
