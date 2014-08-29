class Playlist < ActiveRecord::Base
  attr_accessible :competition_id, :image, :name, :spotify_id, :user_id


  belongs_to :user
  belongs_to :competition
  has_many :votes
end
