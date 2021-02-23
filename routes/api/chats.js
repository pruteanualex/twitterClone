const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/postsSchema');
const Chat = require('../../schemas/cheatSchema');



app.use(bodyParser.urlencoded({ extended: false }));

router.post("/", async (req, res, next) => {
    //Check if exist value in req.body
    if(!req.body.users) {
        console.log("Users param not sent with request");
        return res.sendStatus(400);
    }
    //Convert user data from string in boject
    var users = JSON.parse(req.body.users);
    //Check if array has any value
    if(users.length == 0) {
        console.log("Users array is empty");
        return res.sendStatus(400);
    }
    //Ad my id in the group chat array
    users.push(req.session.user);
    //data which will be push in db
    var chatData = {
        users: users,
        isGroupChat: true
    };
    //Push in db
    Chat.create(chatData)
    .then(results => res.status(200).send(results))
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
})

router.get("/", async (req, res, next) => {
    await Chat.find({users:{ $elemMatch:{$eq: req.session.user._id} }})
    .populate("users")
    .then(results =>{
        res.status(200).send(results)
    }).catch(error =>{
        console.log(error);
        res.sendStatus(400);
    })
});


module.exports = router;