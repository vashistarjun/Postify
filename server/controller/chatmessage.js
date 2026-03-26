const ChatSchema = require("../model/chat")

exports.getMessage = async (req,res) => {
    try {
        const { userId } = req.pramas
        let chat = await ChatSchema.findOne({ userId });
        if (!chat) {
            chat = await ChatSchema.create({
                userId,
                text:[]
            })
        }
        return res.status(200).json({
            success: true,
            message: chat.text
        })
    }
    catch (error){
        return res.status(500).json({
            success: false,
            message:"server error"
        })
    }
}