import React from 'react';
import { BiTerminal } from 'react-icons/bi';

/**
 * OutputConsole Component
 * 
 * This component displays the output from code execution.
 * It shows:
 * - stdout (standard output) in normal text
 * - stderr (standard error) in red/error color
 * - runtime/compilation errors clearly
 * - execution time if available
 */

const OutputConsole = ({ 
  output = '', 
  stdout = '', 
  stderr = '', 
  error = null,
  compileOutput = '',
  compileStderr = '',
  exitCode = null,
  executionTime = null,
  isDarkMode = true 
}) => {
  // Determine if there's actual output to display
  const hasOutput = output || stdout || stderr || error || compileOutput || compileStderr;
  
  // Default message when no output
  const defaultMessage = 'Run your code to see output here...';

  // Get current timestamp for display
  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  return (
    <div className="mt-4">
      {/* Header */}
      <div className={`rounded-t-lg p-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-300'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BiTerminal className="ml-2 text-2xl" />
            <h2 className="text-xl font-semibold">Output</h2>
          </div>
          <div className="flex items-center space-x-3 mr-2">
            {exitCode !== null && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Exit: {exitCode}
              </span>
            )}
            {executionTime !== null && (
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                ⏱️ {executionTime}ms
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Output Content */}
      <div
        className={`min-h-[150px] max-h-[300px] overflow-auto p-3 rounded-b-lg font-mono text-sm ${
          isDarkMode 
            ? 'bg-[#1e1e1e] text-[#d4d4d4]' 
            : 'bg-[#f5f5f5] text-[#333333]'
        }`}
        style={{ scrollbarWidth: 'thin' }}
      >
        {!hasOutput ? (
          <span className={isDarkMode ? 'text-gray-500' : 'text-gray-400'}>
            {defaultMessage}
          </span>
        ) : (
          <>
            {/* Compile Output */}
            {compileOutput && (
              <pre className="whitespace-pre-wrap break-words mb-2 text-[#9cdcfe]">
                {compileOutput}
              </pre>
            )}

            {/* Compile Errors */}
            {compileStderr && (
              <pre className="whitespace-pre-wrap break-words mb-2 text-red-500 font-semibold">
                {compileStderr}
              </pre>
            )}

            {/* Stdout - Normal Output */}
            {stdout && (
              <pre className="whitespace-pre-wrap break-words mb-2 text-[#d4d4d4] dark:text-[#d4d4d4]">
                {stdout}
              </pre>
            )}

            {/* Stderr - Error Output */}
            {stderr && (
              <pre className="whitespace-pre-wrap break-words mb-2 text-red-500 font-semibold">
                {stderr}
              </pre>
            )}

            {/* General Output */}
            {output && !stdout && !stderr && (
              <pre className="whitespace-pre-wrap break-words mb-2">
                {output}
              </pre>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-2 p-2 bg-red-900/30 border border-red-500 rounded">
                <p className="text-red-500 font-semibold">Error:</p>
                <pre className="whitespace-pre-wrap break-words text-red-400">
                  {error}
                </pre>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer with timestamp */}
      {hasOutput && (
        <div className={`text-xs mt-1 px-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          {getTimestamp()}
        </div>
      )}
    </div>
  );
};

export default OutputConsole;
