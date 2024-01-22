// import { useNavigate } from "react-router-dom";
// const navigate = useNavigate();
//   const navigateToLogin = () =>{
//       navigate("/login");
//   };<button className="Login-button" onClick={navigateToLogin}>Login</button>
import React, { useState } from "react";
import "./Homepage.css"; // Import your CSS file here
import SignUp from "../SignUp/SignUp.tsx"; // Importing SignUp.js
import Login from "../Login/Login.tsx"; //Importing Login.js

function Homepage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleSignUp = () => {
    setShowSignUp(!showSignUp);
    if (showLogin) setShowLogin(false); //Hide the login if not being used
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
    if (showSignUp) setShowSignUp(false); //hide sign up if not being used
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
        <div className="homepage-name">Garage Sale Finder</div>
      </div>

      {showSignUp ? (
        <SignUp onNavigateBack={() => setShowSignUp(false)} />
      ) : showLogin ? (
        <Login onNavigateBack={() => setShowLogin(false)} />
      ) : (
        <>
          {/* Need homepage content here */}
          <footer className="footer">
            Made with
            <span role="img" aria-label="Heart Emoji">
              ❤️
            </span>
            from Team Hex: <a href="https://github.com/Angel0002">Melis</a>
          </footer>
        </>
      )}
    </div>
  );
}

export default Homepage;