const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
require('./models/dbConnect')

app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))

app.listen(process.env.PORT,()=>console.log('Connected to port 4040'))