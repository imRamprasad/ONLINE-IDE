/**
 * Piston API Utility
 * 
 * This utility provides functions to execute code using the Piston API.
 * Piston is a code execution engine that supports multiple programming languages.
 * 
 * API Endpoint: https://emkc.org/api/v2/piston/execute
 * 
 * Supported Languages:
 * - bash
 * - c
 * - cpp
 * - csharp
 * - dart
 * - go
 * - java
 * - javascript
 * - julia
 * - kotlin
 * - perl
 * - python
 * - ruby
 * - rust
 * - sql
 * - typescript
 * - verilog
 */

// Language configurations for Piston API
// Each language has a name and version that Piston supports
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

const PISTON_RUNTIME_URL = 'https://emkc.org/api/v2/piston/runtimes';
let runtimesPromise = null;

const fetchRuntimes = async () => {
  if (!runtimesPromise) {
    runtimesPromise = fetch(PISTON_RUNTIME_URL).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    });
  }

  return runtimesPromise;
};

const toVersionParts = (version) => {
  if (typeof version !== 'string') return [];
  return version.split(/[.-]/).map((part) => {
    const num = Number(part);
    return Number.isNaN(num) ? part : num;
  });
};

const compareVersions = (a, b) => {
  const partsA = toVersionParts(a);
  const partsB = toVersionParts(b);
  const maxLen = Math.max(partsA.length, partsB.length);

  for (let i = 0; i < maxLen; i += 1) {
    const partA = partsA[i];
    const partB = partsB[i];

    if (partA === undefined) return -1;
    if (partB === undefined) return 1;

    if (typeof partA === 'number' && typeof partB === 'number') {
      if (partA !== partB) return partA - partB;
    } else {
      const stringA = String(partA);
      const stringB = String(partB);
      if (stringA !== stringB) return stringA.localeCompare(stringB);
    }
  }

  return 0;
};

const pickLatestVersion = (runtimes, languageName) => {
  if (!Array.isArray(runtimes)) return null;

  const matches = runtimes.filter((runtime) => {
    if (!runtime) return false;
    if (runtime.language === languageName) return true;
    if (Array.isArray(runtime.aliases)) {
      return runtime.aliases.includes(languageName);
    }
    return false;
  });

  if (matches.length === 0) return null;

  matches.sort((a, b) => compareVersions(b.version, a.version));
  return matches[0].version || null;
};

const resolveLanguageConfig = async (language) => {
  if (!language) return null;

  const normalized = (LANGUAGE_ALIASES[language.toLowerCase()] || language).toLowerCase();
  const config = LANGUAGE_CONFIGS[normalized];
  if (!config) return null;

  let resolvedVersion = config.version;
  if (!resolvedVersion || resolvedVersion === 'latest') {
    try {
      const runtimes = await fetchRuntimes();
      resolvedVersion = pickLatestVersion(runtimes, config.name) || resolvedVersion;
    } catch {
      resolvedVersion = resolvedVersion === 'latest' ? null : resolvedVersion;
    }
  }

  if (!resolvedVersion || resolvedVersion === 'latest') return null;

  return {
    ...config,
    version: resolvedVersion,
  };
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
  // Get the language configuration
  const langConfig = await resolveLanguageConfig(language);
  
  if (!langConfig) {
    return {
      success: false,
      error: `Language '${language}' is not supported by the Piston API. Supported languages: ${Object.keys(LANGUAGE_CONFIGS).join(', ')}`,
      stdout: '',
      stderr: '',
      output: '',
      compile: null,
      runtime: null,
    };
  }

  // Piston API endpoint
  const PISTON_API_URL = 'https://emkc.org/api/v2/piston/execute';

  // Prepare the request body
  const requestBody = {
    language: langConfig.name,
    version: langConfig.version,
    files: [
      {
        name: langConfig.fileName,
        content: code,
      },
    ],
  };

  // Add stdin if provided (even if whitespace-only)
  if (stdin !== undefined && stdin !== null && stdin !== '') {
    requestBody.stdin = stdin;
    console.log("📥 stdin added to request:", JSON.stringify(stdin));
  } else {
    console.warn("⚠️ stdin is empty or not provided");
  }

  console.log("📝 Piston API Request Body:", JSON.stringify(requestBody, null, 2));

  try {
    // Make the API call
    const response = await fetch(PISTON_API_URL, {
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

    console.log("📤 Piston API Response:", JSON.stringify(data, null, 2));

    // Extract output information from the response
    const stdout = data.run?.stdout || '';
    const stderr = data.run?.stderr || '';
    const compileOutput = data.compile?.output || '';
    const compileStderr = data.compile?.stderr || '';
    const runtime = data.run?.code !== undefined ? data.run.code : null;

    // Determine if there was an error
    const hasError = stderr || compileStderr || runtime !== 0;
    const errorOutput = stderr || compileStderr || '';
    
    // Build the output string
    let output = '';
    if (compileOutput) {
      output += compileOutput;
    }
    if (stdout) {
      output += stdout;
    }
    if (errorOutput) {
      output += errorOutput;
    }

    return {
      success: !hasError,
      error: hasError ? errorOutput : null,
      stdout,
      stderr,
      output: output.trim(),
      compileOutput: compileOutput.trim(),
      compileStderr: compileStderr.trim(),
      compile: data.compile,
      runtime,
      exitCode: runtime,
      executionTime: data.run?.executionTime,
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
