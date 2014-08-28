class CreateCompetitions < ActiveRecord::Migration
  def change
    create_table :competitions do |t|
      t.string :name
      t.integer :winner
      t.datetime :submission_end_date
      t.datetime :vote_end_date

      t.timestamps
    end
  end
end
