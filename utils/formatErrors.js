// Formatting the mongoose Errors Into Given Format

const formatErrors=(errors)=>{
    const formattedErrors=errors.map(err=>({
        param:err.path,
        message:err.msg,
        code:"INVALID_INPUT"
    }))
    return formattedErrors;
}

module.exports= formatErrors;