const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const User = require('../../schemas/UserSchema');
const Post = require('../../schemas/postsSchema');



app.use(bodyParser.urlencoded({ extended: false }));


router.get("/", async (req, res, next) => {

    var searchObj = req.query;
    
    if(searchObj.isReply !== undefined) {
        var isReply = searchObj.isReply == "true";
        searchObj.replyTo = { $exists: isReply };
        delete searchObj.isReply;
    }

    // if(searchObj.followingOnly !== undefined) {
    //     var followingOnly = searchObj.followingOnly == "true";

    //     if(followingOnly) {
    //         var objectIds = [];
            
    //         if(!req.session.user.following) {
    //             req.session.user.following = [];
    //         }

    //         req.session.user.following.forEach(user => {
    //             objectIds.push(user);
    //         })

    //         objectIds.push(req.session.user._id);
    //         searchObj.postedBy = { $in: objectIds };
    //     }
        
    //     delete searchObj.followingOnly;
    // }

    var results = await getPosts(searchObj);
    res.status(200).send(results);
})


router.get("/:id", async (req, res, next) => {

    var postId = req.params.id;

    var postData = await getPosts({ _id: postId });
    postData = postData[0];

    var results = {
        postData: postData
    }

    if(postData.replyTo !== undefined) {
        results.replyTo = postData.replyTo;
    }


    results.replies = await getPosts({ replyTo: postId });

    res.status(200).send(results);
})





router.post("/", async(req, res, next) => {
   
   
   if(!req.body.content){
       console.log('Content param not sent with request');
       return res.sendStatus(400)
   }
   var postData ={
        content:req.body.content,
        postedBy:req.session.user
   } 

   if(req.body.replayTo){
       postData.replayTo = req.body.replayTo;
       

   }


    Post.create(postData)
        .then(async(newPost)=>{

            newPost = await User.populate(newPost,{
                path:'postedBy'
            })
            res.status(201).send(newPost)
        })
        .catch((error)=>{
            console.log(error);
            res.sendStatus(400)
        });
   
   
});

//Add user liked post in his schema 
router.put("/:id/like", async(req, res, next) => {

    //get post id 
    const postId = req.params.id;
    //get user id 
    const userId = req.session.user._id;
    //Get value of likes from db and check if in that array isclude id of the post taht user choice
    const isLiked = req.session.user.likes  && req.session.user.likes.includes(postId);
    //Options if value exist will remove and if is not included will inser posts 
    const  option = isLiked ? "$pull" : "$addToSet";
    /**
     * dislike and like 
     */
    //****************************************//
    //Insert User Like
    //****************************************//
    req.session.user =  await User.findByIdAndUpdate(userId,
        {
            [option]:{
                likes:postId
            }
        }
        ,{
        new:true
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });
    //****************************************//
    //Insert Post Like
    //****************************************//
    const  post  =  await Post.findByIdAndUpdate(postId,
        {
            [option]:{
                likes:userId
            }
        }
        ,{
        new:true
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    });


    res.status(200).send(post)
});


async function getPosts(filter) {
    var results = await Post.find(filter)
    .populate("postedBy")
    .populate("replayTo")
    .sort({ "createdAt": -1 })
    .catch(error => console.log(error))
    results = await User.populate(results,{path:"replayTo.postedBy"});
    return await results;
}


module.exports = router;