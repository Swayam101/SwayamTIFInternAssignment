// Third Party Package Imports
const router = require('express').Router()
const { body } = require('express-validator')

// Controller Imports
const { signUpUser, signInUser, getUserDetails } = require('../controllers/user')

// middlewares Imports
const routeProtector = require('../middlewares/routeProtector')
const checkValidation = require('../middlewares/checkValidation')

router.post('/signup', [
body('name').isLength({ min: 2 }).withMessage("Name should be at least 2 characters."),
body('email').isEmail().withMessage("Please provide a valid email address."),
body('password').isLength({ min: 6 }).withMessage("Password should be at least 6 characters.")
],checkValidation, signUpUser)

router.post('/signin',signInUser)

router.get('/me', routeProtector, getUserDetails)

module.exports = router;