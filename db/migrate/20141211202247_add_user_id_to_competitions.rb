class AddUserIdToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :user_id, :string
  end
end
