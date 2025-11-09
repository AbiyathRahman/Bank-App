const express = require('express');
const transactionsRoutes = express.Router();
const db = require('../db/conn');
const checkLogin = require('../util/checkAuth');
const { ObjectId } = require("mongodb");
const { v4: uuid4 } = require('uuid');
transactionsRoutes.route("/transactions").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
    if(!user){
        return res.status(400).json({ message: "User not found"});
    }
    const transactions = {"transactions" : user.transactions.sort((a, b) => new Date(b.date) - new Date(a.date))};
    res.json(transactions);
});

// Get transactions for a specific account
transactionsRoutes.route("/transactions/accounts/:id").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    //const { account_number } = req.params.id;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        const account = user.accounts.find(
          (account) => account.account_number === parseInt(req.params.id)
        );
        if (!account) {
          return res.status(400).json({ message: "Account not found" });
        }
        const transactions = {"transactions" : user.transactions.filter(transaction => transaction.account_number === account.account_number).sort((a, b) => new Date(b.date) - new Date(a.date))
        };
        if(transactions.transactions.length === 0){
            return res.status(400).json({ message: "No transactions found"});
        }
        res.json(transactions);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }

});

// Get transactions for a specific type
transactionsRoutes.route("/transactions/type/:type").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { type } = req.params;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        if(!type){
            return res.status(400).json({ message: "Type is required. Such as deposit or withdrawal"});
        }
        const transactions = {"transactions" : user.transactions.filter(transaction => transaction.type === type).sort((a, b) => new Date(b.date) - new Date(a.date))
};
        if(transactions.transactions.length === 0){
            return res.status(400).json({ message: "No transactions found"});
        }
        res.json(transactions);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

// Get transactions for a specific category
transactionsRoutes.route("/transactions/category/:category").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { category } = req.params;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        if(!category){
            return res.status(400).json({ message: "Category is required"});
        }
        const transactions = {"transactions" : user.transactions.filter(transaction => transaction.category === category).sort((a, b) => new Date(b.date) - new Date(a.date))};
        if(transactions.transactions.length === 0){
            return res.status(400).json({ message: "No transactions found"});
        }
        res.json(transactions);
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

transactionsRoutes.route("/deposit").post(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { account_number, amount, category } = req.body;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        if(!category){
            return res.status(400).json({ message: "Category is required"});
        }
        const account = user.accounts.find(account => account.account_number === parseInt(account_number));
        if(!account){
            return res.status(400).json({ message: "Account not found"});
        }
        if (!user.categories.includes(category.toLowerCase())) {
        user.categories.push(category.trim().toLowerCase());
        }
        if (isNaN(amount) || amount <= 0) {
        return res
            .status(400)
            .json({ message: "Deposit amount must be a positive number." });
        }
        account.balance += parseInt(amount);
        const transaction = {
          id: uuid4(),
          date: new Date().toISOString(),
          account_number,
          amount,
          type: "deposit",
          category,
        };
        user.transactions.push(transaction);
        await db_connect.collection('users').updateOne({ _id: new ObjectId(req.session.user.id) }, { $set: { transactions: user.transactions, accounts: user.accounts, categories: user.categories } });
        res.json({ message: "Deposit successful", account });

    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
   
});

transactionsRoutes.route("/withdraw").post(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { account_number, amount, category } = req.body;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        const account = user.accounts.find(account => account.account_number === parseInt(account_number));
        if(!account){
            return res.status(400).json({ message: "Account not found"});
        }
        if (isNaN(amount) || amount <= 0) {
          return res
            .status(400)
            .json({ message: "WIthdrawal amount must be a positive number." });
        }
        if (!user.categories.includes(category.toLowerCase())) {
          user.categories.push(category.trim().toLowerCase());
        }
        if(account.balance < parseInt(amount)){
            return res.status(400).json({ message: "Insufficient funds"});
        }
        account.balance -= parseInt(amount);
        const transaction = {
          id: uuid4(),
          date: new Date().toISOString(),
          account_number,
          amount,
          type: "withdrawal",
          category,
        };
        user.transactions.push(transaction);
        await db_connect.collection('users').updateOne({ _id: new ObjectId(req.session.user.id) }, { $set: { accounts: user.accounts, transactions: user.transactions, categories: user.categories } });
        res.json({ message: "Withdrawal successful", account });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

transactionsRoutes.route("/transfer/internal").post(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { from_account_number, to_account_number, amount, category } = req.body;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        const from_account = user.accounts.find(account => account.account_number === parseInt(from_account_number));
        if(!from_account){
            return res.status(400).json({ message: "From account not found"});
        }
        if (parseInt(from_account_number) === parseInt(to_account_number)) {
          return res
            .status(400)
            .json({ message: "Cannot transfer to the same account." });
        }

        const to_account = user.accounts.find(account => account.account_number === parseInt(to_account_number));
        if(!to_account){
            return res.status(400).json({ message: "To account not found"});
        }
        if (isNaN(amount) || amount <= 0) {
          return res
            .status(400)
            .json({ message: "Transfer amount must be a positive number." });
        }
        if (!user.categories.includes(category.toLowerCase())) {
          user.categories.push(category.trim().toLowerCase());
        }
        if(from_account.balance < parseInt(amount)){
            return res.status(400).json({ message: "Insufficient funds"});
        }
        from_account.balance -= parseInt(amount);
        to_account.balance += parseInt(amount);
        const outgoing_transaction = { id: uuid4(),date: new Date().toISOString() ,account_number: from_account.account_number, amount, type: "transfer-out", category };
        const incoming_transaction = {
          id: uuid4(),
          date: new Date().toISOString(),
          account_number: to_account.account_number,
          amount,
          type: "transfer-in",
          category,
        };
        user.transactions.push(outgoing_transaction, incoming_transaction);
        await db_connect.collection('users').updateOne({ _id: new ObjectId(req.session.user.id) }, { $set: { accounts: user.accounts, transactions: user.transactions, categories: user.categories } });
        res.json({ message: "Transfer successful", from_account, to_account });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

transactionsRoutes.route("/transfer/external").post(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { receiverPublicID,from_account_number, to_account_number, amount, category } = req.body;
    try{
        const user = await db_connect.collection('users').findOne({_id: new ObjectId(req.session.user.id)});
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        const receiver = await db_connect.collection('users').findOne({ publicId: receiverPublicID});
        if(!receiver){
            return res.status(400).json({ message: "Receiver not found"});
        }
        if(receiver.publicId === user.publicId){
            return res.status(400).json({ message: "Cannot transfer to yourself"});
        }
        const from_account = user.accounts.find(account => account.account_number === parseInt(from_account_number));
        if(!from_account){
            return res.status(400).json({ message: "From account not found"});
        }
        const to_account = receiver.accounts.find(account => account.account_number === parseInt(to_account_number));
        if(!to_account){
            return res.status(400).json({ message: "To account not found"});
        }
        if (isNaN(amount) || amount <= 0) {
          return res
            .status(400)
            .json({ message: "Transfer amount must be a positive number." });
        }
        if (!user.categories.includes(category.toLowerCase())) {
          user.categories.push(category.trim().toLowerCase());
        }
        if (!receiver.categories.includes(category.toLowerCase())) {
          receiver.categories.push(category.trim().toLowerCase());
        }
        if(from_account.balance < parseInt(amount)){
            return res.status(400).json({ message: "Insufficient funds"});
        }
        from_account.balance -= parseInt(amount);
        to_account.balance += parseInt(amount);
        const outgoing_transaction = { id: uuid4(), date: new Date().toISOString() ,account_number: from_account.account_number, receiver: receiver.publicId,amount, type: "transfer-out", category };
        const incoming_transaction = {
          id: uuid4(),
          date: new Date().toISOString(),
          account_number: to_account.account_number,
          amount,
          sender: user.publicId,
          type: "transfer-in",
          category,
        };
        user.transactions.push(outgoing_transaction);
        receiver.transactions.push(incoming_transaction);
        await db_connect.collection('users').updateOne({ _id: new ObjectId(req.session.user.id) }, { $set: { accounts: user.accounts, transactions: user.transactions, categories: user.categories } });
        await db_connect.collection('users').updateOne({ publicId: receiverPublicID }, { $set: { accounts: receiver.accounts, transactions: receiver.transactions, categories: receiver.categories } });
        res.json({ message: "Transfer successful", from_account, to_account });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

module.exports = transactionsRoutes;

