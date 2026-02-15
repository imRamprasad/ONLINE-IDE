import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { RxMoon, RxSun } from "react-icons/rx";
import {
  LOCAL_STORAGE_THEME_KEY,
} from "../utils/constants";

const Header = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();

  /* Theme sync */
  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleBack = () => {
    if (location.key && location.key !== "default") {
      navigate(-1);
      return;
    }
    navigate("/", { replace: true });
  };

  return (
    <>
      <header className="ide-header text-slate-900 dark:text-slate-100 p-4 relative z-10">
        {location.pathname !== "/" && (
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/10 transition z-20"
            aria-label="Go back"
            title="Back"
          >
            <IoArrowBack />
          </button>
        )}
        <div className="max-w-6xl mx-auto flex justify-end items-center relative">
          <Link
            to="/"
            className="text-2xl font-bold ide-title hover:text-slate-500 dark:hover:text-slate-300 absolute left-1/2 -translate-x-1/2 flex items-center gap-2 transition"
          >
            <img
              src="/Cutm_Logo.png"
              alt="CUTM SkillBridge"
              className="h-8 w-8 rounded-full"
            />
            <span>CUTM IDE</span>
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200/70 dark:hover:bg-white/10 transition"
            >
              {isDarkMode ? <RxMoon /> : <RxSun />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
