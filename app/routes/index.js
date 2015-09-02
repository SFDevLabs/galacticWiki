
/*!
 * Module dependencies.
 */

// Note: We can require users, articles and other cotrollers because we have

  var main = require('../controllers/index');
var express = require('express');
var users = require('../controllers/users');
/**
 * Expose routes
 */

module.exports = function (app, passport, auth) {

    /**
     * Route middlewares
     */
     
    // home route
    var articleAuth = [auth.requiresLogin, auth.article.hasAuthorization];
    var commentAuth = [auth.requiresLogin, auth.comment.hasAuthorization];

    app.get('/', main.index);

    //Resets the session return to controller
    app.post('/returnto', main.returnTo);

    // user routes
    app.get('/login', users.login);
    app.get('/signup', users.signup);
    app.get('/logout', users.logout);
    app.post('/users', users.create);
    app.post('/users/session',
    passport.authenticate('local', {
        failureRedirect: '/login',
        failureFlash: 'Invalid email or password.'
    }), users.session);
    app.get('/users/:userId', users.show);
    app.get('/auth/facebook',
    passport.authenticate('facebook', {
        scope: ['email', 'user_about_me'],
        failureRedirect: '/login'
    }), users.signin);
    app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        failureRedirect: '/login'
    }), users.authCallback);
    app.get('/auth/github',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }), users.signin);
    app.get('/auth/github/callback',
    passport.authenticate('github', {
        failureRedirect: '/login'
    }), users.authCallback);
    app.get('/auth/twitter',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }), users.signin);
    app.get('/auth/twitter/callback',
    passport.authenticate('twitter', {
        failureRedirect: '/login'
    }), users.authCallback);
    app.get('/auth/google',
    passport.authenticate('google', {
        failureRedirect: '/login',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ]
    }), users.signin);
    app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/login'
    }), users.authCallback);
    app.get('/auth/linkedin',
    passport.authenticate('linkedin', {
        failureRedirect: '/login',
        scope: [
          'r_emailaddress'
        ]
    }), users.signin);
    app.get('/auth/linkedin/callback',
    passport.authenticate('linkedin', {
        failureRedirect: '/login'
    }), users.authCallback);

    app.param('userid', users.load);

    app.get('/api/user/:userid', users.userapi);

    app.get('/user/*', main.index);

    /**
     * Error handling
     */
    app.use(function (err, req, res, next) {
        // treat as 404
        if (err.message          &&
      (~err.message.indexOf('not found')          ||
      (~err.message.indexOf('Cast to ObjectId failed')))) {
            return next();
        }
        console.error(err.stack);
        // error page

        res.status(500).render(__dirname + '/../views/500', {error: err.stack});
    });

    // assume 404 since no middleware responded
    app.use(function (req, res, next) {

        res.status(404).render('404', {
            url: req.originalUrl,
            error: 'Path Not found'
        });
    });

}
