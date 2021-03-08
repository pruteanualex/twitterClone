const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notificationSchema = new Schema({

    userTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    userFrom:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    notificationType:{
        type:String
    },
    opened:{
        type:Boolean,
        default:false
    },
    entityid:{
        type:mongoose.Schema.Types.ObjectId
    }  
}, { timestamps: true });

//New Things
notificationSchema.statics.insertNotification = async (userTo,userFrom,notificationType,entityid)=>{
    var data = {
        userTo:userTo,
        userFrom:userFrom,
        notificationType:notificationType,
        entityid:entityid 
    }
    await Notification.deleteOne(data).catch(error =>{
        console.log(error);
    });

    return Notification.create(data).catch(error =>{
        console.log(error);
    })
}

var Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;