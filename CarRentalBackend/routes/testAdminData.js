const bodyParser = require("body-parser");
const express = require("express");
const fileupload = require("express-fileupload");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const SECRET_ID = "j";
const jwt = require("jsonwebtoken");

const app = express();

const router = express.Router();

//////schema import
const AdminCarModel = require("../Schema/adminCar");

//middleware
app.use(express.json());
app.use(cors());
app.use(fileupload());

router.post("/adminCarData", async (req, res) => {
  const { images } = req.files;
  const {
    carName,
    carType,
    model,
    mileage,
    perKm,
    availableFrom,
    availableTo,
    description,
    carDetails,
    adminToken,
  } = req.body;
  //   console.log(images);
  var imageArray = [];

  if (typeof images === "object" && !Array.isArray(images)) {
    try {
      await images.mv("./imageUpload/" + images.name);
      imageArray.push(images.name);
    } catch (err) {
      console.log(err);
      res.send("error");
    }
  } else {
    for (let key in images) {
      const image = images[key];
      if (image && image.mv) {
        try {
          await image.mv("./imageUpload/" + image.name);
          imageArray.push(image.name);
        } catch (err) {
          console.log(err);
          res.send(err);
        }
      }
    }
  }

  /////decoding token///////////
  const decoded = jwt.verify(req.body.adminToken, SECRET_ID);
  // console.log(decoded.data,"decoded");

  //////unique id for admin///////
  const adminCar = await AdminCarModel.create({
    carName: carName,
    carType: carType,
    model: model,
    mileage: mileage,
    perKm: perKm,
    availableFrom: availableFrom,
    availableTo: availableTo,
    description: description,
    images: imageArray,
    carDetails: carDetails,
    Admin_id: decoded.data.unique_id,
  });
});

//////router get for displaying admin cars////

router.get("/adminCarData", async (req, res) => {
  try {
    console.log(req.headers.authorization, "autherization");
    const token = req.headers.authorization.split("Bearer")[1];
    console.log(token, "token");
    const decoded = jwt.verify(token, SECRET_ID);
    console.log(decoded.data, "decodedData");
    const uniqueId = decoded.data.unique_id;
    const name = decoded.data.Name;
    const carBookingData = await AdminCarModel.find({ Admin_id: uniqueId });
    console.log(carBookingData);
    res.status(201).send({ carBookingData, name });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error fetching data");
  }
});

////////////image send////////

router.get("/adminCarData/images/:filename", async (req, res) => {
  res.sendFile(
    path.join(__dirname, "..", `/imageUpload/${req.params.filename}`)
  );
});

/////////put request//////
router.put("/adminCarData/Edit", async (req, res) => {
  const {
    uid,
    carName,
    carType,
    model,
    mileage,
    perKm,
    availableFrom,
    availableTo,
    description,
    carDetails,
  } = req.body;

  try {
    const putData = await AdminCarModel.findOneAndUpdate(
      { _id: uid },
      {
        carName,
        carType,
        model,
        mileage,
        perKm,
        availableFrom,
        availableTo,
        description,
        carDetails,
      },
      { new: true }
    );

    res.json(putData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.delete("/adminCarData/Delete", async (req, res) => {
  const uid = req.body.uid;
  try {
    const deletedCar = await AdminCarModel.findByIdAndDelete(uid);
    if (!deletedCar) {
      return res.status(404).send("Car not found");
    }
    res.send("Car deleted successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
