const User  = require('../models/User')

exports.getAllUsers = async(req,res)=>{
    await User.find({})
    .then((users)=>{
        return res.status(200).send(users)
    })
    .catch((err)=>{
        return res.status(500).send(err)
    })

}

exports.registerUser = async(req,res)=>{
    const user = req.body

    const newUser = await new User(user) 

    await newUser
    .save()
    .then((newUser)=>{
        return res.status(201).send(newUser)
    })
    .catch((err)=>{
        return res.status(500).send(err)
    })
}

exports.getRoleByEmail = async(req,res)=>{
    const email = req.body.email

    const user = await User.findOne({email: email})
        .then(()=>{
            return res.status(200).send(user)
        })
        .catch((err)=>{
            return res.status(500).send(err)
        })
}