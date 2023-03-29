const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userDataSchema = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  Contact: { type: Date, required: true },
  Password: { type: String, required: true },
  Booking: {type: [String]},
});

const UserModel = mongoose.model('Users', userDataSchema);

module.exports = UserModel;
