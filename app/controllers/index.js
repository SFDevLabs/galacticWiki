
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
    request
      .get(utils.URLParse(url))
      .set('Cookie', utils.getCookie(url))
      .end(function(err, response) {
          if (!err && response.statusCode == 200) {
              var data = extractor(response.text);
              res.json({
                  results:[{text:response.text}],
                  error: null
              });
          } else {
              res.status(200).json(err);
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
