const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
  },
  date : {type : Date, default : Date.now()},
  saleID: { type: mongoose.Schema.Types.ObjectId, ref: 'GarageSale', required: true },
  sellerID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;