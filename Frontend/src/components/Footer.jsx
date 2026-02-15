import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="ide-footer text-center p-4 text-slate-700 dark:text-slate-300">
      <p className="text-sm md:text-base lg:text-lg flex items-center justify-center ide-title">
        <span>&copy; {currentYear} CUTM IDE</span>
      </p>
    </footer>
  );
};

export default Footer;