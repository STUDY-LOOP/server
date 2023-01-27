const Sequelize = require('sequelize');

class User extends Sequelize.Model {
  static initiate(sequelize) {
    User.init({
      // user_id: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      // },
      user_name: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      event_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      date_start: {
        type: Sequelize.DATE, //YYYY-MM-DDTHH:MM:SSZ
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
      date_end: {
        type: Sequelize.DATE, 
        allowNull: true,
        defaultValue: Sequelize.NOW,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'User',
      tableName: 'users',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    //db.User.belongsTo(db.studyGroup, { foreignKey: 'groupId', targetKey: 'group_id' });
  }
};

module.exports = User;
