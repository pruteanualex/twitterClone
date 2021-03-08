$(document).ready(()=>{
    $.get("/api/notifications",(data)=>{
        outputNotificationList(data,$(".resultsContainer"));
    })
})

$('#markNotificationsAsRead').click(()=>{
    markNotificationAsOpened();
})

function outputNotificationList(notifications,container){
    notifications.forEach( (notification)=>{
        var html = createNotificationHtml(notification);

        container.append(html)
    });
    if(notifications.length == 0){
        container.append("<span class='noResults'>Nothing to show</span>");
    }
}


function createNotificationHtml(notification){
    var userFrom = notification.userFrom;
    var text = getnotificationText(notification);
    var href = getnotificationUrl(notification);

    var className = notification.opened ? "" : "active";

    return `<a href="${href}" target="_self" class="resultListItem notification ${className}" data-id="${notification._id}">
        <div class="resultsImageContainer">
            <img src="${userFrom.profilePic}">
        </div>    
        <div class="resultsDetailsContainer ellipsis">
            ${text}
        </div>
    </a>`;

}


function getnotificationText(notification){
    var userFrom = notification.userFrom; 
    if(!userFrom.firstName || !userFrom.lastName){
        return alert("user from not populated");
    }

    var userFromName = `${userFrom.firstName} ${userFrom.lastName}`;

    var text;

    if(notification.notificationType == "postLike"){
        text = `${userFromName} liked one of your posts`
    }

    if(notification.notificationType == "replay"){
        text = `${userFromName} replay to one of your posts`
    }

    if(notification.notificationType == "fallow"){
        text = `${userFromName} fallowed you`
    }

    return `<span class="ellipsis">${text}</span>`
}   




function getnotificationUrl(notification){
    
    var url = "#";

    if(notification.notificationType == "postLike" || notification.notificationType == "replay"){
        url = `/posts/${notification.entityid}`
    }else if(notification.notificationType == "fallow"){
        url = `/profile/${notification.entityid}`;
    }

    return url
}  
