// Third-Party Packages
const express = require('express')
const mongoose=require('mongoose')
const bodyParser = require('body-parser')
const cors=require('cors')
require('dotenv').config()

// Routers Imports!
const roleRouter=require('./routes/role')
const userRouter=require('./routes/user')
const communityRouter=require('./routes/community')
const memberRouter=require('./routes/member')

// middlewares Imports
const errorHandlermiddlewares = require('./middlewares/errorHandler')
const protectRoute = require('./middlewares/routeProtector')
const asyncWrapper = require('./utils/asyncWrapper')


const app = express()
const port = 3000 || process.env.PORT

// GLOBAL middlewaress
app.use(cors())
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// Routers
app.use('/v1/role',roleRouter);

app.use('/v1/auth',userRouter);

app.use('/v1/member',protectRoute,memberRouter)

app.use('/v1/community',communityRouter)

// Error Handler middlewaress
app.use(asyncWrapper(async (req,res,next)=>{
    res.json({err:"Route Not Found!"});
}));
app.use(errorHandlermiddlewares)

// API will Work Only If DB is Ready!
mongoose.connect(`mongodb+srv://swayam:${process.env.MONGOOSE_PASSWORD}@tifcluster.kmufxw2.mongodb.net/`).then(()=>{
    app.listen(port, () => console.log(`listening on port ${port}!`))
}).catch((err)=>{
    console.log(err);
})
