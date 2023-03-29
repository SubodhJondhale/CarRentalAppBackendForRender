const bodyParser = require("body-parser");
const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SECRET_ID = "j";
const jwt = require("jsonwebtoken");
const path = require("path");

const app = express();

const router = express.Router();

//schema import
const AdminCarModel = require("../Schema/adminCar");
const UserModel = require("../Schema/user");
const BookingModel = require("../Schema/booking");

//middleware
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(bodyParser.json());

router.get("/myBooking", async (req, res) => {
  console.log(req.headers.authorization);

  try {
    const token = req.headers.authorization.split("Bearer")[1];
    const decoded = jwt.verify(token, SECRET_ID);
    const User_data = await UserModel.findOne({ _id: decoded.data.unique_id });
    const carsDetail = await BookingModel.find({
      User_id: decoded.data.unique_id,
    });
    res.status(200).send(carsDetail);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});
///////////imageDisplay/////
router.get("/myBooking/images/:filename", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", `/imageUpload/${req.params.filename}`)
  );
});

/////delete////////
router.delete("/userBooking/Delete", async (req, res) => {
  const delId = req.body.cancelId;
  console.log(delId);

  try {
    const deletedBooking = await BookingModel.findByIdAndDelete(delId);
    console.log(deletedBooking);
    if (!deletedBooking) {
      return res.status(404).send("Car not found");
    }
    res.send("Car deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

/////////////////////////////edit booking///////
router.get("/myBooking/editdataDisplay", async (req, res) => {
  const uniqueEditId = req.query.unique_key;
  try {
    const editData_data = await BookingModel.findOne({ _id: uniqueEditId });
    console.log(editData_data);
    res.status(200).send(editData_data);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});

router.put("/userId/Editdata", async (req, res) => {
  console.log(req.body._id);
  console.log(req.body, "reqbody");
  const uniqueUpdateId = req.body._id;
  const newuserdata = req.body;
  const putData = await BookingModel.findOneAndUpdate(
    { _id: uniqueUpdateId },
    newuserdata,
    { new: true }
  );

  res.send(putData);
});

module.exports = router;
