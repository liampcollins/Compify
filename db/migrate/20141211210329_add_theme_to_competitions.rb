class AddThemeToCompetitions < ActiveRecord::Migration
  def change
    add_column :competitions, :theme, :string
  end
end
