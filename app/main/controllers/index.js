
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

exports.index = function (req, res){
    res.render('main/views/index', {
        title: 'Articles' 
    });
    
  // var page = (req.param('page') > 0 ? req.param('page') : 1) - 1;
  // var perPage = 30;
  // var options = {
  //   perPage: perPage,
  //   page: page
  // };

  // Article.list(options, function (err, articles) {
  //   if (err) return res.render('500');
  //   Article.count().exec(function (err, count) {
  //     res.render('articles/index', {
  //       title: 'Articles',
  //       articles: articles,
  //       page: page + 1,
  //       pages: Math.ceil(count / perPage)
  //     });
  //   });
  // });
};

/**
 * Updates the session return to variable for proper sendback after login.
 */
exports.returnTo = function (req, res){
    req.session.returnTo=req.body.returnURL
    return res.status(200).send({status:'ok'});
};