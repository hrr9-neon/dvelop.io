//add express
var express = require('express');

//?
var favicon = require('serve-favicon');

//logger middleware for node.js
var logger = require('morgan');

//TODO: What do these do?
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//require firebase


app = express();
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
app.set('port', process.env.PORT || 5000);
app.use(logger('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json



//Create the servor
app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});