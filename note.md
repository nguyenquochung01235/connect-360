User:
    - Normal User
    - Admin User

Feature List:
    Admin:
        - Login
        - Device Management:
            - Add new device
            - Update device
            - Delete device
        - User Management:
            - Add new user
            - Update user
            - Delete user
    User:
        - Login
        - View devices

Model:
    - Admin
    - User
    - Device

Database:
    - tbl_admin:
        - id
        - username
        - password
        - token
    - tbl_user
        -
    - tbl_device
    - tbl_user_device
update