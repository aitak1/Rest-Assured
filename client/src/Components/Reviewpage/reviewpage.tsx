import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const { id } = useParams();
  const { position } = useParams();
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
          setRestroomData({
            name: data.name,
            street: data.street,
            city: data.city,
            state: data.city,
            country: data.country,
            address: data.address,
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

  return (
    <div className="review-page">
      <div className="header-container">
        <button className="add-review-btn" onClick={() => setAddingReview(true)}>
          Add Review
        </button>
        <div className="review-header">Restroom's information</div>
        <Link to="/dashboard" className="go-back-btn">Dashboard</Link>
      </div>
      <div className="place-details">
        <div className="place-info-container">
          <div className="place-info">
          <div className="place-name">{restroomData?.name}</div>
          <div className="place-address">Address: {restroomData?.address}</div>
          <div className="place-directions">Directions: {restroomData?.direction}</div>
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