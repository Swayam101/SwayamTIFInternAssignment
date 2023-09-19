//  Third party package Imports
const { Snowflake } = require('@theinternetfolks/snowflake')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// Model Imports
const User = require('../models/user');

// Utility Imports
const Response = require('../utils/Response');
const asyncWrapper = require('../utils/asyncWrapper');
const CustomError = require('../utils/CustomError');


const createAuthToken = (id) => jwt.sign({ id }, process.env.AUTH_SECRET, { expiresIn: '1d' });

exports.signUpUser = asyncWrapper(async (req, res) => {

    const { name, email, password } = req.body
    const _id = Snowflake.generate()
    // Hashing The Password
    const hashedPassword = await bcrypt.hash(password, 5);
    // Creating User
    const { createdAt } = await User.create({ _id, name, email, password: hashedPassword })
    
    const authToken = createAuthToken(_id);
    const response = new Response(true, { id: _id, name, email, createdAt }, { access_token: authToken })

    res.status(200).json(response);
})

exports.signInUser = asyncWrapper(async (req, res, next) => {

    const { email, password } = req.body;
    // Check If User Exists
    const user = await User.findOne({ email })
    if (!user) throw new CustomError([{ param: "email", message: "Please provide a valid email address.", code: "INVALID_INPUT" }],400);
    // Verify Password
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) throw new CustomError([{ param: "password", message: "The credentials you provided are invalid.", code: "INVALID_CREDENTIALS" }],400)
    
    const authToken = createAuthToken(user._id);

    const response = new Response(true, {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    }, { access_token: authToken })

    res.status(200).json(response)

})

exports.getUserDetails = asyncWrapper(
    async (req, res) => {
        const id = req.user
        const userDetails = await User.findOne({ _id: id }).select('-password -updatedAt');
        const response = new Response(true, userDetails)
        res.json(response)
    }
)