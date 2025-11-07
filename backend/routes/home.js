const express = require('express');
const homeRoutes = express.Router();
const checkLogin = require('../util/checkAuth');

homeRoutes.route("/home").get(checkLogin, (req, res) => {
    res.json({message: "Welcome to the home page", user: req.session.user });
});

module.exports = homeRoutes;