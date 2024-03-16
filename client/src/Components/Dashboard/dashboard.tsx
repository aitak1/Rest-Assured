import React, { useState, useEffect, useRef } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { Link, useNavigate } from 'react-router-dom';
import "./dashboard.css"; 


//testing marking 'bathroom' locations
const locationsArray = [
  { address: "908 Granview Drive, Lewisville, TX, USA", distance: 1.1 },
  { address: "2021 Vista Drive, Lewisville, TX, USA", distance: 2.3 },
  { address: "1812 Blair Oak Drive, Lewisville, TX, USA", distance: 0.8 },
  { address: "118 Lynn Avenue, Lewisville, TX, USA", distance: 3.5 },
  { address: "2003 Buffalo Bend Dr lewisville tx", distance: 2.0 },
  { address: " 801 W Main St, Lewisville, TX 75067", distance: 4.4 }
];
let nearbyLocations=[] as { address: string, distance: number }[];
let globalDistance = .5;

//add markers for garage sale locations within radius of user position
const findTheWay = async (circle, map, userPosition) => {
  nearbyLocations = [];
  const processedAddresses = new Set();
  for(const location of locationsArray){
    if (!processedAddresses.has(location.address)) {
    try {
      // Perform geocoding to convert address to coordinates using a geocoding service
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location.address)}&key=AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o`
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
            location.distance = parseFloat((distance / 1609.34).toFixed(1));
            nearbyLocations.push(Object.assign({}, location));
            processedAddresses.add(location.address);
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
  nearbyLocations.sort((a, b) => {
    return a.distance - b.distance;
  });
  console.log(locationsArray.length, nearbyLocations.length);
}
    
};

//deal with the search bar, map api, and search functions
function SearchLocation(){
  const [location, setLocation] = useState(''); //location in search bar
  const [opened, setOpen] = useState(false);  //to activate circle radius on map
  const [userPosition, setUserPosition] = useState({ lat: 33.253946, lng: -97.152896 });  //auto set users position
  const [map, setMap] = useState<google.maps.Map | null>(null); //google map api
  const [distance, setDistance] = useState(.5);
  const isFindTheWayRunning = useRef(false);

  //load google map api and operate location search functions
  useEffect(() => {
        const loader = new Loader({
          apiKey: 'AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o',
          version: 'weekly',
          libraries: ['places', 'geometry'],
        });
    
        loader.load().then(() => {
          const mapElement = document.getElementById('map');
          const inputElement = document.getElementById('locationInput') as HTMLInputElement;
    
          const mapStyles = [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [
                { visibility: 'off' } //hide all extra markers
              ]
            }
          ];
    
          if (!mapElement || !inputElement) { //if map isnt loaded or input is empty
            return;
          }
    
          //setting map info
          const mapInstance = new window.google.maps.Map(mapElement, { 
            center: { lat: 33.253946, lng: -97.152896 },
            zoom: userPosition ? 17 : 1,
            styles: mapStyles
          });

          setMap(mapInstance);  //store map info 
    
          const searchBox = new window.google.maps.places.SearchBox(inputElement);  //suggest locations based on user input
    
          searchBox.addListener('places_changed', handleSearch);  //handle search for whichever location user selects
    
          const searchButton = document.getElementById('searchButton');
          if (searchButton) {
            searchButton.addEventListener('click', handleSearch);
          }
    
          function handleSearch() { //search based on user selection
            const places = searchBox.getPlaces(); 
    
            if (!places || places.length === 0) { //if places not loaded or no places shown
              return;
            }

            const place = places[0];  //store place user selected
            if (place.geometry && place.geometry.location) {  //check if location is valid
              setOpen(true);  //allow circle radius to appear
              setLocation(place.formatted_address ?? ''); //store the selected location in user input bar

              //store lat and lng of selected place as users location
              const { lat, lng } = place.geometry.location; 
              const newPosition = { lat: lat(), lng: lng() };
              setUserPosition(newPosition);
              mapInstance.panTo(newPosition); //zoom in to users new position
            }
          }
        }).catch(error => { //if map failed to load
          console.error('Error loading Google Maps API:', error);
        });
      }, [userPosition, distance]); //depends on if userPosition changes

  //add markers to map and create circle radius
  useEffect(() => {

    if (!map || !userPosition) return;  //if map failed to load or user position undefined
  
    //allow marker for user position after first valid address 
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
    
    //create circle for map
    const circle = new google.maps.Circle({
        map,
        center: userPosition,
        radius: distance * 1609.34, // within distance miles
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

    //add markers for locations within radius
    //findTheWay(circle, map, userPosition);
    if(circle !== undefined){
            if(!isFindTheWayRunning.current){
            isFindTheWayRunning.current = true;
            findTheWay(circle, map, userPosition).finally(() => {
              isFindTheWayRunning.current = false;
            });
          }
        }

    //zoom in 
    const zoomLevel = map.getZoom();
    if (zoomLevel && zoomLevel > 15) {
      map.setZoom(17);
    }
    }
  
  }, [userPosition, map, distance]);  //when userPosition or map changes

  //another handle search function using 'enter' and search button
  const handleSearch = async () => {
    if (location.trim() !== '') { //if location input isnt empty
      //request geocode for location
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o`
        );
        
        //if gets response, update user position with data recieved 
        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results[0] && data.results[0].geometry) {
            const { lat, lng } = data.results[0].geometry.location;
            setOpen(true);
            setUserPosition({ lat, lng });
            console.log("User position updated successfully!");
          } else {
            console.log(data);
          }
        } else {  //if no response
          console.error("Geocoding request failed");
        }
      } catch (error) { //if error in connecting to googleapis
        console.error("Error during geocoding:", error);
      }
    }
  };

  //handle current location 
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
            console.log("User position updated successfully:", newPosition);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    } catch (error) {
      console.error('Error getting user location:', error);
    }
  };
  
  const handleEnterKey = (e) => {
          if (e.key === 'Enter') {
            handleSearch(); //call search function with 'enter' key press
          }
        };
    
        function SavedSales() {
          const [dropdownOpen, setdropdownOpen] = useState(false);
          const [savedDistance, setSavedDistance] = useState(.5);
        
          const handleDistanceDropdown = () => {
            setdropdownOpen(!dropdownOpen); // Toggle the dropdown
          };
          const handleDistanceChange = (newDistance) =>{
            setDistance(newDistance);
            setSavedDistance(newDistance);
          };
          return (
            <div className="saved">
            <div className="sidebar-container">
            <div className="sidebar">
                <div className="name">
                  Locations
                  <button className="result-sales-button"><Link to="/create-post" style={{ textDecoration: 'none', color: 'inherit'}}>Add</Link></button>
                </div>
                <div className="locationSettings">
                  <button className="setDistance"  onClick={handleDistanceDropdown}>
                        <text>Within {distance} miles </text>
                      <img
                          //src="https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000"
                          src="https://static.thenounproject.com/png/551749-200.png"
                          className="open-dropdown"
                          alt=""
                        />
                    </button>
                    <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
                      <p onClick={()=>handleDistanceChange(0.5)}>Within 0.5 miles</p>
                      <p onClick={()=>handleDistanceChange(1.0)}>Within 1.0 miles</p>
                      <p onClick={()=>handleDistanceChange(2.0)}>Within 2.0 miles</p>
                      <p onClick={()=>handleDistanceChange(5.0)}>Within 5.0 miles</p>
                      <p onClick={()=>handleDistanceChange(10.0)}>Within 10.0 miles</p>
                      <p onClick={()=>handleDistanceChange(15.0)}>Within 15.0 miles</p>
                    </div>
                </div>
                <ul>
                  {nearbyLocations.map((location, index) => (
                //<li key={location}>{location}  <button className="result-sales-button"><Link to="/reviewpage" style={{ textDecoration: 'none', color: 'inherit'}}>Review</Link></button></li>
                    <li key={`${location.address}-${index}`}>
                      <div className="locationInfo">
                        <span className="location-text">{location.address}</span>
                        <span className="routeDistance">{location.distance}</span>
                      </div>
                      <button className="result-sales-button">
                        <Link to="/reviewpage" style={{ textDecoration: 'none', color: 'inherit'}}>Review</Link>
                      </button>
                    </li>
                  ))}
                </ul>
            </div>
            </div>
            </div>
          );
        }

  return (
    <div className="lower-content">
        {SavedSales()}
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

// function SavedSales() {
//   const [dropdownOpen, setdropdownOpen] = useState(false);
//   const [savedDistance, setSavedDistance] = useState(globalDistance);

//   const handleDistanceDropdown = () => {
//     setdropdownOpen(!dropdownOpen); // Toggle the dropdown
//   };
//   const handleDistanceChange = (newDistance) =>{
//     globalDistance = newDistance;
//     setSavedDistance(newDistance);
//   };
//   return (
//     <div className="saved">
//     <div className="sidebar-container">
//     <div className="sidebar">
//         <div className="name">
//           Locations
//           <button className="result-sales-button"><Link to="/create-post" style={{ textDecoration: 'none', color: 'inherit'}}>Add</Link></button>
//         </div>
//         <div className="locationSettings">
//           <button className="setDistance"  onClick={handleDistanceDropdown}>
//                 <text>Within {globalDistance} miles </text>
//               <img
//                   //src="https://i.seadn.io/gcs/files/3085b3fc65f00b28699b43efb4434eec.png?auto=format&dpr=1&w=1000"
//                   src="https://static.thenounproject.com/png/551749-200.png"
//                   className="open-dropdown"
//                   alt=""
//                 />
//             </button>
//             <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
//               <p onClick={()=>handleDistanceChange(0.5)}>Within 0.5 miles</p>
//               <p onClick={()=>handleDistanceChange(1.0)}>Within 1.0 miles</p>
//             </div>
//         </div>
//         <ul>
//           {locationsArray.map(location => (
//         //<li key={location}>{location}  <button className="result-sales-button"><Link to="/reviewpage" style={{ textDecoration: 'none', color: 'inherit'}}>Review</Link></button></li>
//             <li key={location}>
//               <span className="location-text">{location}</span>
//               <button className="result-sales-button">
//                 <Link to="/reviewpage" style={{ textDecoration: 'none', color: 'inherit'}}>Review</Link>
//               </button>
//             </li>
//           ))}
//         </ul>
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
            <a href="https://www.google.com/">Settings</a>
            <Link to="/">Sign Out</Link>
          </div>
        </div>
  );
}

// function UserNotifications(){
// }

// async function notifyUser(notificationText = "Thank you for enabling notifications!") { //logic for notifying a user
// }

function Dashboard(){

  //states
  // const [userResponded, setUserResponded] = useState(false);
  // const [dropdownOpen, setdropdownOpen] = useState(false);
  // const handleSettingsDropdown = () => {
  //   setdropdownOpen(!dropdownOpen); // Toggle the dropdown
  // };

  // async function enableNotifsAndClose() {
  //   await notifyUser().then(() => {
  //     setUserResponded(true);
  //   });
  // }

  // function disableNotifsAndClose() {
    
  //   setUserResponded(true);
  // }

  
    return(
    <div className="dashboard">
      <div className="topbar">
          <div className="content">
            <div className="image-container">
              <img
                src="/assets/tempLogo.PNG"
                className="logo"
                alt="logo"
              />
            </div>
            <div className="name">Restroom Finder</div>
          </div>
          {UserProfile()}
      </div>
        {SearchLocation()}

    </div>
  );
}

export default Dashboard;