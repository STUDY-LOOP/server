const Sequelize = require('sequelize');

module.exports = class StudyRule extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            rule: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
            lateTime: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            lateFee: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            absentTime: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            absentFee: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'StudyRule',
            tableName: 'studyrules',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.StudyRule.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            targetKey: 'groupId',
            onDelete: 'cascade',
        });
    }
};