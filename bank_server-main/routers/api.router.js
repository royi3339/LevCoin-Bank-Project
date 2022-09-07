require('dotenv').config()
const express = require('express');
const crypto = require("crypto");
const router = express.Router();
const passport = require('passport')

// const userController = require('../controllers/user.controller');
const Users = require('../models/user.model');
// const adminController = require('../controllers/admin.controller');

// const resetPasswordController = require('../controllers/resetPassword.controller');

const userWithoutPassword = (user) => {
  return {
    username: user.username,
    email: user.email,
    isConfirmed: user.isConfirmed,
    isAdmin: user.isAdmin,
    firstName: user.firstName,
    lastName: user.lastName,
    image: user.image,
  }
}

function print(txt)
{
  return;
  console.log(txt);
}



// refered only when login is failed
router.get('/loginFailed', (req, res) => {
  res.send({success: false, msg: "Login failed"})
});
// login with username and password, required fields: username, password
router.post('/login', passport.authenticate('local', {failureRedirect: 'loginFailed', session: true}),
  (req, res) => {
    print("\n\t\tlogin ");
    
    res.send({success: true, user: userWithoutPassword(req.user)})
  }
);

// required fields: username, password, email, firstName, lastName
router.post('/register', (req, res) => {
  print("\n\t\tregister ");

  Users.findOne({username: req.body.username}, function (err, user) {
    if (err) {
      res.send({success: false, msg: "Server error"});
    } else if (user) {
      res.send({success: false, msg: "User already exists"});
    } else {
      Users.findOne({email: req.body.email}, function (err, user) {
        if (err) {
          res.send({success: false, msg: "Server error"});
        } else if (user) {
          res.send({success: false, msg: "Email already exists"});
        } else {
          const keys = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
            publicKeyEncoding: {type: "spki", format: "pem"},
            privateKeyEncoding: {type: "pkcs8", format: "pem"},
          });
          Users.create(
            {
              username: req.body.username.toLowerCase(),
              password: req.body.password,
              email: req.body.email,
              isAdmin: false,
              isConfirmed: false,
              publicKey: keys.publicKey,
              privateKey: keys.privateKey,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              image: req.body.image,
            }
          ).then((user) => {
            res.send({success: true, msg: "User created"});
          })
        }
      })
    }
  });
})


router.get('/logout', (req, res) => {
  print("\n\t\tlogout ");

  req.logout((err) => {
    if (err) {
      res.send({success: false, msg: "Server error"});
    } else {
      res.send({success: true, msg: "Logged out"});
    }
  })
})

router.get('/', (req, res) => {
  console.log("\n\n\t\tits worked!!!\n");
  res.send({success: true, msg: "api root"})
}) // V

// var userRouter = require("./user.router");
// var adminRouter = require("./admin.router");
// // router.use('/user', userRouter);
// // router.use('/admin', adminRouter);

// //reset password
// router.post('/forgot', resetPasswordController.forgotPost);
// router.get('/reset/:token', resetPasswordController.tokenGet);
// router.post('/reset/:token', resetPasswordController.tokenPost);



module.exports = router
