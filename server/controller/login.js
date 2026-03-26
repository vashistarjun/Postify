const jwt = require("jsonwebtoken");
const User = require("../model/user");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        // 🔹 LOCAL LOGIN (password)
        if (user.authType === "local") {

            if (!password) {
                return res.status(400).json({
                    success: false,
                    message: "Password required"
                });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid password"
                });
            }
        }

        // 🔹 OTP LOGIN
        // 👉 yaha already verifyOTP middleware run ho chuka hoga

        // 🔥 JWT generate
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            success: true,
            message: "Login successful",
            token
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};