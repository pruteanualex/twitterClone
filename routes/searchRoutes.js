const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');


router.get("/", (req, res, next) => {

    var payload = createPyloads(req.session.user);
    
    res.status(200).render("searchPage", payload);
});



router.get("/:selectedTab", (req, res, next) => {

    var payload = createPyloads(req.session.user);
    payload.selectedTab = req.params.selectedTab;
    
    res.status(200).render("searchPage", payload);
});


function createPyloads(userLoggedIn){
        return {
        pageTitle:"Search",
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    }
}
   


module.exports = router;