const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const database = require('../../models');

const AdminModel = database.adminModel;
const AdminLoginService = {};

AdminLoginService.generateToken = function(username){
    return jwt.sign({username: username, role:"MASTER"}, process.env.JWT_KEY)
}

AdminLoginService.login = async function(username, password) {
    return await AdminModel.findOne({where : { username: `${username}` }}).then( async function(data) {
        if(data.length == 0){return false}

        const isPasswordMatch = await bcrypt.compare(password, data.password);
        if (!isPasswordMatch) {return false}

        return true;

    }).catch(err=>{
        return false
    })
}

module.exports = AdminLoginService;