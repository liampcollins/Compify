




document.getElementById('showInfoButton').addEventListener('click', showInfo();
});

function showInfo(accessToken) {
    // fetch information about me
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
            'Authorization': 'Bearer ' + accessToken
        },
        success: function(response) {
            var source = document.getElementById('loggedin-template').innerHTML;
            var template = Handlebars.compile(source);
            var data = response;
            
            document.getElementById('loggedin').innerHTML = template(data);
            
            $('div#login').hide();
            $('div#loggedin').show();
        }
    });
}