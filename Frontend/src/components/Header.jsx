import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBarsStaggered } from "react-icons/fa6";
import { IoArrowBack } from "react-icons/io5";
import { SiIfixit } from "react-icons/si";
import { RxMoon, RxSun } from "react-icons/rx";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import {
  LOCAL_STORAGE_USERNAME_KEY,
  LOCAL_STORAGE_LOGIN_KEY,
  LOCAL_STORAGE_THEME_KEY,
} from "../utils/constants";

const Header = ({ isDarkMode, toggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  // Initialize state from localStorage
  const [username, setUsername] = useState(() => {
    const storedUsername = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    const login = localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY);
    return storedUsername && login === "true" ? storedUsername : "";
  });
  
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedUsername = localStorage.getItem(LOCAL_STORAGE_USERNAME_KEY);
    const login = localStorage.getItem(LOCAL_STORAGE_LOGIN_KEY);
    return !!(storedUsername && login === "true");
  });
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const clearAuthState = () => {
    localStorage.removeItem(LOCAL_STORAGE_USERNAME_KEY);
    localStorage.removeItem(LOCAL_STORAGE_LOGIN_KEY);
  };

  /* Theme sync */
  useEffect(() => {
    const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, log me out!",
      cancelButtonText: "No, cancel!",
      confirmButtonColor: "#da4242",
      reverseButtons: true,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        clearAuthState();
        setIsLoggedIn(false);
        setUsername("");
      }
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/");
  };

  const formatUsername = (name) =>
    name.length > 15 ? `${name.slice(0, 5)}...${name.slice(-5)}` : name;

  return (
    <>
      <header className="bg-gray-800 text-white p-4 relative z-10">
        {location.pathname !== "/" && (
          <button
            type="button"
            onClick={handleBack}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-gray-700"
            aria-label="Go back"
            title="Back"
          >
            <IoArrowBack />
          </button>
        )}
        <div className="max-w-6xl mx-auto flex justify-end items-center relative">
          <Link
            to="/"
            className="text-2xl font-bold hover:text-gray-300 absolute left-1/2 -translate-x-1/2 flex items-center gap-2"
          >
            <img
              src="/Cutm_Logo.png"
              alt="CUTM SkillBridge"
              className="h-8 w-8 rounded-full"
            />
            <span>CUTM IDE</span>
          </Link>

          {/* Desktop */}
          {isLoggedIn && (
            <nav className="hidden md:flex space-x-6">
              <Link
                to={`/account/${username}`}
                className="hover:text-gray-300"
              >
                {formatUsername(username)}'s Account
              </Link>

              <button
                onClick={handleLogout}
                className="hover:text-gray-300"
              >
                Logout
              </button>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-700"
            >
              {isDarkMode ? <RxMoon /> : <RxSun />}
            </button>

            {isLoggedIn && (
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 rounded-full hover:bg-gray-700 md:hidden"
              >
                {!isDropdownOpen ? <FaBarsStaggered /> : <SiIfixit />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile */}
        {isDropdownOpen && isLoggedIn && (
          <nav className="md:hidden mt-4 bg-gray-800 p-4 rounded-md space-y-4">
            <Link
              to={`/account/${username}`}
              className="block text-center"
              onClick={() => setIsDropdownOpen(false)}
            >
              {formatUsername(username)}'s Account
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-center"
            >
              Logout
            </button>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
