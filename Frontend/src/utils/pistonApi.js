/**
 * Piston API Utility
 * 
 * This utility provides functions to execute code using the Piston API.
 * Piston is a code execution engine that supports multiple programming languages.
 * 
 * API Endpoint: https://emkc.org/api/v2/piston/execute
 * 
 * Supported Languages:
 * - python
 * - javascript
 * - java
 * - c
 */

// Language configurations for Piston API
// Each language has a name and version that Piston supports
export const LANGUAGE_CONFIGS = {
  python: {
    name: 'python',
    version: '3.10.0',
    fileName: 'main.py',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  javascript: {
    name: 'javascript',
    version: '18.15.0',
    fileName: 'main.js',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  java: {
    name: 'java',
    version: '15.0.2',
    fileName: 'Main.java',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
  c: {
    name: 'c',
    version: '10.2.0',
    fileName: 'main.c',
    compileTimeout: 10000,
    runTimeout: 10000,
  },
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
  const langConfig = LANGUAGE_CONFIGS[language.toLowerCase()];
  
  if (!langConfig) {
    return {
      success: false,
      error: `Language '${language}' is not supported. Supported languages: ${Object.keys(LANGUAGE_CONFIGS).join(', ')}`,
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

  // Add stdin if provided
  if (stdin && stdin.trim()) {
    requestBody.stdin = stdin;
  }

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
