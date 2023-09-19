//  Third party package Imports
const {validationResult}=require('express-validator');

// Utility Imports
const asyncWrapper = require("../utils/asyncWrapper");
const formatErrors = require("../utils/formatErrors");
const CustomError = require("../utils/CustomError");



const checkValidation=asyncWrapper(async(req,res,next)=>{
    const validResult=validationResult(req);
    
    if(!validResult.isEmpty()){
        const formattedErrors=formatErrors(validResult.array())
        throw new CustomError(formattedErrors,"INVALID_INPUT");
    }

    next()
})

module.exports=checkValidation