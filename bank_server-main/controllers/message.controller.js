var ioImporter = require("../app");

var User = require('../models/user.model');
var Message = require('../models/message.model');

function print(txt)
{
  return;
  // console.log(txt);
}

async function findMessagesByGroupId(groupId)
{
    return await Message.find({"groupId": groupId});
}

async function createGroupId(memberId, adminUsername="admin")
{
    const admin = await User.findOne({username: adminUsername});
    return admin.id + ' ' + memberId;
}

async function getMessages(req, res) {
  print("\n\t\tgetMessages ");

  var memberId = req.body.userId;

  // if (memberId == "me") {
  //   memberId = req.user._id;
  // }

  const groupId = await createGroupId(memberId);
  // console.log("groupId = ", groupId);

  const messagesList = await findMessagesByGroupId(groupId);
  // console.log("\nmessagesList = ", messagesList);

  res.send({success: true, msg: messagesList});
}

async function postMessage(req, res) {
  print("\n\t\tpostMessage ");


  var userId = req.body.userId;

  // if (userId == "me") {
  //   userId = req.user._id;
  // }

  // if (userId == req.user._id) {
  //   res.send({success: false, msg: "you can't send message to yourself!!! "});
  //   return;
  // }

  const timestamp = Date.now();
  // var t = new Date();
  const groupId = await createGroupId(userId);
  Message.create(
  {
      userId: userId,
      text: req.body.text,
      groupId: groupId,
      idTypeIsSender: req.body.idTypeIsSender,

      // // date: t.toUTCString() + "-0300",
      // date: t.toUTCString(),
      // date: moment.tz(timestamp, "Israel").toString(),
      date: new Date(timestamp),
      
      timestamp: timestamp,
  }
  ).then((message) => {
  var io = ioImporter.getIo();


  io.sockets.emit("message", {text:message.text, dst: message.idTypeIsSender?"admin":userId, date: message.date.toString()} );
  // io.sockets.emit("message", {text:message.text, dst: userId, date: message.date.toString()} );

  // console.log("\n\n\tmessage...");

  res.send({success: true, msg: "Message created"});
  });
}

function filterUserListInfo(usersList) {
  // return usersList.map(({_id, username, image,...rest}) => ({_id, username, image}));
  return usersList.map(({_id, username, email, isAdmin, isConfirmed, firstName, lastName, image, ...rest}) => ({_id, username, email, isAdmin, isConfirmed, firstName, lastName, image}));
}

async function getUsersContact(req, res) {
  print("\n\t\tgetUsersContact ");


  User.find({$and: [{isConfirmed: true}, {_id: {$ne:req.user._id}}]}, function (err, users) {
    if (err) {
      res.send({success: false, msg: "Server error"});
    } else if (!users) {
      res.send({success: false, msg: "Users do not exist"});
    } else {
      var usersList = filterUserListInfo(users).filter(function(element){ 
        return element._id != req.user._id; 
      });
      res.send({success: true, msg: usersList});
    }
  })
}

async function getAdminContact(req, res) {

  print("\n\t\tgetAdminContact ");


  User.find({$and: [{isAdmin: true, isConfirmed: true}, {_id: {$ne:req.user._id}}]}, function (err, users) {
    if (err) {
      res.send({success: false, msg: "Server error"});
    } else if (!users) {
      res.send({success: false, msg: "Users do not exist"});
    } else {        
    var adminsList = filterUserListInfo(users).filter(function(element){ 
      return element._id != req.user._id; 
    });    
    res.send({success: true, msg: adminsList});
    }
  })
}

module.exports = {
    getMessages,
    postMessage,
    getUsersContact,
    getAdminContact,
}
