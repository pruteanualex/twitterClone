//Globals
var cropper;
var timer;
var selectedUsers = [];


$('#postTextarea,#replayTextarea').keyup((event)=>{

    event.preventDefault();
    var textBox  = $(event.target);
    var value = textBox.val().trim();
    //check if buton has inside a element with class
    var isModal = textBox.parents(".modal").length == 1
    
    var submitButton = isModal ? $('#submitReplayButton') : $('#submitPostButton');
    
    if(submitButton.length == 0) return alert('No submit button find');

    if(value == ""){
        submitButton.prop('disabled',true);
        return;
    }
    submitButton.prop('disabled',false);
});



///////////////////////////////////////////////////
$("#submitPostButton,#submitReplayButton").click((ev)=>{
    var button  = $(ev.target);

    var isModal = button.parents(".modal").length == 1
    var textBox = isModal ? $('#replayTextarea') : $('#postTextarea');

    var data = {
        content:textBox.val()
    }
   
    if(isModal){
        var id = button.data().id;
        if(id == null) return('Buton Id is null')
        data.replayTo = id;
    }

    $.post("/api/posts",data,(postData)=>{
     
      if(postData.replayTo){
          location.reload();
      }else{

      
        var html = createPostHtml(postData);
        $('.postContainer').prepend(html);
        textBox.val("");
        button.prop('disabled',true)
      }
    });


});


// Fallowing/Fallowers
$(document).on("click", ".followButton", (e) => {
    var button = $(e.target);
    var userId = button.data().user;
    
    $.ajax({
        url: `/api/users/${userId}/follow`,
        type: "PUT",
        success: (data,status,xhr) => {   
           if(xhr.status == 404){
               alert('User not found');
                return;
           }
            
           var diference = 1;
            if(data.following && data.following.includes(userId)) {
                button.addClass("following");
                button.text('Following')
            }
            else {
                button.removeClass("following");
                button.text('Follow')
                diference = -1;
            }


            var fallowersLabel = $('#fallowersVal');
            if(fallowersLabel.length != 0){
              var falowersText =  fallowersLabel.text();
              falowersText = parseInt(falowersText);
              fallowersLabel.text(falowersText + diference);
            }

        }
    })
});




//Cropper JS
const croppUserProfieImg = document.getElementById('filePhoto');
if(croppUserProfieImg){
croppUserProfieImg.addEventListener('change',function(event){
    // var input = $(event.target);
    
    if(this.files && this.files[0]){
        var reader = new FileReader();
        reader.onload = (e)=>{
            var image = document.getElementById('imagePreview');
            image.src =e.target.result;

           if(cropper !== undefined){
                cropper.destroy()
           }
        
           cropper = new  Cropper(image,{
             aspectRatio: 1 / 1,
             background:false
           })

        }

        reader.readAsDataURL(this.files[0]);
    }else{
        console.log('none');
    }
  });
}

$('#imageUploadButton').click(()=>{
    var canvas = cropper.getCroppedCanvas();

    if(canvas == null){
        console.log('Could not upload image. Make sure it is an image file');
        return;
    }


    canvas.toBlob((blob)=>{
        var formData = new FormData();
        formData.append('croppedImage',blob);

        $.ajax({
            url:'/api/users/profilePicture',
            type:'POST',
            data:formData,
            processData:false,
            contentType:false,
            success:()=>{
                location.reload();
            }
        })
    });
})




//Cropper JS
const croppUserCoverImg = document.getElementById('coverPhoto');
if(croppUserCoverImg){
    croppUserCoverImg.addEventListener('change',function(event){
    // var input = $(event.target);
    
    if(this.files && this.files[0]){
        var reader = new FileReader();
        reader.onload = (e)=>{
            var image = document.getElementById('coverPreview');
            image.src =e.target.result;

           if(cropper !== undefined){
                cropper.destroy()
           }
        
           cropper = new  Cropper(image,{
             aspectRatio: 16 / 9,
             background:false
           })

        }

        reader.readAsDataURL(this.files[0]);
    }else{
        console.log('none');
    }
  });
}

$('#coverUploadButton').click(()=>{
    var canvas = cropper.getCroppedCanvas();

    if(canvas == null){
        console.log('Could not upload image. Make sure it is an image file');
        return;
    }


    canvas.toBlob((blob)=>{
        var formData = new FormData();
        formData.append('croppedCoverPhoto',blob);

        $.ajax({
            url:'/api/users/coverPhoto',
            type:'POST',
            data:formData,
            processData:false,
            contentType:false,
            success:()=>{
                location.reload();
            }
        })
    });
})




function createPostHtml(postData){
    var postedBy = postData.postedBy;
    //console.log(postedBy)
    if(postedBy._id === undefined){
        return console.log('User object not populated')
    }
    var displayName = postedBy.firstName + " " + postedBy.lastName;
    var timestmp =timeDifference(new Date(),new Date(postData.createdAt));
    
    var likeButtonActiveClass = postData.likes.includes(userLoggedInData._id) ? "active":"";
    
    var replayFlag = "";
    if(postData.replayTo){
        if(!postData.replayTo._id){
            return 'replay to is not populated';
        }else if(!postData.replayTo.postedBy._id){
           
            return 'Posted by  is not populated';
            
        }
       
        var replayToUsername = postData.replayTo.postedBy.username;
        replayFlag = `<div class="replayFlag">
            Replaying to <a href="/profile/${replayToUsername}">@${replayToUsername}</a>
        </div>`
    }

    var buttons = "";
    if(postData.postedBy._id  == userLoggedInData._id){
        var pinnedClass = "";
        var pinnedPostText = "";
        var dataTarget = "#confirmPinModal"
        if(postData.pinned === true){
            pinnedClass ="active";
            dataTarget ="#unPinModal";
            pinnedPostText = "<i class='fa fa-thumbtack'></i> <span>Pinned post</span>";
        }

        buttons = `
            <button class='pinButton ${pinnedClass}' data-id="${postData._id}" data-toggle="modal" data-target ="${dataTarget}"><i class="fa fa-thumbtack"></i></button>
            <button data-id="${postData._id}" data-toggle="modal" data-target ="#deletePostModal"><i class="fa fa-times"></i></button>`;
    }
    return `<div class="post" data-id="${postData._id}">
                <div class="mainContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
                        <div class="pinnedPostText">${pinnedPostText}</div>
                        <div class="postHeader">
                            <a href="/profile/${postedBy.username}">${displayName}</a>
                            <span class="username">@${postedBy.username}</span>
                            <span class="username">${timestmp}</span>
                            ${buttons}    
                        </div>
                        ${replayFlag}
                        <div class="postBody">
                            <span>${postData.content}</span>
                        </div>
                        <div class="postFooter">
                            <div class='postButtonContainer'>
                                <button data-toggle="modal" data-target="#replayModal">
                                    <i class='far fa-comment'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer green'>
                                <button class="retweetButton">
                                    <i class='fas fa-retweet'></i>
                                </button>
                            </div>
                            <div class='postButtonContainer red'>
                                <button class='likeButton ${likeButtonActiveClass}'>
                                    <i class='far fa-heart'></i>
                                    <span>${postData.likes.length || ""}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
}




function outputUsers(results,container){
    container.html("");

    if(results.length == "" || results.length == 0){
        container.append('<span class="noResults">No results found</span>')
    }else{

    results.forEach(results => {
       var html =createUserHtml(results,true);
       container.append(html);
    });
}

}



function createUserHtml(userData, showFollowButton) {
    var userLoggedIn = userLoggedInData;

    var name = userData.firstName + " " + userData.lastName;
    var isFollowing = userLoggedIn.following && userLoggedIn.following.includes(userData._id);
    var text = isFollowing ? "Following" : "Follow"
    var buttonClass = isFollowing ? "followButton following" : "followButton"

    var followButton = "";
    if (showFollowButton && userLoggedIn._id != userData._id) {
        followButton = `<div class='followButtonContainer'>
                            <button class='${buttonClass}' data-user='${userData._id}'>${text}</button>
                        </div>`;
    }

    return `<div class='user'>
                <div class='userImageContainer'>
                    <img src='${userData.profilePic}'>
                </div>
                <div class='userDetailsContainer'>
                    <div class='header'>
                        <a href='/profile/${userData.username}'>${name}</a>
                        <span class='username'>@${userData.username}</span>
                    </div>
                </div>
                ${followButton}
            </div>`;
}









//Has 2 parameters
function timeDifference(current, previous) {

    //Unite time value    
    var msPerMinute = 60 * 1000;
    var msPerHour = msPerMinute * 60;
    var msPerDay = msPerHour * 24;
    var msPerMonth = msPerDay * 30;
    var msPerYear = msPerDay * 365;

    //epased = diferences between current and prv time 
    var elapsed = current - previous;

    if (elapsed < msPerMinute) {
        if(elapsed / 1000 < 30){
            return 'Just now'
        }
         return Math.round(elapsed/1000) + ' seconds ago';   
    }

    else if (elapsed < msPerHour) {
         return Math.round(elapsed/msPerMinute) + ' minutes ago';   
    }

    else if (elapsed < msPerDay ) {
         return Math.round(elapsed/msPerHour ) + ' hours ago';   
    }

    else if (elapsed < msPerMonth) {
        return  Math.round(elapsed/msPerDay) + ' days ago';   
    }

    else if (elapsed < msPerYear) {
        return  Math.round(elapsed/msPerMonth) + ' months ago';   
    }

    else {
        return  Math.round(elapsed/msPerYear ) + ' years ago';   
    }
}

/***************************************************************/
// Like Functionality
$(document).on("click",".likeButton",(like)=>{
   var button_like = $(like.target);

   var postId =getPostIdFromElement(button_like);
  
    if(postId === undefined) return;
    
    $.ajax({
        url:`/api/posts/${postId}/like`,
        type:"PUT",
        success:(postData)=>{
            button_like.find('span').text(postData.likes.length || "");

            if(postData.likes.includes(userLoggedInData._id)){
                button_like.addClass('active')
            }else{
                button_like.removeClass('active')
            }
        }
    });

});


$(document).on("click",".post",(like)=>{
    var element = $(like.target);
    var postId =getPostIdFromElement(element);

    if(postId !== undefined && !element.is("button")){
        window.location.href = '/posts/' + postId;
    }
 });
 

//Comment Functionality
$('#replayModal').on('show.bs.modal',(event)=>{
    var button_replay = $(event.relatedTarget);//Get Button
    
    var postId =getPostIdFromElement(button_replay);
    $('#submitReplayButton').data('id',postId);
  
    $.get("/api/posts/"+ postId,(results)=>{
    
    outPutPosts(results.postData,$('#originalPostsContainer'))
  });
    
});


$('#replayModal').on('hidden.bs.modal',(event)=>{
    $('#originalPostsContainer').html="";
    
});
$("#deletePostModal").on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);
    $("#deletePostButton").data("id", postId);
    
    console.log($("#deletePostButton").data().id);

    // $.get("/api/posts/" + postId, results => {
    //     outputPosts(results.postData, $("#originalPostContainer"));
    // })
})


//Pin Post
$("#confirmPinModal").on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);
    $("#pinPostdButton").data("id", postId);

});

//Un Pin Post 
$("#unPinModal").on("show.bs.modal", (event) => {
    var button = $(event.relatedTarget);
    var postId = getPostIdFromElement(button);
    $("#unpinPostdButton").data("id", postId);

});

//Pin Post Ajax
$('#pinPostdButton').click((event)=>{
    var postId = $(event.target).data('id');

    $.ajax({
        url:`/api/posts/${postId}`,
        type:'PUT',
        data:{pinned:true},
        success:(data,status,xhr) =>{

            if(xhr.status != 204){
                alert('coud not pin the post');
                return;
            }

            location.reload();

        }
    });
})



//Un Pin Post Ajax
$('#unpinPostdButton').click((event)=>{
    var postId = $(event.target).data('id');

    $.ajax({
        url:`/api/posts/${postId}`,
        type:'PUT',
        data:{pinned:false},
        success:(data,status,xhr) =>{

            if(xhr.status != 204){
                alert('coud not pin the post');
                return;
            }

            location.reload();

        }
    });
})


//////////////////////////////////////////////////////////////////
//Chat Functionality  Code Must To Fallow

$('#userSearchTextbox').keydown((event)=>{
    clearTimeout(timer);
    var textBox = $(event.target);
    var value = textBox.val();

    if(value == "" && (event.which == 8 || event.keyCode == 8)){
        //Remove Elements From Chat
        selectedUsers.pop();
        updateSelectedUsersHTML();
        $('.resultsContainer').html("");
        
        if(selectedUsers.length == 0){
            $('#createChatButton').prop("disabled",true);
        }
        return;
    }

    timer = setTimeout(()=>{
        value = textBox.val().trim();
        if(value == ""){
            $('.resultsContainer').html("");
        }else{
            searchUsers(value);
        }
    },1000);
});

function searchUsers(searchTerm){
    $.get("/api/users",{search:searchTerm},results =>{
        outputSelectableUsers(results,$('.resultsContainer'));
    });
}


function outputSelectableUsers(results,container){
    container.html("");

    if(results.length == "" || results.length == 0){
        container.append('<span class="noResults">No results found</span>')
    }else{

        results.forEach(results => {

        if(results._id == userLoggedInData._id || selectedUsers.some(u => u._id == results._id)){
            return;
        }    

        var html =createUserHtml(results,false);
        var element = $(html);
        element.click(()=>userSelected(results))
        container.append(element);
        });
    }

}
function userSelected(user){
    selectedUsers.push(user);  
    updateSelectedUsersHTML(user);
    $('#userSearchTextbox').val("").focus();
    $('.resultsContainer').html('');
    $('#createChatButton').prop("disabled",false);
}


function updateSelectedUsersHTML(){
    var elements = [];

    selectedUsers.forEach(user =>{
        var name = user.firstName + " " + user.lastName;
        var userElement = $(`<span class="selectedUser">${name}</span>`);
        elements.push(userElement);
    });

    $('.selectedUser').remove();
    $('#selectedUsers').prepend(elements)
}




$('#createChatButton').click(()=>{
   var data = JSON.stringify(selectedUsers);
   $.post("/api/chats", { users: data }, chat => {

        if(!chat || !chat._id) return alert("Invalid response from server.");

        window.location.href = `/messages/${chat._id}`;
    })
});






//Function Which will retreet post id 
// element -> button and will fallow the same ruls 
function getPostIdFromElement(element){
    //handel wichi will by use in statement
    var isRoot = element.hasClass('post');
    //match div wit class posts 
    var rootElement = isRoot ? element : element.closest('.post');
    //get data id from posts 
    var postId = rootElement.data().id;

    if(postId === undefined){
        alert('Post id Undefined')
    }
    return postId;
}



function outputPosts(results, container) {
    container.html("");

    if(!Array.isArray(results)) {
        results = [results];
    }

    results.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });

    if (results.length == 0) {
        container.append("<span class='noResults'>Nothing to show.</span>")
    }
}

function outputPostsWithReplies(results, container) {
    container.html("");

    if(results.replyTo !== undefined && results.replyTo._id !== undefined) {
        var html = createPostHtml(results.replyTo)
        container.append(html);
    }

    var mainPostHtml = createPostHtml(results.postData, true)
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });
}





function getChatName(chatData){
    var chatName = chatData.chatName;
    if(!chatName){
        var otherChatUsers = getOtherChatsUsers(chatData.users);
        var namesArray = otherChatUsers.map(user =>user.firstName + " " + user.lastName);
        chatName =  namesArray.join(", ");
    }
    return chatName;
}

function getOtherChatsUsers(users){
    if(users.length == 1) return users;

    return users.filter((user)=>{
        return user._id != userLoggedInData._id;
    });

}


