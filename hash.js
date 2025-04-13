const bcrypt = require('bcryptjs')

const salt = bcrypt.genSaltSync();
password = bcrypt.hashSync('123123', salt)
console.log(password)