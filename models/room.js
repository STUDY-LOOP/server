const Sequelize = require('sequelize');

class Room extends Sequelize.Model {
    static initiate(sequelize) {
        Room.init({
            groupId: {
                type: Sequelize.STRING(20),
                allowNull: false,
                unique: true,
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
            modelName: 'Room',
            tableName: 'room',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        //db.Chat.belongsTo(db.studyGroup, { foreignKey: 'groupId', targetKey: 'group_id' });
    }
};

module.exports = Room;