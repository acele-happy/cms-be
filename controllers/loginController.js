const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.loginUsers = async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    console.log(user)
    if (user.password == password) {
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.SECRETE_KEY
      );
      return res.status(200).send({ token: token, role: user.role }); 
    }

    return res.status(401).send("Invalid email or password");
   
  } catch (err) {
    return res.status(500).send(err);
  }
};
