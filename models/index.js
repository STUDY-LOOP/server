const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const studyGroup = require('./studyGroup');
const studySchedule = require('./studySchedule');
const studyRule = require('./studyRule');
const studyLog = require('./studyLog');
const assignment = require('./assignment');
const user = require('./user');

const db = {};
const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.StudyGroup = studyGroup;
db.StudySchedule = studySchedule;
db.StudyRule = studyRule;
db.StudyLog = studyLog;
db.Assignment = assignment;
db.User = user;

studyGroup.init(sequelize);
studySchedule.init(sequelize);
studyRule.init(sequelize);
studyLog.init(sequelize);
assignment.init(sequelize);
user.init(sequelize);

studyGroup.associate(db);
studySchedule.associate(db);
studyRule.associate(db);
studyLog.associate(db);
assignment.associate(db);
user.associate(db);

module.exports = db;