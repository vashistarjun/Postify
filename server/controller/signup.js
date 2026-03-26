const bcyrpt = require('bcrypt')
const User= require('../model/user')

exports.signup=async (req,res)=> {
    try {
        const { name, email, password, AuthType } = req.body
        
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "user already exist",
                "success":false
            })
        }
        let newUser;
        try {
            if (password) {
                const hashpassword = await bcyrpt.hash(password, 10);
                 newUser = await User.create({
                    email,
                    name,
                    password: hashpassword,
                    AuthType: "local",
                    isVerified: true
                })
            }
            else {
                 newUser = await User.create({
                    email,
                    AuthType: "otp",
                    isVerified:true
                })
            }
            return res.status(201).json({
                message: "user created succesffully",
                success:true
            })
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message:"user failed to enter"
            })
        }
        
    } catch (error) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}