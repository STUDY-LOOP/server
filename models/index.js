const Sequelize = require('sequelize');
//const Chat = require('./chat');
//const User = require('./user');
const Event = require('./event');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;

//db.Chat = Chat;
//db.User = User;
db.Event = Event;

//Chat.initiate(sequelize);
//User.initiate(sequelize);
Event.initiate(sequelize);

//Chat.associate(db);
//User.associate(db);
Event.associate(db);

module.exports = db;