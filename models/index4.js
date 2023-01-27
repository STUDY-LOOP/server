const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const studyGroup = require('./studyGroup');
const studySchedule = require('./studySchedule');
const studyRule = require('./studyRule');
const studyLog = require('./studyLog');
const assignmentBox = require('./assignmentBox');
const assignment = require('./assignment');
const event = require('./event');
//const chat = require('./chat');
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
db.AssignmentBox = assignmentBox;
db.Assignment = assignment;
db.Event = event;
//db.Chat = chat;
db.User = user;

studyGroup.init(sequelize);
studySchedule.init(sequelize);
studyRule.init(sequelize);
studyLog.init(sequelize);
assignmentBox.init(sequelize);
assignment.init(sequelize);
event.init(sequelize);
//chat.init(sequelize);
user.init(sequelize);

studyGroup.associate(db);
studySchedule.associate(db);
studyRule.associate(db);
studyLog.associate(db);
assignmentBox.associate(db);
assignment.associate(db);
event.associate(db);
//chat.associate(db);
user.associate(db);

module.exports = db;