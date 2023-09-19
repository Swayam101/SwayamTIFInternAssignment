const asyncWrapper = require("../utils/asyncWrapper");

const pagination=asyncWrapper(async (req,res,next)=>{
    const page=parseInt(req.query.page) || 1
    const limit=parseInt(req.query.limit) || 2
    const skip=(page-1) * limit
    req.paginate={page,limit,skip}
    next();
})

module.exports=pagination