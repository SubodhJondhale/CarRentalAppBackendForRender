const bodyParser = require("body-parser");
const express = require("express");
const jwt = require('jsonwebtoken');
const cors = require('cors')
const bcrypt = require("bcrypt");
const saltRounds = 10;
const SECRET_ID = "j";

//schema import
const userModel = require("../Schema/user")

//middleware
const app = express();
app.use(bodyParser.json());
app.use(cors());
const router = express.Router();


//routes for signup
router.post("/user/signup", async (req, res) => {
    const { Name, Email,Contact, Password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(Password, saltRounds);
      const user = await userModel.create({
        Name: Name,
        Email: Email,
        Contact:Contact,
        Password: hashedPassword,
      });
      res.send("user stored");
    } catch (error) {
      console.log(error);
      res.send("error in hashing");
    }
  });


//routes for signup
router.post("/user/login", async(req, res) => {
    const { Email, Password } = req.body;

    const user = await userModel.findOne({ Email });
    
    if (!user) {
        return res.status(401).send("Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(Password, user.Password);
    if (!isPasswordValid) {
        return res.status(401).send("Invalid email or password");
    }
    const token  = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60*60),
      data: {Email :userModel.Email,name :userModel.Name,unique_id:user._id}
    }, SECRET_ID);
    res.status(200).json({
      status : "SUCESS",
      token : token
    })
});


//just to check
// router.get("/login", ((req,res)=>{
//   res.send("world")
// }))

module.exports = router;