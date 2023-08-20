const {createTransport} = require('nodemailer')
require('dotenv').config()
 const EMAIL_USER = process.env.EMAIL_USER
 const EMAIL_PASS = process.env.EMAIL_PASS
 exports.sendEmail =async(to,title,description)=>{
    console.log(`inside emailConfig pass ${EMAIL_PASS} user ${EMAIL_USER}`)
    let transporter = createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    service:"gmail",
    auth:{
        user:EMAIL_USER,
        pass:EMAIL_PASS
    }
    })

    let mailOptions={
        from: EMAIL_USER,
        to:to,
        subject:title,
        html:description
    }
    console.log('heree')
    try{
        let transport = await transporter.sendMail(mailOptions)
        console.log(transport)
        return "Success" 
    }catch(e){
        console.log(e)
        return `Failure ${e}`
    }
}