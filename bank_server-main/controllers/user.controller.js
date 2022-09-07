const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fs = require("fs");
var ioImporter = require("../app");

// const moment = require('moment-timezone');

const Users = require('../models/user.model');
const Loans = require('../models/loan.model');

// const cryptobank = require('../models/cryptobank');
const cryptobank = require('./cryptoBank');
const chain = new cryptobank.Chain();
var wallet;

const exchangeApiKey = "0lVwcrB7Us8gsPYowxbMqGwZ6kyOwZ5j"

function print(txt)
{
  return;
  console.log(txt);
}

//  sendTo = loaner
//  sendBy = borrower
// req.body = {info, loanerId, amount}
async function sendLoanRequest(req, res) {
  print("\n\t\tsendLoanRequest ");

  if (req.user._id == req.body.loanerId) {
    res.send({success: false, msg: "You can't send loan request to yourself!!!"});
    return;
  }
  if (req.body.amount < 0) {
    res.send({success: false, msg: "You can't send loan request with a negative amount!!!"});
    return;
  }
  if (req.body.amount == 0) {
    res.send({success: false, msg: "You can't send loan request with a zero amount!!!"});
    return;
  }
  const currentTimeStamp = Date.now();
  var dateToReturn = new Date(currentTimeStamp);
  dateToReturn.setDate(dateToReturn.getDate() + 7);

  console.log("\n\nloanerId = ", req.body.loanerId);

  var loanerPublicKey = await Users.findOne({_id: req.body.loanerId});
  console.log("\n\nloanerPublicKey = ", loanerPublicKey);

  loanerPublicKey = loanerPublicKey.publicKey;
  var io = ioImporter.getIo();

  Loans.create({
    info: req.body.info,
    loaner: loanerPublicKey,
    amount: req.body.amount,
    // sendBy: req.user.username, // ? 
    borrower: req.user.publicKey, // ? 
    // // dateCreated: new Date().getDate(), // ?
    // dateCreated: new Date(),
    dateCreated: new Date(currentTimeStamp),

    dateToReturn: dateToReturn,
  }).then((loan) => {
    io.sockets.emit("loan", {
      text: "You got a new loan request", 
      dst: req.body.loanerId,
      date: new Date().toString(),               
    });
    
    res.send({success: true, msg: "Loan request sent"});
  })
}

async function getLoanByLoanId(loanId) {
  var loanRes = await Loans.findOne({ _id: loanId });
  return loanRes;
}

async function confirmLoan(req, res) {
  print("\n\t\tconfirmLoan ");

  const currentUserId = req.user._id;  
  const currentLoanId = req.body.loanId;

  var loanCheckResult = await checkLoan(currentLoanId, currentUserId);

  if (!loanCheckResult.isOk)
  {
    res.send({success: false, msg: loanCheckResult.result});
    return;
  }
  else {
    var loan = loanCheckResult.result;
  }

  if (loan.amount > await getBalance(loan.loaner) * 0.5) {
    await rejectLoan(loan._id);
    res.send({success: false, msg: "Loan rejected: The loaner can't give more than a half of his levCoins amount..."});
    return;
  }
  if (loan.amount > await getBalance(loan.borrower) * 0.6) {
    await rejectLoan(loan._id);
    res.send({success: false, msg: "Loan rejected: The borrower can't request more then a 60% of his levCoins amount..."});
    return;
  }

  wallet = new cryptobank.Wallet(req.user.privateKey, req.user.publicKey);
  var io = ioImporter.getIo();

  Loans.findByIdAndUpdate(currentLoanId, {
    $set: {
      isConfirmed: true
    }
  }).then(
    (loan) => {
      // wallet.send(chain, loan.amount, loan.borrower, loan.info);
      // io.sockets.emit("loan", {
      //   text: "Your loan request has been confirmed", 
      //   dst: loan.borrower,
      //   date: new Date().toString(),               
      // });
      // res.send({success: true, msg: "Loan Sent"});
      Users.findOne({publicKey: loan.borrower}).then((user)=>{
        wallet.send(chain, loan.amount, loan.borrower, loan.info);
        io.sockets.emit("loan", {
          text: "Your loan request has been confirmed",
          dst: user._id,
          date: new Date().toString(),
        });
        io.sockets.emit("transaction", {
          text: "You got a new transaction", 
          dst: user._id,
          date: new Date().toString(),               
        });
        res.send({success: true, msg: "Loan Sent"});
      })
    }
  )
}

async function rejectLoan(loanId) {
  var result = "error";
  await Loans.findByIdAndUpdate(loanId, {
    $set: {
      isRejected: true
    }
  }).then(
    (loan) => {
      // res.send({success: true, msg: "Loan rejected"});
      result = "Loan rejected";
    }
  )
  return result;
}

async function checkLoan(loanId, currentUserId) {

  var loan = await getLoanByLoanId(loanId);

  var currentUserPublicKey = await Users.findOne({ _id: currentUserId });
  currentUserPublicKey = currentUserPublicKey.publicKey;

  if (!loan) {
    return { isOk: false, result: "Loan does not exist!!!" };
  }
  if (currentUserPublicKey != loan.loaner)
  {
    return { isOk: false, result: "you can't make actions on loans that does not belong to you" };
  }
  if (loan.isConfirmed) {
    return { isOk: false, result: "Loan rejected: this specific loan has been already confirmed !!!" };
  }
  if (loan.isRejected) {
    return { isOk: false, result: "Loan rejected: this specific loan has been already rejected !!!" };
  }
  if (loan.isReturned) {
    return { isOk: false, result: "Loan rejected: this specific loan has been already returned !!!" };
  }

  return { isOk: true, result: loan };
}

async function rejectLoanCommand(req, res) {
  print("\n\t\trejectLoanCommand ");

  const currentLoanId = req.body.loanId;
  const currentUserId = req.user._id;

  var loanCheckResult = await checkLoan(currentLoanId, currentUserId);
  if (!loanCheckResult.isOk) 
  {
    res.send({success: loanCheckResult.isOk, msg: loanCheckResult.result});
  }
  else {
    var currentLoan = await Loans.findOne({_id: currentLoanId});
    var currentBorrower = await Users.findOne({publicKey: currentLoan.borrower});

    var loanRes = await rejectLoan(currentLoanId);

    var io = ioImporter.getIo();
    io.sockets.emit("loan", {
      text: "Your loan request has been rejected",
      dst: currentBorrower._id,
      date: new Date().toString(),
    });
    res.send({success: true, msg: loanRes});
  }
}

async function getLoans(req, res) {
  print("\n\t\tgetLoans ");


  // var userInfo = getUserDetailsByPublicKey();

  var loansList = await Loans.find({$or: [{'borrower': req.user.publicKey}, {'loaner': req.user.publicKey}]}) //, function (err, loans) {   // ?
    // if (err) {
    //   res.status(500).send({success: false, msg: "Server error"});
    // }
    // else {
  var tempUserPublicKey;
  // var newLoansList = await loansList.forEach((loan) => {
  for (var loan of loansList)
  {
      tempUserPublicKey = await getUserDetailsByPublicKey(loan.loaner);
      loan.loaner = tempUserPublicKey.username;
      tempUserPublicKey = await getUserDetailsByPublicKey(loan.borrower);
      loan.borrower = tempUserPublicKey.username;
  }
  // )
  res.send({success: true, loans: loansList});
    // }
  // })
}

async function repayLoan(req, res) {
  print("\n\t\trepayLoan ");


  var loan = await getLoanByLoanId(req.body.loanId);
  var currentUserId = req.user._id;

  var currentUserPublicKey = await Users.findOne({ _id: currentUserId });
  currentUserPublicKey = currentUserPublicKey.publicKey;

  if (!loan) {
    res.send({success: false, msg: "Loan does not exist!!!"});
    return;
  }
  if (currentUserPublicKey != loan.borrower)
  {
    res.send({success: false, msg: "You can't repay a loan that does not belong to you !"});
    return;
  }
  if (!loan.isConfirmed) {
    res.send({success: false, msg: "The loan has not yet been confirmed !"});
    return;
  }
  if (loan.isRejected) {
    res.send({success: false, msg: "You can't repay a rejected loan !"});
    return;
  }
  if (loan.isReturned) {
    res.send({success: false, msg: "The loan has already been repaid !"});
    return;
  }
  if (loan.amount > await getBalance(currentUserPublicKey)) {
    res.send({success: false, msg: "Not enough balance"});
    return;
  }

  var currentLoan = await Loans.findOne({_id: loan._id});
  var currentLoaner = await Users.findOne({publicKey: currentLoan.loaner});

  wallet = new cryptobank.Wallet(req.user.privateKey, req.user.publicKey);
  var io = ioImporter.getIo();

  Loans.findByIdAndUpdate(loan._id, {
    $set: {
      isReturned: true,
      returnedDate: new Date(Date.now())
    }
  }).then(
    (loan) => {
      wallet.send(chain, loan.amount, loan.loaner, loan.info);

      io.sockets.emit("loan", {
        text: "Your loan has been repaid",
        dst: currentLoaner._id,
        date: new Date().toString(),
      });

      io.sockets.emit("transaction", {
        text: "You got a new transaction", 
        dst: currentLoaner._id,
        date: new Date().toString(),               
      });
      res.send({success: true, msg: "Loan repaid"});
    }
  )
}

// req.body = {_id, amount}
function makeTransaction(req, res) {
  print("\n\t\tmakeTransaction ");

  if (req.body.amount < 0) {
    res.send({success: false, msg: "You can't make a transaction with a negative amount!!!"});
    return;
  }
  if (req.body.amount == 0) {
    res.send({success: false, msg: "You can't make a transaction with zero amount!!!"});
    return;
  }
  chain.getBalanceAndTransactions({publicKey: req.user.publicKey}).then((result) => {

    if (result.balance == -1) {
      res.send({success: false, msg: "there is some error in the blockchain, can't complete the action !"});
      return;
    }

    if (result.balance < req.body.amount) {
      res.send({success: false, msg: "Not enough balance"});
      return;
    }

    if (req.body._id == req.user._id) {
      res.send({success: false, msg: "You can't transfer LevCoins to yourself!!!"});
      return;
    }

    var io = ioImporter.getIo();

    if (result.balance == req.body.amount) {
      io.sockets.emit("balance", {text: `${req.user._id}`, dst: "admin", date: new Date().toString()} );
      // console.log("\n\n\thello3339...");

      // res.send({success: true, msg: "message to the admin - zero balance!!!!!"});
      // return;
    }

    Users.findOne({_id: req.body._id}, function (err, user) {
      if (err) {
        res.send({success: false, msg: "Server error"});
      } else if (!user) {
        res.send({success: false, msg: "User does not exist"});
      } else {
        wallet = new cryptobank.Wallet(req.user.privateKey, req.user.publicKey);
        wallet.send(chain, req.body.amount, user.publicKey, req.body.info).then(
          (walletSendResult) => {
            // console.log("\n hereeee = ", walletSendResult);
            if (!walletSendResult.isOk) {
              res.send({success: false, msg: walletSendResult.result});
            }
            else {
              io.sockets.emit("transaction", {
              text: "You got a new transaction", 
              dst: req.body._id,
              date: new Date().toString(),               
            });
              res.send({success: true, msg: "Transaction created"});
            }
          });
      }
    });
  })
}

async function exchangeMoneyMethod(exchangeFrom, exchangeTo, exchangeAmount) {

  var resOfILS;
  await fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${exchangeTo}&from=${exchangeFrom}&amount=${exchangeAmount}`, {headers: {"apikey": exchangeApiKey}})
  .then(response => response.text()).then(result => resOfILS = result).catch(error => console.log('error', error));
  return resOfILS;
}

async function getDollarAmount(req, res) {
  print("\n\t\tgetDollarAmount ");

  var dollarAmount = await convertFromLevCoinsToDollar(req);
  res.send({success: true, msg: dollarAmount});
}

async function convertFromLevCoinsToDollar(req) {
  var dollarAmount = await chain.valueOfLevCoinPerDollar() * await getBalance(req.user.publicKey);
  return dollarAmount;
}

async function getILSAmount(req, res) {
  print("\n\t\tgetILSAmount ");

  var dollarAmount = await convertFromLevCoinsToDollar(req);
  var exchangeResult = JSON.parse(await exchangeMoneyMethod("USD", "ILS", dollarAmount));
  var ILSResult = exchangeResult.result;
  
  res.send({success: true, msg: ILSResult});
}

async function getLevCoinsAmount(req, res) {
  print("\n\t\tgetLevCoinsAmount ");

  var levCoinAmount = await getBalance(req.user.publicKey);
  res.send({success: true, msg: levCoinAmount});
}

async function getUserTransactionsCommand(req, res) {
  print("\n\t\tgetUserTransactionsCommand ");

  var listOfTransactionsDetails = await getUserTransactions(req.user.publicKey);
  res.send({success: listOfTransactionsDetails.isOk, msg: listOfTransactionsDetails.result});
}

async function getUserTransactions(publicKey){
  // -+ amount, name of other user of transaction, and date.

  var listOfTransactionsDetails = [];

  var result = await chain.getBalanceAndTransactions({publicKey: publicKey});
  if (result.balance == -1) {
    // res.status(400).send({success: false, msg: "there is some error in the blockchain, can't complete the action !"});
    return { isOk: false, result: "there is some error in the blockchain, can't complete the action !" };
  }

  for (const element of result.Transactions) {
    if (publicKey == element.senderPublicKey) 
    { // if the user sent the transaction:
      const receiverUserName = await getUserDetailsByPublicKey(element.receiverPublicKey);
      listOfTransactionsDetails.push({"amount": -parseInt(element.amount), "member": receiverUserName.username, "info": element.info, "date": element.date, "timestamp": element.timestamp});
    }
    else
    { // if the user receive the transaction:
      const senderUserName = await getUserDetailsByPublicKey(element.senderPublicKey);
      listOfTransactionsDetails.push({"amount": parseInt(element.amount), "member": senderUserName.username, "info": element.info, "date": element.date, "timestamp": element.timestamp});
    }
  }
  return { isOk: true, result: listOfTransactionsDetails };
}

function getDayMonthYearAsNumber(optionIndex, time=Date.now()) {
  // optionIndex:
  // 0 = day.
  // 1 = month.
  // 2 = year.

  const currentDate = new Date(time);
  var currentDateAsList = currentDate.toLocaleDateString().split('.');
  var result = parseInt(currentDateAsList[optionIndex]);
  return result;
}

async function getTransactionsOfLastYear(req, res) {
  print("\n\t\tgetTransactionsOfLastYear ");


  const userPublicKey = req.user.publicKey;
  var lastYearChart = await transactionsChartOfLastYear(userPublicKey);
  res.send({success: true, msg: lastYearChart});
}

async function getTransactionsOfLastMonth(req, res) {
  print("\n\t\tgetTransactionsOfLastMonth ");


  const userPublicKey = req.user.publicKey;
  var lastMonthChart = await transactionsChartOfLastMonth(userPublicKey);
  res.send({success: true, msg: lastMonthChart});
}

async function getTransactionsOfLastWeek(req, res) {
  print("\n\t\tgetTransactionsOfLastWeek ");


  const userPublicKey = req.user.publicKey;
  var lastWeekChart = await transactionsChartOfLastWeek(userPublicKey);
  res.send({success: true, msg: lastWeekChart});
}

async function transactionsChartOfLastYear(publicKey) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthIndex = 1;
  const yearIndex = 2;

  var currentNumberOfMonth = getDayMonthYearAsNumber(monthIndex);
  var currentNumberOfYear = getDayMonthYearAsNumber(yearIndex);

  var specificMonthList =  monthNames.slice(currentNumberOfMonth).concat(monthNames.slice(0, currentNumberOfMonth));
  
  var startFromMonth = ((currentNumberOfMonth + 1) % 13) + parseInt(currentNumberOfMonth/12);

  if (startFromMonth == 1) 
  { // if we need to calculate only from 1 - 12 in the same year...
    var isFullYearOnly = true;
  }

  var transactionPerMonthList = new Array(12).fill(0);
  var transactionAmounts = await getUserTransactions(publicKey);

  // console.log("\n\n", transactionAmounts);

  for (const element of transactionAmounts.result) {
    const tempDate = new Date(element.timestamp);
    var tempDateAsList = tempDate.toLocaleDateString().split('.');
    var monthNumberOfTransaction = parseInt(tempDateAsList[monthIndex]);
    var yearNumberOfTransaction = parseInt(tempDateAsList[yearIndex]);

    var differenceBetweenYears = currentNumberOfYear - yearNumberOfTransaction;

    // if in a range of 1 year from now... and no need to calculate the all year....
    if (differenceBetweenYears == 1 && !isFullYearOnly) {
      if (monthNumberOfTransaction < startFromMonth)
      { // if we not in range of 12 months from today - continue to the next transaction...
        continue;
      }
    }
    else if (differenceBetweenYears > 1 || differenceBetweenYears != 0)
    { // if the transaction not in the same current year, or the difference is bigger than 1 - continue to the next transaction...
      continue;
    }

    tempAmount = parseInt(element.amount);
    transactionPerMonthList[monthNumberOfTransaction - 1] += tempAmount;
  }

  var specificTransactionAmountList =  transactionPerMonthList.slice(currentNumberOfMonth).concat(transactionPerMonthList.slice(0, currentNumberOfMonth));

  var result = {
    labels: specificMonthList,
    datasets: { label: "Your transactions this Year (per month): ", data: specificTransactionAmountList }
  }
  return result;
}

function getDaysInMonth(year, month)
{
  return new Date(year, month, 0).getDate();
}

async function transactionsChartOfLastMonth(publicKey) {
  
  const dayIndex = 0;
  const monthIndex = 1;
  const yearIndex = 2;

  var currentNumberOfMonth = getDayMonthYearAsNumber(monthIndex);
  var currentNumberOfYear = getDayMonthYearAsNumber(yearIndex);

  var previousMonthNumber = currentNumberOfMonth - 1;

  if (previousMonthNumber == 0) 
  { // if we in January, we want to see the December of the previous year...
    previousMonthNumber = 12;
    currentNumberOfYear -= 1;
  }

  var daysNumberInPreviousMonth = getDaysInMonth(currentNumberOfYear, previousMonthNumber);

  var daysInMonthList = [...Array(daysNumberInPreviousMonth).keys()].map(x => x + 1);
  
  var transactionPerDayInMonthList = new Array(daysNumberInPreviousMonth).fill(0);
  var transactionsList = await getUserTransactions(publicKey);

  for (const transaction of transactionsList.result) {
    const tempDate = new Date(transaction.timestamp);
    var tempDateAsList = tempDate.toLocaleDateString().split('.');
    var dayNumberOfTransaction = parseInt(tempDateAsList[dayIndex]);
    var monthNumberOfTransaction = parseInt(tempDateAsList[monthIndex]);
    var yearNumberOfTransaction = parseInt(tempDateAsList[yearIndex]);

    if (yearNumberOfTransaction != currentNumberOfYear || monthNumberOfTransaction != previousMonthNumber)
    { // if this transaction not in the proper month and year - will continue to next transaction...
      continue;
    }

    tempAmount = parseInt(transaction.amount);
    transactionPerDayInMonthList[dayNumberOfTransaction - 1] += tempAmount;
  }

  var result = {
    labels: daysInMonthList,
    datasets: { label: "Your transactions this Month (per day): ", data: transactionPerDayInMonthList }
  }
  return result;
}

async function transactionsChartOfLastWeek(publicKey) {
  var daysNumberToNamesList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const currentTimeStamp = Date.now();

  var lastWeekDatesKeeper = [];

  for (let i = 6; i >= 0; i--) 
  {
    let tempDate = new Date(currentTimeStamp);
    tempDate.setDate(tempDate.getDate() - i);
    lastWeekDatesKeeper.push(tempDate.toLocaleDateString());
  }
  const currentDate = new Date();

  var currentDayName = currentDate.toString().split(' ')[0];
  var currentDayNumber = daysNumberToNamesList.indexOf(currentDayName);
  var specificWeekList =  daysNumberToNamesList.slice(currentDayNumber+1).concat(daysNumberToNamesList.slice(0, currentDayNumber+1));

  var transactionPerDayInLastWeekList = new Array(7).fill(0);
  var transactionsList = await getUserTransactions(publicKey);

  for (const transaction of transactionsList.result) {
    const tempDate = new Date(transaction.timestamp);
    var tempDateAsList = tempDate.toLocaleDateString();

    var transactionDayName = tempDate.toString().split(' ')[0];
    var dayNumberOfTransaction = daysNumberToNamesList.indexOf(transactionDayName);

    if (lastWeekDatesKeeper.includes(tempDateAsList))
    {
      tempAmount = parseInt(transaction.amount);
      transactionPerDayInLastWeekList[dayNumberOfTransaction] += tempAmount;
    }
  }
  var specificTransactionPerDayList = transactionPerDayInLastWeekList.slice(currentDayNumber+1).concat(transactionPerDayInLastWeekList.slice(0, currentDayNumber+1));

  var result = {
    labels: specificWeekList,
    datasets: { label: "Your transactions this week (per day): ", data: specificTransactionPerDayList }
  }
  return result;
}

async function getTransactionsCharts(req, res) {
  print("\n\t\tgetTransactionsCharts ");


  const userPublicKey = req.user.publicKey;
  var lastYearChart = await transactionsChartOfLastYear(userPublicKey);
  var lastMonthChart = await transactionsChartOfLastMonth(userPublicKey);
  var lastWeekChart = await transactionsChartOfLastWeek(userPublicKey);

  const result = { "year": lastYearChart, "month": lastMonthChart, "week": lastWeekChart }

  res.send({success: true, msg: result}); 
}

function getTransactions(req, res) {
  print("\n\t\tgetTransactions ");


  chain.getBalanceAndTransactions({publicKey: req.user.publicKey}).then((result) => {
      res.send({success: true, msg: result.Transactions});
    }
  )
}

async function getBalance(publicKey) {
  var balance = await chain.getBalanceAndTransactions({publicKey: publicKey});
  // console.log("\n\n", balance, "\n\n");
  return balance.balance;
}

function getBalanceCommand(req, res) {
  print("\n\t\tgetBalanceCommand ");

  // var io = ioImporter.getIo();
  // // console.log("3:\n", io);
  // io.sockets.emit("message", {text:"hello3339..."} );
  
  chain.getBalanceAndTransactions({publicKey: req.user.publicKey}).then((result) => {
      // console.log("\n\nbalance = ", result.balance, "\n\n");

      if (result.balance == -1)
      {
        res.send({success: false, msg: "there is some error in the blockchain, can't complete the action !"});
      }
      else
      {
        res.send({success: true, msg: result.balance});
      }
    }
  )
}

function filterUserinfo(user) {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    isAdmin: user.isAdmin,
    isConfirmed: user.isConfirmed,
    image: user.image
  };
}

getDetails = function (req, res) {
  print("\n\t\tgetDetails ");


  Users.findOne({username: req.user.username},
    function (err, user) {
      if (err) {
        res.send({success: false, msg: "Server error"});
      } else if (!user) {
        res.send({success: false, msg: "User does not exist"});
      } else {
        res.send({success: true, msg: filterUserinfo(user)});
      }
    });
}

updateDetails = function (req, res) {
  print("\n\t\tupdateDetails ");

  Users.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        image: req.body.image,
      }}
  ).then(
    (user) => {
      res.send({success: true, msg: "User updated"});
    }
  )
}

async function getUsersAmount(req, res) {
  print("\n\t\tgetUsersAmount ");


  var UsersList = await Users.find({isConfirmed: true});
  res.send({success: true, msg: UsersList.length});
}

function getUserinfo(user) {
  return {
    username: user.username,
    email: user.email,
    publicKey: user.publicKey,
    firstName: user.firstName,
    lastName: user.lastName,
  };
}

async function getUserDetailsByPublicKey(publicKey) {

  // const systemPublicKey = fs.readFileSync("system_keys\\public.key", "utf8");
  const systemPublicKey = fs.readFileSync("system_keys/public.key", "utf8");

  // if the the given publicKey is the system publicKey:
  if (systemPublicKey == publicKey) {
    return {
      username: "-!-System-!-",
      email: "-!-System-!-",
      publicKey: publicKey,
      firstName: "-!-System-!-",
      lastName: "-!-System-!-",
    };
  }

  // var currentUser = await Users.find({publicKey: publicKey});
  var currentUser = await Users.findOne({publicKey: publicKey}).exec();
  return getUserinfo(currentUser);
}

module.exports = {
  // register,
  // logout,
  sendLoanRequest,
  rejectLoanCommand,
  rejectLoan,
  confirmLoan,
  getLoans,
  repayLoan,
  makeTransaction,
  getTransactions,
  getTransactionsOfLastYear,
  getTransactionsOfLastMonth,
  getTransactionsOfLastWeek,

  getTransactionsCharts,
  getUserTransactions,
  getUserTransactionsCommand,
  getBalance,
  getBalanceCommand,
  getDollarAmount, 
  getILSAmount,
  getLevCoinsAmount,
  getUsersAmount,
  getDetails,
  updateDetails
}
