const Sequelize = require('sequelize');

module.exports = class Chat extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        chatId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        groupId: {
          type: Sequelize.STRING(255),
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING(40),
          primaryKey: true,
        },
        userNick: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        notice: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: 0,
        },
        content: {
          type: Sequelize.STRING(5000),
          allowNull: true,
        },
        datetime: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.NOW,
        },
      },
      {
        sequelize,
        timestamps: true,
        underscored: false,
        modelName: 'Chat',
        tableName: 'chats',
        paranoid: false,
        charset: 'utf8',
        collate: 'utf8_general_ci',
      }
    );
  }

  static associate(db) {
    // chat:스터디 = N:1
    db.Chat.hasMany(db.StudyGroup, {
      foreignKey: 'groupId',
      targetKey: 'groupId',
    });
    // chat:유저 = N:1
    db.Chat.hasMany(db.User, {
      foreignKey: 'email',
      targetKey: 'email',
    });
  }
};
