const crypto = require('crypto');
const nodemailer = require('nodemailer')
const User = require('../model/user')
const redis=require('../config/redis')
const dotenv= require('dotenv').config()

exports.generateOTP = async(req,res) => {

    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email required" });
        }
        const createUser = await User.findOne({ email })
        // if (createUser) {
        //     return res.status(400).json({
        //         message: "email already exist",
        //         success: false
        //     })
        // }
        const otp = crypto.randomInt(100000, 999999).toString();

        await redis.set(`otp${email}`, otp, `Ex`, 5 * 60);

        const transpoter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
        });
         transpoter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject: "your otp is",
            text:`your otp is ${otp}`

        })
        console.log(`OTP for ${email}: ${otp}`); // For testing purposes only, remove in production
        res.json({ success: true, message: "OTP sent successfully" });
       
      
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
           
            success: false,
            message:"server error"
        })
    }

}

exports.verifyOTP = async (req,res,next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.statsu(400).json({
                message: "all filled are required",
                success:false
            })
        }
        const storedOtp = await redis.get(`otp${email}`)
        if (!storedOtp) {
            return res.status(400).json({
                sucess: false,
                message:"retry otp expired"
          })
        }
        if (storedOtp !== otp) {
            return res.status(401).json({
                success: false,
                message: "otp is invalid"
            })
        }
        await redis.del(`otp${email}`);
        next();

    } catch (err) {
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}

