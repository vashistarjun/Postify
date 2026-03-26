const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.authType === "local";
        }
    },

    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    password: {
        type: String,
        required: function () {
            return this.authType === "local";
        }
    },

    authType: {
        type: String,
        enum: ["local", "otp"],
        default: "local"
    },

    isVerified: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);