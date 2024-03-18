// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
//   const navigateToLogin = () =>{
//       navigate("/login");
//   };<button className="Login-button" onClick={navigateToLogin}>Login</button>
import React, { useState } from "react";
import "./Homepage.css"; // Import your CSS file here
import SignUp from "../SignUp/SignUp.tsx"; // Importing SignUp.js
import Login from "../Login/Login.tsx"; //Importing Login.js
//import restroomSign from "./restroomsign.jpg";
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../Translations/language-selector';


function Homepage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
    setShowLogin(false); //Hide the login if not being used
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    setShowSignUp(false); //hide sign up if not being used
  };

  const {t} = useTranslation();

  return (
    <div className="page">
      <div className="topnav">
        <a className="active" href="#home">
        {t("global.landing.home")}
        </a>
        <a href="#Login" onClick={toggleLogin}>
        {t("global.landing.login")}
        </a>
        <a href="#SignUp" onClick={toggleSignUp}>
        {t("global.landing.signup")}
        </a>
        <div className="homepage-name">{t("global.header.name")}</div>
      </div>

      {showSignUp && <SignUp onNavigateBack={() => setShowSignUp(false)} />}
      {showLogin && <Login onNavigateBack={() => setShowLogin(false)} />}
      {!showSignUp && !showLogin && (
        // Placeholder for homepage content
        <>
          <div className="Welcome-message">
            <h1>{t("global.landing.title")}</h1>
            <h1>{t("global.landing.description")}</h1>
            <img
              src="/assets/restroomsign.jpg"
              alt="Restroom Sign"
              className="restroom-image"
            />
          </div>
          <footer className="footer">Made with ❤️ by Team Hex</footer>
        </>
      )}
    </div>
  );
}

export default Homepage;