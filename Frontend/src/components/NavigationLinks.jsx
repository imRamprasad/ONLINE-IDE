import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import SharedLinks from "./SharedLinks";

const navLinks = [
  {
    to: "/frontend",
    text: "HTML/CSS/JS",
    classes: "motion-delay-[350ms]",
  },
  {
    to: "/bash",
    text: "Bash",
    classes: "motion-delay-[400ms]",
  },
  {
    to: "/python",
    text: "Python",
    classes: "motion-delay-[450ms]",
  },
  {
    to: "/javascript",
    text: "Javascript",
    classes: "motion-delay-[500ms]",
  },
  {
    to: "/c",
    text: "C",
    classes: "motion-delay-[550ms]",
  },
  {
    to: "/cpp",
    text: "C++",
    classes: "motion-delay-[600ms]",
  },
  {
    to: "/java",
    text: "Java",
    classes: "motion-delay-[650ms]",
  },
  {
    to: "/csharp",
    text: "C#",
    classes: "motion-delay-[700ms]",
  },
  {
    to: "/rust",
    text: "Rust",
    classes: "motion-delay-[750ms]",
  },
  {
    to: "/go",
    text: "Go",
    classes: "motion-delay-[800ms]",
  },
  {
    to: "/sql",
    text: "SQL",
    classes: "motion-delay-[900ms]",
  },
  {
    to: "/ruby",
    text: "Ruby",
    classes: "motion-delay-[1050ms]",
  },
  {
    to: "/typescript",
    text: "Typescript",
    classes: "motion-delay-[1100ms]",
  },
  {
    to: "/kotlin",
    text: "Kotlin",
    classes: "motion-delay-[1200ms]",
  },
  {
    to: "/perl",
    text: "Perl",
    classes: "motion-delay-[1250ms]",
  },
  {
    to: "/julia",
    text: "Julia",
    classes: "motion-delay-[1350ms]",
  },
];

const NavigationLinks = ({ isDarkMode = true }) => {
  const baseUrl = window.location.origin;

  useEffect(() => {
    document.title = "CUTM IDE - Online Code Editor and Compiler";
  }, []);

  return (
    <>
      <div className="flex justify-center items-center min-h-[65vh] px-4 pt-8 pb-4">
        <div className="grid w-full max-w-6xl grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
          {navLinks.map(({ to, text, classes }) => (
            <Link
              key={to}
              to={`${baseUrl}${to}`}
              aria-label={`Navigate to ${text} Editor`}
              title={text}
              className={`ide-card ide-card-link motion-preset-rebound-down ${classes} whitespace-nowrap overflow-hidden text-ellipsis`}
            >
              {text}
            </Link>
          ))}
        </div>
      </div>
      <SharedLinks />
    </>
  );
};

export default NavigationLinks;
