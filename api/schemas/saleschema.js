// garageSale.js

const mongoose = require('mongoose');

const garageSaleSchema = new mongoose.Schema({
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  coverPhoto: { type: String, required: true },
  description: { type: String },
  itemImages: [{ type: String }], // An array of strings for image URLs
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  endTime: { type: String, required: true },
  additionalInfo: { type: String },
  sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const GarageSale = mongoose.model('GarageSale', garageSaleSchema);

module.exports = GarageSale;