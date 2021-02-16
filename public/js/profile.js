$(document).ready(()=>{
    loadPosts();
});

function loadPosts(){
    $.get("/api/posts",{postedBy:profileUserId},results=>{
        outPutPosts(results,$('.postsContainer'));
      });

}