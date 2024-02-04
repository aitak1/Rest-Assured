import React, { useState, useEffect, useCallback } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { Link } from 'react-router-dom';
import "./dashboard.css"; 


//testing marking 'garage sale' locations
const locationsArray =[
  "908 granview dr lewisville tx",
  "2021 vista dr lewisville tx",
  "1812 Blair oak drive lewisville tx",
  "118 lynn avenue lewisville tx"
];

//add markers for garage sale locations within radius of user position
const findTheWay = async (circle, map, userPosition) => {
  for(const location of locationsArray){

    try {
      // Perform geocoding to convert address to coordinates using a geocoding service
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU`
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results[0] && data.results[0].geometry) {
          const { lat, lng } = data.results[0].geometry.location;
          if(google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(lat, lng),
            new google.maps.LatLng(userPosition.lat, userPosition.lng)
          ) <= circle.getRadius())
          {
            new google.maps.Marker({
              position: {lat , lng},
              map,
              title: location,
              // Customize the marker properties or add other features as needed
            });
          }
        } else {
          console.log(data);
          alert("Invalid location");
        }
      } else {
        console.error("Geocoding request failed");
      }
    } catch (error) {
      console.error("Error during geocoding:", error);
    }
  }
    
};

function SearchLocation() {
    const [location, setLocation] = useState("");
    const [userPosition, setUserPosition] = useState({ lat: 33.253946, lng: -97.152896 });
    const [validAddress, setAddressValidity] = useState(false);

    const loadMap = useCallback(async ()=>{
      const mapStyles = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' } // Hide points of interest labels
          ]
        }];
      const loader = new Loader({
        apiKey: 'AIzaSyBqSTtw4vop05TMAcAXcdClNgIKApvgYVU', // Replace with your actual API key
        version: 'weekly'});
      
      
      loader.load().then(() => {
        const google = window.google;
        if (google) {
          const map = new google.maps.Map(document.getElementById('map')!, {
            center: userPosition || { lat: 33.253946, lng: -97.152896 },
            zoom: userPosition ? 17 : 1,
            styles: mapStyles
          });

          if (userPosition && validAddress) {
            const image = "/assets/currentLocationMarker.PNG";
        
            const marker = new google.maps.Marker({
              position: userPosition,
              map,
              title: 'Your Location',
              icon: image
            });
            
            const circle = new google.maps.Circle({
              map,
              center: userPosition,
              radius: .5 * 1609.34, // 5 miles in meters
              fillColor: '#4285F4', // Blue fill color
              fillOpacity: 0.2, // Adjust the opacity as needed
              strokeColor: '#4285F4', // Blue border color
              strokeOpacity: 0.8, // Adjust the opacity as needed
              strokeWeight: 2 // Border thickness
            });
    
            // Adjust the map bounds to include the marker and circle
            const bounds = new google.maps.LatLngBounds();
            bounds.extend(marker.getPosition()!);
            bounds.union(circle.getBounds()!);
            map.fitBounds(bounds); 

            findTheWay(circle, map, userPosition);
          }
         }
      });
    },[userPosition, validAddress]);

    useEffect(() => {
      loadMap();
    }, [loadMap]);

    const handleSearch = async () => {
      if(location.trim() !==''){
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
              loadMap();
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
        setLocation("");
      }
      else{
        alert("Please enter a location or use current location");
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
              loadMap();
              console.log(userPosition, 'confusion');
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

  return (
    <div className="lower-content">
      <div className="search-map">
        <div className="input-container">
          <input
            id="locationInput"
            name="location"
            type="text"
            placeholder="Location..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={ handleEnterKey}
            aria-label="Search Location"
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
        <div className="map" id="map">
        </div>
      </div>
    </div>
  );
}


function SavedSales() {
  return (
    <div className="saved">
    <div className="sidebar-container">
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
    </div>
  );
}

function ResultSales() {
  return (
    <div className="result">
    <div className="sidebar-container">
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

function Dashboard(){
  
    return(
    <div className="dashboard">
      <div className="topbar">
          {UserProfile()}
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
        {SearchLocation()}
        {ResultSales()}
      </div>
    </div>
  );
}

export default Dashboard;