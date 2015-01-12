
var playlist
var selectedPlaylist
var selectedCompetition
var playlistSelected = false
var competitionSelected = false
var playlistSelector = false
var competitionSelector = false
var playlistSelectedToVote
var competitionSelectedToVote = false
var haveVotedInThisComp = false
var themes = ["One-hit wonser", "Covers", "Christmas", "Summer", "Halloween", "Live performances", "Songs from movies", "Guilty pleasures"]




function request(method, url, data){
  return $.ajax({
    method: method,
    url: url,
    dataType: "json",
    data: data
  })
}


// function toggleVote(){
// event.preventDefault();
//   console.log("vote")
//   $this = $(this)
//   $playlist = $this.closest(".playlist_in_comp")
//   playlist_id = parseInt($playlist_id = $playlist.find("#vote_playlist_id").val())
//   request("POST", "/votes", {vote:{playlist_id: playlist_id}
//   }).success(function(){
//     $this.toggleClass("have_already_voted").toggleClass("have_not_already_voted")
//   })
// .success(function(){
//   updateLikes($this, $post)
// }).success(function(){
//   UpdateScoreForLike($this, $post, $feed)
// })
// }


///////ADDING PLAYLIST//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function showCompetitionSelector(){
  console.log('showCompetitionSelector')
  if(competitionSelector==false){
    $('.add-playlist-title').hide();
    $('.playlist-select').hide();
    $('.competition-select').show();
    competitionSelector=true;
    playlistSelector=false;
  }else{
    $('.competition-select').hide();
    $('.playlist-select').hide();
    $('.add-playlist-title').show();
    competitionSelector=false;
  }
}


function showPlaylistSelector() {
  console.log('showPlaylistSelector');
  if(playlistSelector==false){
    $('.add-playlist-title').hide();
    $('.competition-select').hide();
    $('.playlist-select').show();
    playlistSelector=true;
    competitionSelector=false;
  }else{
    $('.competition-select').hide();
    $('.playlist-select').hide();
    $('.add-playlist-title').show();
    playlistSelector=false;
  }
}



function showCompDetails (){
  competition= jQuery.parseJSON($(this)[0].dataset.competition);
  var creator = $(this)[0].dataset.name
  var theme = competition.theme;
  var songCount = competition.song_count;
  console.log(songCount)
  $(".comp-creator").html(creator);
  $(".comp-theme").html(theme);
  $(".comp-song-count").html(songCount);
  $('.competition-viewer').show();

}



function showPlaylistViewer () {
  console.log($(this))
  playlist = jQuery.parseJSON($(this)[0].dataset.playlist)
  var playlistId = playlist.id
  var playlistOwner = playlist.owner.id
  var iframe = $('iframe');
  var playlistSrc="https://embed.spotify.com/?uri=spotify:user:" + playlistOwner + ":playlist:" + playlistId
  console.log(playlistSrc)
  iframe.attr("src", playlistSrc);
}

function selectPlaylist () {
  selectedPlaylist = playlist
  // Toggling playlist, need to add code to toggle style on button too
  if(playlistSelected == true){
    playlistSelected = false
  }else{
    playlistSelected = true
  }
  addPlaylistToCompetition();
}

function selectCompetition () {
  selectCompetition = competition
  if(competitionSelected == true){
    competitionSelected = false
  }else{
    competitionSelected = true
  }
  addPlaylistToCompetition();
}


function addPlaylistToCompetition(e){
  // WE NEED TO PASS IN THE COMP ID, THE PLAYLIST USER AND THE PLAYLIST ID
  // e.preventDefault()

  if(competitionSelected==true){
    if(playlistSelected==true){
       var playlistId = playlist.id
       var playlistName = playlist.name
        var competitionId = competition.id
        var playlistOwner = playlist.owner.id
        request("POST", "/playlists", {playlist:{name: playlistName, spotify_id: playlistId, user_id: playlistOwner, competition_id: competitionId}} ).success(console.log("success")).success(function (){
          $(".notice").html("Playlist " + playlist.name + " successfully added to competition " + competition.name);
        });
    }else{
      // Notify that they need to select a playlist
      $(".notice").html("Competition selected, now choose a playlist to add");
    }
  }else{
    if(playlistSelected==true){
      // Notify that they need to select a competition
      $(".notice").html("Playlist selected, now choose a competition to enter");
    };
  };

};



///////VOTING ON PLAYLIST//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function showPlaylistLists () {
  $('.playlist-in-vote-list').text('');
  $('.playlist-in-vote-list').html();
  $(".vote-notice").html("");
  var competitionSelectedToVote = jQuery.parseJSON($(this)[0].dataset.competition) 
  var playlistsInComp = jQuery.parseJSON($(this)[0].dataset.playlists);
  var numPlaylistsInComp = playlistsInComp.length;
  playlistsInComp.forEach(function(playlist){  
    $(".playlists-in-comp-header").append("<div class='playlist-in-vote-list' data-playlist='" + playlist.spotify_id + "' data-name='" + playlist.spotify_user_name + "' data-id='" + playlist.id + "'>" + playlist.name + "</div>");
    $(".playlist-in-vote-list").on('click', showPlaylistToVote);
    $('.playlist-vote-list').show();
    var votesInPlaylist = playlist.votes;
    currentUserVotes.forEach(function(vote){
      if(vote.playlist_id == playlist.id){
        $(".vote-notice").html("You've aready voted in this Competition");
        haveVotedInThisComp = true
        // $(".comp-vote-button").hide;
      }    
    });
  });
};

function showPlaylistToVote () {
  playlistSpotifyId = $(this).data().playlist
  playlistSpotifyUser = $(this).data().name
  playlistSelectedToVote = $(this).data().id
  var playlistSrc="https://embed.spotify.com/?uri=spotify:user:" + playlistSpotifyUser + ":playlist:" + playlistSpotifyId
  $(".playlist-viewer-to-vote").attr("src", playlistSrc);
  $('.playlist-viewer-vote-container').show();
  if(haveVotedInThisComp = false){
    $('.comp-vote-button').show();
  }else{
    $('.comp-vote-button').hide();
  }
};


function voteOnPlaylist () {
  console.log(playlistSelectedToVote)
  request("POST", "/votes", {vote:{playlist: playlistSelectedToVote}} ).success(voted())
}

function voted(){
  console.log("hello")
  $(".comp-vote-button").hide;
  $(".vote-notice").html("Thanks for voting!");
}




///////CREATING NEW COMPETITION//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////



function newCompCreated (e) {
  console.log('newCompCreated')
  e.preventDefault();
  $('.comp-form-container').hide();
  $('.comp-friends-invite').show();
  // Need to update database here too and need to update the list of competitions if not being generated by a javascript request
}


function populateThemeOptions(){
  themes.forEach(function(theme){
  $(".theme-options").append('<option value="' + theme.toLowerCase() + '">' + theme + '</option>')
})

}


$(document).ready(function(){

  $('.playlist-select').hide();
  $('.competition-select').hide();
  $('.comp-friends-invite').hide();
  $('.competition-viewer').hide();
  $('.comp-select-vote').hide();
  $('.playlist-viewer-vote-container').hide();
  $('.comp-vote-button').hide();
  $('.playlist-vote-list').hide();

  // $(".main").onepage_scroll({
  //   sectionContainer: "section",
  //   loop: true,
  //   responsiveFallback: false
  // });
// });


// $(function(){
  // $('.submit_vote_button').on('click', toggleVote);
  $('.competition-form').on('submit', newCompCreated);
  $('.select-competition-button').on('click', showCompetitionSelector);
  $('.select-playlist-button').on('click', showPlaylistSelector);
  $('.competition-in-list').on('click', showCompDetails);
  $('.playlist-in-list').on('click', showPlaylistViewer);
  $('.playlist-selector-button').on('click', selectPlaylist);
  $('.competition-selector-button').on('click', selectCompetition);
  $('.comp-reveal-button').on('click', function (){
      $('.comp-select-vote').show();
      $('.comp-select-vote-title').hide();
      $('.comp-reveal-button').hide();
  });
  $('.competition-in-vote-list').on('click', showPlaylistLists);
  $(".playlist-in-vote-list").on('click', showPlaylistToVote);
  $(".comp-vote-button").on('click', voteOnPlaylist)
  populateThemeOptions();
})

 



