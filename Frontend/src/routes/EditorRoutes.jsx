import React from "react";
import { Routes, Route } from "react-router-dom";
import { IoLogoPython } from "react-icons/io5";
import {
  SiJavascript,
  SiRust,
  SiRuby,
  SiPerl,
  SiJulia,
  SiGnubash,
} from "react-icons/si";
import { FaGolang } from "react-icons/fa6";
import { RiJavaFill } from "react-icons/ri";
import {
  PiFileCppFill,
  PiFileCSharpFill,
  PiFileCFill,
  PiFileSqlFill,
} from "react-icons/pi";
import { TbBrandKotlin } from "react-icons/tb";
import { BiLogoTypescript } from "react-icons/bi";
import NotFound from "../pages/NotFound";
import NavigationLinks from "../components/NavigationLinks";
import CodeEditor from "../components/CodeEditor";
import ShareEditor from "../components/ShareEditor";
import DebugInput from "../components/DebugInput";
import Editor from "../components/Editor";
import samplePy from "../samples/python.py?raw";
import sampleJs from "../samples/javascript.js?raw";
import sampleC from "../samples/c.c?raw";
import sampleCpp from "../samples/cpp.cpp?raw";
import sampleJava from "../samples/java.java?raw";
import sampleCsharp from "../samples/csharp.cs?raw";
import sampleRust from "../samples/rust.rs?raw";
import sampleGo from "../samples/go.go?raw";
import sampleSQL from "../samples/sql.sql?raw";
import sampleRuby from "../samples/ruby.rb?raw";
import sampleTypeScript from "../samples/typescript.ts?raw";
import sampleKotlin from "../samples/kotlin.kt?raw";
import samplePerl from "../samples/perl.pl?raw";
import sampleJulia from "../samples/julia.jl?raw";
import sampleBash from "../samples/bash.sh?raw";
import sampleHtml from "../samples/index.html?raw";
import sampleCss from "../samples/style.css?raw";
import sampleScript from "../samples/script.js?raw";

const languages = [
  {
    path: "/bash",
    language: "bash",
    icon: SiGnubash,
    sampleCode: sampleBash,
  },
  {
    path: "/python",
    language: "python",
    icon: IoLogoPython,
    sampleCode: samplePy,
  },
  {
    path: "/javascript",
    language: "javascript",
    icon: SiJavascript,
    sampleCode: sampleJs,
  },
  {
    path: "/c",
    language: "c",
    icon: PiFileCFill,
    sampleCode: sampleC,
  },
  {
    path: "/cpp",
    language: "cpp",
    icon: PiFileCppFill,
    sampleCode: sampleCpp,
  },
  {
    path: "/java",
    language: "java",
    icon: RiJavaFill,
    sampleCode: sampleJava,
  },
  {
    path: "/csharp",
    language: "csharp",
    icon: PiFileCSharpFill,
    sampleCode: sampleCsharp,
  },
  {
    path: "/rust",
    language: "rust",
    icon: SiRust,
    sampleCode: sampleRust,
  },
  {
    path: "/go",
    language: "go",
    icon: FaGolang,
    sampleCode: sampleGo,
  },
  {
    path: "/sql",
    language: "sql",
    icon: PiFileSqlFill,
    sampleCode: sampleSQL,
  },
  {
    path: "/ruby",
    language: "ruby",
    icon: SiRuby,
    sampleCode: sampleRuby,
  },
  {
    path: "/typescript",
    language: "typescript",
    icon: BiLogoTypescript,
    sampleCode: sampleTypeScript,
  },
  {
    path: "/kotlin",
    language: "kotlin",
    icon: TbBrandKotlin,
    sampleCode: sampleKotlin,
  },
  {
    path: "/perl",
    language: "perl",
    icon: SiPerl,
    sampleCode: samplePerl,
  },
  {
    path: "/julia",
    language: "julia",
    icon: SiJulia,
    sampleCode: sampleJulia,
  },
];

const EditorRoutes = ({ isDarkMode }) => (
  <div className="flex-grow">
    <Routes>
      <Route path="/" element={<NavigationLinks isDarkMode={isDarkMode} />} />

      <Route
        path="/frontend"
        element={
          <Editor
            isDarkMode={isDarkMode}
            title="frontend"
            storageNamespace="frontend"
            value={{
              html: sampleHtml,
              css: sampleCss,
              javascript: sampleScript,
            }}
          />
        }
      />

      <Route
        path="/:shareId"
        element={<ShareEditor isDarkMode={isDarkMode} />}
      />

      {languages.map(({ path, language, icon, sampleCode }) => (
        <Route
          key={language}
          path={path}
          element={
            <CodeEditor
              language={language}
              reactIcon={icon}
              isDarkMode={isDarkMode}
              defaultCode={sampleCode}
            />
          }
        />
      ))}

      <Route path="/debug/input" element={<DebugInput />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  </div>
);

export default EditorRoutes;
