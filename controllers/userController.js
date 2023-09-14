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

exports.countUsers = async(req,res)=>{
    try{
        const count = await User.count()
        return res.status(200).send(`${count}`) 
    }catch(err){
        console.log(err)
        return res.status(500).send(err)
    }
}

exports.manageRequests = async(req,res)=>{
    try{
        const userId = req.params.id.split(":")[1]
        const user = await User.findOne({_id:userId})
        const notificationIds = user.notifications
        let notifications=[]



        for(const notificationId of notificationIds){
            const notification = await Notification.findOne({_id: notificationId}).lean()
            if(notification){
                notifications.push({from: notification.from, message: notification.content,date: notification.date,hod: notification.hod,cp:notification.cp,academic:notification.academic,finance:notification.finance,id:notification._id})
            }
        }
        
        let users = []
        for(const notificationPiece of notifications){
            const user = await User.findOne({_id: notificationPiece.from}).lean()
            if(user){
            users.push({names: user.fullName, email: user.email, message: notificationPiece.message,phoneNumber: user.phoneNumber, date: notificationPiece.date ,cp:notificationPiece.cp,hod:notificationPiece.hod,academic:notificationPiece.academic,finance:notificationPiece.finance,notId:notificationPiece.id})
            }
        }
        return res.status(200).send(users)
    }catch(err){ 
        console.log(err)
        return res.status(500).send(err)
    }
}