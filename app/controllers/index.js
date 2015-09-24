
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
      pageDBSearch,
      pageRequester,
  ], function (err, data) {
      if (err){
        log.log("Error", err);
        res.status(200).json(err);
      }else{
        res.json({
            results:[data],
            error: null
        });
      }

  });

};




var pageDBSearch = function(url, cb) {
  Site
    .findOne({'$or':[{ canonicalLink: url }, { queryLink: url }]})
    .exec(function(err, result){
        if (err){
          cb(err)
        } else if (result!==null) {
            console.log('db')
          cb(null, result);
        } else {
            console.log('parse')
          cb(null, url);
        }
    });
}


var pageRequester = function(input, cb) {
  if (typeof input === 'string'){
    var url = input;
    request
      .get(utils.URLParse(url))
      .set('Cookie', utils.getCookie(url))
      .end(function(err, response) {
        if (!err && response.statusCode == 200) {
          var data = extractor(response.text);
          data = _.assign(data, { 'queryLink': url, 'canonicalLink':url });
          var site = new Site(data);
          site.save(function(err){
            cb(null, site);
            if(err){log.log("Error", err)}
          });

        } else {
          cb(err);
        }
      });
    } else{
      var data = input;
      cb(null, data);
    }

}


/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res) {
    req.session.returnTo = req.body.returnURL
    return res.status(200).send({status:'ok'});
};
