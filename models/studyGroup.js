const Sequelize = require('sequelize');

module.exports = class StudyGroup extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            groupPublicId: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            groupName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            groupLeader: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            groupDescription: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: true,
            underscored: false,
            modelName: 'StudyGroup',
            tableName: 'studyGroups',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        // 스터디장:사용자 = N:1
        db.StudyGroup.belongsTo(db.User, {
            foreignKey: 'groupLeader',
            targetKey: 'email',
        });
        // 스터디:스터디원 = N:M
        db.StudyGroup.belongsToMany(db.User, {
            through: 'StudyMember',
            timestamps: false,
        });
        // 스터디:규칙 = 1:1
        db.StudyGroup.hasOne(db.StudyRule, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
        // 스터디:스터디일정 = 1:N
        db.StudyGroup.hasMany(db.StudySchedule, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
        // 스터디:세부내역 = 1:1
        db.StudyGroup.hasMany(db.StudyRule, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
        // 스터디:과제함 = 1:N
        db.StudyGroup.hasMany(db.AssignmentBox, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
    }
};