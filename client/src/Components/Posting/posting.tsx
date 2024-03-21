//posting.tsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./posting.css"; // Ensure this path is correct and the styles are similar to SignUp.css

function Posting() {
  const navigate = useNavigate();

  // Extending the state to include new fields
  const [saleDetails, setSaleDetails] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    name: "", // Optional
    address: "",
    image: [], // To hold multiple images
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handling file separately to store the file object
    if (name === "image") {
      setSaleDetails((prevDetails) => ({
        ...prevDetails,
        [name]: e.target.files[0],
      }));
    } else {
      setSaleDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(saleDetails);
    navigate("/dashboard"); // Navigate back or to another route on successful submission
  };

  return (
    <div className="page">
      <div className="topnav">
        <Link to="/dashboard" className="back-to-dashboard-link">
          Back To Dashboard
        </Link>
        <div className="posting-name"> Add Restroom </div>
      </div>
      <form onSubmit={handleSubmit} className="posting-form">
        {/* Existing and additional fields */}
        <div className="form-group">
          <label>Optional Name:</label>
          <input
            type="text"
            name="name"
            value={saleDetails.name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={saleDetails.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Start Time:</label>
          <input
            type="time"
            name="startTime"
            value={saleDetails.startTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>End Time:</label>
          <input
            type="time"
            name="endTime"
            value={saleDetails.endTime}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            value={saleDetails.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={saleDetails.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Image (Optional):</label>
          <input type="file" name="image" onChange={handleChange} />
        </div>
        <button type="submit" className="submit-button">
          Submit Post
        </button>
      </form>
    </div>
  );
}

export default Posting;
