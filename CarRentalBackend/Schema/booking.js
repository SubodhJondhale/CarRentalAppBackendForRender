const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingDataSchema = new Schema({
  images: {type: String},
  carName: {type: String},
  carType: {type: String},
  model: {type: String},
  startDate: {type: Date},
  endDate: {type: Date},
  description: {type: String},
  bookingDate:{type:String},
  bookingTime:{type:String},
  carDetails: {type: String},
  User_id:{type: String},
  origin:{type: String},
  destination:{type: String},
  description:{type:String}
});

const BookingModel = mongoose.model('Bookings', bookingDataSchema);

module.exports = BookingModel;
