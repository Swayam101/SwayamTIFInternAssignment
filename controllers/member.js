// Third Party Package Imports
const { Snowflake } = require("@theinternetfolks/snowflake")

// Model Imports
const Member = require("../models/member")
const Community=require('../models/community')
const User=require('../models/user')
const Role=require('../models/role')

// Utility Imports
const Response = require('../utils/Response')
const asyncWrapper = require("../utils/asyncWrapper")
const CustomError = require("../utils/CustomError")

exports.addMember = asyncWrapper(async (req, res, next) => {
    const { community, user, role } = req.body
    const _id = Snowflake.generate()

    const isCommunity=await Community.findOne({_id:community})
    if(!isCommunity) throw new CustomError([{param:"community",message:"Community not found.",code: "RESOURCE_NOT_FOUND"}])
    
    const isUser=await User.findOne({_id:user})
    if(!isUser) throw new CustomError([{param:"User",message:"User not found.",code: "RESOURCE_NOT_FOUND"}])
    
    const isRole=await Role.findOne({_id:role})
    if(!isRole) throw new CustomError([{param:"Role",message:"Role not found.",code: "RESOURCE_NOT_FOUND"}])
    
    if(!(isCommunity.owner==req.user._id)) throw new CustomError([{
        message: "You are not authorized to perform this action.",
        code: "NOT_ALLOWED_ACCESS"
      }],400)
    
    const isAlreadyMember = await Member.find({ community, user });
    if (isAlreadyMember.length!=0) throw new CustomError([{message:"User is already added in the community.",code:"RESOURCE_EXISTS"}],400)
    
    const member = await Member.create({ _id, community, user, role });
    delete member.updatedAt
    
    const response = new Response(true, member)
    res.json(response);
})

exports.removeMember = asyncWrapper(async (req, res, next) => {
    const _id = req.params.id;
    // Checking Whether Current User == Owner Of Community
    const roleCheck = await Member.findOne({ user: req.user }).populate('role')
    if (!(roleCheck.role.name == "Community Admin" || roleCheck.role.name == "Community Moderator"))
        throw new CustomError([{
            message: "You are not authorized to perform this action.",
            code: "NOT_ALLOWED_ACCESS"
          }],400)
    
    // Removing The Member From Community
    const removedMember = await Member.findOneAndDelete({user:_id})
    // Checking If Member is in Community!
    if(!removedMember) throw new CustomError([{
        message: "Member not found.",
        code: "RESOURCE_NOT_FOUND"
}]) 

    res.json({ status: true });
})