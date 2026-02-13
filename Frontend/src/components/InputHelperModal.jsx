import React, { useState } from "react";
import INPUT_EXAMPLES from "../utils/inputExamples";

const InputHelperModal = ({ language, isOpen, onClose }) => {
  const example = INPUT_EXAMPLES[language] || INPUT_EXAMPLES.python;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="sticky top-0 bg-gray-900 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white">{example.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold w-8 h-8 flex items-center justify-center"
          >
            ×
          </button>
        </div>

        <div className="px-6 py-4 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">📝 Example Code:</h3>
            <pre className="bg-[#1e1e1e] p-3 rounded border border-gray-700 text-xs text-gray-100 overflow-x-auto">
              {example.code}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-2">🧪 Test Result:</h3>
            <pre className="bg-[#1e1e1e] p-3 rounded border border-gray-700 text-xs text-[#d4d4d4]">
              {example.preview}
            </pre>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded p-3">
            <p className="text-xs text-blue-200">
              💡 <strong>How to use:</strong> Copy the example code above into your editor.
              Type input in the textarea below and click Run. The code will read from stdin
              and produce output.
            </p>
          </div>

          <button
            onClick={() => {
              navigator.clipboard.writeText(example.code);
              alert("Code copied to clipboard!");
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold"
          >
            📋 Copy Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default InputHelperModal;
