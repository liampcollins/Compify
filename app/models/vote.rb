class Vote < ActiveRecord::Base
  attr_accessible :playlist_id, :user_id

  belongs_to :playlist
  belongs_to :user
end
