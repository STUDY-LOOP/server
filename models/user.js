/* 작업용 임시 파일 */
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            userNick: {
                type: Sequelize.STRING(30),
                allowNull: false,
            },
            userPW: {
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
            through: 'StudyMember',
        });
        db.User.hasMany(db.Assignment, {
            foreignKey: 'uploader',
            sourceKey: 'email',
            onDelete: 'cascade',
        });
    }
};