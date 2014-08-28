class Competition < ActiveRecord::Base
  attr_accessible :name, :submission_end_date, :vote_end_date, :winner


  has_many :playlists
end
