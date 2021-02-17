$(document).ready(() => {

    if(selectedTab === "replies") {
        loadReplies();
    }
    else {
        loadPosts();
    }
});

function loadPosts() {
    $.get("/api/posts", { postedBy: profileUserId, isReply: false }, results => {
        outputPosts(results, $(".postsContainer"));
        console.log(results)
    })
}

function loadReplies() {
    $.get("/api/posts", { postedBy: profileUserId, isReply: true }, results => {
        outputPosts(results, $(".postsContainer"));
    })
}
