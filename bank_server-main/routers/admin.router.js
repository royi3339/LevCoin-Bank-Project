var express = require('express');
const router = express.Router();
// const authorize = require('../utils/jwt-auth')
const authorize = require('../utils/authorize-handler');
const adminController = require('../controllers/admin.controller');

//admin
// get all pending users
router.get('/getPendingUsers', authorize(true, true), adminController.getPendingUsers) //V
// confirm a user, required fields: userId (_id)
router.post('/confirmUser', authorize(true, true), adminController.confirmUser) //V
// delete a user, required fields: userId (_id)
router.post('/deleteUser', authorize(true, true), adminController.deleteUser) //V
// update a user, required fields: userId (_id), optional fields: firstName, lastName, email, username, password
router.post('/updateUser', authorize(true, true), adminController.updateUser)  //V

module.exports = router
