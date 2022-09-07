var express = require('express');
const router = express.Router();
// const authorize = require('../utils/jwt-auth')
const authorize = require('../utils/authorize-handler');
const userController = require('../controllers/user.controller');

//user 
// get user by id, required fields: _id
router.get('/details', authorize(), userController.getDetails) //V
// update user by id in session, optional fields: firstName, lastName, email, username, password
router.post('/updateDetails', authorize(), userController.updateDetails)
// get balance of user by id in session
router.get('/getBalance', authorize(false, true), userController.getBalanceCommand) //V

// get transactions of user by id in session, as - and + per Transaction.
router.get('/getUserTransactions', authorize(false, true), userController.getUserTransactionsCommand)

// get transactions of user by id in session
router.get('/getTransactions', authorize(false, true), userController.getTransactions)

// get transactions of the last year (per month) of user by id in session
router.get('/getTransactionsOfLastYear', authorize(false, true), userController.getTransactionsOfLastYear)
// get transactions of the last month (per day) of user by id in session
router.get('/getTransactionsOfLastMonth', authorize(false, true), userController.getTransactionsOfLastMonth)
// get transactions of the last week (per day) of user by id in session
router.get('/getTransactionsOfLastWeek', authorize(false, true), userController.getTransactionsOfLastWeek)

// get transactions charts of the last year (per month) , last month (per day), week (per day) - of user by id in session.
router.get('/getTransactionsCharts', authorize(false, true), userController.getTransactionsCharts)

// make a transaction, required fields: amount, user _id To send...
router.post('/makeTransactions', authorize(false, true), userController.makeTransaction)
// send a loan request, required fields: info, amount, loanerId
router.post('/requestLoan', authorize(false, true), userController.sendLoanRequest)
// get loan requests of user by id in session
router.get('/getLoans', authorize(false, true), userController.getLoans)
// reject a loan request, required fields: loanId
router.post('/rejectLoan', authorize(false, true), userController.rejectLoanCommand)
// confirm a loan request, required fields: loanId
router.post('/confirmLoan', authorize(false, true), userController.confirmLoan)
// repay a loan, required fields: loanId
router.post('/repayLoan', authorize(false, true), userController.repayLoan)

// deprecated - have getBalance ... 
router.get('/getAmountInLevCoins', authorize(false, true), userController.getLevCoinsAmount)

router.get('/getAmountInILS', authorize(false, true), userController.getILSAmount)

router.get('/getAmountInDollar', authorize(false, true), userController.getDollarAmount)

router.get('/getUsersAmount', userController.getUsersAmount)

module.exports = router
