
import React, { useState, useEffect, useRef, useCallback, ReactHTMLElement } from "react";
import { Loader } from '@googlemaps/js-api-loader';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "./dashboard.css"; 
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../Translations/language-selector';

import { db } from "../../firebase.ts";
import {collection, getDocs, } from 'firebase/firestore'

//store all essential info for nearby locations
let nearbyLocations=[] as {id : string, name: string, address: string, distance: number, latS: number, lngS: number, rating:{positive: number, negative: number} }[];
interface MarkerWithInfoWindow extends google.maps.Marker {
  infoWindow: google.maps.InfoWindow;
}
interface Rating {
  positive: number;
  negative: number;
}
let locationMarkers: MarkerWithInfoWindow[] = []; //store location markers and info windows
let globalDistance = .5;

//deal with the search bar, map api, and search functions
function SearchLocation(){
  const navigate = useNavigate();
  const [dataLoaded, setDataLoaded] = useState(false);
  const [location, setLocation] = useState(''); //location in search bar
  const [opened, setOpen] = useState(false);  //to activate circle radius on map
  const [userPosition, setUserPosition] = useState({ lat: 33.253946, lng: -97.152896 });  //auto set users position
  const [map, setMap] = useState<google.maps.Map | null>(null); //google map api
  const [distance, setDistance] = useState(globalDistance); //within radius of global distance
  const [circle, setCircle] = useState<google.maps.Circle | null>(null);
  let locationUpdate = false;
  const currentLocation = useLocation();
  const memoizedFindTheWay = useCallback(async (circle, map, userPosition) => {
    try {
      // Your asynchronous logic goes here
      // For example:
      const result = await findTheWay(circle, map, userPosition);
      // Process the result if needed
      return result;
    } catch (error) {
      // Handle errors
      console.error('Error:', error);
    } finally {
      // Finally block executes whether there's an error or not
      // You can perform cleanup or other actions here
      console.log('Finally block executed');
    }
  }, []);
  let locationHome = false;

  let routeIndex: number | null = null;

  //find locations within certain radius and create markers, store data, signal for sidebar to rerender
  const findTheWay = async (circle, map, userPosition) => {
    nearbyLocations = [];
  
    //remove all markers from map
    if(locationMarkers.length !=0)
    {
      locationMarkers.forEach(marker => {
        console.log('delete');
        marker.setMap(null);
    });
    //Empty the locationMarkers array
      locationMarkers = [];
    }

      try {
        // Perform geocoding to convert address to coordinates using a geocoding service
        const restroomSnap = await getDocs(collection(db, "restrooms"));
        await Promise.all(restroomSnap.docs.map(async (doc) => {
          const data = doc.data();
          const street = data.street;
          const city = data.city;
          const state = data.state;
          const country = data.country;
          const name = data.name;
          const rating = {positive: data.thumbs_up, negative: data.thumbs_down} as Rating;

          console.log('MAMA MIA',typeof rating.positive);
    
          // Concatenate street, city, state, and country to form complete address
          const address = `${street}, ${city}, ${state}, ${country}`;
    
          console.log("Attempting geocoding for address:", address);
    
          // Perform geocoding to convert address to coordinates
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o`
          );
    
          if (response.ok) {
            const geoData = await response.json();
            console.log("Geocoding response:", geoData); // Log the response from geocoding API
            if (geoData.results && geoData.results[0] && geoData.results[0].geometry) {
              const { lat, lng } = geoData.results[0].geometry.location;
    
              // Calculate distance between the location and user's position
              const distance = google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(lat, lng),
                new google.maps.LatLng(userPosition.lat, userPosition.lng)
              );
    
              // Check if the location is within the selected radius
              if (distance <= circle.getRadius()) {

                // Push the location to the nearbyLocations array
                const distanceInMiles = parseFloat((distance / 1609.34).toFixed(2));
                nearbyLocations.push({ id: doc.id, name, address, distance: distanceInMiles, latS: lat, lngS: lng, rating});
              }
            } else {
              console.error("Invalid location:", address); //print error
            }
          } else {
            console.error("Geocoding request failed");//print error
          }
        }));
    
        // Sort nearby locations by distance
        nearbyLocations.sort((a, b) => a.distance - b.distance);

        //create markers relative to nearby locations as well as info boxes to associate with them when hovering
        nearbyLocations.forEach( (location) => {
          const marker = new google.maps.Marker({
                  position: { lat:location.latS, lng: location.lngS },
                  map,
                  title: location.name,
                  icon: {
                    url: "/assets/marker.PNG",
                    scaledSize: new google.maps.Size(30, 45)
                  }
                })as MarkerWithInfoWindow;
                //info to display when marker selected
                let color = "";
                let positive = location.rating.positive;
                let negative = location.rating.negative;
                let total = negative + positive;
                let overallRating = positive / total * 100;
                

                if(total === 0)
                {
                  color = "rgb(40, 40, 135)";
                }
                else if(overallRating  < 70 && overallRating >= 40)
                {
                  color = "orange";
                }

                else if(overallRating < 40)
                {
                  color = "red";
                }

                else
                {
                  color = "green";
                }

                let infoWindow;
                if(total === 0)
                {
                  infoWindow = new google.maps.InfoWindow({
                    content: `<div>${location.address}</div><div>Distance: ${location.distance} mi / ${(location.distance* 1.60934).toFixed(3)} km</div><div style="text-align: center; color: white; padding: 4px; background: ${color}">No ratings</div>`
                  });
                }
                else
                {
                  infoWindow = new google.maps.InfoWindow({
                          content: `<div>${location.address}</div><div>Distance: ${location.distance} mi / ${(location.distance* 1.60934).toFixed(3)} km</div><div style="text-align: center; color: white; padding: 4px; background: ${color}">${(overallRating).toFixed(1)}%</div>`
                        });
                }

                marker.addListener('click', () => {
                      infoWindow.open(map, marker);
                    });      
                locationMarkers.push(marker);
      });
        setDataLoaded(true);  //to initiate sidebar update
        if(dataLoaded){
          console.log('yooo whats good');
        }
        
        // Log the number of locations found
        console.log("Number of nearby restroom locations:", nearbyLocations.length);
    
      } catch (error) {
        console.error("Error fetching restroom data:", error);  //print error
      }
    };


  //load google map api and operate location search functions
  useEffect(() => {
    //load map
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
    
          if (!mapElement || !inputElement || !userPosition) { //if map isnt loaded or input is empty
            return;
          }
    
          //setting map info
          let mapInstance;
          
            mapInstance = new window.google.maps.Map(mapElement, { 
              center: userPosition,
              zoom: userPosition ? 17 : 1,
              styles: mapStyles
            });
          

          setMap(mapInstance);  //store map info 
    
          const searchBox = new window.google.maps.places.SearchBox(inputElement);  //suggest locations based on user input
    
          searchBox.addListener('places_changed', selectionSearch);  //handle search for whichever location user selects
    
          function selectionSearch() { //search based on user selection
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
             // holdPosition = {...newPosition};
              mapInstance.panTo(newPosition); //zoom in to users new position
             
            }
          }
        }).catch(error => { //if map failed to load
          console.error('Error loading Google Maps API:', error);
        });

        console.log('AMMMEEERRRIIICAAAA');
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
        scaledSize: new google.maps.Size(29, 52)
      },
    });
    
    //remove any existing circles off map
    if (circle) {
      circle.setMap(null);
    }

    // Create new circle
    const newCircle = new google.maps.Circle({
      map,
      center: userPosition,
      radius: distance * 1609.34, // Convert miles to meters
      fillColor: '#4285F4',
      fillOpacity: 0.2,
      strokeColor: '#4285F4',
      strokeOpacity: 0.8,
      strokeWeight: 2
    });

    // Set the new circle instance
    setCircle(newCircle);

      
          
    // Adjust the map bounds to include the marker and circle
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(marker.getPosition()!);
    bounds.union(newCircle.getBounds()!);
    map.fitBounds(bounds); 

    //add markers for locations within radius
    if(newCircle !== undefined){
      memoizedFindTheWay(newCircle, map, userPosition);     
    }

        console.log('horset p2',locationMarkers.length); 

    //zoom in 
    const zoomLevel = map.getZoom();
    if (zoomLevel && zoomLevel > 15) {
      map.setZoom(17);
    }
    }
  
  }, [map]);  // map changes

  const searchParams = new URLSearchParams(window.location.search);
  const positionParam = searchParams.get("latLng");
  const getFormattedAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      const data = await response.json();
      if (data.status === 'OK' && data.results && data.results.length > 0) {
        return data.results[0].formatted_address;
      } else {
        throw new Error('No address found');
      }
    } catch (error) {
      console.error('Error fetching address:', error.message);
      return null;
    }
  };
  
  useEffect(() => {
    if(positionParam?.trim() != '' && positionParam)
    {
     console.log(positionParam, "SAVE MEEEE jk");
     const positionArray = positionParam.split(',').map(Number);
    if (positionArray.length === 2) {
      const newPosition = { lat: positionArray[0], lng: positionArray[1] };
      getFormattedAddress(positionArray[0], positionArray[1])
    .then((formattedAddress) => {
      console.log('Formatted Address:', formattedAddress);
      setLocation(formattedAddress);
      locationUpdate = true;
      console.log('Location',location);
      handleSearch();
    })
    .catch((error) => {
      console.error('Error:', error.message);
    })
    //setUserPosition(newPosition);
  }
    }
     
    // Store the initial address value obtained from the URL in the ref
    
  }, [positionParam]);

  useEffect(() => {
    console.log('UPDATE: ', locationUpdate);
    if(!locationUpdate || !location) return;
    console.log()
    handleSearch();
    locationUpdate = false;
  },[location]);

  //to reset dataloaded to prepare for next sidebar update
  useEffect(() => {
    if (dataLoaded) {
      console.log('Data loaded!');
      setDataLoaded(false);
    }
  }, [dataLoaded]);



  //another handle search function using 'enter' and search button
  const handleSearch = async () => {
    console.log(location.trim());
    console.log(location);
    if (location.trim() !== '') { //if location input isnt empty
      console.log('HEYOOOO TEST');
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

  useEffect(() => {
    const searchParams = new URLSearchParams(currentLocation.search);
    if (searchParams.get('useLocation') === 'true') {
     handleCurrentLocation();
    }
   // Removed extraneous closing brace and corrected dependency array
   }, [currentLocation.search]);

   const initialAddressRef = useRef<string | null>(null);

   useEffect(() => {
     // Parse the URL parameters
     const searchParams = new URLSearchParams(window.location.search);
     // Get the 'address' parameter from the URL
     const addressParam = searchParams.get("address");
     if(addressParam)
     {
      initialAddressRef.current = addressParam;
      setLocation(addressParam);
     }
      
     // Store the initial address value obtained from the URL in the ref
     
   }, []);
 
   useEffect(() => {
     const initialAddress = initialAddressRef.current;
     if (initialAddress) {
       // This block of code will run after the initial address has been obtained
       console.log(initialAddress);
       // You can call any function here that needs to be executed after obtaining the initial address
       handleSearch();
       console.log("work?");
     }
   }, [initialAddressRef]);

        const {t} = useTranslation();
       function SavedSales({ update }) {
          const [dropdownOpenB, setdropdownOpenB] = useState(false);
          const {t} = useTranslation();
          const [savedDistance, setSavedDistance] = useState(globalDistance);
          console.log("radishes");
        
          //toggle radius distance dropdown
          const handleDistanceDropdown = () => {
            setdropdownOpenB(!dropdownOpenB); 
            console.log('wassuuuppp guurll');
          };
          //update radius distance
          const handleDistanceChange = (newDistance) =>{
            setDistance(newDistance);
            globalDistance = newDistance;
            setSavedDistance(newDistance);
          };

          //highlight marker thats relative to list item hovered on sidebar
          const highlightMarker = async (index: number) => {
              if (locationMarkers[index]) {
                await resetMarker();  //reset marker image and zindex
                const newIcon = {
                  url: "/assets/highlighted-marker.PNG",
                        scaledSize: new google.maps.Size(30, 45)
              };
              locationMarkers[index].setIcon(newIcon);
              console.log("yooooooo", index);
              locationMarkers[index].setAnimation(google.maps.Animation.BOUNCE);
              locationMarkers[index].setZIndex(google.maps.Marker.MAX_ZINDEX + 1);
              console.log("arr length", locationMarkers.length);
            }
          };
          
          //resets all markers zindex and image
          const resetMarker = () => {
            return new Promise<void>((resolve) => {
                const resetIcon = {
                    url: "/assets/marker.PNG",
                    scaledSize: new google.maps.Size(30, 45)
                };
                locationMarkers.forEach((marker, index) => {
                  console.log(index);
                    marker.setIcon(resetIcon);
                    console.log('broooooo');
                    marker.setAnimation(null);
                    marker.setZIndex(index);
                });
                resolve(); // Resolve the Promise after resetting all markers
            });
};

          const handleListItemClick = (index: number) => {
            // Close any previously opened InfoWindows
            //closeAllInfoWindows();
            locationMarkers[index].setAnimation(null);
            // Open InfoWindow for the clicked marker
           // const marker = locationMarkers[index];
           // const infoWindow = marker.infoWindow;
           // infoWindow.open(map, marker);
        };

        const navigateToReviewPage = (index : number) =>{
          routeIndex = index;
          const positionString = `${userPosition.lat},${userPosition.lng}`;
          console.log("HORSEEEEE", routeIndex);
          if(routeIndex || routeIndex === 0)
            navigate(`/reviewpage/${nearbyLocations[routeIndex].id}/${positionString}`);
          else
            console.log("PROBLEM", routeIndex);
        }
        
        const closeAllInfoWindows = () => {
            locationMarkers.forEach(marker => {
                marker.infoWindow.close();
            });
        };
          return (
            <div className="saved">
            <div className="sidebar-container">
            <div className="sidebar">
                <div className="name">
                {t("global.dashboard.title")}
                  <button className="add-button"><Link to="/add-restroom" style={{ textDecoration: 'none', color: 'inherit'}}>{t("global.dashboard.addPost")}</Link></button>
                </div>
                <div className="locationSettings">
                  <button className="setDistance"  onClick={handleDistanceDropdown}>
                        <span>Within {distance} miles </span>
                      <img
                          src="https://static.thenounproject.com/png/551749-200.png"
                          className="open-dropdown"
                          alt=""
                        />
                  </button>
                    <div className={`dropdown-contentB ${dropdownOpenB ? 'flex' : 'hidden'}`}>
                      <span onClick={()=>handleDistanceChange(0.5)}>Within 0.5 miles</span>
                      <span onClick={()=>handleDistanceChange(1.0)}>Within 1.0 miles</span>
                      <span onClick={()=>handleDistanceChange(2.0)}>Within 2.0 miles</span>
                      <span onClick={()=>handleDistanceChange(5.0)}>Within 5.0 miles</span>
                      <span onClick={()=>handleDistanceChange(10.0)}>Within 10.0 miles</span>
                      <span onClick={()=>handleDistanceChange(15.0)}>Within 15.0 miles</span>
                    </div>

                </div>
                <div className="displayLocations">
                <ul>
                  {nearbyLocations.map((location, index) => (
                    <li key={`${location.address}-${index}`}
                    onMouseEnter={() => highlightMarker(index)} 
                    onClick={()=>handleListItemClick(index)}>
                      <div className="locationInfo">
                        <span className="name-text">{location.name}</span>
                        <span className="location-text">{location.address}</span>
                        <span className="routeDistance">{location.distance} mi / {(location.distance *  1.60934).toFixed(3)} km</span>
                      </div>
                      <button className="result-sales-button"
                        onClick={()=> navigateToReviewPage(index)}>
                      
                        <img
                          src="/assets/arrow.PNG"
                          className="array-image"
                          alt=""
                        />
                      
                      </button>
                    
                    </li>
                  ))}
                </ul>
                </div>
            </div>
            </div>
            </div>
          );
        }

  return (
    <div className="lower-content">
        <SavedSales update={dataLoaded} />
          <div className="search-map">
            <div className="input-container">
              <input
                id="locationInput"
                name="location"
                type="text"
                placeholder={t("global.dashboard.searchbar")}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                aria-label="Search Location"
              />
              <button id="searchButton" type="button" className="searchButton" onClick={handleSearch}>
              {t("global.dashboard.search")}
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

function UserProfile(){
  const {t} = useTranslation();
  const [dropdownOpen, setdropdownOpen] = useState(false);
  const handleProfileDropdown = () => {
    setdropdownOpen(!dropdownOpen); // Toggle the dropdown
  };

  const [languagesOpen, setlanguagesOpen] = useState(false);
  const handleLanguagesDropdown = () => {
    setlanguagesOpen(!languagesOpen); // Toggle the dropdown
  };

  let settingsRef = useRef();
  let profileRef = useRef();
  let backRef = useRef();
  //let testRef = useRef();

  useEffect(() =>{
    let handler = (e)=> {
      if(settingsRef.current.contains(e.target)){
        setdropdownOpen(false);
        setlanguagesOpen(true);
      }
      if(!profileRef.current.contains(e.target)){
        setdropdownOpen(false);
        setlanguagesOpen(false);
      }
      if(backRef.current.contains(e.target)){
        setdropdownOpen(true);
        setlanguagesOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);

    return() => {
      document.removeEventListener("mousedown", handler);
    }
  })


  return (
    <div className="profile" ref={profileRef}>
            <button type="button"  onClick={handleProfileDropdown}>
            <img
                src="https://i.pinimg.com/736x/b9/49/0a/b9490abd30c15850908b8ee0570f8b19.jpg"
                className="pfp"
                alt="profile_picture"
              />
            
          </button>
          <div className={`dropdown-content ${dropdownOpen ? 'show' : ''}`}>
            <a href="https://www.google.com/">{t("global.dropdown.profile")}</a>
            <a>{t("global.dropdown.settings")}</a>
            <button ref={settingsRef} type="button">
            {t("global.dropdown.language")}       
            </button >
            <Link to="/">{t("global.dropdown.signout")}</Link>
          </div>
          <div className={`dropdown-content ${languagesOpen ? 'show' : ''}`}>
            <LanguageSelector />
            <a ref={backRef}>{t("global.dropdown.return")}</a>
          </div>

          <div>

          

          </div>
        </div>
  );
}

function Dashboard(){
  
  useEffect(() => {
    console.log("jorge");
    
  }, []);
   const {t} = useTranslation();
    return(
    <div className="dashboard">
      <div className="topbar">
          <div className="content">
            <div className="image-container">
              <img
                src="/assets/Main Logo.PNG"
                className="logo"
                alt="logo"
              />
            </div>
            <div className="name">{t("global.header.name")}</div>        
          </div>
          {UserProfile()}
      </div>
        {SearchLocation()}

    </div>
  );
}

export default Dashboard;