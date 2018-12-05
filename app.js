const compression   = require('compression');
const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const logger        = require('morgan');
const cors          = require('cors');


const app = express();
app.use(compression());
const router = express.Router();

// Required all routes
const test = require('./server/routes/test')(router);
const bcdb = require('./server/routes/bcdb')(router);

//app.use(cors({ origin: 'http://localhost:4200' }));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// Use all routes
app.use('/IoT', test);
app.use('/bcdb', bcdb);


//Error handler
app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: err
    });
    return;
});

module.exports = app;
