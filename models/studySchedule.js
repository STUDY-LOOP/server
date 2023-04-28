const Sequelize = require('sequelize');

module.exports = class StudySchedule extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            scheduleDay: {
                type: Sequelize.STRING(10),
                allowNull: true,
            },
            scheduleTime: {
                type: Sequelize.TIME,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'StudySchedule',
            tableName: 'studySchedules',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.StudySchedule.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
    }
};