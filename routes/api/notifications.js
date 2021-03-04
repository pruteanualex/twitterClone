const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/postsSchema');
const Chat = require('../../schemas/cheatSchema');
const Message = require('../../schemas/messageSchema');
const Notification = require('../../schemas/notificationSchema');



app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", async (req, res, next) => {
        Notification.find({userFrom:req.session.user._id, notificationType:{$ne:"newMessage"}})
        .populate("userTo")
        .populate("userFrom")
        .sort({createdAt:-1})
        .then(results=>{
                res.status(200).send(results)
        }).catch(error=>{
                console.log(error);
                res.sendStatus(400)
        });
});



module.exports = router;