var express = require('express');
const router = express.Router();
// const authorize = require('../utils/jwt-auth')
const authorize = require('../utils/authorize-handler');
const messageController = require('../controllers/message.controller');

//message
// returnd all the messages, required fields: userId
router.post('/getMessages', authorize(false, true), messageController.getMessages) //V

// post and save a new message, required fields: userId, text, idTypeIsSender
router.post('/postMessage', authorize(false, true), messageController.postMessage) //V

// get all the users id and username
router.get('/getUsersContact', authorize(false, true), messageController.getUsersContact) //V

// get all the admins id and username, available to anyone.
router.get('/getAdminContact', authorize(false, true), messageController.getAdminContact) //V

module.exports = router
