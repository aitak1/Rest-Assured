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
 <div className="topbar">
          <div className="content">
            <div className="image-container">
              <img
                src="https://media.istockphoto.com/id/482430364/photo/blue-wooden-wall-with-the-inscription-garage-sale.jpg?s=1024x1024&w=is&k=20&c=59RBAF6v6sbtJDIWLRWRbTIMlDoCUv3sCJNSIWAQbv8="
                //src="/assets/button.png"
                className="logo"
                alt="logo"
                />
            </div>
            <div className="name">Garage Sale Finder</div>
            <a href="#Home">Home</a>
            <a href="#Login" onClick={toggleLogin}>Log In</a>
            <a href="#SignUp" onClick={toggleSignUp}>Sign Up</a>
            
          </div>
          
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
            from Team Hex: <a href="https://github.com/fabo22" target="blank">Fabrizio Lopez, </a>
            <a href="https://github.com/Mothraa380" target="blank">Measam Ali, </a>
            <a href="" target="blank">Daniel Hughes, </a>
            <a href="https://github.com/NoahDaniels1" target="blank">Noah Daniels, </a>
            <a href="https://github.com/aitak1" target="blank">Katia Maldonado</a>
          </footer>
        </>
      )}
    </div>
  );
}

export default Homepage;