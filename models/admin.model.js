const { sequelize, Sequelize } = require('.')

module.exports = (sequelize, Sequelize) => {
    const AdminModel = sequelize.define("admin",{
        id_admin:{
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
        is_super_admin:{
            type: Sequelize.INTEGER
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        createdAt: false,   
        updatedAt: false    
    })
    return AdminModel;
}

