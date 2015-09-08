
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
    res.json({});
};

/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res) {
    req.session.returnTo = req.body.returnURL
    return res.status(200).send({status:'ok'});
};
