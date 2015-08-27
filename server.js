/*!
 * nodejs-express-mongoose-demo
 * Copyright(c) 2013 Madhusudhan Srinivasa <madhums8@gmail.com>
 * MIT Licensed
 */
/**
 * Module dependencies
 */
var glob = require("glob")
var fs = require('fs');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var config = require('./config/config');

var app = express();
var port = process.env.PORT || 3000;
var auth = require('./config/middlewares/authorization');

// Connect to mongodb
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);
//get all the models
glob.sync(__dirname + '/app/*/models/*', {}).forEach(function (file) {
  if (~file.indexOf('.js')) require(file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

// Bootstrap application settings
require('./config/express')(app, passport);

// Bootstrap routes
require(__dirname + '/app/users/routes/index.js')(app, passport, auth); //always do user routes first
glob.sync(__dirname + '/app/*/routes/*', {}).forEach(function (file) {
  if (file.indexOf('app/main/routes'||'app/users/routes')===-1 && ~file.indexOf('.js')) require(file)(app, passport, auth);
});
require(__dirname + '/app/main/routes/index.js')(app, passport, auth); //always do main routes last

app.listen(port);
console.log('Express app started on port ' + port);

/**
 * Expose
 */

module.exports = app;
