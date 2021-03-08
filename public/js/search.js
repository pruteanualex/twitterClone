
var timer;

$('#searchBox').keydown((event)=>{
    clearTimeout(timer);
    var textBox = $(event.target);
    var value = textBox.val();
    var searchTtpe = textBox.data().search;

    timer = setTimeout(()=>{
        value = textBox.val().trim();
        if(value == ""){
            $('.resultsContainer').html("");
        }else{
            search(value,searchTtpe);
        }
    },1000);
});


function search(searchTerm,searchType){

    var url = searchType == "users" ? "/api/users" : "/api/posts";

    $.get(url,{search:searchTerm},(results)=>{
       
        if(searchType == "users"){
            outputUsers(results,$('.resultsContainer'));
        }else{
            outputPosts(results,$('.resultsContainer'));
        }
    });
}









// function outputPosts(results, container) {
//     container.html("");

//     if(!Array.isArray(results)) {
//         results = [results];
//     }

//     results.forEach(result => {
//         var html = createPostHtml(result)
//         container.append(html);
//     });

//     if (results.length == 0) {
//         container.append("<span class='noResults'>Nothing to show.</span>")
//     }
// }


// function createPostHtml(postData){
//     var postedBy = postData.postedBy;
//     //console.log(postedBy)
//     if(postedBy._id === undefined){
//         return console.log('User object not populated')
//     }
//     var displayName = postedBy.firstName + " " + postedBy.lastName;
//     var timestmp =timeDifference(new Date(),new Date(postData.createdAt));
    
//     var likeButtonActiveClass = postData.likes.includes(userLoggedInData._id) ? "active":"";
    
//     var replayFlag = "";
//     if(postData.replayTo){
//         if(!postData.replayTo._id){
//             return 'replay to is not populated';
//         }else if(!postData.replayTo.postedBy._id){
           
//             return 'Posted by  is not populated';
            
//         }
       
//         var replayToUsername = postData.replayTo.postedBy.username;
//         replayFlag = `<div class="replayFlag">
//             Replaying to <a href="/profile/${replayToUsername}">@${replayToUsername}</a>
//         </div>`
//     }

//     var buttons = "";
//     if(postData.postedBy._id  == userLoggedInData._id){
//         var pinnedClass = "";
//         var pinnedPostText = "";
//         var dataTarget = "#confirmPinModal"
//         if(postData.pinned === true){
//             pinnedClass ="active";
//             dataTarget ="#unPinModal";
//             pinnedPostText = "<i class='fa fa-thumbtack'></i> <span>Pinned post</span>";
//         }

//         buttons = `
//             <button class='pinButton ${pinnedClass}' data-id="${postData._id}" data-toggle="modal" data-target ="${dataTarget}"><i class="fa fa-thumbtack"></i></button>
//             <button data-id="${postData._id}" data-toggle="modal" data-target ="#deletePostModal"><i class="fa fa-times"></i></button>`;
//     }
//     return `<div class="post" data-id="${postData._id}">
//                 <div class="mainContainer">
//                     <div class="userImageContainer">
//                         <img src="${postedBy.profilePic}">
//                     </div>
//                     <div class="postContentContainer">
//                         <div class="pinnedPostText">${pinnedPostText}</div>
//                         <div class="postHeader">
//                             <a href="/profile/${postedBy.username}">${displayName}</a>
//                             <span class="username">@${postedBy.username}</span>
//                             <span class="username">${timestmp}</span>
//                             ${buttons}    
//                         </div>
//                         ${replayFlag}
//                         <div class="postBody">
//                             <span>${postData.content}</span>
//                         </div>
//                         <div class="postFooter">
//                             <div class='postButtonContainer'>
//                                 <button data-toggle="modal" data-target="#replayModal">
//                                     <i class='far fa-comment'></i>
//                                 </button>
//                             </div>
//                             <div class='postButtonContainer green'>
//                                 <button class="retweetButton">
//                                     <i class='fas fa-retweet'></i>
//                                 </button>
//                             </div>
//                             <div class='postButtonContainer red'>
//                                 <button class='likeButton ${likeButtonActiveClass}'>
//                                     <i class='far fa-heart'></i>
//                                     <span>${postData.likes.length || ""}</span>
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>`;
// }