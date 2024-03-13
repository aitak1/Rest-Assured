import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from 'react-router-dom';
import "./settings.css"; 

function UserProfile(){
    const [dropdownOpen, setdropdownOpen] = useState(false);
    const handleProfileDropdown = () => {
      setdropdownOpen(!dropdownOpen); // Toggle the dropdown
    };
  
    return (
      <div className="profile">
              <button type="button"  onClick={handleProfileDropdown}>
                Name
              <img
                  //src="https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000"
                  src="https://i.pinimg.com/736x/b9/49/0a/b9490abd30c15850908b8ee0570f8b19.jpg"
                  className="pfp"
                  alt="profile_picture"
                />
              
            </button>
            <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
              <a href="https://www.google.com/">Profile</a>
              <Link to="/settings">Settings</Link>
              <Link to="/">Sign Out</Link>
            </div>
            <div>
  
            </div>
          </div>
    );
  }

function Settings(){
  
    return(
    <div className="dashboard">
      <div className="topbar">
          {/* {UserProfile()} */}
          <div className="content">
            <div className="image-container">
              <img
                //src="https://media.istockphoto.com/id/482430364/photo/blue-wooden-wall-with-the-inscription-garage-sale.jpg?s=1024x1024&w=is&k=20&c=59RBAF6v6sbtJDIWLRWRbTIMlDoCUv3sCJNSIWAQbv8="
                src="/assets/tempLogo.PNG"
                className="logo"
                alt="logo"
              />
            </div>
            <div className="name">Restroom Finder</div>
            
          </div>
          {UserProfile()}
      </div>
      {/* before */}
      <div className="lower-content">
        {/* {ResultSales()} */}
      </div>
    </div>
  );
}

export default Settings;