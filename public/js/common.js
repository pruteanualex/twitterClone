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

function createPostHtml(postData){
    var postedBy = postData.postedBy;
    console.log(postedBy)
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
        buttons = `<button data-id="${postData._id}" data-toggle="modal" data-target ="#deletePostModal"><i class="fa fa-times"></i></button>`;
    }
    return `<div class="post" data-id="${postData._id}">
                <div class="mainContainer">
                    <div class="userImageContainer">
                        <img src="${postedBy.profilePic}">
                    </div>
                    <div class="postContentContainer">
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



function outPutPosts(results,container){
    container.html(""); 

    if(!Array.isArray(results)){
        results = [results]
    }

    results.forEach(result => {
        var html = createPostHtml(result);
        container.append(html)
    }); 
    if(results == 0){
        container.append('<span class="noResults">Nothing to show</span>')
    }
}


function outputPostsWithReplies(results, container) {
    container.html("");
    console.log(results)

    if(results.replyTo !== undefined && results.replyTo._id !== undefined) {
        var html = createPostHtml(results.replyTo)
        container.append(html);
    }

    var mainPostHtml = createPostHtml(results.postData)
    container.append(mainPostHtml);

    results.replies.forEach(result => {
        var html = createPostHtml(result)
        container.append(html);
    });
}

// Fallowing/Fallowers
$(document).on('click',".followButton",(e)=>{
    var button = $(e.target);
    var userId = button.data().user;

    $.ajax({
        url:`/api/users/${userId}/fallow`,
        type:"PUT",
        success:(data)=>{
            console.log(data);
            // button_like.find('span').text(postData.likes.length || "");

            // if(postData.likes.includes(userLoggedInData._id)){
            //     button_like.addClass('active')
            // }else{
            //     button_like.removeClass('active')
            // }
        }
    });

    
});


