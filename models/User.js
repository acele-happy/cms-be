const mongoose = require('mongoose')

const teacherSchema = mongoose.Schema({
    fullName :{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: String,
        minlength: 10,
        maxlength: 10
    },
    password:{
        type: String,
        required: true
    },
    course:{
        type: String,
        enum:['ECONOMICS','MATHEMATICS','ENGINEERING','CONSTRUCTION'],
        required:true
    },
    startingDate:{
        type: Date,
        default: Date.now()
    },
    salary:{
        type: Number,
        required: true
    },
    role:{
        type: String,
        enum:['ACADEMICS','TEACHER','HOD','CP','FINANCE'],
        required: true
    }
})

const Teacher = new mongoose.model('Teacher',teacherSchema)
module.exports = Teacher