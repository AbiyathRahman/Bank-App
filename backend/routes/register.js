const express = require('express');
const crypto = require('crypto');
const registerRoutes = express.Router();

const db = require('../db/conn');

const passwordPolicy = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

registerRoutes.post('/register', async (req, res) => {
    try{
        let db_connect = db.getDb('bank');
        const { username, password, confirmPassword } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({ message: "Passwords do not match"});
        }
        if(!passwordPolicy.test(password)){
            return res.status(400).json({ message: "Password does not meet requirements"});
        }
        const existingUser = await db_connect.collection('users').findOne({ username });
        if(existingUser){
            return res.status(400).json({ message: "User already exists"});
        }
        const salt = crypto.randomBytes(16).toString('hex');
        let hash = function(str, salt){
            if(typeof(str) == 'string' && str.length > 0){
                let hash = crypto.createHmac('sha256', salt);
                let update = hash.update(str);
                let digest = update.digest('hex');
                return digest;
            }else{
                return false;
            }
        };
        let hashedPassword = hash(password, salt);
        const user = { username, password: hashedPassword, salt, accounts: [
            { account_number: 1, label: "Checking", balance: 0 },
            { account_number: 2, label: "Savings", balance: 0 },
            { account_number: 3, label: "Other", balance: 0 },
        ], transactions: [], categories: []};
        const result = await db_connect.collection('users').insertOne(user);
        req.session.user = { id: result.insertedId };
        res.status(201).json({ message: "User created successfully", user_id: result.insertedId, user: user });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

module.exports = registerRoutes;