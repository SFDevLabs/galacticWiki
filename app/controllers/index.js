
/**
 * Module dependencies.
 */

// var mongoose = require('mongoose')
// var Article = mongoose.model('Article')
// var utils = require('../../lib/utils')
// var extend = require('util')._extend

/**
 * List
 */

exports.index = function (req, res) {
    res.render('index', {
        title: 'Articles'
    });
};

exports.getPages = function (req, res) {
    var user = req.user;
    if (user) {
        res.json({});
    } else {
        res.status(401).json({status:'Not Authorized'});
    }
};

/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res) {
    req.session.returnTo = req.body.returnURL
    return res.status(200).send({status:'ok'});
};
