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
//Install Socket IO
const io = require('socket.io')(server,{pingTimeout:60000});

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
const notificationRoute = require('./routes/notificationRoutes');

//Api Routes
const postApiRoute = require('./routes/api/post');
const userApiRoute  = require('./routes/api/users');
const chatsApiRoute  = require('./routes/api/chats');
const messageApiRoute = require('./routes/api/messages');
const notificationApiRoute = require('./routes/api/notifications');

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout",logOutRoute);
app.use("/posts", middleware.requireLogin,postRoute);
app.use("/profile", middleware.requireLogin,profileRoute);
app.use("/uploads",uploadRoute);
app.use("/search",middleware.requireLogin,searchRoute);
app.use("/messages",middleware.requireLogin,messagesRoute);
app.use("/notifications",middleware.requireLogin,notificationRoute);

//Api Routes
app.use("/api/posts",postApiRoute);
app.use("/api/users",userApiRoute);
app.use("/api/chats", chatsApiRoute);
app.use("/api/messages",messageApiRoute);
app.use("/api/notifications",notificationApiRoute);



app.get("/", middleware.requireLogin, (req, res, next) => {

    var payload = {
        pageTitle: "Home",
        userLoggedIn:req.session.user,
        userLoggedInJs:JSON.stringify(req.session.user)
    }
 
    res.status(200).render("home", payload);
})


io.on("connection",(socket)=>{
    
    socket.on("setup",(userData)=>{
        socket.join(userData._id);
        socket.emit("connected")
    })

    socket.on('join room', (room)=>{
        socket.join(room);
    });

    socket.on('typing', (room)=>{
        socket.in(room).emit('typing');
    });

    socket.on('stop typing',(room)=>{
        socket.in(room).emit('stop typing');
    });
    //Room is user id
    socket.on("notification recived",(userId)=> socket.in(userId).emit("notification recived"))
    //Dose not work because user.id is undefinde
    //Answer message.js controller
    socket.on('new message',(newMessage)=>{
        var chat = newMessage.chat;
        if(!chat.users) return console.log('Chat.users not defined')
        chat.users.forEach(user => {
            if(user._id == newMessage.sender._id) return;
            socket.in(user._id).emit('message received',newMessage);
        });
    })

});