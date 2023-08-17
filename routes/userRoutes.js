const express = require('express')
const router = express.Router()
const {getAllUsers,registerUser,getRoleByEmail,deleteUser} = require('../controllers/userController')
const {loginUsers} = require('../controllers/loginController')
const {claimSalary} = require('../controllers/salaryController')

router.get('/user/getAllUsers',getAllUsers)
router.post('/user/register',registerUser)
router.get('/user/getRole',getRoleByEmail)
router.delete('/user/delete/:id',deleteUser)
router.post('/user/login',loginUsers)
router.post('/user/claimSalary/:id',claimSalary)


module.exports = router