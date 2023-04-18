const Sequelize = require('sequelize');

module.exports = class Attendance extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            id: {
				type : Sequelize.INTEGER,
				primaryKey : true,
				autoIncrement : true
			},
            eventId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            groupPublicId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            userNick: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            enterDate: {
                type: Sequelize.DATE, ////YYYY-MM-DDTHH:MM:SSZ
                allowNull: true,
            },
            attendState: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: -1, //지각
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
        // foreignKey: event id
        db.Attendance.belongsTo(db.Event, {
            foreignKey: 'eventId',
            sourceKey: 'id',
            onDelete: 'cascade',
            onUpdate: 'cascade',
        });
    }
};