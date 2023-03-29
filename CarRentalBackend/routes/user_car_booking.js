const bodyParser = require("body-parser");
const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SECRET_ID = "j";
const path = require("path");
const jwt = require("jsonwebtoken");

const app = express();

const router = express.Router();

//schema import
const UserModel = require("../Schema/user");
const BookingModel = require("../Schema/booking");
const CarModel = require("../Schema/adminCar");

//middleware
app.use(express.json());
app.use(cors());
app.use(fileupload());
app.use(bodyParser.json());

router.post("/userCarDisplay/userCarBooking", async (req, res) => {
  try {
    const {
      userCarIDS,
      startDate,
      endDate,
      origin,
      destination,
      bookingDate,
      bookingTime,
    } = req.body;
    const token = req.headers.authorization.split("Bearer")[1];
    const decoded = jwt.verify(token, SECRET_ID);
    // console.log(req.body)
    const CarData = await CarModel.findOne({ _id: userCarIDS });
    const User_data = await UserModel.findOne({ _id: decoded.data.unique_id });
    const bookObj = await BookingModel.create({
      images: CarData.images[0],
      carName: CarData.carName,
      carType: CarData.carType,
      model: CarData.model,
      startDate: startDate,
      endDate: endDate,
      description: CarData.description,
      bookingDate: bookingDate,
      bookingTime: bookingTime,
      carDetails: CarData.carDetails,
      User_id: User_data._id,
      origin: origin,
      destination: destination,
    });
    console.log(bookObj, "objfinal");
    User_data.Booking.push(userCarIDS);
    await User_data.save();
    res.send(bookObj);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});
router.get(
  "/userCarDisplay/userCarBooking/images/:filename",
  async (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", `/imageUpload/${req.params.filename}`)
    );
  }
);

module.exports = router;
