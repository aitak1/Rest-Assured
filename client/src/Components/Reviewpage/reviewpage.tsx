// Import necessary React components and styles if needed
import React, { useState } from "react";
import "./reviewpage.css"; // Make sure to create a corresponding CSS file

function ReviewPage() {
  const [addingReview, setAddingReview] = useState(false);
  const [newReview, setNewReview] = useState({
    customerName: "",
    stars: 0,
    description: "",
  });

  // Dummy data for reviews (replace with actual data from your backend)
  const [reviewsData, setReviewsData] = useState([
    { customerName: "Customer 1", stars: 4, description: "Great service!" },
    { customerName: "Customer 2", stars: 5, description: "Excellent products!" },
    { customerName: "Customer 3", stars: 3, description: "Average experience." },
    // Add more reviews as needed
  ]);

  const handleAddReview = () => {
    // Add validation logic if needed
    const updatedReviews = [...reviewsData, { ...newReview }];
    // Add logic to save the review to your backend if needed

    // Update reviewsData state with the new review
    setReviewsData(updatedReviews);

    // Reset state after adding the review
    setNewReview({
      customerName: "",
      stars: 0,
      description: "",
    });
    setAddingReview(false);
  };

  return (
    <div className="review-page">
      <div className="header-container">
        <button className="add-review-btn" onClick={() => setAddingReview(true)}>
          Add Review
        </button>
        <div className="review-header">Seller-Name's Reviews</div>
      </div>
      {addingReview && (
        <div className="add-review-dropdown">
          <label>Name:</label>
          <input
            type="text"
            value={newReview.customerName}
            onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
          />
          <label>Stars:</label>
          <input
            type="number"
            value={newReview.stars}
            onChange={(e) => setNewReview({ ...newReview, stars: Number(e.target.value) })}
          />
          <label>Description:</label>
          <input
            type="text"
            value={newReview.description}
            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
          />
          <button onClick={handleAddReview}>Add</button>
        </div>
      )}
      <div className="reviews-container">
        {reviewsData.map((review, index) => (
          <div key={index} className="review-rectangle">
            <div className="customer-name">{review.customerName}</div>
            <div className="stars">{`${review.stars}/5 stars`}</div>
            <div className="description">{review.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewPage;
