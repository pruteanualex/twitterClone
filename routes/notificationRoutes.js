const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const Chat = require('../schemas/cheatSchema');
const Notification = require('../schemas/notificationSchema');


router.get("/", (req, res, next) => {

    
    
    res.status(200).render("notificationPage",{
        pageTitle:"Notification",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user)
    });
});


   


module.exports = router;