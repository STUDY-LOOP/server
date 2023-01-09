const Sequelize = require('sequelize');

module.exports = class StudyRule extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING,
                allowNull: true,
                unique: true,
            },
            rule: {
                type: Sequelize.TEXT,
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'StudyRule',
            tableName: 'studyrules',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.StudyRule.hasOne(db.StudyGroup)
        // db.StudyRule.belongsTo(db.StudyGroup, {
        //     foreignKey: 'groupId',
        //     sourceKey: 'groupId',
        // })
    }
};