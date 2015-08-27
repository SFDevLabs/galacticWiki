
/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have

 var main = require('../controllers/index');
 var express = require('express');

/**
 * Expose routes
 */

module.exports = function (app, passport, auth) {

  /**
   * Route middlewares
   */

  // home route
  //app.get('/', main.index);
  
  //Resets the session return to controller
  app.post('/returnto', main.returnTo);

  /**
   * Error handling
   */
  app.use(function (err, req, res, next) {
    // treat as 404
    if (err.message
      && (~err.message.indexOf('not found')
      || (~err.message.indexOf('Cast to ObjectId failed')))) {
      return next();
    }
    console.error(err.stack);
    // error page
    
    res.status(500).render(__dirname+'/../views/500', { error: err.stack });
  });

  // assume 404 since no middleware responded
  app.use(function (req, res, next) {

    res.status(404).render('main/views/404', {
      url: req.originalUrl,
      error: 'Path Not found'
    });
  });
}
