const mongoose = require('mongoose')

const notificationSchema = mongoose.Schema({
    from:{
        type: mongoose.Types.ObjectId,
        ref:'User',
        required: true
    },
    to:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type: String,
        required: true
    },
    state:{
        type: String,
        enum: ["READ","NOTREAD"],
        default: "NOTREAD"
    },
    date:{
        type: Date,
        default: Date.now()
    },
    cp:{
        type:String,
        enum:['Pending','Approved'],
        default:'Pending'
    },
    hod:{
        type:String,
        enum:['Pending','Approved'],
        default:'Pending'
    },
    academic:{
        type:String,
        enum:['Pending','Approved'],
        default:'Pending'
    },
    finance:{
        type:String,
        enum:['Pending','Approved'], 
        default:'Pending'
    }
})

const Notification = new mongoose.model('Notification',notificationSchema)
module.exports = Notification