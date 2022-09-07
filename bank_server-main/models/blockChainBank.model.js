var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URL);

const blockChainBankSchema = new Schema({

  previousHash: String,
  transaction: Object,
  date: String,
  timestamp: Number,
  hash: String,
}, {collection: 'blockChainBank'});

module.exports = mongoose.model('BlockChainBank', blockChainBankSchema);
