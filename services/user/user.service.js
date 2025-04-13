const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const database = require('../../models');

const DeviceService = require('../device/device.service');

const UserModel = database.userModel;
const UserService = {};

UserService.isUserExist = async function(username) {
    const user = await UserModel.findOne({
        where: {
            username: username
        }
    }).then(async function(data) {
        if (data == null) { return false }
        return true;
    }).catch(err => {
        return false
    });
    return user;
}

UserService.getUserAndDeviceByUsername = async function(username) {
    if (username == null || username == "") {
        return false;
    }
    if (await this.isUserExist(username) == false) {
        return false;
    }
    const user = await UserModel.findOne({
        where: {
            username: username
        },
        include: [
            {
                model: database.deviceModel,
                as: 'devices',
                attributes: ['id_device', 'device_name', 'description','channel', 'active'],
                through: {
                    attributes: []
                }
            }
        ],
        attributes: ['id_user', 'username', 'active', 'created_at', 'updated_at']
    }).then(async function(data) {
        if (data == null) { return false }
        return data;
    }).catch(err => {
        return false
    }); 
    return user;
}

UserService.createUser = async function(username, password, repassword ,active, devices) {
    const error = [];
    const t = await database.sequelize.transaction();

    if (username == null || username == "" || username.length < 6 ) {
        error.push("Username is required and must be at least 6 characters");
    }
    if (password == null || password == "" || password.length < 6) {
        error.push("Password is required and must be at least 6 characters");
    }
    if( password != repassword) {
        error.push("Password and Confirm Password must be same");
    }
    if (active == null || active == "" || (active != 0 && active != 1)) {
        error.push("Active value only 0 or 1");
    }
    if(await UserService.isUserExist(username)){
        error.push("User already exists");
    }
    if(error.length > 0){
        return {
            success: false,
            message: error
        }
    }
    try {
        const salt = bcrypt.genSaltSync();
        password = bcrypt.hashSync(password, salt)
        const user = await UserModel.create(
            {
                username: username,
                password: password,
                active: active
            },{ transaction: t }
        ).then(async function(data) {
            if (data == null) { return false }
            return data;
        }).catch(err => {
            return false
        });
        if (user == false) {
            return {
                success: false,
                message: "User creation failed"
            }
        }


        if (devices != null && devices.length > 0) {
            const devicesList = await DeviceService.getDeviceByListChannel(devices);
            if (devicesList.length == 0) {
                return {
                    success: false,
                    message: "Device not found"
                }
            }
            const mapDeviceToUser = await user.addDevices(devicesList,{ transaction: t }).then(async function(data) {
                return true;
            }).catch(err => {
                console.log(err);
                return false
            });
            if (mapDeviceToUser == false) {
                return {
                    success: false,
                    message: "Device mapping failed"
                }
            }
        }
        await t.commit();
        return {
            success: true,
            message: "User created successfully"
        }
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        return {
            success: false,
            message: "Transaction failed"
        }
    }
    


}

UserService.updateUser = async function(username, password, repassword ,active, devices) {
    const error = [];
    const t = await database.sequelize.transaction();

    if (password != "" && password.length) {
        error.push("Password must be at least 6 characters");
    }
    if( password != repassword) {
        error.push("Password and Confirm Password must be same");
    }
    if (active == null || active == "" || (active != 0 && active != 1)) {
        error.push("Active value only 0 or 1");
    }
    
    if (await this.isUserExist(username) == false) {
        error.push("User not found");
    }

    if(error.length > 0){
        return {
            success: false,
            message: error
        }
    }
    try {
        const user = await UserModel.findOne({
            where: {
                username: username
            }
        }).then(async function(data) {
            if (data == null) { return false }
            return data;
        }).catch(err => {
            return false
        });
        if (user == false) {
            return {
                success: false,
                message: "User not found"
            }
        }
        if (password != null && password != "") {
            const salt = bcrypt.genSaltSync();
            password = bcrypt.hashSync(password, salt)
        }else{
            password = user.password;
        }
        
        const userUpdate = await user.update(
            {
                password: password,
                active: active
            },
            {
                where: {
                    username: username
                }
            },{ transaction: t }
        ).then(async function(data) {
            if (data == null) { return false }
            return data;
        }).catch(err => {
            return false
        });
        if (userUpdate == false) {
            return {
                success: false,
                message: "User update failed"
            }
        }

        if (devices != null && devices.length > 0) {
            const devicesList = await DeviceService.getDeviceByListChannel(devices);
            if (devicesList.length == 0) {
                return {
                    success: false,
                    message: "Device not found"
                }
            }
            const mapDeviceToUser = await user.setDevices(devicesList,{ transaction: t }).then(async function(data) {
                return true;
            }).catch(err => {
                console.log(err);
                return false
            });
            if (mapDeviceToUser == false) {
                return {
                    success: false,
                    message: "Device mapping failed"
                }
            }
        }else{
            const mapDeviceToUser = await user.setDevices([],{ transaction: t }).then(async function(data) {
                return true;
            }).catch(err => {
                console.log(err);
                return false
            });
            if (mapDeviceToUser == false) {
                return {
                    success: false,
                    message: "Device mapping failed"
                }
            }
        }
        await t.commit();
        return {
            success: true,
            message: "User update successfully"
        }
    }
    catch (err) {
        console.log(err);
        await t.rollback();
        return {
            success: false,
            message: "Transaction failed"
        }
    }
    


}

UserService.getAllUsersPaginate = async function(page,search) {
    limit = 10
    if(page == null || page < 1){
        page = 1
    }
    if(search == null || search == "") {
        search = ""
    }
    search = search.toLowerCase();
    const where = {
        [Op.or]: [
            {
                username: {
                    [Op.like]: '%' + search + '%'
                }
            }
        ]
    };
    const offset = (page - 1) * limit;
    const totalUsers = await UserModel.count({where: where});
    const totalPages =   Math.ceil(totalUsers / limit);
    const users = await UserModel.findAll({
        where: where,
        order: [
            ['updated_at', 'DESC']
        ],
        attributes: ['id_user', 'username', 'active', 'created_at', 'updated_at'],
        limit: limit,
        offset: offset
    }).then( async function(data) {
        if(data.length == 0){return false}
        return data;

    }).catch(err=>{
        return false
    });
    
    return data = {
        users: users,
        totalPages: totalPages,
        currentPage: page,
        totalUsers: totalUsers
    };

    
}   

UserService.getActiveDevicesByUsername = async function(username) {
    if (username == null || username == "") {
        return false;
    }
    if (await this.isUserExist(username) == false) {
        return false;
    }
    const user = await UserModel.findOne({
        where: {
            username: username
        },
        include: [
            {
                model: database.deviceModel,
                as: 'devices',
                attributes: ['id_device', 'device_name','channel', 'active'],
                where: {
                    active: 1
                },
                through: {
                    attributes: []
                }
            }
        ],
        attributes: ['id_user', 'username', 'active', 'created_at', 'updated_at']
    }).then(async function(data) {
        if (data == null) { return false }
        return data;
    }).catch(err => {
        return false
    }); 
    return user;
}


module.exports = UserService;