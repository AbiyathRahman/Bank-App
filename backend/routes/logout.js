const express = require("express");

const logoutRoute = express.Router();

logoutRoute.route("/logout").post((req, res) => {
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({ error: "Could not log out" });
        }
        res.clearCookie("connect.sid");
        res.json({message: "user logged out!"});
    });
});

module.exports = logoutRoute;
