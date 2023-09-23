const User = require('../models/User')
const Notification = require('../models/Notification')
const {sendEmail} = require('../utils/emailConfig')

//teacher claiming salary
exports.claimSalary = async(req,res)=>{
  try{
    const teacherId = req.params.id.split(':')[1]
    const teacher = await User.findOne({_id: teacherId})
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

      sendEmail(lecturer.email, "Your payment has been arrived!!",`<h1>YOUR MONTHLY SALARY HAS ARRIVED</h1> <p>fincance is here to tell you that your ${lecturer.salary} Rwf has been paid to you enjoy! </p>`)
      await Notification.findByIdAndUpdate(notId,{state:"READ"},{new:true})
      return res.status(200).send("Approved")  
  }else{
    return res.status(400).send("Academic has to Approve First!")
  }
  }catch(err){
      return res.status(500).send(err)
  } 
} 