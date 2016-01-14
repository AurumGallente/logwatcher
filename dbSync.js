var Sequelize = require("sequelize");
var config = require('./config.js');
var sequelize = new Sequelize(config.db, config.user, config.password, config.config);
sequelize.sync({force:true});