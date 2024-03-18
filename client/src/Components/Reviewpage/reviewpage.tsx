import React, { useState } from "react";
import { Link } from 'react-router-dom';
import "./reviewpage.css";

interface Review {
  customerName: string;
  cleanliness: number;
  amenities: number;
  accessibility: number;
  description: string;
  image: File | null;
  date: Date; // Add date property
}

function ReviewPage() {
  const [addingReview, setAddingReview] = useState(false);
  const [newReview, setNewReview] = useState<Review>({
    customerName: "",
    cleanliness: 0,
    amenities: 0,
    accessibility: 0,
    description: "",
    image: null,
    date: new Date(), // Initialize date with current date
  });
  const [reviewsData, setReviewsData] = useState<Review[]>([
    { customerName: "User 1", cleanliness: 4, amenities: 3, accessibility: 5, description: "Very Clean bathroom!", image: null, date: new Date() },
  ]);

  const handleAddReview = () => {
    const updatedReviews = [...reviewsData, { ...newReview }];
    setReviewsData(updatedReviews);
    setNewReview({
      customerName: "",
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
          <div className="place-name">Place Name</div>
          <div className="place-address">Address: 123 Main St, City, Country</div>
          <div className="place-directions">Directions: im lost</div>
          </div>
      <div className="place-comments">Comments: This sucks.</div>
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
            value={newReview.customerName}
            onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
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
            <div className="customer-name">{review.customerName}</div>
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
