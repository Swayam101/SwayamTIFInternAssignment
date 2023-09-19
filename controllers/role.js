// Third Part Package Imports
const {Snowflake}=require('@theinternetfolks/snowflake')
const { validationResult } = require('express-validator');

// Model Imports
const Role=require('../models/role');

// Utility Imports
const asyncWrapper = require('../utils/asyncWrapper');
const Response = require('../utils/Response');


exports.createRole=asyncWrapper(async (req,res,next)=>{
    
        const {name}=req.body
        const _id=Snowflake.generate()

        const role=await Role.create({_id,name})
        
        const response=new Response(true,role);
        res.json(response);
    }
)

exports.getAllRoles=asyncWrapper(async (req,res,next)=>{
    const {page,skip,limit}=req.paginate

    const roles=await Role.find().skip(skip).limit(limit);
    const total=await Role.count();

    const response=new Response(true,roles,{
        total,pages:Math.ceil(total/limit),page
    })
    res.send(response);
})