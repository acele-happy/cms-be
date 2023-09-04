const User = require("../models/User");
const Notification = require("../models/Notification")

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).send(users);
    } catch (err) {
        return res.status(500).send(err);
    }
};

exports.registerUser = async (req, res) => {
    const user = req.body;

    try {
        const newUser = await new User(user).save();
        return res.status(201).send(newUser);
    } catch (err) {
        return res.status(500).send(err);
    }
};

exports.getRoleByEmail = async (req, res) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email: email });

    if (user) {
      return res.status(200).send(user.role);
    } else {
      return res.status(404).send("User not found");
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.deleteUser = async (req, res) => {
    const id = req.params.id;

    try {
        const userid = id.split(':')[1]
        const user = await User.findOneAndDelete({ _id: userid });

        if (user) {
            return res.status(200).send(user);
        } else {
            return res.status(404).send('User not found');
        }
    } catch (err) {
        return res.status(500).send(err);
    }
};

exports.pendingNotifications = async(req,res)=>{
    try{
        const userId = req.params.id.split(":")[1]
        const user = await User.findOne({_id:userId})
        const notificationsId = user.notifications
        
        const result = await Notification.find({_id: {$in: notificationsId}, state: "NOTREAD"})

        return res.status(200).send(`${result.length}`)

    }catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
} 