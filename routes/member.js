// Third Party Package Imports
const router=require('express').Router()

// Controller Imports
const {addMember,removeMember}=require('../controllers/member');

router.post('/',addMember)

router.delete('/:id',removeMember)







module.exports=router;