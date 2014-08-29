
function request(method, url, data){
  return $.ajax({
    method: method,
    url: url,
    dataType: "json",
    data: data
  })
}


function toggleVote(){
  // event.preventDefault();
  console.log("vote")
  $this = $(this)
  $playlist = $this.closest(".playlist_in_comp")
  playlist_id = parseInt($playlist_id = $playlist.find("#vote_playlist_id").val())
  request("POST", "/votes", {vote:{playlist_id: playlist_id}
  }).success(function(){
    $this.toggleClass("have_already_voted").toggleClass("have_not_already_voted")
  })
  // .success(function(){
  //   updateLikes($this, $post)
  // }).success(function(){
  //   UpdateScoreForLike($this, $post, $feed)
  // })
}




$(function(){
  $('.submit_vote_button').on('click', toggleVote);
})





