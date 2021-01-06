const express = require('express');
const app = express();
const port = 3003;
const middleware = require('./middleware')
const path = require('path')
const dotenv = require('dotenv');
const bodyParser = require("body-parser")
const mongoose = require("./database");
const session = require("express-session");
dotenv.config({path:'./config.env'});

const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: false
}))

//View Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logOutRoute = require('./routes/logout');
const postRoute = require('./routes/postRootes');
//Api Routes
const postApiRoute = require('./routes/api/post');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout",logOutRoute);
app.use("/api/posts",postApiRoute);
app.use("/posts", middleware.requireLogin,postRoute);


app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user)
    }
 
    res.status(200).render("home", payload);
})