const { Op } = require('sequelize');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const database = require('../../models');

const AdminModel = database.adminModel;
const AdminService = {};

AdminService.isExisted = async function(username) {
    return await AdminModel.findOne({where : { username: `${username}` }}).then( async function(data) {
        if(data.length == 0){return false}
        return true;
    }).catch(err=>{
        return false
    })
}

module.exports = AdminService;