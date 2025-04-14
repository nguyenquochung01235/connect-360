const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const URL = require('../configs/url/url.config');
const {user_auth,user_auth_api} = require('../middleware/user_auth');
const UserLoginService = require('../services/user/user.login.service');
const UserService = require('../services/user/user.service');

// User Login Page
router.get("/", async (req, res, next) => {
    res.render('login', { title: "Connect 360 | Đăng nhập" });
});

router.get(URL.USER_URL.USER_LOGIN_URL, async (req, res, next) => {
    res.render('login', { title: "Connect 360 | Đăng nhập" });
});

// User Login Authentication
router.post(URL.USER_URL.USER_LOGIN_AUTH_URL, async (req, res, next) => {
    if (await UserLoginService.login(req.body.username, req.body.password)) {
        const token = UserLoginService.generateToken(req.body.username);
        res.cookie('token', token, { httpOnly: true });
        res.status(200).send(({
            success: true,
            message: "Login success",
            token: token
        }))
    } else {
        res.status(400).send(({
            success: false,
            message: "Login False",
        }))
    }
})

// User Home
router.get(URL.USER_URL.USER_HOME_URL, user_auth,async (req, res, next) => {
    const token = req.cookies.token;
    const userToken = jwt.verify(token, process.env.JWT_KEY);
    const data = await UserService.getUserAndDeviceByUsername(userToken.username);
    res.render('home', { 
        title: "Connect 360 | Trang chủ" 
        , data: data
    });
});

module.exports = router;
