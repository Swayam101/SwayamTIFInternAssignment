const CustomError = require("../utils/CustomError");

const errorHandlermiddlewares = (err, req, res, next) => {
    // console.log(err);
    
    // Unauthorised Access
    if(err.name=="JsonWebTokenError"){
        const error=new CustomError([{message:"You need to sign in to proceed.",code:"NOT_SIGNEDIN"}],401)
        return res.json(error)
    }
    // Checking Duplicae Key Error
    if (err.code == "11000") {
        const collection=err.message.split(" ")[5].split(".")[1].slice(0, -1).toUpperCase();
        const key = Object.keys(err.keyPattern)[0];
        const error = new CustomError([{ param: key, message: `${collection} with this ${key} Already Exists`, code: "RESOURCE_EXISTS" }],)
        return res.json(error)
    }

    return res.status(400).json(err)

}

module.exports = errorHandlermiddlewares;