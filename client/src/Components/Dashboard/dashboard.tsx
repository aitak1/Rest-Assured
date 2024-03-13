import React, { useState, useEffect, useCallback } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { Link, useNavigate } from 'react-router-dom';
import "./dashboard.css"; 
//import ReviewPage from "../Reviewpage/reviewpage";



//testing marking 'garage sale' locations
const locationsArray =[
  "908 Granview Drive, Lewisville, TX, USA",
  "2021 Vista Drive, Lewisville, TX, USA",
  "1812 Blair Oak Drive, Lewisville, TX, USA",
  "118 Lynn Avenue, Lewisville, TX, USA",
  "2003 Buffalo Bend Dr lewisville tx"
];
let nearbyLocations=[] as string[];
//const navigate = useNavigate();

//add markers for garage sale locations within radius of user position
const findTheWay = async (circle, map, userPosition) => {
  //nearbyLocations.length = 0;
  for(const location of locationsArray){
    try {
      // Perform geocoding to convert address to coordinates using a geocoding service
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o`
      );
  
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results[0] && data.results[0].geometry) {
          const { lat, lng } = data.results[0].geometry.location;
          const distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(lat, lng),
            new google.maps.LatLng(userPosition.lat, userPosition.lng)
          );
          if(distance <= circle.getRadius())
          {
            nearbyLocations.push(location);
            new google.maps.Marker({
              position: {lat , lng},
              map,
              title: location,
              icon: {
                url: "/assets/marker.PNG",
                scaledSize: new google.maps.Size(140, 110)
              }
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

function SearchLocation(){
  const [location, setLocation] = useState('');
  const [opened, setOpen] = useState(false);
  const [userPosition, setUserPosition] = useState({ lat: 33.253946, lng: -97.152896 });
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
        const loader = new Loader({
          apiKey: 'AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o',
          version: 'weekly',
          libraries: ['places'],
        });
    
        loader.load().then(() => {
          const mapElement = document.getElementById('map');
          const inputElement = document.getElementById('locationInput') as HTMLInputElement;
    
          const mapStyles = [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' } // Hide points of interest labels
              ]
            }
          ];
    
          if (!mapElement || !inputElement) {
            return;
          }
    
          const mapInstance = new window.google.maps.Map(mapElement, {
            center: { lat: 33.253946, lng: -97.152896 },
            zoom: userPosition ? 17 : 1,
            styles: mapStyles
          });

          setMap(mapInstance);
    
          const searchBox = new window.google.maps.places.SearchBox(inputElement);
    
          searchBox.addListener('places_changed', handleSearch);
    
          const searchButton = document.getElementById('searchButton');
          if (searchButton) {
            searchButton.addEventListener('click', handleSearch);
          }
    
          function handleSearch() {
            const places = searchBox.getPlaces();
    
            if (!places || places.length === 0) {
              return;
            }
            //setOpen(true);
            const place = places[0];
            if (place.geometry && place.geometry.location) {
              const { lat, lng } = place.geometry.location;
              const newPosition = { lat: lat(), lng: lng() };
              setUserPosition(newPosition);
              mapInstance.panTo(newPosition);
              
            }
          }
            //inputElement.value = "";
        //  });
        }).catch(error => {
          console.error('Error loading Google Maps API:', error);
        });
      }, [userPosition]);

  useEffect(() => {
    if (!map || !userPosition) return;
  
    if(opened){
    map.panTo(userPosition);
    const marker = new google.maps.Marker({
      position: userPosition,
      map: map,
      title: 'Your Location',
      icon: {
        url: "/assets/userMarker.PNG",
        scaledSize: new google.maps.Size(90, 70)
      },
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
    const zoomLevel = map.getZoom();
    if (zoomLevel && zoomLevel > 15) {
      map.setZoom(17);
    }
    }
  
  }, [userPosition, map]);

  const handleSearch = async () => {
    if (location.trim() !== '') {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o`
        );
  
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results[0] && data.results[0].geometry) {
            const { lat, lng } = data.results[0].geometry.location;
            setOpen(true);
            setUserPosition({ lat, lng });
            console.log("User position updated successfully!");
          } else {
            console.log(data);
            //alert("Invalid location");
          }
        } else {
          console.error("Geocoding request failed");
        }
      } catch (error) {
        console.error("Error during geocoding:", error);
      }
      //setLocation("");
    } else {
      //alert("Please enter a location");
    }
  };

  const handleCurrentLocation = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const newPosition = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setOpen(true);
            setUserPosition(newPosition);
            //setAddressValidity(true);
            //await loadMap(); // Assuming loadMap is an async function
            console.log("User position updated successfully:", newPosition);
          },
          (error) => {
            console.error('Error getting user location:', error);
           // setAddressValidity(false);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.error('Error getting user location:', error);
      //setAddressValidity(false);
    }
  };
  
  const handleEnterKey = (e) => {
          if (e.key === 'Enter') {
            handleSearch(); // Trigger search function on Enter key press
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
              <button id="searchButton" type="button" className="searchButton" onClick={handleSearch}>
                Search
              </button>
              <img className="currentLocationButton" 
                onClick={handleCurrentLocation}
                src="/assets/currentLocationButton.png"
                alt="current_location"
              />
            </div>
            <div className="map" id="map"></div>
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
          Locations
        </div>
        <ul>
          {locationsArray.map(location => (
        <li key={location}>{location}  <button className="result-sales-button"><Link to="/reviewpage" style={{ textDecoration: 'none', color: 'inherit'}}>Review</Link></button></li>
      ))}
        </ul>
    </div>
    </div>
    </div>
  );
}

// function ResultSales() {
//   return (
//     <div className="result">
//     <div className="sidebar-container">
//     <div className="sidebar">
//         <div className="name">
//           Results
//         </div>
//         <ol>
//           <li>First</li>
//           <li>Second</li>
//           <li>Third</li>
//         </ol>
//     </div>
//     </div>
//     </div>
//   );
// }



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

function Dashboard(){
  
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
        {SavedSales()}
        {SearchLocation()}
        {/* {ResultSales()} */}
      </div>
    </div>
  );
}

export default Dashboard;