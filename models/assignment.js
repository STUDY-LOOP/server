const Sequelize = require('sequelize');

module.exports = class Assignment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            uploader: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            log: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            filename: {
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            fileOrigin:{
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            linkData: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'Assignment',
            tableName: 'assignments',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        // foreignKey: 스터디그룹 id
        db.Assignment.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
        // 제출자:사용자 = N:1
        db.Assignment.belongsTo(db.User, {
            foreignKey: 'uploader',
            targetKey: 'email',
        });
        // foreignKey: 스터디 세부내역 log
        db.Assignment.belongsTo(db.StudyLog, {
            foreignKey: 'log',
            sourceKey: 'log',
            onDelete: 'cascade',
        });
    }
};