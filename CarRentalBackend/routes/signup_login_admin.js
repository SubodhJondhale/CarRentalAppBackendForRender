const bodyParser = require("body-parser");
const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const SECRET_ID = "j";

// @desc    Register new user
// @route   POST /api/users
// @access  Public
//admin model

const AdminModel = require("../Schema/admin")


//middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
const router = express.Router();


//routes for signup
router.post("/admin/signup", async (req, res) => {
  const { Name, Email, Password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(Password, saltRounds);
    const user = await AdminModel.create({
      Name: Name,
      Email: Email,
      Password: hashedPassword,
    });
    res.send("user stored");
  } catch (error) {
    console.log(error);
    res.send("error in hashing");
  }
})


// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public


router.post("/admin/login", async(req, res) => {
    const { Email, Password } = req.body;
    const user = await AdminModel.findOne({ Email });
    if (!user) {
        return res.status(401).send("Invalid Email or Password");
    }
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
        return res.status(401).send("Invalid Email or Password");
    }
    const token  = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60*60),
        data: {unique_id:user._id,Name:user.Name}
      }, SECRET_ID);
      
      res.status(200).json({
        status : "SUCESS",
        token : token
      })
});


module.exports = router