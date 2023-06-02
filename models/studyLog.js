const Sequelize = require('sequelize');

module.exports = class StudyLog extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id: {
				type : Sequelize.INTEGER,
				primaryKey : true,
				autoIncrement : true
			},
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            log: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            content: {
                type: Sequelize.TEXT,
                allowNull: true,
            },

        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'StudyLog',
            tableName: 'studyLogs',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.StudyLog.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            targetKey: 'groupId',
            onDelete: 'cascade',
        });
        db.StudyLog.belongsTo(db.Event, {
            foreignKey: 'log',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
    }
};