var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
// const timeZone = require('mongoose-timezone');

mongoose.connect(process.env.MONGODB_URL);

var loanSchema = new Schema({
  info: String,
  borrower: String, //  publicKey = V . username = X
  loaner: String, //  publicKey = V . username = X
  dateCreated: String,
  amount: Number,
  dateToReturn: String,

  isConfirmed: { type: Boolean, default: false },
  isRejected: { type: Boolean, default: false },
  isReturned: { type: Boolean, default: false },
  // status: {String, default: "waitToApprove"},//[waitToApprove,confirmed,rejected,returned]

  returnedDate: String,
});

// If no path is given, all date fields will be applied
// loanSchema.plugin(timeZone, { paths: ['date', 'subDocument.subDate'] });

module.exports = mongoose.model('Loan', loanSchema);
