// Third Party Package Imports
const router = require('express').Router()
const { body } = require('express-validator')

// Controller Imports
const { getAllRoles, createRole } = require('../controllers/role')

// middlewares Imports
const pagination = require('../middlewares/pagination')
const checkValidation = require('../middlewares/checkValidation')

router.post('/', body('name').isLength({ min: 2 }).trim().withMessage('Name should be at least 2 characters'),checkValidation,createRole)

router.get('/', pagination,getAllRoles)

module.exports = router;
