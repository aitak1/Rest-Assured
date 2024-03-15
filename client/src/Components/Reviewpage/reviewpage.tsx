import React, { useState } from "react";
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../../Translations/language-selector';
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

  const {t} = useTranslation();

  return (
    <div className="review-page">
      <div className="header-container">
        <button className="add-review-btn" onClick={() => setAddingReview(true)}>
        {t("global.addreviews.addreview")}
        </button>
        <div className="review-header">{t("global.reviews.title")}</div>
      </div>
      {addingReview && (
        <div className="add-review-dropdown">
          <label>{t("global.addreviews.name")}</label>
          <input
            type="text"
            value={newReview.customerName}
            onChange={(e) => setNewReview({ ...newReview, customerName: e.target.value })}
          />
          <label>{t("global.addreviews.cleanliness")}</label>
          <input
            type="number"
            value={newReview.cleanliness}
            onChange={(e) => handleNumberChange(e, 'cleanliness')}
          />
          <label>{t("global.addreviews.amenities")}</label>
          <input
            type="number"
            value={newReview.amenities}
            onChange={(e) => handleNumberChange(e, 'amenities')}
          />
          <label>{t("global.addreviews.accessibility")}</label>
          <input
            type="number"
            value={newReview.accessibility}
            onChange={(e) => handleNumberChange(e, 'accessibility')}
          />
          <label>{t("global.addreviews.description")}</label>
          <input
            type="text"
            value={newReview.description}
            onChange={(e) => setNewReview({ ...newReview, description: e.target.value })}
          />
          <label>{t("global.addreviews.image")}</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewReview({ ...newReview, image: e.target.files ? e.target.files[0] : null })}
          />
          <button onClick={handleAddReview}>{t("global.addreviews.add")}</button>
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
