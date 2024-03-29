const Sequelize = require('sequelize');

module.exports = class Event extends Sequelize.Model{
	static init(sequelize) {
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
			event_title: {
				type: Sequelize.STRING(30),
				allowNull: false,
			},
			event_type: {
				type: Sequelize.STRING(30),
				allowNull: false,
			},
			event_color: {
				type: Sequelize.STRING(30),
				allowNull: false,
			},
			date_start: {
				type: Sequelize.DATE, //YYYY-MM-DDTHH:MM:SSZ
				allowNull: true,
			},
			date_end: {
				type: Sequelize.DATE,
				allowNull: true,
			},
			event_des: {
				type: Sequelize.STRING(100),
				allowNull: true,
			},
			boxId: {
                type: Sequelize.STRING,
                allowNull: true,
            },
		}, {
			sequelize,
			timestamps: true,
			underscored: false,
			modelName: 'Event',
			tableName: 'events',
			paranoid: false,
			charset: 'utf8mb4',
			collate: 'utf8mb4_general_ci',
		});
	}

	static associate(db) {
		db.Event.belongsTo(db.StudyGroup, {
            foreignKey: 'groupId',
            targetKey: 'groupId',
            onDelete: 'cascade',
        });
		db.Event.belongsTo(db.AssignmentBox, {
            foreignKey: 'boxId',
            sourceKey: 'boxId',
            onDelete: 'cascade',
        });
		db.Event.hasOne(db.StudyLog, {
            foreignKey: 'log',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
		db.Event.hasOne(db.Attendance, {
            foreignKey: 'eventId',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
		db.Event.hasOne(db.Assignment, {
            foreignKey: 'eventId',
            sourceKey: 'id',
            onDelete: 'cascade',
        });
	}
};