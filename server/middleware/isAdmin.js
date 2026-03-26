const dotenv = require('dotenv').config()
const jwt = require('jsonwebtoken')
exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({
                success: false,
                message: "you need to loggin first"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "access denied. Admin Only"
            })
        }
        req.user = decode;
        next();



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "token not valid"
        })
    }
}

