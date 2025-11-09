const express = require('express');
const summaryRoutes = express.Router();
const db = require('../db/conn');
const checkLogin = require('../util/checkAuth');
const { ObjectId } = require("mongodb");

summaryRoutes.route("/summary").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        const transactions = user.transactions;
        const totalDeposits = transactions.filter(transaction => transaction.type === "deposit").reduce((total, transaction) => total + transaction.amount, 0);
        const totalWithdrawals = transactions.filter(transaction => transaction.type === "withdrawal").reduce((total, transaction) => total + transaction.amount, 0);
        const totalTransfersReceived = transactions.filter(transaction => transaction.type === "transfer-in").reduce((total, transaction) => total + transaction.amount, 0);
        const totalTransfersSent = transactions.filter(transaction => transaction.type === "transfer-out").reduce((total, transaction) => total + transaction.amount, 0);
        const totalBalanceByAccounts = user.accounts.map(accounts => {
            return{
                label: accounts.label,
                balance: accounts.balance
            }
        });
        const spendingByCategory = user.categories.map(category => {
            return{
                label: category,
                total: transactions.filter(transaction => transaction.category?.toLowerCase() === category.toLowerCase()).reduce((total, transaction) => total + transaction.amount, 0)
            }
        })
        res.json({ totalDeposits, totalWithdrawals, totalTransfersReceived, totalTransfersSent ,totalBalanceByAccounts, spendingByCategory });
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
    
});

module.exports = summaryRoutes;