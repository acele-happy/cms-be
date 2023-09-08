const express = require('express')
const router = express.Router()
const {getAllUsers,registerUser,getRoleByEmail,deleteUser, pendingNotifications, manageRequests} = require('../controllers/userController')
const {loginUsers} = require('../controllers/loginController')
const {claimSalary,confirmPaymentCP,confirmPaymentHOD,confirmPaymentAcademic,confirmPaymentFinance} = require('../controllers/salaryController')

router.get('/user/getAllUsers',getAllUsers)
router.post('/user/register',registerUser)
router.get('/user/getRole',getRoleByEmail)
router.delete('/user/delete/:id',deleteUser)
router.post('/user/login',loginUsers)
router.post('/user/claimSalary/:id',claimSalary)
router.post('/user/confirmPaymentCP/:id',confirmPaymentCP)
router.post('/user/confirmPaymentHOD/:id',confirmPaymentHOD)
router.post('/user/confirmPaymentAcademic/:id',confirmPaymentAcademic)
router.post('/user/confirmPaymentFinance/:id',confirmPaymentFinance)
router.get('/user/pendingNotifications/:id',pendingNotifications)
router.get('/user/manageRequests/:id',manageRequests)


module.exports = router