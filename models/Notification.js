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
    }
})

const Notification = new mongoose.model('Notification',notificationSchema)
module.exports = Notification