class Competition < ActiveRecord::Base
  attr_accessible :name, :submission_end_date, :vote_end_date, :winner, :user_id, :theme, :song_count

  belongs_to :user
  has_many :playlists
end
