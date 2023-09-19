// Third Party Package Imports
const {body}=require('express-validator')
const router = require('express').Router();
// Controller Imports
const { createCommunity, getAllCommunities, getAllMembers, getOwner, getMemberOf } = require('../controllers/community');
// middlewares Imports
const pagination=require('../middlewares/pagination')
const protectRoute = require('../middlewares/routeProtector');
const checkValidation = require('../middlewares/checkValidation');

router.post('/', protectRoute,body('name').isLength({min:2}).withMessage("Name should be at least 2 characters."),checkValidation,createCommunity)

router.get('/', pagination,getAllCommunities)

router.get('/:id/members',pagination,getAllMembers)

router.get('/me/owner',protectRoute, pagination, getOwner)

router.get('/me/member', protectRoute,pagination,getMemberOf)

module.exports = router;