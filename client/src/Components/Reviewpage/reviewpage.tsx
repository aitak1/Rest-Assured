import React from 'react';
import './reviewpage.css';

interface ReviewProps {
  sellerName: string;
  stars: number;
  reviewDescription: string;
}

const Review: React.FC<ReviewProps> = ({ sellerName, stars, reviewDescription }) => {
  return (
    <div className="review-container">
      <div>Seller: {sellerName}</div>
      <div>Stars: {stars}</div>
      <div>Review: {reviewDescription}</div>
    </div>
  );
};

const ReviewContainer: React.FC = () => {
  const reviews = [
    { sellerName: 'John Doe', stars: 4, reviewDescription: 'Great experience!' },
  ];

  return (
    <div className="review-page-container">
      {reviews.map((review, index) => (
        <Review
          key={index}
          sellerName={review.sellerName}
          stars={review.stars}
          reviewDescription={review.reviewDescription}
        />
      ))}
    </div>
  );
};

export default ReviewContainer;