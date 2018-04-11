var express = require('express');
var path = require('path');

var cookieParser = require('cookie-parser');

var session = require("express-session");
var bodyParser = require('body-parser');

var index = require('./routes/index');
var admin = require('./routes/admin');

var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/public",express.static("public"));

app.use('/', index);
app.use('/admin', admin);

app.use('/api', api);


app.listen(5000);
