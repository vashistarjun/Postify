const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')

exports.isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        // 🔥 check header
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token missing"
            });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: "false",
                message: "need to login first.."
            })
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if (decode.role !== "user") {
            return res.status(401).json({
                success: false,
                message: "forbidden"
            })
        }
        req.user = decode;

        next();
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "server error"
        })
    }
}