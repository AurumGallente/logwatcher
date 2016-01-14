"use strict";
module.exports = {
  up: function(migration, DataTypes, done) {
    migration.createTable("Records", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      date: {
        type: DataTypes.DATE
      },
      processid: {
        type: DataTypes.TEXT
      },
      text: {
        type: DataTypes.TEXT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).done(done);
  },
  down: function(migration, DataTypes, done) {
    migration.dropTable("Records").done(done);
  }
};