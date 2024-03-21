import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './addRestroom.css';

function AddRestroom() {
    let navigate = useNavigate();

  const [formState, setFormState] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    country: '',
    accessible: '',
    unisex: '',
    changingTable: '',
    directions: '',
    comments: ''
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formState);
    // Add logic to handle form submission like sending data to a server or updating state
  };

  return (
    <div className="add-restroom-container">
    <form onSubmit={handleSubmit} className="add-restroom-form">
      <h2>Submit a Restroom</h2>
      <label>Name:<input type="text" name="name" value={formState.name} onChange={handleChange} required /></label>
      <label>Street:<input type="text" name="street" value={formState.street} onChange={handleChange} required /></label>
      <label>City:<input type="text" name="city" value={formState.city} onChange={handleChange} required /></label>
      <label>State:<input type="text" name="state" value={formState.state} onChange={handleChange} required /></label>
      <label>Country:<input type="text" name="country" value={formState.country} onChange={handleChange} required /></label>
      <label>Accessible:<select name="accessible" value={formState.accessible} onChange={handleChange} required>
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
      </select></label>
      <label>Unisex:<select name="unisex" value={formState.unisex} onChange={handleChange} required>
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
      </select></label>
      <label>Changing Table:<select name="changingTable" value={formState.changingTable} onChange={handleChange} required>
          <option value="">Select Option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
      </select></label>
      <label>
      Directions:
      <textarea name="directions" placeholder="Second floor in the back..., etc." onChange={handleChange}></textarea>
      </label>
      <label>
      Comment:
      <textarea name="comments" placeholder="Have to be a paying customer..., etc." onChange={handleChange}></textarea>
      </label>
        <div className="form-actions">
          <button type="submit" onClick={() => navigate('/dashboard')}>Save Restroom</button>
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddRestroom;
