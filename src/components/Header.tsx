import { useEffect, useState } from "react";
import { HelpIcon, ThemeChangeIcon } from "../Icons";
import "./Header.css";
import Popup from "./Popup";
import { contactEmail, instructions } from "../Constants";

export default function Header() {
  const [showHelpPopUp, setShowHelpPopUp] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  function setDarkTheme() {
    document.documentElement.style.setProperty("--background", "#242424");
    document.documentElement.style.setProperty("--high-contrast", "#fff");
    document.documentElement.style.setProperty("--default-text-color", "rgba(255, 255, 255, 0.87)");
    document.documentElement.style.setProperty("color-scheme", "dark");
    localStorage.setItem("theme", "dark");
  }

  function setLightTheme() {
    document.documentElement.style.setProperty("--background", "#f3f3f3");
    document.documentElement.style.setProperty("--high-contrast", "#000");
    document.documentElement.style.setProperty("--default-text-color", "rgba(0, 0, 0, 0.95)");
    document.documentElement.style.setProperty("color-scheme", "light");
    localStorage.setItem("theme", "light");
  }

  useEffect(() => {
    const themeStr = localStorage.getItem("theme");
    if (themeStr) {
      if (themeStr == "dark") {
        setDarkTheme();
        setIsDarkTheme(true);
      } else {
        setLightTheme();
        setIsDarkTheme(false);
      }
    } else {
      const prefersDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkTheme(prefersDarkMode);
    }

    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setIsDarkTheme(e.matches);
    };

    darkModeMediaQuery.addEventListener("change", handleDarkModeChange);

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleDarkModeChange);
    };
  }, []);

  function handleHelpButtonClicked() {
    setShowHelpPopUp(true);
  }

  function handleChangeTheme() {
    if (isDarkTheme) {
      setLightTheme();
    } else {
      setDarkTheme();
    }

    setIsDarkTheme(lt => !lt);

  }

  return <header>
    <div onClick={handleChangeTheme} className='header-btn'>
      <ThemeChangeIcon />
    </div>
    <span id="page-title"><b>Q</b>uadradado</span>
    <div onClick={handleHelpButtonClicked} className='header-btn'>
      <HelpIcon />
    </div>

    {
      showHelpPopUp && <Popup onPopUpClose={() => setShowHelpPopUp(false)} popupTitle="Ajuda">
        <h2>
          Instruções:
        </h2>
        <span>
          Forme palavras arrastando de uma letra até outra. A palavra deve conter 4 letras ou mais. Palavras bônus são palavras mais obscuras e pouco utilizadas
        </span>
        <h2>
          Regras:
        </h2>
        <ul>
          {instructions.map((el, index) => <li key={index}>{el}</li>)}
        </ul>
        <h3>
          Mais informações:
        </h3>
        <ul>
          <li>Este jogo foi baseado em <a href="https://squaredle.app/" target="_blank" rel="noreferrer">Squaredle</a></li>
          <li>E-mail para contato: <br /><a href={`mailto:${contactEmail}`}>{contactEmail}</a></li>
        </ul>
      </Popup>
    }
  </header>;
}
