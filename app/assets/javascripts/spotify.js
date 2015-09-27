
var playlist;
var selectedPlaylist;
var selectedCompetition;
var playlistSelected = false;
var competitionSelected = false;
var playlistSelector = false;
var competitionSelector = false;
var playlistSelectedToVote;
var competitionSelectedToVote = false;
var haveVotedInThisComp = false;
var playlistAlreadyEntered = false
var themes = ["One-hit wonders", "Covers", "Christmas", "Summer", "Halloween", "Live performances", "Songs from movies", "Guilty pleasures"];



var now;
var date;
var dateArray;
var year;
var month;
var day;
var hour;
var minute;
var nowFinishedCompetitions = [];
var url;
var updateData;


function request(method, url, data){
  return $.ajax({
    method: method,
    url: url,
    dataType: "json",
    data: data
  });
};


///////ADDING PLAYLIST//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

function showCompetitionSelector(){
  if(competitionSelector==false){
    $('.add-playlist-title').hide("slow");
    $('.playlist-select').hide("slow");
    $('.competition-select').show("slow");
    competitionSelector=true;
    playlistSelector=false;
    $('.notice').hide("slow");
  }else{
    $('.competition-select').hide("slow");
    $('.playlist-select').hide("slow");
    $('.add-playlist-title').show("slow");
    $('.notice').hide("slow");
    competitionSelector=false;
  }
}


function showPlaylistSelector() {
  if(playlistSelector==false){
    $('.add-playlist-title').hide("slow", function(){
      $('.competition-select').hide("slow", function(){
        $('.playlist-select').show("slow");
      });
    });
    playlistSelector=true;
    competitionSelector=false;
  }else{
    $('.competition-select').hide("slow", function(){
      $('.playlist-select').hide("slow", function(){
        $('.add-playlist-title').show("slow");
      });
    });
    playlistSelector=false;
  }
}



function showCompDetails (){
  $(".notice").hide();
  competition= jQuery.parseJSON($(this)[0].dataset.competition);
  playlists= jQuery.parseJSON($(this)[0].dataset.playlists);

  playlists.forEach(function(playlist){
    if(playlists[0].user_id == currentUser.id){
      playlistAlreadyEntered = true;
    };
  });

  if(playlistAlreadyEntered==true){
    $('.notice').html("You've already entered a playlist in this competition");
    $(".notice").show();
    playlistAlreadyEntered = false;
  }else{
    $(".comp-creator").html($(this)[0].dataset.name);
    $(".comp-theme").html(competition.theme);
    $(".comp-song-count").html(competition.song_count);

    // USER REGEX HERE TO FORMAT DATES
    competition.submission_end_date = competition.submission_end_date.split(/([T-Z])/);
    competition.vote_end_date = competition.vote_end_date.split(/([T-Z])/);
    $('.comp-subm-close').html(competition.submission_end_date[0] +" Time: "+ competition.submission_end_date[2]);
    $('.comp-vote-close').html(competition.vote_end_date[0]+ " Time: " + competition.vote_end_date[2]);
    $('.competition-viewer').show("slow");
  }
}



function showPlaylistViewer () {
  $('.playlist-selector-button').show();
  playlist = jQuery.parseJSON($(this)[0].dataset.playlist);
  var playlistId = playlist.id;
  var playlistOwner = playlist.owner.id;
  var iframe = $('iframe');
  var playlistSrc="https://embed.spotify.com/?uri=spotify:user:" + playlistOwner + ":playlist:" + playlistId;
  iframe.attr("src", playlistSrc);
}

function selectPlaylist () {
  selectedPlaylist = playlist;
  if(playlistSelected == true){
    playlistSelected = false;
    $('.playlist-selector-button').text("Select this Playlist");
  }else{
    playlistSelected = true;
    $('.playlist-selector-button').text("Playlist Selected");

  };
  addPlaylistToCompetition();
};

function selectCompetition () {
  $(".notice").html("");
  selectCompetition = competition;
  if(competitionSelected == true){
    competitionSelected = false;
    $('.competition-selector-button').text("Select this Competition");
  }else{
    competitionSelected = true;
    $('.competition-selector-button').text("Competition Selected");
  };
  addPlaylistToCompetition();
};


function addPlaylistToCompetition(e){

  if(competitionSelected==true){
    if(playlistSelected==true){
       var playlistId = playlist.id;
       var playlistName = playlist.name;
        var competitionId = competition.id;
        var playlistOwner = playlist.owner.id;
        request("POST", "/playlists", {playlist:{name: playlistName, spotify_id: playlistId, user_id: playlistOwner, competition_id: competitionId}} ).success(function (){
          $(".notice").show();
          $(".notice").html("Playlist " + playlist.name + " successfully added to competition " + competition.name);
        });
    }else{
      // Notify that they need to select a playlist
      $(".notice").show();
      $(".notice").html("Competition selected, now choose a playlist to add");
    };
  }else{
    if(playlistSelected==true){
      // Notify that they need to select a competition
      $(".notice").show();
      $(".notice").html("Playlist selected, now choose a competition to enter");
    };
  };
};



///////VOTING ON PLAYLIST//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////


function showPlaylistLists () {
  $('.playlists-in-comp-header').text("");
  $('.playlist-in-vote-list').text('');
  $('.playlist-in-vote-list').html();
  $(".vote-notice").html("");
  var competitionSelectedToVote = jQuery.parseJSON($(this)[0].dataset.competition); 
  var playlistsInComp = jQuery.parseJSON($(this)[0].dataset.playlists);
  if(playlistsInComp.length != 0){
    $('.playlists-in-comp-header').text("PLAYLISTS");
      var numPlaylistsInComp = playlistsInComp.length;
      playlistsInComp.forEach(function(playlist){  
      $(".playlist-vote-list").append("<div class='playlist-in-vote-list' data-playlist='" + playlist.spotify_id + "' data-name='" + playlist.spotify_user_name + "' data-id='" + playlist.id + "'>" + playlist.name + "</div>");
      $(".playlist-in-vote-list").on('click', showPlaylistToVote);
      $('.playlist-vote-list').show();
      var votesInPlaylist = playlist.votes;
      currentUserVotes.forEach(function(vote){
        if(vote.playlist_id == playlist.id){
          $(".vote-notice").html("You've aready voted in this Competition");
          haveVotedInThisComp = true;
          $(".comp-vote-button").hide;
        };
      });
    });
  }else{
    $('.playlist-viewer-vote-container').hide("slow");
    $('.playlist-vote-list').show("slow");
    $('.playlists-in-comp-header').text("NO PLAYLISTS ADDED YET");
    $('.comp-vote-button').hide("slow");
  };
};

function showPlaylistToVote () {
  playlistSpotifyId = $(this).data().playlist;
  playlistSpotifyUser = $(this).data().name;
  playlistSelectedToVote = $(this).data().id;
  var playlistSrc="https://embed.spotify.com/?uri=spotify:user:" + playlistSpotifyUser + ":playlist:" + playlistSpotifyId;
  $(".playlist-viewer-to-vote").attr("src", playlistSrc);
  $('.playlist-viewer-vote-container').show();
  if(haveVotedInThisComp = false){
    $('.comp-vote-button').show("slow");
  }else{
    $('.comp-vote-button').hide("slow");
  };
};


function voteOnPlaylist () {
  request("POST", "/votes", {vote:{playlist: playlistSelectedToVote}} ).success(voted());
};

function voted(){
  $(".comp-vote-button").hide("slow");
  $(".vote-notice").html("Thanks for voting!");
};




///////CREATING NEW COMPETITION//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////




function compVoteReveal(){
  $('.comp-reveal-button').hide("slow", function(){
   $('.comp-select-vote-title').hide("slow", function(){
      $('.comp-select-vote').show("slow", function(){
        $('.close-vote-button').show("slow");
      });
    });
  });
}


function createComp (e) {
  
  e.preventDefault();
  var data = new Object();
    if(this[1].value == ""){
      data[this[2].name] = this[2].value;
      var theme = this[2].value;
    }else{
      data[this[1].name] = this[1].value;
      var theme = this[1].value;
    }

    data[this[0].name] = this[0].value;
    data[this[3].name] = this[3].value;
    data[this[4].name] = this[4].value;
    data[this[5].name] = this[5].value;

    request("POST", "/competitions", data).success(function(returnData){
      var userName = currentUser.name;
        $('.competition-scroll').append('<div class="competition-in-list" data-competition="{&quot;created_at&quot;:&quot;'+returnData.created_at+'&quot;,&quot;id&quot;:'+returnData.id+',&quot;name&quot;:&quot;'+returnData.name+'&quot;,&quot;song_count&quot;:&quot;'+returnData.song_count+'&quot;,&quot;submission_end_date&quot;:&quot;'+returnData.submission_end_date+'&quot;,&quot;theme&quot;:&quot;'+returnData.theme+'&quot;,&quot;updated_at&quot;:&quot;'+returnData.updated_at+'&quot;,&quot;user_id&quot;:&quot;'+currentUser.id+'&quot;,&quot;vote_end_date&quot;:&quot;'+returnData.vote_end_date+'&quot;,&quot;winner&quot;:null}" data-playlists = [] data-name='+userName+ ' >'+returnData.name+'</div>');
        $('.no-competitions').hide();
        $('.competition-in-list').show();
    });
  $('.competition-form')[0].reset();
  $('.theme-freetext').show();
  $('.theme-options').show();
  $('.form-notice').text("Competition succesfully created");
};


function newCompCreated () {
  $('.comp-form-container').hide();
  $('.comp-friends-invite').show();
};


function populateThemeOptions(){
  themes.forEach(function(theme){
    $(".theme-options").append('<option value="' + theme.toLowerCase() + '">' + theme + '</option>');
  });
};

function toggleThemeSelect(){
   if($('.theme-freetext').val() ==""){
    $('.theme-options').show();
  }else{
    $('.theme-options').hide();
  };
};


function toggleThemeFreetext(){
  if( $('.theme-options option:selected').text() != $('.default-theme').text() ){
    $('.theme-freetext').hide();
  }else{
    $('.theme-freetext').show();
  };
};



$(document).ready(function(){
  // Initial states
  $('.playlist-select').hide();
  $('.playlist-selector-button').hide();
  $(".notice").hide();
  $('.competition-select').hide();
  $('.comp-friends-invite').hide();
  $('.competition-viewer').hide();
  $('.comp-select-vote').hide();
  $('.playlist-viewer-vote-container').hide();
  $('.comp-vote-button').hide();
  $('.close-vote-button').hide();
  $('.playlist-vote-list').hide();

  // Event listeneners
  $('.select-competition-button').on('click', showCompetitionSelector);
  $('.select-playlist-button').on('click', showPlaylistSelector);
  $(document).on('click', '.competition-in-list', showCompDetails);
  $('.competition-in-list').on('click', showCompDetails);
  $('.playlist-in-list').on('click', showPlaylistViewer);
  $('.playlist-selector-button').on('click', selectPlaylist);
  $('.competition-selector-button').on('click', selectCompetition);
  $('.comp-reveal-button').on('click', compVoteReveal);
  $('.close-vote-button').on('click', function(){
    $('.comp-select-vote').hide();
    $('.comp-select-vote-title').show();
    $('.comp-reveal-button').show();
    $('.playlist-vote-list').hide();
    $('.playlist-viewer-vote-container').hide();
    $('.comp-vote-button').hide();
    $('.close-vote-button').hide();
    $(".vote-notice").html("");
  });
  $('.competition-in-vote-list').on('click', showPlaylistLists);
  $(".playlist-in-vote-list").on('click', showPlaylistToVote);
  $(".comp-vote-button").on('click', voteOnPlaylist);
  populateThemeOptions();
  $('.theme-freetext').change(toggleThemeSelect);
  $('.theme-options').change(toggleThemeFreetext);
  $('.competition-form').on('submit', createComp);
  $('a').smoothScroll({easing: 'swing',speed: 2000});
});

 



