const Sequelize = require('sequelize');
//const { toDefaultValue } = require('sequelize/types/utils');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: true,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.User.belongsToMany(db.StudyGroup, {
            through: 'GroupMember',
            foreignKey: 'email',
        });
    }
};