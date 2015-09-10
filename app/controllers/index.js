
/**
 * Module dependencies.
 */
var request = require('superagent');
var extractor = require('unfluff');
var utils = require('../../lib/utils')

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
var taco = 'http://www.nytimes.com/interactive/2014/09/10/style/tmagazine/redzepi-searches-for-the-perfect-taco.html'
var mc = 'http://www.ft.com/intl/cms/s/0/03775904-177c-11de-8c9d-0000779fd2ac.html#axzz3lGdIurQI'

exports.getPages = function (req, res) {
    var url = req.body.url;
    request
      .get(mc)
      .set('Cookie', utils.getCookie(url))
      .end(function(err, response) {
          if (!err && response.statusCode == 200) {
              var data = extractor(response.text);
              res.json({text:data, title:data.title});
          } else {
              res.json(err);
          }
      });

};

/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res) {
    req.session.returnTo = req.body.returnURL
    return res.status(200).send({status:'ok'});
};
