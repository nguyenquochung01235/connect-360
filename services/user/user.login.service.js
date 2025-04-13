const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const database = require('../../models');

const UserModel = database.userModel;
const UserLoginService = {};

UserLoginService.generateToken = function(username){
    return jwt.sign({username: username, role:"USER"}, process.env.JWT_KEY)
}

UserLoginService.login = async function(username, password) {
    return await UserModel.findOne({where : { username: `${username}` }}).then( async function(data) {
        if(data.length == 0){return false}

        const isPasswordMatch = await bcrypt.compare(password, data.password);
        if (!isPasswordMatch) {return false}

        return true;

    }).catch(err=>{
        return false
    })
}

module.exports = UserLoginService;