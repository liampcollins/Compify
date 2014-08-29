class CreatePlaylists < ActiveRecord::Migration
  def change
    create_table :playlists do |t|
      t.string :name
      t.integer :user_id
      t.text :spotify_id
      t.integer :competition_id
      t.text :image

      t.timestamps
    end
  end
end
