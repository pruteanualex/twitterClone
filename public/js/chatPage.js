var typing = false;
var lastTypingTime;


$(document).ready(()=>{

    socket.emit('join room',chatId);
    socket.on("typing",()=>{
        $('.typingDots').show();
    })
    socket.on("stop typing",()=>{
        $('.typingDots').hide();
    })

    $.get(`/api/chats/${chatId}`, (data)=>{
        $('#chatName').text(getChatName(data));

    })

    $.get(`/api/chats/${chatId}/messages`,(data)=>{
        
        var messages = [];

        var lastSenderId = "";

        data.forEach((message,index) => {
            var html = createMessageHtml(message,data[index+1],lastSenderId);
            messages.push(html);

            lastSenderId = message.sender._id;
        });   
        
        var messagesHtml = messages.join(" ");
        addMessagesHtmlToPage(messagesHtml);
        scrollToBottom(false);
        $('.loadingSpinnerContainer').remove();
        $('.chatContainer').css("visibility","visible");
    })


});


$("#chatNameButton").click(()=>{
    var name = $("#chatNameTextBox").val().trim();

    $.ajax({
        url:`/api/chats/${chatId}`,
        type:"put",
        data:{chatName:name},
        success:(data,status,xhr) =>{
            if(xhr.status != 204){
                alert("Coud not update chat name");
            }
            else{
                location.reload();
            }
        }
    })
});


$(".sendMessageButton").click(()=>{
    messageSubmitted();
});



$(".inputTextBox").keydown((event)=>{
    
    updateTyping();

    if(event.which == 13 || event.keyCode == 13){
        messageSubmitted();
        return false;
    }
    
});

function updateTyping(){
    if(!connected) return;

    if(!typing){
        typing=true

        socket.emit("typing",chatId)
    }

    lastTypingTime = new Date().getTime();
    var timmerLength = 3000;

    setTimeout(()=>{
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timmerLength && typing){
                socket.emit("stop typing", chatId);
                typing = false;
            }

        },timmerLength
    );
    
}

function addMessagesHtmlToPage(html){
     $(".chatMessages").append(html);

     //TODO: SCROLL TO BOTTOM
}




function messageSubmitted(){
    var content = $('.inputTextBox').val().trim();
    
    if(content != ""){
        sendMessage(content)
        $('.inputTextBox').val("");
        socket.emit("stop typing", chatId);
        typing = false;
    }
}


function sendMessage(content) {
    $.post("/api/messages", { content: content, chatId: chatId }, (data, status, xhr) => {
        if(xhr.status != 201){
            alert('Could not send message')
            $('.inputTextBox').val(content);
            return;
        }
        addChatMessageHtml(data);
       
       if(connected) {
            socket.emit("new message", data);
        }
    })
}


function addChatMessageHtml(message){
    if(!message || !message._id){
        alert("Message is not valid");
        return;
    }

    var messageDiv = createMessageHtml(message,null,"");
    addMessagesHtmlToPage(messageDiv);
    scrollToBottom(true);
    
}


function createMessageHtml(message,nextMessage,lastSenderId){

    var sender = message.sender;
    var senderName = sender.firstName + " " + sender.lastName;

    var currentSenderid = sender._id;
    var nextSenderId = nextMessage != null ? nextMessage.sender._id : "";

    var isFirst  =  lastSenderId != currentSenderid;
    var isLast = nextSenderId != currentSenderid;

    
    var isMine = message.sender._id == userLoggedInData._id;
    var liClassName = isMine ? "mine" : "theirs"
    
    var nameElement = '';
    if(isFirst){
        liClassName += " first";
        
        if(!isMine){
            nameElement=`<span class="senderName">${senderName}</span>`
        }
    }

    var profileImage = "";
    if(isLast){
        liClassName += " last";
        profileImage=`<img src="${sender.profilePic}"></img>`;
    }
    
    var imageContainer = "";
    if(!isMine){
        imageContainer=`<div class="imageContainer">
                            ${profileImage}
                        </div>`;
    }

    return `<li class="message ${liClassName}">
                ${imageContainer}
                <div class="messageContainer">
                    <span class="senderName">${nameElement}</span>
                    <span class="messageBody">
                        ${message.content}
                    </span>
                </div>
            </li>`;
}


function scrollToBottom(animated){
    var container = $('.chatMessages');
    var scrollHeight = container[0].scrollHeight;

    if(animated){
        container.animate({scrollTop:scrollHeight},"slow");
    }
    else{
        container.scrollTop(scrollHeight);
    }
}