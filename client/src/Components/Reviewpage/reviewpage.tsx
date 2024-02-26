import React, { useState } from "react";
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
    { customerName: "User 1", cleanliness: 8, amenities: 7, accessibility: 9, description: "Very Clean bathroom!", image: null, date: new Date() },
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

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Review) => {
    const newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
    setNewReview({ ...newReview, [field]: newValue });
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
        <div className="review-header">Restroom's Reviews</div>
      </div>
      {addingReview && (
        <div className="add-review-dropdown">
          <label>Name:</label>
          <input
            type="text"
            value={newReview.customerName}
            onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
          />
          <label>Cleanliness out of 10:</label>
          <input
            type="number"
            value={newReview.cleanliness}
            onChange={(e) => handleNumberChange(e, 'cleanliness')}
          />
          <label>Amenities out of 10:</label>
          <input
            type="number"
            value={newReview.amenities}
            onChange={(e) => handleNumberChange(e, 'amenities')}
          />
          <label>Accessibility out of 10:</label>
          <input
            type="number"
            value={newReview.accessibility}
            onChange={(e) => handleNumberChange(e, 'accessibility')}
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
      <div className="reviews-container">
        {reviewsData.map((review, index) => (
          <div key={index} className={`review-rectangle ${calculateOverallQuality(review) <= 5 ? 'light-red' : 'light-green'}`}>
            <div className="customer-name">{review.customerName}</div>
            <div className="cleanliness">{`Cleanliness: ${review.cleanliness}/10`}</div>
            <div className="amenities">{`Amenities: ${review.amenities}/10`}</div>
            <div className="accessibility">{`Accessibility: ${review.accessibility}/10`}</div>
            <div className="overall-quality">{`Overall Quality: ${calculateOverallQuality(review).toFixed(2)}/10`}</div>
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
  );
}

export default ReviewPage;
