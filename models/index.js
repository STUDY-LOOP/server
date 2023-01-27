const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const User = require('./user1');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;

User.initiate(sequelize);

User.associate(db);

module.exports = db;
