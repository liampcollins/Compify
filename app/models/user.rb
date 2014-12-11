class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable, :omniauthable, :omniauth_providers => [:spotify]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me, :spotify_user_id, :name, :image, :email, :session_token
  # attr_accessible :title, :body
  has_many :competitions
  has_many :playlists
  has_many :votes

  def self.from_omniauth(auth, signed_in_user=nil)
    if user = signed_in_user || User.find_by_email(auth.info.email) 
      user.provider = auth.provider
      user.uid = auth.uid
      user.session_token = auth.credentials.token
      user.name = auth.info.name if user.name.blank?
      user.image = auth.info.image if user.image.blank?
      user.save
      user
    else
      where(auth.slice(:provider, :uid)).first_or_create do |user|
        user.provider = auth.provider
        user.uid = auth.uid
        user.session_token = auth.credentials.token
        user.name = auth.info.name  
        user.email = auth.info.email
        user.image = auth.info.image
        user.password = Devise.friendly_token[0,20]
      end
    end
  end
end
