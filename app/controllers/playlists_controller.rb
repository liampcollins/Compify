class PlaylistsController < ApplicationController
  # GET /playlists
  # GET /playlists.json
  def index

    #DON'T FORGET THE SINGLE QUOTES AROUND THE JSON HASH
    playlists_json = ('{
      "href": "https://api.spotify.com/v1/users/wizzler/playlists",
      "items": [ {
        "collaborative": false,
        "external_urls": {
          "spotify": "http://open.spotify.com/user/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c"
        },
        "href": "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c",
        "id": "53Y8wT46QIMz5H4WQ8O22c",
        "name": "Wizzlers Big Playlist",
        "owner": {
          "external_urls": {
            "spotify": "http://open.spotify.com/user/wizzler"
          },
          "href": "https://api.spotify.com/v1/users/wizzler",
          "id": "wizzler",
          "type": "user",
          "uri": "spotify:user:wizzler"
        },
        "public": true,
        "tracks": {
          "href": "https://api.spotify.com/v1/users/wizzler/playlists/53Y8wT46QIMz5H4WQ8O22c/tracks",
          "total": 30
        },
        "type": "playlist",
        "uri": "spotify:user:wizzler:playlist:53Y8wT46QIMz5H4WQ8O22c"
      }, {
        "collaborative": false,
        "external_urls": {
          "spotify": "http://open.spotify.com/user/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju"
        },
        "href": "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju",
        "id": "1AVZz0mBuGbCEoNRQdYQju",
        "name": "Another Playlist",
        "owner": {
          "external_urls": {
            "spotify": "http://open.spotify.com/user/wizzlersmate"
          },
          "href": "https://api.spotify.com/v1/users/wizzlersmate",
          "id": "wizzlersmate",
          "type": "user",
          "uri": "spotify:user:wizzlersmate"
        },
        "public": true,
        "tracks": {
          "href": "https://api.spotify.com/v1/users/wizzlersmate/playlists/1AVZz0mBuGbCEoNRQdYQju/tracks",
          "total": 58
        },
        "type": "playlist",
        "uri": "spotify:user:wizzlersmate:playlist:1AVZz0mBuGbCEoNRQdYQju"
      } ],
      "limit": 9,
      "next": null,
      "offset": 0,
      "previous": null,
      "total": 9
    }')


    @playlists = JSON.parse(playlists_json)
    @playlist = Playlist.new

    # @playlists = Playlist.all

    if current_user
      token = current_user.session_token
      auth = "Bearer " + token
      request = HTTParty.get("https://api.spotify.com/v1/users/#{current_user.uid}/playlists", :headers => { "Authorization" => auth})
      response_hash = JSON(request)
    end

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @playlists }
    end
  end

  # GET /playlists/1
  # GET /playlists/1.json
  def show
    @playlist = Playlist.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @playlist }
    end
  end

  # GET /playlists/new
  # GET /playlists/new.json
  def new
    @playlist = Playlist.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @playlist }
    end
  end

  # GET /playlists/1/edit
  def edit
    @playlist = Playlist.find(params[:id])
  end

  # POST /playlists
  # POST /playlists.json
  def create

    @playlist = Playlist.new

    @playlist.spotify_id = params["playlist"]["id"]
    @playlist.name = params["playlist"]["name"]
    @playlist.competition_id = params["playlist"]["competition_id"]
    @playlist.user_id = current_user.id

    respond_to do |format|
      if @playlist.save
        format.html { redirect_to @playlist, notice: 'Playlist was successfully added.' }
        format.json { render json: @playlist, status: :created, location: @playlist }
      else
        format.html { render action: "new" }
        format.json { render json: @playlist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /playlists/1
  # PUT /playlists/1.json
  def update
    binding.pry
    @playlist = Playlist.find(params[:id])

    respond_to do |format|
      if @playlist.update_attributes(params[:playlist])
        format.html { redirect_to @playlist, notice: 'Playlist was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @playlist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /playlists/1
  # DELETE /playlists/1.json
  def destroy
    @playlist = Playlist.find(params[:id])
    @playlist.destroy

    respond_to do |format|
      format.html { redirect_to playlists_url }
      format.json { head :no_content }
    end
  end
end
