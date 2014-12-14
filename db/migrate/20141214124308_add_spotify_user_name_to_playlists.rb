class AddSpotifyUserNameToPlaylists < ActiveRecord::Migration
  def change
    add_column :playlists, :spotify_user_name, :string
  end
end
