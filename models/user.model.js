const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
    const UserModel = sequelize.define("user",{
        id_user:{
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.BIGINT
        },
        username:{
            type: Sequelize.STRING
        },
        password:{
            type: Sequelize.STRING
        },
        token:{
            type: Sequelize.STRING

        },
        active:{
            type: Sequelize.INTEGER
        },
        created_at:{
            type: Sequelize.DATE
        },
        updated_at:{
            type: Sequelize.DATE
        },
    }, {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',   
        updatedAt: 'updated_at'

    })
    return UserModel;
}

