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
const profileRoute = require('./routes/profileRoutes');
const uploadRoute = require('./routes/uploadRoutes');
const searchRoute = require('./routes/searchRoutes');
const messagesRoute = require('./routes/messagesRoutes');
//Api Routes
const postApiRoute = require('./routes/api/post');
const userApiRoute  = require('./routes/api/users');
const chatsApiRoute  = require('./routes/api/chats');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout",logOutRoute);
app.use("/posts", middleware.requireLogin,postRoute);
app.use("/profile", middleware.requireLogin,profileRoute);
app.use("/uploads",uploadRoute);
app.use("/search",middleware.requireLogin,searchRoute);
app.use("/messages",middleware.requireLogin,messagesRoute);

//Api Routes
app.use("/api/posts",postApiRoute);
app.use("/api/users",userApiRoute);
app.use("/api/chats", chatsApiRoute);




app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user)
    }
 
    res.status(200).render("home", payload);
})