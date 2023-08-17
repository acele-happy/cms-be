const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.loginUsers = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    const passwordMatch = await User.findOne({ password });

    if (!user) {
      return res.status(400).json({
        message: "Invalid Login Credentials",
      });
    }

  

    if (user.password !== password) {
      return res.status(400).json({
           message: 'Invalid Login credentials'
          });
    }
    
     
    // cp
     if (user.role === 'CP') {

      const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRETE_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: `Welcome ${user.role}`,
        token: token,
      });

    }

    // Teacher
     if (user.role === 'LECTURER') {

    const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRETE_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: `Welcome ${user.role}`,
        token: token,
      });
    }

    // ACADEMICS
      if (user.role === 'ACADEMICS') {

     const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRETE_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: `Welcome ${user.role}`,
        token: token,
      });
    }

    // HOD
     if (user.role === 'HOD') {

     const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.SECRETE_KEY,
      { expiresIn: '1h' }
    );

    return res.status(200).json({
      message: `Welcome ${user.role}`,
      token: token,
    });

    }

    // FINANCE
      if (user.role === 'FINANCE') {

     const token = jwt.sign(
        { userId: user._id, role: user.role },
        process.env.SECRETE_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        message: `Welcome ${user.role}`,
        token: token,
      });

    }
  } catch (err) {
    return res.status(500).send(err);
  }
};
