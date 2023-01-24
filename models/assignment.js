const Sequelize = require('sequelize');

module.exports = class Assignment extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            boxId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            uploader: {
                type: Sequelize.STRING(40),
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
            submittedOn: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.fn('now'),
            },
        }, {
            sequelize,
            timestamps: false,
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
        db.Assignment.belongsTo(db.AssignmentBox, {
            foreignKey: 'boxId',
            sourceKey: 'boxId',
            onDelete: 'cascade',
        });
        // 제출자:사용자 = N:1
        db.Assignment.belongsTo(db.User, {
            foreignKey: 'uploader',
            targetKey: 'email',
        });
    }
};