const Sequelize = require('sequelize');

class Chat extends Sequelize.Model {
  static initiate(sequelize) {
    Chat.init({
      roomId: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
      },
      userName: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      userName: {
        type: Sequelize.STRING(200),
        allowNull: false,
      }, 
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Chat',
      tableName: 'chats',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    //db.Chat.belongsTo(db.Room, { foreignKey: 'groupId', targetKey: 'group_id' });
  }
};

module.exports = Chat;
