const express = require('express')
const router = express.Router()
const {getAllUsers,registerUser} = require('../controllers/userController')

router.get('/user/getAllUsers',getAllUsers)
router.post('/user/register',registerUser)

module.exports = router