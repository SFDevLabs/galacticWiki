
/**
 * Module dependencies.
 */
var request = require('superagent');
var extractor = require('unfluff');
var utils = require('../../lib/utils')
var async = require('async');
var logentries = require('node-logentries');
var _ = require('lodash');

var log = logentries.logger({
  token:'8c1d9386-fa43-4a9a-9905-fc5c810e658c'
});

var mongoose = require('mongoose')
var Concept = mongoose.model('Concept')
var Connection = mongoose.model('Connection')
var Site = mongoose.model('Site')

// var utils = require('../../lib/utils')
// var extend = require('util')._extend

/**
 * List
 */

/**
Name: index
Describe: renders the main page
Parameters:
  - req: node request object
  - res: node response object
Return: there is no return on this function.
**/

exports.index = function (req, res) {
    res.render('index', {
        title: 'Articles'
    });
};

exports.getPages = function (req, res) {
  var url = utils.URLParse(req.query.q)
  if (!url || !utils.urlValidate(url)) { return res.status(200).json({error:'No Query or Valid URL', results:[]}) };
  async.waterfall([
      function(cb){cb(null,url)},
      pageRequester,
  ], function (err, data) {
      res.json({
          results:[data],
          error: null
      });
  });

};

var pageRequester = function(url, cb) {
  request
    .get(utils.URLParse(url))
    .set('Cookie', utils.getCookie(url))
    .end(function(err, response) {
      if (!err && response.statusCode == 200) {
        var data = extractor(response.text);
        var site = new Site(data);
        data = _.assign(data, { 'queryLink': url });
        site.save(function(err){
          if(err){log.log("Error", err)}
        });
        cb(null, data);
      } else {
          res.status(200).json(err);
      }
    });
}


/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res) {
    req.session.returnTo = req.body.returnURL
    return res.status(200).send({status:'ok'});
};
