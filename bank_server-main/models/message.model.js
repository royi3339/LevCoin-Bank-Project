var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// const { Timestamp } = require('mongodb');

mongoose.connect(process.env.MONGODB_URL);

const Message = new Schema({
  userId: String,
  text: String,
  idTypeIsSender: Boolean,
  groupId: String,
  date: String,
  timestamp: Number,
}, {collection: 'messages'});
// Message.plugin(passportLocalMongoose);

module.exports = mongoose.model('Message', Message);
