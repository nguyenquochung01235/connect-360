const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
    const UserDevice = sequelize.define("user_device",{
        id_user:{
            type: Sequelize.BIGINT
        },
        id_device:{
            type: Sequelize.BIGINT
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,
        updatedAt: false,

    })
    return UserDevice;
}

