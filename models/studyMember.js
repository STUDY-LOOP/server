const Sequelize = require('sequelize');

module.exports = class StudyMember extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'StudyMember',
            tableName: 'studyMembers',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.StudySchedule.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
        });
        db.StudySchedule.belongsTo(db.User, {
            foreignKey: 'email',
        });
    }
};