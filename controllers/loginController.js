const User  = require('../models/User')

exports.loginUsers = async(req,res)=>{

 
   try {
    
   const {email,password } = req.body;

    const user = await User.findOne({ email });
    const passwordMatch= await User.findOne({password});

    if (!email || !password) {
        return res.status(401).json({
          message: 'Please provide both email and password',
        });
      }

       if (!user) {
        return res.status(400).json({
          message: "Invalid Login Credentials"
        });
      }

        if (!passwordMatch) {
        return res.status(400).json({
             message: 'Invalid Login credentials' 
            });
      }
       
      // cp
       if (user.role === 'CP') {
        return res.status(200).json({
          message:
            'welcome CP',
        });
      }

      // Teacher
       if (user.role === 'TEACHER') {
        return res.status(200).json({
          message:
            'welcome TEACHER',
        });
      }

       // ACADEMICS
        if (user.role === 'ACADEMICS') {
        return res.status(200).json({
          message:
            'welcome ACADEMICS',
        });
      }

        // HOD
         if (user.role === 'HOD') {
          return res.status(200).json({
            message:
              'welcome HOD',
          });
        }

          // FINANCE
        if (user.role === 'FINANCE') {
        return res.status(200).json({
          message:
            'welcome FINANCE',
        });
      }

     
    }
   catch(err){
    return res.status(500).send(err)
   }

}