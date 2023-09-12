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
    const CP = await User.findOne({department:department  , role:"CP",course: course})
    
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
    //   console.log('Updated user:', updatedUser);
      return res.status(201).send("Request sent!!")
    } catch (error) {
    //   console.error('Error:', error);
      return res.status(500).send(error);
    }

}

exports.confirmPaymentCP = async(req,res)=>{
  try{
    const cpId = req.params.id.split(':')[1]
    const cp = await User.findOne({_id:cpId})

    const teacherNotId = cp.notifications[cp.notifications.length - 1]
    const not = await Notification.findOne({_id: teacherNotId})
    const teacherId = not.from
    const teacher = await User.findOne({_id:teacherId})
    const department = cp.department
    // console.log(department)

    const HOD = await User.findOne({department:department  , role:"HOD"})
    // console.log(HOD)

   
        const HODNotification = await new Notification({
            from: cpId,
            to: HOD._id,
            content:`Hello HOD ${HOD.fullName.split(' ')[0]}, I just Approved The payment for Teacher ${teacher.fullName.split(' ')[0]} ,who is in my department claiming  ${teacher.salary} Rwf Salary As they finished teaching the ${teacher.course} course !${teacherId}`
        })
        
        const savedNotification = await HODNotification.save();
        const updatedUser = await User.findByIdAndUpdate(
            HOD._id,
            { $push: { notifications: savedNotification._id } },
            { new: true }
          );
        //   console.log('Updated user:', updatedUser);
          return res.status(200).send("Request sent to HOD!!")
        } catch (error) {
          console.error('Error:', error);
          return res.status(500).send(error);
        }
}


exports.confirmPaymentHOD = async(req,res)=>{
    const hodId = req.params.id.split(':')[1]
    const hod = await User.findOne({_id:hodId})
    

    const teacherNotId = hod.notifications[hod.notifications.length -1]
    const not = await Notification.findOne({_id: teacherNotId})

    const teacherId = not.content.split('!')[1]
    const teacher = await User.findOne({_id: teacherId})
    //academic
    const academic = await User.findOne({role:"ACADEMICS"})
    try{
        const academicNotification = new Notification({
            from: hodId,
            to: academic._id,
            content: `Hello Academic ${academic.fullName.split(' ')[0]}, I just Approved The payment for Teacher ${teacher.fullName.split(' ')[0]} ,who is in my department claiming  ${teacher.salary} Rwf Salary As they finished teaching the ${teacher.course} course !${teacher._id}` 
        })

        const savedNotification = await academicNotification.save()
        const updatedAcademic = await User.findByIdAndUpdate(academic._id,{$push:{notifications: savedNotification._id}}, {new: true})
        return res.status(200).json({message:"Notification sent!!"})
    }catch(err){
        return res.status(500).send(err)
    }
}


exports.confirmPaymentAcademic = async(req,res)=>{
  try{ 
  const academicId = req.params.id.split(':')[1]
  const academic = await User.findOne({_id:academicId})
  

  const teacherNotId = academic.notifications[academic.notifications.length -1]
  const not = await Notification.findOne({_id: teacherNotId})

  const teacherId = not.content.split('!')[1]
  // return res.send(teacherId)

  const teacher = await User.findOne({_id: `${teacherId}`})
  //academic
  const finance = await User.findOne({role:"FINANCE"})
  

  
      const financeNotification = new Notification({
          from: academicId,
          to: finance._id,
          content: `Hello In charge of finance ${finance.fullName.split(' ')[0]}, I just Approved The payment for Teacher ${teacher.fullName.split(' ')[0]} from HOD in their department, claiming  ${teacher.salary} Rwf Salary As they finished teaching the ${teacher.course} course !${teacher._id}`
      })

      const savedNotification = await financeNotification.save()
      const updatedAcademic = await User.findByIdAndUpdate(finance._id,{$push:{notifications: savedNotification._id}}, {new: true})
      return res.status(200).json({message:"Notification sent!!"})
  }catch(err){
      return res.status(500).send(err)
  }
}

exports.confirmPaymentFinance = async(req,res)=>{
  try{
  const financeId = req.params.id.split(':')[1]
  const finance = await User.findOne({_id:financeId})
  

  const teacherNotId = finance.notifications[finance.notifications.length -1]
  const not = await Notification.findOne({_id: teacherNotId})

  const teacherId = not.content.split('!')[1]
  // return res.send(teacherId)
  const teacher = await User.findOne({_id: teacherId})  
  
 
      const teacherNotification = new Notification({
          from: financeId,
          to: teacherId,
          content: `Hello Lecturer ${teacher.fullName.split(' ')[0]}, Your paymeny has been approved from finance you can now check your email for more details!!`
      })

      const savedNotification = await teacherNotification.save()
      const updatedTeacher = await User.findByIdAndUpdate(teacher._id,{$push:{notifications: savedNotification._id}}, {new: true})  

      sendEmail(teacher.email, "Your payment has been arrived!!",`<h1>YOUR MONTHLY SALARY HAS ARRIVED</h1> <p>fincance is here to tell you that your ${teacher.salary} Rwf has been paid to you enjoy! </p>`)
      return res.status(200).json({message:"Notification sent!!"})  
  }catch(err){
      return res.status(500).send(err)
  }
} 