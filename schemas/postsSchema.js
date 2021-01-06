const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
    content:{
        type:String,
        required:true,
        trim:true
    },
    postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    pinned:Boolean,
    // Like Functionality 
    likes:[
        { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],
    //Retweet Functionality
    rewteetUsers:[
        { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],
     //Retweet Functionality
    rewteetData:{ type:mongoose.Schema.Types.ObjectId,ref:'Post'},
    replayTo:{ type:mongoose.Schema.Types.ObjectId,ref:'Post'}
    

},{timestamps:true});




const  Post = mongoose.model('Post', PostSchema);
module.exports = Post;