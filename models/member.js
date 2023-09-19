const {Schema,model}=require('mongoose')

const User=require('./user')
const Community=require('./community')
const Role=require('./role')

const memberSchema=new Schema({
    _id:String,
    community:{
        type:String,
        ref:"Community"
    },
    user:{
        type:String,
        ref:"User"
    },
    role:{
        type:String,
        ref:"Role"
    }
},{timestamps:true})

module.exports=model('Member',memberSchema)