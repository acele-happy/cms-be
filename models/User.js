const mongoose = require("mongoose");
const Notification = require("../models/Notification");

const userSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    minlength: 10,
    maxlength: 10,
  },
  password: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    enum: ["ADVANCED OOP WITH JAVA", "FINANCE", "POLITICAL SCIENCE"],
  },
  startingDate: {
    type: Date,
    default: Date.now(),
  },
  salary: {
    type: Number,
  },
  role: {
    type: String,
    enum: ["ACADEMICS", "TEACHER", "HOD", "CP", "FINANCE"],
    required: true,
  },
  //this could be the charge of CP or charge of HOD depending on role of the user
  department: {
    type: String,
    enum: ["IT", "MANAGEMENT", "POLITICS"],
  },
  notifications: {
    type: [Object],
    ref: 'Notification'
}
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
