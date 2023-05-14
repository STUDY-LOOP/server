const Sequelize = require('sequelize');

module.exports = class userInterest extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            email: {
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            interest0: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest1: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest2: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest3: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest4: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
            interest5: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'UserInterest',
            tableName: 'UserInterests',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db){
        db.UserInterest.belongsTo(db.User, {
            foreignKey: 'email',
            targetKey: 'email',
            onDelete: 'cascade',
        });
    }
};