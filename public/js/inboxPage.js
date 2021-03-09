$(document).ready(()=>{
    $.get("/api/chats",(data,status,xhr)=>{
        if(xhr.status == 400){
            alert('Could not get chat list');
        }
        else{
            outputChatList(data,$('.resultsContainer'));
        }

    })
});

function outputChatList(chatList, container){
    chatList.forEach(chatItem => {
        var html = createChatHtml(chatItem);
        container.append(html);
    });
    if(chatList.length == 0){
        container.append("<span class='noResults'>Nothing to show</span>");
    }
}
// function createChatHtml(chatData){
//     var chatName = getChatName(chatData);
//     var image = getChatImageElements(chatData);
//     var latestMessage = getLatestMessage(chatData.latesMessage);

//     return `<a class="resultListItem"  href='/messages/${chatData._id}'>
//                 ${image}
//                 <div class="resultsDetailsContainer">
//                     <span class="heading ellipsis">${chatName}</span>
//                     <span class="subText ellipsis">${latestMessage}</span>
//                 </div>
//             </a>`

// }

// function getLatestMessage(latesMessage){
//     if(latesMessage != null){
//         var sender = latesMessage.sender;
//         return `${sender.firstName} ${sender.lastName}: ${latesMessage.content}`
//     }

//     return "New chat";
// }

// function getChatName(chatData){
//     var chatName = chatData.chatName;
//     if(!chatName){
//         var otherChatUsers = getOtherChatsUsers(chatData.users);
//         var namesArray = otherChatUsers.map(user =>user.firstName + " " + user.lastName);
//         chatName =  namesArray.join(", ");
//     }
//     return chatName;
// }

// function getOtherChatsUsers(users){
//     if(users.length == 1) return users;

//     return users.filter((user)=>{
//         return user._id != userLoggedInData._id;
//     });

// }


// function getChatImageElements(chatData){
//     var otherChatUsers =  getOtherChatsUsers(chatData.users);
    
//     var groupChatClass = "";
//     var chatImage = getUserChatImageElement(otherChatUsers[0]); 
//     if(otherChatUsers.length > 1){
//         groupChatClass = "groupChatImage";
//         chatImage += getUserChatImageElement(otherChatUsers[1]); 
//     }

//     return `<div class="resultsImageContainer ${groupChatClass}">${chatImage}</div>`;
// }

// function getUserChatImageElement(user){
//     if(!user || !user.profilePic){
//         return alert('User passed intro function is invalid');
//     } 

//     return `<img  src="${user.profilePic}" alt="Users profile pic">`;
// }