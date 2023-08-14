const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const teacherRoutes = require('./routes/userRoutes')
require('dotenv').config()
require('./models/dbConnect')

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(teacherRoutes)

app.listen(process.env.PORT,()=>console.log('Connected to port 4040'))