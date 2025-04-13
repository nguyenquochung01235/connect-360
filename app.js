const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const database = require("./models");
const Router = require('./routers/index.js');


const app = express();

database.sequelize.sync();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
    
app.use('/admin', Router.ADMIN);
app.use('/', Router.USER);


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


module.exports = app;