$(document).ready(()=>{

    $.get("/api/posts",(results)=>{
        outPutPosts(results,$('.postContainer'));
      });

});

function outPutPosts(results,container){
    container.html("");

    results.forEach(result => {
        var html = createPostHtml(result);
        container.append(html)
    }); 
    if(results == 0){
        container.append('<span class="noResults">Nothing to show</span>')
    }
}

