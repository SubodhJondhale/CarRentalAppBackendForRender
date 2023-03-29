const bodyParser = require("body-parser");
const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const app = express();
const router = express.Router();

//////schema import
const AdminCarModel = require("../Schema/adminCar");

//middleware
app.use(express.json());
app.use(cors());
app.use(fileupload());

router.get("/userCarDisplyData", async (req, res) => {
  try {
    const startDate = new Date(req.headers.startdate);
    const endDate = new Date(req.headers.enddate);

    const carBookingData = await AdminCarModel.find();
    const availableCars = carBookingData.filter((car) => {
      const start = new Date(car.availableFrom);
      const end = new Date(car.availableTo);

      return start <= endDate && end >= startDate;
    });

    console.log(availableCars);
    res.status(201).send(availableCars);
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});

router.get("/userCarDisplyData/images/:filename", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", `/imageUpload/${req.params.filename}`)
  );
});

module.exports = router;
