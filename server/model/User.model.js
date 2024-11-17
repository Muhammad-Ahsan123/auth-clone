const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "please provide unique Username"],
        unique: [true, "Username exist"]
    },
    password: {
        type: String,
        required: [true, "please provide password"]
    },
    email: {
        type: String,
        required: [true, "please provide email"],
        unique: true
    },
    firstName: { type: String, },
    lastName: { type: String, },
    mobile: { type: Number },
    address: { type: String },
    profile: { type: String },
})

module.exports = mongoose.model('user', UserSchema)