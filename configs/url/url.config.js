
module.exports = {
    ADMIN_URL: {
        ADMIN_PANEL_URL : "/panel",
        ADMIN_LOGIN_URL : "/panel/login",
        ADMIN_LOGIN_AUTH_URL : "/panel/login/auth",
        ADMIN_LOGOUT_URL : "/panel/logout",
        ADMIN_DASHBOARD_URL : "/panel/dashboard",
        ADMIN_USER_MANAGEMENT_URL : "/panel/user-management",
        ADMIN_USER_MANAGEMENT_LIST_URL : "/panel/user-management/list",
        ADMIN_USER_MANAGEMENT_CREATE_URL : "/panel/user-management/create",
        ADMIN_USER_MANAGEMENT_VIEW_USER_DETAIL_URL : "/panel/user-management/user/:username",
        ADMIN_USER_MANAGEMENT_UPDATE_URL : "/panel/user-management/user/:username/update",
        ADMIN_DEVICE_MANAGEMENT_URL : "/panel/device-management",
        ADMIN_DEVICE_MANAGEMENT_LIST_URL : "/panel/device-management/list",
        ADMIN_DEVICE_MANAGEMENT_CREATE_URL : "/panel/device-management/create",
        ADMIN_DEVICE_MANAGEMENT_VIEW_DEVICE_DETAIL_URL : "/panel/device-management/device/:id_device",
        ADMIN_DEVICE_MANAGEMENT_UPDATE_URL : "/panel/device-management/device/:id_device/update",
        ADMIN_DEVICE_SEARCH_URL: "/panel/device-management/search"
    },
    USER_URL: {
        USER_LOGIN_URL : "/login",
        USER_LOGIN_AUTH_URL : "/login/auth",
        USER_LOGOUT_URL : "/logout",
        USER_HOME_URL : "/home",
        USER_DASHBOARD_URL : "/dashboard",
        USER_DEVICE_MANAGEMENT_URL : "/device-management"
    }
}