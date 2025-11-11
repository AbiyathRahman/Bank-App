const express = require('express');
const accountsRoutes = express.Router();
const db = require('../db/conn');
const checkLogin = require('../util/checkAuth');
const { ObjectId } = require("mongodb");


accountsRoutes.route("/accounts").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    console.log(req.session.user.id);
    const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
    if(!user){
        return res.status(400).json({ message: "User not found"});
    }
    res.json({ accounts: user.accounts });
});

accountsRoutes.route("/accounts/:id").get(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
    if(!user){
        return res.status(400).json({ message: "User not found"});
    }
    const account = user.accounts.find(account => account.account_number === parseInt(req.params.id));
    if(!account){
        return res.status(400).json({ message: "Account not found"});
    }
    res.json({ account });
});

accountsRoutes.route("/update-name").post(checkLogin, async (req, res) => {
    const db_connect = db.getDb('bank');
    const { accName } = req.body;
    const accNum = 3;
    try{
        const user = await db_connect.collection('users').findOne({ _id: new ObjectId(req.session.user.id) });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        const account = user.accounts.find(account => account.account_number === accNum);
        if(!account){
            return res.status(400).json({ message: "Account not found"});
        }
        account.label = accName;
        await db_connect.collection('users').updateOne({ _id: new ObjectId(req.session.user.id) }, { $set: { accounts: user.accounts } });
        res.json({ message: "Account name updated"});
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});

    }
})

module.exports = accountsRoutes;