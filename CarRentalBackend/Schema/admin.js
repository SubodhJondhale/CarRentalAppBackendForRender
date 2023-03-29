const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminDataSchema = new Schema({
  Name: { type: String, required: true },
  Email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/},
  Password: { type: String, required: true }
});

const AdminModel = mongoose.model('Admins',adminDataSchema);

module.exports = AdminModel;
