const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const fileupload = require("express-fileupload");
const path = require("path");

//files imported
const userLoginSignup = require("./routes/signup_login_user");
const adminLoginSignup = require("./routes/signup_login_admin");
const testAdminData = require("./routes/testAdminData");
const UserCarDisply = require("./routes/userCarDisply");
const userCarBooking = require("./routes/user_car_booking")
const myBooking = require("./routes/myBooking")



const app = express();



//port
const SERVER_PORT = process.env.PORT || 8080;
const DB =
  "mongodb+srv://CarRental:CarRental@carrental.q7afrjf.mongodb.net/?retryWrites=true&w=majority";

//middle ware
app.use(bodyParser.json());
app.use(cors());
app.use(fileupload());



//connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("connected to mongoose atlas");
  })
  .catch((err) => {
    console.log(err, "no connection");
  });

//routes
app.use("/car_rent", userLoginSignup);
app.use("/car_rent", adminLoginSignup);
app.use("/car_rent", testAdminData);
app.use("/car_rent", UserCarDisply);
app.use("/car_rent",userCarBooking);
app.use("/car_rent",myBooking)
//server
app.listen(SERVER_PORT, (req, res) => {
  console.log(`server started ${SERVER_PORT}`);
});