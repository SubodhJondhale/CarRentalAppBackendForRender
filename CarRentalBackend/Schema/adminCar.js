const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminCarSchema = new Schema({
  carName: {type: String,required: true,},
  carType: {type: String,required: true,},
  model: {type: String,required: true,},
  mileage: {type: String,required: true,},
  perKm: {type: Number,required: true,},
  availableFrom: {type: Date},
  availableTo: {type: Date},
  description: {type: String,required: true,},
  images: {type: [String]},
  carDetails: {type: String},
  Admin_id:{type: String}
});

const AdminCarModel = mongoose.model("Cars", adminCarSchema);

module.exports = AdminCarModel;
