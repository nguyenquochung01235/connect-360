const DATABASE_CONFIG = require("../configs/database/database.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
    DATABASE_CONFIG.DATABASE,
    DATABASE_CONFIG.USERNAME,
    DATABASE_CONFIG.PASSWORD, {
    host: DATABASE_CONFIG.HOST,
    dialect: DATABASE_CONFIG.DIALECT,
    operatorsAliases: false,
    port:DATABASE_CONFIG.PORT,
    pool: {
      max: DATABASE_CONFIG.POOL.MAX,
      min: DATABASE_CONFIG.POOL.MIN,
      acquire: DATABASE_CONFIG.POOL.ACQUIRE,
      idle: DATABASE_CONFIG.POOL
    }
  });

const database = {};

database.Sequelize = Sequelize;
database.sequelize = sequelize;
// // define model and table
database.adminModel = require("./admin.model.js")(sequelize, Sequelize);
database.userModel = require("./user.model.js")(sequelize, Sequelize);
database.deviceModel = require("./device.model.js")(sequelize, Sequelize);
database.userDeviceModel = require("./user_device.model.js")(sequelize, Sequelize);

// // define relationship
database.userModel.belongsToMany(database.deviceModel, {
  through: database.userDeviceModel,
  foreignKey: "id_user"
});
database.deviceModel.belongsToMany(database.userModel, {
  through: database.userDeviceModel,
  foreignKey: "id_device"
});

module.exports = database;