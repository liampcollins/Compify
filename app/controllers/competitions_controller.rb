class CompetitionsController < ApplicationController
  # GET /competitions
  # GET /competitions.json
  def index

    @competitions = Competition.all
    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @competitions }
    end
  end

  # GET /competitions/1
  # GET /competitions/1.json
  def show
    @competition = Competition.find(params[:id])
    @vote = Vote.new

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @competition }
    end
  end

  # GET /competitions/new
  # GET /competitions/new.json
  def new
    @competition = Competition.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @competition }
    end
  end

  # GET /competitions/1/edit
  def edit
    @competition = Competition.find(params[:id])
  end

  # POST /competitions
  # POST /competitions.json
  def create
    @competition = Competition.new
    @competition.name = params["competition-name"]
    @competition.theme = params["theme"]
    @competition.song_count = params["song-count"]
    @competition.submission_end_date = params["entry-close"]
    @competition.vote_end_date = params["vote-close"]
    @competition.user_id = current_user.id
    respond_to do |format|
      if @competition.save
        format.html { redirect_to playlists_path, notice: 'Competition was successfully created.' }
        format.json { render json: @competition, status: :created, location: @competition }
      else
        format.html { render action: "new" }
        format.json { render json: @competition.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /competitions/1
  # PUT /competitions/1.json
  def update

    @competition = Competition.find(params["id"].to_i)
    playlist_votes = []
    playlist_owners = []
    @competition.playlists.each do |playlist|
      playlist_votes.push(playlist.votes.count)
      playlist_owners.push(playlist.user_id)
    end
    winning_playlist_index = playlist_votes.index(playlist_votes.max)
    @competition.winner = playlist_owners[winning_playlist_index]
    
    respond_to do |format|
      if @competition.update_attributes(params[:competition])
        format.html { redirect_to @competition, notice: 'Competition was successfully updated.' }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @competition.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /competitions/1
  # DELETE /competitions/1.json
  def destroy
    @competition = Competition.find(params[:id])
    @competition.destroy

    respond_to do |format|
      format.html { redirect_to competitions_url }
      format.json { head :no_content }
    end
  end
end
