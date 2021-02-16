const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/postsSchema');



app.use(bodyParser.urlencoded({ extended: false }));

router.put ("/:userId/fallow", async(req, res, next) => {

    res.status(200).send('test')
});

module.exports = router;