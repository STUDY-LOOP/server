const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const studyGroup = require('./studyGroup');
const studySchedule = require('./studySchedule');
const studyRule = require('./studyRule');
const studyType = require('./studyType');
const studyLog = require('./studyLog');
const assignmentBox = require('./assignmentBox');
const assignment = require('./assignment');
const attendance = require('./attendance');
const event = require('./event');
const chat = require('./chat');
const user = require('./user');
const userInterest = require('./userInterest');

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.StudyGroup = studyGroup;
db.StudySchedule = studySchedule;
db.StudyRule = studyRule;
db.StudyType = studyType;
db.StudyLog = studyLog;
db.AssignmentBox = assignmentBox;
db.Assignment = assignment;
db.Attendance = attendance;
db.Event = event;
db.Chat = chat;
db.User = user;
db.UserInterest = userInterest;

studyGroup.init(sequelize);
studySchedule.init(sequelize);
studyRule.init(sequelize);
studyType.init(sequelize);
studyLog.init(sequelize);
assignmentBox.init(sequelize);
assignment.init(sequelize);
attendance.init(sequelize);
event.init(sequelize);
chat.init(sequelize);
user.init(sequelize);
userInterest.init(sequelize);

studyGroup.associate(db);
studySchedule.associate(db);
studyRule.associate(db);
studyType.associate(db);
studyLog.associate(db);
assignmentBox.associate(db);
assignment.associate(db);
attendance.associate(db);
event.associate(db);
chat.associate(db);
user.associate(db);
userInterest.associate(db);

module.exports = db;
