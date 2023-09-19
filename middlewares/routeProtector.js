const jwt = require('jsonwebtoken')
const User = require('../models/user')
const asyncWrapper = require('../utils/asyncWrapper')

const protectRoute = asyncWrapper(
    async (req, res, next) => {
        // Check If AUTH Header Exists in Request
        const { authorization } = req.headers
        if (!authorization) return res.status(401).json({ error: "User Not Authorised" })
        // Extracting The Token
        const token = authorization.split(' ')[1]
        // Assigning Currently Signed In User
        const { id } = jwt.verify(token, process.env.AUTH_SECRET)
        req.user = await User.findOne({ _id: id }).select('_id')
        
        next()
    }
)

module.exports = protectRoute