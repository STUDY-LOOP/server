const Sequelize = require('sequelize');

module.exports = class StudyType extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            interest0: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest1: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest2: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest3: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest4: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest5: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'StudyTypes',
            tableName: 'StudyTypes',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.StudyType.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            targetKey: 'groupId',
            onDelete: 'cascade',
        });
    }
};