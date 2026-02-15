import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import EditorRoutes from "../routes/EditorRoutes";

const MainBody = ({ isDarkMode, toggleTheme }) => {
  return (
    <div className="min-h-screen flex flex-col ide-shell text-slate-900 dark:text-slate-100 dark:[color-scheme:dark]">
      <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      <EditorRoutes isDarkMode={isDarkMode} />
      <Footer />
    </div>
  );
};

export default MainBody;
