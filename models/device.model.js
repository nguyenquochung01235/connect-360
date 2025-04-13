const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
    const DeviceModel = sequelize.define("device",{
        id_device:{
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.BIGINT
        },
        device_name:{
            type: Sequelize.STRING
        },
        description:{
            type: Sequelize.STRING
        },
        channel:{
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
        timestamps: false,
        timestamps: true,
        createdAt: 'created_at',   
        updatedAt: 'updated_at'

    })
    return DeviceModel;
}

