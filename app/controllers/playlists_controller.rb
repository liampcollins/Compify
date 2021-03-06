class PlaylistsController < ApplicationController
  # GET /playlists
  # GET /playlists.json
    before_filter :authenticate_user!

  def index

    if current_user
      token = current_user.session_token
      auth = "Bearer " + token
      begin
      @playlists = HTTParty.get("https://api.spotify.com/v1/users/#{current_user.uid}/playlists", :headers => { "Authorization" => auth})
      
      rescue SocketError => details    # or the Exception class name may be SocketError    
         p "Failed to load the data: #{details}"
      end


      # response_hash = JSON(request)
      #binding.pry
    end

    @playlist = Playlist.new
    @competitions = Competition.all
    @competition = Competition.new

    # if @playlists == true
      respond_to do |format|
        format.html # index.html.erb
        format.json { render json: @playlists }
      end
    # else
    #   redirect_to destroy_user_session_path, method: :delete
    # end
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
    if current_user
      token = current_user.session_token
      auth = "Bearer " + token
      @playlists = HTTParty.get("https://api.spotify.com/v1/users/#{current_user.uid}/playlists", :headers => { "Authorization" => auth})
      # binding.pry
      # response_hash = JSON(request)
      #binding.pry
    end
    @competitions = Competition.all
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
# binding.pry
    @playlist = Playlist.new
    @playlist.spotify_id = params["playlist"]["spotify_id"]
    @playlist.name = params["playlist"]["name"]
    # @playlist.image = params["playlist"]["images"][0]
    @playlist.competition_id = params["playlist"]["competition_id"]
    @playlist.user_id = current_user.id
    @playlist.spotify_user_name = params["playlist"]["user_id"]
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
