"use strict";
module.exports = function(sequelize, DataTypes) {
  var Record = sequelize.define("Record", {
    date: DataTypes.DATE,
    processid: DataTypes.TEXT,
    text: DataTypes.TEXT,
    logIndex: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });  
  return Record;
};