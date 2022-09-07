const crypto = require("crypto");
const fs = require("fs");
// const moment = require('moment-timezone');

// const db = require("../utils/Chain.MongoDBConnection")
var blockChainBank = require('../models/blockChainBank.model');

async function blockChainCount() {
  return await blockChainBank.countDocuments();
};

async function blockChainInsert(block) {
    return await blockChainBank.create(block);
};
  
async function blockChainFind(query) {

    return await blockChainBank.find(query);
}
async function blockChainGetLastBlock() {
    return await blockChainBank.find().sort({_id: -1}).limit(1);
}

class Transaction {
  // static increment_id = 0

  constructor(amount, senderPublicKey, receiverPublicKey, info="you got levCoins") {

    this.amount = amount;
    this.senderPublicKey = senderPublicKey;
    this.receiverPublicKey = receiverPublicKey;
    // this.transactionId = Transaction.increment_id++;
    this.info = info;
  }

  // convert the data of the class to json so that
  // it can be converted into a hash
  toString() {
    return JSON.stringify(this);
  }
}

class Block {
  constructor(previousHash, transaction, timestamp = Date.now()) {
    this.previousHash = previousHash;
    this.transaction = transaction;

    this.date = new Date(timestamp).toString();
        
    this.timestamp = timestamp;
    this.hash = getHash(transaction);
  }

  // getHash() {
  //   // const json = JSON.stringify(this);
  //   // const hash = crypto.createHash("SHA256");
  //   // hash.update(json).end();
  //   // return hash.digest("hex");
  //   return getHash(this)
  // }

  toString() {
    return JSON.stringify(this);
  }
}

function getHash(obj) {
  const json = JSON.stringify(obj);
  const hash = crypto.createHash("SHA256");
  hash.update(json).end();
  return hash.digest("hex");
}

async function checkHashOfAllTheBlockChain() {
  var blockChain = await blockChainFind({});
  // console.log("\n\n 3:\n", blockChain);
  var tempHash;
  for (const block of blockChain) {
    // console.log("\ntempHash = ", tempHash);
    if (block.transaction.senderPublicKey == "initialization" && block.transaction.receiverPublicKey == "initialization")
    {
      if (getHash(block.transaction) != block.hash)
      {
        console.log("\n1");
        return false; // ...
      }
      tempHash = block.hash;
      continue;
    }
    if (tempHash != block.previousHash)
    {
      console.log("\n2");
      return false; // ...
    }

    tempHash = getHash(block.transaction);

    if (tempHash != block.hash)
    {
      console.log("\n3");
      return false; // ...
    }
  }
  // console.log("\n4");
  return true; // ... 
}

class Chain {
  constructor() {
    this.systemPublic = fs.readFileSync("system_keys/public.key", "utf8");
    // this.systemPublic = fs.readFileSync("system_keys\\public.key", "utf8");
    this.systemPrivate = fs.readFileSync("system_keys/private.key", "utf8");
    // this.systemPrivate = fs.readFileSync("system_keys\\private.key", "utf8");
    // this.chain = blockChainBank;

    //this.chain = [new Block("", new Transaction(100, "temp", "temp"))];
  }

  async systemInsertBlock(amount, receiverPublicKey) {

    const count = await blockChainCount();
    if (count == 0) {
      // await this.chain.blockChainInsert(new Block("", new Transaction(0, "initialization", "initialization", "initialization")));
      await blockChainInsert(new Block("", new Transaction(0, "initialization", "initialization", "initialization")));

      // const initTransaction = new Transaction(0, "initialization", "initialization", "initialization");
      // const block = new Block("", initTransaction);
      // await this.chain.Insert(block);
    }

    var isBlockChainOk = await checkHashOfAllTheBlockChain();
    if (!isBlockChainOk)
    {
      return { isOk: false, result: "there is some error in the blockchain, can't complete the action !" };
    }
    
    const transaction = new Transaction(
      parseInt(amount),
      this.systemPublic,
      receiverPublicKey,
      "System LevCoins Action",
    );
    const shaSign = crypto.createSign("SHA256");
    // add the transaction json
    shaSign.update(transaction.toString()).end();
    // sign the SHA with the private key
    const signature = shaSign.sign(this.systemPrivate);

    return await this.insertBlock(transaction, this.systemPublic, signature);
  }

  // how match money have in the system.
  async getSumOfMoneyInChain() {
    let sum = 0;
    // let res = await this.chain.blockChainFind({ 'transaction.senderPublicKey': this.systemPublic })
    let res = await blockChainFind({ 'transaction.senderPublicKey': this.systemPublic })
    
    // await res.forEach((block) => {
    res.forEach((block) => {
      sum += block.transaction.amount;
      // console.log("block.transaction.amount", block.transaction.amount);
    })
    // console.log("sum", sum);
    return sum;
  }

  async valueOfLevCoinPerDollar() {
    var amountOfLevCoins = await this.getSumOfMoneyInChain();
    var valOfLevCoin = 1 + 0.01 * amountOfLevCoins;
    return valOfLevCoin;
  }

  //TODO: או בקלאס של ארנק או לשנות את הפרמטר
  async getBalanceAndTransactions(wallet) {
    let balance = 0;
    let Transactions = [];
    // const res = await this.chain.blockChainFind({ $or: [{ 'transaction.senderPublicKey': wallet.publicKey }, { 'transaction.receiverPublicKey': wallet.publicKey }] });
    const res = await blockChainFind({ $or: [{ 'transaction.senderPublicKey': wallet.publicKey }, { 'transaction.receiverPublicKey': wallet.publicKey }] });

    var isBlockChainOk = await checkHashOfAllTheBlockChain();
    if (!isBlockChainOk)
    {
      return { balance:-1, Transactions:"" };
    }

    // await res.forEach((block) => { // ?
    res.forEach((block) => {
      if (block.transaction.senderPublicKey === wallet.publicKey) {
        balance -= parseInt(block.transaction.amount);
      } else if (block.transaction.receiverPublicKey === wallet.publicKey) {
        balance += parseInt(block.transaction.amount);
      }
      block.transaction["date"] = block.date; // need it for the getUserTransaction method... (to the charts in client...)
      block.transaction["timestamp"] = block.timestamp; // need it for the getUserTransaction method... (to the charts in client...)

      Transactions.push(block.transaction);
      // Transactions.push(block.timestamp);
    })
    return { balance, Transactions };
  }

  async getPreviousBlockHash() {
    // sending the entire block itself
    // return getHash(await this.chain.GetLastBlock());
    
    // var lastBlock = await this.chain.blockChainGetLastBlock();
    var lastBlock = await blockChainGetLastBlock();

    var previousBlockHash = getHash(lastBlock[0].transaction);
    return previousBlockHash;

    // var r = await this.chain.GetLastBlock(); // Promise { <pending> }
    // // console.log("\n\n1:\n", r[0]);
    // var r2 = getHash(r[0].transaction);
    // // console.log("\n\n2:\n", r2);
    // return r2;
    // // 44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a
  }

  async insertBlock(transaction, senderPublicKey, sig) {
    // const count = await db.Count()
    // if (count == 0) {
    //   await this.chain.Insert(new Block("", new Transaction(0, "initialization", "initialization", "initialization")))
    // }
    // else {
    //   Transaction.increment_id = count;
    // }

    // create verifier
    const verify = crypto.createVerify("SHA256");
    // add the transaction JSON
    verify.update(transaction.toString());

    // Verify it with the sender's public key
    const isValid = verify.verify(senderPublicKey, sig);

    if (isValid) {
      // var isBlockChainOk = await checkHashOfAllTheBlockChain();
      // if (!isBlockChainOk)
      // {
      //   return { isOk: false, result: "there is some error in the blockchain, can't complete the action !" };
      // }

      const block = new Block(await this.getPreviousBlockHash(), transaction); // await ...
      // console.log("Block added", block.toString());
      // await this.chain.blockChainInsert(block);
      await blockChainInsert(block);

      return { isOk: true, result: "" };
    }
    return { isOk: false, result: "there is some error in the blockchain, can't complete the action !" };
  }
}

class Wallet {
  constructor(privateKey = null, publicKey = null) {
    if (!privateKey && !publicKey) {
      const keys = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });
      this.privateKey = keys.privateKey;
      this.publicKey = keys.publicKey;
    }
    else {
      this.privateKey = privateKey
      this.publicKey = publicKey;
    }
  }

  async send(chain, amount, receiverPublicKey, info) {
    // if(chain.getBalanceAndTransactions(this)[0]<amount){
    //   throw "you can't tranfare more than you have"
    // }

    var isBlockChainOk = await chain.getBalanceAndTransactions(this);
    if (!isBlockChainOk.balance == -1)
    {
      return { isOk: false, result: "there is some error in the blockchain, can't complete the action !" };
    }

    const transaction = new Transaction(
      amount,
      this.publicKey,
      receiverPublicKey,
      info,
    );
    const shaSign = crypto.createSign("SHA256");
    // add the transaction json
    shaSign.update(transaction.toString()).end();
    // sign the SHA with the private key
    const signature = shaSign.sign(this.privateKey);

    return await chain.insertBlock(transaction, this.publicKey, signature);
  }
}

module.exports.Chain = Chain;
module.exports.Wallet = Wallet;
module.exports.Transaction = Transaction;
