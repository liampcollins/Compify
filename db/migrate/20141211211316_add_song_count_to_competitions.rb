class AddSongCountToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :song_count, :string
  end
end
