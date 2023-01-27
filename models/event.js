const Sequelize = require('sequelize');

class Event extends Sequelize.Model {
  static initiate(sequelize) {
    Event.init({
      // event_id: {
      //   type: Sequelize.INTEGER,
      //   primaryKey: true,
      //   autoIncrement: true,
      // },
      event_title: {
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
      event_des: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,
      underscored: false,
      modelName: 'Event',
      tableName: 'events',
      paranoid: false,
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    //db.Event.belongsTo(db.studyGroup, { foreignKey: 'groupId', targetKey: 'group_id' });
  }
};

module.exports = Event;
