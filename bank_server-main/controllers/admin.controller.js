const Users = require('../models/user.model');
// const cryptobank = require("../models/cryptoBank");
const cryptobank = require("./cryptoBank");
const chain = new cryptobank.Chain();

function print(txt)
{
  return;
  console.log(txt);
}

function updateUser(req, res) {
  print("\n\t\tupdateUser ");

  
  Users.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        username: req.body.username,
        isAdmin: req.body.isAdmin,
        isConfirmed: req.body.isConfirmed,
        password: req.body.password,
        image: req.body.image
      }
    }).then(
      (user) => {
        res.send({success: true, msg: "User updated"});
      }).catch(
      (err) => {
        res.send({success: false, msg: "Server error"});
      }
  )
}

function deleteUser(req, res) {
  print("\n\t\tdeleteUser ");

  Users.findByIdAndDelete(req.body._id, function (err) {
    if (err) {
      res.send({success: false, msg: "Server error"});
    } else {
      res.send({success: true, msg: "User deleted"});
    }
  })
}

async function confirmUser(req, res) {
  print("\n\t\tconfirmUser ");

  if (req.body.amount < 0)
  {
    res.send({success: false, msg: "You can't make a transaction with a negative amount!!!"});
    return;
  }
  var theUser = await Users.findByIdAndUpdate(
    req.body._id,
    {
      $set: {
        isConfirmed: true,
      }
    }
  )
  
  var result = {success: true, msg: "User confirmed"};

  if (req.body.amount) {
    var isBlockChainOk = await chain.systemInsertBlock(req.body.amount, theUser.publicKey);
    if (!isBlockChainOk.isOk)
    {
      result = {success: false, msg: "there is some error in the blockchain, can't complete the action !"};
    }
    // else {
    // console.log("System inserted Transaction " + String(req.body.amount) + " to user " + theUser.username);
    // }
  }
  res.send(result);
}

function filterUserListInfo(usersList) {
  return usersList.map(({_id, username, email, isAdmin, isConfirmed, firstName, lastName, image, ...rest}) => ({_id, username, email, isAdmin, isConfirmed, firstName, lastName, image}));
}

function getPendingUsers(req, res) {
  print("\n\t\tgetPendingUsers ");


  Users.find({isConfirmed: false}, function (err, users) {
    if (err) {
      res.send({success: false, msg: "Server error"});
    } else if (!users) {
      res.send({success: false, msg: "Users do not exist"});
    } else {
      var usersList = filterUserListInfo(users);
      res.send({success: true, msg: usersList});
    }
  })
}

module.exports = {
  updateUser,
  deleteUser,
  confirmUser,
  getPendingUsers,
}
