const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index:true,
    },
    text: String,
    createdAt: {
        type: Date,
        default:Date.now
    }

})

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    message:[messageSchema]
})

module.exports= mongoose.model("ChatSchema",chatSchema)