const User = require('../models/User')
const Notification = require('../models/Notification')
const {sendEmail} = require('../utils/emailConfig')

//teacher claiming salary
exports.claimSalary = async(req,res)=>{
  try{
    const teacherId = req.params.id.split(':')[1]
    const teacher = await User.findOne({ _id: teacherId })

    if (!teacher) {
      return res.status(404).send("Teacher not found");
    }
    const course = teacher.course
    const department = teacher.department;
    const content = req.body.message
    const CP = await User.findOne({department:department,role:"CP",course:course})
    const HOD = await User.findOne({department:department,role:'HOD'})
    const academic = await User.findOne({role:"ACADEMICS"})
    const finance = await User.findOne({role:"FINANCE"})
    
    
    const notification = await Notification.findOne({from: teacherId,state:"NOTREAD"})
    if(notification){
      return res.status(400).send("You can't send request when you have another which is not approved yet!")
    }

    const CPNotification = await new Notification({
        from: teacherId,
        to: CP._id,
        content:content
    }) 
    
    const savedNotification = await CPNotification.save();
    const updatedUser = await User.findByIdAndUpdate(
        CP._id,
        { $push: { notifications: savedNotification._id } },
        { new: true }
      );

      await User.findByIdAndUpdate(
        HOD._id,
        {$push:{notifications: savedNotification._id}}
      )

      await User.findByIdAndUpdate(
        academic._id,
        {$push:{notifications: savedNotification._id}}
      )

      await User.findByIdAndUpdate(
        finance._id,
        {$push:{notifications: savedNotification._id}}
      )

      await User.findByIdAndUpdate(
        teacher._id,
        {$push:{notifications: savedNotification._id}}
      )
    //   console.log('Updated user:', updatedUser);
      return res.status(201).send("Request sent!!")
    } catch (error) {
      console.log(error)
      return res.status(500).send(error);
    }

}

exports.confirmPaymentCP = async(req,res)=>{
  try{

    const notId = req.params.id.split(':')[1]

    const notification = await Notification.findByIdAndUpdate(notId,{cp:"Approved"},{new:true})
    if(!notification){
      return res.status(404).send("Notification doesnt exist")
    }

    return res.status(200).send("Approved")
  }catch(err){
    return res.status(500).send(err)
  }
}


exports.confirmPaymentHOD = async(req,res)=>{
   try{
    const notId = req.params.id.split(':')[1]
    const check = await Notification.findOne({_id:notId})

    if(check.cp==="Approved"){
    const notification = await Notification.findByIdAndUpdate(notId,{hod:"Approved"},{new:true})
    if(!notification){
      return res.status(404).send("Notification doesnt exist")
    }

    return res.status(200).send("Approved")
  }else{
    return res.status(400).send("CP has to approve first")
  }
    }catch(err){
        return res.status(500).send(err)
    }
}


exports.confirmPaymentAcademic = async(req,res)=>{
  try{ 
    const notId = req.params.id.split(':')[1]
    const check = await Notification.findOne({_id:notId})

    if(check.cp==="Approved"&& check.hod==="Approved"){

    const notification = await Notification.findByIdAndUpdate(notId,{academic:"Approved"},{new:true})
    if(!notification){
      return res.status(404).send("Notification doesnt exist")
    }

    return res.status(200).send("Approved")
  }else{
    return res.status(400).send("HOD has to approve first!")
  }
  }catch(err){
      return res.status(500).send(err)
  }
}

exports.confirmPaymentFinance = async(req,res)=>{
  try{
    const notId = req.params.id.split(':')[1]

    const check = await Notification.findOne({_id:notId})

    if(check.cp === "Approved" && check.hod==="Approved" && check.academic==="Approved"){

    const notification = await Notification.findByIdAndUpdate(notId,{finance:"Approved"},{new:true})
    if(!notification){
      return res.status(404).send("Notification doesnt exist")
    }
    const not = await Notification.findOne({_id:notId})
    const lecturer = await User.findOne({_id:not.from})

      sendEmail(lecturer.email,
        "Payment Confirmation", `<h4>Dear Sir/Madam</h1> 
        <p>I hope this email finds you well. I am writing to inform you that the payment you were
        expecting has been successfully deposited into your account
        Payment Amount:
        ${lecturer.salary} Rwf</p> 
        <p>Please feel free to check your account balance to verify the funds have been credited
         accordingly. If you have any questions or require further assistance, please do not hesitate to 
         reach out to our customer support team at +243 998 876 598.

        Thank you for your prompt attention to this matter. We appreciate your
        business and look forward to serving you in the future.</p> ,
        <p> Best regards,

        ISTM -GOMA
        +243 998 876 598<p/>`)
      
      await Notification.findByIdAndUpdate(notId,{state:"READ"},{new:true})
      return res.status(200).send("Approved")  
  }else{
    return res.status(400).send("Academic has to Approve First!")
  }
  }catch(err){
      return res.status(500).send(err)
  } 
} 