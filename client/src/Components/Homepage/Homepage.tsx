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

  return (
    <div className="page">
      <div className="topnav">
        <a className="active" href="#home">
          Home
        </a>
        <a href="#Login" onClick={toggleLogin}>
          Log In
        </a>
        <a href="#SignUp" onClick={toggleSignUp}>
          Sign Up
        </a>
        <div className="homepage-name">Restroom Finder</div>
      </div>

      {showSignUp && <SignUp onNavigateBack={() => setShowSignUp(false)} />}
      {showLogin && <Login onNavigateBack={() => setShowLogin(false)} />}
      {!showSignUp && !showLogin && (
        // Placeholder for homepage content
        <>
          <div className="Welcome-message">
            <h1>Welcome to out Restroom Finding App!</h1>
            <h1>Find your next restroom here.</h1>
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
