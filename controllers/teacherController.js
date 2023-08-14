const Teacher  = require('../models/Teacher')

exports.getAllTeachers = async(req,res)=>{
    await Teacher.find({})
    .then((teachers)=>{
        return res.status(200).send(teachers)
    })
    .catch((err)=>{
        return res.status(500).send(err)
    })

}

exports.registerTeacher = async(req,res)=>{
    const teacher = req.body

    await teacher
    .save()
    .then((newteacher)=>{
        return res.status(201).send(newteacher)
    })
    .catch((err)=>{
        return res.status(500).send(err)
    })
}