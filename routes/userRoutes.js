const express = require('express')
const router = express.Router()
const {getAllUsers,registerUser} = require('../controllers/userController')
const {loginUsers} = require('../controllers/loginController')

router.get('/user/getAllUsers',getAllUsers)
router.post('/user/register',registerUser)
router.post('/user/login',loginUsers)


module.exports = router