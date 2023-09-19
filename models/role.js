const {Schema,model}=require('mongoose')

const roleSchema=new Schema({
    _id:String,
    name:{
        type:String,
        unique:true,
    },
},{timestamps:true})

module.exports=model('Role',roleSchema)
