const express = require('express');
const loginRoutes = express.Router();
const db = require('../db/conn');
const crypto = require('crypto');

loginRoutes.route("/login").post(async (req, res) => {
    try{
        let db_connect = db.getDb('bank');
        const { username, password } = req.body;
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
        const user = await db_connect.collection('users').findOne({ username });
        if(!user){
            return res.status(400).json({ message: "User not found"});
        }
        let hashedPassword = hash(password, user.salt);
        if(user.password !== hashedPassword){
            return res.status(400).json({ message: "Incorrect password"});
        }
        req.session.user = { id: user._id };
        res.status(200).json({ message: "Login successful", user_id: user._id });
    }catch(error){
        console.log(error);
        res.status(500).json({ message: "Internal server error"});
    }
});

module.exports = loginRoutes;