const { Schema, model } = require('mongoose')


const userSchema = new Schema({
    _id: String,
    
    name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true
    },
    password: String,

}, { timestamps: true })

module.exports = model('User',userSchema)