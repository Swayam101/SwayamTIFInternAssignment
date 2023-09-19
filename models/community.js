const {Schema,model}=require('mongoose')

const User=require('./user')

const communitySchema=new Schema({
    _id:{
        type:String,
    },
    name:String,
    slug:{
        type:String,
        unique:true
    },
    owner:{
       type:String,
       ref:"User"
    }
},{timestamps:true})

module.exports=model('Community',communitySchema)