const mongoose = require('mongoose');

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        require: true,
        trim:true
    },
    description: {
        type: String,
        default:""
    }
    ,
   
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
        index:true
    },
    status: {
        type: String,
        enum: ["pending", "approve", "rejected"],
        default:"pending"

    },
    photo: {
        type:String
    }

})

module.exports = mongoose.model("Todo", todoSchema);