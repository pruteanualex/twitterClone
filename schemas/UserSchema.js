const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String, default: "/images/profilePic.jpeg" },
    coverPhoto: { type: String },
    // Like Functionality 
    likes:[
        { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
        }
    ],
    retweets:[
        { 
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
        }
    ],
    following:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ],
    followers:[
        { 
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
}, { timestamps: true });

var User = mongoose.model('User', UserSchema);
module.exports = User;