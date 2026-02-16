import React, { useState } from "react";
import { executeCode } from "../utils/codeRunner";

const DebugInput = () => {
  const [language, setLanguage] = useState("python");
  const [code, setCode] = useState(`name = input()
print(f"Hello, {name}!")`);
  const [stdin, setStdin] = useState("Alice");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestBody, setRequestBody] = useState(null);

  const testCode = async () => {
    setLoading(true);
    setOutput("Testing...");

    console.log("🚀 Debug Test Started");
    console.log("  Language:", language);
    console.log("  Code length:", code.length);
    console.log("  Stdin value:", JSON.stringify(stdin));
    console.log("  Stdin length:", stdin.length);

    try {
      const result = await executeCode(language, code, stdin);

      console.log("✅ Test completed");
      console.log("  Result object:", result);

      // Display results nicely
      const resultText = `
=== REQUEST/RESPONSE DEBUG ===
Language: ${language}
Code Length: ${code.length}
Stdin: "${stdin}"
Stdin Length: ${stdin.length}

=== EXECUTION RESULT ===
Success: ${result.success}
Exit Code: ${result.exitCode}
Standard Output: ${result.stdout || "(empty)"}
Standard Error: ${result.stderr || "(empty)"}
Compile Output: ${result.compileOutput || "(empty)"}
Compile Error: ${result.compileStderr || "(empty)"}
Error (if any): ${result.error || "(none)"}
Raw Output: ${result.output || "(empty)"}

=== NOTES ===
1. Stdout should include your input if stdin is passed correctly.
2. If stdout is empty, verify the input format for the selected language.`;

      setOutput(resultText);
    } catch (err) {
      setOutput(`ERROR: ${err.message}\n\n${err.stack}`);
    }

    setLoading(false);
  };

  const examples = {
    python: `name = input()
print(f"Hello, {name}!")`,
    java: `import java.util.Scanner;
public class Main {
  public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    String name = sc.nextLine();
    System.out.println("Hello, " + name + "!");
  }
}`,
    javascript: `const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});
rl.on('line', (input) => {
  console.log(\`Hello, \${input}!\`);
});`,
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white font-mono">
      <h1 className="text-2xl font-bold mb-6">🐛 Debug Input System</h1>

      <div className="space-y-6 max-w-4xl">
        {/* Language selector */}
        <div>
          <label className="block text-sm font-bold mb-2">Select Language:</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              setCode(examples[e.target.value] || examples.python);
            }}
            className="bg-gray-800 border border-gray-700 p-2 rounded w-full text-white"
          >
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="javascript">JavaScript</option>
          </select>
        </div>

        {/* Code editor */}
        <div>
          <label className="block text-sm font-bold mb-2">Code:</label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-40 bg-gray-800 border border-gray-700 p-2 rounded font-mono text-sm"
          />
        </div>

        {/* Stdin input */}
        <div>
          <label className="block text-sm font-bold mb-2">Input (Stdin):</label>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="w-full h-20 bg-gray-800 border border-gray-700 p-2 rounded font-mono text-sm"
            placeholder="Type input here"
          />
          <p className="text-xs text-gray-400 mt-2">
            Length: {stdin.length} chars | Empty: {stdin === "" ? "YES" : "NO"}
          </p>
        </div>

        {/* Test button */}
        <button
          onClick={testCode}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-6 py-2 rounded font-bold w-full"
        >
          {loading ? "⏳ Testing..." : "🚀 Test Input"}
        </button>

        {/* Output */}
        <div>
          <label className="block text-sm font-bold mb-2">Result:</label>
          <pre className="w-full h-64 bg-gray-800 border border-gray-700 p-3 rounded text-xs overflow-auto text-gray-100 whitespace-pre-wrap">
            {output}
          </pre>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/30 border border-blue-500 p-4 rounded text-sm space-y-2">
          <p>
            <strong>📋 Instructions:</strong>
          </p>
          <ol className="ml-4 space-y-1">
            <li>1. Select a language above</li>
            <li>2. Type input you want to send (e.g., "Alice")</li>
            <li>3. Click "Test Input"</li>
            <li>4. Output should include the input value ("Alice").</li>
          </ol>
        </div>

        {/* Troubleshooting */}
        <div className="bg-red-900/30 border border-red-500 p-4 rounded text-sm space-y-2">
          <p>
            <strong>❌ Troubleshooting:</strong>
          </p>
          <ul className="ml-4 space-y-1">
            <li>• Empty stdout = input not read by the program.</li>
            <li>• Non-zero exit code = runtime error in the submitted code.</li>
            <li>• Compile output = compiler error for the selected language.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugInput;
