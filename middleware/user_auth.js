const jwt = require('jsonwebtoken');
const URL = require('../configs/url/url.config');
const UserService = require('../services/user/user.service');

const user_auth = async (req, res, next) => {
   
    try {
        const token = req.cookies.token;
        const data = jwt.verify(token, process.env.JWT_KEY);
        if (! await UserService.isUserExist(data.username)) {
            res.redirect('/login');
        } else {
            next();
        }
    } catch (err) {
        console.log(err);
        res.redirect('/login');

    }
}

const user_auth_api = async(req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const data = jwt.verify(token, process.env.JWT_KEY)
        if (! await UserService.isUserExist(data.username)) {
            res.status(401).send(({
                success: false,
                message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
                link: URL.USER_URL.USER_LOGIN_URL
            }))
        }else{
            next()
        } 
    } catch (error) {
        console.log(error)
        res.status(401).send(({
            success: false,
            message: "Unauthorization | Vui lòng đăng nhập lại trước khi sử dụng các chức năng",
            link: URL.USER_URL.USER_LOGIN_URL
        }))
    }
}

module.exports = {user_auth, user_auth_api}