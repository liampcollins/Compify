
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
var themes = ["One-hit wonders", "Covers", "Christmas", "Summer", "Halloween", "Live performances", "Songs from movies", "Guilty pleasures"]



var now
var date
var dateArray
var year
var month
var day
var hour
var minute
var nowFinishedCompetitions = []
var url
var updateData


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
  $(".comp-creator").html($(this)[0].dataset.name);
  $(".comp-theme").html(competition.theme);
  $(".comp-song-count").html(competition.song_count);

  // USER REGEX HERE TO FORMAT DATES
  competition.submission_end_date = competition.submission_end_date.split(/([T-Z])/);
  competition.vote_end_date = competition.vote_end_date.split(/([T-Z])/);
  $('.comp-subm-close').html(competition.submission_end_date[0] +" Time: "+ competition.submission_end_date[2]);
  $('.comp-vote-close').html(competition.vote_end_date[0]+ " Time: " + competition.vote_end_date[2]);
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
    $('.playlist-selector-button').text("Select this Playlist")
  }else{
    playlistSelected = true
    $('.competition-selector-button').text("Playlist Selected")

  }
  addPlaylistToCompetition();
}

function selectCompetition () {
  $(".notice").html("");
  selectCompetition = competition
  if(competitionSelected == true){
    competitionSelected = false
    $('.competition-selector-button').text("Select this Competition")
  }else{
    competitionSelected = true
    $('.competition-selector-button').text("Competition Selected")
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
  $('.playlists-in-comp-header').text("")
  $('.playlist-in-vote-list').text('');
  $('.playlist-in-vote-list').html();
  $(".vote-notice").html("");
  var competitionSelectedToVote = jQuery.parseJSON($(this)[0].dataset.competition) 
  var playlistsInComp = jQuery.parseJSON($(this)[0].dataset.playlists);
  if(playlistsInComp.length != 0){
    $('.playlists-in-comp-header').text("PLAYLISTS")
      var numPlaylistsInComp = playlistsInComp.length;
      playlistsInComp.forEach(function(playlist){  
      $(".playlist-vote-list").append("<div class='playlist-in-vote-list' data-playlist='" + playlist.spotify_id + "' data-name='" + playlist.spotify_user_name + "' data-id='" + playlist.id + "'>" + playlist.name + "</div>");
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
  }else{
    $('.playlist-viewer-vote-container').hide();
    $('.playlist-vote-list').show();
    $('.playlists-in-comp-header').text("NO PLAYLISTS ADDED YET")
    $('.comp-vote-button').hide();

  }
  
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
    $('.comp-vote-button').show();
    // CHANGE BACK TO HIDE
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


function createComp (e) {
  
  e.preventDefault()
console.log('creating competition')
  var data = new Object();
    if(this[1].value == ""){
      data[this[2].name] = this[2].value;
      var theme = this[2].value;
    }else{
      data[this[1].name] = this[1].value;
      var theme = this[1].value;
    }

    data[this[0].name] = this[0].value;;
    data[this[3].name] = this[3].value;
    data[this[4].name] = this[4].value;
    data[this[5].name] = this[5].value;

    request("POST", "/competitions", data).success(function(returnData){
      console.log("SUCCESS")
      var userName = currentUser.name
        $('.competition-scroll').append('<div class="competition-in-list" data-competition="{&quot;created_at&quot;:&quot;'+returnData.created_at+'&quot;,&quot;id&quot;:'+returnData.id+',&quot;name&quot;:&quot;'+returnData.name+'&quot;,&quot;song_count&quot;:&quot;'+returnData.song_count+'&quot;,&quot;submission_end_date&quot;:&quot;'+returnData.submission_end_date+'&quot;,&quot;theme&quot;:&quot;'+returnData.theme+'&quot;,&quot;updated_at&quot;:&quot;'+returnData.updated_at+'&quot;,&quot;user_id&quot;:&quot;'+currentUser.id+'&quot;,&quot;vote_end_date&quot;:&quot;'+returnData.vote_end_date+'&quot;,&quot;winner&quot;:null}" data-name='+userName+'>'+returnData.name+'</div>')
        // $('.competition-scroll').append('<div class="competition-in-list"> TESTER3 </div>')
    
    })
  $('.competition-form')[0].reset();
  $('.theme-freetext').show();
  $('.theme-options').show();
  $('.form-notice').text("Competition succesfully created");
};


function newCompCreated () {
  // console.log('newCompCreated');
  $('.comp-form-container').hide();
  $('.comp-friends-invite').show();
}


function populateThemeOptions(){
  themes.forEach(function(theme){
  $(".theme-options").append('<option value="' + theme.toLowerCase() + '">' + theme + '</option>')
})

}

function toggleThemeSelect(){
   if($('.theme-freetext').val() ==""){
    $('.theme-options').show();
  }else{
    debugger
    $('.theme-options').hide();
  }
}


function toggleThemeFreetext(){
  if( $('.theme-options option:selected').text() != $('.default-theme').text() ){
    $('.theme-freetext').hide();
  }else{
    $('.theme-freetext').show();
  }
}



// Need to write code that looks at competitions without a winner and check if closing date has passed

function checkForEntryClosed(){

  // now = new Date()
  // request("GET", "/competitions").success(function(data){
    
  //   competition = data[0]
  //   if(competition!=null){
  //     url = "/competitions/" + competition.id
  //     updateData = {id: competition.id}
  //     request("PUT", url, updateData).success(function(){
  //       console.log("competition updated")
  //     })      
  //   }
  // })
}



$(document).ready(function(){

  $('.playlist-select').hide();
  $('.competition-select').hide();
  $('.comp-friends-invite').hide();
  $('.competition-viewer').hide();
  $('.comp-select-vote').hide();
  $('.playlist-viewer-vote-container').hide();
  $('.comp-vote-button').hide();
  $('.close-vote-button').hide()
  $('.playlist-vote-list').hide();
  $('.select-competition-button').on('click', showCompetitionSelector);
  $('.select-playlist-button').on('click', showPlaylistSelector);

  $(document).on('click', '.competition-in-list', showCompDetails);
  $('.competition-in-list').on('click', showCompDetails);
  $('.playlist-in-list').on('click', showPlaylistViewer);
  $('.playlist-selector-button').on('click', selectPlaylist);
  $('.competition-selector-button').on('click', selectCompetition);
  $('.comp-reveal-button').on('click', function (){
      $('.comp-select-vote').show();
      $('.comp-select-vote-title').hide();
      $('.comp-reveal-button').hide();
      $('.close-vote-button').show()
  });
  $('.close-vote-button').on('click', function(){
    $('.comp-select-vote').hide();
    $('.comp-select-vote-title').show();
    $('.comp-reveal-button').show();
    $('.playlist-vote-list').hide();
    $('.playlist-viewer-vote-container').hide();
    $('.comp-vote-button').hide();
    $('.close-vote-button').hide()
    $(".vote-notice").html("");
  })
  $('.competition-in-vote-list').on('click', showPlaylistLists);
  $(".playlist-in-vote-list").on('click', showPlaylistToVote);
  $(".comp-vote-button").on('click', voteOnPlaylist);
  populateThemeOptions();
  $('.theme-freetext').change(toggleThemeSelect);
  $('.theme-options').change(toggleThemeFreetext);
  $('.competition-form').on('submit', createComp);
  checkForEntryClosed()
  $('a').smoothScroll({easing: 'swing',speed: 2000})

})

 



