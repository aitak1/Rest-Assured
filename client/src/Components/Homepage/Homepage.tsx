import React, { useState } from "react";
import "./Homepage.css"; // Import your CSS file here
import SignUp from "../SignUp/SignUp.tsx"; // Importing SignUp.js
import Login from "../Login/Login.tsx"; // Importing Login.js

function Homepage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
    if (showLogin) setShowLogin(false); // Hide the login if not being used
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    if (showSignUp) setShowSignUp(false); // Hide sign up if not being used
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
        <div className="homepage-name">Restroom</div> {/* Centered text */}
      </div>

      <div className="content-container">
        <div className="welcome-box">
          <p>
            Welcome to the one-stop to find the nearest restroom for those with disabilities.
            We recommend making an account and logging in to save your previous search results.
          </p>
        </div>
      </div>

      {showSignUp ? (
        <SignUp onNavigateBack={() => setShowSignUp(false)} />
      ) : showLogin ? (
        <Login onNavigateBack={() => setShowLogin(false)} />
      ) : null /* Ensure neither signup nor login components are rendered when not active */}
    </div>
  );
}

export default Homepage;
