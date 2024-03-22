import React, { useState, useEffect } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { db } from "../../firebase.ts";
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import "./reviewpage.css";

// Define a custom interface for restroom data
interface RestroomData {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  address: string;
  direction: string;
  comments: string;
  // Add more fields as needed
}

interface Review {
  reviewerName: string;
  cleanliness: number;
  amenities: number;
  accessibility: number;
  description: string;
  image: File | null;
  date: Date; // Add date property
}

function ReviewPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { position } = useParams<{ position: string }>();
  const positionArray = (position ? position.split(',').map(Number) : []) || [];
  const [getAddress, setAddress] = useState('');
  const [map, setMap] = useState<google.maps.Map | null>(null);
  //const [restroomData, setRestroomData] = useState(null);
  const [restroomData, setRestroomData] = useState<RestroomData | null>(null);
  const [addingReview, setAddingReview] = useState(false);
  const [newReview, setNewReview] = useState<Review>({
    reviewerName: "",
    cleanliness: 0,
    amenities: 0,
    accessibility: 0,
    description: "",
    image: null,
    date: new Date(), // Initialize date with current date
  });
  const [reviewsData, setReviewsData] = useState<Review[]>([
    //reviewerName: "User 1", cleanliness: 4, amenities: 3, accessibility: 5, description: "Very Clean bathroom!", image: null, date: new Date() 

  ]);

  const handleAddReview = () => {
    const updatedReviews = [...reviewsData, { ...newReview }];
    setReviewsData(updatedReviews);
    setNewReview({
      reviewerName: "",
      cleanliness: 0,
      amenities: 0,
      accessibility: 0,
      description: "",
      image: null,
      date: new Date(), // Update date with current date
    });
    setAddingReview(false);
  };

  const calculateOverallQuality = (review: Review): number => {
    return (review.cleanliness + review.amenities + review.accessibility) / 3;
  };

  useEffect(() => {
    const fetchRestroomData = async () => {
      if (!id) return; // Exit early if ID is undefined

      try {
        const docRef = doc(db, "restrooms", id); // Reference to the restroom document
        const docSnap = await getDoc(docRef); // Fetch the document snapshot

        if (docSnap.exists()) {
          // If the document exists, set the restroom data state
          const data = docSnap.data();
          const hold = `${data.street}, ${data.city}, ${data.state}, ${data.country}`;
          setAddress(hold);
          setRestroomData({
            name: data.name,
            street: data.street,
            city: data.city,
            state: data.city,
            country: data.country,
            address: `${data.street}, ${data.city}, ${data.state}, ${data.country}`,
            direction: data.directions,
            comments: data.comment
            // Add more fields as needed
          });
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching restroom data:", error);
      }
    };
    const restroomId = "your_restroom_id";

    // Function to fetch reviews associated with the restroom ID
    const fetchReviews = async () => {
      try {
        const reviewRef = collection(db, 'reviews');
        const q = query(reviewRef, where("restroomID", "==", `/restrooms/${id}`));
        const querySnapshot = await getDocs(q);
        const reviewData: Review[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          reviewData.push({
            reviewerName: data.reviewerName,
            cleanliness: data.cleanliness,
            amenities: data.amenities,
            accessibility: data.accessibility,
            description: data.description,
            image: null, // Assuming image is not stored in the reviews collection
            date: data.date.toDate(), // Assuming 'date' is stored as a Firestore Timestamp
          });
        });
        setReviewsData(reviewData);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchRestroomData();
    fetchRestroomData(); // Fetch restroom data when component mounts
  }, [id]); // Re-fetch data when the ID changes

  useEffect(() => {
    //load map into page
    const loader = new Loader({
      apiKey: 'AIzaSyDLRmzWGSVuOYRHHFJ0vrEApxLuSVVgf1o',
      version: 'weekly',
      libraries: ['places', 'geometry'], // You can add "directions" here for routes
    });

    loader.load().then(() => {
      const mapElement = document.getElementById('map');
      if(!mapElement || !position) return;
      const mapStyles = [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [
            { visibility: 'off' } //hide all extra markers
          ]
        }
      ];

      const makeMap = new google.maps.Map(mapElement, {
        center: { lat: 33.253946, lng: -97.152896 },
        zoom: 17,
        styles: mapStyles
      });    
      
      console.log('part 1');
        
      setMap(makeMap);  //set changes to map
    });
  }, []);

  //whenever map changes
  useEffect(() => {
    const fetchData = async () => {
      console.log("POR QUE");
  
      if (!map) return; //if map not loaded
      //display route
      const directionsService = new google.maps.DirectionsService();
      const directionsRenderer = new google.maps.DirectionsRenderer();
      let destLat: number = 33.253946;
      let destLng: number = -97.136407;
  
      if (!restroomData) return;
      const address = `${restroomData.street}, ${restroomData.city}, ${restroomData.state}, ${restroomData.country}`;
  
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
          destLat = lat;
          destLng = lng;
          console.log("ayo");
        }
      }
  
      console.log('part 2');
      directionsRenderer.setMap(map);
      let request;
  
      request = {
        origin: {
          lat: positionArray[0], lng: positionArray[1]
        }, // Use user's position as the origin
        destination: {
          lat: destLat, lng: destLng
        },
        travelMode: google.maps.TravelMode.DRIVING,
      };
  
      directionsService.route(request, (result, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          console.log("IN BICH");
        } else {
          console.error("Directions request failed due to " + status);
        }
      });
      console.log('rerun');
    };
  
    fetchData(); // Call the async function
  
    // Return a cleanup function if needed
    return () => {
      // Cleanup code here
    };
  }, [map, restroomData]); // Dependency array
  

  const handleDashboardReturn = () => {
    navigate(`/dashboard?latLng=${position}`);
  };

  return (
    <div className="review-page">
      <div className="header-container">
        <button className="add-review-btn" onClick={() => setAddingReview(true)}>
          Add Review
        </button>
        <div className="review-header">Restroom's information</div>
        <button onClick={handleDashboardReturn} className="go-back-btn">Dashboard</button>
      </div>
      <div className="place-details">
        <div className="place-info-container">
          <div className="place-info">
          <div className="place-name">{restroomData?.name}</div>
          <div className="place-address">Address: {restroomData?.address}</div>
          <div className="place-directions">Directions: {restroomData?.direction}</div>
          <div className="map" id="map"></div>
          </div>
      <div className="place-comments">Comments: {restroomData?.comments}</div>
      <div className="image-container">
      <img src="Comp/Reviewpage/Handicap_toliet_2.jpg" alt="Place Image" /> 
      </div>
      </div>
      </div>
      <div className="review-bar">Review</div>
      {addingReview && (
        <div className="add-review-dropdown">
          <label>Name:</label>
          <input
            type="text"
            value={newReview.reviewerName}
            onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
          />
          <label>Cleanliness:</label>
          <input
            type="range"
            min={0}
            max={5}
            value={newReview.cleanliness}
            onChange={(e) => setNewReview({ ...newReview, cleanliness: parseFloat(e.target.value) })}
          />
          <label>Amenities:</label>
          <input
            type="range"
            min={0}
            max={5}
            value={newReview.amenities}
            onChange={(e) => setNewReview({ ...newReview, amenities: parseFloat(e.target.value) })}
          />
          <label>Accessibility:</label>
          <input
            type="range"
            min={0}
            max={5}
            value={newReview.accessibility}
            onChange={(e) => setNewReview({ ...newReview, accessibility: parseFloat(e.target.value) })}
          />
          <label>Description:</label>
          <input
            type="text"
            value={newReview.description}
            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
          />
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewReview({ ...newReview, image: e.target.files ? e.target.files[0] : null })}
          />
          <button onClick={handleAddReview}>Add</button>
        </div>
      )}
      <div className = "reviews-box">
      <div className="reviews-container">
        {reviewsData.map((review, index) => (
          <div key={index} className={`review-rectangle ${calculateOverallQuality(review) <= 2.5 ? 'light-red' : 'light-green'}`}>
            <div className="reviewer-name">{review.reviewerName}</div>
            <div className="cleanliness star-rating">{`Cleanliness: ${'★'.repeat(review.cleanliness)}`}</div>
            <div className="amenities star-rating">{`Amenities: ${'★'.repeat(review.amenities)}`}</div>
            <div className="accessibility star-rating">{`Accessibility: ${'★'.repeat(review.accessibility)}`}</div>
            <div className="overall-quality">{`Overall Quality: ${calculateOverallQuality(review).toFixed(2)}/5`}</div>
            <div className="description">{review.description}</div>
            <div className="date">Date: {review.date.toLocaleDateString()}</div>
            {review.image && (
              <div className="photo">
                <img src={URL.createObjectURL(review.image)} alt="Review" />
              </div>
            )}
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}

export default ReviewPage;