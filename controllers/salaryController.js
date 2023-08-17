const User = require('../models/User')
const Notification = require('../models/Notification')

exports.claimSalary = async(req,res)=>{

    const teacherId = req.params.id.split(':')[1]
    const teacher = await User.findOne({_id: teacherId})
    const course = teacher.course
    let department;
    if(course == "POLITICAL SCIENCE"){
         department = "POLITICS"
    }else if(course == "FINANCE"){
        department="MANAGEMENT"
    }else if(course =="ADVANCED OOP WITH JAVA"){
        department= "IT"
    }

    const CP = await User.findOne({department:department  , role:"CP"})
    console.log(CP)
    try{
    const CPNotification = await new Notification({
        from: teacherId,
        to: CP._id,
        content:`Greetings CP ${CP.fullName.split(' ')[0]}, I would like to remind you that the course I was in charge has been finished and would like to claim the Salary for this course. Thank you!!`
    })
    
    const savedNotification = await CPNotification.save();
    const updatedUser = await User.findByIdAndUpdate(
        CP._id,
        { $push: { notifications: savedNotification._id } },
        { new: true }
      );
    //   console.log('Updated user:', updatedUser);
      return res.status(204).send(updatedUser)
    } catch (error) {
    //   console.error('Error:', error);
      return res.status(500).send(error);
    }

}