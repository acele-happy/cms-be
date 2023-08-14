const express = require('express')
const router = express.Router()
const {getAllTeachers,registerTeacher} = require('../controllers/teacherController')

router.get('/teacher/getAllTeachers',getAllTeachers)
router.post('/teacher/register',registerTeacher)

module.exports = router