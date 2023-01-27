const Sequelize = require('sequelize');

module.exports = class AssignmentBox extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            log: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            boxId: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true,
            },
            title: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            content: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            deadline: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'AssignmentBox',
            tableName: 'assignmentBoxes',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        // foreignKey: 스터디그룹 id
        db.AssignmentBox.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
        // foreignKey: 스터디 세부내역 log
        db.AssignmentBox.belongsTo(db.StudyLog, {
            foreignKey: 'log',
            sourceKey: 'log',
            onDelete: 'cascade',
        });
        db.AssignmentBox.hasMany(db.Assignment, {
            foreignKey: 'boxId',
            sourceKey: 'boxId',
            onDelete: 'cascade',
        });
    }
};