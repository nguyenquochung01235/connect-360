const jwt = require('jsonwebtoken');
const URL = require('../configs/url/url.config');
const AdminService = require('../services/admin/admin.service');

const admin_auth = async (req, res, next) => {
   
    try {
        const token = req.cookies.token;
        const data = jwt.verify(token, process.env.JWT_KEY);
        if (! await AdminService.isExisted(data.username)) {
            res.redirect('/admin/panel/login');
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.redirect('/admin/panel/login');

    }
}

const admin_auth_api = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        if (! await AdminService.isExisted(data.username)) {
            res.status(401).send(({
                success: false,
                message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
                link: URL.ADMIN_URL.ADMIN_LOGIN_URL
            }))
        }else{
            next()
        } 
    } catch (error) {
        console.log(error)
        res.status(401).send(({
            success: false,
            message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
            link: URL.ADMIN_URL.ADMIN_LOGIN_URL
        }))
    }
}

module.exports = {admin_auth, admin_auth_api}