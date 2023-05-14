const Sequelize = require('sequelize');

module.exports = class Attendance extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id: {
				type : Sequelize.INTEGER,
				primaryKey : true,
				autoIncrement : true
			},
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            groupId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            eventId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            attendState: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 2, // 미입력
            },        
            enterDate: {
                type: Sequelize.DATE, // YYYY-MM-DDTHH:MM:SSZ
                allowNull: true,
            },       
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Attendance',
            tableName: 'attendances',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.Attendance.belongsTo(db.User, {
            foreignKey: 'email',
            targetKey: 'email',
            onDelete: 'cascade', 
        });
        db.Attendance.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            sourceKey: 'groupId',
            onDelete: 'cascade',
        });
        db.Attendance.belongsTo(db.Event, {
            foreignKey: 'eventId',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
    }
};