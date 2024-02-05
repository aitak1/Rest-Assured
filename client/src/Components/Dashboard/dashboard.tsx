import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Link } from 'react-router-dom';
import "./dashboard.css"; 

function SearchLocation() {
  const mapStyles = [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [
        { visibility: 'off' } // Hide points of interest labels
      ]
    }];
    const [location, setLocation] = useState("");
    const [userPosition, setUserPosition] = useState({ lat: 33.253946, lng: -97.152896 });
    const [validAddress, setAddressValidity] = useState(false);

    const handleSearch = async () => {
      try {
        // Perform geocoding to convert address to coordinates using a geocoding service
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU`
        );
    
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results[0] && data.results[0].geometry) {
            const { lat, lng } = data.results[0].geometry.location;
            setUserPosition({ lat, lng });
            console.log("Its working!");
            setAddressValidity(true);
          } else {
            console.log(data);
            alert("Invalid location");
            setAddressValidity(false);
          }
        } else {
          console.error("Geocoding request failed");
          setAddressValidity(false);
        }
      } catch (error) {
        console.error("Error during geocoding:", error);
        setAddressValidity(false);
      }
    };

    const handleEnterKey = (e) => {
      if (e.key === 'Enter') {
        handleSearch(); // Trigger search function on Enter key press
      }
    };

    const handleCurrentLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setUserPosition({
                lat: position.coords.latitude,
                lng: position.coords.longitude
              });
              setAddressValidity(true);
            },
            (error) => {
              console.error('Error getting user location:', error);
              setAddressValidity(false);
            }
          );
        }  else {
          console.error('Geolocation is not supported by this browser.');
        }
      } catch (error) {
        console.error('Error getting user location:', error);
        setAddressValidity(false);
      }
    };

    useEffect(() => {

      if (userPosition && userPosition.lat && userPosition.lng && validAddress) {
        console.log('userPosition updated:', userPosition);
      }
    }, [userPosition, validAddress]);

  return (
    <div className="lower-content">
      <div className="search-map">
        <div className="input-container">
          <input
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={ handleEnterKey}
          />
          <button type="button" className="searchButton" onClick={handleSearch}>
            Search
          </button>
          <img className="currentLocationButton" 
                onClick={handleCurrentLocation}
                src="/assets/currentLocationButton.png"
                alt="current_location"
              />

        </div>
        <div className="map">
            <GoogleMap
              mapContainerClassName="map"
              center={userPosition || { lat:  33.253946, lng: -97.152896 }}
              zoom={userPosition ? 17 : 1}
              options={{styles: mapStyles}}
            >
              
                {/* Conditionally render the Marker based on userPosition and validAddress */}
            {userPosition && validAddress && (
              <Marker
                onLoad={(marker) => console.log('marker:', marker)}
                position={userPosition}
                title="Your Location"
              />
            )}
              
            </GoogleMap>
        </div>
      </div>
    </div>
  );
}


function SavedSales() {
  return (
    <div className="saved">
    <div className="sidebar">
        <div className="name">
          Saved Sales
        </div>
        <ol>
          <li>First</li>
          <li>Second</li>
          <li>Third</li>
        </ol>
    </div>
    </div>
  );
}

function ResultSales() {
  return (
    <div className="result">
    <div className="sidebar">
        <div className="name">
          Results
        </div>
        <ol>
          <li>First</li>
          <li>Second</li>
          <li>Third</li>
        </ol>
    </div>
    </div>
  );
}

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
                src="https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000"
                className="pfp"
                alt="profile_picture"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <a href="https://www.google.com/">Profile</a>
            <a href="https://www.google.com/">Settings</a>
            <Link to="/">Sign Out</Link>
          </div>
          <div>

          </div>
        </div>
  );
}

/*function UserSettings(){
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const handleSettingsDropdown = () => {
    setdropdownOpen(!dropdownOpen); // Toggle the dropdown
  };

  return (
    <div className="settings">
            <button type="button" onClick={handleSettingsDropdown}>
            <img
                src="../assets/settings-3110.png"
                className="settings-logo"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <div className="check"><input type="checkbox"></input></div>
            <div className="check-label"><label>Notifications</label></div>
          </div>
          <div>

          </div>
        </div>
  );
}*/

function UserNotifications(){
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const handleNotificationsDropdown = () => {
    setdropdownOpen(!dropdownOpen); // Toggle the dropdown
  };

  return (
    <div className="notifications">
            <button type="button" onClick={handleNotificationsDropdown}>
            <img
                src="../assets/bell-icon.png"
                className="notifications-logo"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <div>
            <a href="https://www.google.com/">Garage Sale</a>
            </div>
          </div>
          <div>

          </div>
        </div>
  );
}

async function notifyUser(notificationText = "Thank you for enabling notifications!") { //logic for notifying a user
  if(!("Notification" in window)) {
    alert("Browser does not support notifications")
  } else if (Notification.permission === "granted") {
    const notification = new Notification(notificationText);
  } else if (Notification.permission !== "denied") {
    await Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        const notification = new Notification(notificationText);
      }
    });
  }
}

function Dashboard(){
  
  //states
  const [userResponded, setUserResponded] = useState(false);
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const handleSettingsDropdown = () => {
    setdropdownOpen(!dropdownOpen); // Toggle the dropdown
  };

  async function enableNotifsAndClose() {
    await notifyUser().then(() => {
      setUserResponded(true);
    });
  }

  function disableNotifsAndClose() {
    
    setUserResponded(true);
  }

    return(!(userResponded) && !(Notification.permission === "granted")) ? (
    <div className="dashboard">
      <div className="topbar">
          {UserProfile()}
          <div className="settings">
            <button type="button" onClick={handleSettingsDropdown}>
            <img
                src="../assets/settings-3110.png"
                className="settings-logo"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <div onClick={enableNotifsAndClose} className="check"><input type="checkbox"></input></div> 
            <div className="check-label"><label>Notifications</label></div>
          </div>
          <div>

          </div>
        </div>
          {UserNotifications()}
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
            
          </div>
          
      </div>
      {/* before */}
      <div className="lower-content">
        {SavedSales()}
        <LoadScript
          googleMapsApiKey="AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU"
        >
          <SearchLocation />
        </LoadScript>
        {ResultSales()}
      </div>

      {/* after */}
      {/* <div className="lower-content">
        
        <LoadScript
          googleMapsApiKey="AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU"
        >
          <SearchLocation />
          {resultSales()}
        </LoadScript>
      </div> */}
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
    </div>
  ) : (Notification.permission === "granted") ? (
    <div className="dashboard">
    <div className="topbar">
        {UserProfile()}
        <div className="settings">
            <button type="button" onClick={handleSettingsDropdown}>
            <img
                src="../assets/settings-3110.png"
                className="settings-logo"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <div className="check"><input type="checkbox"></input></div>
            <div className="check-label"><label>Notifications</label></div>
          </div>
          <div>

          </div>
        </div>
        {UserNotifications()}
        <button className="testbutton" onClick={disableNotifsAndClose}>Disable Notifs</button>
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
          
        </div>
        
    </div>
    {/* before */}
    <div className="lower-content">
      {SavedSales()}
      <LoadScript
        googleMapsApiKey="AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU"
      >
        <SearchLocation />
      </LoadScript>
      {ResultSales()}
    </div>

    {/* after */}
    {/* <div className="lower-content">
      
      <LoadScript
        googleMapsApiKey="AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU"
      >
        <SearchLocation />
        {resultSales()}
      </LoadScript>
    </div> */}
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
  </div>
  ) :     <div className="dashboard">
  <div className="topbar">
      {UserProfile()}
      <div className="settings">
            <button type="button" onClick={handleSettingsDropdown}>
            <img
                src="../assets/settings-3110.png"
                className="settings-logo"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <div className="check"><input type="checkbox"></input></div>
            <div className="check-label"><label>Notifications</label></div>
          </div>
          <div>

          </div>
        </div>
      {UserNotifications()}
      <button className="testbutton" onClick={disableNotifsAndClose}>Disable Notifs</button>
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
        
      </div>
      
  </div>
  {/* before */}
  <div className="lower-content">
    {SavedSales()}
    <LoadScript
      googleMapsApiKey="AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU"
    >
      <SearchLocation />
    </LoadScript>
    {ResultSales()}
  </div>

  {/* after */}
  {/* <div className="lower-content">
    
    <LoadScript
      googleMapsApiKey="AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU"
    >
      <SearchLocation />
      {resultSales()}
    </LoadScript>
  </div> */}
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
</div>
}

export default Dashboard;

