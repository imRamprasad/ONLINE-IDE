import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, ThemeContext } from "./context/ThemeProvider";
import MainBody from "./components/MainBody";
import { RECAPTCHA_SITE_KEY } from "./utils/constants";

const App = () => {
  const content = (
    <ThemeProvider>
      <Router>
        <ThemeContext.Consumer>
          {({ isDarkMode, toggleTheme }) => (
            <MainBody isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          )}
        </ThemeContext.Consumer>
      </Router>
    </ThemeProvider>
  );

  if (!RECAPTCHA_SITE_KEY) {
    return content;
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
      {content}
    </GoogleReCaptchaProvider>
  );
};

export default App;
