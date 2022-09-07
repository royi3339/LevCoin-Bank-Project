var passportLocalMongoose = require('passport-local-mongoose');
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL);

const User = new Schema({
  username: String,
  password: String,
  email: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isAdmin: Boolean,
  isConfirmed: Boolean,
  publicKey: String,
  privateKey: String,
  firstName: String,
  lastName: String,
  image: { type: String, default: `https://powerusers.microsoft.com/t5/image/serverpage/image-id/98171iCC9A58CAF1C9B5B9/image-size/large/is-moderation-mode/true?v=v2&px=999` },
}, {collection: 'users'});
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
