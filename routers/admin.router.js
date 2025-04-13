const express = require('express');

const router = express.Router();
const URL = require('../configs/url/url.config');
const {admin_auth,admin_auth_api} = require('../middleware/admin_auth');

const AdminLoginService = require('../services/admin/admin.login.service');
const AdminService = require('../services/admin/admin.service');
const UserService = require('../services/user/user.service');
const DeviceService = require('../services/device/device.service');

// Admin Login Page
router.get(URL.ADMIN_URL.ADMIN_LOGIN_URL, async (req, res, next) => {
    res.render('admin/admin_panel_login', { title: "LOGIN | CONNECT 360" });
});

// Admin Login Authentication
router.post(URL.ADMIN_URL.ADMIN_LOGIN_AUTH_URL, async (req, res, next) => {
    if (await AdminLoginService.login(req.body.username, req.body.password)) {
        const token = AdminLoginService.generateToken(req.body.username);
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

// Admin Panel
router.get(URL.ADMIN_URL.ADMIN_PANEL_URL, admin_auth,async (req, res, next) => {
    res.render('admin/admin_panel', { title: "LOGIN | CONNECT 360" });
});

// User List Page
router.get(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_URL, admin_auth, async (req, res, next) => {
    res.render('admin/user_management/user_list',
        { 
            title: "User Management | CONNECT 360",
            data: []
        });
    
});

// Create User Page
router.get(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_CREATE_URL, admin_auth, async (req, res, next) => {
        res.render('admin/user_management/user_create',
            { 
                title: "Create New User | CONNECT 360",
                data: [] 
            }); 
});

// Edit User Page
router.get(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_VIEW_USER_DETAIL_URL, admin_auth, async (req, res, next) => {
    const data = await UserService.getUserAndDeviceByUsername(req.params.username);
    if(data == false) {
        res.redirect(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_URL);
        return;
    }
    res.render('admin/user_management/user_update',
        { 
            title: "Update User | CONNECT 360",
            data: data 
        }); 
});

// User List API
router.get(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_LIST_URL, admin_auth_api, async (req, res, next) => {
    try {
        const data = await UserService.getAllUsersPaginate(req.query.page, req.query.search);
        res.status(200).send(({
            success: true,
            message: "Get All Users Success",
            data: data
        }))
    } catch (error) {
        console.log(error);
        res.status(400).send(({
            success: false,
            message: "Get All Users False",
            data: null
        }))
    }
});

router.get(URL.ADMIN_URL.ADMIN_DEVICE_SEARCH_URL, admin_auth_api, async (req, res, next) => {
    try {
        if(req.query.channel == null || req.query.channel == undefined || req.query.channel == "") {
            res.status(200).send(({
                success: false,
                message: "Get All Devices False",
                data: null
            }))
            return;
        }
        const data = await DeviceService.searchDevice(req.query.channel);
        res.status(200).send(({
            success: true,
            message: "Get All Devices Success",
            data: data
        }))
    } catch (error) {
        res.status(400).send(({
            success: false,
            message: "Get All Devices False",
            data: null
        }))
    }
});

router.post(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_CREATE_URL, admin_auth_api, async (req, res, next) => {
    const result = await UserService.createUser(req.body.username, req.body.password, req.body.repassword, req.body.active, req.body.devices); 
    if (result.success) {
        res.status(200).send(({
            success: true,
            message: result.message,
        }))
    } else {
        res.status(400).send(({
            success: false,
            message: result.message,
        }))
    } 
});

router.post(URL.ADMIN_URL.ADMIN_USER_MANAGEMENT_UPDATE_URL, admin_auth_api, async (req, res, next) => {
    const result = await UserService.updateUser(req.body.username, req.body.password, req.body.repassword, req.body.active, req.body.devices); 
    if (result.success) {
        res.status(200).send(({
            success: true,
            message: result.message,
        }))
    } else {
        res.status(400).send(({
            success: false,
            message: result.message,
        }))
    } 
});

// Device List Page
router.get(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_URL, admin_auth, async (req, res, next) => {
    res.render('admin/device_management/device_list',
        { 
            title: "Device Management | CONNECT 360",
            data: []
        });
    
});
// Device List Paginate API
router.get(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_LIST_URL, admin_auth_api, async (req, res, next) => {
    try {
        const data = await DeviceService.getAllDevicesPaginate(req.query.page, req.query.search);
        res.status(200).send(({
            success: true,
            message: "Get All Devices Success",
            data: data
        }))
    } catch (error) {
        console.log(error);
        res.status(400).send(({
            success: false,
            message: "Get All Devices False",
            data: null
        }))
    }
});

// Create Device Page
router.get(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_CREATE_URL, admin_auth, async (req, res, next) => {
    res.render('admin/device_management/device_create',
        { 
            title: "Create New Device | CONNECT 360",
            data: [] 
        }); 
});
// Create Device API
router.post(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_CREATE_URL, admin_auth, async (req, res, next) => {
    const result = await DeviceService.createDevice(req.body.device_name, req.body.channel, req.body.description, req.body.active);
    if (result.success) {
        res.status(200).send(({
            success: true,
            message: result.message,
        }))
    } else {
        res.status(400).send(({
            success: false,
            message: result.message,
        }))
    } 
});

// Update Device Page
router.get(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_VIEW_DEVICE_DETAIL_URL, admin_auth, async (req, res, next) => {
    const data = await DeviceService.getDeviceByID(req.params.id_device);
    if(data == false) {
        res.redirect(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_URL);
        return;
    }
    res.render('admin/device_management/device_update',
        { 
            title: "Update Device | CONNECT 360",
            data: data 
        }); 
});

// Update Device API
router.post(URL.ADMIN_URL.ADMIN_DEVICE_MANAGEMENT_UPDATE_URL, admin_auth, async (req, res, next) => {
    const result = await DeviceService.updateDevice(req.body.id_device,req.body.device_name, req.body.channel, req.body.description, req.body.active);
    if (result.success) {
        res.status(200).send(({
            success: true,
            message: result.message,
        }))
    } else {
        res.status(400).send(({
            success: false,
            message: result.message,
        }))
    } 
});

module.exports = router;
